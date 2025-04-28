import { Module } from '@nestjs/common';
import { RefundService } from './refund.service';
import { RefundController } from './refund.controller';
import { XenditClientProvider } from '../providers/xendit-client.provider';
import { XenditRefundClientProvider } from '../providers/xendit-refund-client.provider';

@Module({
  controllers: [RefundController],
  providers: [XenditClientProvider, XenditRefundClientProvider, RefundService],
})
export class RefundModule {}
