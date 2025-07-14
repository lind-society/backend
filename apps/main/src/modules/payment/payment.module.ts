import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentStrategyFactory, XenditStrategy } from './strategies';

@Module({
  controllers: [PaymentController],
  providers: [PaymentStrategyFactory, XenditStrategy, PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
