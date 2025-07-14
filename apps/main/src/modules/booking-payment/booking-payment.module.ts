import { BookingPayment } from '@apps/main/database/entities';
import { CurrencyModule } from '@apps/main/modules/currency/currency.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingHelperModule } from '../booking/helper/booking-helper.module';
import { PaymentModule } from '../payment/payment.module';
import { BookingPaymentController } from './booking-payment.controller';
import { BookingPaymentService } from './booking-payment.service';

@Module({
  controllers: [BookingPaymentController],
  providers: [BookingPaymentService],
  imports: [
    TypeOrmModule.forFeature([BookingPayment]),
    CurrencyModule,
    BookingHelperModule,
    PaymentModule,
  ],
  exports: [BookingPaymentService],
})
export class BookingPaymentModule {}
