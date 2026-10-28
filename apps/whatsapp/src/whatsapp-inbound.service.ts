import { MainProvider } from '@libs/common/enums';
import {
  WHATSAPP_INBOUND_MESSAGE,
  WHATSAPP_INBOUND_SERVICE,
} from '@libs/whatsapp-client';
import { InboundMessageDto } from '@libs/whatsapp-client/dto';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IWhatsappClient, IWhatsappIncomingMessage } from './interfaces';

/**
 * Forwards every incoming WhatsApp message onto the inbound queue for the main
 * app to interpret.
 *
 * This service deliberately knows nothing about bookings or owners: the
 * WhatsApp microservice stays a dumb transport, and all the business meaning of
 * a reply lives in the main app.
 */
@Injectable()
export class WhatsappInboundService implements OnModuleInit {
  private readonly logger = new Logger(WhatsappInboundService.name);

  constructor(
    @Inject(MainProvider.Whatsapp)
    private readonly whatsappProvider: IWhatsappClient,
    @Inject(WHATSAPP_INBOUND_SERVICE)
    private readonly inboundClient: ClientProxy,
  ) {}

  onModuleInit(): void {
    this.whatsappProvider.onIncomingMessage((message) =>
      this.publish(message),
    );

    this.logger.log(
      `forwarding incoming WhatsApp messages to ${WHATSAPP_INBOUND_MESSAGE}`,
    );
  }

  /**
   * Publishes fire-and-forget. Nobody is waiting on the other end, and a queue
   * that is momentarily unreachable must not take the WhatsApp client down with
   * it — a dropped message just means the admin handles that reply by hand.
   */
  private publish(message: IWhatsappIncomingMessage): void {
    const payload: InboundMessageDto = {
      phoneNumber: message.phoneNumber,
      message: message.message,
      messageId: message.messageId,
      receivedAt: message.receivedAt,
    };

    try {
      this.inboundClient.emit(WHATSAPP_INBOUND_MESSAGE, payload);

      this.logger.log(
        `forwarded inbound message from ${payload.phoneNumber} to the main app`,
      );
    } catch (error) {
      this.logger.error(
        `failed to forward inbound message from ${payload.phoneNumber}: ${error.message}`,
      );
    }
  }
}
