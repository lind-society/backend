import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CustomerRequest } from 'xendit-node/customer/models';
import {
  BillingInformation,
  CardParameters,
  DirectDebitParameters,
  EWalletParameters,
  OverTheCounterParameters,
  PaymentMethodParameters,
  PaymentMethodReusability,
  PaymentMethodType,
  QRCodeParameters,
  VirtualAccountParameters,
} from 'xendit-node/payment_method/models';
import {
  BillingInformationDto,
  CardParametersDto,
  DirectDebitParametersDto,
  EWalletParametersDto,
  OverTheCounterParametersDto,
  PaymentMethodReusabilityEnum,
  PaymentMethodTypeEnum,
  QRCodeParametersDto,
  VirtualAccountParametersDto,
} from './wrappers';

export class PaymentMethodParametersDto implements PaymentMethodParameters {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => BillingInformationDto)
  @IsOptional()
  billingInformation?: BillingInformation;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => CardParametersDto)
  @IsOptional()
  card?: CardParameters;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => DirectDebitParametersDto)
  @IsOptional()
  directDebit?: DirectDebitParameters;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => EWalletParametersDto)
  @IsOptional()
  ewallet?: EWalletParameters;

  @IsObject()
  @IsOptional()
  metadata?: object;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => OverTheCounterParametersDto)
  @IsOptional()
  overTheCounter?: OverTheCounterParameters;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => QRCodeParametersDto)
  @IsOptional()
  qrCode?: QRCodeParameters;

  @IsString()
  @IsOptional()
  referenceId?: string;

  @IsEnum(PaymentMethodReusabilityEnum)
  @IsNotEmpty()
  reusability!: PaymentMethodReusability;

  @IsEnum(PaymentMethodTypeEnum)
  @IsNotEmpty()
  type!: PaymentMethodType;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => VirtualAccountParametersDto)
  @IsOptional()
  virtualAccount?: VirtualAccountParameters;
}

export class CreatePaymentMethodDto {
  @IsObject()
  @IsOptional()
  customerPayload?: CustomerRequest;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => PaymentMethodParametersDto)
  @IsOptional()
  paymentMethodPayload: PaymentMethodParameters;
}
