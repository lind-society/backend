import { PackageBenefitPivot } from 'src/database/entities/package-benefit-pivot.entity';
import { Package } from 'src/database/entities/package.entity';

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
