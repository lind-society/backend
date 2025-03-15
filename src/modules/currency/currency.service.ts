import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { Currency } from 'src/database/entities';
import { Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import { CreateCurrencyDto, CurrencyDto, UpdateCurrencyDto } from './dto';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {}
  async create(payload: CreateCurrencyDto) {
    const currency = this.currencyRepository.create(payload);

    return await this.currencyRepository.save(currency);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<CurrencyDto[]>> {
    const paginatedCurrency = await paginate(query, this.currencyRepository, {
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      defaultLimit: 10,
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
}
