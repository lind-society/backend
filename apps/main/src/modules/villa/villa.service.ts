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
} from '@apps/main/database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { omit } from 'lodash';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CurrencyService } from '../currency/currency.service';
import { FacilityService } from '../facility/facility.service';
import { CreateFeatureDto } from '../feature/dto';
import { FeatureService } from '../feature/feature.service';
import { OwnerService } from '../owner/owner.service';
import { PaginateResponseDataProps } from '../shared/dto';
import {
  CreateVillaFacililtyPivotDto,
  GetVillaBestSellerDto,
  UpdateVillaFacililtyPivotDto,
  VillaWithRelationsDto,
} from './dto';
import { CreateVillaDto } from './dto/create-villa.dto';
import { UpdateVillaDto } from './dto/update-villa.dto';
import { CreateVillaPolicyDto, UpdateVillaPolicyDto } from './policy/dto';
import { VillaPolicyTypeService } from './policy/type/villa-policy-type.service';

@Injectable()
export class VillaService {
  constructor(
    @InjectDataSource()
    private datasource: DataSource,
    @InjectRepository(Villa)
    private villaRepository: Repository<Villa>,
    private currencyService: CurrencyService,
    private facilityService: FacilityService,
    private featureService: FeatureService,
    private ownerService: OwnerService,
    private villaPolicyTypeService: VillaPolicyTypeService,
  ) {}

  async create(payload: CreateVillaDto): Promise<VillaWithRelationsDto> {
    this._handleDefaultDiscountType(payload);

    payload.dailyPriceAfterDiscount = payload.dailyPrice;
    payload.lowSeasonDailyPriceAfterDiscount = payload.lowSeasonDailyPrice;
    payload.highSeasonDailyPriceAfterDiscount = payload.highSeasonDailyPrice;
    payload.peakSeasonDailyPriceAfterDiscount = payload.peakSeasonDailyPrice;

    await this._validateRelatedEntities(
      payload.currencyId,
      payload.ownerId,
      payload.facilities,
    );

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

    return this.findOne(createdVilla.id);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<VillaWithRelationsDto[]>> {
    const paginatedVilla = await paginate(query, this.villaRepository, {
      sortableColumns: [
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
        'villaPolicies.policy.name': [FilterOperator.ILIKE],
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
        currency: true,
        owner: true,
        reviews: { villaBooking: { customer: true } },
        villaAdditionals: { additional: true },
        villaFeatures: { feature: { currency: true } },
        villaFacilities: { facility: true },
        villaPolicies: { policy: { type: true } },
        villaPriceRules: { priceRule: true },
      },
    });

    const mappedPaginatedVilla = paginatedVilla.data.map((villa) =>
      this._mapVillaData(villa),
    );

    return paginateResponseMapper(paginatedVilla, mappedPaginatedVilla);
  }

  async findOne(
    id: string,
    entityManager?: EntityManager,
  ): Promise<VillaWithRelationsDto> {
    const repository = entityManager
      ? entityManager.getRepository(Villa)
      : this.villaRepository;

    const villa = await repository.findOne({
      where: {
        id,
      },
      relations: {
        currency: true,
        owner: true,
        reviews: { villaBooking: { customer: true } },
        villaAdditionals: { additional: true },
        villaFeatures: { feature: { currency: true } },
        villaFacilities: { facility: true },
        villaPolicies: { policy: { type: true } },
        villaPriceRules: { priceRule: true },
      },
    });

    if (!villa) {
      throw new NotFoundException(`villa not found`);
    }

    const currentDate = new Date();

    if (villa.villaPriceRules) {
      villa.villaPriceRules = villa.villaPriceRules.filter((rule) => {
        const startDate = new Date(rule.priceRule.startDate);
        const endDate = new Date(rule.priceRule.endDate);

        return (
          currentDate >= startDate &&
          currentDate <= endDate &&
          rule.priceRule.isActive
        );
      });
    }

    return this._mapVillaData(villa);
  }

  async update(
    id: string,
    payload: UpdateVillaDto,
  ): Promise<VillaWithRelationsDto> {
    this._handleDefaultDiscountType(payload);

    await this._validateRelatedEntities(
      payload.currencyId,
      payload.ownerId,
      payload.facilities,
    );

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
    await this.findOne(id);

    await this.villaRepository.delete(id);
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

  private _mapVillaData(villa: Villa): VillaWithRelationsDto {
    return plainToInstance(VillaWithRelationsDto, {
      ...omit(villa, [
        'villaAdditionals',
        'villaFacilities',
        'villaFeatures',
        'villaPolicies',
        'villaPriceRules',
      ]),

      additionals: villa.villaAdditionals.map(({ id, additional }) => ({
        pivotId: id,
        ...additional,
      })),

      facilities: villa.villaFacilities.map(
        ({ id, description, facility }) => ({
          pivotId: id,
          description,
          ...facility,
        }),
      ),

      features: villa.villaFeatures.map(({ id, feature }) => ({
        pivotId: id,
        ...feature,
      })),

      policies: villa.villaPolicies.map(({ id, policy }) => ({
        pivotId: id,
        ...policy,
      })),

      priceRules: villa.villaPriceRules.map(({ id, priceRule }) => ({
        pivotId: id,
        ...priceRule,
      })),
    });
  }

  private async _validateRelatedEntities(
    currencyId?: string,
    ownerId?: string,
    facilities?:
      | CreateVillaFacililtyPivotDto[]
      | UpdateVillaFacililtyPivotDto[],
    policies?: CreateVillaPolicyDto[] | UpdateVillaPolicyDto[],
  ): Promise<void> {
    if (currencyId) {
      await this.currencyService.findOne(currencyId);
    }

    if (ownerId) {
      await this.ownerService.findOne(ownerId);
    }

    if (Array.isArray(facilities) && facilities.length > 0) {
      const ids = facilities.map((facility) => facility.id);

      await this.facilityService.validateFaciliies(ids);
    }

    if (Array.isArray(policies) && policies.length > 0) {
      const typeIds = policies.map(
        (policy: CreateVillaPolicyDto | UpdateVillaPolicyDto) => policy.typeId,
      );

      await this.villaPolicyTypeService.validateVillaPolicyTypes(typeIds);
    }
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

  private async _handleDefaultDiscountType(
    payload: CreateVillaDto | UpdateVillaDto,
  ) {
    if (payload.discountMonthly && !payload.discountMonthlyType) {
      payload.discountMonthlyType = DiscountType.Percentage;
    }

    if (payload.discountYearly && !payload.discountYearlyType) {
      payload.discountYearlyType = DiscountType.Percentage;
    }
  }

  private _handleDailyPriceAfterDiscountUponUpdate(
    initialData: VillaWithRelationsDto,
    updatedData: UpdateVillaDto,
  ): UpdateVillaDto {
    const villaPriceRules = initialData.priceRules.map(({ id, priceRule }) => ({
      pivotId: id,
      ...priceRule,
    }));

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
}
