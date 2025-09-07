import {
  PackageBenefit,
  PackageBenefitPivot,
} from '@apps/main/database/entities';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { omit } from 'lodash';
import { PackageWithRelationsDto, RelatedPackageDto } from '../../dto';

export interface IPackageBenefitDto
  extends Omit<PackageBenefit, 'packageBenefits'> {}

export interface IPackageBenefitWithRelationsDto extends IPackageBenefitDto {
  packages?: PackageWithRelationsDto[];
}

export interface IPackageBenefitPaginationDto
  extends Omit<PackageBenefit, 'updatedAt' | 'deletedAt' | 'packageBenefits'> {
  packages?: RelatedPackageDto[];
}

export interface IRelatedPackageBenefitDto
  extends Pick<PackageBenefit, 'id' | 'title'> {}

export class PackageBenefitDto implements IPackageBenefitDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly title!: string;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: PackageBenefit): PackageBenefitDto {
    return plainToInstance(PackageBenefitDto, entity);
  }

  static fromEntities(entities: PackageBenefit[]): PackageBenefitDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class PackageBenefitWithRelationsDto
  extends PackageBenefitDto
  implements IPackageBenefitWithRelationsDto
{
  @Expose()
  packages?: PackageWithRelationsDto[];

  static fromEntity(
    entity: PackageBenefit & {
      packages?: PackageBenefitPivot[];
    },
  ): PackageBenefitWithRelationsDto {
    const dto = plainToInstance(PackageBenefitWithRelationsDto, {
      ...omit(entity, ['packageBenefits']),
    });

    if (entity.packageBenefits) {
      dto.packages = entity.packageBenefits.map(
        ({ id: pivotId, package: pkg }) => ({
          ...PackageWithRelationsDto.fromEntity(pkg),
          pivotId,
        }),
      );
    }

    return dto;
  }

  static fromEntities(
    entities: (PackageBenefit & {
      packages?: PackageBenefitPivot[];
    })[],
  ): PackageBenefitWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class PackageBenefitPaginationDto
  implements IPackageBenefitPaginationDto
{
  @Expose()
  readonly id!: string;

  @Expose()
  readonly title!: string;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  packages?: RelatedPackageDto[];

  static fromEntity(
    entity: PackageBenefit & {
      packages?: PackageBenefitPivot[];
    },
  ): PackageBenefitPaginationDto {
    const dto = plainToInstance(PackageBenefitPaginationDto, {
      ...omit(entity, ['packageBenefits']),
    });

    if (entity.packageBenefits) {
      dto.packages = entity.packageBenefits.map(
        ({ id: pivotId, package: pkg }) => ({
          ...PackageWithRelationsDto.fromEntity(pkg),
          pivotId,
        }),
      );
    }

    return dto;
  }

  static fromEntities(
    entities: (PackageBenefit & {
      packages?: PackageBenefitPivot[];
    })[],
  ): PackageBenefitPaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedPackageBenefitDto implements IRelatedPackageBenefitDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly title!: string;

  static fromEntity(entity: PackageBenefit): RelatedPackageBenefitDto {
    return plainToInstance(RelatedPackageBenefitDto, entity);
  }

  static fromEntities(entities: PackageBenefit[]): RelatedPackageBenefitDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
