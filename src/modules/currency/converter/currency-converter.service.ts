import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { CurrencyConverter } from 'src/database/entities';
import { PaginateResponseDataProps } from 'src/modules/shared/dto';
import { Repository } from 'typeorm';
import {
  ConvertPriceToBasePriceRequestDto,
  ConvertPriceToBasePriceResponsetDto,
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

  async convertPriceToBasePrice(
    payload: ConvertPriceToBasePriceRequestDto,
  ): Promise<ConvertPriceToBasePriceResponsetDto> {
    const exchangeRate = await this.currencyConverterRepository.findOne({
      where: {
        baseCurrencyId: payload.priceCurrencyId,
        targetCurrencyId: payload.baseCurrencyId,
      },
      select: {
        id: true,
        exchangeRate: true,
        targetCurrency: {
          code: true,
          name: true,
          symbol: true,
        },
      },
      relations: {
        targetCurrency: true,
      },
    });

    return exchangeRate
      ? this._mapConvertedPrice(payload.price, exchangeRate)
      : this._mapConvertedPrice(payload.price);
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
        sortableColumns: ['createdAt'],
        defaultSortBy: [['createdAt', 'DESC']],
        defaultLimit: 10,
        searchableColumns: [
          'baseCurrencyId',
          'targetCurrencyId',
          'exchangeRate',
        ],
        relations: {
          baseCurrency: true,
          targetCurrency: true,
        },
      },
    );

    return paginateResponseMapper(paginatedCurrencyConverter);
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
  ): ConvertPriceToBasePriceResponsetDto {
    const calculatedPrice = convertedPrice
      ? price * convertedPrice.exchangeRate
      : price;

    const convertedPriceResult: ConvertPriceToBasePriceResponsetDto = {
      basePrice: calculatedPrice,
      basePriceCode: convertedPrice?.targetCurrency.code ?? '',
      basePriceName: convertedPrice?.targetCurrency.name ?? '',
      basePriceSymbol: convertedPrice?.targetCurrency.symbol ?? '',
    };

    return convertedPriceResult;
  }
}
