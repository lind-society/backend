import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  KYCDocumentRequest,
  KYCDocumentSubType,
  KYCDocumentType,
} from 'xendit-node/customer/models';

export enum KYCDocumentSubTypeEnum {
  NationalId = 'NATIONAL_ID',
  ConsularId = 'CONSULAR_ID',
  VoterId = 'VOTER_ID',
  PostalId = 'POSTAL_ID',
  ResidencePermit = 'RESIDENCE_PERMIT',
  TaxId = 'TAX_ID',
  StudentId = 'STUDENT_ID',
  MilitaryId = 'MILITARY_ID',
  MedicalId = 'MEDICAL_ID',
  Others = 'OTHERS',
  XenditEnumDefaultFallback = 'UNKNOWN_ENUM_VALUE',
}

export enum KYCDocumentTypeEnum {
  BirthCertificate = 'BIRTH_CERTIFICATE',
  BankStatement = 'BANK_STATEMENT',
  DrivingLicense = 'DRIVING_LICENSE',
  IdentityCard = 'IDENTITY_CARD',
  Passport = 'PASSPORT',
  Visa = 'VISA',
  BusinessRegistration = 'BUSINESS_REGISTRATION',
  BusinessLicense = 'BUSINESS_LICENSE',
  XenditEnumDefaultFallback = 'UNKNOWN_ENUM_VALUE',
}
export class KYCDocumentRequestDto implements KYCDocumentRequest {
  @IsString()
  @IsOptional()
  country?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  documentImages?: string[];

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

  @IsEnum(KYCDocumentSubTypeEnum)
  @IsOptional()
  subType?: KYCDocumentSubType;

  @IsEnum(KYCDocumentTypeEnum)
  @IsOptional()
  type?: KYCDocumentType;
}
