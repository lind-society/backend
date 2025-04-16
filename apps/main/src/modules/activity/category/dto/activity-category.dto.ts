import { ActivityCategory } from '@apps/main/database/entities';
import { ActivityDto } from '../../dto';

export interface IActivityCategoryDto
  extends Omit<ActivityCategory, 'activities'> {}

export interface IActivityCategoryWithRelationsDto
  extends IActivityCategoryDto {
  activities: ActivityDto[];
}

export class ActivityCategoryDto implements IActivityCategoryDto {
  readonly id!: string;
  readonly name!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class ActivityCategoryWithRelationsDto
  extends ActivityCategoryDto
  implements IActivityCategoryDto
{
  readonly activities?: ActivityDto[];
}
