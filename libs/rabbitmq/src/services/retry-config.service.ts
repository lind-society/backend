import { Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

export async function setupRetryQueue(
  rabbitMqUrl: string,
  queueName: string,
  delayInMs: number = 3000,
) {
  const retryQueueName = `${queueName}_retry`;
  const logger = new Logger('RabbitMQ - Retry Setup');

  try {
    const connection = await amqp.connect(rabbitMqUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(retryQueueName, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '', // default exchange
        'x-dead-letter-routing-key': queueName, // retry back to original queue
        'x-message-ttl': delayInMs, // delay in milliseconds
      },
    });

    logger.log(`✅ Retry queue "${retryQueueName}" is ready`);
    await channel.close();
    await connection.close();
  } catch (error) {
    logger.error(`❌ Failed to setup retry queue: ${error.message}`);
  }
}
