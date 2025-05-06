import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVillaFacililtyPivotDto {
  @IsUUID()
  @IsOptional()
  readonly villaId?: string;

  @IsUUID()
  @IsNotEmpty()
  readonly id!: string;

  @IsString()
  @IsOptional()
  readonly description?: string;
}
