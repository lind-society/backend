import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions } from '@nestjs/microservices';
import { setRmqOption } from './common/helpers';

@Injectable()
export class RabbitMqService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: string, noAck = false): RmqOptions {
    return setRmqOption(this.configService, queue);
  }

  private getUrl(): string {
    return this.configService.get<string>('rabbitMq.url');
  }

  private getQueueName(queue: string) {
    return queue;
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
