import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { omit } from 'lodash';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { PackageBenefitPivot } from 'src/database/entities/package-benefit-pivot.entity';
import { Package } from 'src/database/entities/package.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import { PackageBenefitService } from './benefit/package-benefit.service';
import {
  CreatePackageDto,
  PackageDto,
  PackageWithRelationsDto,
  UpdatePackageBenefitPivotDto,
  UpdatePackageDto,
} from './dto';
import { CreatePackageBenefitPivotDto } from './dto/create-package-benefit-pivot.dto';

/**
 * To avoid 'package' is a reserved word in strict mode
 * variable with name 'package' will be named 'pkg'
 */

@Injectable()
export class PackageService {
  constructor(
    private datasource: DataSource,
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
    private packageBenefitService: PackageBenefitService,
  ) {}

  async create(payload: CreatePackageDto): Promise<PackageDto> {
    const { benefits, ...packageData } = payload;

    await this._validateRelatedEntities(benefits);

    const createdPackage = await this.datasource.transaction(
      async (manager: EntityManager) => {
        const createdPackage = await manager.save(Package, packageData);

        if (Array.isArray(benefits) && benefits.length > 0) {
          await manager.save(
            PackageBenefitPivot,
            benefits.map((benefit: CreatePackageBenefitPivotDto) => ({
              packageId: createdPackage.id,
              benefitId: benefit.id,
            })),
          );
        }
        return createdPackage;
      },
    );

    return this.findOne(createdPackage.id);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<PackageWithRelationsDto[]>> {
    const paginatedPackage = await paginate(query, this.packageRepository, {
      sortableColumns: ['createdAt', 'name'],
      defaultSortBy: [['createdAt', 'DESC']],
      nullSort: 'last',
      defaultLimit: 10,
      maxLimit: 100,
      filterableColumns: {
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],
      },
      searchableColumns: ['name'],
      relations: {
        packageBenefits: { benefit: true },
      },
    });

    const mappedPaginatedPackage = paginatedPackage.data.map((pkg) =>
      this._mapPackageData(pkg),
    );

    return paginateResponseMapper(paginatedPackage, mappedPaginatedPackage);
  }

  async findOne(
    id: string,
    entityManager?: EntityManager,
  ): Promise<PackageWithRelationsDto> {
    const repository = entityManager
      ? entityManager.getRepository(Package)
      : this.packageRepository;

    const pkg = await repository.findOne({
      where: {
        id,
      },
      relations: {
        packageBenefits: { benefit: true },
      },
    });

    if (!pkg) {
      throw new NotFoundException('package not found');
    }

    return this._mapPackageData(pkg);
  }

  async update(
    id: string,
    payload: UpdatePackageDto,
  ): Promise<PackageWithRelationsDto> {
    const { benefits, ...packageData } = payload;

    await this._validateRelatedEntities(benefits);

    await this.datasource.transaction(async (manager) => {
      await this.findOne(id, manager);

      const updatedPackage = await manager.update(Package, id, packageData);

      if (Array.isArray(benefits)) {
        await manager.delete(PackageBenefitPivot, { packageId: id });
        
        if (benefits.length > 0) {
          await manager.save(
            PackageBenefitPivot,
            benefits.map((benefit: UpdatePackageBenefitPivotDto) => ({
              packageId: id,
              benefitId: benefit.id,
            })),
          );
        }
      }

      return updatedPackage;
    });

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.packageRepository.delete(id);
  }

  private async _validateRelatedEntities(
    benefits?: CreatePackageBenefitPivotDto[],
  ): Promise<void> {
    if (Array.isArray(benefits) && benefits.length > 0) {
      const ids = benefits.map(
        (benefit: CreatePackageBenefitPivotDto) => benefit.id,
      );

      await this.packageBenefitService.validatePackageBenefits(ids);
    }
  }

  private _mapPackageData(packagee: Package) {
    return plainToInstance(PackageWithRelationsDto, {
      ...omit(packagee, ['packageBenefits']),

      benefits: packagee.packageBenefits.map(({ id, benefit }) => ({
        pivotId: id,
        ...benefit,
      })),
    });
  }
}
