import { Type } from 'class-transformer';
import {
  IsBoolean,
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
  CardChannelProperties,
  CardChannelPropertiesCardonfileTypeEnum,
  CardInstallmentConfiguration,
  CardParameters,
  CardParametersCardInformation,
} from 'xendit-node/payment_method/models';

export enum CardChannelPropertiesCardonfileType {
  MerchantUnscheduled = 'MERCHANT_UNSCHEDULED',
  CustomerUnscheduled = 'CUSTOMER_UNSCHEDULED',
  Recurring = 'RECURRING',
}

export class CardParametersCardInformationDto
  implements CardParametersCardInformation
{
  @IsString()
  @IsNotEmpty()
  cardNumber!: string;

  @IsString()
  @IsNotEmpty()
  cardholderName!: string;

  @IsString()
  @IsOptional()
  cvv?: string;

  @IsString()
  @IsNotEmpty()
  expiryMonth!: string;

  @IsString()
  @IsNotEmpty()
  expiryYear!: string;
}

export class CardInstallmentConfigurationDto
  implements CardInstallmentConfiguration
{
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  interval?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  terms?: number;
}

export class CardChannelPropertiesDto implements CardChannelProperties {
  @IsEnum(CardChannelPropertiesCardonfileType)
  @IsOptional()
  cardonfileType?: CardChannelPropertiesCardonfileTypeEnum;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  expiresAt?: Date;

  @IsString()
  @IsOptional()
  failureReturnUrl?: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => CardInstallmentConfigurationDto)
  @IsOptional()
  installmentConfiguration?: CardInstallmentConfiguration;

  @IsString()
  @IsOptional()
  merchantIdTag?: string;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  skipThreeDSecure?: boolean;

  @IsString()
  @IsOptional()
  successReturnUrl?: string;
}

export class CardParametersDto implements CardParameters {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => CardParametersCardInformationDto)
  @IsOptional()
  cardInformation?: CardParametersCardInformation;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => CardChannelPropertiesDto)
  @IsOptional()
  channelProperties?: CardChannelProperties;

  @IsString()
  @IsNotEmpty()
  currency!: string;
}
