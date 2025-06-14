import { SEND_MAIL } from '@libs/mail-client';
import { SendMailDto } from '@libs/mail-client/dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern(SEND_MAIL)
  async handleSendEmail(
    @Payload() payload: SendMailDto & { retry_count?: number },
  ) {
    return this.mailService.sendMailWithRetryMechanism(payload);
  }
}
