import { Module } from '@nestjs/common';
import { PayoutService } from './payout.service';
import { PayoutController } from './payout.controller';
import { XenditClientProvider } from '../providers/xendit-client.provider';
import { XenditPayoutClientProvider } from '../providers/xendit-payout-client.provider';

@Module({
  controllers: [PayoutController],
  providers: [XenditClientProvider, XenditPayoutClientProvider, PayoutService],
})
export class PayoutModule {}
