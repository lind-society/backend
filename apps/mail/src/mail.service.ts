import { MAIL_QUEUE } from '@libs/common/constants';
import { SendMailDto } from '@libs/mail-client/dto';
import { retryFailedMessage } from '@libs/rabbitmq/services';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}
  async sendMailWithRetryMechanism(
    payload: SendMailDto & { retry_count?: number },
  ) {
    const result = await this.mailerService.sendMail(payload);

    if (result?.messageId) {
      this.logger.log(`mail sent to ${payload.to} success`);
      return { success: true };
    }

    return retryFailedMessage({
      queue: MAIL_QUEUE,
      payload,
      resultErrorMessage: result?.error?.message || 'Unknown failure',
      loggerContext: MailService.name,
    });
  }

  async sendMail(payload: SendMailDto) {
    const emailSend = await this.mailerService.sendMail({
      ...payload,
    });

    return emailSend;
  }

  healthCheck() {
    return { status: 'ok' };
  }
}
