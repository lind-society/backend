import { RmqOptions, Transport } from '@nestjs/microservices';
import { ExchangeConfig, QueueConfig } from '../interfaces';
export { ExchangeConfig, QueueConfig } from '../interfaces';

export function getClientConfig(
  rabbitMqUrl: string,
  queueName: string,
): RmqOptions {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: queueName,
      queueOptions: {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': `${queueName}_dlx`,
          'x-dead-letter-routing-key': `${queueName}_failed`,
        },
      },
      prefetchCount: 1,
      persistent: true,
      socketOptions: {
        heartbeatIntervalInSeconds: 60,
        reconnectTimeInSeconds: 5,
      },
    },
  };
}

export function getRabbitMqRetryQueueConfig(
  originalQueueName: string,
  ttl: number = 30000,
): QueueConfig {
  return {
    name: `${originalQueueName}_retry`,
    durable: true,
    arguments: {
      'x-message-ttl': ttl,
      'x-dead-letter-exchange': '',
      'x-dead-letter-routing-key': originalQueueName,
    },
  };
}

export function getDeadLetterConfig(queueName: string): {
  exchange: ExchangeConfig;
  queue: QueueConfig;
} {
  return {
    exchange: {
      name: `${queueName}_dlx`,
      type: 'direct',
      durable: true,
    },
    queue: {
      name: `${queueName}_dead_letter`,
      durable: true,
    },
  };
}
