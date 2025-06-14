import { MAIL_QUEUE } from '@libs/common/constants';
import { SendMailDto } from '@libs/mail-client/dto';
import { retryFailedMessage } from '@libs/rabbitmq/services';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendMailWithRetryMechanism(
    payload: SendMailDto & { retry_count?: number },
  ) {
    const result = await this.mailerService.sendMail({
      ...payload,
    });

    if (result.success) {
      return result;
    }

    return retryFailedMessage({
      queue: MAIL_QUEUE,
      payload,
      resultErrorMessage: result.error?.message,
      loggerContext: MailService.name,
    });
  }

  async sendMail(payload: SendMailDto) {
    const emailSend = await this.mailerService.sendMail({
      ...payload,
    });

    return emailSend;
  }
}
