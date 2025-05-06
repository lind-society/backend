import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SendMailDto } from './dto';
import { MAIL_SERVICE, SEND_MAIL } from './message-pattern';

@Injectable()
export class MailClientService {
  constructor(@Inject(MAIL_SERVICE) private readonly client: ClientProxy) {}

  async sendMail(data: SendMailDto) {
    return await firstValueFrom(this.client.send(SEND_MAIL, data));
  }
}
