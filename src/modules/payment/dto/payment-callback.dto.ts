import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaymentCallbackDto {
  @IsString()
  id: string;

  @IsString()
  external_id: string;

  @IsString()
  user_id: string;

  @IsString()
  @IsOptional()
  is_high?: string;

  @IsString()
  @IsOptional()
  payment_method?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  merchant_name?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsNumber()
  @IsOptional()
  paid_amount?: number;

  @IsString()
  @IsOptional()
  bank_code?: string;

  @IsString()
  @IsOptional()
  paid_at?: string;

  @IsString()
  @IsOptional()
  payer_email?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  adjusted_received_amount?: number;

  @IsNumber()
  @IsOptional()
  fees_paid_amount?: number;

  @IsString()
  @IsOptional()
  updated?: string;

  @IsString()
  @IsOptional()
  created?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  payment_channel?: string;

  @IsString()
  @IsOptional()
  payment_destination?: string;
}
