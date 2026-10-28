import { Activity, Booking } from '@apps/main/database/entities';
import { MailClientModule } from '@libs/mail-client';
import { WhatsappClientModule } from '@libs/whatsapp-client';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingPaymentModule } from '../booking-payment/booking-payment.module';
import { CurrencyModule } from '../currency/currency.module';
import { PaymentModule } from '../payment/payment.module';
import { BookingEventListenerService } from './booking-event-listener.service';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingCustomerModule } from './customer/booking-customer.module';
import { BookingHelperModule } from './helper/booking-helper.module';
import { BookingOwnerReplyService } from './inbound/booking-owner-reply.service';
import { BookingWhatsappInboundController } from './inbound/booking-whatsapp-inbound.controller';
import { BookingWhatsappWebhookController } from './inbound/booking-whatsapp-webhook.controller';
import { BookingPublicController } from './public/booking-public.controller';
import { BookingStatisticModule } from './statistic/booking-statistic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, Booking]),
    BookingCustomerModule,
    BookingHelperModule,
    BookingPaymentModule,
    BookingStatisticModule,
    CurrencyModule,
    PaymentModule,
    MailClientModule,
    WhatsappClientModule,
  ],
  providers: [
    BookingService,
    BookingEventListenerService,
    BookingOwnerReplyService,
  ],
  // The public and webhook controllers are registered first so their literal
  // paths are matched before the admin `bookings/:id` route. The inbound
  // controller has no HTTP routes at all — it only listens on the RabbitMQ
  // inbound queue.
  controllers: [
    BookingPublicController,
    BookingWhatsappWebhookController,
    BookingController,
    BookingWhatsappInboundController,
  ],
  exports: [BookingService, BookingHelperModule],
})
export class BookingModule {}
