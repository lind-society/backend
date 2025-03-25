import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingPayment } from 'src/database/entities';
import { CurrencyModule } from 'src/modules/currency/currency.module';
import { BookingPaymentController } from './payment.controller';
import { BookingPaymentService } from './payment.service';

@Module({
  controllers: [BookingPaymentController],
  providers: [BookingPaymentService],
  imports: [TypeOrmModule.forFeature([BookingPayment]), CurrencyModule],
  exports: [BookingPaymentService],
})
export class BookingPaymentModule {}
