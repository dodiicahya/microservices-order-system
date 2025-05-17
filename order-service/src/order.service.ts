import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './app.entity';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @Inject('RABBITMQ_CHANNEL') private readonly channel: ChannelWrapper,
  ) {}

  async onModuleInit() {
    await this.channel.waitForConnect();

    await this.channel.addSetup(async (ch) => {
      await ch.consume('order-service-queue', async (msg) => {
        if (!msg) return;
        const update = JSON.parse(msg.content.toString());
        console.log('📦 Inventory update received in order service:', update);
        const { id } = update.data;
        const order = await this.orderRepository.findOne({
          where: { id },
        });

        let isAvailable = update.type === 'inventory.updated';
        if (order && order.status === 'pending') {
          order.status = isAvailable ? 'processed' : 'failed';
          await this.orderRepository.save(order);
        }
        
        console.log(`✅ Order successfully processed for user ${update.data.userId} (status: ${update.status})`);
        ch.ack(msg);
      });
    });
    
    console.log('✅ Order service is listening for inventory events.');

  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    await this.orderRepository.save(order);

    const payload = Buffer.from(JSON.stringify({
      id:order.id,
      userId: order.userId,
      itemId: order.itemId,
      quantity: order.quantity,
    }));
    
    await this.channel.publish('order-created', '', payload);

    return order;
  }
}

