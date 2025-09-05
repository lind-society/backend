import {
  Additional,
  AdditionalType,
  Property,
  Villa,
} from '@apps/main/database/entities';
import {
  PropertyWithRelationsDto,
  RelatedPropertyDto,
} from '@apps/main/modules/property/dto/property.dto';
import {
  RelatedVillaDto,
  VillaWithRelationsDto,
} from '@apps/main/modules/villa/dto';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

export interface IAdditionalDto
  extends Omit<Additional, 'propertyAdditionals' | 'villaAdditionals'> {}

export interface IAdditionalWithRelationsDto extends IAdditionalDto {
  properties?: PropertyWithRelationsDto[];
  villas?: VillaWithRelationsDto[];
}

export interface IAdditionalPaginationDto
  extends Omit<
    Additional,
    'updatedAt' | 'deletedAt' | 'propertyAdditionals' | 'villaAdditionals'
  > {
  properties?: RelatedPropertyDto[];
  villas?: RelatedVillaDto[];
}

export interface IRelatedAdditionalDto
  extends Pick<Additional, 'id' | 'name' | 'type'> {}

export class AdditionalDto implements IAdditionalDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly type!: AdditionalType;

  @Expose()
  readonly description!: string | null;

  @Expose()
  readonly photos!: string[] | null;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: Additional): AdditionalDto {
    return plainToInstance(AdditionalDto, entity);
  }

  static fromEntities(entities: Additional[]): AdditionalDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class AdditionalWithRelationsDto
  extends AdditionalDto
  implements IAdditionalWithRelationsDto
{
  @Expose()
  properties?: PropertyWithRelationsDto[];

  @Expose()
  villas?: VillaWithRelationsDto[];

  static fromEntity(
    entity: Additional & {
      properties?: Property[];
      villas?: Villa[];
    },
  ): AdditionalWithRelationsDto {
    const dto = plainToInstance(AdditionalWithRelationsDto, entity);

    if (entity.properties) {
      dto.properties = PropertyWithRelationsDto.fromEntities(entity.properties);
    }

    if (entity.villas) {
      dto.villas = VillaWithRelationsDto.fromEntities(entity.villas);
    }

    return dto;
  }

  static fromEntities(
    entities: (Additional & {
      properties: Property[];
      villas: Villa[];
    })[],
  ): AdditionalDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class AdditionalPaginationDto implements IAdditionalPaginationDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly type!: AdditionalType;

  @Expose()
  readonly description!: string | null;

  @Expose()
  readonly photos!: string[] | null;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  properties?: RelatedPropertyDto[];

  @Expose()
  villas?: RelatedVillaDto[];

  static fromEntity(
    entity: Additional & {
      properties?: Property[];
      villas?: Villa[];
    },
  ): AdditionalPaginationDto {
    const dto = plainToInstance(AdditionalPaginationDto, entity);

    if (entity.properties) {
      dto.properties = RelatedPropertyDto.fromEntities(entity.properties);
    }

    if (entity.villas) {
      dto.villas = VillaWithRelationsDto.fromEntities(entity.villas);
    }

    return dto;
  }

  // static fromEntity(
  //   entity: Additional & {
  //     properties?: PropertyAdditionalPivot[];
  //     villas?: VillaAdditionalPivot[];
  //   },
  // ): AdditionalPaginationDto {
  //   const dto = plainToInstance(AdditionalPaginationDto, entity);

  //   if (entity.properties) {
  //     dto.properties = entity.propertyAdditionals.map(
  //       ({ id: pivotId, property }) => ({
  //         pivotId,
  //         id: property.id,
  //         name: property.name,
  //       }),
  //     );
  //   }

  //   if (entity.villas) {
  //     dto.villas = entity.villaAdditionals.map(({ id: pivotId, villa }) => ({
  //       pivotId,
  //       id: villa.id,
  //       name: villa.name,
  //     }));
  //   }

  //   return dto;
  // }

  static fromEntities(
    entities: (Additional & {
      properties?: Property[];
      villas?: Villa[];
    })[],
  ): AdditionalPaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedAdditionalDto implements IRelatedAdditionalDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly type!: AdditionalType;

  static fromEntity(entity: Additional): RelatedAdditionalDto {
    return plainToInstance(RelatedAdditionalDto, entity);
  }

  static fromEntities(entities: Additional[]): RelatedAdditionalDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
