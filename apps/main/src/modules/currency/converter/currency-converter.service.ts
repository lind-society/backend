import { paginateResponseMapper } from '@apps/main/common/helpers';
import { CurrencyConverter } from '@apps/main/database/entities';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import {
  ConvertedPriceRequestDto,
  ConvertedPriceResponseDto,
  CreateCurrencyConverterDto,
  CurrencyConverterDto,
  CurrencyConverterWithRelationsDto,
  UpdateCurrencyConverterDto,
} from './dto';
@Injectable()
export class CurrencyConverterService {
  constructor(
    @InjectRepository(CurrencyConverter)
    private currencyConverterRepository: Repository<CurrencyConverter>,
  ) {}

  async create(
    payload: CreateCurrencyConverterDto,
  ): Promise<CurrencyConverterWithRelationsDto> {
    const currencyConverterEntity =
      this.currencyConverterRepository.create(payload);

    const createdCurrencyConverter =
      await this.currencyConverterRepository.save(currencyConverterEntity);

    return CurrencyConverterWithRelationsDto.fromEntity(
      createdCurrencyConverter,
    );
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<CurrencyConverterDto[]>> {
    const paginatedCurrencyConverters = await paginate(
      query,
      this.currencyConverterRepository,
      {
        select: [
          'id',
          'exchangeRate',
          'description',
          'createdAt',

          'baseCurrency.id',
          'baseCurrency.code',
          'baseCurrency.name',
          'baseCurrency.symbol',
          'baseCurrency.allowDecimal',
          'baseCurrency.allowRound',

          'targetCurrency.id',
          'targetCurrency.code',
          'targetCurrency.name',
          'targetCurrency.symbol',
          'targetCurrency.allowDecimal',
          'targetCurrency.allowRound',
        ],
        sortableColumns: ['createdAt', 'exchangeRate'],
        defaultSortBy: [['createdAt', 'DESC']],
        nullSort: 'last',
        defaultLimit: 10,
        maxLimit: 100,
        filterableColumns: {
          baseCurrencyId: [FilterOperator.EQ],
          targetCurrencyId: [FilterOperator.EQ],
          exchangeRate: [
            FilterOperator.EQ,
            FilterOperator.GTE,
            FilterOperator.LTE,
          ],
          createdAt: [FilterOperator.GTE, FilterOperator.LTE],
        },
        searchableColumns: ['description'],
        relations: {
          baseCurrency: true,
          targetCurrency: true,
        },
      },
    );

    const currencyConverters = CurrencyConverterWithRelationsDto.fromEntities(
      paginatedCurrencyConverters.data,
    );

    return paginateResponseMapper(
      paginatedCurrencyConverters,
      currencyConverters,
    );
  }

  async findOne(id: string): Promise<CurrencyConverterDto> {
    const currencyConverter = await this.currencyConverterRepository.findOne({
      select: {
        id: true,
        exchangeRate: true,
        description: true,
        baseCurrency: {
          id: true,
          code: true,
          name: true,
          symbol: true,
          allowDecimal: true,
          allowRound: true,
        },
        targetCurrency: {
          id: true,
          code: true,
          name: true,
          symbol: true,
          allowDecimal: true,
          allowRound: true,
        },
      },
      where: {
        id,
      },
      relations: {
        baseCurrency: true,
        targetCurrency: true,
      },
    });

    if (!currencyConverter) {
      throw new NotFoundException('currency converter not found');
    }

    return CurrencyConverterDto.fromEntity(currencyConverter);
  }

  async update(
    id: string,
    payload: UpdateCurrencyConverterDto,
  ): Promise<CurrencyConverterDto> {
    await this.findOne(id);

    await this.currencyConverterRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.currencyConverterRepository.delete(id);
  }

  async validateExist(
    baseCurrencyId: string,
    targetCurrencyId: string,
  ): Promise<Boolean> {
    const currencyExist = await this.currencyConverterRepository.exists({
      select: { id: true },
      where: {
        baseCurrencyId,
        targetCurrencyId,
      },
    });

    return currencyExist;
  }

  async getExchangeRate(
    baseCurrencyId: string,
    targetCurrencyId: string,
  ): Promise<number> {
    const exchangeRate = await this.currencyConverterRepository.findOne({
      where: {
        baseCurrencyId: baseCurrencyId,
        targetCurrencyId: targetCurrencyId,
      },
      select: {
        exchangeRate: true,
      },
    });

    return exchangeRate?.exchangeRate;
  }

  async convertPriceToBasePrice(
    payload: ConvertedPriceRequestDto,
  ): Promise<ConvertedPriceResponseDto> {
    const exchangeRate = await this.currencyConverterRepository.findOne({
      where: {
        baseCurrencyId: payload.baseCurrencyId,
        targetCurrencyId: payload.targetCurrencyId,
      },
      select: {
        id: true,
        exchangeRate: true,
        baseCurrency: {
          id: true,
          code: true,
          name: true,
          symbol: true,
        },
        targetCurrency: {
          id: true,
          code: true,
          name: true,
          symbol: true,
        },
      },
      relations: {
        baseCurrency: true,
        targetCurrency: true,
      },
    });

    return exchangeRate
      ? this._mapConvertedPrice(payload.basePrice, exchangeRate)
      : this._mapConvertedPrice(payload.basePrice);
  }

  private _mapConvertedPrice(
    price: number,
    convertedPrice?: CurrencyConverter,
  ): ConvertedPriceResponseDto {
    const calculatedPrice = convertedPrice
      ? price * convertedPrice.exchangeRate
      : price;

    const convertedPriceResult: ConvertedPriceResponseDto = {
      exchangeRate: convertedPrice?.exchangeRate ?? null,
      initial: {
        price,
        currencyId: convertedPrice?.baseCurrency.id ?? '',
        currencyCode: convertedPrice?.baseCurrency.code ?? '',
        currencyName: convertedPrice?.baseCurrency.name ?? '',
        currencySymbol: convertedPrice?.baseCurrency.symbol ?? '',
      },
      converted: {
        price: calculatedPrice,
        currencyId: convertedPrice?.targetCurrency.id ?? '',
        currencyCode: convertedPrice?.targetCurrency.code ?? '',
        currencyName: convertedPrice?.targetCurrency.name ?? '',
        currencySymbol: convertedPrice?.targetCurrency.symbol ?? '',
      },
    };

    return convertedPriceResult;
  }
}
