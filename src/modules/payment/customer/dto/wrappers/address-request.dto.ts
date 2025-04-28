import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { AddressRequest, AddressStatus } from 'xendit-node/customer/models';

export enum AddressStatusEnum {
  Active = 'ACTIVE',
  Deleted = 'DELETED',
  XenditEnumDefaultFallback = 'UNKNOWN_ENUM_VALUE',
}
export class AddressRequestDto implements AddressRequest {
  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  countryCode?: string;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @IsString()
  @IsOptional()
  line1?: string;

  @IsString()
  @IsOptional()
  line2?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  provinceState?: string;

  @IsEnum(AddressStatusEnum)
  @IsOptional()
  status?: AddressStatus;

  @IsString()
  @IsOptional()
  suburb?: string;
}
