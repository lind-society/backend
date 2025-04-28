import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BillingInformation } from 'xendit-node/payment_method/models';

export class BillingInformationDto implements BillingInformation {
  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsNotEmpty()
  country!: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  provinceState?: string;

  @IsString()
  @IsOptional()
  streetLine1?: string;

  @IsString()
  @IsOptional()
  streetLine2?: string;
}
