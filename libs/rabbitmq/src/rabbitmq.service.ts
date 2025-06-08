import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions } from '@nestjs/microservices';
import { Channel } from 'amqplib';
import { setRmqOption } from './common/helpers';

@Injectable()
export class RabbitMqService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: string, isClient: boolean): RmqOptions {
    return setRmqOption(this.configService, queue, isClient);
  }

  async setupDeadLetterQueue(channel: Channel, queue: string) {
    const deadLetterExchange = `${queue}_dlx`;
    const deadLetterQueue = `${queue}_failed`;
    const retryQueue = `${queue}_retry`;

    await channel.assertExchange(deadLetterExchange, 'direct', {
      durable: true,
    });

    await channel.assertQueue(deadLetterQueue, {
      durable: true,
      arguments: {
        'x-message-ttl': 1000 * 60 * 60 * 24, // 24 hours retention
      },
    });

    await channel.bindQueue(
      deadLetterQueue,
      deadLetterExchange,
      `${queue}_failed`,
    );

    await channel.assertQueue(retryQueue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': queue,
        'x-message-ttl': 1000 * 60, // 1 minute delay before retry
      },
    });

    return {
      deadLetterExchange,
      deadLetterQueue,
      retryQueue,
    };
  }

  getUrl(): string {
    return this.configService.get<string>('rabbitMq.url');
  }

  getQueueName(queue: string) {
    return queue;
  }
}
