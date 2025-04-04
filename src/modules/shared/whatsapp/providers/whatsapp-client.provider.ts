import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'whatsapp-web.js';
import { IWhatsappClient } from '../interfaces';

@Injectable()
export class WhatsappClientProvider implements IWhatsappClient {
  constructor(
    @Inject('MAIN_WHATSAPP_CLIENT') private readonly client: Client,
  ) {}

  async onModuleInit() {
    console.log('Initializing WhatsApp Client...');

    await this.client.initialize();
  }

  async onModuleDestroy() {
    console.log('Destroying WhatsApp Client...');

    await this.client.destroy();
  }

  async sendMessage(chatId: string, message: string): Promise<void> {
    await this.client.sendMessage(chatId, message);
  }
}
