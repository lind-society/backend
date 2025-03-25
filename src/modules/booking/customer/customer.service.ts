import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { BookingCustomer } from 'src/database/entities';
import { PaginateResponseDataProps } from 'src/modules/shared/dto';
import { Repository } from 'typeorm';
import {
  BookingCustomerDto,
  BookingCustomerWithRelationsDto,
  CreateBookingCustomerDto,
  UpdateBookingCustomerDto,
} from './dto';

@Injectable()
export class BookingCustomerService {
  constructor(
    @InjectRepository(BookingCustomer)
    private bookingCustomer: Repository<BookingCustomer>,
  ) {}

  async create(payload: CreateBookingCustomerDto): Promise<BookingCustomerDto> {
    const createdBookingCustomer = this.bookingCustomer.create(payload);

    return await this.bookingCustomer.save(createdBookingCustomer);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<BookingCustomerWithRelationsDto[]>> {
    const paginatedBookingCustomer = await paginate(
      query,
      this.bookingCustomer,
      {
        sortableColumns: ['createdAt'],
        defaultSortBy: [['createdAt', 'DESC']],
        defaultLimit: 10,
        searchableColumns: ['name'],
        relations: {
          bookings: true,
        },
      },
    );

    return paginateResponseMapper(paginatedBookingCustomer);
  }

  async findOne(id: string): Promise<BookingCustomerWithRelationsDto> {
    const bookingCustomer = await this.bookingCustomer.findOne({
      where: {
        id,
      },
      relations: {
        bookings: true,
      },
    });

    if (!bookingCustomer) {
      throw new NotFoundException(`booking customer not found`);
    }

    return bookingCustomer;
  }

  async update(
    id: string,
    payload: UpdateBookingCustomerDto,
  ): Promise<BookingCustomerWithRelationsDto> {
    await this.findOne(id);

    await this.bookingCustomer.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.bookingCustomer.delete(id);
  }
}
