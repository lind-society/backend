import { Module } from '@nestjs/common';
import { BookingPaymentController } from './payment.controller';
import { BookingPaymentService } from './payment.service';

@Module({
  controllers: [BookingPaymentController],
  providers: [BookingPaymentService],
  exports: [BookingPaymentService],
})
export class BookingPaymentModule {}
