import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext } from '@nestjs/microservices';
import * as amqp from 'amqplib';

@Injectable()
export class MessageHandlerService {
  private readonly logger = new Logger(MessageHandlerService.name);

  constructor(private readonly configService: ConfigService) {}

  async ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      channel.ack(originalMessage);
    } catch (error) {
      this.logger.warn(`Failed to acknowledge message: ${error.message}`);
      // Don't rethrow as this is non-critical
    }
  }

  nack(context: RmqContext, requeue = false): void {
    try {
      const channel = context.getChannelRef();
      const message = context.getMessage();
      channel.nack(message, false, requeue);
    } catch (error) {
      this.logger.warn(
        `Failed to negative acknowledge message: ${error.message}`,
      );
    }
  }

  // Reject and requeue message for retry
  async retry(
    context: RmqContext,
    queue: string,
    error: Error,
    maxRetries: number = 3,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    const content = JSON.parse(message.content.toString());

    // Get or set retry count
    const retryCount = (content.retryCount || 0) + 1;
    this.logger.warn(
      `Message processing failed, attempt ${retryCount}/${maxRetries}: ${error.message}`,
    );

    // Update message with retry count
    const updatedContent = {
      ...content,
      retryCount,
      lastError: error.message,
      originalTimestamp: content.originalTimestamp || new Date().toISOString(),
    };

    // Check if we've hit max retries
    if (retryCount >= maxRetries) {
      await this.moveToDeadLetter(channel, queue, updatedContent);
      channel.ack(message); // Remove from original queue
    } else {
      // Send to retry queue with updated retry count
      await channel.sendToQueue(
        `${queue}_retry`,
        Buffer.from(JSON.stringify(updatedContent)),
        { persistent: true },
      );
      channel.ack(message); // Remove from original queue
    }
  }

  // Move failed message to dead letter queue
  async moveToDeadLetter(channel: amqp.Channel, queue: string, content: any) {
    this.logger.error(
      `Moving message to dead letter queue after maximum retries: ${content.lastError}`,
    );

    // Add failure metadata
    const failureInfo = {
      ...content,
      failedAt: new Date().toISOString(),
      totalAttempts: content.retryCount,
    };

    // Publish to the dead letter exchange
    await channel.publish(
      `${queue}_dlx`,
      `${queue}_failed`,
      Buffer.from(JSON.stringify(failureInfo)),
      { persistent: true },
    );
  }

  // Reprocess messages from dead letter queue
  // WARNING: Do NOT call this from the main NestJS app that is also consuming from the same queue.
  // Use this only in a separate process or admin tool to avoid RMQ channel/consumer conflicts.
  async reprocessDeadLetters(
    channel: amqp.Channel,
    queue: string,
    batchSize: number = 10,
  ) {
    throw new Error(
      'Do not call reprocessDeadLetters from the main app. Run this logic in a separate process to avoid RMQ channel/consumer conflicts.',
    );
  }

  async onModuleDestroy() {
    // Remove references to this.channel and this.connection, as they are not defined in this version
  }
}
