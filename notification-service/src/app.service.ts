import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(@Inject('RABBITMQ_CHANNEL') private readonly channel: ChannelWrapper) {}

  async onModuleInit() {
    await this.channel.waitForConnect();

    await this.channel.addSetup(async (ch) => {
      await ch.consume('notification-service-queue', async (msg) => {
        if (!msg) return;
        const update = JSON.parse(msg.content.toString());
        console.log('📦 Inventory update received in notification service:', update);
        console.log(`✅ Order successfully processed for user ${update.data.userId} (status: ${update.status})`);
        ch.ack(msg);
      });
    });
    
    console.log('✅ Notification service is listening for inventory events.');

  }
}
