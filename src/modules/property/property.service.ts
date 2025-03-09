import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { omit } from 'lodash';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import {
  Additional,
  Feature,
  Property,
  PropertyAdditionalPivot,
  PropertyFacilityPivot,
  PropertyFeaturePivot,
} from 'src/database/entities';
import { DataSource, Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyWithRelationsDto } from './dto/property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertyService {
  constructor(
    private datasource: DataSource,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  private mapPropertyData(property: Property) {
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
      facilities: property.propertyFacilities.map(({ id, facility }) => ({
        pivotId: id,
        ...facility,
      })),
      features: property.propertyFeatures.map(({ id, feature }) => ({
        pivotId: id,
        ...feature,
      })),
    });
  }

  async create(payload: CreatePropertyDto): Promise<PropertyWithRelationsDto> {
    const createdProperty = await this.datasource.transaction(
      async (manager) => {
        const { additionals, facilities, features, ...propertyData } = payload;

        const createdProperty = await manager.save(Property, propertyData);

        const createdAdditionals = await manager.save(Additional, additionals);
        const createdFeatures = await manager.save(Feature, features);

        await manager.save(
          PropertyAdditionalPivot,
          createdAdditionals.map((additional) => ({
            propertyId: createdProperty.id,
            additionalId: additional.id,
          })),
        );

        await manager.save(
          PropertyFacilityPivot,
          facilities.map((facility) => ({
            propertyId: createdProperty.id,
            facilityId: facility.facilityId,
            description: facility.description,
          })),
        );

        await manager.save(
          PropertyFeaturePivot,
          createdFeatures.map((feature) => ({
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
        propertyFeatures: { feature: true },
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
        propertyFeatures: { feature: true },
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

    await this.datasource.transaction(async (manager) => {
      const { additionals, facilities, features, ...propertyData } = payload;

      const updatedProperty = await manager.update(Property, id, propertyData);

      if (additionals) {
        await manager.delete(PropertyAdditionalPivot, { propertyId: id });

        const updatedAdditionals = await manager.save(Additional, additionals);

        await manager.save(
          PropertyAdditionalPivot,
          updatedAdditionals.map((additional) => ({
            propertyId: id,
            additionalId: additional.id,
          })),
        );
      }

      if (facilities) {
        await manager.delete(PropertyFacilityPivot, { propertyId: id });

        await manager.save(
          PropertyFacilityPivot,
          facilities.map((facility) => ({
            propertyId: id,
            facilityId: facility.facilityId,
            description: facility.description,
          })),
        );
      }

      if (features) {
        await manager.delete(PropertyFeaturePivot, { propertyId: id });

        const updatedFeatures = await manager.save(Feature, features);

        await manager.save(
          PropertyFeaturePivot,
          updatedFeatures.map((feature) => ({
            propertyId: id,
            featureId: feature.id,
          })),
        );
      }

      return updatedProperty;
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.propertyRepository.delete(id);
  }
}
