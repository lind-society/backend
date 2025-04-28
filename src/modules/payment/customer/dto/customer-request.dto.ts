import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  AddressRequest,
  BusinessDetail,
  CustomerRequest,
  CustomerRequestTypeEnum,
  IdentityAccountRequest,
  IndividualDetail,
  KYCDocumentRequest,
} from 'xendit-node/customer/models';
import {
  AddressRequestDto,
  BusinessDetailDto,
  CustomerRequestType,
  IdentityAccountRequestDto,
  IndividualDetailDto,
  KYCDocumentRequestDto,
} from './wrappers';

export class CustomerRequestDto implements CustomerRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressRequestDto)
  @IsOptional()
  addresses?: AddressRequest[];

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => BusinessDetailDto)
  @IsOptional()
  businessDetail?: BusinessDetail;

  @IsString()
  @IsOptional()
  clientName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IdentityAccountRequestDto)
  @IsOptional()
  identityAccounts?: IdentityAccountRequest[];

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => IndividualDetailDto)
  @IsOptional()
  individualDetail?: IndividualDetail;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KYCDocumentRequestDto)
  @IsOptional()
  kycDocuments?: KYCDocumentRequest[];

  @IsObject()
  @IsOptional()
  metadata?: object;

  @IsNumberString()
  @IsOptional()
  mobileNumber?: string;

  @IsNumberString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  referenceId: string;

  @IsEnum(CustomerRequestType)
  @IsOptional()
  type?: CustomerRequestTypeEnum;
}
