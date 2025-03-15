import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { CurrencyConverter } from 'src/database/entities';
import { PaginateResponseDataProps } from 'src/modules/shared/dto';
import { Repository } from 'typeorm';
import {
  CreateCurrencyConverterDto,
  CurrencyConverterDto,
  UpdateCurrencyConverterDto,
} from './dto';
@Injectable()
export class CurrencyConverterService {
  constructor(
    @InjectRepository(CurrencyConverter)
    private currencyRepository: Repository<CurrencyConverter>,
  ) {}
  async create(payload: CreateCurrencyConverterDto) {
    const currency = this.currencyRepository.create(payload);

    return await this.currencyRepository.save(currency);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<CurrencyConverterDto[]>> {
    const paginatedCurrencyConverter = await paginate(
      query,
      this.currencyRepository,
      {
        sortableColumns: ['createdAt'],
        defaultSortBy: [['createdAt', 'DESC']],
        defaultLimit: 10,
        searchableColumns: [
          'baseCurrencyId',
          'targetCurrencyId',
          'exchangeRate',
        ],
      },
    );

    return paginateResponseMapper(paginatedCurrencyConverter);
  }

  async findOne(id: string): Promise<CurrencyConverterDto> {
    const currency = await this.currencyRepository.findOne({
      where: {
        id,
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

    await this.currencyRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.currencyRepository.delete(id);
  }
}
