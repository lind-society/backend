import { Inject, Injectable, Logger } from '@nestjs/common';
import * as qrcode from 'qrcode-terminal';
import { Client } from 'whatsapp-web.js';
import { IWhatsappClient } from '../interfaces';

@Injectable()
export class WhatsappClientProvider implements IWhatsappClient {
  private readonly logger = new Logger(WhatsappClientProvider.name);
  private isReady = false;
  private connectionRetries = 0;
  private readonly maxRetries = 5;
  private readonly retryDelay = 10000; // 10.000 ms = 10 s
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(@Inject('MAIN_WHATSAPP_CLIENT') private readonly client: Client) {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.client.on('qr', (qr) => {
      this.logger.log('QR Code received. Scan to authenticate:');
      qrcode.generate(qr, { small: true });
    });

    // Ready event
    this.client.on('ready', () => {
      this.isReady = true;
      this.connectionRetries = 0;
      this.logger.log('WhatsApp Client is ready!');
    });

    // Authentication failure
    this.client.on('auth_failure', (msg) => {
      this.isReady = false;
      this.logger.error(`Authentication failed: ${msg}`);
      this.scheduleReconnect();
    });

    // Disconnected event
    this.client.on('disconnected', (reason) => {
      this.isReady = false;
      this.logger.warn(`WhatsApp client disconnected: ${reason}`);
      this.scheduleReconnect();
    });

    // Error event
    this.client.on('error', (error) => {
      this.logger.error(`WhatsApp client error: ${error.message}`);

      // Check if error is related to the WidFactory issue
      if (error.message && error.message.includes('WidFactory')) {
        this.logger.warn(
          'Detected WidFactory error - this may require a fresh session',
        );
        this.handleWidFactoryError();
      }
    });
  }

  private handleWidFactoryError() {
    try {
      // Clear the session and force a new QR code
      if (this.client) {
        this.client
          .destroy()
          .catch((e) =>
            this.logger.error(`Error destroying client: ${e.message}`),
          );
      }

      // Small delay before reinitializing
      setTimeout(() => {
        this.logger.log('Reinitializing client after WidFactory error');
        this.initialize();
      }, 2000);
    } catch (error) {
      this.logger.error(`Failed to handle WidFactory error: ${error.message}`);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    // Clear any existing reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.connectionRetries++;

    if (this.connectionRetries <= this.maxRetries) {
      const delay = this.retryDelay * Math.min(this.connectionRetries, 3); // Exponential backoff up to 3x
      this.logger.log(
        `Scheduling reconnection attempt ${this.connectionRetries}/${this.maxRetries} in ${delay / 1000} seconds`,
      );

      this.reconnectTimer = setTimeout(() => {
        this.logger.log('Attempting to reconnect WhatsApp client...');
        this.initialize();
      }, delay);
    } else {
      this.logger.error(
        `Maximum reconnection attempts (${this.maxRetries}) reached. Manual intervention required.`,
      );
      // Here you could trigger an alert or notify admins
    }
  }

  async onModuleInit() {
    await this.initialize();
  }

  async initialize() {
    try {
      this.logger.log('Initializing WhatsApp connection...');
      await this.client.initialize();
    } catch (error) {
      this.isReady = false;
      this.logger.error(
        `Failed to initialize WhatsApp client: ${error.message}`,
      );
      this.scheduleReconnect();
    }
  }

  async onModuleDestroy() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    try {
      this.logger.log('Destroying WhatsApp Client...');
      await this.client.destroy();
    } catch (error) {
      this.logger.error(`Error during client shutdown: ${error.message}`);
    }
  }

  async sendMessage(chatId: string, message: string): Promise<void> {
    if (!this.isReady) {
      throw new Error('WhatsApp client is not ready');
    }

    try {
      await this.client.sendMessage(chatId, message);
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp message: ${error.message}`);

      // Check if we need to reconnect based on specific errors
      if (
        error.message.includes('not connected') ||
        error.message.includes('browser') ||
        error.message.includes('session') ||
        error.message.includes('WidFactory')
      ) {
        this.isReady = false;
        this.scheduleReconnect();
      }

      throw error;
    }
  }

  isConnected(): boolean {
    return this.isReady;
  }

  async forceReconnect(): Promise<void> {
    this.logger.log('Force reconnect requested');
    this.connectionRetries = 0;

    try {
      await this.client.destroy();
    } catch (e) {
      this.logger.error(
        `Error destroying client during force reconnect: ${e.message}`,
      );
    }

    // Small delay before reinitializing
    setTimeout(() => {
      this.initialize();
    }, 1000);
  }
}
