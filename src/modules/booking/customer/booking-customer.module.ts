import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingCustomer } from 'src/database/entities';
import { BookingCustomerController } from './booking-customer.controller';
import { BookingCustomerService } from './booking-customer.service';

@Module({
  controllers: [BookingCustomerController],
  providers: [BookingCustomerService],
  imports: [TypeOrmModule.forFeature([BookingCustomer])],
  exports: [BookingCustomerService],
})
export class BookingCustomerModule {}
