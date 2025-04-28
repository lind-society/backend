import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  QRCodeChannelCode,
  QRCodeChannelProperties,
  QRCodeParameters,
} from 'xendit-node/payment_method/models';

export enum QRCodeChannelCodeEnum {
  Qris = 'QRIS',
  Dana = 'DANA',
  Rcbc = 'RCBC',
  Promptpay = 'PROMPTPAY',
  Linkaja = 'LINKAJA',
  Xendit = 'XENDIT',
  Qrph = 'QRPH',
  XenditEnumDefaultFallback = 'UNKNOWN_ENUM_VALUE',
}

export class QRCodeChannelPropertiesDto implements QRCodeChannelProperties {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  expiresAt?: Date;

  @IsString()
  @IsOptional()
  qrString?: string;
}

export class QRCodeParametersDto implements QRCodeParameters {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsEnum(QRCodeChannelCodeEnum)
  @IsOptional()
  channelCode?: QRCodeChannelCode;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => QRCodeChannelPropertiesDto)
  @IsOptional()
  channelProperties?: QRCodeChannelProperties;

  @IsString()
  @IsOptional()
  currency?: string;
}
