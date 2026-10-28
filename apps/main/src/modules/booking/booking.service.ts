import {
  CHANGED_BOOKING_STATUS,
  CREATED_BOOKING,
} from '@apps/main/common/constants';
import {
  generateTodayDateRange,
  paginateResponseMapper,
} from '@apps/main/common/helpers';
import {
  Activity,
  ActivityBookingStatus,
  Booking,
  BookingType,
  VillaBookingStatus,
} from '@apps/main/database/entities';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Between, DataSource, EntityManager, Repository } from 'typeorm';
import { PaginateResponseDataProps } from './../shared/dto';
import { BookingCustomerService } from './customer/booking-customer.service';
import {
  BookingPaginationDto,
  BookingWithRelationsDto,
  CreateBookingDto,
  UpdateBookingDto,
} from './dto';
import { BookingStatusChangedEventDto } from './dto/booking-status-changed-event.dto';
import { BookingAccessService } from './helper/booking-access.service';
import { BookingAvailabilityService } from './helper/booking-availability.service';
import { BookingPriceService } from './helper/booking-price.service';
import {
  assertBookingStatusTransition,
  OCCUPYING_VILLA_BOOKING_STATUSES,
} from './helper/booking-status.helper';

/** Writable view of an update payload — the DTO itself is all `readonly`. */
type MutableBookingUpdate = {
  -readonly [K in keyof Omit<UpdateBookingDto, 'customer'>]?: Omit<
    UpdateBookingDto,
    'customer'
  >[K];
};

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    @InjectDataSource()
    private datasource: DataSource,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private bookingCustomerService: BookingCustomerService,
    private bookingAccessService: BookingAccessService,
    private bookingAvailabilityService: BookingAvailabilityService,
    private bookingPriceService: BookingPriceService,
  ) {}

  async create(payload: CreateBookingDto): Promise<BookingWithRelationsDto> {
    const accessToken = this.bookingAccessService.generateAccessToken();

    const createdBooking = await this.datasource.transaction(
      async (manager: EntityManager) => {
        if (payload.type === BookingType.Activity) {
          await this._checkActivityAvailability(payload.activityId, manager);
        } else {
          // An inquiry does not reserve the dates, but there is no point
          // accepting one for dates the villa is already committed to.
          await this.bookingAvailabilityService.assertVillaAvailable(
            payload.villaId,
            payload.checkInDate,
            payload.checkOutDate,
            undefined,
            manager,
          );
        }

        this._setInitialBookingStatus(payload);

        // The amount and currency the browser sent are display values. They
        // decide how much the gateway collects and whether a booking counts as
        // paid, so they are always recomputed from the property's own prices.
        const pricing = await this._priceBooking(payload, manager);

        const createdBookingCustomer =
          await this.bookingCustomerService.createFromDashboard(
            payload.customer,
            manager,
          );

        const { customer, ...bookingPayload } = payload;

        const bookingEntity = manager.create(Booking, {
          ...bookingPayload,
          totalAmount: pricing.totalAmount,
          currencyId: pricing.currencyId,
          customerId: createdBookingCustomer.id,
          accessToken,
          accessExpiresAt:
            this.bookingAccessService.resolveAccessExpiry(bookingPayload),
        });

        return await manager.save(bookingEntity);
      },
    );

    // Emitted only after the transaction commits: the listeners re-read the
    // booking over their own connection and would not see an uncommitted row.
    await this.eventEmitter.emitAsync(CREATED_BOOKING, createdBooking.id);

    const bookingDto = BookingWithRelationsDto.fromEntity(createdBooking);

    bookingDto.bookingLink =
      this.bookingAccessService.buildBookingLink(accessToken);

    return bookingDto;
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<BookingPaginationDto[]>> {
    const paginatedBookings = await paginate(query, this.bookingRepository, {
      select: [
        'id',
        'type',
        'totalAmount',
        'totalGuest',
        'bookingDate',
        'checkInDate',
        'checkOutDate',
        'status',
        'createdAt',
        'accessExpiresAt',
        'closedReason',
        'customerNotifiedAt',
        'ownerNotifiedAt',

        'customer.id',
        'customer.name',
        'customer.email',
        'customer.phoneCountryCode',
        'customer.phoneNumber',

        'currency.id',
        'currency.name',
        'currency.code',
        'currency.symbol',

        'activity.id',
        'activity.name',
        'activity.category.id',
        'activity.category.name',
        'activity.owner.id',
        'activity.owner.name',

        'villa.id',
        'villa.name',
        'villa.owner.id',
        'villa.owner.name',

        'review.id',
        'review.rating',

        'payments.id',
        'payments.paymentMethod',
        'payments.paymentChannel',
        'payments.failureStage',
        'payments.failureReason',
        'payments.refundedAmount',
        'payments.refundedReason',
        'payments.refundedAt',
        'payments.cancelledReason',
        'payments.cancelledAt',
        'payments.amount',
        'payments.paidAt',
        'payments.status',

        'payments.currency.id',
        'payments.currency.name',
        'payments.currency.code',
        'payments.currency.symbol',
      ],
      sortableColumns: [
        'type',
        'createdAt',
        'totalAmount',
        'totalGuest',
        'bookingDate',
        'checkInDate',
        'checkOutDate',
        'status',
      ],
      defaultSortBy: [['createdAt', 'DESC']],
      nullSort: 'last',
      defaultLimit: 10,
      maxLimit: 100,
      filterableColumns: {
        type: [FilterOperator.EQ],
        totalAmount: [
          FilterOperator.EQ,
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        totalGuest: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
        bookingDate: [
          FilterOperator.EQ,
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        checkInDate: [
          FilterOperator.EQ,
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        checkOutDate: [
          FilterOperator.EQ,
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        status: [FilterOperator.EQ],
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],

        customerId: [FilterOperator.EQ],
        'payments.id': [FilterOperator.EQ],
        activityId: [FilterOperator.EQ],
        villaId: [FilterOperator.EQ],
      },
      searchableColumns: ['customer.name', 'activity.name', 'villa.name'],
      relations: {
        customer: true,
        currency: true,
        activity: {
          category: true,
          currency: true,
          owner: true,
        },
        villa: {
          owner: true,
          currency: true,
        },
        review: true,
        payments: { currency: true },
      },
    });

    const bookings = BookingPaginationDto.fromEntities(paginatedBookings.data);

    return paginateResponseMapper(paginatedBookings, bookings);
  }

  async findOne(
    id: string,
    entityManager?: EntityManager,
  ): Promise<BookingWithRelationsDto> {
    const repository = this._getRepository(entityManager);

    const booking = await repository.findOne({
      select: {
        id: true,
        type: true,
        totalAmount: true,
        totalGuest: true,
        bookingDate: true,
        checkInDate: true,
        checkOutDate: true,
        status: true,
        accessExpiresAt: true,
        closedReason: true,
        customerNotifiedAt: true,
        ownerNotifiedAt: true,
        customer: {
          id: true,
          name: true,
          email: true,
          phoneCountryCode: true,
          phoneNumber: true,
        },
        currency: {
          id: true,
          name: true,
          code: true,
          symbol: true,
        },
        // The location/map fields below are what the WhatsApp templates and the
        // public book-inform page render; without them they would print
        // "undefined" to the customer.
        activity: {
          id: true,
          name: true,
          secondaryName: true,
          address: true,
          city: true,
          state: true,
          country: true,
          mapLink: true,
          photos: true,
          category: {
            id: true,
            name: true,
          },
          owner: {
            id: true,
            name: true,
            type: true,
            companyName: true,
            email: true,
            phoneCountryCode: true,
            phoneNumber: true,
            address: true,
            website: true,
            status: true,
          },
        },
        villa: {
          id: true,
          name: true,
          secondaryName: true,
          address: true,
          city: true,
          state: true,
          country: true,
          mapLink: true,
          photos: true,
          owner: {
            id: true,
            name: true,
            type: true,
            companyName: true,
            email: true,
            phoneCountryCode: true,
            phoneNumber: true,
            address: true,
            website: true,
            status: true,
          },
        },
        review: {
          id: true,
          rating: true,
          message: true,
          booking: {
            customer: {
              id: true,
              name: true,
              email: true,
              phoneCountryCode: true,
              phoneNumber: true,
            },
          },
        },
        payments: {
          id: true,
          paymentMethod: true,
          paymentChannel: true,
          failureStage: true,
          failureReason: true,
          refundedAmount: true,
          refundedReason: true,
          refundedAt: true,
          cancelledReason: true,
          cancelledAt: true,
          amount: true,
          paidAt: true,
          status: true,
          currency: {
            id: true,
            name: true,
            code: true,
            symbol: true,
          },
        },
      },
      where: {
        id,
      },
      relations: {
        customer: true,
        currency: true,
        activity: {
          category: true,
          currency: true,
          owner: true,
        },
        villa: {
          owner: true,
          currency: true,
        },
        review: true,
        payments: { currency: true },
      },
    });

    if (!booking) {
      throw new NotFoundException(`booking not found`);
    }

    return BookingWithRelationsDto.fromEntity(booking);
  }

  async update(
    id: string,
    payload: UpdateBookingDto,
    entityManager?: EntityManager,
  ): Promise<BookingWithRelationsDto> {
    await this.validateExist(id);

    let statusChangedEvent: BookingStatusChangedEventDto | null = null;

    const transactionTask = async (manager: EntityManager) => {
      const initialBooking = await this.findOne(id, manager);

      const { customer: customerData, ...restPayload } = payload;

      // The DTO fields are readonly; this update needs to overwrite the amount
      // and currency when the villa is swapped mid-negotiation.
      const bookingData = { ...restPayload } as MutableBookingUpdate;

      this._validateBookingTypeUnchanged(initialBooking, bookingData);

      if (
        initialBooking.type === BookingType.Activity &&
        bookingData.status === ActivityBookingStatus.Completed
      ) {
        await this._checkActivityAvailability(
          initialBooking.activityId,
          manager,
        );
      }

      if (payload.status) {
        this._validateUpdateStatus(payload.status, initialBooking.type);

        assertBookingStatusTransition(
          initialBooking.type,
          initialBooking.status,
          payload.status,
        );
      }

      // Villa or dates moved during negotiation: re-price and re-check the
      // calendar so a swapped villa can never keep the old villa's amount.
      await this._applyVillaChangeEffects(
        initialBooking,
        payload,
        bookingData,
        manager,
      );

      if (payload.customer) {
        // `initialBooking` comes from this class's own findOne() below, whose
        // TypeORM `select` only projects the `customer` relation (id, name,
        // etc.) — the scalar `customerId` FK column is never selected, so it
        // was always undefined here and every booking-customer edit 400'd
        // with "booking customer id is required". The relation's own id is
        // the same value and is guaranteed to be loaded.
        await this.bookingCustomerService.update(
          id,
          initialBooking.customer.id,
          customerData,
          manager,
        );
      }

      await manager.update(Booking, id, bookingData);

      if (payload.status && payload.status !== initialBooking.status) {
        statusChangedEvent = {
          bookingId: id,
          bookingType: initialBooking.type,
          previousStatus: initialBooking.status,
          currentStatus: payload.status,
          closedReason: bookingData.closedReason ?? null,
        };
      }
    };

    if (entityManager) {
      await transactionTask(entityManager);
    } else {
      await this.datasource.transaction(transactionTask);
    }

    if (statusChangedEvent) {
      await this.eventEmitter.emitAsync(
        CHANGED_BOOKING_STATUS,
        statusChangedEvent,
      );
    }

    return await this.findOne(id, entityManager);
  }

  async remove(id: string): Promise<void> {
    await this.validateExist(id);

    await this.bookingRepository.delete(id);
  }

  // Helper
  private _getRepository(entityManager?: EntityManager): Repository<Booking> {
    return entityManager
      ? entityManager.getRepository(Booking)
      : this.bookingRepository;
  }

  async validateExist(id: string) {
    const exists = await this.bookingRepository.exists({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('booking not found');
    }
  }

  // Activity
  async findTotalTodayBooking(
    activityId: string,
    entityManager?: EntityManager,
  ): Promise<number> {
    const [todayDayStart, todayDayEnd] = generateTodayDateRange();

    const repository = entityManager
      ? entityManager.getRepository(Booking)
      : this.bookingRepository;

    const todayBookingCount = await repository.count({
      where: {
        activityId,
        bookingDate: Between(todayDayStart, todayDayEnd),
        status: ActivityBookingStatus.Completed,
      },
    });

    return todayBookingCount;
  }

  async findTotalTodayMultipleBooking(
    activityIds: string[],
    entityManager?: EntityManager,
  ): Promise<Record<string, number>> {
    if (activityIds.length < 1) {
      return {};
    }

    const [todayDayStart, todayDayEnd] = generateTodayDateRange();

    const repository = entityManager
      ? entityManager.getRepository(Booking)
      : this.bookingRepository;

    const todayBookings = await repository
      .createQueryBuilder('bookings')
      .select('bookings.activityId', 'activityId')
      .addSelect('COUNT(*)', 'count')
      .where('bookings.activityId IN (:...ids)', { ids: activityIds })
      .andWhere('bookings.bookingDate BETWEEN :start AND :end', {
        start: todayDayStart,
        end: todayDayEnd,
      })
      .andWhere('bookings.status = :status', {
        status: ActivityBookingStatus.Completed,
      })
      .groupBy('bookings.activityId')
      .getRawMany();

    const mappedTodayBookings: Record<string, number> = {};

    for (const row of todayBookings) {
      mappedTodayBookings[row.activityId] = Number(row.count);
    }

    return mappedTodayBookings;
  }

  private async _findActivityDailyLimit(
    actvityId: string,
    entityManager?: EntityManager,
  ): Promise<number | undefined> {
    const repository = entityManager
      ? entityManager.getRepository(Activity)
      : this.activityRepository;

    const activity = await repository.findOne({
      where: {
        id: actvityId,
      },
      select: {
        dailyLimit: true,
      },
    });

    return activity?.dailyLimit;
  }

  private async _checkActivityAvailability(
    activityId: string,
    entityManager?: EntityManager,
  ) {
    const activityDailyLimit = await this._findActivityDailyLimit(
      activityId,
      entityManager,
    );
    const todayBooking = await this.findTotalTodayBooking(
      activityId,
      entityManager,
    );

    if (todayBooking >= activityDailyLimit) {
      throw new BadRequestException(
        'booking failed, activity is fully booked today',
      );
    }
  }

  /**
   * Prices a booking from the property's own rates. Never trusts the amount or
   * currency supplied by the caller.
   */
  private async _priceBooking(
    payload: CreateBookingDto,
    manager: EntityManager,
  ) {
    if (payload.type === BookingType.Activity) {
      return await this.bookingPriceService.calculateActivityBooking(
        payload.activityId,
        manager,
      );
    }

    return await this.bookingPriceService.calculateVillaBooking(
      payload.villaId,
      payload.checkInDate,
      payload.checkOutDate,
      manager,
    );
  }

  /**
   * A booking cannot change species. Allowing it would leave both `villa_id`
   * and `activity_id` populated (or neither) and quietly break every downstream
   * branch that switches on `type`.
   */
  private _validateBookingTypeUnchanged(
    initialBooking: BookingWithRelationsDto,
    bookingData: MutableBookingUpdate,
  ): void {
    if (bookingData.type && bookingData.type !== initialBooking.type) {
      throw new BadRequestException(
        `booking type cannot be changed from ${initialBooking.type} to ${bookingData.type}, create a new booking instead`,
      );
    }

    if (
      initialBooking.type === BookingType.Villa &&
      bookingData.activityId != null
    ) {
      throw new BadRequestException(
        'cannot set an activity on a villa booking',
      );
    }

    if (
      initialBooking.type === BookingType.Activity &&
      bookingData.villaId != null
    ) {
      throw new BadRequestException(
        'cannot set a villa on an activity booking',
      );
    }
  }

  /**
   * Keeps a villa booking coherent when the admin swaps the villa or shifts the
   * dates during negotiation:
   *
   * - re-prices against the new villa/date range, unless the admin sent an
   *   explicit `totalAmount` (a negotiated price wins over the rate card);
   * - re-points the currency at the new villa;
   * - re-checks the calendar whenever the booking is, or is about to become,
   *   an occupying booking.
   */
  private async _applyVillaChangeEffects(
    initialBooking: BookingWithRelationsDto,
    payload: UpdateBookingDto,
    bookingData: MutableBookingUpdate,
    manager: EntityManager,
  ): Promise<void> {
    if (initialBooking.type !== BookingType.Villa) {
      return;
    }

    const targetVillaId = payload.villaId ?? initialBooking.villaId;
    const targetCheckIn = payload.checkInDate ?? initialBooking.checkInDate;
    const targetCheckOut = payload.checkOutDate ?? initialBooking.checkOutDate;
    const targetStatus = (payload.status ??
      initialBooking.status) as VillaBookingStatus;

    const bookingChanged =
      this._hasChanged(payload.villaId, initialBooking.villaId) ||
      this._hasDateChanged(payload.checkInDate, initialBooking.checkInDate) ||
      this._hasDateChanged(payload.checkOutDate, initialBooking.checkOutDate);

    if (bookingChanged && targetVillaId && targetCheckIn && targetCheckOut) {
      const pricing = await this.bookingPriceService.calculateVillaBooking(
        targetVillaId,
        targetCheckIn,
        targetCheckOut,
        manager,
      );

      bookingData.currencyId = pricing.currencyId;

      if (payload.totalAmount === undefined || payload.totalAmount === null) {
        bookingData.totalAmount = pricing.totalAmount;
      } else {
        this.logger.log(
          `booking ${initialBooking.id} kept a negotiated amount of ${payload.totalAmount} instead of the calculated ${pricing.totalAmount}`,
        );
      }
    }

    const willOccupyCalendar =
      OCCUPYING_VILLA_BOOKING_STATUSES.includes(targetStatus);

    if (
      willOccupyCalendar &&
      (bookingChanged || Boolean(payload.status)) &&
      targetVillaId &&
      targetCheckIn &&
      targetCheckOut
    ) {
      await this.bookingAvailabilityService.assertVillaAvailable(
        targetVillaId,
        targetCheckIn,
        targetCheckOut,
        initialBooking.id,
        manager,
      );
    }
  }

  private _hasChanged(next: string | undefined, current: string | null) {
    return next !== undefined && next !== null && next !== current;
  }

  private _hasDateChanged(
    next: Date | undefined,
    current: Date | string | null,
  ) {
    if (next === undefined || next === null) {
      return false;
    }

    if (!current) {
      return true;
    }

    return new Date(next).getTime() !== new Date(current).getTime();
  }

  private _setInitialBookingStatus(payload: CreateBookingDto): void {
    if (payload.type === BookingType.Activity) {
      payload.status = ActivityBookingStatus.Pending;
    } else {
      payload.status = VillaBookingStatus.Requested;
    }
  }

  determineBookingType(
    booking: BookingWithRelationsDto,
  ): BookingType | undefined {
    if (booking.activityId && !booking.villaId) {
      return BookingType.Activity;
    } else if (booking.villaId && !booking.activityId) {
      return BookingType.Villa;
    } else {
      return undefined;
    }
  }

  private _validateUpdateStatus(
    status: ActivityBookingStatus | VillaBookingStatus,
    initialBookingType: BookingType,
  ): void {
    if (
      !Object.values(
        initialBookingType === BookingType.Activity
          ? ActivityBookingStatus
          : VillaBookingStatus,
      ).includes(status)
    ) {
      throw new BadRequestException(
        // `BookingType.Activity ? …` was always truthy (it is the string
        // 'activity'), so villa bookings were told to use the activity statuses
        `Invalid status for booking type ${initialBookingType}, status must be one of: ${Object.values(
          initialBookingType === BookingType.Activity
            ? ActivityBookingStatus
            : VillaBookingStatus,
        ).join(', ')} for ${initialBookingType} bookings`,
      );
    }
  }
}
