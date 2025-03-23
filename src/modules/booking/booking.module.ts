import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingCustomerModule } from './customer/customer.module';
import { BookingPaymentModule } from './payment/payment.module';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [BookingPaymentModule, BookingCustomerModule],
})
export class BookingModule {}
