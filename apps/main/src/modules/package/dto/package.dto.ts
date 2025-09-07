import { Package, PackageBenefitPivot } from '@apps/main/database/entities';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { omit } from 'lodash';
import {
  PackageBenefitWithRelationsDto,
  RelatedPackageBenefitDto,
} from '../benefit/dto';

export interface IPackageDto extends Omit<Package, 'packageBenefits'> {}

export interface IPackageWithRelationsDto extends IPackageDto {
  benefits?: PackageBenefitWithRelationsDto[];
}

export interface IPackagePaginationDto
  extends Omit<
    Package,
    'description' | 'updatedAt' | 'deletedAt' | 'packageBenefits'
  > {
  benefits?: RelatedPackageBenefitDto[];
}

export interface IRelatedPackageDto extends Pick<Package, 'id' | 'name'> {}

export class PackageDto implements IPackageDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly description!: string | null;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: Package): PackageDto {
    return plainToInstance(PackageDto, entity);
  }

  static fromEntities(entities: Package[]): PackageDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class PackageWithRelationsDto
  extends PackageDto
  implements IPackageWithRelationsDto
{
  @Expose()
  benefits?: PackageBenefitWithRelationsDto[];

  static fromEntity(
    entity: Package & {
      benefits?: PackageBenefitPivot[];
    },
  ): PackageWithRelationsDto {
    const dto = plainToInstance(PackageWithRelationsDto, {
      ...omit(entity, ['packageBenefits']),
    });

    if (entity.packageBenefits) {
      dto.benefits = entity.packageBenefits.map(({ id: pivotId, benefit }) => ({
        ...PackageBenefitWithRelationsDto.fromEntity(benefit),
        pivotId,
      }));
    }

    return dto;
  }

  static fromEntities(
    entities: (Package & {
      benefits?: PackageBenefitPivot[];
    })[],
  ): PackageWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class PackagePaginationDto implements IPackagePaginationDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  benefits?: RelatedPackageBenefitDto[];

  static fromEntity(
    entity: Package & {
      benefits?: PackageBenefitPivot[];
    },
  ): PackagePaginationDto {
    const dto = plainToInstance(PackagePaginationDto, {
      ...omit(entity, ['packageBenefits']),
    });

    if (entity.packageBenefits) {
      dto.benefits = entity.packageBenefits.map(({ id: pivotId, benefit }) => ({
        ...RelatedPackageBenefitDto.fromEntity(benefit),
        pivotId,
      }));
    }

    return dto;
  }

  static fromEntities(
    entities: (Package & {
      benefits?: PackageBenefitPivot[];
    })[],
  ): PackagePaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedPackageDto implements IRelatedPackageDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  static fromEntity(entity: Package): RelatedPackageDto {
    return plainToInstance(RelatedPackageDto, entity);
  }

  static fromEntities(entities: Package[]): RelatedPackageDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
