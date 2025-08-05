import { WhatsappClientService } from '@libs/whatsapp-client';
import { SendMessageDto } from '@libs/whatsapp-client/dto';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';

@Controller('whatsapp')
export class WhatsappGatewayController {
  private readonly logger = new Logger(WhatsappGatewayController.name);

  constructor(private whatsappClientService: WhatsappClientService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async sendMessage(@Body() payload: SendMessageDto): Promise<void> {
    this.logger.log(
      `[${payload?.source ?? 'external service'}] sending message to ${payload?.phoneNumber ?? 'unspecified receiver'}`,
    );

    await this.whatsappClientService.sendMessage(payload);

    this.logger.log(
      `[${payload?.source ?? 'external service'}] message sent to ${payload?.phoneNumber ?? 'unspecified receiver'}`,
    );
  }
}
