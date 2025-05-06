import { Review } from '@apps/main/database/entities';
import { ActivityDto } from '@apps/main/modules/activity/dto';
import { ActivityBookingDto } from '@apps/main/modules/booking/activity-booking/dto';
import { VillaBookingDto } from '@apps/main/modules/booking/villa-booking/dto';
import { VillaDto } from '@apps/main/modules/villa/dto';

export interface IReviewDto
  extends Omit<
    Review,
    'activityBooking' | 'villaBooking' | 'activity' | 'villa'
  > {}

export interface IReviewWithRelationsDto extends IReviewDto {
  activityBooking?: ActivityBookingDto;
  villaBooking?: VillaBookingDto;
  activity?: ActivityDto;
  villa?: VillaDto;
}

export class ReviewDto implements IReviewDto {
  readonly id!: string;
  readonly rating!: number;
  readonly message!: string;
  readonly activityBookingId!: string | null;
  readonly villaBookingId!: string | null;
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
  readonly activityBooking?: ActivityBookingDto;
  readonly villaBooking?: VillaBookingDto;
  readonly activity?: ActivityDto;
  readonly villa?: VillaDto;
}
