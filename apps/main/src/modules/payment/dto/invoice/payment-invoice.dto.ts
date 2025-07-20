import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { PaymentAvailableInvoiceStatus } from '../../enum';
import { IPaymentCustomerDto, PaymentCustomerDto } from '../customer';
import { IPaymentItemDto, PaymentItemDto } from '../item';
import {
  IInvoiceCardChannelPropertiesDto,
  IInvoiceFeeDto,
  InvoiceCardChannelPropertiesDto,
  InvoiceFeeDto,
  IPaymentAvailableCustomerNotificationPreferenceDto,
  PaymentAvailableCustomerNotificationPreferenceDto,
} from './shared-invoice-field.dto';

export interface IPaymentInvoiceDto {
  id: string;
  externalId: string;
  userId: string;
  status: PaymentAvailableInvoiceStatus;
  amount: number;
  payerEmail: string;
  description: string;
  expiryDate: string;
  invoiceUrl: string;
  customer: IPaymentCustomerDto;
  customerNotificationPreference: IPaymentAvailableCustomerNotificationPreferenceDto;
  successRedirectUrl: string;
  failureRedirectUrl: string;
  reminderDate: string;
  fixedVA: boolean;
  midLabel: string;
  shouldExcludeCreditCard: boolean;
  shouldSendEmail: boolean;
  createdAt: string;
  updatedAt: string;
  currency: string;
  items: IPaymentItemDto[];
  fees: IInvoiceFeeDto[];
  shouldAuthenticateCreditCard: boolean;
  channelProperties: IInvoiceCardChannelPropertiesDto;
  metadata: Record<string, any>;
}

export class PaymentInvoiceDto implements IPaymentInvoiceDto {
  id: string;
  externalId: string;
  userId: string;
  status: PaymentAvailableInvoiceStatus;
  amount: number;
  payerEmail: string;
  description: string;
  expiryDate: string;
  invoiceUrl: string;
  customer: PaymentCustomerDto;
  customerNotificationPreference: PaymentAvailableCustomerNotificationPreferenceDto;
  successRedirectUrl: string;
  failureRedirectUrl: string;
  reminderDate: string;
  fixedVA: boolean;
  midLabel: string;
  shouldExcludeCreditCard: boolean;
  shouldSendEmail: boolean;
  createdAt: string;
  updatedAt: string;
  currency: string;
  items: PaymentItemDto[];
  fees: InvoiceFeeDto[];
  shouldAuthenticateCreditCard: boolean;
  channelProperties: InvoiceCardChannelPropertiesDto;
  metadata: Record<string, any>;
}

export class CreatePaymentInvoiceSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<PaymentInvoiceDto>
{
  readonly data: PaymentInvoiceDto;

  constructor(data: PaymentInvoiceDto) {
    super({
      code: HttpStatus.OK,
      message: 'create payment invoice success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
