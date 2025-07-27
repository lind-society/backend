import {
  PaymentAvailableCurrency,
  PaymentAvailableItemType,
} from '@apps/main/modules/payment/enum';

export class IXenditPaymentItemDto {
  reference_id?: string;
  currency?: PaymentAvailableCurrency;
  type: PaymentAvailableItemType;
  name: string;
  net_unit_amount: number;
  quantity: number;
  url?: string;
  image_url?: string;
  category?: string;
  sub_category?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export class XenditPaymentItemDto implements IXenditPaymentItemDto {
  reference_id?: string;
  currency?: PaymentAvailableCurrency;
  type: PaymentAvailableItemType;
  name: string;
  net_unit_amount: number;
  quantity: number;
  url?: string;
  image_url?: string;
  category?: string;
  sub_category?: string;
  description?: string;
  metadata?: Record<string, any>;
}
