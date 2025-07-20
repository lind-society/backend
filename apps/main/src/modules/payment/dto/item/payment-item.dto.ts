import { PaymentAvailableItemType } from '../../enum';

export class IPaymentItemDto {
  type: PaymentAvailableItemType;
  name: string;
  netUnitAmount: number;
  quantity: number;
  url?: string;
  imageUrl?: string;
  category?: string;
  subCategory?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export class PaymentItemDto implements IPaymentItemDto {
  type: PaymentAvailableItemType;
  name: string;
  netUnitAmount: number;
  quantity: number;
  url?: string;
  imageUrl?: string;
  category?: string;
  subCategory?: string;
  description?: string;
  metadata?: Record<string, any>;
}
