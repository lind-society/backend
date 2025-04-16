import { BookingPayment } from '@apps/main/database/entities';
import { CurrencyModule } from '@apps/main/modules/currency/currency.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingPaymentController } from './booking-payment.controller';
import { BookingPaymentService } from './booking-payment.service';

@Module({
  controllers: [BookingPaymentController],
  providers: [BookingPaymentService],
  imports: [TypeOrmModule.forFeature([BookingPayment]), CurrencyModule],
  exports: [BookingPaymentService],
})
export class BookingPaymentModule {}
