import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { CreatePropertyFacililtyDto } from './create-property-facility.dto';

export class UpdatePropertyFacililtyDto extends PartialType(
  CreatePropertyFacililtyDto,
) {
  @IsUUID()
  @IsNotEmpty()
  readonly propertyId!: string;

  @IsUUID()
  @IsNotEmpty()
  readonly facilityId!: string;

  @IsUUID()
  @IsOptional()
  readonly description?: string | null;
}
