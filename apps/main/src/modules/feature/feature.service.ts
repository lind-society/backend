import { paginateResponseMapper } from '@apps/main/common/helpers';
import { DiscountType, Feature } from '@apps/main/database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { CurrencyService } from '../currency/currency.service';
import { PaginateResponseDataProps } from '../shared/dto';
import {
  CreateFeatureDto,
  FeaturePaginationDto,
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
  async create(payload: CreateFeatureDto): Promise<FeatureWithRelationsDto> {
    const convertedBasePriceFeature =
      await this._convertToBaseCurrency(payload);

    const feature = this.featureRepository.create(convertedBasePriceFeature);

    const createdFeature = await this.featureRepository.save(feature);

    return FeatureWithRelationsDto.fromEntity(createdFeature);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<FeaturePaginationDto[]>> {
    const paginatedFeatures = await paginate(query, this.featureRepository, {
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
      relations: {
        currency: true,
        propertyFeatures: { property: true },
        villaFeatures: { villa: true },
      },
    });

    const features = FeaturePaginationDto.fromEntities(paginatedFeatures.data);

    return paginateResponseMapper(paginatedFeatures, features);
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

    return FeatureWithRelationsDto.fromEntity(feature);
  }

  async update(
    id: string,
    payload: UpdateFeatureDto,
  ): Promise<FeatureWithRelationsDto> {
    const initialData = await this.findOne(id);

    const convertedBasePriceFeature = await this._convertToBaseCurrency(
      payload,
      initialData,
    );

    await this.featureRepository.update(id, convertedBasePriceFeature);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.validateExist(id);

    await this.featureRepository.delete(id);
  }

  async validateExist(id: string) {
    const exists = await this.featureRepository.exists({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('owner not found');
    }
  }

  private async _convertToBaseCurrency(
    featureData: CreateFeatureDto | UpdateFeatureDto,
    initialData?: FeatureWithRelationsDto,
  ): Promise<CreateFeatureDto | UpdateFeatureDto> {
    const currencyId = featureData.currencyId ?? initialData.currencyId;
    const discountType = featureData.discountType ?? initialData.discountType;
    const discount = featureData.discount ?? initialData.discount;
    const price = featureData.price ?? initialData.price;

    return {
      ...featureData,
      currencyId: await this.currencyService.findBaseCurrencyId(),
      price: await this.currencyService.convertToBaseCurrency(
        currencyId,
        price,
      ),
      discount:
        discount != null
          ? discountType === DiscountType.Fixed
            ? await this.currencyService.convertToBaseCurrency(
                currencyId,
                discount,
              )
            : discount
          : undefined,
    };
  }

  async convertFeaturesToBaseCurrency(
    features: (CreateFeatureDto | UpdateFeatureDto)[],
  ): Promise<(CreateFeatureDto | UpdateFeatureDto)[]> {
    return Promise.all(
      features.map((feature) => this._convertToBaseCurrency(feature)),
    );
  }

  handleDefaultDiscountType(payload: CreateFeatureDto | UpdateFeatureDto) {
    if (payload.discount && !payload.discountType) {
      payload.discountType = DiscountType.Percentage;
    }
  }
}
