import { Activity, ActivityCategory } from '@apps/main/database/entities';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { ActivityWithRelationsDto, RelatedActivityDto } from '../../dto';

export interface IActivityCategoryDto
  extends Omit<ActivityCategory, 'activities'> {}

export interface IActivityCategoryWithRelationsDto
  extends IActivityCategoryDto {
  activities?: ActivityWithRelationsDto[];
}

export interface IActivityCategoryPaginationDto
  extends Omit<ActivityCategory, 'updatedAt' | 'deletedAt' | 'activities'> {
  activities?: RelatedActivityDto[];
}

export interface IRelatedActivityCategoryDto
  extends Pick<ActivityCategory, 'id' | 'name'> {}

export class ActivityCategoryDto implements IActivityCategoryDto {
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

  static fromEntity(entity: ActivityCategory): ActivityCategoryDto {
    return plainToInstance(ActivityCategoryDto, entity);
  }

  static fromEntities(entities: ActivityCategory[]): ActivityCategoryDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class ActivityCategoryWithRelationsDto
  extends ActivityCategoryDto
  implements IActivityCategoryWithRelationsDto
{
  @Expose()
  activities?: ActivityWithRelationsDto[];

  static fromEntity(
    entity: ActivityCategory & {
      activities?: Activity[];
    },
  ): ActivityCategoryWithRelationsDto {
    const dto = plainToInstance(ActivityCategoryWithRelationsDto, entity);

    if (entity.activities) {
      dto.activities = ActivityWithRelationsDto.fromEntities(entity.activities);
    }

    return dto;
  }

  static fromEntities(
    entities: ActivityCategory[],
  ): ActivityCategoryWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class ActivityCategoryPaginationDto
  implements IActivityCategoryPaginationDto
{
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  activities?: RelatedActivityDto[];

  static fromEntity(entity: ActivityCategory): ActivityCategoryPaginationDto {
    const dto = plainToInstance(ActivityCategoryPaginationDto, entity);

    if (entity.activities) {
      dto.activities   = RelatedActivityDto.fromEntities(entity.activities);
    }

    return dto;
  }

  static fromEntities(
    entities: ActivityCategory[],
  ): ActivityCategoryPaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedActivityCategoryDto implements IRelatedActivityCategoryDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  static fromEntity(entity: ActivityCategory): RelatedActivityCategoryDto {
    const dto = plainToInstance(RelatedActivityCategoryDto, entity);

    return dto;
  }

  static fromEntities(
    entities: ActivityCategory[],
  ): RelatedActivityCategoryDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
