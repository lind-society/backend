import { constructPhoneNumber } from '@apps/main/common/helpers';
import {
  Activity,
  Owner,
  OwnerStatus,
  OwnerType,
  Property,
  Villa,
} from '@apps/main/database/entities';
import {
  ActivityWithRelationsDto,
  RelatedActivityDto,
} from '@apps/main/modules/activity/dto';
import {
  PropertyWithRelationsDto,
  RelatedPropertyDto,
} from '@apps/main/modules/property/dto';
import {
  RelatedVillaDto,
  VillaWithRelationsDto,
} from '@apps/main/modules/villa/dto';
import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';

export interface IOwnerDto
  extends Omit<Owner, 'activities' | 'properties' | 'villas'> {}

export interface IOwnerWithRelationDto extends IOwnerDto {
  activities?: ActivityWithRelationsDto[];
  properties?: PropertyWithRelationsDto[];
  villas?: VillaWithRelationsDto[];
}

export interface IOwnerPaginationDto
  extends Omit<
    Owner,
    'updatedAt' | 'deletedAt' | 'activities' | 'properties' | 'villas'
  > {
  activities?: RelatedActivityDto[];
  properties?: RelatedPropertyDto[];
  villas?: RelatedVillaDto[];
}

export interface IRelatedOwnerDto
  extends Pick<
    Owner,
    | 'id'
    | 'name'
    | 'type'
    | 'companyName'
    | 'phoneCountryCode'
    | 'phoneNumber'
    | 'address'
    | 'website'
    | 'status'
  > {}

export class OwnerDto implements IOwnerDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly type!: OwnerType;

  @Expose()
  readonly companyName!: string;

  @Expose()
  readonly email!: string;

  @Expose()
  readonly phoneCountryCode!: string;

  @Expose()
  readonly phoneNumber!: string;

  @Expose()
  readonly address!: string;

  @Expose()
  readonly website!: string | null;

  @Expose()
  readonly status!: OwnerStatus;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date;

  @Expose()
  formattedPhoneNumber?: string;

  static fromEntity(entity: Owner): OwnerDto {
    const dto = plainToInstance(OwnerDto, entity);

    if (dto.phoneCountryCode && dto.phoneNumber) {
      dto.formattedPhoneNumber = constructPhoneNumber(
        dto.phoneCountryCode,
        dto.phoneNumber,
      );
    }

    return dto;
  }

  static fromEntities(entities: Owner[]): OwnerDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class OwnerWithRelationsDto
  extends OwnerDto
  implements IOwnerWithRelationDto
{
  @Expose()
  activities?: ActivityWithRelationsDto[];

  @Expose()
  properties?: PropertyWithRelationsDto[];

  @Expose()
  villas?: VillaWithRelationsDto[];

  static fromEntity(
    entity: Owner & {
      activities?: Activity[];
      properties?: Property[];
      villas?: Villa[];
    },
  ): OwnerWithRelationsDto {
    const dto = plainToInstance(OwnerWithRelationsDto, entity);

    if (entity.phoneCountryCode && entity.phoneNumber) {
      dto.formattedPhoneNumber = constructPhoneNumber(
        dto.phoneCountryCode,
        dto.phoneNumber,
      );
    }

    if (entity.activities) {
      dto.activities = ActivityWithRelationsDto.fromEntities(entity.activities);
    }

    if (entity.properties) {
      dto.properties = PropertyWithRelationsDto.fromEntities(entity.properties);
    }

    if (entity.villas) {
      dto.villas = VillaWithRelationsDto.fromEntities(entity.villas);
    }

    return dto;
  }

  static fromEntities(
    entities: (Owner & {
      activities?: Activity[];
      properties?: Property[];
      villas?: Villa[];
    })[],
  ): OwnerWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class OwnerPaginationDto implements IOwnerPaginationDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly type!: OwnerType;

  @Expose()
  readonly companyName!: string;

  @Expose()
  readonly email!: string;

  @Exclude()
  readonly phoneCountryCode!: string;

  @Expose()
  @Transform(
    ({ obj }) => constructPhoneNumber(obj.phoneCountryCode, obj.phoneNumber),
    { toClassOnly: true },
  )
  readonly phoneNumber!: string;

  @Expose()
  readonly address!: string;

  @Expose()
  readonly website!: string | null;

  @Expose()
  readonly status!: OwnerStatus;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  activities?: RelatedActivityDto[];

  @Expose()
  properties?: RelatedPropertyDto[];

  @Expose()
  villas?: RelatedVillaDto[];

  static fromEntity(
    entity: Owner & {
      activities?: Activity[];
      properties?: Property[];
      villas?: Villa[];
    },
  ): OwnerPaginationDto {
    const dto = plainToInstance(OwnerPaginationDto, entity);

    if (entity.activities) {
      dto.activities = RelatedActivityDto.fromEntities(entity.activities);
    }

    if (entity.properties) {
      dto.properties = RelatedPropertyDto.fromEntities(entity.properties);
    }

    if (entity.villas) {
      dto.villas = RelatedVillaDto.fromEntities(entity.villas);
    }

    return dto;
  }

  static fromEntities(
    entities: (Owner & {
      activities?: Activity[];
      properties?: Property[];
      villas?: Villa[];
    })[],
  ): OwnerPaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedOwnerDto implements IRelatedOwnerDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly type!: OwnerType;

  @Expose()
  readonly companyName!: string;

  @Expose()
  readonly email!: string;

  @Exclude()
  readonly phoneCountryCode!: string;

  @Expose()
  @Transform(
    ({ obj }) => constructPhoneNumber(obj.phoneCountryCode, obj.phoneNumber),
    { toClassOnly: true },
  )
  readonly phoneNumber!: string;

  @Expose()
  readonly address!: string;

  @Expose()
  readonly website!: string | null;

  @Expose()
  readonly status!: OwnerStatus;

  static fromEntity(entity: Owner): RelatedOwnerDto {
    return plainToInstance(RelatedOwnerDto, entity);
  }

  static fromEntities(entities: Owner[]): RelatedOwnerDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
