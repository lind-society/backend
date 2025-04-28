import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  BusinessDetail,
  BusinessDetailBusinessTypeEnum,
} from 'xendit-node/customer/models';

export enum BusinessDetailBusinessType {
  Corporation = 'CORPORATION',
  SoleProprietor = 'SOLE_PROPRIETOR',
  Partnership = 'PARTNERSHIP',
  Cooperative = 'COOPERATIVE',
  Trust = 'TRUST',
  NonProfit = 'NON_PROFIT',
  Government = 'GOVERNMENT',
}
export class BusinessDetailDto implements BusinessDetail {
  @IsString()
  @IsOptional()
  businessDomicile?: string;

  @IsString()
  @IsOptional()
  businessName?: string;

  @IsEnum(BusinessDetailBusinessType)
  @IsOptional()
  businessType?: BusinessDetailBusinessTypeEnum;

  @IsString()
  @IsOptional()
  dateOfRegistration?: string;

  @IsString()
  @IsOptional()
  natureOfBusiness?: string;
}
