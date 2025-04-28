import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  VirtualAccountChannelCode,
  VirtualAccountChannelProperties,
  VirtualAccountParameters,
} from 'xendit-node/payment_method/models';

export type AlternativeDisplayTypes = 'QR_STRING'[];

export enum VirtualAccountChannelCodeEnum {
  Bca = 'BCA',
  Bjb = 'BJB',
  Bni = 'BNI',
  Bri = 'BRI',
  Mandiri = 'MANDIRI',
  Permata = 'PERMATA',
  Bsi = 'BSI',
  Cimb = 'CIMB',
  SahabatSampoerna = 'SAHABAT_SAMPOERNA',
  Artajasa = 'ARTAJASA',
  Pv = 'PV',
  Vietcapital = 'VIETCAPITAL',
  Woori = 'WOORI',
  Msb = 'MSB',
  Vpb = 'VPB',
  Bidv = 'BIDV',
  Cake = 'CAKE',
  StandardChartered = 'STANDARD_CHARTERED',
  Ambank = 'AMBANK',
  Uob = 'UOB',
  Bnc = 'BNC',
  Hana = 'HANA',
  Muamalat = 'MUAMALAT',
  BankTransfer = 'BANK_TRANSFER',
  XenditEnumDefaultFallback = 'UNKNOWN_ENUM_VALUE',
}

export class VirtualAccountChannelPropertiesDto
  implements VirtualAccountChannelProperties
{
  @IsString()
  @IsOptional()
  customerName?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  expiresAt?: Date;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  suggestedAmount?: number;

  @IsString()
  @IsOptional()
  virtualAccountNumber?: string;
}

export class VirtualAccountParametersDto implements VirtualAccountParameters {
  alternativeDisplayTypes?: AlternativeDisplayTypes;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsEnum(VirtualAccountChannelCodeEnum)
  @IsOptional()
  channelCode: VirtualAccountChannelCode;

  channelProperties: VirtualAccountChannelProperties;

  @IsString()
  @IsOptional()
  currency?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  maxAmount?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  minAmount?: number;
}
