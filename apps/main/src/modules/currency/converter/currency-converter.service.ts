import { paginateResponseMapper } from '@apps/main/common/helpers';
import { CurrencyConverter } from '@apps/main/database/entities';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import {
  ConvertedPriceRequestDto,
  ConvertedPriceResponsetDto,
  CreateCurrencyConverterDto,
  CurrencyConverterDto,
  UpdateCurrencyConverterDto,
} from './dto';
@Injectable()
export class CurrencyConverterService {
  constructor(
    @InjectRepository(CurrencyConverter)
    private currencyConverterRepository: Repository<CurrencyConverter>,
  ) {}

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

    return exchangeRate.exchangeRate;
  }

  async convertPriceToBasePrice(
    payload: ConvertedPriceRequestDto,
  ): Promise<ConvertedPriceResponsetDto> {
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

  async create(payload: CreateCurrencyConverterDto) {
    const currency = this.currencyConverterRepository.create(payload);

    return await this.currencyConverterRepository.save(currency);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<CurrencyConverterDto[]>> {
    const paginatedCurrencyConverter = await paginate(
      query,
      this.currencyConverterRepository,
      {
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

    return paginateResponseMapper(paginatedCurrencyConverter);
  }

  async isExist(
    baseCurrencyId: string,
    targetCurrencyId: string,
  ): Promise<Boolean> {
    const currency = await this.currencyConverterRepository.exists({
      where: {
        baseCurrencyId,
        targetCurrencyId,
      },
      select: ['id'],
    });

    return !!currency;
  }

  async findOne(id: string): Promise<CurrencyConverterDto> {
    const currency = await this.currencyConverterRepository.findOne({
      where: {
        id,
      },
      relations: {
        baseCurrency: true,
        targetCurrency: true,
      },
    });

    if (!currency) {
      throw new NotFoundException('currency converter not found');
    }

    return currency;
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

  _mapConvertedPrice(
    price: number,
    convertedPrice?: CurrencyConverter,
  ): ConvertedPriceResponsetDto {
    const calculatedPrice = convertedPrice
      ? price * convertedPrice.exchangeRate
      : price;

    const convertedPriceResult: ConvertedPriceResponsetDto = {
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
