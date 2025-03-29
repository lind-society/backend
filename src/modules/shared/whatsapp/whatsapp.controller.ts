import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { SendMessageDto } from './dto';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('send-message')
  async sendMessage(@Body() payload: SendMessageDto) {
    await this.whatsappService.sendMessage(payload);

    return {
      status: 'success',
      message: `message sent to ${payload.phoneNumber}`,
      code: HttpStatus.OK,
    };
  }
}
