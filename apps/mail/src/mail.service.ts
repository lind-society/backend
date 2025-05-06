import { SendMailDto } from '@libs/mail-client/dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendMail(payload: SendMailDto) {
    const emailSend = await this.mailerService.sendMail({
      ...payload,
    });

    return emailSend;
  }
}
