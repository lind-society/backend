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
import {
  PaymentAvailableAddressCategory,
  PaymentAvailableBusinessType,
  PaymentAvailableCustomerKYCDocumentSubType,
  PaymentAvailableCustomerKYCDocumentType,
  PaymentAvailableGender,
} from '../../enum';

export interface IPaymentCustomerIndividualDetailEmploymentDto {
  employerName?: string;
  natureOfBusiness?: string;
  roleDescription?: string;
}

export interface IPaymentCustomerIndividualDetailDto {
  givenNames: string;
  surname?: string;
  nationality?: string;
  placeOfBirth?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  gender?: PaymentAvailableGender;
  employment?: IPaymentCustomerIndividualDetailEmploymentDto;
}

export interface IPaymentCustomerBusinessDetailDto {
  businessName: string;
  tradingName?: string;
  businessType?: PaymentAvailableBusinessType;
  natureOfBusiness?: string;
  businessDomicile?: string;
  dateOfRegistration?: string;
}

export interface IPaymentCustomerAddressDto {
  country: string;
  streetLine1?: string;
  streetLine2?: string;
  city?: string;
  provinceState?: string;
  postalCode?: string;
  category?: PaymentAvailableAddressCategory;
  isPrimary?: boolean;
}

export interface IPaymentCustomerKYCDocumentDto {
  country: string;
  type?: PaymentAvailableCustomerKYCDocumentType;
  subType?: PaymentAvailableCustomerKYCDocumentSubType;
  documentName?: string;
  documentNumber?: string;
  expiresAt?: string;
  holderName?: string;
  documentImages?: string[];
}

export class PaymentCustomerIndividualDetailEmploymentDto
  implements IPaymentCustomerIndividualDetailEmploymentDto
{
  @IsString()
  @IsOptional()
  employerName?: string;

  @IsString()
  @IsOptional()
  natureOfBusiness?: string;

  @IsString()
  @IsOptional()
  roleDescription?: string;
}

export class PaymentCustomerIndividualDetailDto
  implements IPaymentCustomerIndividualDetailDto
{
  @IsString()
  @IsNotEmpty()
  givenNames: string;

  @IsString()
  @IsOptional()
  surname?: string;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsOptional()
  placeOfBirth?: string;

  @IsString()
  @IsOptional()
  dateOfBirth?: string; // YYYY-MM-DD

  @IsEnum(PaymentAvailableGender, {
    message: `payment available gender must be one of: ${Object.values(PaymentAvailableGender).join(', ')}`,
  })
  @IsOptional()
  gender?: PaymentAvailableGender;

  @ValidateNested({ each: true })
  @Type(() => PaymentCustomerIndividualDetailEmploymentDto)
  @IsOptional()
  employment?: PaymentCustomerIndividualDetailEmploymentDto;
}

export class PaymentCustomerBusinessDetailDto
  implements IPaymentCustomerBusinessDetailDto
{
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsString()
  @IsOptional()
  tradingName?: string;

  @IsEnum(PaymentAvailableBusinessType, {
    message: `payment available business type must be one of: ${Object.values(PaymentAvailableBusinessType).join(', ')}`,
  })
  @IsNotEmpty()
  businessType?: PaymentAvailableBusinessType;

  @IsString()
  @IsOptional()
  natureOfBusiness?: string;

  @IsString()
  @IsOptional()
  businessDomicile?: string;

  @IsString()
  @IsOptional()
  dateOfRegistration?: string;
}

export class PaymentCustomerAddressDto implements IPaymentCustomerAddressDto {
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsOptional()
  streetLine1?: string;

  @IsString()
  @IsOptional()
  streetLine2?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  provinceState?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsEnum(PaymentAvailableAddressCategory, {
    message: `payment customer address category must be one of: ${Object.values(PaymentAvailableAddressCategory).join(', ')}`,
  })
  @IsNotEmpty()
  category?: PaymentAvailableAddressCategory;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}

export class PaymentCustomerKYCDocumentDto
  implements IPaymentCustomerKYCDocumentDto
{
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsEnum(PaymentAvailableCustomerKYCDocumentType, {
    message: `payment customer KYC document type must be one of: ${Object.values(PaymentAvailableCustomerKYCDocumentType).join(', ')}`,
  })
  @IsNotEmpty()
  type?: PaymentAvailableCustomerKYCDocumentType;

  @IsEnum(PaymentAvailableCustomerKYCDocumentSubType, {
    message: `payment customer KYC document sub type must be one of: ${Object.values(PaymentAvailableCustomerKYCDocumentSubType).join(', ')}`,
  })
  @IsNotEmpty()
  subType?: PaymentAvailableCustomerKYCDocumentSubType;

  @IsString()
  @IsOptional()
  documentName?: string;

  @IsString()
  @IsOptional()
  documentNumber?: string;

  @IsString()
  @IsOptional()
  expiresAt?: string;

  @IsString()
  @IsOptional()
  holderName?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  documentImages?: string[];
}
