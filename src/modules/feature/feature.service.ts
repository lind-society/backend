import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { DiscountType, Feature } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CurrencyService } from '../currency/currency.service';
import { PaginateResponseDataProps } from '../shared/dto';
import {
  CreateFeatureDto,
  FeatureDto,
  FeatureWithRelationsDto,
  UpdateFeatureDto,
} from './dto';

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
    private currencyService: CurrencyService,
  ) {}
  async create(payload: CreateFeatureDto): Promise<FeatureDto> {
    await this._validateRelatedEntities(payload.currencyId);

    const feature = this.featureRepository.create(payload);

    return await this.featureRepository.save(feature);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<FeatureWithRelationsDto[]>> {
    const paginatedFeatureCategory = await paginate(
      query,
      this.featureRepository,
      {
        sortableColumns: ['createdAt', 'name', 'type'],
        defaultSortBy: [['createdAt', 'DESC']],
        nullSort: 'last',
        defaultLimit: 10,
        maxLimit: 100,
        filterableColumns: {
          type: [FilterOperator.EQ],
          free: [FilterOperator.EQ],
          discountType: [FilterOperator.EQ],
          discount: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
          price: [FilterOperator.GTE, FilterOperator.LTE],
          priceAfterDiscount: [FilterOperator.GTE, FilterOperator.LTE],
          createdAt: [FilterOperator.GTE, FilterOperator.LTE],
        },
        searchableColumns: ['name'],
      },
    );

    return paginateResponseMapper(paginatedFeatureCategory);
  }

  async findOne(id: string): Promise<FeatureWithRelationsDto> {
    const feature = await this.featureRepository.findOne({
      where: {
        id,
      },
      relations: {
        currency: true,
      },
    });

    if (!feature) {
      throw new NotFoundException('feature not found');
    }

    return feature;
  }

  async update(
    id: string,
    payload: UpdateFeatureDto,
  ): Promise<FeatureWithRelationsDto> {
    await this.findOne(id);

    await this._validateRelatedEntities(payload.currencyId);

    await this.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.remove(id);
  }

  private async _validateRelatedEntities(currencyId?: string): Promise<void> {
    if (currencyId) {
      await this.currencyService.findOne(currencyId);
    }
  }

  handleDefaultDiscountType(payload: CreateFeatureDto | UpdateFeatureDto) {
    if (payload.discount && !payload.discountType) {
      payload.discountType = DiscountType.Percentage;
    }
  }
}
