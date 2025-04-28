import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsObject,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum Currency {
  IDR = 'IDR',
  PHP = 'PHP',
  THB = 'THB',
  MYR = 'MYR',
  VND = 'VND',
}

export enum Status {
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

export enum RedeemPoints {
  REDEEM_NONE = 'REDEEM_NONE',
  REDEEM_ALL = 'REDEEM_ALL',
}

export enum DeviceType {
  DESKTOP = 'DESKTOP',
  MOBILE = 'MOBILE',
}

export enum CardOnFileType {
  CUSTOMER_UNSCHEDULED = 'CUSTOMER_UNSCHEDULED',
  MERCHANT_UNSCHEDULED = 'MERCHANT_UNSCHEDULED',
  RECURRING = 'RECURRING',
}

export enum PaymentOption {
  PAYLATER_POSTPAID = 'PAYLATER_POSTPAID',
  PAYLATER_INSTALLMENTS_4MO = 'PAYLATER_INSTALLMENTS_4MO',
}

export class LinkDto {
  @IsString()
  @IsOptional()
  href?: string;

  @IsString()
  @IsOptional()
  rel?: string;

  @IsString()
  @IsOptional()
  method?: string;
}

export class PaymentDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  payment_request_id?: string;

  @IsString()
  reference_id: string;

  @IsOptional()
  @IsString()
  customer_id?: string;

  @IsEnum(Currency)
  currency: Currency;

  @IsNumber()
  amount: number;

  @IsString()
  country: string;

  @IsEnum(Status)
  status: Status;

  @IsObject()
  payment_method: any;

  @IsOptional()
  @IsObject()
  channel_properties?: {
    redeem_points?: RedeemPoints;
    success_return_url?: string;
    failure_return_url?: string;
    cancel_return_url?: string;
    pending_return_url?: string;
    device_type?: DeviceType;
    payer_ip_address?: string;
    require_auth?: boolean;
    skip_three_d_secure?: boolean;
    merchant_id_tag?: string;
    cardonfile_type?: CardOnFileType;
    allowed_payment_options?: PaymentOption[];
  };

  @IsOptional()
  @IsObject()
  payment_detail?: {
    network?: string;
    remarks?: string;
    fund_source?: string;
    source?: string;
  };

  @IsOptional()
  @IsString()
  failure_code?: string;

  @IsDateString()
  created: string;

  @IsDateString()
  updated: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class ListPaymentDto {
  @IsBoolean()
  @IsOptional()
  has_more: boolean;

  @IsObject()
  @IsOptional()
  links: LinkDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDto)
  @IsOptional()
  data: PaymentDto[];
}
