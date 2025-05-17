import * as amqp from 'amqp-connection-manager';

export const rabbitmqProvider = {
  provide: 'RABBITMQ_CHANNEL',
  useFactory: async () => {
    const connection = amqp.connect(['amqp://rabbitmq']);
    
    const channel = connection.createChannel({
      json: true,
      setup: async (ch) => {
        await ch.assertExchange('order-created', 'fanout', { durable: false });
        await ch.assertQueue('inventory-service-queue', { durable: false });
        await ch.bindQueue('inventory-service-queue', 'order-created', '');
        await ch.assertExchange('inventory-updated', 'fanout', { durable: false });
        await ch.assertExchange('inventory-failed', 'fanout', { durable: false });
      }      
    });
    return channel;
  },
};
