import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePropertyFacililtyDto {
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
