import { BookingPaymentRefund } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingHelperModule } from '../../booking/helper/booking-helper.module';
import { BookingPaymentRefundDashboardController } from './booking-payment-refund-dashboard.controller';
import { BookingPaymentRefundController } from './booking-payment-refund.controller';
import { BookingPaymentRefundService } from './booking-payment-refund.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingPaymentRefund]),
    BookingHelperModule,
  ],
  controllers: [
    BookingPaymentRefundController,
    BookingPaymentRefundDashboardController,
  ],
  providers: [BookingPaymentRefundService],
  exports: [BookingPaymentRefundService],
})
export class BookingPaymentRefundModule {}
