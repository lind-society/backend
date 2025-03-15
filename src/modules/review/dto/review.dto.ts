import { Review } from 'src/database/entities';
import { VillaDto } from 'src/modules/villa/dto';

export interface IReviewDto extends Omit<Review, 'villa'> {}

export interface IReviewWithRelationsDto extends IReviewDto {
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
  readonly villaId!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class ReviewWithRelationsDto
  extends ReviewDto
  implements IReviewWithRelationsDto
{
  readonly villa?: VillaDto;
}
