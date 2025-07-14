import {
  IPaymentCustomerDto,
  PaymentCustomerDto,
} from '../customer/payment-customer.dto';
import { IRedirectUrlsDto, RedirectUrlsDto } from './card-session-js.dto';

export interface ICreatePaymentSessionRequestDto {
  referenceId: string;
  sessionType: string;
  mode: string;
  amount: number;
  currency: string;
  country: string;
  customer: IPaymentCustomerDto;
  redirectUrls: IRedirectUrlsDto;
}

export class CreatePaymentSessionRequestDto
  implements ICreatePaymentSessionRequestDto
{
  referenceId: string;
  sessionType: string;
  mode: string;
  amount: number;
  currency: string;
  country: string;
  customer: PaymentCustomerDto;
  redirectUrls: RedirectUrlsDto;
}
