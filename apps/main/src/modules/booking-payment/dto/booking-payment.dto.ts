import { ToDecimal } from '@apps/main/common/decorators';
import {
  Booking,
  BookingPayment,
  BookingPaymentAvailableStatus,
  BookingPaymentFailureStage,
  BookingPaymentRefund,
  Currency,
} from '@apps/main/database/entities';
import {
  CurrencyDto,
  RelatedCurrencyDto,
} from '@apps/main/modules/currency/dto';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { BookingWithRelationsDto, RelatedBookingDto } from '../../booking/dto';
import {
  BookingPaymentRefundDto,
  BookingPaymentRefundWithRelationsDto,
  RelatedBookingPaymentRefundDto,
} from '../refund/dto';

export interface IBookingPaymentDto
  extends Omit<BookingPayment, 'booking' | 'currency' | 'refundHistories'> {}

export interface IBookingPaymentWithRelationsDto extends IBookingPaymentDto {
  booking?: BookingWithRelationsDto;
  currency?: CurrencyDto;
  refundHistories?: BookingPaymentRefundWithRelationsDto[];
}

export interface IBookingPaymentPaginationDto
  extends Omit<
    BookingPayment,
    | 'failureStage'
    | 'failureReason'
    | 'refundedAmount'
    | 'refundedReason'
    | 'cancelledReason'
    | 'paymentReferenceId'
    | 'paymentRequestReferenceId'
    | 'paymentSessionReferenceId'
    | 'paymentTokenReferenceId'
    | 'paymentRefundReferenceId'
    | 'currencyId'
    | 'bookingId'
    | 'updatedAt'
    | 'deletedAt'
    | 'booking'
    | 'currency'
    | 'refundHistories'
  > {
  booking?: RelatedBookingDto;
  currency?: RelatedCurrencyDto;
  refundHistories?: RelatedBookingPaymentRefundDto[];
}

export interface IRelatedBookingPaymentDto
  extends Pick<
    BookingPayment,
    | 'id'
    | 'paymentMethod'
    | 'paymentChannel'
    | 'failureStage'
    | 'failureReason'
    | 'refundedAmount'
    | 'refundedReason'
    | 'refundedAt'
    | 'cancelledReason'
    | 'cancelledAt'
    | 'amount'
    | 'paidAt'
    | 'status'
  > {}

export class BookingPaymentDto implements IBookingPaymentDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly paymentMethod!: string | null;

  @Expose()
  readonly paymentChannel!: string | null;

  @Expose()
  @ToDecimal(true)
  readonly amount!: number | null;

  @Expose()
  @ToDecimal(true)
  readonly status!: BookingPaymentAvailableStatus | null;

  @Expose()
  readonly failureStage: BookingPaymentFailureStage | null;

  @Expose()
  readonly failureReason: string | null;

  @Expose()
  @ToDecimal(true)
  readonly refundedAmount: number | null;

  @Expose()
  readonly refundedReason: string | null;

  @Expose()
  readonly cancelledReason: string | null;

  @Expose()
  readonly paymentReferenceId!: string | null;

  @Expose()
  readonly paymentRequestReferenceId!: string | null;

  @Expose()
  readonly paymentSessionReferenceId!: string | null;

  @Expose()
  readonly paymentTokenReferenceId!: string | null;

  @Expose()
  readonly paymentRefundReferenceId!: string | null;

  @Expose()
  readonly currencyId!: string;

  @Expose()
  readonly bookingId!: string | null;

  @Expose()
  readonly paidAt!: Date | null;

  @Expose()
  readonly refundedAt!: Date | null;

  @Expose()
  readonly cancelledAt!: Date | null;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: BookingPayment): BookingPaymentDto {
    return plainToInstance(BookingPaymentDto, entity);
  }

  static fromEntities(entities: BookingPayment[]): BookingPaymentDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class BookingPaymentWithRelationsDto
  extends BookingPaymentDto
  implements IBookingPaymentWithRelationsDto
{
  @Expose()
  booking?: BookingWithRelationsDto;

  @Expose()
  currency?: CurrencyDto;

  @Expose()
  refundHistories?: BookingPaymentRefundWithRelationsDto[];

  static fromEntity(
    entity: BookingPayment & {
      booking?: Booking;
      currency?: Currency;
      refundHistories?: BookingPaymentRefund[];
    },
  ): BookingPaymentWithRelationsDto {
    const dto = plainToInstance(BookingPaymentWithRelationsDto, entity);

    if (entity.booking) {
      dto.booking = BookingWithRelationsDto.fromEntity(entity.booking);
    }

    if (entity.currency) {
      dto.currency = CurrencyDto.fromEntity(entity.currency);
    }

    if (entity.refundHistories) {
      dto.refundHistories = BookingPaymentRefundWithRelationsDto.fromEntities(
        entity.refundHistories,
      );
    }

    return dto;
  }

  static fromEntities(
    entities: (BookingPayment & {
      booking?: Booking;
      currency?: Currency;
      refundHistories?: BookingPaymentRefundDto[];
    })[],
  ): BookingPaymentWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class BookingPaymentPaginationDto
  implements IBookingPaymentPaginationDto
{
  @Expose()
  readonly id!: string;

  @Expose()
  readonly paymentMethod!: string | null;

  @Expose()
  readonly paymentChannel!: string | null;

  @Expose()
  @ToDecimal()
  readonly amount!: number | null;

  @Expose()
  readonly status!: BookingPaymentAvailableStatus | null;

  @Expose()
  readonly paidAt!: Date | null;

  @Expose()
  readonly refundedAt!: Date | null;

  @Expose()
  readonly cancelledAt!: Date | null;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  booking?: RelatedBookingDto;

  @Expose()
  currency?: RelatedCurrencyDto;

  @Expose()
  refundHistories?: RelatedBookingPaymentRefundDto[];

  static fromEntity(
    entity: BookingPayment & {
      booking?: Booking;
      currency?: Currency;
      refundHistories?: BookingPaymentRefundDto[];
    },
  ): BookingPaymentPaginationDto {
    const dto = plainToInstance(BookingPaymentPaginationDto, entity);

    if (entity.booking) {
      dto.booking = RelatedBookingDto.fromEntity(entity.booking);
    }

    if (entity.currency) {
      dto.currency = RelatedCurrencyDto.fromEntity(entity.currency);
    }

    if (entity.refundHistories) {
      dto.refundHistories = RelatedBookingPaymentRefundDto.fromEntities(
        entity.refundHistories,
      );
    }

    return dto;
  }

  static fromEntities(
    entities: (BookingPayment & {
      booking?: Booking;
      currency?: Currency;
      refundHistories?: BookingPaymentRefundDto[];
    })[],
  ): BookingPaymentPaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedBookingPaymentDto implements IRelatedBookingPaymentDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly paymentMethod!: string | null;

  @Expose()
  readonly paymentChannel!: string | null;

  @Expose()
  readonly amount!: number | null;

  @Expose()
  readonly status!: BookingPaymentAvailableStatus | null;

  @Expose()
  readonly failureStage: BookingPaymentFailureStage | null;

  @Expose()
  readonly failureReason: string | null;

  @Expose()
  readonly refundedAmount: number | null;

  @Expose()
  readonly refundedReason: string | null;

  @Expose()
  readonly cancelledReason: string | null;

  @Expose()
  readonly paidAt!: Date | null;

  @Expose()
  readonly refundedAt!: Date | null;

  @Expose()
  readonly cancelledAt!: Date | null;

  @Expose()
  currency!: RelatedCurrencyDto;

  static fromEntity(
    entity: BookingPayment & {
      currency?: Currency;
    },
  ): RelatedBookingPaymentDto {
    const dto = plainToInstance(RelatedBookingPaymentDto, entity);

    if (entity.currency) {
      dto.currency = RelatedCurrencyDto.fromEntity(entity.currency);
    }

    return dto;
  }

  static fromEntities(
    entities: (BookingPayment & {
      currency?: Currency;
    })[],
  ): RelatedBookingPaymentDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
