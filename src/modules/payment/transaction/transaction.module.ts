import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { XenditClientProvider } from '../providers/xendit-client.provider';
import { XenditTransactionClientProvider } from '../providers/xendit-transaction-client.provider';

@Module({
  controllers: [TransactionController],
  providers: [
    XenditClientProvider,
    XenditTransactionClientProvider,
    TransactionService,
  ],
})
export class TransactionModule {}
