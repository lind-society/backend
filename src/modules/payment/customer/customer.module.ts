import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { XenditClientProvider } from '../providers/xendit-client.provider';
import { XenditCustomerClientProvider } from '../providers/xendit-customer-client.provider copy';

@Module({
  controllers: [CustomerController],
  providers: [
    XenditClientProvider,
    XenditCustomerClientProvider,
    CustomerService,
  ],
})
export class CustomerModule {}
