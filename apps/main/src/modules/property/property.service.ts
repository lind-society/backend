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
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CurrencyService } from '../currency/currency.service';
import { FeatureService } from '../feature/feature.service';
import { PaginateResponseDataProps } from '../shared/dto';
import {
  CreatePropertyFacililtyPivotDto,
  PropertyPaginationDto,
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
    private featureService: FeatureService,
  ) {}

  async create(payload: CreatePropertyDto): Promise<PropertyWithRelationsDto> {
    const { additionals, facilities, features, ...propertyData } = payload;

    const createdProperty = await this.datasource.transaction(
      async (manager: EntityManager) => {
        const convertedBasePricePropertyData =
          await this._convertToBaseCurrency(propertyData);

        const propertyEntity = manager.create(
          Property,
          convertedBasePricePropertyData,
        );

        const createdProperty = await manager.save(Property, propertyEntity);

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
          facilities.map((pivot: CreatePropertyFacililtyPivotDto) => ({
            propertyId: createdProperty.id,
            ...pivot,
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
  ): Promise<PaginateResponseDataProps<PropertyPaginationDto[]>> {
    const queryBuilder = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.currency', 'currency')
      .leftJoinAndSelect('property.owner', 'owner')
      .leftJoinAndSelect('property.propertyAdditionals', 'propertyAdditionals')
      .leftJoinAndSelect('propertyAdditionals.additional', 'additional')
      .leftJoinAndSelect('property.propertyFacilities', 'propertyFacilities')
      .leftJoinAndSelect('propertyFacilities.facility', 'facility')
      .leftJoinAndSelect('property.propertyFeatures', 'propertyFeatures')
      .leftJoinAndSelect('propertyFeatures.feature', 'feature')
      .leftJoinAndSelect('feature.currency', 'featureCurrency')
      .select([
        'property.id',
        'property.name',
        'property.secondaryName',
        'property.price',
        'property.discountType',
        'property.discount',
        'property.priceAfterDiscount',
        'property.highlight',
        'property.address',
        'property.country',
        'property.state',
        'property.city',
        'property.postalCode',
        'property.mapLink',
        'property.placeNearby',
        'property.photos',
        'property.videos',
        'property.video360s',
        'property.floorPlans',
        'property.isFavorite',
        'property.soldStatus',
        'property.createdAt',

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

        'propertyAdditionals.id',
        'additional.id',
        'additional.name',
        'additional.type',
        'additional.photos',
        'additional.description',

        'propertyFacilities.id',
        'facility.id',
        'facility.name',
        'facility.icon',
        'facility.type',

        'propertyFeatures.id',
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

    const paginatedProperties = await paginate(query, queryBuilder, {
      sortableColumns: [
        'isFavorite',
        'createdAt',
        'name',
        'secondaryName',
        'soldStatus',
        'ownershipType',
      ],
      defaultSortBy: [
        ['isFavorite', 'DESC'],
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
        isFavorite: [FilterOperator.EQ],
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],
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

    const properties = PropertyPaginationDto.fromEntities(
      paginatedProperties.data,
    );

    return paginateResponseMapper(paginatedProperties, properties);
  }

  async findOne(
    id: string,
    entityManager?: EntityManager,
  ): Promise<PropertyWithRelationsDto> {
    const repository = this._getRepository(entityManager);

    const property = await repository.findOne({
      select: {
        id: true,
        name: true,
        secondaryName: true,
        price: true,
        discountType: true,
        discount: true,
        priceAfterDiscount: true,
        ownershipType: true,
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
        soldStatus: true,
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
        propertyAdditionals: {
          id: true,
          additional: {
            id: true,
            name: true,
            type: true,
            photos: true,
            description: true,
          },
        },
        propertyFacilities: {
          id: true,
          facility: {
            id: true,
            name: true,
            icon: true,
            type: true,
          },
        },
        propertyFeatures: {
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
        propertyAdditionals: { additional: true },
        propertyFeatures: { feature: { currency: true } },
        propertyFacilities: { facility: true },
      },
    });

    if (!property) {
      throw new NotFoundException(`property not found`);
    }

    return PropertyWithRelationsDto.fromEntity(property);
  }

  async update(
    id: string,
    payload: UpdatePropertyDto,
  ): Promise<PropertyWithRelationsDto> {
    await this.validateExist(id);

    const { additionals, facilities, features, ...propertyData } = payload;

    await this.datasource.transaction(async (manager: EntityManager) => {
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
            facilities.map((pivot: UpdatePropertyFacililtyPivotDto) => ({
              propertyId: id,
              ...pivot,
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
    await this.validateExist(id);

    await this.propertyRepository.delete(id);
  }

  private _getRepository(entityManager?: EntityManager): Repository<Property> {
    return entityManager
      ? entityManager.getRepository(Property)
      : this.propertyRepository;
  }

  async validateExist(id: string): Promise<void> {
    const exists = await this.propertyRepository.exists({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('property not found');
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
}
