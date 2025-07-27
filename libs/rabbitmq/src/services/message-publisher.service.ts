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

    // Check if this is a retry queue and handle it accordingly
    if (queue.endsWith('_retry')) {
      const originalQueue = queue.replace('_retry', '');
      await channel.assertQueue(queue, {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': '',
          'x-dead-letter-routing-key': originalQueue,
          'x-message-ttl': 3000, // 3 seconds delay
        },
      });
    } else {
      await channel.assertQueue(queue, { durable: true });
    }

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
