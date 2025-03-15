import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVillaFacililtyDto {
  @IsUUID()
  @IsNotEmpty()
  readonly villaId?: string;

  @IsUUID()
  @IsNotEmpty()
  readonly facilityId!: string;

  @IsString()
  @IsOptional()
  readonly description?: string | null;
}
