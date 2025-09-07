import { paginateResponseMapper } from '@apps/main/common/helpers';
import { Package, PackageBenefitPivot } from '@apps/main/database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import { PackageBenefitService } from './benefit/package-benefit.service';
import {
  CreatePackageDto,
  PackagePaginationDto,
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
    @InjectDataSource()
    private datasource: DataSource,
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
    private packageBenefitService: PackageBenefitService,
  ) {}

  async create(payload: CreatePackageDto): Promise<PackageWithRelationsDto> {
    const { benefits, ...packageData } = payload;

    await this._validateRelatedEntities(benefits);

    const createdPackage = await this.datasource.transaction(
      async (manager: EntityManager) => {
        const packageEntity = manager.create(Package, packageData);
        const createdPackage = await manager.save(Package, packageEntity);

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

    return PackageWithRelationsDto.fromEntity(createdPackage);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<PackagePaginationDto[]>> {
    const paginatedPackages = await paginate(query, this.packageRepository, {
      select: [
        'id',
        'name',
        'createdAt',

        'packageBenefits.id',
        'packageBenefits.benefit.id',
        'packageBenefits.benefit.title',
      ],
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

    const packages = PackagePaginationDto.fromEntities(paginatedPackages.data);

    return paginateResponseMapper(paginatedPackages, packages);
  }

  async findOne(
    id: string,
    entityManager?: EntityManager,
  ): Promise<PackageWithRelationsDto> {
    const repository = this._getRepository(entityManager);

    const pkg = await repository.findOne({
      select: {
        id: true,
        name: true,
        packageBenefits: {
          id: true,
          benefit: {
            id: true,
            title: true,
          },
        },
      },
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

    return PackageWithRelationsDto.fromEntity(pkg);
  }

  async update(
    id: string,
    payload: UpdatePackageDto,
  ): Promise<PackageWithRelationsDto> {
    const { benefits, ...packageData } = payload;

    await this._validateRelatedEntities(benefits);
    await this.validateExist(id);

    await this.datasource.transaction(async (manager) => {
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
    await this.validateExist(id);

    await this.packageRepository.delete(id);
  }

  // Private Methods
  private _getRepository(entityManager?: EntityManager): Repository<Package> {
    return entityManager
      ? entityManager.getRepository(Package)
      : this.packageRepository;
  }

  async validateExist(id: string): Promise<void> {
    const exists = await this.packageRepository.exists({ where: { id } });

    if (!exists) {
      throw new NotFoundException('package not found');
    }
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
}
