import { MessageQueue, MessageQueueStatus } from '@apps/main/database/entities';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnqueueMessageDto } from './dto';

@Injectable()
export class MessageQueueClientService {
  private readonly logger = new Logger(MessageQueueClientService.name);

  constructor(
    @InjectRepository(MessageQueue)
    private readonly messageQueueRepository: Repository<MessageQueue>,
  ) {}

  /**
   * Add a message to the message queue
   */
  async enqueueMessage(data: EnqueueMessageDto): Promise<MessageQueue> {
    try {
      const messageQueue = this.messageQueueRepository.create({
        type: data.type,
        recipient: data.recipient,
        content: data.content,
        scheduledAt: data.scheduledAt || null,
        status: MessageQueueStatus.Pending,
        retryCount: 0,
      });

      const savedMessage = await this.messageQueueRepository.save(messageQueue);
      this.logger.log(
        `Message queued: ${savedMessage.id} for ${data.recipient}`,
      );
      return savedMessage;
    } catch (error) {
      this.logger.error(`Failed to enqueue message: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check status of a message
   */
  async getMessageStatus(id: string): Promise<MessageQueue> {
    return this.messageQueueRepository.findOneOrFail({ where: { id } });
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    const pendingCount = await this.messageQueueRepository.count({
      where: { status: MessageQueueStatus.Pending },
    });

    const processingCount = await this.messageQueueRepository.count({
      where: { status: MessageQueueStatus.Processing },
    });

    const failedCount = await this.messageQueueRepository.count({
      where: { status: MessageQueueStatus.Failed },
    });

    const sentCount = await this.messageQueueRepository.count({
      where: { status: MessageQueueStatus.Sent },
    });

    return {
      pending: pendingCount,
      processing: processingCount,
      failed: failedCount,
      sent: sentCount,
      total: pendingCount + processingCount + failedCount + sentCount,
    };
  }
}
