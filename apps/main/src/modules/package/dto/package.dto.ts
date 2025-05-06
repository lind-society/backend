import { Package, PackageBenefitPivot } from '@apps/main/database/entities';

export interface IPackageDto extends Omit<Package, 'packageBenefits'> {}

export interface IPackageWithRelationsDto extends IPackageDto {
  benefits?: PackageBenefitPivot[];
}

export class PackageDto implements IPackageDto {
  readonly id!: string;
  readonly name!: string;
  readonly description!: string | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class PackageWithRelationsDto
  extends PackageDto
  implements IPackageWithRelationsDto
{
  readonly benefits?: PackageBenefitPivot[];
}
