import { MESSAGE_PATTERN, SERVICE } from '@libs/common/constants';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SendMailDto } from './dto';

@Injectable()
export class MailClientService implements OnModuleInit {
  constructor(@Inject(SERVICE.MAIL) private readonly client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async sendMail(data: SendMailDto) {
    return await firstValueFrom(
      this.client.send(MESSAGE_PATTERN.MAIL.SEND_MAIL, data),
    );
  }
}
