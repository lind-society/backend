import {
  InboundMessageDto,
  WHATSAPP_INBOUND_MESSAGE,
} from '@libs/whatsapp-client';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BookingOwnerReplyService } from './booking-owner-reply.service';

/**
 * Entry point for messages coming *from* WhatsApp. It carries no HTTP routes —
 * the only caller is the WhatsApp microservice, over RabbitMQ.
 */
@Controller()
export class BookingWhatsappInboundController {
  private readonly logger = new Logger(BookingWhatsappInboundController.name);

  constructor(
    private readonly bookingOwnerReplyService: BookingOwnerReplyService,
  ) {}

  /**
   * Never rethrows: an event that fails is not redelivered to any better
   * effect, and a poison message must not stall the queue behind it. The reply
   * simply stays unprocessed and the admin sees it in WhatsApp as before.
   */
  @EventPattern(WHATSAPP_INBOUND_MESSAGE)
  async handleInboundMessage(
    @Payload() payload: InboundMessageDto,
  ): Promise<void> {
    try {
      const result =
        await this.bookingOwnerReplyService.handleInboundMessage(payload);

      this.logger.log(
        `inbound whatsapp message from ${payload?.phoneNumber}: ${result.outcome}${
          result.bookingId ? ` (booking ${result.bookingId})` : ''
        }`,
      );
    } catch (error) {
      this.logger.error(
        `failed to handle inbound whatsapp message from ${payload?.phoneNumber}: ${error.message}`,
      );
    }
  }
}
