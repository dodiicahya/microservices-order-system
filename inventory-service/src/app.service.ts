import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ChannelWrapper } from 'amqp-connection-manager';
import { Inventory } from './app.entity'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('RABBITMQ_CHANNEL') private readonly channel: ChannelWrapper,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,

  ) {}

  async onModuleInit() {
    await this.channel.waitForConnect();

    await this.channel.addSetup(async (ch) => {
      await ch.consume('inventory-service-queue', async (msg) => {
        if (msg !== null) {
          const raw = msg.content;

          // 👇 Detect and unwrap Buffer object manually
          let contentStr = raw.toString();
          let parsed;

          try {
            parsed = JSON.parse(contentStr);

            // Check for accidental Buffer-like object
            if (parsed.type === 'Buffer' && Array.isArray(parsed.data)) {
              const realBuffer = Buffer.from(parsed.data);
              contentStr = realBuffer.toString();
              parsed = JSON.parse(contentStr); // 👈 Re-parse real JSON
            }
          } catch (e) {
            console.error('❌ Failed to parse message:', e);
            ch.nack(msg, false, false);
            return;
          }
          
          const { id,userId, itemId, quantity } = parsed;

          console.log('📦 Order received in inventory service:', parsed);
                
          const inventory = await this.inventoryRepository.findOne({
            where: { id: itemId },
          });
      
          let isAvailable = false;
          
          if (inventory && inventory.quantity >= quantity) {
            inventory.quantity -= quantity;
            await this.inventoryRepository.save(inventory);
            isAvailable = true;
          }
      
          const event = isAvailable
            ? { type: 'inventory.updated', data: {id, userId, itemId, quantity },status: 'available' }
            : { type: 'inventory.failed', data: { id, userId, itemId, quantity },status: 'unavailable' };
      
          console.log(
            `✅ Order processed for user ${userId} (status: ${isAvailable ? 'available' : 'unavailable'})`,
          );
      
          await ch.publish(
            isAvailable ? 'inventory-updated' : 'inventory-failed',
            '',
            Buffer.from(JSON.stringify(event)),
          );
      
          ch.ack(msg);
        }
      });
      
    });

    console.log('✅ Inventory service is listening for order-created events.');
  }
}
