import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { Currency } from 'src/database/entities';
import { Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import { CurrencyConverterService } from './converter/currency-converter.service';
import { CreateCurrencyDto, CurrencyDto, UpdateCurrencyDto } from './dto';

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
    const currency = this.currencyRepository.create(payload);

    return await this.currencyRepository.save(currency);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<CurrencyDto[]>> {
    const paginatedCurrency = await paginate(query, this.currencyRepository, {
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

    return paginateResponseMapper(paginatedCurrency);
  }

  async findOne(id: string): Promise<CurrencyDto> {
    const currency = await this.currencyRepository.findOne({
      where: {
        id,
      },
    });

    if (!currency) {
      throw new NotFoundException('currency not found');
    }

    return currency;
  }

  async update(id: string, payload: UpdateCurrencyDto): Promise<CurrencyDto> {
    await this.findOne(id);

    await this.currencyRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.currencyRepository.delete(id);
  }

  async convertToBaseCurrency(initialCurrencyId: string, price?: number) {
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
}
