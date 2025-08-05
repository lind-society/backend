import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentAvailableCardOnFileType } from '../../enum';
import {
  IRecurringConfigurationDto,
  RecurringConfigurationDto,
} from '../payment-shared-field.dto';

export interface ISessionCardDto {
  cardOnFileType?: PaymentAvailableCardOnFileType;
  midLabel?: string;
  allowedBins?: string[];
  skipThreeDs?: boolean;
  recurringConfiguration?: IRecurringConfigurationDto;
  statementDescriptor?: string;
}

export interface ISessionChannelPropertiesDto {
  cards?: ISessionCardDto;
}

export interface IpaymentLinkConfigurationDto {
  primaryPaymentChannels?: string[];
}

export interface ICardsSessionJSDto {
  successReturnUrl: string;
  failureReturnUrl: string;
}

export class SessionCardDto implements ISessionCardDto {
  @IsEnum(PaymentAvailableCardOnFileType, {
    message: `session card on file type must be one of: ${Object.values(PaymentAvailableCardOnFileType).join(', ')}`,
  })
  @IsOptional()
  cardOnFileType?: PaymentAvailableCardOnFileType;

  @IsString()
  @IsOptional()
  midLabel?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allowedBins?: string[];

  @IsBoolean()
  @IsOptional()
  skipThreeDs?: boolean;

  @ValidateNested({ each: true })
  @Type(() => RecurringConfigurationDto)
  @IsOptional()
  recurringConfiguration?: RecurringConfigurationDto;

  @IsString()
  @IsOptional()
  statementDescriptor?: string;
}

export class SessionChannelPropertiesDto
  implements ISessionChannelPropertiesDto
{
  @ValidateNested({ each: true })
  @Type(() => SessionCardDto)
  @IsOptional()
  cards?: SessionCardDto;
}

export class PaymentLinkConfigurationDto
  implements IpaymentLinkConfigurationDto
{
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  primaryPaymentChannels?: string[];
}

export class CardsSessionJSDto implements ICardsSessionJSDto {
  @IsString()
  @IsNotEmpty()
  successReturnUrl: string;

  @IsString()
  @IsNotEmpty()
  failureReturnUrl: string;
}
