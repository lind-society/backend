import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePropertyFacililtyPivotDto {
  @IsUUID()
  @IsOptional()
  readonly propertyId?: string;

  @IsUUID()
  @IsNotEmpty()
  readonly id!: string;

  @IsString()
  @IsOptional()
  readonly description?: string;
}
