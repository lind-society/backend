import { paginateResponseMapper } from '@apps/main/common/helpers';
import { BookingCustomer } from '@apps/main/database/entities';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { EntityManager, Repository } from 'typeorm';
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

  async create(
    payload: CreateBookingCustomerDto,
    manager?: EntityManager,
  ): Promise<BookingCustomerDto> {
    if (manager) {
      return await manager.save(BookingCustomer, payload);
    }

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
        sortableColumns: ['createdAt', 'name'],
        defaultSortBy: [['createdAt', 'DESC']],
        nullSort: 'last',
        defaultLimit: 10,
        maxLimit: 100,
        filterableColumns: {
          createdAt: [FilterOperator.GTE, FilterOperator.LTE],
        },
        searchableColumns: ['name', 'email', 'phoneNumber'],
        relations: {
          bookings: true,
        },
      },
    );

    return paginateResponseMapper(paginatedBookingCustomer);
  }

  async findOne(
    id: string,
    manager?: EntityManager,
  ): Promise<BookingCustomerWithRelationsDto> {
    const query = {
      where: {
        id,
      },
      relations: {
        bookings: true,
      },
    };

    const bookingCustomer = manager
      ? await manager.findOne(BookingCustomer, query)
      : await this.bookingCustomer.findOne(query);

    if (!bookingCustomer) {
      throw new NotFoundException(`booking customer not found`);
    }

    return bookingCustomer;
  }

  async update(
    id: string,
    payload: UpdateBookingCustomerDto,
    manager?: EntityManager,
  ): Promise<BookingCustomerWithRelationsDto> {
    await this.findOne(id);

    if (manager) {
      await manager.update(BookingCustomer, id, payload);
    } else {
      await this.bookingCustomer.update(id, payload);
    }

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.bookingCustomer.delete(id);
  }
}
