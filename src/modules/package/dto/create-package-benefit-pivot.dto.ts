import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreatePackageBenefitPivotDto {
  @IsUUID()
  @IsOptional()
  readonly packageId?: string;

  @IsUUID()
  @IsNotEmpty()
  readonly id!: string;
}
