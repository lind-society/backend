import { Type } from 'class-transformer';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  EmploymentDetail,
  IndividualDetail,
  IndividualDetailGenderEnum,
} from 'xendit-node/customer/models';

export enum IndividualDetailGender {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER',
}

export class EmploymentDetailDto implements EmploymentDetail {
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

export class IndividualDetailDto implements IndividualDetail {
  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => EmploymentDetailDto)
  @IsOptional()
  employment?: EmploymentDetail;

  @IsEnum(IndividualDetailGender)
  @IsOptional()
  gender?: IndividualDetailGenderEnum;

  @IsString()
  @IsOptional()
  givenNames?: string;

  @IsString()
  @IsOptional()
  givenNamesNonRoman?: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  motherMaidenName?: string;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsOptional()
  placeOfBirth?: string;

  @IsString()
  @IsOptional()
  surname?: string;

  @IsString()
  @IsOptional()
  surnameNonRoman?: string;
}
