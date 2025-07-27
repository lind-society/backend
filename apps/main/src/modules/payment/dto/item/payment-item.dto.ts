import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  Validate,
} from 'class-validator';
import { PaymentAvailableCurrency, PaymentAvailableItemType } from '../../enum';
import { PaymentItemNetUnitAmountValidator } from '../../helper/dto-custom-validator/payment-item-type-dto-custom-validator.helper';

export class IPaymentItemDto {
  referenceId?: string;
  currency?: PaymentAvailableCurrency;
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
  @IsString()
  @IsOptional()
  referenceId?: string;

  @IsEnum(PaymentAvailableCurrency, {
    message: `item currency must be one of: ${Object.values(PaymentAvailableCurrency).join(', ')}`,
  })
  @IsOptional()
  currency?: PaymentAvailableCurrency;

  @IsEnum(PaymentAvailableItemType, {
    message: `item type must be one of: ${Object.values(PaymentAvailableItemType).join(', ')}`,
  })
  @IsOptional()
  type: PaymentAvailableItemType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Validate(PaymentItemNetUnitAmountValidator)
  netUnitAmount: number;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'item quantity must be a valid number' },
  )
  @Min(0, { message: 'minimum item quantity is 1' })
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  subCategory?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
