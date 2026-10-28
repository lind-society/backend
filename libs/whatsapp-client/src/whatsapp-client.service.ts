import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import {
  SEND_WHATSAPP_MESSAGE,
  WHATSAPP_CONNECTION_STATE,
  WHATSAPP_FORCE_RECONNECT,
  WHATSAPP_HEALTH_CHECK,
  WHATSAPP_LOGOUT,
  WHATSAPP_SERVICE,
} from './constant';
import { SendMessageDto } from './dto';

@Injectable()
export class WhatsappClientService implements OnModuleInit {
  private readonly logger = new Logger(WhatsappClientService.name);

  private firstConnectAttempt = true;
  private isConnected = false;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private acknowledgeNotConnected = false;

  constructor(@Inject(WHATSAPP_SERVICE) private readonly client: ClientProxy) {}

  async onModuleInit() {
    try {
      await this.client.connect();

      const connected = await this.checkConnection();

      if (connected) {
        this.isConnected = true;
        this.logger.log('Successfully connected to whatsapp microservice');
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

  async checkConnection(): Promise<boolean> {
    try {
      const healthResult = await firstValueFrom(
        this.client.send(WHATSAPP_HEALTH_CHECK, {}).pipe(
          timeout(100),
          catchError((error) => {
            if (!this.isConnected && !this.acknowledgeNotConnected) {
              this.logger.error(
                'Health check failed, failed connecting to whatsapp microservice :',
                error.message,
              );
            }

            if (this.isConnected && !this.acknowledgeNotConnected) {
              this.logger.error(
                'Health check failed, disconnected from whatsapp microservice :',
                error.message,
              );
            }

            throw error;
          }),
        ),
      );

      this.isConnected = healthResult.status === 'ok';

      if (this.isConnected && this.acknowledgeNotConnected) {
        this.logger.log('Successfully reconnected to whatsapp microservice');
        this.acknowledgeNotConnected = false;
      }

      return this.isConnected;
    } catch (error) {
      this.isConnected = false;
      this.acknowledgeNotConnected = true;

      return this.isConnected;
    }
  }

  private startHealthChecks() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      await this.checkConnection();
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

  /**
   * Link state for the admin dashboard.
   *
   * Returns a synthetic `service_down` state rather than throwing when the
   * microservice is unreachable — from the admin's point of view "the WhatsApp
   * service is not running" is a status to display, not an error page.
   */
  async getConnectionState(): Promise<Record<string, unknown>> {
    try {
      return await firstValueFrom(
        this.client.send(WHATSAPP_CONNECTION_STATE, {}).pipe(timeout(10000)),
      );
    } catch (error) {
      this.logger.warn(
        `Could not read WhatsApp connection state: ${error.message}`,
      );

      return {
        status: 'service_down',
        qrImage: null,
        qrIssuedAt: null,
        linkedNumber: null,
        linkedName: null,
        lastReadyAt: null,
        lastDisconnectedAt: null,
        lastDisconnectReason: error.message,
        retries: 0,
        maxRetries: 0,
      };
    }
  }

  /** Unlink the handset so the next initialisation issues a fresh QR. */
  async logout(): Promise<{ status: string; error?: string }> {
    try {
      return await firstValueFrom(
        this.client.send(WHATSAPP_LOGOUT, {}).pipe(timeout(20000)),
      );
    } catch (error) {
      this.logger.error(`WhatsApp logout failed: ${error.message}`);
      return { status: 'error', error: error.message };
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
