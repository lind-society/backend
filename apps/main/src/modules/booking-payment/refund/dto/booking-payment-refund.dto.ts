import { ToDecimal } from '@apps/main/common/decorators';
import {
  BookingPayment,
  BookingPaymentRefund,
  BookingPaymentRefundStatus,
  Currency,
} from '@apps/main/database/entities';
import {
  CurrencyDto,
  RelatedCurrencyDto,
} from '@apps/main/modules/currency/dto';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import {
  BookingPaymentWithRelationsDto,
  RelatedBookingPaymentDto,
} from '../../dto/booking-payment.dto';

export interface IBookingPaymentRefundDto
  extends Omit<BookingPaymentRefund, 'currency' | 'bookingPayment'> {}

export interface IBookingPaymentRefundWithRelationsDto
  extends IBookingPaymentRefundDto {
  currency?: CurrencyDto;
  bookingPayment?: BookingPaymentWithRelationsDto;
}

export interface IBookingPaymentRefundPaginationDto
  extends Omit<
    BookingPaymentRefund,
    | 'failureReason'
    | 'paymentRefundRequestReferenceId'
    | 'bookingPaymentId'
    | 'currencyId'
    | 'updatedAt'
    | 'deletedAt'
    | 'currency'
    | 'bookingPayment'
  > {
  currency?: RelatedCurrencyDto;
  bookingPayment?: RelatedBookingPaymentDto;
}

export interface IRelatedBookingPaymentRefundDto
  extends Pick<BookingPaymentRefund, 'id' | 'amount' | 'reason' | 'status'> {}

export class BookingPaymentRefundDto implements IBookingPaymentRefundDto {
  @Expose()
  readonly id!: string;

  @Expose()
  @ToDecimal()
  readonly amount: number | null;

  @Expose()
  readonly reason: string;

  @Expose()
  readonly status: BookingPaymentRefundStatus;

  @Expose()
  readonly failureReason: string | null;

  @Expose()
  readonly currencyId: string;

  @Expose()
  readonly bookingPaymentId: string;

  @Expose()
  readonly paymentRefundRequestReferenceId: string;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  static fromEntity(entity: BookingPaymentRefund): BookingPaymentRefundDto {
    return plainToInstance(BookingPaymentRefundDto, entity);
  }

  static fromEntities(
    entities: BookingPaymentRefund[],
  ): BookingPaymentRefundDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class BookingPaymentRefundWithRelationsDto
  extends BookingPaymentRefundDto
  implements IBookingPaymentRefundWithRelationsDto
{
  @Expose()
  currency?: CurrencyDto;

  @Expose()
  bookingPayment?: BookingPaymentWithRelationsDto;

  static fromEntity(
    entity: BookingPaymentRefund & {
      currency?: Currency;
      bookingPayment?: BookingPayment;
    },
  ): BookingPaymentRefundWithRelationsDto {
    const dto = plainToInstance(BookingPaymentRefundWithRelationsDto, entity);

    if (entity.currency) {
      dto.currency = CurrencyDto.fromEntity(entity.currency);
    }

    if (entity.bookingPayment) {
      dto.bookingPayment = BookingPaymentWithRelationsDto.fromEntity(
        entity.bookingPayment,
      );
    }

    return dto;
  }

  static fromEntities(
    entities: (BookingPaymentRefund & {
      currency?: Currency;
      bookingPayment?: BookingPayment;
    })[],
  ): BookingPaymentRefundWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class BookingPaymentRefundPaginationDto
  implements IBookingPaymentRefundPaginationDto
{
  @Expose()
  readonly id!: string;

  @Expose()
  @ToDecimal()
  readonly amount: number | null;

  @Expose()
  readonly reason: string;

  @Expose()
  readonly status: BookingPaymentRefundStatus;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  currency?: RelatedCurrencyDto;

  @Expose()
  bookingPayment?: RelatedBookingPaymentDto;

  static fromEntity(
    entity: BookingPaymentRefund & {
      currency?: Currency;
      bookingPayment?: BookingPayment;
    },
  ): BookingPaymentRefundPaginationDto {
    const dto = plainToInstance(BookingPaymentRefundPaginationDto, entity);

    if (entity.currency) {
      dto.currency = RelatedCurrencyDto.fromEntity(entity.currency);
    }

    if (entity.bookingPayment) {
      dto.bookingPayment = RelatedBookingPaymentDto.fromEntity(
        entity.bookingPayment,
      );
    }

    return dto;
  }

  static fromEntities(
    entities: (BookingPaymentRefund & {
      currency?: Currency;
      bookingPayment?: BookingPayment;
    })[],
  ): BookingPaymentRefundPaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export interface IRelatedBookingPaymentRefundDto
  extends Pick<BookingPaymentRefund, 'id' | 'amount' | 'reason' | 'status'> {}

export class RelatedBookingPaymentRefundDto
  implements IRelatedBookingPaymentRefundDto
{
  @Expose()
  readonly id!: string;

  @Expose()
  @ToDecimal()
  readonly amount: number | null;

  @Expose()
  readonly reason: string;

  @Expose()
  readonly status: BookingPaymentRefundStatus;

  static fromEntity(
    entity: BookingPaymentRefund,
  ): RelatedBookingPaymentRefundDto {
    return plainToInstance(RelatedBookingPaymentRefundDto, entity);
  }

  static fromEntities(
    entities: BookingPaymentRefund[],
  ): RelatedBookingPaymentRefundDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
