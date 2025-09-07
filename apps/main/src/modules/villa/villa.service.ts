import { BEST_SELLER_LIMIT } from '@apps/main/common/constants';
import { BestSeller } from '@apps/main/common/enums';
import { paginateResponseMapper } from '@apps/main/common/helpers';
import {
  Additional,
  DiscountType,
  Feature,
  Villa,
  VillaAdditionalPivot,
  VillaBookingStatus,
  VillaFacilityPivot,
  VillaFeaturePivot,
  VillaPolicy,
  VillaPolicyPivot,
  VillaPriceRulePivot,
} from '@apps/main/database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { BookingService } from '../booking/booking.service';
import { BookingWithRelationsDto, CreateBookingDto } from '../booking/dto';
import { CurrencyService } from '../currency/currency.service';
import { CreateFeatureDto } from '../feature/dto';
import { FeatureService } from '../feature/feature.service';
import { PaginateResponseDataProps } from '../shared/dto';
import {
  CreateVillaFacililtyPivotDto,
  CurrentVillaPrices,
  GetVillaBestSellerDto,
  UpdateVillaFacililtyPivotDto,
  VillaDto,
  VillaPaginationDto,
  VillaWithRelationsDto,
} from './dto';
import { CreateVillaDto } from './dto/create-villa.dto';
import { UpdateVillaDto } from './dto/update-villa.dto';
import { getVillaCurrentDailyPrice } from './helper';
import { VillaPriceRuleWithRelationsDto } from './price-rule/dto';

@Injectable()
export class VillaService {
  constructor(
    @InjectDataSource()
    private datasource: DataSource,
    @InjectRepository(Villa)
    private villaRepository: Repository<Villa>,
    private bookingService: BookingService,
    private currencyService: CurrencyService,
    private featureService: FeatureService,
  ) {}

  async create(payload: CreateVillaDto): Promise<VillaWithRelationsDto> {
    payload.dailyPriceAfterDiscount = payload.dailyPrice ?? undefined;
    payload.lowSeasonDailyPriceAfterDiscount =
      payload.lowSeasonDailyPrice ?? undefined;
    payload.highSeasonDailyPriceAfterDiscount =
      payload.highSeasonDailyPrice ?? undefined;
    payload.peakSeasonDailyPriceAfterDiscount =
      payload.peakSeasonDailyPrice ?? undefined;

    const createdVilla = await this.datasource.transaction(
      async (manager: EntityManager) => {
        const convertedBasePriceVillaData = (await this._convertToBaseCurrency(
          payload,
        )) as CreateVillaDto;

        const { additionals, facilities, features, policies, ...villaData } =
          convertedBasePriceVillaData;

        const createdVilla = await manager.save(Villa, villaData);

        if (Array.isArray(additionals) && additionals.length > 0) {
          const createdAdditionals = await manager.save(
            Additional,
            additionals,
          );

          await manager.save(
            VillaAdditionalPivot,
            createdAdditionals.map((additional: Additional) => ({
              villaId: createdVilla.id,
              additionalId: additional.id,
            })),
          );
        }

        if (Array.isArray(facilities) && facilities.length > 0) {
          await manager.save(
            VillaFacilityPivot,
            facilities.map((facility: CreateVillaFacililtyPivotDto) => ({
              villaId: createdVilla.id,
              facilityId: facility.id,
              description: facility.description,
            })),
          );
        }

        if (Array.isArray(features) && features.length > 0) {
          features.map((feature: CreateFeatureDto) =>
            this.featureService.handleDefaultDiscountType(feature),
          );

          const convertedBasePriceFeatures =
            await this.featureService.convertFeaturesToBaseCurrency(features);

          const createdFeatures = await manager.save(
            Feature,
            convertedBasePriceFeatures,
          );

          await manager.save(
            VillaFeaturePivot,
            createdFeatures.map((feature: Feature) => ({
              villaId: createdVilla.id,
              featureId: feature.id,
            })),
          );
        }

        if (Array.isArray(policies) && policies.length > 0) {
          const createdPolicies = await manager.save(VillaPolicy, policies);

          await manager.save(
            VillaPolicyPivot,
            createdPolicies.map((policy: VillaPolicy) => ({
              villaId: createdVilla.id,
              policyId: policy.id,
            })),
          );
        }

        return createdVilla;
      },
    );

    return VillaWithRelationsDto.fromEntity(createdVilla);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<VillaPaginationDto[]>> {
    const queryBuilder = this.villaRepository
      .createQueryBuilder('villa')
      .leftJoinAndSelect('villa.currency', 'currency')
      .leftJoinAndSelect('villa.owner', 'owner')
      .leftJoinAndSelect('villa.villaPolicies', 'villaPolicies')
      .leftJoinAndSelect('villaPolicies.policy', 'policy')
      .leftJoinAndSelect('policy.type', 'policyType')
      .leftJoinAndSelect('villa.villaPriceRules', 'villaPriceRules')
      .leftJoinAndSelect('villaPriceRules.priceRule', 'priceRule')
      .leftJoinAndSelect('priceRule.currency', 'priceRuleCurrency')
      .leftJoinAndSelect('villa.villaAdditionals', 'villaAdditionals')
      .leftJoinAndSelect('villaAdditionals.additional', 'additional')
      .leftJoinAndSelect('villa.villaFacilities', 'villaFacilities')
      .leftJoinAndSelect('villaFacilities.facility', 'facility')
      .leftJoinAndSelect('villa.villaFeatures', 'villaFeatures')
      .leftJoinAndSelect('villaFeatures.feature', 'feature')
      .leftJoinAndSelect('feature.currency', 'featureCurrency')
      .select([
        'villa.id',
        'villa.name',
        'villa.secondaryName',
        'villa.availability',
        'villa.dailyPrice',
        'villa.lowSeasonDailyPrice',
        'villa.highSeasonDailyPrice',
        'villa.peakSeasonDailyPrice',
        'villa.dailyPriceAfterDiscount',
        'villa.lowSeasonDailyPriceAfterDiscount',
        'villa.highSeasonDailyPriceAfterDiscount',
        'villa.peakSeasonDailyPriceAfterDiscount',
        'villa.priceMonthly',
        'villa.priceYearly',
        'villa.discountMonthlyType',
        'villa.discountYearlyType',
        'villa.discountMonthly',
        'villa.discountYearly',
        'villa.priceMonthlyAfterDiscount',
        'villa.priceYearlyAfterDiscount',
        'villa.availabilityQuotaPerMonth',
        'villa.availabilityQuotaPerYear',
        'villa.highlight',
        'villa.address',
        'villa.country',
        'villa.state',
        'villa.city',
        'villa.postalCode',
        'villa.mapLink',
        'villa.placeNearby',
        'villa.photos',
        'villa.videos',
        'villa.video360s',
        'villa.floorPlans',
        'villa.averageRating',
        'villa.totalReview',
        'villa.isFavorite',
        'villa.createdAt',

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

        'villaPolicies.id',
        'policy.id',
        'policy.name',
        'policy.icon',
        'policyType.id',
        'policyType.name',
        'policy.description',

        'villaPriceRules.id',
        'priceRule.id',
        'priceRule.name',
        'priceRule.isDiscount',
        'priceRule.discountType',
        'priceRule.discount',
        'priceRule.startDate',
        'priceRule.endDate',
        'priceRule.isActive',
        'priceRule.season',
        'priceRule.description',
        'priceRuleCurrency.id',
        'priceRuleCurrency.name',
        'priceRuleCurrency.code',
        'priceRuleCurrency.symbol',

        'villaAdditionals.id',
        'additional.id',
        'additional.name',
        'additional.type',
        'additional.photos',
        'additional.description',

        'villaFacilities.id',
        'facility.id',
        'facility.name',
        'facility.icon',
        'facility.type',

        'villaFeatures.id',
        'feature.id',
        'feature.name',
        'feature.type',
        'feature.icon',
        'feature.free',
        'feature.price',
        'feature.discountType',
        'feature.discount',
        'feature.priceAfterDiscount',
        'featureCurrency.id',
        'featureCurrency.name',
        'featureCurrency.code',
        'featureCurrency.symbol',
      ]);

    const paginatedVillas = await paginate(query, queryBuilder, {
      sortableColumns: [
        'isFavorite',
        'createdAt',
        'name',
        'secondaryName',
        'dailyPrice',
        'lowSeasonDailyPrice',
        'highSeasonDailyPrice',
        'peakSeasonDailyPrice',
        'dailyPriceAfterDiscount',
        'lowSeasonDailyPriceAfterDiscount',
        'highSeasonDailyPriceAfterDiscount',
        'peakSeasonDailyPriceAfterDiscount',
        'priceMonthly',
        'priceYearly',
        'discountMonthlyType',
        'discountYearlyType',
        'discountMonthly',
        'discountYearly',
        'priceMonthlyAfterDiscount',
        'priceYearlyAfterDiscount',
        'checkInHour',
        'checkOutHour',
        'averageRating',
        'availabilityQuotaPerMonth',
        'availabilityQuotaPerYear',
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
        currencyId: [FilterOperator.EQ],
        ownerId: [FilterOperator.EQ],

        discountMonthlyType: [FilterOperator.EQ],
        discountYearlyType: [FilterOperator.EQ],
        discountMonthly: [
          FilterOperator.EQ,
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        discountYearly: [
          FilterOperator.EQ,
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        dailyPrice: [FilterOperator.GTE, FilterOperator.LTE],
        lowSeasonDailyPrice: [FilterOperator.GTE, FilterOperator.LTE],
        highSeasonDailyPrice: [FilterOperator.GTE, FilterOperator.LTE],
        peakSeasonDailyPrice: [FilterOperator.GTE, FilterOperator.LTE],
        dailyPriceAfterDiscount: [FilterOperator.GTE, FilterOperator.LTE],
        lowSeasonDailyPriceAfterDiscount: [
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        highSeasonDailyPriceAfterDiscount: [
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        peakSeasonDailyPriceAfterDiscount: [
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        priceMonthly: [FilterOperator.GTE, FilterOperator.LTE],
        priceYearly: [FilterOperator.GTE, FilterOperator.LTE],
        priceMonthlyAfterDiscount: [FilterOperator.GTE, FilterOperator.LTE],
        priceYearlyAfterDiscount: [FilterOperator.GTE, FilterOperator.LTE],

        availability: [FilterOperator.IN, FilterOperator.CONTAINS],
        checkInHour: [
          FilterOperator.EQ,
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        checkOutHour: [
          FilterOperator.EQ,
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        averageRating: [
          FilterOperator.EQ,
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        isFavorite: [FilterOperator.EQ],
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],

        'placeNearby.name': [FilterOperator.ILIKE],
        'availabilityPerPrice.availability': [
          FilterOperator.IN,
          FilterOperator.CONTAINS,
        ],
        'availabilityPerPrice.quota': [
          FilterOperator.EQ,
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        'villaAdditionals.additional.name': [FilterOperator.ILIKE],
        'villaFacilities.facility.name': [FilterOperator.ILIKE],
        'villaFeatures.feature.name': [FilterOperator.ILIKE],
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
    });

    const currentDate = new Date();

    const villas = VillaPaginationDto.fromEntities(
      paginatedVillas.data.map((villa) => {
        if (villa.villaPriceRules) {
          villa.villaPriceRules = this._filterAndSortVillaPriceRule(
            currentDate,
            villa.villaPriceRules,
          );
        }

        return villa;
      }),
    );

    return paginateResponseMapper(paginatedVillas, villas);
  }

  async findOne(
    id: string,
    entityManager?: EntityManager,
  ): Promise<VillaWithRelationsDto> {
    const repository = this._getRepository(entityManager);

    const villa = await repository.findOne({
      select: {
        id: true,
        name: true,
        secondaryName: true,
        availability: true,
        dailyPrice: true,
        lowSeasonDailyPrice: true,
        highSeasonDailyPrice: true,
        peakSeasonDailyPrice: true,
        dailyPriceAfterDiscount: true,
        lowSeasonDailyPriceAfterDiscount: true,
        highSeasonDailyPriceAfterDiscount: true,
        peakSeasonDailyPriceAfterDiscount: true,
        priceMonthly: true,
        priceYearly: true,
        discountMonthlyType: true,
        discountYearlyType: true,
        discountMonthly: true,
        discountYearly: true,
        priceMonthlyAfterDiscount: true,
        priceYearlyAfterDiscount: true,
        availabilityQuotaPerMonth: true,
        availabilityQuotaPerYear: true,
        highlight: true,
        address: true,
        country: true,
        state: true,
        city: true,
        postalCode: true,
        mapLink: true,
        placeNearby: true,
        photos: true,
        videos: true,
        video360s: true,
        floorPlans: true,
        averageRating: true,
        totalReview: true,
        isFavorite: true,
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
        bookings: {
          id: true,
          checkInDate: true,
          checkOutDate: true,
          status: true,
          totalAmount: true,
          totalGuest: true,
          payments: {
            amount: true,
            paymentChannel: true,
            paymentMethod: true,
            status: true,
            paidAt: true,
          },
        },
        reviews: {
          message: true,
          rating: true,
          booking: {
            id: true,
            checkInDate: true,
            checkOutDate: true,
            customer: {
              id: true,
              name: true,
              phoneNumber: true,
              phoneCountryCode: true,
              email: true,
            },
          },
        },
        villaPolicies: {
          id: true,
          policy: {
            id: true,
            name: true,
            icon: true,
            type: {
              id: true,
              name: true,
            },
            description: true,
          },
        },
        villaPriceRules: {
          id: true,
          priceRule: {
            id: true,
            name: true,
            isDiscount: true,
            discountType: true,
            discount: true,
            startDate: true,
            endDate: true,
            isActive: true,
            season: true,
            description: true,
            currency: {
              id: true,
              name: true,
              code: true,
              symbol: true,
            },
          },
        },
        villaAdditionals: {
          id: true,
          additional: {
            id: true,
            name: true,
            type: true,
            photos: true,
            description: true,
          },
        },
        villaFacilities: {
          id: true,
          facility: {
            id: true,
            name: true,
            icon: true,
            type: true,
          },
        },
        villaFeatures: {
          id: true,
          feature: {
            id: true,
            name: true,
            type: true,
            icon: true,
            free: true,
            price: true,
            discountType: true,
            discount: true,
            priceAfterDiscount: true,
            currency: {
              id: true,
              name: true,
              code: true,
              symbol: true,
            },
          },
        },
      },
      where: {
        id,
      },
      relations: {
        currency: true,
        owner: true,
        reviews: { booking: { customer: true } },
        villaAdditionals: { additional: true },
        villaFeatures: { feature: { currency: true } },
        villaFacilities: { facility: true },
        villaPolicies: { policy: { type: true } },
        villaPriceRules: { priceRule: { currency: true } },
      },
    });

    if (!villa) {
      throw new NotFoundException(`villa not found`);
    }

    if (villa.villaPriceRules) {
      villa.villaPriceRules = this._filterAndSortVillaPriceRule(
        new Date(),
        villa.villaPriceRules,
      );
    }

    const currentPriceRule = villa.villaPriceRules[0]?.priceRule;

    if (currentPriceRule) {
      this._setCurrentDailyPrice(villa, currentPriceRule);
    }

    return VillaWithRelationsDto.fromEntity(villa);
  }

  async update(
    id: string,
    payload: UpdateVillaDto,
  ): Promise<VillaWithRelationsDto> {
    await this.datasource.transaction(async (manager) => {
      const initialData = await this.findOne(id, manager);

      const convertedBasePriceVillaData = (await this._convertToBaseCurrency(
        initialData,
      )) as VillaWithRelationsDto;

      const appliedPriceRuleVillaData =
        this._handleDailyPriceAfterDiscountUponUpdate(
          convertedBasePriceVillaData,
          payload,
        );

      const { additionals, facilities, features, policies, ...villaData } =
        appliedPriceRuleVillaData;

      const updatedVilla = await manager.update(Villa, id, villaData);

      if (Array.isArray(additionals)) {
        await manager.delete(VillaAdditionalPivot, { villaId: id });

        if (additionals.length > 0) {
          const updatedAdditionals = await manager.save(
            Additional,
            additionals,
          );

          await manager.save(
            VillaAdditionalPivot,
            updatedAdditionals.map((additional) => ({
              villaId: id,
              additionalId: additional.id,
            })),
          );
        }
      }

      if (Array.isArray(facilities)) {
        await manager.delete(VillaFacilityPivot, { villaId: id });

        if (facilities.length > 0) {
          await manager.save(
            VillaFacilityPivot,
            facilities.map((facility: UpdateVillaFacililtyPivotDto) => ({
              villaId: id,
              facilityId: facility.id,
              description: facility.description,
            })),
          );
        }
      }

      if (Array.isArray(features)) {
        await manager.delete(VillaFeaturePivot, { villaId: id });

        if (features.length > 0) {
          features.map((feature) =>
            this.featureService.handleDefaultDiscountType(feature),
          );

          const convertedBasePriceFeatures =
            await this.featureService.convertFeaturesToBaseCurrency(features);

          const updatedFeatures = await manager.save(
            Feature,
            convertedBasePriceFeatures,
          );

          await manager.save(
            VillaFeaturePivot,
            updatedFeatures.map((feature) => ({
              villaId: id,
              featureId: feature.id,
            })),
          );
        }
      }

      if (Array.isArray(policies)) {
        await manager.delete(VillaPolicyPivot, { villaId: id });

        if (policies.length > 0) {
          const updatedPolicies = await manager.save(VillaPolicy, policies);

          await manager.save(
            VillaPolicyPivot,
            updatedPolicies.map((policy: VillaPolicy) => ({
              villaId: id,
              policyId: policy.id,
            })),
          );
        }
      }

      return updatedVilla;
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.validateExist(id);

    await this.villaRepository.delete(id);
  }

  private _getRepository(entityManager?: EntityManager): Repository<Villa> {
    return entityManager
      ? entityManager.getRepository(Villa)
      : this.villaRepository;
  }

  async validateExist(id: string): Promise<void> {
    const exists = await this.villaRepository.exists({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('villa not found');
    }
  }

  async findBestSeller(option: BestSeller): Promise<GetVillaBestSellerDto> {
    const query = this.villaRepository
      .createQueryBuilder('villa')
      .leftJoinAndSelect('villa.currency', 'currency')
      .leftJoinAndSelect('villa.owner', 'owner')
      .leftJoinAndSelect('villa.reviews', 'reviews')
      .leftJoinAndSelect('reviews.villaBooking', 'villaBooking')
      .leftJoinAndSelect('villaBooking.customer', 'customer')
      .leftJoinAndSelect('villa.villaFacilities', 'additionals')
      .leftJoinAndSelect('villa.villaFeatures', 'facilities')
      .leftJoinAndSelect('villa.villaAdditionals', 'features')
      .leftJoinAndSelect('villa.villaPolicies', 'policies')
      .leftJoinAndSelect('villa.villaPriceRules', 'priceRules')
      .leftJoin('villa.bookings', 'booking', 'booking.status = :done', {
        done: VillaBookingStatus.Done,
      })
      .loadRelationCountAndMap(
        'villa.totalBooking',
        'villa.bookings',
        'totalBooking',
        (qb) =>
          qb.andWhere('totalBooking.status = :status', {
            status: VillaBookingStatus.Done,
          }),
      )
      .groupBy('villa.id')
      .addGroupBy('currency.id')
      .addGroupBy('owner.id')
      .addGroupBy('reviews.id')
      .addGroupBy('villaBooking.id')
      .addGroupBy('customer.id')
      .addGroupBy('additionals.id')
      .addGroupBy('facilities.id')
      .addGroupBy('features.id')
      .addGroupBy('policies.id')
      .addGroupBy('priceRules.id');

    query.addSelect('COUNT(booking.id)', 'booking_count');

    if (option === BestSeller.Rating) {
      query
        .orderBy('villa.averageRating', 'DESC', 'NULLS LAST')
        .addOrderBy('COUNT(booking.id)', 'DESC');
    } else {
      query
        .orderBy('COUNT(booking.id)', 'DESC')
        .addOrderBy('villa.averageRating', 'DESC', 'NULLS LAST');
    }

    const result = await query.limit(BEST_SELLER_LIMIT).getRawAndEntities();

    const orderedData = result.raw
      .map((rawItem) => {
        return result.entities.find((entity) => entity.id === rawItem.villa_id);
      })
      .filter(Boolean);

    const dtos = orderedData.map((villa) =>
      plainToClass(VillaWithRelationsDto, villa),
    );

    return { data: dtos };
  }

  private async _convertToBaseCurrency(
    villaData: CreateVillaDto | UpdateVillaDto | VillaWithRelationsDto,
  ): Promise<CreateVillaDto | UpdateVillaDto | VillaWithRelationsDto> {
    return {
      ...villaData,
      currencyId: await this.currencyService.findBaseCurrencyId(),
      dailyPrice: villaData.dailyPrice
        ? await this.currencyService.convertToBaseCurrency(
            villaData.currencyId,
            villaData.dailyPrice,
          )
        : null,
      lowSeasonDailyPrice: villaData.lowSeasonDailyPrice
        ? await this.currencyService.convertToBaseCurrency(
            villaData.currencyId,
            villaData.lowSeasonDailyPrice,
          )
        : null,
      highSeasonDailyPrice: villaData.highSeasonDailyPrice
        ? await this.currencyService.convertToBaseCurrency(
            villaData.currencyId,
            villaData.highSeasonDailyPrice,
          )
        : null,
      peakSeasonDailyPrice: villaData.peakSeasonDailyPrice
        ? await this.currencyService.convertToBaseCurrency(
            villaData.currencyId,
            villaData.peakSeasonDailyPrice,
          )
        : null,
      dailyPriceAfterDiscount: villaData.dailyPriceAfterDiscount
        ? await this.currencyService.convertToBaseCurrency(
            villaData.currencyId,
            villaData.dailyPriceAfterDiscount,
          )
        : null,
      lowSeasonDailyPriceAfterDiscount:
        villaData.lowSeasonDailyPriceAfterDiscount
          ? await this.currencyService.convertToBaseCurrency(
              villaData.currencyId,
              villaData.lowSeasonDailyPriceAfterDiscount,
            )
          : null,
      highSeasonDailyPriceAfterDiscount:
        villaData.highSeasonDailyPriceAfterDiscount
          ? await this.currencyService.convertToBaseCurrency(
              villaData.currencyId,
              villaData.highSeasonDailyPriceAfterDiscount,
            )
          : null,
      peakSeasonDailyPriceAfterDiscount:
        villaData.peakSeasonDailyPriceAfterDiscount
          ? await this.currencyService.convertToBaseCurrency(
              villaData.currencyId,
              villaData.peakSeasonDailyPriceAfterDiscount,
            )
          : null,
      priceMonthly: villaData.priceMonthly
        ? await this.currencyService.convertToBaseCurrency(
            villaData.currencyId,
            villaData.priceMonthly,
          )
        : null,
      priceYearly: villaData.priceYearly
        ? await this.currencyService.convertToBaseCurrency(
            villaData.currencyId,
            villaData.priceYearly,
          )
        : null,
      discountMonthly:
        villaData.discountMonthlyType === DiscountType.Fixed
          ? await this.currencyService.convertToBaseCurrency(
              villaData.currencyId,
              villaData.discountMonthly,
            )
          : villaData.discountMonthly,
      discountYearly:
        villaData.discountYearlyType === DiscountType.Fixed
          ? await this.currencyService.convertToBaseCurrency(
              villaData.currencyId,
              villaData.discountYearly,
            )
          : villaData.discountYearly,
    };
  }

  private _handleDailyPriceAfterDiscountUponUpdate(
    initialData: VillaWithRelationsDto,
    updatedData: UpdateVillaDto,
  ): UpdateVillaDto {
    const villaPriceRules = initialData.priceRules;

    const currentActiveDiscount = villaPriceRules.find(
      (villaPriceRule) =>
        villaPriceRule.startDate <= new Date() &&
        villaPriceRule.endDate >= new Date() &&
        villaPriceRule.isActive,
    );

    if (!currentActiveDiscount) {
      return updatedData;
    }

    const discountType =
      currentActiveDiscount.discountType ?? DiscountType.Percentage;
    const priceRuleDiscount = currentActiveDiscount.discount ?? 0;

    const dailyPrice =
      updatedData.dailyPrice != null
        ? updatedData.dailyPrice
        : (initialData.dailyPrice ?? 0);
    const lowSeasonDailyPrice =
      updatedData.lowSeasonDailyPrice != null
        ? updatedData.lowSeasonDailyPrice
        : (initialData.lowSeasonDailyPrice ?? 0);
    const highSeasonDailyPrice =
      updatedData.highSeasonDailyPrice != null
        ? updatedData.highSeasonDailyPrice
        : (initialData.highSeasonDailyPrice ?? 0);
    const peakSeasonDailyPrice =
      updatedData.peakSeasonDailyPrice != null
        ? updatedData.peakSeasonDailyPrice
        : (initialData.peakSeasonDailyPrice ?? 0);

    updatedData.dailyPriceAfterDiscount = Math.max(
      0,
      discountType === DiscountType.Fixed
        ? dailyPrice - priceRuleDiscount
        : dailyPrice * (1 - priceRuleDiscount / 100),
    );

    updatedData.lowSeasonDailyPriceAfterDiscount = Math.max(
      0,
      discountType === DiscountType.Fixed
        ? lowSeasonDailyPrice - priceRuleDiscount
        : lowSeasonDailyPrice * (1 - priceRuleDiscount / 100),
    );

    updatedData.highSeasonDailyPriceAfterDiscount = Math.max(
      0,
      discountType === DiscountType.Fixed
        ? highSeasonDailyPrice + priceRuleDiscount
        : highSeasonDailyPrice * (1 + priceRuleDiscount / 100),
    );

    updatedData.peakSeasonDailyPriceAfterDiscount = Math.max(
      0,
      discountType === DiscountType.Fixed
        ? peakSeasonDailyPrice + priceRuleDiscount
        : peakSeasonDailyPrice * (1 + priceRuleDiscount / 100),
    );

    return updatedData;
  }

  private _setCurrentDailyPrice(
    villa: VillaDto,
    priceRule: VillaPriceRuleWithRelationsDto,
  ): void {
    const { dailyPrice, dailyPriceAfterDiscount } = getVillaCurrentDailyPrice(
      priceRule,
      villa,
    );

    const villaCurrentPrices: CurrentVillaPrices = {
      currentSeason: priceRule.season,
      currentIsDiscount: priceRule.isDiscount,
      currentDiscountType: priceRule.discountType,
      currentDiscount: priceRule.discount,
      currentDailyPrice: dailyPrice,
      currentDailyPriceAfterDiscount: dailyPriceAfterDiscount,
      currencyId: priceRule.currencyId,
      currency: priceRule.currency,
    };

    villa.currentPrice = villaCurrentPrices;
  }

  private _filterAndSortVillaPriceRule(
    currentDate: Date,
    villaPriceRules: VillaPriceRulePivot[],
  ): VillaPriceRulePivot[] {
    villaPriceRules
      .filter((rule) => {
        const startDate = new Date(rule.priceRule.startDate);

        return currentDate >= startDate;
      })
      .sort(
        (a, b) =>
          new Date(b.priceRule.startDate).getTime() -
          new Date(a.priceRule.startDate).getTime(),
      );

    return villaPriceRules;
  }

  // Booking
  async createBooking(
    payload: CreateBookingDto,
  ): Promise<BookingWithRelationsDto> {
    const booking = await this.bookingService.create(payload);

    return booking;
  }
}
