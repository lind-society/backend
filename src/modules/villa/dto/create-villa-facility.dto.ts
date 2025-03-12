import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVillaFacililtyDto {
  @IsUUID()
  @IsOptional()
  readonly villaId?: string | null;

  @IsUUID()
  @IsNotEmpty()
  readonly facilityId!: string;

  @IsString()
  @IsOptional()
  readonly description?: string | null;
}
