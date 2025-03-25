import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingCustomer } from 'src/database/entities';
import { BookingCustomerController } from './customer.controller';
import { BookingCustomerService } from './customer.service';

@Module({
  controllers: [BookingCustomerController],
  providers: [BookingCustomerService],
  imports: [TypeOrmModule.forFeature([BookingCustomer])],
  exports: [BookingCustomerService],
})
export class BookingCustomerModule {}
