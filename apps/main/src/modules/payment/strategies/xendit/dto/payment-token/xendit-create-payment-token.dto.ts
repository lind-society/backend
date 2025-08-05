import { ICreatePaymentCustomerDto } from '@apps/main/modules/payment/dto';
import {
  PaymentAvailableCountry,
  PaymentAvailableCurrency,
} from '../../../../enum';
import { XenditPaymentCustomerDto } from '../customer';
import {
  IXenditChannelPropertiesDto,
  XenditChannelPropertiesDto,
} from '../xendit-payment-shared-field.dto';

export interface IXenditCreatePaymentTokenDto {
  channel_code: string;
  country: PaymentAvailableCountry;
  customer_id?: string;
  customer?: ICreatePaymentCustomerDto;
  reference_id: string;
  currency: PaymentAvailableCurrency;
  channel_properties: IXenditChannelPropertiesDto;
  metadata?: Record<string, any>;
  description?: string;
}

export class XenditCreatePaymentTokenDto
  implements IXenditCreatePaymentTokenDto
{
  channel_code: string;
  country: PaymentAvailableCountry;
  customer_id?: string;
  customer?: XenditPaymentCustomerDto;
  reference_id: string;
  currency: PaymentAvailableCurrency;
  channel_properties: XenditChannelPropertiesDto;
  metadata?: Record<string, any>;
  description?: string;
}
