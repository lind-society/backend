import { BEST_SELLER_LIMIT } from '@apps/main/common/constants';
import { BestSeller } from '@apps/main/common/enums';
import { paginateResponseMapper } from '@apps/main/common/helpers';
import {
  Activity,
  ActivityBookingStatus,
  DiscountType,
} from '@apps/main/database/entities';
import { ActivityView } from '@apps/main/database/entities/views/activity.view.entity';
import { CurrencyService } from '@apps/main/modules/currency/currency.service';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { EntityManager, Repository } from 'typeorm';
import { BookingService } from '../booking/booking.service';
import { BookingWithRelationsDto, CreateBookingDto } from '../booking/dto';
import {
  ActivityPaginationDto,
  ActivityWithRelationsDto,
  CreateActivityDto,
  GetActivityBestSellerDto,
  UpdateActivityDto,
} from './dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(ActivityView)
    private activityViewRepository: Repository<ActivityView>,
    private bookingService: BookingService,
    private currencyService: CurrencyService,
  ) {}

  async create(payload: CreateActivityDto): Promise<ActivityWithRelationsDto> {
    const convertedBasePriceActivity =
      await this._convertToBaseCurrency(payload);

    const activityEntity = this.activityRepository.create(
      convertedBasePriceActivity,
    );

    const createdActivity = await this.activityRepository.save(activityEntity);

    return ActivityWithRelationsDto.fromEntity(createdActivity);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<ActivityPaginationDto[]>> {
    const paginatedActivities = await paginate(
      query,
      this.activityViewRepository,
      {
        select: [
          'id',
          'name',
          'secondaryName',
          'price',
          'discountType',
          'discount',
          'priceAfterDiscount',
          'duration',
          'highlight',
          'address',
          'country',
          'state',
          'city',
          'postalCode',
          'mapLink',
          'placeNearby',
          'openingHour',
          'closingHour',
          'startDate',
          'endDate',
          'dailyLimit',
          'photos',
          'videos',
          'video360s',
          'floorPlans',
          'averageRating',
          'totalReview',
          'isFavorite',
          'totalTodayBooking',
          'createdAt',

          'category.id',
          'category.name',
          
          'currency.id',
          'currency.name',
          'currency.code',
          'currency.symbol',

          'owner.id',
          'owner.name',
          'owner.type',
          'owner.companyName',
          'owner.email',
          'owner.phoneCountryCode',
          'owner.phoneNumber',
          'owner.address',
          'owner.website',
          'owner.status',
        ],
        sortableColumns: [
          'isFavorite',
          'createdAt',
          'name',
          'secondaryName',
          'price',
          'discountType',
          'discount',
          'priceAfterDiscount',
          'duration',
          'country',
          'state',
          'city',
          'openingHour',
          'closingHour',
          'startDate',
          'endDate',
          'averageRating',
        ],
        defaultSortBy: [
          ['isFavorite', 'DESC'],
          ['averageRating', 'DESC'],
          ['createdAt', 'DESC'],
        ],
        nullSort: 'last',
        defaultLimit: 10,
        maxLimit: 100,
        filterableColumns: {
          categoryId: [FilterOperator.EQ],
          currencyId: [FilterOperator.EQ],
          ownerId: [FilterOperator.EQ],
          discountType: [FilterOperator.EQ],
          discount: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
          pricePerPerson: [FilterOperator.GTE, FilterOperator.LTE],
          pricePerSession: [FilterOperator.GTE, FilterOperator.LTE],
          pricePerPersonAfterDiscount: [FilterOperator.GTE, FilterOperator.LTE],
          pricePerSessionAfterDiscount: [
            FilterOperator.GTE,
            FilterOperator.LTE,
          ],
          duration: [FilterOperator.EQ],
          averageRating: [
            FilterOperator.EQ,
            FilterOperator.GTE,
            FilterOperator.LTE,
          ],
          openingHour: [
            FilterOperator.EQ,
            FilterOperator.GTE,
            FilterOperator.LTE,
          ],
          closingHour: [
            FilterOperator.EQ,
            FilterOperator.GTE,
            FilterOperator.LTE,
          ],
          startDate: [
            FilterOperator.EQ,
            FilterOperator.GTE,
            FilterOperator.LTE,
          ],
          endDate: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
          isFavorite: [FilterOperator.EQ],
          createdAt: [FilterOperator.GTE, FilterOperator.LTE],

          'placeNearby.name': [FilterOperator.ILIKE],
        },
        searchableColumns: [
          'name',
          'secondaryName',
          'address',
          'country',
          'state',
          'city',
          'postalCode',
          'mapLink',
        ],
        relations: {
          category: true,
          currency: true,
          owner: true,
        },
      },
    );

    const activities = ActivityPaginationDto.fromEntities(
      paginatedActivities.data,
    );

    return paginateResponseMapper(paginatedActivities, activities);
  }

  async findOne(
    id: string,
    entityManager?: EntityManager,
  ): Promise<ActivityWithRelationsDto> {
    const repository = this._getRepository(entityManager);

    const activity = await repository.findOne({
      select: {
        id: true,
        name: true,
        secondaryName: true,
        price: true,
        discountType: true,
        discount: true,
        priceAfterDiscount: true,
        duration: true,
        highlight: true,
        address: true,
        country: true,
        state: true,
        city: true,
        postalCode: true,
        mapLink: true,
        placeNearby: true,
        openingHour: true,
        closingHour: true,
        startDate: true,
        endDate: true,
        dailyLimit: true,
        photos: true,
        videos: true,
        video360s: true,
        floorPlans: true,
        averageRating: true,
        totalReview: true,
        isFavorite: true,
        category: {
          id: true,
          name: true,
        },
        currency: {
          id: true,
          name: true,
          code: true,
          symbol: true,
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
      where: {
        id,
      },
      relations: {
        category: true,
        currency: true,
        owner: true,
      },
    });

    if (!activity) {
      throw new NotFoundException('activity not found');
    }

    return ActivityWithRelationsDto.fromEntity(activity);
  }

  async update(
    id: string,
    payload: UpdateActivityDto,
  ): Promise<ActivityWithRelationsDto> {
    await this.validateExist(id);

    const initialActivity = await this.findOne(id);

    const convertedPayload = await this._convertToBaseCurrency(
      payload,
      initialActivity,
    );

    await this.activityRepository.update(id, convertedPayload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.validateExist(id);

    await this.activityRepository.delete(id);
  }

  private _getRepository(entityManager?: EntityManager): Repository<Activity> {
    return entityManager
      ? entityManager.getRepository(Activity)
      : this.activityRepository;
  }

  async validateExist(id: string): Promise<void> {
    const exists = await this.activityRepository.exists({ where: { id } });

    if (!exists) {
      throw new NotFoundException('activity not found');
    }
  }

  async findBestSeller(option: BestSeller): Promise<GetActivityBestSellerDto> {
    const query = this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.category', 'category')
      .leftJoinAndSelect('activity.currency', 'currency')
      .leftJoinAndSelect('activity.owner', 'owner')
      .leftJoinAndSelect('activity.reviews', 'reviews')
      .leftJoinAndSelect('reviews.activityBooking', 'activityBooking')
      .leftJoinAndSelect('activityBooking.customer', 'customer')
      .leftJoin('activity.bookings', 'booking', 'booking.status = :completed', {
        completed: ActivityBookingStatus.Completed,
      })
      .loadRelationCountAndMap(
        'activity.totalBooking',
        'activity.bookings',
        'totalBooking',
        (qb) =>
          qb.andWhere('totalBooking.status = :status', {
            status: ActivityBookingStatus.Completed,
          }),
      )
      .groupBy('activity.id')
      .addGroupBy('category.id')
      .addGroupBy('currency.id')
      .addGroupBy('owner.id')
      .addGroupBy('reviews.id')
      .addGroupBy('activityBooking.id')
      .addGroupBy('customer.id');

    query.addSelect('COUNT(booking.id)', 'booking_count');

    if (option === BestSeller.Rating) {
      query
        .orderBy('activity.averageRating', 'DESC', 'NULLS LAST')
        .addOrderBy('booking_count', 'DESC');
    } else {
      query
        .orderBy('booking_count', 'DESC')
        .addOrderBy('activity.averageRating', 'DESC', 'NULLS LAST');
    }

    const result = await query.limit(BEST_SELLER_LIMIT).getRawAndEntities();

    const orderedData = result.raw
      .map((rawItem) => {
        return result.entities.find(
          (entity) => entity.id === rawItem.activity_id,
        );
      })
      .filter(Boolean);

    const dtos = orderedData.map((activity) =>
      plainToClass(ActivityWithRelationsDto, activity),
    );

    return { data: dtos };
  }

  private async _convertToBaseCurrency(
    activityData: CreateActivityDto | UpdateActivityDto,
    initialData?: ActivityWithRelationsDto,
  ): Promise<CreateActivityDto | UpdateActivityDto> {
    const currencyId = activityData.currencyId ?? initialData.currencyId;
    const discountType = activityData.discountType ?? initialData.discountType;
    const discount = activityData.discount ?? initialData.discount;
    const price = activityData.price ?? initialData.price;

    return {
      ...activityData,
      currencyId: await this.currencyService.findBaseCurrencyId(),
      price: await this.currencyService.convertToBaseCurrency(
        currencyId,
        price,
      ),
      discount:
        discount != null
          ? discountType === DiscountType.Fixed
            ? await this.currencyService.convertToBaseCurrency(
                currencyId,
                discount,
              )
            : discount
          : undefined,
    };
  }

  // Booking
  async createBooking(
    payload: CreateBookingDto,
  ): Promise<BookingWithRelationsDto> {
    return await this.bookingService.create(payload);
  }
}
