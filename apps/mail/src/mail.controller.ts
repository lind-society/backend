import { MESSAGE_PATTERN } from '@libs/common/constants';
import { SendMailDto } from '@libs/mail-client/dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern(MESSAGE_PATTERN.MAIL.SEND_MAIL)
  async handleSendEmail(@Payload() payload: SendMailDto) {
    return this.mailService.sendMail(payload);
  }
}
