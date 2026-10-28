import { Public, SkipHal } from '@apps/main/common/decorators';
import { InboundMessageDto } from '@libs/whatsapp-client';
import {
  Body,
  Controller,
  ForbiddenException,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'crypto';
import { BookingOwnerReplyService } from './booking-owner-reply.service';

export const WHATSAPP_WEBHOOK_TOKEN_HEADER = 'x-whatsapp-token';

/**
 * HTTP ingress for incoming WhatsApp messages — the same replies the RabbitMQ
 * listener handles, delivered over a webhook instead.
 *
 * Two reasons it exists next to the queue:
 *
 * - the official WhatsApp Cloud API pushes inbound messages as HTTP webhooks,
 *   not onto a broker, so this is the shape the eventual migration needs;
 * - it makes the owner-reply flow testable on a machine with no RabbitMQ, which
 *   is otherwise the one part of the booking flow that cannot be exercised.
 *
 * Both ingresses hand off to the same `BookingOwnerReplyService`, so there is
 * only ever one implementation of what a reply means.
 */
@Controller('bookings/whatsapp')
export class BookingWhatsappWebhookController {
  private readonly logger = new Logger(BookingWhatsappWebhookController.name);

  constructor(
    private readonly bookingOwnerReplyService: BookingOwnerReplyService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Authenticated by a shared secret, the same way the payment gateway's
   * callback is. Anyone who can reach this route can move a booking to the
   * payment step, so it is never open.
   */
  @Public()
  @SkipHal()
  @HttpCode(HttpStatus.OK)
  @Post('inbound')
  async receiveInboundMessage(
    @Headers(WHATSAPP_WEBHOOK_TOKEN_HEADER) webhookToken: string,
    @Body() payload: InboundMessageDto,
  ) {
    this._assertWebhookToken(webhookToken);

    const result =
      await this.bookingOwnerReplyService.handleInboundMessage(payload);

    this.logger.log(
      `inbound whatsapp webhook from ${payload?.phoneNumber}: ${result.outcome}${
        result.bookingId ? ` (booking ${result.bookingId})` : ''
      }`,
    );

    return result;
  }

  private _assertWebhookToken(webhookToken: string): void {
    const expected = this.configService.get<string>('WHATSAPP_WEBHOOK_TOKEN');

    // Fail closed: with no secret configured the route does not exist at all,
    // rather than silently accepting every caller.
    if (!expected) {
      this.logger.warn(
        'inbound whatsapp webhook called but WHATSAPP_WEBHOOK_TOKEN is not set',
      );

      throw new NotFoundException('not found');
    }

    if (!webhookToken || !this._tokensMatch(expected, webhookToken)) {
      throw new ForbiddenException(
        'inbound whatsapp webhook rejected, invalid token',
      );
    }
  }

  /** Constant-time, so response timing cannot be used to guess the secret. */
  private _tokensMatch(expected: string, received: string): boolean {
    const expectedBuffer = Buffer.from(expected, 'utf8');
    const receivedBuffer = Buffer.from(received, 'utf8');

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, receivedBuffer);
  }
}
