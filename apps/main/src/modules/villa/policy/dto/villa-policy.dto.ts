import {
  Villa,
  VillaPolicy,
  VillaPolicyType,
} from '@apps/main/database/entities';
import { IconDto } from '@apps/main/modules/shared/dto';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { RelatedVillaDto, VillaWithRelationsDto } from '../../dto';
import {
  RelatedVillaPolicyTypeDto,
  VillaPolicyTypeWithRelationsDto,
} from '../type/dto';

export interface IVillaPolicyDto
  extends Omit<VillaPolicy, 'villaPolicies' | 'type'> {}

export interface IVillaPolicyWithRelationsDto extends IVillaPolicyDto {
  type?: VillaPolicyTypeWithRelationsDto;
  villas?: VillaWithRelationsDto[];
}

export interface IVillaPolicyPaginationDto
  extends Omit<
    VillaPolicy,
    'updatedAt' | 'deletedAt' | 'villaPolicies' | 'type'
  > {
  type?: RelatedVillaPolicyTypeDto;
  villas?: RelatedVillaDto[];
}

export interface IRelatedVillaPolicyDto
  extends Pick<VillaPolicy, 'id' | 'name' | 'icon'> {
  type?: RelatedVillaPolicyTypeDto;
}

export class VillaPolicyDto implements IVillaPolicyDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly description!: string | null;

  @Expose()
  readonly icon!: IconDto | null;

  @Expose()
  readonly typeId!: string;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date;

  static fromEntity(entity: VillaPolicy): VillaPolicyDto {
    return plainToInstance(VillaPolicyDto, entity);
  }

  static fromEntities(entities: VillaPolicy[]): VillaPolicyDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class VillaPolicyWithRelationsDto
  extends VillaPolicyDto
  implements IVillaPolicyWithRelationsDto
{
  @Expose()
  type?: VillaPolicyTypeWithRelationsDto;

  @Expose()
  villas?: VillaWithRelationsDto[];

  static fromEntity(
    entity: VillaPolicy & {
      type?: VillaPolicyType;
      villas?: Villa[];
    },
  ): VillaPolicyWithRelationsDto {
    const dto = plainToInstance(VillaPolicyWithRelationsDto, entity);

    if (entity.type) {
      dto.type = VillaPolicyTypeWithRelationsDto.fromEntity(entity.type);
    }

    if (entity.villas) {
      VillaWithRelationsDto.fromEntities(entity.villas);
    }

    return dto;
  }

  static fromEntities(
    entities: (VillaPolicy & {
      type?: VillaPolicyType;
      villas?: Villa[];
    })[],
  ): VillaPolicyWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class VillaPolicyPaginationDto implements IVillaPolicyPaginationDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly description!: string | null;

  @Expose()
  readonly icon!: IconDto | null;

  @Expose()
  readonly typeId!: string;

  @Exclude()
  readonly createdAt!: Date;

  static fromEntity(entity: VillaPolicy): VillaPolicyDto {
    return plainToInstance(VillaPolicyDto, entity);
  }

  static fromEntities(entities: VillaPolicy[]): VillaPolicyDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedVillaPolicyDto implements IRelatedVillaPolicyDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly icon!: IconDto | null;

  @Expose()
  readonly type!: RelatedVillaPolicyTypeDto;

  static fromEntity(entity: VillaPolicy): RelatedVillaPolicyDto {
    return plainToInstance(RelatedVillaPolicyDto, entity);
  }

  static fromEntities(entities: VillaPolicy[]): RelatedVillaPolicyDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
