import { CREATED_BOOKING } from '@apps/main/common/constants';
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
  BookingWithRelationsDto,
  CreateBookingDto,
  UpdateBookingDto,
} from './dto';

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
  ) {}

  async create(payload: CreateBookingDto): Promise<BookingWithRelationsDto> {
    return await this.datasource.transaction(async (manager: EntityManager) => {
      if (payload.type === BookingType.Activity) {
        await this._checkActivityAvailability(payload.activityId, manager);
      }

      this._setInitialBookingStatus(payload);

      const createdBookingCustomer = await this.bookingCustomerService.create(
        payload.customer,
        false,
        null,
        manager,
      );

      const { customer, ...bookingPayload } = payload;

      const createdBooking = await manager.save(Booking, {
        ...bookingPayload,
        customerId: createdBookingCustomer.id,
      });

      await this.eventEmitter.emitAsync(CREATED_BOOKING, createdBooking.id);

      return createdBooking;
    });
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<BookingWithRelationsDto[]>> {
    const paginatedBooking = await paginate(query, this.bookingRepository, {
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

    return paginateResponseMapper(paginatedBooking);
  }

  async findOne(
    id: string,
    entityManager?: EntityManager,
  ): Promise<BookingWithRelationsDto> {
    const repository = entityManager
      ? entityManager.getRepository(Booking)
      : this.bookingRepository;

    const booking = await repository.findOne({
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
      throw new NotFoundException(`booking payment not found`);
    }

    return booking;
  }

  async update(
    id: string,
    payload: UpdateBookingDto,
    entityManager?: EntityManager,
  ): Promise<BookingWithRelationsDto> {
    const initialBooking = await this.findOne(id, entityManager);

    const transactionTask = async (manager: EntityManager) => {
      const { customer: customerData, ...bookingData } = payload;

      if (
        initialBooking.type === BookingType.Activity &&
        bookingData.status === ActivityBookingStatus.Completed
      ) {
        await this._checkActivityAvailability(
          initialBooking.activityId,
          manager,
        );
      }

      if (payload.customer) {
        await this.bookingCustomerService.update(
          initialBooking.customerId,
          customerData,
          true,
          id,
          manager,
        );
      }

      await manager.update(Booking, id, bookingData);
    };

    if (entityManager) {
      await transactionTask(entityManager);
    } else {
      await this.datasource.transaction(transactionTask);
    }

    return await this.findOne(id, entityManager);
  }

  async remove(id: string): Promise<BookingWithRelationsDto> {
    const booking = await this.findOne(id);

    await this.bookingRepository.delete(id);

    return booking;
  }

  // Helper

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
}
