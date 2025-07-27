import {
  SEND_WHATSAPP_MESSAGE,
  WHATSAPP_FORCE_RECONNECT,
  WHATSAPP_FORCE_RESTART,
  WHATSAPP_HEALTH_CHECK,
} from '@libs/whatsapp-client';
import { SendMessageDto } from '@libs/whatsapp-client/dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { WhatsappService } from './whatsapp.service';

@Controller()
export class WhatsappServiceController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @MessagePattern(SEND_WHATSAPP_MESSAGE)
  async handleSendMessage(
    @Payload() data: SendMessageDto & { retry_count?: number },
    context: RmqContext,
  ) {
    return this.whatsappService.sendMessageWithRetryMechanism(data);
  }

  @MessagePattern(WHATSAPP_HEALTH_CHECK)
  async healthCheck() {
    return this.whatsappService.healthCheck();
  }

  @MessagePattern(WHATSAPP_FORCE_RECONNECT)
  async forceReconnect() {
    return this.whatsappService.forceReconnect();
  }

  @MessagePattern(WHATSAPP_FORCE_RESTART)
  async forceRestart() {
    return this.whatsappService.forceRestart();
  }
}
