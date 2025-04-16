import { SEND_WHATSAPP_MESSAGE } from '@libs/whatsapp-client';
import { SendMessageDto } from '@libs/whatsapp-client/dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WhatsappService } from './whatsapp.service';

@Controller()
export class WhatsappServiceController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @MessagePattern(SEND_WHATSAPP_MESSAGE)
  async handleSendMessage(@Payload() data: SendMessageDto) {
    return this.whatsappService.sendMessage(data);
  }
}
