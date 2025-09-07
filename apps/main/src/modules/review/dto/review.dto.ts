import { ToDecimal } from '@apps/main/common/decorators';
import { Activity, Booking, Review, Villa } from '@apps/main/database/entities';
import {
  ActivityWithRelationsDto,
  RelatedActivityDto,
} from '@apps/main/modules/activity/dto';
import {
  RelatedVillaDto,
  VillaWithRelationsDto,
} from '@apps/main/modules/villa/dto';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { BookingWithRelationsDto, RelatedBookingDto } from '../../booking/dto';

export interface IReviewDto
  extends Omit<Review, 'booking' | 'activity' | 'villa'> {}

export interface IReviewWithRelationsDto extends IReviewDto {
  booking?: BookingWithRelationsDto;
  activity?: ActivityWithRelationsDto;
  villa?: VillaWithRelationsDto;
}

export interface IReviewPaginationDto
  extends Omit<
    Review,
    'updatedAt' | 'deletedAt' | 'booking' | 'activity' | 'villa'
  > {
  booking?: RelatedBookingDto;
  activity?: RelatedActivityDto;
  villa?: RelatedVillaDto;
}

export interface IRelatedReviewDto
  extends Pick<Review, 'id' | 'rating' | 'message'> {
  customerId?: string;
  customerName?: string;
}

export class ReviewDto implements IReviewDto {
  @Expose()
  readonly id!: string;

  @Expose()
  @ToDecimal()
  readonly rating!: number;

  @Expose()
  readonly message!: string;

  @Expose()
  readonly bookingId!: string | null;

  @Expose()
  readonly activityId!: string | null;

  @Expose()
  readonly villaId!: string | null;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date;

  static fromEntity(entity: Review): ReviewDto {
    return plainToInstance(ReviewDto, entity);
  }

  static fromEntities(entities: Review[]): ReviewDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class ReviewWithRelationsDto
  extends ReviewDto
  implements IReviewWithRelationsDto
{
  @Expose()
  booking?: BookingWithRelationsDto;

  @Expose()
  activity?: ActivityWithRelationsDto;

  @Expose()
  villa?: VillaWithRelationsDto;

  static fromEntity(
    entity: Review & {
      booking: Booking;
      activity: Activity;
      villa: Villa;
    },
  ): ReviewWithRelationsDto {
    const dto = plainToInstance(ReviewWithRelationsDto, entity);

    if (entity.booking) {
      dto.booking = BookingWithRelationsDto.fromEntity(entity.booking);
    }

    if (entity.activity) {
      dto.activity = ActivityWithRelationsDto.fromEntity(entity.activity);
    }

    if (entity.villa) {
      dto.villa = VillaWithRelationsDto.fromEntity(entity.villa);
    }

    return dto;
  }

  static fromEntities(
    entities: (Review & {
      booking: Booking;
      activity: Activity;
      villa: Villa;
    })[],
  ): ReviewWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class ReviewPaginationDto implements IReviewPaginationDto {
  @Expose()
  readonly id!: string;

  @Expose()
  @ToDecimal()
  readonly rating!: number;

  @Expose()
  readonly message!: string;

  @Exclude()
  readonly bookingId!: string | null;

  @Exclude()
  readonly activityId!: string | null;

  @Exclude()
  readonly villaId!: string | null;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  booking?: RelatedBookingDto;

  @Expose()
  activity?: RelatedActivityDto;

  @Expose()
  villa?: RelatedVillaDto;

  static fromEntity(
    entity: Review & {
      booking: Booking;
      activity: Activity;
      villa: Villa;
    },
  ): ReviewPaginationDto {
    const dto = plainToInstance(ReviewPaginationDto, entity);

    if (entity.booking) {
      dto.booking = RelatedBookingDto.fromEntity(entity.booking);
    }

    if (entity.activity) {
      dto.activity = RelatedActivityDto.fromEntity(entity.activity);
    }

    if (entity.villa) {
      dto.villa = RelatedVillaDto.fromEntity(entity.villa);
    }

    return dto;
  }

  static fromEntities(
    entities: (Review & {
      booking: Booking;
      activity: Activity;
      villa: Villa;
    })[],
  ): ReviewPaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedReviewDto implements IRelatedReviewDto {
  @Expose()
  readonly id!: string;

  @Expose()
  @ToDecimal()
  readonly rating!: number;

  @Expose()
  readonly message!: string;

  @Expose()
  customerId!: string;

  @Expose()
  customerName!: string;

  static fromEntity(entity: Review & { booking: Booking }): RelatedReviewDto {
    const dto = plainToInstance(RelatedReviewDto, entity);

    if (entity.booking) {
      const {
        customer: { id: customerId, name: customerName },
      } = RelatedBookingDto.fromEntity(entity.booking);

      dto.customerId = customerId;
      dto.customerName = customerName;
    }

    return dto;
  }

  static fromEntities(
    entities: (Review & { booking: Booking })[],
  ): RelatedReviewDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
