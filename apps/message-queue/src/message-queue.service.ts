import {
  MessageQueue,
  MessageQueueStatus,
  MessageQueueType,
} from '@libs/common/entities';
import { WhatsappClientService } from '@libs/whatsapp-client';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class MessageQueueService {
  private readonly logger = new Logger(MessageQueueService.name);
  private isProcessing = false;
  private readonly MAX_RETRIES = 5;
  private lastWhatsappStatus = false;

  constructor(
    @InjectRepository(MessageQueue)
    private messageQueueRepository: Repository<MessageQueue>,
    private whatsappClientService: WhatsappClientService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async processMessageQueue() {
    if (this.isProcessing) {
      this.logger.debug('Already processing queue. Skipping this run.');
      return;
    }

    try {
      this.isProcessing = true;

      // First check if WhatsApp is connected
      const isWhatsappConnected =
        await this.whatsappClientService.checkConnection();

      // Log when connection status changes
      if (isWhatsappConnected !== this.lastWhatsappStatus) {
        if (isWhatsappConnected) {
          this.logger.log(
            'WhatsApp service is now connected. Processing queue...',
          );

          // If WhatsApp just became available, trigger immediate processing
          // of some failed messages by resetting their scheduled time
          await this.resetSomeFailedMessagesOnReconnect();
        } else {
          this.logger.warn('WhatsApp service has disconnected.');
        }
        this.lastWhatsappStatus = isWhatsappConnected;
      }

      if (!isWhatsappConnected) {
        this.logger.warn(
          'WhatsApp service is not connected. Skipping queue processing.',
        );
        return;
      }

      // Find pending WhatsApp messages that are due to be sent
      // (either immediately or scheduled time has passed)
      const pendingMessages = await this.messageQueueRepository.find({
        where: [
          // Pending messages with scheduled time in the past
          {
            status: MessageQueueStatus.Pending,
            type: MessageQueueType.Whatsapp,
            scheduledAt: LessThan(new Date()),
          },
          // Pending messages with no scheduled time (immediate)
          {
            status: MessageQueueStatus.Pending,
            type: MessageQueueType.Whatsapp,
            scheduledAt: null,
          },
          // Failed messages with retry count less than max AND scheduled time in the past
          {
            status: MessageQueueStatus.Failed,
            type: MessageQueueType.Whatsapp,
            retryCount: LessThan(this.MAX_RETRIES),
            scheduledAt: LessThan(new Date()),
          },
        ],
        take: 10, // Process 10 at a time
        order: {
          createdAt: 'ASC', // Oldest first
        },
      });

      if (pendingMessages.length > 0) {
        this.logger.log(`Found ${pendingMessages.length} messages to process`);
      } else {
        // Check if there are any failed messages waiting for future retry
        const waitingCount = await this.messageQueueRepository.count({
          where: {
            status: MessageQueueStatus.Failed,
            type: MessageQueueType.Whatsapp,
            retryCount: LessThan(this.MAX_RETRIES),
          },
        });

        if (waitingCount > 0) {
          this.logger.debug(
            `${waitingCount} failed messages waiting for scheduled retry`,
          );
        }
      }

      for (const message of pendingMessages) {
        // Mark as processing
        message.status = MessageQueueStatus.Processing;
        await this.messageQueueRepository.save(message);

        try {
          // Try to send the message
          await this.whatsappClientService.sendMessage({
            phoneNumber: message.recipient,
            message: message.content,
          });

          // Update as sent
          message.status = MessageQueueStatus.Sent;
          message.sentAt = new Date();
          await this.messageQueueRepository.save(message);
          this.logger.log(
            `Successfully sent message ${message.id} to ${message.recipient}`,
          );
        } catch (error) {
          // Update as failed
          message.status = MessageQueueStatus.Failed;
          message.retryCount++;
          message.errorMessage = error.message;

          // Calculate next retry with exponential backoff
          if (message.retryCount < this.MAX_RETRIES) {
            const backoffMinutes = Math.pow(2, message.retryCount); // 2, 4, 8, 16, 32 minutes
            message.scheduledAt = new Date(
              Date.now() + backoffMinutes * 60 * 1000,
            );
            this.logger.warn(
              `Failed to send message ${message.id}. Retry ${message.retryCount}/${this.MAX_RETRIES} ` +
                `scheduled at ${message.scheduledAt.toISOString()}`,
            );
          } else {
            this.logger.error(
              `Message ${message.id} failed permanently after ${this.MAX_RETRIES} retries: ${error.message}`,
            );
          }

          await this.messageQueueRepository.save(message);
        }

        // Small delay between processing messages
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      this.logger.error(
        `Error processing message queue: ${error.message}`,
        error.stack,
      );
    } finally {
      this.isProcessing = false;
    }
  }

  // Special method to reset some failed messages when WhatsApp reconnects
  private async resetSomeFailedMessagesOnReconnect() {
    try {
      // Get count of failed messages with retry attempts remaining
      const failedCount = await this.messageQueueRepository.count({
        where: {
          status: MessageQueueStatus.Failed,
          type: MessageQueueType.Whatsapp,
          retryCount: LessThan(this.MAX_RETRIES),
        },
      });

      if (failedCount === 0) {
        return;
      }

      // Reset up to 5 of the oldest failed messages for immediate retry
      const oldestFailedMessages = await this.messageQueueRepository.find({
        where: {
          status: MessageQueueStatus.Failed,
          type: MessageQueueType.Whatsapp,
          retryCount: LessThan(this.MAX_RETRIES),
        },
        order: {
          createdAt: 'ASC',
        },
        take: 5,
      });

      for (const message of oldestFailedMessages) {
        message.scheduledAt = new Date(); // Set to now for immediate retry
        message.status = MessageQueueStatus.Pending;
        await this.messageQueueRepository.save(message);
      }

      this.logger.log(
        `WhatsApp reconnected: Reset ${oldestFailedMessages.length} failed messages for immediate retry (${failedCount - oldestFailedMessages.length} remaining)`,
      );
    } catch (error) {
      this.logger.error(
        `Error resetting failed messages on reconnect: ${error.message}`,
      );
    }
  }

  // Method to manually retry all failed messages
  async retryFailedMessages() {
    const result = await this.messageQueueRepository.update(
      {
        status: MessageQueueStatus.Failed,
        type: MessageQueueType.Whatsapp,
      },
      {
        status: MessageQueueStatus.Pending,
        scheduledAt: new Date(),
      },
    );

    this.logger.log(
      `Reset ${result.affected} failed messages to pending status`,
    );
    return this.processMessageQueue();
  }

  // Method to get statistics about the message queue
  async getQueueStats() {
    const pendingCount = await this.messageQueueRepository.count({
      where: {
        status: MessageQueueStatus.Pending,
        type: MessageQueueType.Whatsapp,
      },
    });

    const processingCount = await this.messageQueueRepository.count({
      where: {
        status: MessageQueueStatus.Processing,
        type: MessageQueueType.Whatsapp,
      },
    });

    const failedCount = await this.messageQueueRepository.count({
      where: {
        status: MessageQueueStatus.Failed,
        type: MessageQueueType.Whatsapp,
      },
    });

    const sentCount = await this.messageQueueRepository.count({
      where: {
        status: MessageQueueStatus.Sent,
        type: MessageQueueType.Whatsapp,
      },
    });

    // Get count of failed messages waiting future retry
    const waitingForRetryCount = await this.messageQueueRepository.count({
      where: {
        status: MessageQueueStatus.Failed,
        type: MessageQueueType.Whatsapp,
        retryCount: LessThan(this.MAX_RETRIES),
        scheduledAt: LessThan(new Date()),
      },
    });

    return {
      pending: pendingCount,
      processing: processingCount,
      failed: failedCount,
      failedWaitingForRetry: waitingForRetryCount,
      sent: sentCount,
      total: pendingCount + processingCount + failedCount + sentCount,
      isWhatsappConnected: this.lastWhatsappStatus,
    };
  }
}
