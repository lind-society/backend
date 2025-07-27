import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import {
  SEND_WHATSAPP_MESSAGE,
  WHATSAPP_FORCE_RECONNECT,
  WHATSAPP_HEALTH_CHECK,
  WHATSAPP_SERVICE,
} from './constant';
import { SendMessageDto } from './dto';

@Injectable()
export class WhatsappClientService implements OnModuleInit {
  private firstConnectAttempt = true;
  private isConnected = false;
  private readonly logger = new Logger(WhatsappClientService.name);
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor(@Inject(WHATSAPP_SERVICE) private readonly client: ClientProxy) {}

  async onModuleInit() {
    try {
      await this.client.connect();

      const connected = await this.checkConnection();

      if (connected) {
        this.isConnected = true;
        this.logger.log('Successfully connected to whatsapp microservice');
      } else {
        this.logger.log('Failed connecting to whatsapp microservice');
      }

      this.firstConnectAttempt = false;

      // Start periodic health checks
      this.startHealthChecks();
    } catch (error) {
      this.logger.error(
        'Failed to connect to WhatsApp service:',
        error.message,
      );
      this.isConnected = false;
    }
  }

  private startHealthChecks() {
    // Clear any existing interval
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    // Check health every 30 seconds
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.checkConnection();
      } catch (error) {
        this.logger.error('Health check failed:', error.message);
      }
    }, 3000);
  }

  async sendMessage(data: SendMessageDto) {
    if (!this.isConnected) {
      this.logger.warn(
        'WhatsApp service is not connected. Checking connection before sending...',
      );

      // Try to reconnect before giving up
      const isNowConnected = await this.checkConnection();

      if (!isNowConnected) {
        throw new Error('WhatsApp service unavailable');
      }
    }

    // Send in background
    firstValueFrom(
      this.client.send(SEND_WHATSAPP_MESSAGE, data).pipe(
        timeout(15000),
        catchError((error) => {
          this.logger.error('Error sending WhatsApp message:', error.message);
          if (this.isConnectionError(error)) {
            this.isConnected = false;
          }
          throw error;
        }),
      ),
    )
      .then(() => {
        this.logger.log('✅ WhatsApp message sent (background)');
      })
      .catch((err) => {
        this.logger.warn(
          '❌ WhatsApp message failed in background',
          err.message,
        );
        // Optionally schedule a manual retry here
      });
  }

  // Helper method to check if an error is connection-related
  private isConnectionError(error: any): boolean {
    if (!error) return false;

    const errorMessage = error.message || '';
    return (
      errorMessage.includes('timeout') ||
      errorMessage.includes('unavailable') ||
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('not ready') ||
      errorMessage.includes('not connected')
    );
  }

  // Helper method to check service status
  async checkConnection(): Promise<boolean> {
    try {
      const healthResult = await firstValueFrom(
        this.client.send(WHATSAPP_HEALTH_CHECK, {}).pipe(
          timeout(100),
          catchError((error) => {
            this.logger.error('Health check failed:', error.message);
            throw error;
          }),
        ),
      );

      if (!this.isConnected && !this.firstConnectAttempt) {
        this.logger.log('Successfully reconnected to whatsapp microservice');
      }

      this.isConnected = healthResult.status === 'ok';
      return this.isConnected;
    } catch (error) {
      this.isConnected = false;
      return false;
    }
  }

  // Method to force reconnect of WhatsApp service
  async forceReconnect(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.client.send(WHATSAPP_FORCE_RECONNECT, {}).pipe(timeout(3000)),
      );

      // Wait a bit for reconnection to take effect
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Check if it worked
      return await this.checkConnection();
    } catch (error) {
      this.logger.error('Force reconnect failed:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  // Clean up on module destroy
  async onModuleDestroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }
}
