import { MailClientService } from '@libs/mail-client';
import { SendMailDto } from '@libs/mail-client/dto';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';

@Controller('mail')
export class MailGatewayController {
  private readonly logger = new Logger(MailGatewayController.name);

  constructor(private mailClientService: MailClientService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async sendMessage(@Body() payload: SendMailDto): Promise<void> {
    this.logger.log(
      `[${payload?.source ?? 'external service'}] sending mail to ${payload?.to ?? 'unspecified receiver'}`,
    );

    await this.mailClientService.sendMail(payload);

    this.logger.log(
      `[${payload?.source ?? 'external service'}] mail sent to ${payload?.to ?? 'unspecified receiver'}`,
    );
  }
}
