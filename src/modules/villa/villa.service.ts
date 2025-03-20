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
import { CurrencyService } from '../currency/currency.service';
import { FacilityService } from '../facility/facility.service';
import { OwnerService } from '../owner/owner.service';
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
    private currencyService: CurrencyService,
    private facilityService: FacilityService,
    private ownerService: OwnerService,
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

      policies: groupAndSort(
        villa.villaPolicies.map(({ id, policy }) => ({
          pivotId: id,
          ...policy,
        })),
        'type',
        'name',
      ),
    });
  }

  async create(payload: CreateVillaDto): Promise<VillaWithRelationsDto> {
    const { additionals, facilities, features, policies, ...villaData } =
      payload;

    await this._validateRelatedEntities(
      payload.currencyId,
      payload.ownerId,
      facilities,
    );

    const createdVilla = await this.datasource.transaction(
      async (manager: EntityManager) => {
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

        if (Array.isArray(additionals) && additionals.length > 0) {
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
            facilities.map((facility: CreateVillaFacililtyDto) => ({
              villaId: createdVilla.id,
              facilityId: facility.facilityId,
              description: facility.description,
            })),
          );
        }

        if (Array.isArray(features) && features.length > 0) {
          await manager.save(
            VillaFeaturePivot,
            createdFeatures.map((feature: Feature) => ({
              villaId: createdVilla.id,
              featureId: feature.id,
            })),
          );
        }

        if (Array.isArray(policies) && policies.length > 0) {
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
        currency: true,
        owner: true,
        reviews: true,
        villaAdditionals: { additional: true },
        villaFeatures: { feature: { currency: true } },
        villaFacilities: { facility: true },
        villaPolicies: { policy: true },
      },
    });

    const mappedPaginatedVilla = paginatedVilla.data.map((villa) =>
      this.mapVillaData(villa),
    );

    return paginateResponseMapper(paginatedVilla, mappedPaginatedVilla);
  }

  async findOne(id: string): Promise<VillaWithRelationsDto> {
    const villa = await this.villaRepository.findOne({
      where: {
        id,
      },
      relations: {
        currency: true,
        owner: true,
        reviews: true,
        villaAdditionals: { additional: true },
        villaFeatures: { feature: { currency: true } },
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

    const { additionals, facilities, features, policies, ...villaData } =
      payload;

    await this._validateRelatedEntities(
      payload.currencyId,
      payload.ownerId,
      facilities,
    );

    await this.datasource.transaction(async (manager) => {
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
            facilities.map((facility) => ({
              villaId: id,
              facilityId: facility.facilityId,
              description: facility.description,
            })),
          );
        }
      }

      if (Array.isArray(features)) {
        await manager.delete(VillaFeaturePivot, { villaId: id });

        if (features.length > 0) {
          const updatedFeatures = await manager.save(Feature, features);

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

  private async _validateRelatedEntities(
    currencyId?: string,
    ownerId?: string,
    facilities?: CreateVillaFacililtyDto[],
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
}
