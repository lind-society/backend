import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SendMailDto } from './dto';
import { MAIL_SERVICE, SEND_MAIL } from './message-pattern';

@Injectable()
export class MailClientService implements OnModuleInit {
  constructor(@Inject(MAIL_SERVICE) private readonly client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async sendMail(data: SendMailDto) {
    return await firstValueFrom(this.client.send(SEND_MAIL, data));
  }
}
