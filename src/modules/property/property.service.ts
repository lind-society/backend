import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import {
  Additional,
  Feature,
  Property,
  PropertyAdditionalPivot,
  PropertyFacilityPivot,
  PropertyFeaturePivot,
} from 'src/database/entities';
import { DataSource, Repository } from 'typeorm';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyWithRelationsDto } from './dto/property.dto';

@Injectable()
export class PropertyService {
  constructor(
    private datasource: DataSource,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  async create(payload: CreatePropertyDto): Promise<PropertyWithRelationsDto> {
    const createdProperty = await this.datasource.transaction(
      async (manager) => {
        const { additionals, facilities, features, ...propertyData } = payload;
        const createdProperty = await manager.save(Property, propertyData);
        const createdAdditionals = await manager.save(Additional, additionals);

        const createdFeatures = await manager.save(Feature, features);

        await manager.save(
          PropertyFacilityPivot,
          facilities.map((facility) => ({
            propertyId: createdProperty.id,
            facilityId: facility.facilityId,
            description: facility.description,
          })),
        );

        await manager.save(
          PropertyAdditionalPivot,
          createdAdditionals.map((additional) => ({
            propertyId: createdProperty.id,
            additionalId: additional.id,
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

  async findOne(id: string): Promise<PropertyWithRelationsDto> {
    const property = await this.propertyRepository.findOne({
      where: {
        id,
      },
      relations: {
        propertyAdditionals: true,
        propertyFeatures: true,
        propertyFacilities: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`property not found`);
    }

    return plainToInstance(PropertyWithRelationsDto, {
      ...property,
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
}
