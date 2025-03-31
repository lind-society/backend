import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVillaFacililtyDto {
  @IsUUID()
  @IsOptional()
  readonly villaId?: string;

  @IsUUID()
  @IsNotEmpty()
  readonly id!: string;

  @IsString()
  @IsOptional()
  readonly description?: string | null;
}
