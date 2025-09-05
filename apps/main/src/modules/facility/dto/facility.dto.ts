import {
  Facility,
  FacilityType,
  Property,
  Villa,
} from '@apps/main/database/entities';
import {
  PropertyWithRelationsDto,
  RelatedPropertyDto,
} from '@apps/main/modules/property/dto/property.dto';
import { IconDto } from '@apps/main/modules/shared/dto';
import {
  RelatedVillaDto,
  VillaWithRelationsDto,
} from '@apps/main/modules/villa/dto';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

export interface IFacilityDto
  extends Omit<Facility, 'propertyFacilities' | 'villaFacilities'> {}

export interface IFacilityWithRelationsDto extends IFacilityDto {
  properties?: PropertyWithRelationsDto[];
  villas?: VillaWithRelationsDto[];
}

export interface IFacilityPaginationDto
  extends Omit<
    Facility,
    'updatedAt' | 'deletedAt' | 'propertyFacilities' | 'villaFacilities'
  > {
  properties?: RelatedPropertyDto[];
  villas?: RelatedVillaDto[];
}

export interface IRelatedFacilityDto
  extends Pick<Facility, 'id' | 'name' | 'icon' | 'type'> {}

export class FacilityDto implements IFacilityDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly icon!: IconDto | null;

  @Expose()
  readonly type!: FacilityType;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: Facility): FacilityDto {
    return plainToInstance(FacilityDto, entity);
  }

  static fromEntities(entities: Facility[]): FacilityDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class FacilityWithRelationsDto
  extends FacilityDto
  implements IFacilityWithRelationsDto
{
  @Expose()
  properties?: PropertyWithRelationsDto[];

  @Expose()
  villas?: VillaWithRelationsDto[];

  static fromEntity(
    entity: Facility & {
      properties?: Property[];
      villas?: Villa[];
    },
  ): FacilityWithRelationsDto {
    const dto = plainToInstance(FacilityWithRelationsDto, entity);

    if (entity.properties) {
      dto.properties = PropertyWithRelationsDto.fromEntities(entity.properties);
    }

    if (entity.villas) {
      dto.villas = VillaWithRelationsDto.fromEntities(entity.villas);
    }

    return dto;
  }

  static fromEntities(
    entities: (Facility & {
      properties?: Property[];
      villas?: Villa[];
    })[],
  ): FacilityWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class FacilityPaginationDto implements IFacilityPaginationDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly icon!: IconDto | null;

  @Expose()
  readonly type!: FacilityType;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  properties?: RelatedPropertyDto[];

  @Expose()
  villas?: RelatedVillaDto[];

  static fromEntity(
    entity: Facility & {
      properties?: Property[];
      villas?: Villa[];
    },
  ): FacilityPaginationDto {
    const dto = plainToInstance(FacilityPaginationDto, entity);

    if (entity.properties) {
      dto.properties = RelatedPropertyDto.fromEntities(entity.properties);
    }

    if (entity.villas) {
      dto.villas = VillaWithRelationsDto.fromEntities(entity.villas);
    }

    return dto;
  }

  static fromEntities(
    entities: (Facility & {
      properties?: Property[];
      villas?: Villa[];
    })[],
  ): FacilityPaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedFacilityDto implements IRelatedFacilityDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly icon!: IconDto | null;

  @Expose()
  readonly type!: FacilityType;

  static fromEntity(entity: Facility): RelatedFacilityDto {
    return plainToInstance(RelatedFacilityDto, entity);
  }

  static fromEntities(entities: Facility[]): RelatedFacilityDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
