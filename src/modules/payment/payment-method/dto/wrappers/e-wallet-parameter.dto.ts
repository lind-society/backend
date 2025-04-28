import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  EWalletAccount,
  EWalletChannelCode,
  EWalletChannelProperties,
  EWalletParameters,
} from 'xendit-node/payment_method/models';

export enum EWalletChannelCodeEnum {
  Gcash = 'GCASH',
  Grabpay = 'GRABPAY',
  Paymaya = 'PAYMAYA',
  Ovo = 'OVO',
  Dana = 'DANA',
  Linkaja = 'LINKAJA',
  Shopeepay = 'SHOPEEPAY',
  Sakuku = 'SAKUKU',
  Nexcash = 'NEXCASH',
  Astrapay = 'ASTRAPAY',
  Jeniuspay = 'JENIUSPAY',
  Appota = 'APPOTA',
  Momo = 'MOMO',
  Vnptwallet = 'VNPTWALLET',
  Viettelpay = 'VIETTELPAY',
  Zalopay = 'ZALOPAY',
  Wechatpay = 'WECHATPAY',
  Linepay = 'LINEPAY',
  Truemoney = 'TRUEMONEY',
  Alipay = 'ALIPAY',
  Touchngo = 'TOUCHNGO',
  XenditEnumDefaultFallback = 'UNKNOWN_ENUM_VALUE',
}
export class EWalletAccountDto implements EWalletAccount {
  @IsString()
  @IsOptional()
  accountDetails?: string;

  @Type(() => Number)
  @IsOptional()
  balance?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @Type(() => Number)
  @IsOptional()
  pointBalance?: number;
}

export class EWalletChannelPropertiesDto implements EWalletChannelProperties {
  @IsString()
  @IsOptional()
  cancelReturnUrl?: string;

  @IsString()
  @IsOptional()
  cashtag?: string;

  @IsString()
  @IsOptional()
  failureReturnUrl?: string;

  @IsString()
  @IsOptional()
  mobileNumber?: string;

  @IsString()
  @IsOptional()
  pendingReturnUrl?: string;

  @IsString()
  @IsOptional()
  promotionLabel?: string;

  @IsString()
  @IsOptional()
  redeemPoints?: string;

  @IsString()
  @IsOptional()
  successReturnUrl?: string;
}

export class EWalletParametersDto implements EWalletParameters {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => EWalletAccountDto)
  @IsOptional()
  account?: EWalletAccount;

  @IsEnum(EWalletAccountDto)
  @IsNotEmpty()
  channelCode!: EWalletChannelCode;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => EWalletChannelPropertiesDto)
  @IsOptional()
  channelProperties?: EWalletChannelProperties;
}
