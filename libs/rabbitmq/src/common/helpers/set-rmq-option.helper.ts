import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { ExtendedRmqOptions } from '../interfaces';

export function setRmqOption(
  configService: ConfigService,
  queue: string,
  isClient = false,
): RmqOptions {
  const options = {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('rabbitMq.url')],
      queue,
      persistent: true,
      noAck: false,
      prefetchCount: 1,
      queueOptions: {
        durable: true,
        autoDelete: false,
        arguments: {
          'x-dead-letter-exchange': `${queue}_dlx`,
          'x-dead-letter-routing-key': `${queue}_failed`,
        },
      },
      socketOptions: {
        heartbeatIntervalInSeconds: 60,
        reconnectTimeInSeconds: 5,
      },
    },
  } as ExtendedRmqOptions;

  if (isClient) {
    options.replyQueue = {
      noAck: true,
      durable: false,
      exclusive: true,
      autoDelete: true,
    };
  }

  return options as RmqOptions;
}
