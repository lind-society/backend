import { BookingCustomer } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingHelperModule } from '../helper/booking-helper.module';
import { BookingCustomerController } from './booking-customer.controller';
import { BookingCustomerService } from './booking-customer.service';

@Module({
  controllers: [BookingCustomerController],
  providers: [BookingCustomerService],
  imports: [TypeOrmModule.forFeature([BookingCustomer]), BookingHelperModule],
  exports: [BookingCustomerService],
})
export class BookingCustomerModule {}
