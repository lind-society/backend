import { SendMessageDto } from '@libs/whatsapp-client/dto';
import { Inject, Injectable } from '@nestjs/common';
import { IWhatsappClient } from './interfaces';

@Injectable()
export class WhatsappService {
  constructor(
    @Inject('WHATSAPP_PROVIDER')
    private readonly whatsappProvider: IWhatsappClient,
  ) {}
  async sendMessage(payload: SendMessageDto) {
    const chatId = this._convertPhoneNumberToChatId(payload.phoneNumber);

    await this.whatsappProvider.sendMessage(chatId, payload.message);

    return { success: true };
  }

  private _convertPhoneNumberToChatId(phoneNumber: string): string {
    return `${phoneNumber}@c.us`;
  }
}
