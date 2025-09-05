import { constructPhoneNumber } from '@apps/main/common/helpers';
import { Booking, BookingCustomer } from '@apps/main/database/entities';
import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { BookingWithRelationsDto, RelatedBookingDto } from '../../dto';

export interface IBookingCustomerDto
  extends Omit<BookingCustomer, 'bookings'> {}

export interface IBookingCustomerWithRelationsDto extends IBookingCustomerDto {
  bookings?: BookingWithRelationsDto[];
}

export interface IBookingCustomerPaginationDto
  extends Omit<BookingCustomer, 'bookings' | 'updatedAt' | 'deletedAt'> {
  bookings?: RelatedBookingDto[];
}

export interface IRelatedBookingCustomerDto
  extends Pick<
    BookingCustomer,
    'id' | 'name' | 'email' | 'phoneCountryCode' | 'phoneNumber'
  > {}

export class BookingCustomerDto implements IBookingCustomerDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly email!: string;

  @Expose()
  readonly phoneCountryCode!: string;

  @Expose()
  readonly phoneNumber!: string;

  @Exclude()
  readonly createdAt!: Date;

  @Exclude()
  readonly updatedAt!: Date;

  @Exclude()
  readonly deletedAt!: Date | null;

  @Expose()
  @Transform(({ obj }) =>
    constructPhoneNumber(obj.phoneCountryCode, obj.phoneNumber),
  )
  readonly formattedPhoneNumber!: string;

  static fromEntity(entity: BookingCustomer): BookingCustomerDto {
    return plainToInstance(BookingCustomerDto, entity);
  }

  static fromEntities(entities: BookingCustomer[]): BookingCustomerDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class BookingCustomerWithRelationsDto
  extends BookingCustomerDto
  implements IBookingCustomerWithRelationsDto
{
  @Expose()
  bookings?: BookingWithRelationsDto[];

  static fromEntity(
    entity: BookingCustomer & {
      bookings?: Booking[];
    },
  ): BookingCustomerWithRelationsDto {
    const dto = plainToInstance(BookingCustomerWithRelationsDto, entity);

    if (entity.bookings) {
      dto.bookings = BookingWithRelationsDto.fromEntities(entity.bookings);
    }

    return dto;
  }

  static fromEntities(
    entities: (BookingCustomer & {
      bookings?: Booking[];
    })[],
  ): BookingCustomerWithRelationsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class BookingCustomerPaginationDto
  implements IBookingCustomerPaginationDto
{
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly email!: string;

  @Exclude()
  readonly phoneCountryCode!: string;

  @Expose()
  @Transform(
    ({ obj }) => constructPhoneNumber(obj.phoneCountryCode, obj.phoneNumber),
    { toClassOnly: true },
  )
  readonly phoneNumber!: string;

  @Exclude()
  readonly createdAt!: Date;

  @Expose()
  bookings?: RelatedBookingDto[];

  static fromEntity(
    entity: BookingCustomer & {
      bookings?: Booking[];
    },
  ): BookingCustomerPaginationDto {
    const dto = plainToInstance(BookingCustomerPaginationDto, entity);

    if (entity.bookings) {
      dto.bookings = dto.bookings.map((booking) =>
        plainToInstance(RelatedBookingDto, booking),
      );
    }

    return dto;
  }

  static fromEntities(
    entities: (BookingCustomer & {
      bookings?: Booking[];
    })[],
  ): BookingCustomerPaginationDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}

export class RelatedBookingCustomerDto implements IRelatedBookingCustomerDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly name!: string;

  @Expose()
  readonly email!: string;

  @Exclude()
  readonly phoneCountryCode!: string;

  @Expose()
  @Transform(
    ({ obj }) => constructPhoneNumber(obj.phoneCountryCode, obj.phoneNumber),
    { toClassOnly: true },
  )
  readonly phoneNumber!: string;

  static fromEntity(entity: BookingCustomer): RelatedBookingCustomerDto {
    return plainToInstance(RelatedBookingCustomerDto, entity);
  }

  static fromEntities(
    entities: BookingCustomer[],
  ): RelatedBookingCustomerDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
