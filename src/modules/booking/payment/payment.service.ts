import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { BookingPayment } from 'src/database/entities';
import { PaginateResponseDataProps } from 'src/modules/shared/dto';
import { Repository } from 'typeorm';
import {
  BookingPaymentWithRelationsDto,
  CreateBookingPaymentDto,
  UpdateBookingPaymentDto,
} from './dto';

@Injectable()
export class BookingPaymentService {
  constructor(
    @InjectRepository(BookingPayment)
    private bookingPaymentRepository: Repository<BookingPayment>,
  ) {}

  async create(
    payload: CreateBookingPaymentDto,
  ): Promise<BookingPaymentWithRelationsDto> {
    const createdBookingPayment = this.bookingPaymentRepository.create(payload);

    return await this.bookingPaymentRepository.save(createdBookingPayment);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<BookingPaymentWithRelationsDto[]>> {
    const paginatedBookingPayment = await paginate(
      query,
      this.bookingPaymentRepository,
      {
        sortableColumns: ['createdAt'],
        defaultSortBy: [['createdAt', 'DESC']],
        defaultLimit: 10,
        searchableColumns: ['status', 'paymentMethod'],
        relations: {
          booking: { customer: true },
          currency: true,
        },
      },
    );

    return paginateResponseMapper(paginatedBookingPayment);
  }

  async findOne(id: string): Promise<BookingPaymentWithRelationsDto> {
    const bookingPayment = await this.bookingPaymentRepository.findOne({
      where: {
        id,
      },
      relations: {
        booking: { customer: true },
        currency: true,
      },
    });

    if (!bookingPayment) {
      throw new NotFoundException(`booking payment not found`);
    }

    return bookingPayment;
  }

  async update(
    id: string,
    payload: UpdateBookingPaymentDto,
  ): Promise<BookingPaymentWithRelationsDto> {
    await this.findOne(id);

    await this.bookingPaymentRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.bookingPaymentRepository.delete(id);
  }
}
