import { paginateResponseMapper } from '@apps/main/common/helpers';
import {
  Additional,
  DiscountType,
  Feature,
  Property,
  PropertyAdditionalPivot,
  PropertyFacilityPivot,
  PropertyFeaturePivot,
} from '@apps/main/database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { omit } from 'lodash';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CurrencyService } from '../currency/currency.service';
import { FacilityService } from '../facility/facility.service';
import { FeatureService } from '../feature/feature.service';
import { OwnerService } from '../owner/owner.service';
import { PaginateResponseDataProps } from '../shared/dto';
import {
  CreatePropertyFacililtyPivotDto,
  UpdatePropertyFacililtyPivotDto,
} from './dto';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyWithRelationsDto } from './dto/property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectDataSource()
    private datasource: DataSource,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    private currencyService: CurrencyService,
    private facilityService: FacilityService,
    private featureService: FeatureService,
    private ownerService: OwnerService,
  ) {}

  async create(payload: CreatePropertyDto): Promise<PropertyWithRelationsDto> {
    this._handleDefaultDiscountType(payload);

    const { additionals, facilities, features, ...propertyData } = payload;

    await this._validateRelatedEntities(
      payload.currencyId,
      payload.ownerId,
      facilities,
    );

    const createdProperty = await this.datasource.transaction(
      async (manager: EntityManager) => {
        const convertedBasePricePropertyData =
          await this._convertToBaseCurrency(propertyData);

        const createdProperty = await manager.save(
          Property,
          convertedBasePricePropertyData,
        );

        if (Array.isArray(additionals) && additionals.length > 0) {
          const createdAdditionals = await manager.save(
            Additional,
            additionals,
          );

          await manager.save(
            PropertyAdditionalPivot,
            createdAdditionals.map((additional: Additional) => ({
              propertyId: createdProperty.id,
              additionalId: additional.id,
            })),
          );
        }

        await manager.save(
          PropertyFacilityPivot,
          facilities.map((facility: CreatePropertyFacililtyPivotDto) => ({
            propertyId: createdProperty.id,
            facilityId: facility.id,
            description: facility.description,
          })),
        );

        if (Array.isArray(additionals) && additionals.length > 0) {
          features.map((feature) =>
            this.featureService.handleDefaultDiscountType(feature),
          );

          const convertedBasePriceFeatures =
            await this.featureService.convertFeaturesToBaseCurrency(features);

          const createdFeatures = await manager.save(
            Feature,
            convertedBasePriceFeatures,
          );

          await manager.save(
            PropertyFeaturePivot,
            createdFeatures.map((feature: Feature) => ({
              propertyId: createdProperty.id,
              featureId: feature.id,
            })),
          );
        }

        return createdProperty;
      },
    );

    return this.findOne(createdProperty.id);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<PropertyWithRelationsDto[]>> {
    const paginatedProperties = await paginate(query, this.propertyRepository, {
      sortableColumns: [
        'isFavorite',
        'createdAt',
        'name',
        'secondaryName',
        'soldStatus',
        'ownershipType',
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
        currencyId: [FilterOperator.EQ],
        ownerId: [FilterOperator.EQ],

        discountType: [FilterOperator.EQ],
        discount: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
        price: [FilterOperator.GTE, FilterOperator.LTE],
        priceAfterDiscount: [FilterOperator.GTE, FilterOperator.LTE],

        soldStatus: [FilterOperator.EQ],
        ownershipType: [FilterOperator.EQ],
        averageRating: [
          FilterOperator.EQ,
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        isFavorite: [FilterOperator.EQ],
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],

        'placeNearby.name': [FilterOperator.ILIKE],
        'propertyAdditionals.additional.name': [FilterOperator.ILIKE],
        'propertyFacilities.facility.name': [FilterOperator.ILIKE],
        'propertyFeatures.feature.name': [FilterOperator.ILIKE],
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
        propertyAdditionals: { additional: true },
        propertyFeatures: { feature: { currency: true } },
        propertyFacilities: { facility: true },
      },
    });

    const mappedPaginatedProperties = paginatedProperties.data.map((property) =>
      this._mapPropertyData(property),
    );

    return paginateResponseMapper(
      paginatedProperties,
      mappedPaginatedProperties,
    );
  }

  async findOne(
    id: string,
    entityManager?: EntityManager,
  ): Promise<PropertyWithRelationsDto> {
    const repository = entityManager
      ? entityManager.getRepository(Property)
      : this.propertyRepository;

    const property = await repository.findOne({
      where: {
        id,
      },
      relations: {
        currency: true,
        owner: true,
        propertyAdditionals: { additional: true },
        propertyFeatures: { feature: { currency: true } },
        propertyFacilities: { facility: true },
      },
    });

    if (!property) {
      throw new NotFoundException(`property not found`);
    }

    return this._mapPropertyData(property);
  }

  async update(
    id: string,
    payload: UpdatePropertyDto,
  ): Promise<PropertyWithRelationsDto> {
    this._handleDefaultDiscountType(payload);

    const { additionals, facilities, features, ...propertyData } = payload;

    await this._validateRelatedEntities(
      payload.currencyId,
      payload.ownerId,
      facilities,
    );

    await this.datasource.transaction(async (manager: EntityManager) => {
      await this.findOne(id, manager);

      const updatedProperty = await manager.update(Property, id, propertyData);

      if (Array.isArray(additionals)) {
        await manager.delete(PropertyAdditionalPivot, { propertyId: id });

        if (additionals.length > 0) {
          const updatedAdditionals = await manager.save(
            Additional,
            additionals,
          );

          await manager.save(
            PropertyAdditionalPivot,
            updatedAdditionals.map((additional: Additional) => ({
              propertyId: id,
              additionalId: additional.id,
            })),
          );
        }
      }

      if (Array.isArray(facilities)) {
        await manager.delete(PropertyFacilityPivot, { propertyId: id });

        if (facilities.length > 0) {
          await manager.save(
            PropertyFacilityPivot,
            facilities.map((facility: UpdatePropertyFacililtyPivotDto) => ({
              propertyId: id,
              facilityId: facility.id,
              description: facility.description,
            })),
          );
        }
      }

      if (Array.isArray(features)) {
        await manager.delete(PropertyFeaturePivot, { propertyId: id });

        if (features.length > 0) {
          features.map((feature) =>
            this.featureService.handleDefaultDiscountType(feature),
          );

          const updatedFeatures = await manager.save(Feature, features);

          await manager.save(
            PropertyFeaturePivot,
            updatedFeatures.map((feature: Feature) => ({
              propertyId: id,
              featureId: feature.id,
            })),
          );
        }
      }

      return updatedProperty;
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.propertyRepository.delete(id);
  }

  private _mapPropertyData(property: Property) {
    return plainToInstance(PropertyWithRelationsDto, {
      ...omit(property, [
        'propertyAdditionals',
        'propertyFacilities',
        'propertyFeatures',
      ]),

      additionals: property.propertyAdditionals.map(({ id, additional }) => ({
        pivotId: id,
        ...additional,
      })),

      facilities: property.propertyFacilities.map(
        ({ id, description, facility }) => ({
          pivotId: id,
          description,
          ...facility,
        }),
      ),

      features: property.propertyFeatures.map(({ id, feature }) => ({
        pivotId: id,
        ...feature,
      })),
    });
  }

  private async _validateRelatedEntities(
    currencyId?: string,
    ownerId?: string,
    facilities?: CreatePropertyFacililtyPivotDto[],
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
  }

  private async _convertToBaseCurrency(
    propertyData: CreatePropertyDto | UpdatePropertyDto,
  ): Promise<CreatePropertyDto | UpdatePropertyDto> {
    return {
      ...propertyData,
      currencyId: await this.currencyService.findBaseCurrencyId(),
      price: await this.currencyService.convertToBaseCurrency(
        propertyData.currencyId,
        propertyData.price,
      ),
      discount:
        propertyData.discountType === DiscountType.Fixed
          ? await this.currencyService.convertToBaseCurrency(
              propertyData.currencyId,
              propertyData.discount,
            )
          : propertyData.discount,
    };
  }

  private async _handleDefaultDiscountType(
    payload: CreatePropertyDto | UpdatePropertyDto,
  ) {
    if (payload.discount && !payload.discountType) {
      payload.discountType = DiscountType.Percentage;
    }
  }
}
