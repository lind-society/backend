import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { omit } from 'lodash';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { groupAndSort, paginateResponseMapper } from 'src/common/helpers';
import {
  Additional,
  DiscountType,
  Feature,
  Property,
  PropertyAdditionalPivot,
  PropertyFacilityPivot,
  PropertyFeaturePivot,
} from 'src/database/entities';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CurrencyService } from '../currency/currency.service';
import { FacilityService } from '../facility/facility.service';
import { FeatureService } from '../feature/feature.service';
import { OwnerService } from '../owner/owner.service';
import { PaginateResponseDataProps } from '../shared/dto';
import { CreatePropertyFacililtyDto } from './dto';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyWithRelationsDto } from './dto/property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertyService {
  constructor(
    private datasource: DataSource,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    private currencyService: CurrencyService,
    private facilityService: FacilityService,
    private featureService: FeatureService,
    private ownerService: OwnerService,
  ) {}

  private mapPropertyData(property: Property) {
    return plainToInstance(PropertyWithRelationsDto, {
      ...omit(property, [
        'propertyAdditionals',
        'propertyFacilities',
        'propertyFeatures',
      ]),

      additionals: groupAndSort(
        property.propertyAdditionals.map(({ id, additional }) => ({
          pivotId: id,
          ...additional,
        })),
        'type',
        'name',
      ),

      facilities: groupAndSort(
        property.propertyFacilities.map(({ id, facility }) => ({
          pivotId: id,
          ...facility,
        })),
        'type',
        'name',
      ),

      features: property.propertyFeatures.map(({ id, feature }) => ({
        pivotId: id,
        ...feature,
      })),
    });
  }

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
        const createdProperty = await manager.save(Property, propertyData);

        const createdAdditionals = await manager.save(Additional, additionals);

        features.map((feature) =>
          this.featureService.handleDefaultDiscountType(feature),
        );

        const createdFeatures = await manager.save(Feature, features);

        await manager.save(
          PropertyAdditionalPivot,
          createdAdditionals.map((additional: Additional) => ({
            propertyId: createdProperty.id,
            additionalId: additional.id,
          })),
        );

        await manager.save(
          PropertyFacilityPivot,
          facilities.map((facility: CreatePropertyFacililtyDto) => ({
            propertyId: createdProperty.id,
            facilityId: facility.facilityId,
            description: facility.description,
          })),
        );

        await manager.save(
          PropertyFeaturePivot,
          createdFeatures.map((feature: Feature) => ({
            propertyId: createdProperty.id,
            featureId: feature.id,
          })),
        );

        return createdProperty;
      },
    );

    return this.findOne(createdProperty.id);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<PropertyWithRelationsDto[]>> {
    const paginatedProperties = await paginate(query, this.propertyRepository, {
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      defaultLimit: 10,
      searchableColumns: [
        'name',
        'propertyAdditionals.additional.name',
        'propertyFacilities.facility.name',
        'propertyFeatures.feature.name',
      ],
      relations: {
        propertyAdditionals: { additional: true },
        propertyFeatures: { feature: { currency: true } },
        propertyFacilities: { facility: true },
      },
    });

    const mappedPaginatedProperties = paginatedProperties.data.map((property) =>
      this.mapPropertyData(property),
    );

    return paginateResponseMapper(
      paginatedProperties,
      mappedPaginatedProperties,
    );
  }

  async findOne(id: string): Promise<PropertyWithRelationsDto> {
    const property = await this.propertyRepository.findOne({
      where: {
        id,
      },
      relations: {
        propertyAdditionals: { additional: true },
        propertyFeatures: { feature: { currency: true } },
        propertyFacilities: { facility: true },
      },
    });

    if (!property) {
      throw new NotFoundException(`property not found`);
    }

    return this.mapPropertyData(property);
  }

  async update(
    id: string,
    payload: UpdatePropertyDto,
  ): Promise<PropertyWithRelationsDto> {
    await this.findOne(id);

    this._handleDefaultDiscountType(payload);

    const { additionals, facilities, features, ...propertyData } = payload;

    await this._validateRelatedEntities(
      payload.currencyId,
      payload.ownerId,
      facilities,
    );

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
            facilities.map((facility: CreatePropertyFacililtyDto) => ({
              propertyId: id,
              facilityId: facility.facilityId,
              description: facility.description,
            })),
          );
        }
      }

      if (Array.isArray(features)) {
        await manager.delete(PropertyFeaturePivot, { propertyId: id });

        if (facilities.length > 0) {
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

  private async _validateRelatedEntities(
    currencyId?: string,
    ownerId?: string,
    facilities?: CreatePropertyFacililtyDto[],
  ): Promise<void> {
    if (currencyId) {
      await this.currencyService.findOne(currencyId);
    }

    if (ownerId) {
      await this.ownerService.findOne(ownerId);
    }

    if (Array.isArray(facilities) && facilities.length > 0) {
      const facilityIds = facilities.map((facility) => facility.facilityId);

      await this.facilityService.validateFaciliies(facilityIds);
    }
  }

  private async _handleDefaultDiscountType(
    payload: CreatePropertyDto | UpdatePropertyDto,
  ) {
    if (payload.discount && !payload.discountType) {
      payload.discountType = DiscountType.Percentage;
    }
  }
}
