import { Review } from 'src/database/entities';
import { ActivityDto } from 'src/modules/activity/dto';
import { BookingDto } from 'src/modules/booking/dto';
import { PropertyDto } from 'src/modules/property/dto';
import { VillaDto } from 'src/modules/villa/dto';

export interface IReviewDto
  extends Omit<Review, 'activity' | 'booking' | 'property' | 'villa'> {}

export interface IReviewWithRelationsDto extends IReviewDto {
  activity?: ActivityDto;
  booking?: BookingDto;
  property?: PropertyDto;
  villa?: VillaDto;
}

export class ReviewDto implements IReviewDto {
  readonly id!: string;
  readonly rating!: number;
  readonly message!: string;
  readonly bookingId!: string;
  readonly activityId!: string | null;
  readonly propertyId!: string | null;
  readonly villaId!: string | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class ReviewWithRelationsDto
  extends ReviewDto
  implements IReviewWithRelationsDto
{
  readonly activity?: ActivityDto;
  readonly booking?: BookingDto;
  readonly property?: PropertyDto;
  readonly villa?: VillaDto;
}
