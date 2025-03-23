import { Module } from '@nestjs/common';
import { BookingCustomerController } from './customer.controller';
import { BookingCustomerService } from './customer.service';

@Module({
  controllers: [BookingCustomerController],
  providers: [BookingCustomerService],
  exports: [BookingCustomerService],
})
export class BookingCustomerModule {}
