import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import {
  constructPhoneNumber,
  generateTodayDateRange,
  paginateResponseMapper,
} from 'src/common/helpers';
import {
  Activity,
  ActivityBooking,
  ActivityBookingStatus,
} from 'src/database/entities';
import { Between, DataSource, EntityManager, Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../../shared/dto';
import { WhatsappService } from '../../shared/whatsapp/whatsapp.service';
import { BookingCustomerService } from '../customer/booking-customer.service';
import {
  ActivityBookingWithRelationsDto,
  CreateActivityBookingDto,
  UpdateActivityBookingDto,
} from './dto';

@Injectable()
export class ActivityBookingService {
  constructor(
    private datasource: DataSource,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(ActivityBooking)
    private activityBookingRepository: Repository<ActivityBooking>,
    private bookingCustomerService: BookingCustomerService,
    private whatsappService: WhatsappService,
  ) {}

  async create(
    payload: CreateActivityBookingDto,
  ): Promise<ActivityBookingWithRelationsDto> {
    return await this.datasource.transaction(async (manager: EntityManager) => {
      await this._checkActivityAvailability(payload.activityId, manager);

      const createdActivityBookingCustomer =
        await this.bookingCustomerService.create(payload.customer, manager);

      const createdActivityBooking = await manager.save(ActivityBooking, {
        ...payload,
        customerId: createdActivityBookingCustomer.id,
      });

      const bookingDetail = await this.findOne(
        createdActivityBooking.id,
        manager,
      );

      await this.whatsappService.sendMessage({
        phoneNumber: constructPhoneNumber(
          payload.customer.phoneCountryCode,
          payload.customer.phoneNumber,
        ),
        message: this._formatActivityBookingMessage(bookingDetail),
      });

      return bookingDetail;
    });
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<ActivityBookingWithRelationsDto[]>> {
    const paginatedActivityBooking = await paginate(
      query,
      this.activityBookingRepository,
      {
        sortableColumns: [
          'createdAt',
          'totalAmount',
          'totalGuest',
          'bookingDate',
          'status',
        ],
        defaultSortBy: [['createdAt', 'DESC']],
        nullSort: 'last',
        defaultLimit: 10,
        maxLimit: 100,
        filterableColumns: {
          totalAmount: [
            FilterOperator.EQ,
            FilterOperator.GTE,
            FilterOperator.LTE,
          ],
          totalGuest: [
            FilterOperator.EQ,
            FilterOperator.GTE,
            FilterOperator.LTE,
          ],
          bookingDate: [
            FilterOperator.EQ,
            FilterOperator.GTE,
            FilterOperator.LTE,
          ],
          status: [FilterOperator.EQ],
          createdAt: [FilterOperator.GTE, FilterOperator.LTE],

          customerId: [FilterOperator.EQ],
          'payments.id': [FilterOperator.EQ],
          activityId: [FilterOperator.EQ],
        },
        searchableColumns: ['customer.name', 'activity.name'],
        relations: {
          customer: true,
          currency: true,
          activity: {
            category: true,
            currency: true,
            owner: true,
          },
          review: true,
          payments: { currency: true },
        },
      },
    );

    return paginateResponseMapper(paginatedActivityBooking);
  }

  async findOne(
    id: string,
    entityManager?: EntityManager,
  ): Promise<ActivityBookingWithRelationsDto> {
    const repository = entityManager
      ? entityManager.getRepository(ActivityBooking)
      : this.activityBookingRepository;

    const activityBooking = await repository.findOne({
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
        review: true,
        payments: { currency: true },
      },
    });

    if (!activityBooking) {
      throw new NotFoundException(`activity booking not found`);
    }

    return activityBooking;
  }

  async update(
    id: string,
    payload: UpdateActivityBookingDto,
  ): Promise<ActivityBookingWithRelationsDto> {
    const initialActivityBooking = await this.findOne(id);

    const { customer: customerData, ...bookingData } = payload;

    await this.datasource.transaction(async (manager: EntityManager) => {
      if (bookingData.status === ActivityBookingStatus.Completed) {
        await this._checkActivityAvailability(
          initialActivityBooking.activityId,
          manager,
        );
      }

      if (payload.customer) {
        await this.bookingCustomerService.update(
          initialActivityBooking.customerId,
          customerData,
          manager,
        );
      }

      await manager.update(ActivityBooking, id, bookingData);
    });

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.activityBookingRepository.delete(id);
  }

  async findTotalTodayBooking(
    activityId: string,
    entityManager?: EntityManager,
  ): Promise<number> {
    const [todayDayStart, todayDayEnd] = generateTodayDateRange();

    const repository = entityManager
      ? entityManager.getRepository(ActivityBooking)
      : this.activityBookingRepository;

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
    const [todayDayStart, todayDayEnd] = generateTodayDateRange();

    const repository = entityManager
      ? entityManager.getRepository(ActivityBooking)
      : this.activityBookingRepository;

    const todayBookings = await repository
      .createQueryBuilder('activityBookings')
      .select('activityBookings.activityId', 'activityId')
      .addSelect('COUNT(*)', 'count')
      .where('activityBookings.activityId IN (:...ids)', { ids: activityIds })
      .andWhere('activityBookings.bookingDate BETWEEN :start AND :end', {
        start: todayDayStart,
        end: todayDayEnd,
      })
      .andWhere('activityBookings.status = :status', {
        status: ActivityBookingStatus.Completed,
      })
      .groupBy('activityBookings.activityId')
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
  ): Promise<number> {
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

    if (activity) {
      return activity.dailyLimit;
    }
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

  private _formatActivityBookingMessage(
    booking: ActivityBookingWithRelationsDto,
  ): string {
    const bookingDate = new Date(booking.bookingDate).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    });

    return `Thank you ${booking.customer.name} for booking with us at ${booking.activity?.name}!
    
  🏡 *Activity*: ${booking.activity?.name} (${booking.activity?.secondaryName || '-'})
  📍 *Address*: ${booking.activity?.address}, ${booking.activity?.city}, ${booking.activity?.state}, ${booking.activity?.country}
  🗓️ *Booking Date*: ${bookingDate} WIB
  👥 *Total Guests*: ${booking.totalGuest}
  💵 *Total Amount*: ${booking.currency?.symbol || ''} ${Number(booking.totalAmount).toLocaleString('id-ID')}
  🗺️ *Map*: ${booking.activity?.mapLink || '-'}
    
  We look forward to welcoming you!`;
  }
}
