import { Type } from 'class-transformer';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  IdentityAccountRequest,
  IdentityAccountRequestProperties,
  IdentityAccountType,
} from 'xendit-node/customer/models';

export enum IdentityAccountTypeEnum {
  BankAccount = 'BANK_ACCOUNT',
  Ewallet = 'EWALLET',
  CreditCard = 'CREDIT_CARD',
  PayLater = 'PAY_LATER',
  Otc = 'OTC',
  QrCode = 'QR_CODE',
  XenditEnumDefaultFallback = 'UNKNOWN_ENUM_VALUE',
}

export class IdentityAccountRequestPropertiesDto
  implements IdentityAccountRequestProperties
{
  @IsString()
  @IsOptional()
  accountDetails?: string;

  @IsString()
  @IsOptional()
  accountHolderName?: string;

  @IsString()
  @IsOptional()
  accountId?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsOptional()
  accountType?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  expiresAt?: string;

  @IsString()
  @IsOptional()
  paymentCode?: string;

  @IsString()
  @IsOptional()
  qrString?: string;

  @IsString()
  @IsOptional()
  swiftCode?: string;

  @IsString()
  @IsOptional()
  tokenId?: string;
}

export class IdentityAccountRequestDto implements IdentityAccountRequest {
  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => IdentityAccountRequestPropertiesDto)
  @IsOptional()
  properties?: IdentityAccountRequestProperties;

  @IsEnum(IdentityAccountTypeEnum)
  @IsOptional()
  type?: IdentityAccountType;
}
