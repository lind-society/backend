import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { omit } from 'lodash';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import {
  Additional,
  DiscountType,
  Feature,
  PriceRuleSeason,
  Villa,
  VillaAdditionalPivot,
  VillaFacilityPivot,
  VillaFeaturePivot,
  VillaPolicy,
} from 'src/database/entities';
import { VillaPolicyPivot } from 'src/database/entities/villa-policy-pivot.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CurrencyService } from '../currency/currency.service';
import { FacilityService } from '../facility/facility.service';
import { CreateFeatureDto } from '../feature/dto';
import { FeatureService } from '../feature/feature.service';
import { OwnerService } from '../owner/owner.service';
import { PaginateResponseDataProps } from '../shared/dto';
import {
  CreateVillaFacililtyPivotDto,
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

    payload.dailyBasePriceAfterSeasonRate = payload.dailyBasePrice;

    const { additionals, facilities, features, policies, ...villaData } =
      payload;

    await this._validateRelatedEntities(
      payload.currencyId,
      payload.ownerId,
      facilities,
    );

    const createdVilla = await this.datasource.transaction(
      async (manager: EntityManager) => {
        const convertedBasePriceVillaData =
          await this._convertToBaseCurrency(villaData);

        const createdVilla = await manager.save(
          Villa,
          convertedBasePriceVillaData,
        );

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
        'dailyBasePrice',
        'dailyBasePriceAfterSeasonRate',
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
        dailyBasePrice: [FilterOperator.GTE, FilterOperator.LTE],
        dailyBasePriceAfterSeasonRate: [FilterOperator.GTE, FilterOperator.LTE],
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

    return this._mapVillaData(villa);
  }

  async update(
    id: string,
    payload: UpdateVillaDto,
  ): Promise<VillaWithRelationsDto> {
    this._handleDefaultDiscountType(payload);

    const { additionals, facilities, features, policies, ...villaData } =
      payload;

    await this._validateRelatedEntities(
      payload.currencyId,
      payload.ownerId,
      facilities,
    );

    await this.datasource.transaction(async (manager) => {
      const initialData = await this.findOne(id, manager);

      if (villaData.dailyBasePrice) {
        villaData.dailyBasePriceAfterSeasonRate =
          this._handleDailyBasePriceAfterSeasonRateUponUpdate(initialData);
      }

      const convertedBasePriceVillaData =
        await this._convertToBaseCurrency(villaData);

      const updatedVilla = await manager.update(
        Villa,
        id,
        convertedBasePriceVillaData,
      );

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
    villaData: CreateVillaDto | UpdateVillaDto,
  ): Promise<CreateVillaDto | UpdateVillaDto> {
    return {
      ...villaData,
      currencyId: await this.currencyService.findBaseCurrencyId(),
      dailyBasePrice: await this.currencyService.convertToBaseCurrency(
        villaData.currencyId,
        villaData.dailyBasePrice,
      ),
      dailyBasePriceAfterSeasonRate:
        await this.currencyService.convertToBaseCurrency(
          villaData.currencyId,
          villaData.dailyBasePriceAfterSeasonRate,
        ),
      priceMonthly: await this.currencyService.convertToBaseCurrency(
        villaData.currencyId,
        villaData.priceMonthly,
      ),
      priceYearly: await this.currencyService.convertToBaseCurrency(
        villaData.currencyId,
        villaData.priceYearly,
      ),
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

  private _handleDailyBasePriceAfterSeasonRateUponUpdate(
    villaData: VillaWithRelationsDto,
  ): number {
    const villaPriceRules = villaData.priceRules.map(({ id, priceRule }) => ({
      pivotId: id,
      ...priceRule,
    }));

    const currentActiveSeasonRate = villaPriceRules.find(
      (villaPriceRule) =>
        villaPriceRule.startDate <= new Date() &&
        villaPriceRule.endDate >= new Date() &&
        villaPriceRule.isActive,
    );

    if (!currentActiveSeasonRate) {
      return villaData.dailyBasePrice;
    }

    switch (currentActiveSeasonRate.season) {
      case PriceRuleSeason.Low_Season:
        return (
          villaData.dailyBasePrice * (1 - villaData.lowSeasonPriceRate / 100)
        );
      case PriceRuleSeason.Regular_Season:
        return (
          villaData.dailyBasePrice *
          (1 - currentActiveSeasonRate.discount / 100)
        );
      case PriceRuleSeason.High_Season:
        return (
          villaData.dailyBasePrice * (1 + villaData.highSeasonPriceRate / 100)
        );
      case PriceRuleSeason.Peak_Season:
        return (
          villaData.dailyBasePrice * (1 + villaData.peakSeasonPriceRate / 100)
        );
      default:
        return villaData.dailyBasePrice;
    }
  }
}
