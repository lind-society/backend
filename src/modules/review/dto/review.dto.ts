import { Review } from 'src/database/entities';
import { ActivityDto } from 'src/modules/activity/dto';
import { PropertyDto } from 'src/modules/property/dto';
import { VillaDto } from 'src/modules/villa/dto';

export interface IReviewDto
  extends Omit<Review, 'activity' | 'property' | 'villa'> {}

export interface IReviewWithRelationsDto extends IReviewDto {
  activity?: ActivityDto;
  property?: PropertyDto;
  villa?: VillaDto;
}

export class ReviewDto implements IReviewDto {
  readonly id!: string;
  readonly name!: string | null;
  readonly country!: string | null;
  readonly checkIn!: Date | null;
  readonly checkOut!: Date | null;
  readonly rating!: number;
  readonly message!: string;
  readonly bookingId!: string | null;
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
  readonly property?: PropertyDto;
  readonly villa?: VillaDto;
}
