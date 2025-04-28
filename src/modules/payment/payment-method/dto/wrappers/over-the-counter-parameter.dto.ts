import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  OverTheCounterChannelCode,
  OverTheCounterChannelProperties,
  OverTheCounterParameters,
} from 'xendit-node/payment_method/models';

export enum OverTheCounterChannelCodeEnum {
  _7Eleven = '7ELEVEN',
  _7ElevenCliqq = '7ELEVEN_CLIQQ',
  Cebuana = 'CEBUANA',
  Ecpay = 'ECPAY',
  Palawan = 'PALAWAN',
  Mlhuillier = 'MLHUILLIER',
  EcpayDragonloan = 'ECPAY_DRAGONLOAN',
  Lbc = 'LBC',
  EcpaySchool = 'ECPAY_SCHOOL',
  RdPawnshop = 'RD_PAWNSHOP',
  Cvm = 'CVM',
  Ussc = 'USSC',
  SmBills = 'SM_BILLS',
  RobinsonsBills = 'ROBINSONS_BILLS',
  Alfamart = 'ALFAMART',
  Indomaret = 'INDOMARET',
  XenditEnumDefaultFallback = 'UNKNOWN_ENUM_VALUE',
}

export class OverTheCounterChannelPropertiesDto
  implements OverTheCounterChannelProperties
{
  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  expiresAt?: Date;

  @IsString()
  @IsOptional()
  paymentCode?: string;
}

export class OverTheCounterParametersDto implements OverTheCounterParameters {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsEnum(OverTheCounterChannelCodeEnum)
  @IsNotEmpty()
  channelCode!: OverTheCounterChannelCode;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => OverTheCounterChannelPropertiesDto)
  @IsNotEmpty()
  channelProperties!: OverTheCounterChannelProperties;

  @IsString()
  @IsOptional()
  currency?: string;
}
