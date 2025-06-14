import { Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

export async function setupDeadLetterQueue(
  rabbitMqUrl: string,
  queueName: string,
) {
  const logger = new Logger(
    'RabbitMq Lib - Dead Letter Handler - setupDeadLetterQueue',
  );

  const dlxName = `${queueName}_dlx`;
  const dlqName = `${queueName}_failed`;

  try {
    const connection = await amqp.connect(rabbitMqUrl);
    const channel = await connection.createChannel();

    // Declare DLX (dead-letter exchange)
    await channel.assertExchange(dlxName, 'direct', { durable: true });

    // Declare DLQ (dead-letter queue)
    await channel.assertQueue(dlqName, {
      durable: true,
    });

    // Bind DLQ to DLX using routing key = DLQ name
    await channel.bindQueue(dlqName, dlxName, dlqName);

    logger.log(
      `✅ DLX "${dlxName}" and DLQ "${dlqName}" are ready for "${queueName}"`,
    );

    await channel.close();
    await connection.close();
  } catch (error) {
    this.logger.error(
      `❌ Failed to setup DLX/DLQ for "${queueName}": ${error.message}`,
    );
  }
}
