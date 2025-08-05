import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  IPaymentCustomerAddressDto,
  IPaymentCustomerBusinessDetailDto,
  IPaymentCustomerIndividualDetailDto,
  IPaymentCustomerKYCDocumentDto,
  PaymentCustomerAddressDto,
  PaymentCustomerBusinessDetailDto,
  PaymentCustomerIndividualDetailDto,
  PaymentCustomerKYCDocumentDto,
} from './shared-payment-customer-field.dto';

export interface ICreatePaymentCustomerDto {
  individualDetail?: IPaymentCustomerIndividualDetailDto;
  businessDetail?: IPaymentCustomerBusinessDetailDto;
  mobileNumber?: string;
  phoneNumber?: string;
  email?: string;
  addresses?: IPaymentCustomerAddressDto[];
  kycDocuments?: IPaymentCustomerKYCDocumentDto[];
  description?: string;
  dateOfRegistration?: string;
  domicileOfRegistration?: string;
  metadata?: Record<string, any>;
}

export class CreatePaymentCustomerDto implements ICreatePaymentCustomerDto {
  @ValidateNested({ each: true })
  @Type(() => PaymentCustomerIndividualDetailDto)
  @IsOptional()
  individualDetail?: PaymentCustomerIndividualDetailDto;

  @ValidateNested({ each: true })
  @Type(() => PaymentCustomerBusinessDetailDto)
  @IsOptional()
  businessDetail?: PaymentCustomerBusinessDetailDto;

  @IsString()
  @IsOptional()
  mobileNumber?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentCustomerAddressDto)
  @IsOptional()
  addresses?: PaymentCustomerAddressDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentCustomerKYCDocumentDto)
  @IsOptional()
  kycDocuments?: PaymentCustomerKYCDocumentDto[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  dateOfRegistration?: string;

  @IsString()
  @IsOptional()
  domicileOfRegistration?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
