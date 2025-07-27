import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { ExchangeConfig, QueueConfig } from './interfaces';
export { ExchangeConfig, QueueConfig } from './interfaces';

@Injectable()
export class RabbitMqService {
  private readonly defaultRabbitMQUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.defaultRabbitMQUrl = this.configService.get<string>('rabbitMq.url');
  }

  getServiceConfig(
    queueName: string,
    options?: Partial<QueueConfig>,
  ): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.defaultRabbitMQUrl],
        queue: queueName,
        queueOptions: {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': `${queueName}_dlx`,
            'x-dead-letter-routing-key': `${queueName}_failed`,
          },
          ...options,
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

  getClientConfig(queueName: string): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.defaultRabbitMQUrl],
        queue: queueName,
        queueOptions: {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': `${queueName}_dlx`,
            'x-dead-letter-routing-key': `${queueName}_failed`,
          },
        },
        persistent: true,
        socketOptions: {
          heartbeatIntervalInSeconds: 60,
          reconnectTimeInSeconds: 5,
        },
      },
    };
  }

  getRetryQueueConfig(
    originalQueueName: string,
    ttl: number = 3000,
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

  getDeadLetterConfig(queueName: string): {
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
}
