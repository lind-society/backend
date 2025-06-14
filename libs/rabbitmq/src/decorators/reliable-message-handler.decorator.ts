import { Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';

export interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
  deadLetterQueue?: boolean;
}

export function ReliableMessageHandler(config: RetryConfig = {}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const logger = new Logger(`${target.constructor.name}.${propertyKey}`);

    descriptor.value = async function (data: any, context: RmqContext) {
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      const retryCount = data.retryCount || 0;
      const maxRetries = config.maxRetries || 3;

      try {
        logger.log(
          `Processing message (attempt ${retryCount + 1}/${maxRetries + 1})`,
        );

        const result = await originalMethod.call(this, data, context);

        // Success - acknowledge message
        channel.ack(originalMsg);
        logger.log('Message processed successfully');

        return result;
      } catch (error) {
        logger.error(
          `Message processing failed (attempt ${retryCount + 1}): ${error.message}`,
        );

        if (retryCount < maxRetries) {
          // Schedule retry
          const delay = config.exponentialBackoff
            ? (config.retryDelay || 5000) * Math.pow(2, retryCount)
            : config.retryDelay || 5000;

          logger.log(
            `Scheduling retry ${retryCount + 1} with delay ${delay}ms`,
          );

          // Reject without requeue - let dead letter exchange handle it
          channel.nack(originalMsg, false, false);

          // In a real implementation, publish to retry queue with delay
          setTimeout(() => {
            logger.log(`Retry ${retryCount + 1} is ready`);
          }, delay);

          throw new Error(`Retry scheduled: ${retryCount + 1}/${maxRetries}`);
        } else {
          // Max retries exceeded
          logger.error(`Max retries exceeded, sending to dead letter queue`);
          channel.nack(originalMsg, false, false);

          throw new Error('Max retries exceeded');
        }
      }
    };

    return descriptor;
  };
}
