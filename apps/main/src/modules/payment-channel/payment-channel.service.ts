import { paginateResponseMapper } from '@apps/main/common/helpers';
import { PaymentChannel } from '@apps/main/database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import { CreatePaymentChannelDto } from './dto/create-payment-channel.dto';
import {
  PaymentChannelDto,
  PaymentChannelPaginationDto,
} from './dto/payment-channel.dto';
import { UpdatePaymentChannelDto } from './dto/update-payment-channel.dto';

@Injectable()
export class PaymentChannelService {
  constructor(
    @InjectRepository(PaymentChannel)
    private paymentChannelRepository: Repository<PaymentChannel>,
  ) {}

  async create(payload: CreatePaymentChannelDto): Promise<PaymentChannelDto> {
    const paymentChannelEntity = this.paymentChannelRepository.create(payload);

    const createPaymentChannel =
      await this.paymentChannelRepository.save(paymentChannelEntity);

    return PaymentChannelDto.fromEntity(createPaymentChannel);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<PaymentChannelPaginationDto[]>> {
    const paginatedPaymentChannels = await paginate(
      query,
      this.paymentChannelRepository,
      {
        select: ['id', 'name', 'code', 'type', 'description', 'createdAt'],
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

    const paymentChannels = PaymentChannelPaginationDto.fromEntities(
      paginatedPaymentChannels.data,
    );

    return paginateResponseMapper(paginatedPaymentChannels, paymentChannels);
  }

  async findOne(id: string): Promise<PaymentChannelDto> {
    const paymentChannel = await this.paymentChannelRepository.findOne({
      select: {
        id: true,
        name: true,
        code: true,
        type: true,
        description: true,
      },
      where: {
        id,
      },
    });

    if (!paymentChannel) {
      throw new NotFoundException('payment channel not found');
    }

    return PaymentChannelDto.fromEntity(paymentChannel);
  }

  async update(
    id: string,
    payload: UpdatePaymentChannelDto,
  ): Promise<PaymentChannelDto> {
    await this.validateExist(id);

    await this.paymentChannelRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.validateExist(id);

    await this.paymentChannelRepository.delete(id);
  }

  async validateExist(id: string): Promise<void> {
    const exists = await this.paymentChannelRepository.exists({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('payment channel not found');
    }
  }
}
