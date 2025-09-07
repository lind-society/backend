import { ToDecimal } from '@apps/main/common/decorators';
import {
  Activity,
  ActivityBookingStatus,
  Booking,
  BookingCustomer,
  BookingPayment,
  BookingType,
  Currency,
  Review,
  Villa,
  VillaBookingStatus,
} from '@apps/main/database/entities';
import {
  BookingCustomerWithRelationsDto,
  RelatedBookingCustomerDto,
} from '@apps/main/modules/booking/customer/dto';
import {
  CurrencyDto,
  RelatedCurrencyDto,
} from '@apps/main/modules/currency/dto';
import { VillaWithRelationsDto } from '@apps/main/modules/villa/dto';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import {
  ActivityWithRelationsDto,
  RelatedActivityDto,
} from '../../activity/dto';
import { BookingPaymentWithRelationsDto } from '../../booking-payment/dto';
import { OwnerWithRelationsDto } from '../../owner/dto';
import { RelatedReviewDto, ReviewWithRelationsDto } from '../../review/dto';
import { RelatedVillaDto } from './../../villa/dto/villa.dto';

export interface IBookingDto
  extends Omit<
    Booking,
    'payments' | 'currency' | 'customer' | 'activity' | 'villa' | 'review'
  > {}

export interface IBookingWithRelationsDto extends IBookingDto {
  currency?: CurrencyDto;
  customer?: BookingCustomerWithRelationsDto;
  payments?: BookingPaymentWithRelationsDto[];
  activity?: ActivityWithRelationsDto;
  villa?: VillaWithRelationsDto;
  review?: ReviewWithRelationsDto;
}

export interface IBookingPaginationDto
  extends Omit<
    Booking,
    | 'payments'
    | 'currency'
    | 'customer'
    | 'activity'
    | 'villa'
    | 'review'
    | 'currencyId'
    | 'customerId'
    | 'activityId'
    | 'villaId'
    | 'reviewId'
  > {
  currency?: RelatedCurrencyDto;
  customer?: RelatedBookingCustomerDto;
  activity?: RelatedActivityDto;
  villa?: RelatedVillaDto;
  review?: RelatedReviewDto;
}

export interface IRelatedBookingDto
  extends Pick<
    Booking,
    | 'id'
    | 'type'
    | 'totalGuest'
    | 'totalAmount'
    | 'bookingDate'
    | 'checkInDate'
    | 'checkOutDate'
    | 'status'
  > {
  currency?: RelatedCurrencyDto;
  customer?: RelatedBookingCustomerDto;
  activity?: RelatedActivityDto;
  villa?: RelatedVillaDto;
}

export class BookingDto implements IBookingDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly type!: BookingType;

  @Expose()
  readonly totalGuest!: number;

  @Expose()
  @ToDecimal()
  readonly totalAmount!: number;

  @Expose()
  readonly bookingDate!: Date | null;

  @Expose()
  readonly checkInDate!: Date | null;

  @Expose()
  readonly checkOutDate!: Date | null;

  @Expose()
  readonly status!: ActivityBookingStatus | VillaBookingStatus | null;

  @Expose()
  readonly currencyId!: string;

  @Expose()
  readonly customerId!: string;

  @Expose()
  readonly activityId!: string | null;

  @Expose()
  readonly villaId!: string | null;

  @Expose()
  readonly reviewId!: string | null;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: Booking): BookingDto {
    return plainToInstance(BookingDto, entity);
  }

  static fromEntities(entities: Booking[]): BookingDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class BookingWithRelationsDto
  extends BookingDto
  implements IBookingWithRelationsDto
{
  @Expose()
  currency?: CurrencyDto;

  @Expose()
  customer?: BookingCustomerWithRelationsDto;

  @Expose()
  payments?: BookingPaymentWithRelationsDto[];

  @Expose()
  activity?: ActivityWithRelationsDto;

  @Expose()
  villa?: VillaWithRelationsDto;

  @Expose()
  review?: ReviewWithRelationsDto;

  static fromEntity(
    entity: Booking & {
      customer?: BookingCustomer;
      currency?: Currency;
      payments?: BookingPayment[];
      activity?: Activity;
      villa?: Villa;
      review?: Review;
    },
  ): BookingWithRelationsDto {
    const dto = plainToInstance(BookingWithRelationsDto, entity);

    if (entity.customer) {
      dto.customer = BookingCustomerWithRelationsDto.fromEntity(
        entity.customer,
      );
    }

    if (entity.currency) {
      dto.currency = CurrencyDto.fromEntity(entity.currency);
    }

    if (entity.payments) {
      dto.payments = BookingPaymentWithRelationsDto.fromEntities(
        entity.payments,
      );
    }

    if (entity.activity) {
      dto.activity = ActivityWithRelationsDto.fromEntity(entity.activity);

      if (entity.activity.owner) {
        dto.activity.owner = OwnerWithRelationsDto.fromEntity(
          entity.activity.owner,
        );
      }
    }

    if (entity.villa) {
      dto.villa = VillaWithRelationsDto.fromEntity(entity.villa);

      if (entity.villa.owner) {
        dto.villa.owner = OwnerWithRelationsDto.fromEntity(entity.villa.owner);
      }
    }

    if (entity.review) {
      dto.review = ReviewWithRelationsDto.fromEntity(entity.review);
    }

    return dto;
  }

  static fromEntities(
    entities: (Booking & {
      customer?: BookingCustomer;
      currency?: Currency;
      activity?: Activity;
      villa?: Villa;
      review?: Review;
    })[],
  ): BookingWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class BookingPaginationDto implements IBookingPaginationDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly type!: BookingType;

  @Expose()
  readonly totalGuest!: number;

  @Expose()
  @ToDecimal()
  readonly totalAmount!: number;

  @Expose()
  readonly bookingDate!: Date | null;

  @Expose()
  readonly checkInDate!: Date | null;

  @Expose()
  readonly checkOutDate!: Date | null;

  @Expose()
  readonly customerId!: string;

  @Expose()
  readonly currencyId!: string;

  @Expose()
  readonly activityId!: string | null;

  @Expose()
  readonly villaId!: string | null;

  @Expose()
  readonly reviewId!: string | null;

  @Expose()
  readonly status!: ActivityBookingStatus | VillaBookingStatus | null;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  @Expose()
  currency?: RelatedCurrencyDto;

  @Expose()
  customer?: RelatedBookingCustomerDto;

  @Expose()
  activity?: RelatedActivityDto;

  @Expose()
  villa?: RelatedVillaDto;

  @Expose()
  review?: RelatedReviewDto;

  static fromEntity(
    entity: Booking & {
      customer?: BookingCustomer;
      currency?: Currency;
      activity?: Activity;
      villa?: Villa;
      review?: Review;
    },
  ): BookingPaginationDto {
    const dto = plainToInstance(BookingPaginationDto, entity);

    if (entity.customer) {
      dto.customer = RelatedBookingCustomerDto.fromEntity(entity.customer);
    }

    if (entity.currency) {
      dto.currency = RelatedCurrencyDto.fromEntity(entity.currency);
    }

    if (entity.activity) {
      dto.activity = RelatedActivityDto.fromEntity(entity.activity);
    }

    if (entity.villa) {
      dto.villa = RelatedVillaDto.fromEntity(entity.villa);
    }

    if (entity.review) {
      dto.review = RelatedReviewDto.fromEntity(entity.review);
    }

    return dto;
  }

  static fromEntities(
    entities: (Booking & {
      customer?: BookingCustomer;
      currency?: Currency;
      activity?: Activity;
      villa?: Villa;
      review?: Review;
    })[],
  ): BookingPaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedBookingDto implements IRelatedBookingDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly type!: BookingType;

  @Expose()
  readonly totalGuest!: number;

  @Expose()
  @ToDecimal()
  readonly totalAmount!: number;

  @Expose()
  readonly bookingDate!: Date | null;

  @Expose()
  readonly checkInDate!: Date | null;

  @Expose()
  readonly checkOutDate!: Date | null;

  @Expose()
  readonly status!: ActivityBookingStatus | VillaBookingStatus | null;

  @Expose()
  currency!: RelatedCurrencyDto;

  @Expose()
  customer!: RelatedBookingCustomerDto;

  @Expose()
  activity!: RelatedActivityDto | null;

  @Expose()
  villa!: RelatedVillaDto | null;

  @Expose()
  review!: RelatedReviewDto | null;

  static fromEntity(
    entity: Booking & {
      customer?: BookingCustomer;
      currency?: Currency;
      activity?: Activity;
      villa?: Villa;
      review?: Review;
    },
  ): RelatedBookingDto {
    const dto = plainToInstance(RelatedBookingDto, entity);

    if (entity.customer) {
      dto.customer = RelatedBookingCustomerDto.fromEntity(entity.customer);
    }

    if (entity.currency) {
      dto.currency = RelatedCurrencyDto.fromEntity(entity.currency);
    }

    if (entity.activity) {
      dto.activity = RelatedActivityDto.fromEntity(entity.activity);
    }

    if (entity.villa) {
      dto.villa = RelatedVillaDto.fromEntity(entity.villa);
    }

    if (entity.review) {
      dto.review = RelatedReviewDto.fromEntity(entity.review);
    }

    return dto;
  }

  static fromEntities(
    entities: (Booking & {
      customer?: BookingCustomer;
      currency?: Currency;
      activity?: Activity;
      villa?: Villa;
      review?: Review;
    })[],
  ): RelatedBookingDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
