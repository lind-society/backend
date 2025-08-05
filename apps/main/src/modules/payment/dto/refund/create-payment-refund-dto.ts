import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  PaymentAvailableCurrency,
  PaymentAvailableRefundReason,
} from '../../enum';

const hashMapNums: Map<number, number> = new Map<number, number>();

export interface ICreatePaymentRefundDto {
  paymentRequestId?: string;
  referenceId?: string;
  currency?: PaymentAvailableCurrency;
  amount?: number;
  reason: PaymentAvailableRefundReason;
  metadata?: Record<string, any>;
}

export class CreatePaymentRefundDto implements ICreatePaymentRefundDto {
  @IsString()
  @IsOptional()
  paymentRequestId?: string;

  @IsString()
  @IsOptional()
  referenceId?: string;

  @IsEnum(PaymentAvailableCurrency, {
    message: `payment refund currency must be one of: ${Object.values(PaymentAvailableCurrency).join(', ')}`,
  })
  @IsOptional()
  currency?: PaymentAvailableCurrency;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'payment refund amount must be a valid number' },
  )
  @Min(1, { message: 'minimum payment refund amount is 1' })
  @IsOptional()
  amount?: number;

  @IsEnum(PaymentAvailableRefundReason, {
    message: `payment refund reason must be one of: ${Object.values(PaymentAvailableRefundReason).join(', ')}`,
  })
  @IsNotEmpty()
  reason: PaymentAvailableRefundReason;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
