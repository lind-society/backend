import { RmqRecordOptions } from '@nestjs/microservices';

export interface ExtendedRmqOptions extends RmqRecordOptions {
  replyQueue?: {
    noAck: boolean;
    durable: boolean;
    exclusive: boolean;
    autoDelete: boolean;
  };
}
