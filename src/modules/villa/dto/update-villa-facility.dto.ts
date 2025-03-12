import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { CreateVillaFacililtyDto } from './create-villa-facility.dto';

export class UpdateVillaFacililtyDto extends PartialType(
  CreateVillaFacililtyDto,
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
