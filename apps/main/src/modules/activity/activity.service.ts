import { BEST_SELLER_LIMIT } from '@apps/main/common/constants';
import { BestSeller } from '@apps/main/common/enums';
import { paginateResponseMapper } from '@apps/main/common/helpers';
import {
  Activity,
  ActivityBookingStatus,
  DiscountType,
} from '@apps/main/database/entities';
import { ActivityBookingService } from '@apps/main/modules/booking/activity-booking/activity-booking.service';
import { CurrencyService } from '@apps/main/modules/currency/currency.service';
import { OwnerService } from '@apps/main/modules/owner/owner.service';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { EntityManager, Repository } from 'typeorm';
import { ActivityCategoryService } from './category/activity-category.service';
import {
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
    private activityCategoryService: ActivityCategoryService,
    private activityBookingService: ActivityBookingService,
    private currencyService: CurrencyService,
    private ownerService: OwnerService,
  ) {}

  async create(payload: CreateActivityDto): Promise<ActivityWithRelationsDto> {
    this._handleDefaultDiscountType(payload);

    await this._validateRelatedEntities(
      payload.categoryId,
      payload.currencyId,
      payload.ownerId,
    );

    const convertedBasePriceActivity =
      await this._convertToBaseCurrency(payload);

    const createdActivity = this.activityRepository.create(
      convertedBasePriceActivity,
    );

    const savedActivity = await this.activityRepository.save(createdActivity);

    return plainToInstance(ActivityWithRelationsDto, savedActivity, {
      enableImplicitConversion: true,
    });
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<ActivityWithRelationsDto[]>> {
    const paginatedActivity = await paginate(query, this.activityRepository, {
      sortableColumns: [
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
        pricePerSessionAfterDiscount: [FilterOperator.GTE, FilterOperator.LTE],

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
        startDate: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
        endDate: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
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
        reviews: { activityBooking: { customer: true } },
      },
    });

    const activityIds = paginatedActivity.data.map((a) => a.id);

    const todayBookings =
      await this.activityBookingService.findTotalTodayMultipleBooking(
        activityIds,
      );

    const activitiesWithTodayBooking = paginatedActivity.data.map(
      (activity) => {
        const dto = plainToInstance(ActivityWithRelationsDto, activity);
        dto.todayBooking = todayBookings[activity.id] ?? 0;
        return dto;
      },
    );

    return paginateResponseMapper(
      paginatedActivity,
      activitiesWithTodayBooking,
    );
  }

  async findOne(
    id: string,
    entityManager?: EntityManager,
  ): Promise<ActivityWithRelationsDto> {
    const repository = entityManager
      ? entityManager.getRepository(Activity)
      : this.activityRepository;

    const activity = await repository.findOne({
      where: {
        id,
      },
      relations: {
        category: true,
        currency: true,
        owner: true,
        reviews: { activityBooking: { customer: true } },
      },
    });

    if (!activity) {
      throw new NotFoundException('activity not found');
    }

    const todayBooking =
      await this.activityBookingService.findTotalTodayBooking(id);

    const activityDto = plainToInstance(ActivityWithRelationsDto, activity);

    activityDto.todayBooking = todayBooking;

    return activityDto;
  }

  async update(
    id: string,
    payload: UpdateActivityDto,
  ): Promise<ActivityWithRelationsDto> {
    await this.findOne(id);

    this._handleDefaultDiscountType(payload);

    await this._validateRelatedEntities(
      payload.categoryId,
      payload.currencyId,
      payload.ownerId,
    );

    const convertedBasePriceActivity =
      await this._convertToBaseCurrency(payload);

    await this.activityRepository.update(id, convertedBasePriceActivity);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.activityRepository.delete(id);
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

  private async _validateRelatedEntities(
    categoryId: string,
    currencyId?: string,
    ownerId?: string,
  ): Promise<void> {
    await this.activityCategoryService.findOne(categoryId);

    if (currencyId) {
      await this.currencyService.findOne(currencyId);
    }

    if (ownerId) {
      await this.ownerService.findOne(ownerId);
    }
  }

  private async _convertToBaseCurrency(
    activityData: CreateActivityDto | UpdateActivityDto,
  ): Promise<CreateActivityDto | UpdateActivityDto> {
    return {
      ...activityData,
      currencyId: await this.currencyService.findBaseCurrencyId(),
      price: await this.currencyService.convertToBaseCurrency(
        activityData.currencyId,
        activityData.price,
      ),
      discount:
        activityData.discountType === DiscountType.Fixed
          ? await this.currencyService.convertToBaseCurrency(
              activityData.currencyId,
              activityData.discount,
            )
          : activityData.discount,
    };
  }

  private async _handleDefaultDiscountType(
    payload: CreateActivityDto | UpdateActivityDto,
  ) {
    if (payload.discount && !payload.discountType) {
      payload.discountType = DiscountType.Percentage;
    }
  }
}
