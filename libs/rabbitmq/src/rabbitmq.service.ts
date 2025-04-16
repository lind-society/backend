import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RabbitMqService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: string): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('rabbitMq.uri')],
        queue: this.configService.get<string>(`rabbitMq.queue.${queue}`),
        persistent: true,
        queueOptions: {
          durable: true,
        },
      },
    };
  }
}
