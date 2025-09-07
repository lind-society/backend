import { paginateResponseMapper } from '@apps/main/common/helpers';
import { Currency } from '@apps/main/database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import { CurrencyConverterService } from './converter/currency-converter.service';
import {
  CreateCurrencyDto,
  CurrencyDto,
  CurrencyPaginationDto,
  UpdateCurrencyDto,
} from './dto';

@Injectable()
export class CurrencyService {
  private _currencyBaseCode: string;
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
    private configService: ConfigService,
    private currencyConverterService: CurrencyConverterService,
  ) {
    this._currencyBaseCode =
      this.configService.get<string>('currency.base.code');
  }
  async create(payload: CreateCurrencyDto) {
    const currencyEntity = this.currencyRepository.create(payload);

    const createdCurrency = await this.currencyRepository.save(currencyEntity);

    return createdCurrency;
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<CurrencyPaginationDto[]>> {
    const paginatedCurrencies = await paginate(query, this.currencyRepository, {
      select: [
        'id',
        'code',
        'name',
        'symbol',
        'allowDecimal',
        'allowRound',
        'createdAt',
      ],
      sortableColumns: ['createdAt', 'code', 'name', 'symbol'],
      defaultSortBy: [['createdAt', 'DESC']],
      nullSort: 'last',
      defaultLimit: 10,
      maxLimit: 100,
      filterableColumns: {
        allowDecimal: [FilterOperator.EQ],
        allowRound: [FilterOperator.EQ],
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],
      },
      searchableColumns: ['code', 'name', 'symbol'],
    });

    const currencies = CurrencyPaginationDto.fromEntities(
      paginatedCurrencies.data,
    );

    return paginateResponseMapper(paginatedCurrencies, currencies);
  }

  async findOne(
    id: string,
    usedInPriceConverterInterceptor?: boolean,
  ): Promise<CurrencyDto> {
    const currency = await this.currencyRepository.findOne({
      select: {
        id: true,
        code: true,
        name: true,
        symbol: true,
        allowDecimal: true,
        allowRound: true,
      },
      where: {
        id,
      },
    });

    if (!currency && !usedInPriceConverterInterceptor) {
      throw new NotFoundException('currency not found');
    }

    return CurrencyDto.fromEntity(currency);
  }

  async update(id: string, payload: UpdateCurrencyDto): Promise<CurrencyDto> {
    await this.validateExist(id);

    await this.currencyRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.validateExist(id);

    await this.currencyRepository.delete(id);
  }

  async convertToBaseCurrency(initialCurrencyId: string, price?: number) {
    await this.findOne(initialCurrencyId);

    const baseCurrencyId = await this.findBaseCurrencyId();

    const basePrice = price
      ? await this.currencyConverterService.convertPriceToBasePrice({
          baseCurrencyId: initialCurrencyId,
          basePrice: price,
          targetCurrencyId: baseCurrencyId,
        })
      : undefined;

    return basePrice?.converted.price;
  }

  async findBaseCurrencyId(): Promise<string> {
    const baseCurrencyId = await this.currencyRepository.findOne({
      where: {
        code: this._currencyBaseCode,
      },
      select: {
        id: true,
      },
    });

    if (!baseCurrencyId) {
      throw new NotFoundException(
        `${this._currencyBaseCode} currency not found, please configure the currency first`,
      );
    }

    return baseCurrencyId.id;
  }

  async validateExist(id: string) {
    const exists = await this.currencyRepository.exists({ where: { id } });

    if (!exists) {
      throw new NotFoundException('currency not found');
    }
  }
}
