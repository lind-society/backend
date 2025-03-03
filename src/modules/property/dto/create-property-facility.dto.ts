import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreatePropertyFacililtyDto {
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
