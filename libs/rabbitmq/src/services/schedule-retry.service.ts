import { Logger } from '@nestjs/common';
import { publishToQueue } from './message-publisher.service';

const logger = new Logger('Rabbitmq - schedule retry service');

export async function scheduleRetry<
  T extends { phoneNumber?: string; email?: string; retry_count?: number },
>(queue: string, message: T): Promise<void> {
  logger.warn(
    `Retry attempt ${message.retry_count} scheduled for queue ${queue}. ${
      message.phoneNumber || message.email
        ? `Message receiver: ${message.phoneNumber || message.email}`
        : 'No receiver info'
    }`,
  );

  await publishToQueue(process.env.RABBITMQ_URL, queue, message);
}
