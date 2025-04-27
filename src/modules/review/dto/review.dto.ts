import { Review } from 'src/database/entities';
import { ActivityBookingDto } from 'src/modules/activity/booking/dto';
import { ActivityDto } from 'src/modules/activity/dto';
import { VillaBookingDto } from 'src/modules/villa/booking/dto';
import { VillaDto } from 'src/modules/villa/dto';

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
