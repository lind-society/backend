import { MESSAGE_PATTERN, QUEUE } from '@libs/common/constants';
import { MessageHandlerService } from '@libs/rabbitmq/services/message-handler.service';
import { SendMessageDto } from '@libs/whatsapp-client/dto';
import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { WhatsappService } from './whatsapp.service';

@Controller()
export class WhatsappServiceController {
  private readonly logger = new Logger(WhatsappServiceController.name);

  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly messageHandler: MessageHandlerService,
  ) {}

  @MessagePattern(MESSAGE_PATTERN.WHATSAPP.SEND_MESSAGE)
  async handleSendMessage(
    @Payload() data: SendMessageDto,
    @Ctx() context: RmqContext,
  ) {
    try {
      this.logger.log(`Processing send_message: ${JSON.stringify(data)}`);

      // Process the message
      await this.whatsappService.sendMessage(data);

      // Acknowledge successful processing
      await this.messageHandler.ack(context);

      return { success: true };
    } catch (error) {
      this.logger.error(`Error processing message: ${error.message}`);

      // Retry mechanism with max 3 retries
      // Do NOT call ack here, retry will handle it
      await this.messageHandler.retry(context, QUEUE.WHATSAPP, error, 3);

      return { success: false, error: error.message };
    }
  }

  @MessagePattern(MESSAGE_PATTERN.WHATSAPP.HEALTH_CHECK)
  async healthCheck() {
    return this.whatsappService.healthCheck();
  }

  @MessagePattern(MESSAGE_PATTERN.WHATSAPP.FORCE_RECONNECT)
  async forceReconnect() {
    return this.whatsappService.forceReconnect();
  }
}
