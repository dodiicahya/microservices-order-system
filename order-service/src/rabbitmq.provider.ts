import * as amqp from 'amqp-connection-manager';

export const rabbitmqProvider = {
  provide: 'RABBITMQ_CHANNEL',
  useFactory: async () => {
    const connection = amqp.connect(['amqp://rabbitmq']);
    const channel = connection.createChannel({
      json: true,
      setup: async (ch) => {
        await ch.assertExchange('order-created', 'fanout', { durable: false });
        await ch.assertExchange('inventory-updated', 'fanout', { durable: false });
        await ch.assertExchange('inventory-failed', 'fanout', { durable: false });
        await ch.assertQueue('order-service-queue', { durable: false });
        await ch.bindQueue('order-service-queue', 'inventory-updated', '');
        await ch.bindQueue('order-service-queue', 'inventory-failed', '');


      },
    });
    return channel;
  },
};
