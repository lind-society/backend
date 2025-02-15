import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { XenditClientProvider } from '../providers/xendit-client.provider';
import { XenditBalanceClientProvider } from '../providers/xendit-balance-client.provider';

@Module({
  controllers: [BalanceController],
  providers: [
    XenditClientProvider,
    XenditBalanceClientProvider,
    BalanceService,
  ],
})
export class BalanceModule {}
