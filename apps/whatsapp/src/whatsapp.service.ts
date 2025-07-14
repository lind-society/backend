import { WHATSAPP_QUEUE } from '@libs/common/constants';
import { retryFailedMessage } from '@libs/rabbitmq/services';
import { SendMessageDto } from '@libs/whatsapp-client/dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { IWhatsappClient } from './interfaces';
import { MainProvider } from '@libs/common/enums';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    @Inject(MainProvider.Whatsapp)
    private readonly whatsappProvider: IWhatsappClient,
  ) {}

  async sendMessageWithRetryMechanism(
    payload: SendMessageDto & { retry_count?: number },
  ) {
    const result = await this.sendMessage(payload);

    if (result.success) {
      return result;
    }

    return retryFailedMessage({
      queue: WHATSAPP_QUEUE,
      payload,
      resultErrorMessage: result.error?.message,
      loggerContext: WhatsappService.name,
    });
  }

  async sendMessage(payload: SendMessageDto) {
    try {
      const chatId = this._convertPhoneNumberToChatId(payload.phoneNumber);

      // Check if client is connected
      if (!this.whatsappProvider.isConnected()) {
        this.logger.warn(
          'WhatsApp client is not connected. Cannot send message.',
        );
        return {
          success: false,
          error: {
            message: 'WhatsApp client is not connected',
            code: 'WHATSAPP_NOT_CONNECTED',
          },
        };
      }

      await this.whatsappProvider.sendMessage(chatId, payload.message);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp message: ${error.message}`);
      return {
        success: false,
        error: {
          message: error.message,
          code: 'WHATSAPP_ERROR',
        },
      };
    }
  }

  async healthCheck() {
    return {
      status: this.whatsappProvider.isConnected() ? 'ok' : 'unavailable',
      timestamp: new Date().toISOString(),
    };
  }

  async forceReconnect() {
    try {
      await this.whatsappProvider.forceReconnect();
      return { status: 'reconnecting' };
    } catch (error) {
      this.logger.error(`Failed to force reconnect: ${error.message}`);
      return {
        status: 'error',
        error: error.message,
      };
    }
  }

  private _convertPhoneNumberToChatId(phoneNumber: string): string {
    return `${phoneNumber}@c.us`;
  }
}
