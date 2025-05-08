import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SendMessageDto } from './dto';
import { SEND_WHATSAPP_MESSAGE, WHATSAPP_SERVICE } from './message-pattern';

@Injectable()
export class WhatsappClientService implements OnModuleInit {
  constructor(@Inject(WHATSAPP_SERVICE) private readonly client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }
  
  async sendMessage(data: SendMessageDto) {
    return await firstValueFrom(this.client.send(SEND_WHATSAPP_MESSAGE, data));
  }
}
