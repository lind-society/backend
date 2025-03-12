import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { omit } from 'lodash';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import {
  groupAndSort,
  paginateResponseMapper,
  validatePayloadFromObjectKey,
} from 'src/common/helpers';
import {
  Additional,
  Feature,
  Villa,
  VillaAdditionalPivot,
  VillaFacilityPivot,
  VillaFeaturePivot,
  VillaPolicy,
} from 'src/database/entities';
import { VillaPolicyPivot } from 'src/database/entities/villa-policy-pivot.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import { CreateVillaFacililtyDto, VillaWithRelationsDto } from './dto';
import { CreateVillaDto } from './dto/create-villa.dto';
import { UpdateVillaDto } from './dto/update-villa.dto';

@Injectable()
export class VillaService {
  constructor(
    private datasource: DataSource,
    @InjectRepository(Villa)
    private villaRepository: Repository<Villa>,
  ) {}

  private mapVillaData(villa: Villa) {
    return plainToInstance(VillaWithRelationsDto, {
      ...omit(villa, [
        'villaAdditionals',
        'villaFacilities',
        'villaFeatures',
        'villaPolicies',
      ]),


      additionals: groupAndSort(
        villa.villaAdditionals.map(({ id, additional }) => ({
          pivotId: id,
          ...additional,
        })),
        'type',
        'name',
      ),

      facilities: groupAndSort(
        villa.villaFacilities.map(({ id, facility }) => ({
          pivotId: id,
          ...facility,
        })),
        'type',
        'name',
      ),

      features: villa.villaFeatures.map(({ id, feature }) => ({
        pivotId: id,
        ...feature,
      })),

      policies: villa.villaPolicies.map(({ id, policy }) => ({
        pivotId: id,
        ...policy,
      })),
    });
  }

  async create(payload: CreateVillaDto): Promise<VillaWithRelationsDto> {
    const createdVilla = await this.datasource.transaction(
      async (manager: EntityManager) => {
        const { additionals, facilities, features, policies, ...villaData } =
          payload;

        validatePayloadFromObjectKey(payload, {
          additionals,
          facilities,
          features,
          policies,
        });

        const createdVilla = await manager.save(Villa, villaData);

        const createdAdditionals = await manager.save(Additional, additionals);
        const createdFeatures = await manager.save(Feature, features);
        const createdPolicies = await manager.save(VillaPolicy, policies);

        await manager.save(
          VillaAdditionalPivot,
          createdAdditionals.map((additional: Additional) => ({
            villaId: createdVilla.id,
            additionalId: additional.id,
          })),
        );

        await manager.save(
          VillaFacilityPivot,
          facilities.map((facility: CreateVillaFacililtyDto) => ({
            villaId: createdVilla.id,
            facilityId: facility.facilityId,
            description: facility.description,
          })),
        );

        await manager.save(
          VillaFeaturePivot,
          createdFeatures.map((feature: Feature) => ({
            villaId: createdVilla.id,
            featureId: feature.id,
          })),
        );

        await manager.save(
          VillaPolicyPivot,
          createdPolicies.map((policy: VillaPolicy) => ({
            villaId: createdVilla.id,
            policyId: policy.id,
          })),
        );

        return createdVilla;
      },
    );

    return this.findOne(createdVilla.id);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<VillaWithRelationsDto[]>> {
    const paginatedProperties = await paginate(query, this.villaRepository, {
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      defaultLimit: 10,
      searchableColumns: [
        'name',
        'villaAdditionals.additional.name',
        'villaFacilities.facility.name',
        'villaFeatures.feature.name',
        'villaPolicies.policy.name',
      ],
      relations: {
        villaAdditionals: { additional: true },
        villaFeatures: { feature: true },
        villaFacilities: { facility: true },
        villaPolicies: { policy: true },
      },
    });

    const mappedPaginatedProperties = paginatedProperties.data.map((villa) =>
      this.mapVillaData(villa),
    );

    return paginateResponseMapper(
      paginatedProperties,
      mappedPaginatedProperties,
    );
  }

  async findOne(id: string): Promise<VillaWithRelationsDto> {
    const villa = await this.villaRepository.findOne({
      where: {
        id,
      },
      relations: {
        villaAdditionals: { additional: true },
        villaFeatures: { feature: true },
        villaFacilities: { facility: true },
        villaPolicies: { policy: true },
      },
    });

    if (!villa) {
      throw new NotFoundException(`villa not found`);
    }

    return this.mapVillaData(villa);
  }

  async update(
    id: string,
    payload: UpdateVillaDto,
  ): Promise<VillaWithRelationsDto> {
    await this.findOne(id);

    await this.datasource.transaction(async (manager) => {
      const { additionals, facilities, features, ...villaData } = payload;

      const updatedVilla = await manager.update(Villa, id, villaData);

      if (additionals) {
        await manager.delete(VillaAdditionalPivot, { villaId: id });

        const updatedAdditionals = await manager.save(Additional, additionals);

        await manager.save(
          VillaAdditionalPivot,
          updatedAdditionals.map((additional) => ({
            villaId: id,
            additionalId: additional.id,
          })),
        );
      }

      if (facilities) {
        await manager.delete(VillaFacilityPivot, { villaId: id });

        await manager.save(
          VillaFacilityPivot,
          facilities.map((facility) => ({
            villaId: id,
            facilityId: facility.facilityId,
            description: facility.description,
          })),
        );
      }

      if (features) {
        await manager.delete(VillaFeaturePivot, { villaId: id });

        const updatedFeatures = await manager.save(Feature, features);

        await manager.save(
          VillaFeaturePivot,
          updatedFeatures.map((feature) => ({
            villaId: id,
            featureId: feature.id,
          })),
        );
      }

      return updatedVilla;
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.villaRepository.delete(id);
  }
}
