import { PaymentNotificationChannel } from 'src/common/enums/payment-notification-channel.enum';
import { PaymentCustomerDto } from './customer/payment-customer.dto';
import { InvoiceItemDto } from './invoice-item.dto';
import { InvoiceFeeDto } from './customer/invoice-fee.dto';
import { ChannelProperties } from 'xendit-node/invoice/models';

export class CreateInvoiceDto {
  externalId: string;
  amount: number;
  payerEmail: string;
  description: string;
  invoiceDuration: string;
  callbackVirtualAccountId: string;
  shouldSendEmail: boolean;
  customer: PaymentCustomerDto;
  customerNotificationPreference: PaymentNotificationChannel;
  successRedirectUrl: string;
  failureRedirectUrl: string;
  paymentMethods: string[];
  midLabel: string;
  shouldAuthenticateCreditCard: boolean;
  currency: string;
  reminderTime: number;
  locale: string;
  reminderTimeUnit: string;
  items: InvoiceItemDto[];
  fees: InvoiceFeeDto[];
  channelProperties: ChannelProperties;
  metadata: object;
}
