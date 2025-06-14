import { Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

const logger = new Logger('Rabbitmq - message publisher service');

export async function publishToQueue<T extends object>(
  rabbitMqUrl: string,
  queue: string,
  message: T,
): Promise<void> {
  try {
    const connection = await amqp.connect(rabbitMqUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    logger.log(`published message to queue ${queue}`);
    await channel.close();
    await connection.close();
  } catch (error) {
    logger.error(`failed to publish to queue ${queue}: ${error.message}`);
    throw error;
  }
}
