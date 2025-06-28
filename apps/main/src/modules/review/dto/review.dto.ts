import { Review } from '@apps/main/database/entities';
import { ActivityDto } from '@apps/main/modules/activity/dto';
import { VillaDto } from '@apps/main/modules/villa/dto';
import { BookingDto } from '../../booking/dto';

export interface IReviewDto
  extends Omit<Review, 'booking' | 'activity' | 'villa'> {}

export interface IReviewWithRelationsDto extends IReviewDto {
  booking?: BookingDto;
  activity?: ActivityDto;
  villa?: VillaDto;
}

export class ReviewDto implements IReviewDto {
  readonly id!: string;
  readonly rating!: number;
  readonly message!: string;
  readonly bookingId!: string | null;
  readonly activityId!: string | null;
  readonly villaId!: string | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class ReviewWithRelationsDto
  extends ReviewDto
  implements IReviewWithRelationsDto
{
  readonly booking?: BookingDto;
  readonly activity?: ActivityDto;
  readonly villa?: VillaDto;
}
