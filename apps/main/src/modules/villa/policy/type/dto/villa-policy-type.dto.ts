import { VillaPolicy, VillaPolicyType } from '@apps/main/database/entities';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { RelatedVillaPolicyDto, VillaPolicyWithRelationsDto } from '../../dto';

export interface IVillaPolicyTypeDto
  extends Omit<VillaPolicyType, 'policies'> {}

export interface IVillaPolicyTypeWithRelationsDto extends IVillaPolicyTypeDto {
  policies?: VillaPolicyWithRelationsDto[];
}

export interface IVillaPolicyTypePaginationDto
  extends Omit<VillaPolicyType, 'updatedAt' | 'deletedAt' | 'policies'> {
  policies?: RelatedVillaPolicyTypeDto[];
}

export interface IRelatedVillaPolicyTypeDto
  extends Pick<VillaPolicyType, 'id' | 'name'> {}

export class VillaPolicyTypeDto implements IVillaPolicyTypeDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: VillaPolicyType): VillaPolicyTypeDto {
    return plainToInstance(VillaPolicyTypeDto, entity);
  }

  static fromEntities(entities: VillaPolicyType[]): VillaPolicyTypeDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class VillaPolicyTypeWithRelationsDto
  extends VillaPolicyTypeDto
  implements IVillaPolicyTypeWithRelationsDto
{
  @Expose()
  policies?: VillaPolicyWithRelationsDto[];

  static fromEntity(
    entity: VillaPolicyType & {
      policies?: VillaPolicy[];
    },
  ): VillaPolicyTypeWithRelationsDto {
    const dto = plainToInstance(VillaPolicyTypeWithRelationsDto, entity);

    if (entity.policies) {
      VillaPolicyWithRelationsDto.fromEntities(entity.policies);
    }

    return dto;
  }

  static fromEntities(
    entities: (VillaPolicyType & {
      policies?: VillaPolicy[];
    })[],
  ): VillaPolicyTypeWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class VillaPolicyTypePaginationDto
  implements IVillaPolicyTypePaginationDto
{
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  policies?: RelatedVillaPolicyDto[];

  static fromEntity(
    entity: VillaPolicyType & {
      policies?: VillaPolicy[];
    },
  ): VillaPolicyTypePaginationDto {
    const dto = plainToInstance(VillaPolicyTypePaginationDto, entity);

    if (entity.policies) {
      RelatedVillaPolicyDto.fromEntities(entity.policies);
    }

    return dto;
  }

  static fromEntities(
    entities: (VillaPolicyType & {
      policies?: VillaPolicy[];
    })[],
  ): VillaPolicyTypePaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedVillaPolicyTypeDto implements IRelatedVillaPolicyTypeDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  static fromEntity(entity: VillaPolicyType): RelatedVillaPolicyTypeDto {
    return plainToInstance(RelatedVillaPolicyTypeDto, entity);
  }

  static fromEntities(
    entities: VillaPolicyType[],
  ): RelatedVillaPolicyTypeDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
