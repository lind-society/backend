import { paginateResponseMapper } from '@apps/main/common/helpers';
import { PackageBenefit } from '@apps/main/database/entities';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { In, Repository } from 'typeorm';
import {
  CreatePackageBenefitDto,
  PackageBenefitDto,
  PackageBenefitWithRelationsDto,
  UpdatePackageBenefitDto,
} from './dto';

@Injectable()
export class PackageBenefitService {
  constructor(
    @InjectRepository(PackageBenefit)
    private packageBenefitRepository: Repository<PackageBenefit>,
  ) {}
  async create(payload: CreatePackageBenefitDto): Promise<PackageBenefitDto> {
    const packageBenefit = this.packageBenefitRepository.create(payload);

    return await this.packageBenefitRepository.save(packageBenefit);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<PackageBenefitWithRelationsDto[]>> {
    const paginatedPackageBenefitCategory = await paginate(
      query,
      this.packageBenefitRepository,
      {
        sortableColumns: ['createdAt', 'title'],
        defaultSortBy: [['createdAt', 'DESC']],
        nullSort: 'last',
        defaultLimit: 10,
        maxLimit: 100,
        filterableColumns: {
          createdAt: [FilterOperator.GTE, FilterOperator.LTE],
        },
        searchableColumns: ['title'],
      },
    );

    return paginateResponseMapper(paginatedPackageBenefitCategory);
  }

  async findOne(id: string): Promise<PackageBenefitWithRelationsDto> {
    const packageBenefit = await this.packageBenefitRepository.findOne({
      where: {
        id,
      },
    });

    if (!packageBenefit) {
      throw new NotFoundException('package benefit not found');
    }

    return packageBenefit;
  }

  async update(
    id: string,
    payload: UpdatePackageBenefitDto,
  ): Promise<PackageBenefitWithRelationsDto> {
    await this.findOne(id);

    await this.packageBenefitRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.packageBenefitRepository.delete(id);
  }

  async validatePackageBenefits(packageBenefitIds: string[]): Promise<void> {
    const validPackageBenefits = await this.packageBenefitRepository.find({
      where: { id: In(packageBenefitIds) },
    });

    if (validPackageBenefits.length !== packageBenefitIds.length) {
      const validPackageBenefitIds = validPackageBenefits.map(
        (PackageBenefit) => PackageBenefit.id,
      );
      const invalidPackageBenefitIds = packageBenefitIds.filter(
        (id) => !validPackageBenefitIds.includes(id),
      );

      if (invalidPackageBenefitIds.length > 0) {
        throw new BadRequestException(
          `invalid package benefit ids: ${invalidPackageBenefitIds.join(', ')}`,
        );
      }
    }
  }
}
