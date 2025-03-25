import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { Booking } from 'src/database/entities';
import { Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import {
  BookingWithRelationsDto,
  CreateBookingDto,
  UpdateBookingDto,
} from './dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingPaymentRepository: Repository<Booking>,
  ) {}

  async create(payload: CreateBookingDto): Promise<BookingWithRelationsDto> {
    const createdBooking = this.bookingPaymentRepository.create(payload);

    return await this.bookingPaymentRepository.save(createdBooking);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<BookingWithRelationsDto[]>> {
    const paginatedBooking = await paginate(
      query,
      this.bookingPaymentRepository,
      {
        sortableColumns: ['createdAt'],
        defaultSortBy: [['createdAt', 'DESC']],
        defaultLimit: 10,
        searchableColumns: ['status'],
        relations: {
          customer: true,
          currency: true,
          payments: true,
        },
      },
    );

    return paginateResponseMapper(paginatedBooking);
  }

  async findOne(id: string): Promise<BookingWithRelationsDto> {
    const bookingPayment = await this.bookingPaymentRepository.findOne({
      where: {
        id,
      },
      relations: {
        customer: true,
        currency: true,
        payments: true,
      },
    });

    if (!bookingPayment) {
      throw new NotFoundException(`booking not found`);
    }

    return bookingPayment;
  }

  async update(
    id: string,
    payload: UpdateBookingDto,
  ): Promise<BookingWithRelationsDto> {
    await this.findOne(id);

    await this.bookingPaymentRepository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.bookingPaymentRepository.delete(id);
  }
}
