import { PackageBenefit } from '@apps/main/database/entities';
import { VillaPolicyDto } from '../../../villa/policy/dto';

export interface IPackageBenefitDto
  extends Omit<PackageBenefit, 'packageBenefits'> {}

export interface IPackageBenefitWithRelationsDto extends IPackageBenefitDto {
  benefits?: VillaPolicyDto[];
}

export class PackageBenefitDto implements IPackageBenefitDto {
  readonly id!: string;
  readonly title!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class PackageBenefitWithRelationsDto
  extends PackageBenefitDto
  implements IPackageBenefitWithRelationsDto
{
  readonly benefits?: VillaPolicyDto[];
}
