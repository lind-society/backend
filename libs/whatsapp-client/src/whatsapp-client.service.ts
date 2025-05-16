import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { SendMessageDto } from './dto';
import {
  SEND_WHATSAPP_MESSAGE,
  WHATSAPP_FORCE_RECONNECT,
  WHATSAPP_HEALTH_CHECK,
  WHATSAPP_SERVICE,
} from './message-pattern';

@Injectable()
export class WhatsappClientService implements OnModuleInit {
  private isConnected = false;
  private readonly logger = new Logger(WhatsappClientService.name);
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor(@Inject(WHATSAPP_SERVICE) private readonly client: ClientProxy) {}

  async onModuleInit() {
    try {
      await this.client.connect();
      this.isConnected = true;

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
    }, 30000);
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

    try {
      return await firstValueFrom(
        this.client.send(SEND_WHATSAPP_MESSAGE, data).pipe(
          timeout(5000), // 5-second timeout
          catchError((error) => {
            this.logger.error('Error sending WhatsApp message:', error.message);
            // If error indicates connection issue, mark service as disconnected
            if (this.isConnectionError(error)) {
              this.isConnected = false;
            }
            throw error;
          }),
        ),
      );
    } catch (error) {
      // If this is a WhatsApp-specific error (not connection-related),
      // we can still consider the service connected
      if (!this.isConnectionError(error)) {
        this.logger.warn(`WhatsApp specific error: ${error.message}`);
      }
      throw error;
    }
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
          timeout(3000),
          catchError((error) => {
            this.logger.error('Health check failed:', error.message);
            throw error;
          }),
        ),
      );

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
