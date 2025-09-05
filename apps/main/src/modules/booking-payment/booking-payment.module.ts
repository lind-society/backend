import { BookingPayment } from '@apps/main/database/entities';
import { CurrencyModule } from '@apps/main/modules/currency/currency.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingHelperModule } from '../booking/helper/booking-helper.module';
import { PaymentModule } from '../payment/payment.module';
import { BookingPaymentDashboardController } from './booking-payment-dashboard.controller';
import { BookingPaymentController } from './booking-payment.controller';
import { BookingPaymentService } from './booking-payment.service';
import { BookingPaymentRefundModule } from './refund/booking-payment-refund.module';

@Module({
  controllers: [BookingPaymentController, BookingPaymentDashboardController],
  providers: [BookingPaymentService],
  imports: [
    TypeOrmModule.forFeature([BookingPayment]),
    BookingPaymentRefundModule,
    CurrencyModule,
    BookingHelperModule,
    PaymentModule,
    BookingPaymentRefundModule,
  ],
  exports: [BookingPaymentService, BookingPaymentRefundModule],
})
export class BookingPaymentModule {}
