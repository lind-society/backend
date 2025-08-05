import { MAIL_HEALTH_CHECK, SEND_MAIL } from '@libs/mail-client/constant';
import { SendMailDto } from '@libs/mail-client/dto';
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
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

  @MessagePattern('mail_queue_retry')
  handleRetry(@Payload() payload: SendMailDto & { retry_count?: number }) {
    return this.mailService.sendMailWithRetryMechanism(payload);
  }

  @MessagePattern(MAIL_HEALTH_CHECK)
  async healthCheck() {
    return { status: 'ok' };
  }
}
