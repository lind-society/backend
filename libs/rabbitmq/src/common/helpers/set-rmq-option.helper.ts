import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

export function setRmqOption(
  configService: ConfigService,
  queue: string,
  noAck = false,
): RmqOptions {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('rabbitMq.url')],
      queue,
      persistent: true,
      noAck,
      queueOptions: {
        durable: true,
      },
    },
  };
}
