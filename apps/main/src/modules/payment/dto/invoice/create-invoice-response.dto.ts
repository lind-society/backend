import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { PaymentStatus } from '../../enum';
import {
  CreatePaymentCustomerDto,
  ICreatePaymentCustomerDto,
} from '../customer';
import {
  CreatePaymentItemRequestDto,
  ICreatePaymentItemRequestDto,
} from '../item';
import {
  IInvoiceCardChannelPropertiesDto,
  IInvoiceCustomerNotificationPreferenceDto,
  IInvoiceFeeDto,
  InvoiceCardChannelPropertiesDto,
  InvoiceCustomerNotificationPreferenceDto,
  InvoiceFeeDto,
} from './invoice-related-field.dto';

export interface ICreateInvoiceResponseDto {
  id: string;
  externalId: string;
  userId: string;
  status: PaymentStatus;
  amount: number;
  payerEmail: string;
  description: string;
  expiryDate: string;
  invoiceUrl: string;
  customer: ICreatePaymentCustomerDto;
  customerNotificationPreference: IInvoiceCustomerNotificationPreferenceDto;
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
  items: ICreatePaymentItemRequestDto[];
  fees: IInvoiceFeeDto[];
  shouldAuthenticateCreditCard: boolean;
  channelProperties: IInvoiceCardChannelPropertiesDto;
  metadata: Record<string, any>;
}

export class CreateInvoiceResponseDto implements ICreateInvoiceResponseDto {
  id: string;
  externalId: string;
  userId: string;
  status: PaymentStatus;
  amount: number;
  payerEmail: string;
  description: string;
  expiryDate: string;
  invoiceUrl: string;
  customer: CreatePaymentCustomerDto;
  customerNotificationPreference: InvoiceCustomerNotificationPreferenceDto;
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
  items: CreatePaymentItemRequestDto[];
  fees: InvoiceFeeDto[];
  shouldAuthenticateCreditCard: boolean;
  channelProperties: InvoiceCardChannelPropertiesDto;
  metadata: Record<string, any>;
}

export class CreateInvoiceResponseSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<CreateInvoiceResponseDto>
{
  readonly data: CreateInvoiceResponseDto;

  constructor(data: CreateInvoiceResponseDto) {
    super({
      code: HttpStatus.OK,
      message: 'create payment invoice success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
