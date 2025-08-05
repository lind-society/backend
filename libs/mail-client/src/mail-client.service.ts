import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import {
  MAIL_FORCE_RECONNECT,
  MAIL_HEALTH_CHECK,
  MAIL_SERVICE,
  SEND_MAIL,
} from './constant';
import { SendMailDto } from './dto';

@Injectable()
export class MailClientService implements OnModuleInit {
  private readonly logger = new Logger(MailClientService.name);

  private firstConnectAttempt = true;
  private isConnected = false;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private acknowledgeNotConnected = false;

  constructor(@Inject(MAIL_SERVICE) private readonly client: ClientProxy) {}

  async onModuleInit() {
    try {
      await this.client.connect();

      const connected = await this.checkConnection();

      if (connected) {
        this.isConnected = true;
        this.logger.log('Successfully connected to mail microservice');
      }

      this.firstConnectAttempt = false;

      // Start periodic health checks
      this.startHealthChecks();
    } catch (error) {
      this.logger.error('Failed to connect to Mail service:', error.message);
      this.isConnected = false;
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      const healthResult = await firstValueFrom(
        this.client.send(MAIL_HEALTH_CHECK, {}).pipe(
          timeout(100),
          catchError((error) => {
            if (!this.isConnected && !this.acknowledgeNotConnected) {
              this.logger.error(
                'Health check failed, failed connecting to mail microservice :',
                error.message,
              );
            }

            if (this.isConnected && !this.acknowledgeNotConnected) {
              this.logger.error(
                'Health check failed, disconnected from mail microservice :',
                error.message,
              );
            }

            throw error;
          }),
        ),
      );

      this.isConnected = healthResult.status === 'ok';

      if (this.isConnected && this.acknowledgeNotConnected) {
        this.logger.log('Successfully reconnected to mail microservice');
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

  async sendMail(data: SendMailDto) {
    if (!this.isConnected) {
      this.logger.warn(
        'Mail service is not connected. Checking connection before sending...',
      );

      // Try to reconnect before giving up
      const isNowConnected = await this.checkConnection();

      if (!isNowConnected) {
        throw new Error('Mail service unavailable');
      }
    }

    // Send in background
    firstValueFrom(
      this.client.send(SEND_MAIL, data).pipe(
        timeout(15000),
        catchError((error) => {
          this.logger.error('Error sending mail:', error.message);
          if (this.isConnectionError(error)) {
            this.isConnected = false;
          }
          throw error;
        }),
      ),
    )
      .then(() => {
        this.logger.log('✅ Mail message sent (background)');
      })
      .catch((err) => {
        this.logger.warn('❌ Mail message failed in background', err.message);
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

  // Method to force reconnect of WhatsApp service
  async forceReconnect(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.client.send(MAIL_FORCE_RECONNECT, {}).pipe(timeout(3000)),
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
