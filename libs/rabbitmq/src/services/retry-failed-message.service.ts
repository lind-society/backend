// libs/rabbitmq/src/utils/retry-helper.ts
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { scheduleRetry } from './schedule-retry.service';

interface RetryOptions<T> {
  queue: string;
  payload: T & { retry_count?: number };
  resultErrorMessage?: string;
  loggerContext?: string;
  maxRetry?: number;
  delayMs?: number;
}

export async function retryFailedMessage<T extends { retry_count?: number }>(
  options: RetryOptions<T>,
): Promise<{
  success: false;
  retrying: true;
  retryAttempt: number;
}> {
  const {
    queue,
    payload,
    resultErrorMessage = 'Unhandled service error',
    loggerContext = 'RetryHelper',
    maxRetry = 3,
    delayMs = 1000,
  } = options;

  const retryCount = payload.retry_count ?? 0;
  const logger = new Logger(loggerContext);

  if (retryCount >= maxRetry) {
    logger.error(
      `❌ Max retries reached (${retryCount}) for ${
        payload['phoneNumber'] || payload['email'] || 'unknown target'
      }. Sending to DLQ.`,
    );

    throw new InternalServerErrorException(resultErrorMessage);
  }

  const nextAttempt = retryCount + 1;
  const retryQueueName = `${queue}_retry`;

  await new Promise((res) => setTimeout(res, delayMs));

  await scheduleRetry(retryQueueName, {
    ...payload,
    retry_count: nextAttempt,
  });

  return {
    success: false,
    retrying: true,
    retryAttempt: nextAttempt,
  };
}
