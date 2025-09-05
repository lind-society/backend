import { paginateResponseMapper } from '@apps/main/common/helpers';
import { PaymentChannel } from '@apps/main/database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { DataSource, In, Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import { CreatePaymentChannelDto } from './dto/create-payment-channel.dto';
import { DeletePaymentChannelDto } from './dto/delete-payment-channel.dto';
import { PaymentChannelDto } from './dto/payment-channel.dto';
import {
  UpdatePaymentChannelBulkDto,
  UpdatePaymentChannelDto,
} from './dto/update-payment-channel.dto';

@Injectable()
export class PaymentChannelService {
  constructor(
    @InjectDataSource()
    private datasource: DataSource,
    @InjectRepository(PaymentChannel)
    private paymentChannelRepository: Repository<PaymentChannel>,
  ) {}

  async create(payload: CreatePaymentChannelDto): Promise<PaymentChannelDto[]> {
    const paymentChannels = this.paymentChannelRepository.create(
      payload.codes.map((code) => ({ code })),
    );

    return await this.paymentChannelRepository.save(paymentChannels);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<PaymentChannelDto[]>> {
    const paginatedPaymentChannel = await paginate(
      query,
      this.paymentChannelRepository,
      {
        sortableColumns: ['createdAt', 'name', 'code'],
        defaultSortBy: [['code', 'ASC']],
        nullSort: 'last',
        defaultLimit: 10,
        maxLimit: 100,
        filterableColumns: {
          createdAt: [FilterOperator.GTE, FilterOperator.LTE],
        },
        searchableColumns: ['name', 'code'],
      },
    );

    return paginateResponseMapper(paginatedPaymentChannel);
  }

  async findOne(id: string): Promise<PaymentChannelDto> {
    const paymentChannel = await this.paymentChannelRepository.findOne({
      where: {
        id,
      },
    });

    if (!paymentChannel) {
      throw new NotFoundException('payment channel not found');
    }

    return paymentChannel;
  }

  async update(
    id: string,
    payload: UpdatePaymentChannelDto,
  ): Promise<PaymentChannelDto> {
    await this.findOne(id);

    await this.paymentChannelRepository.update(id, payload);

    return await this.findOne(id);
  }

  async updateBulk(
    payload: UpdatePaymentChannelBulkDto[],
  ): Promise<PaymentChannelDto[]> {
    const existingEntities = await this.findMultiple(
      payload.map((item) => item.id),
    );

    const entityMap = new Map(existingEntities.map((e) => [e.id, e]));
    const updatedEntities = payload.map((item) => {
      const entity = entityMap.get(item.id);
      return Object.assign(entity, item);
    });

    const savedEntities = await this.datasource.transaction(async (manager) => {
      return manager.save(PaymentChannel, updatedEntities);
    });

    return savedEntities.map((entity) =>
      plainToInstance(PaymentChannelDto, entity),
    );
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.paymentChannelRepository.delete(id);
  }

  async removeBulk(payload: DeletePaymentChannelDto): Promise<void> {
    const entities = await this.findMultiple(payload.ids);

    await this.datasource.transaction(async (manager) => {
      await manager.remove(PaymentChannel, entities);
    });
  }

  async validateExist(id: string): Promise<void> {
    const exists = await this.paymentChannelRepository.exists({
      where: { id: In(['a', 'b']) },
    });

    if (!exists) {
      throw new NotFoundException('payment channel not found');
    }
  }

  async findMultiple(ids: string[]): Promise<PaymentChannel[]> {
    const entities = await this.paymentChannelRepository.findBy({
      id: In(ids),
    });

    if (entities.length !== ids.length) {
      const foundIds = new Set(entities.map((e) => e.id));
      const missingIds = ids.filter((id) => !foundIds.has(id));
      throw new NotFoundException(
        `payment channels not found: ${missingIds.join(', ')}`,
      );
    }

    return entities;
  }
}
