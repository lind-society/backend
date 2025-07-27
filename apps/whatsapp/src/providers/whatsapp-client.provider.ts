import { WhatsappClientProviders } from '@libs/common/enums';
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

  constructor(
    @Inject(WhatsappClientProviders.Main) private readonly client: Client,
  ) {
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

      // Check if client is already initialized
      if (this.client.pupPage) {
        this.logger.log('Client already has a page, destroying first...');
        try {
          await this.client.destroy();
        } catch (destroyError) {
          this.logger.warn(
            `Error destroying existing client: ${destroyError.message}`,
          );
        }
      }

      await this.client.initialize();
    } catch (error) {
      this.isReady = false;
      this.logger.error(
        `Failed to initialize WhatsApp client: ${error.message}`,
      );

      // If it's a browser launch error, we need to handle it differently
      if (error.message.includes('Failed to launch the browser process')) {
        this.logger.error(
          'Browser process failed to launch. This may require manual intervention.',
        );
        // Try to force restart the client
        await this.forceRestart();
        return;
      }

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

    // Additional check for client state
    if (!this.client) {
      this.logger.error('WhatsApp client is null or undefined');
      this.isReady = false;
      throw new Error('WhatsApp client is null or undefined');
    }

    // Check if the client has a valid page
    if (!this.client.pupPage) {
      this.logger.error(
        'WhatsApp client is not properly initialized (no page)',
      );
      this.isReady = false;
      this.scheduleReconnect();
      throw new Error('WhatsApp client is not properly initialized (no page)');
    }

    // Validate inputs
    if (!chatId || typeof chatId !== 'string') {
      throw new Error(`Invalid chatId: ${chatId}`);
    }

    if (!message || typeof message !== 'string') {
      throw new Error(`Invalid message: ${message}`);
    }

    try {
      this.logger.log(`Attempting to send message to ${chatId}`);

      // Check browser health before sending
      const isHealthy = await this.isBrowserHealthy();
      if (!isHealthy) {
        throw new Error('Browser is not healthy, cannot send message');
      }

      // Check if the chat exists and is valid
      const chat = await this.client.getChatById(chatId);
      if (!chat) {
        throw new Error(`Chat not found for ID: ${chatId}`);
      }

      // Send the message
      const result = await this.client.sendMessage(chatId, message);

      if (!result) {
        throw new Error('Message send returned undefined result');
      }

      this.logger.log(`Message sent successfully to ${chatId}`);
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp message: ${error.message}`);
      this.logger.error(
        `ChatId: ${chatId}, Message length: ${message?.length || 0}`,
      );

      // Check if we need to reconnect based on specific errors
      if (
        error.message.includes('not connected') ||
        error.message.includes('browser') ||
        error.message.includes('session') ||
        error.message.includes('WidFactory') ||
        error.message.includes('serialize') ||
        error.message.includes('getMessageModel')
      ) {
        this.logger.warn(
          'Detected connection-related error, scheduling reconnect',
        );
        this.isReady = false;
        this.scheduleReconnect();
      }

      throw error;
    }
  }

  isConnected(): boolean {
    return this.isReady && !!this.client && !!this.client.pupPage;
  }

  private async isBrowserHealthy(): Promise<boolean> {
    try {
      if (!this.client || !this.client.pupPage) {
        return false;
      }

      // Try to get page title to check if browser is responsive
      const title = await this.client.pupPage.title();
      return !!title;
    } catch (error) {
      this.logger.warn(`Browser health check failed: ${error.message}`);
      return false;
    }
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

  async forceRestart(): Promise<void> {
    this.logger.log(
      'Force restart requested - this will create a new client instance',
    );
    this.connectionRetries = 0;
    this.isReady = false;

    try {
      // Destroy the current client
      if (this.client) {
        await this.client.destroy();
      }
    } catch (e) {
      this.logger.error(
        `Error destroying client during force restart: ${e.message}`,
      );
    }

    // Note: In a real implementation, you might want to emit an event
    // to the module to recreate the client instance
    this.logger.warn('Client destroyed. Manual restart may be required.');
  }
}
