import { paginateResponseMapper } from '@apps/main/common/helpers';
import { BookingCustomer } from '@apps/main/database/entities';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { EntityManager, Repository } from 'typeorm';
import { BookingHelperService } from '../helper/booking-helper.service';
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
    private bookingCustomerRepository: Repository<BookingCustomer>,
    private bookingHelperService: BookingHelperService,
  ) {}

  async create(
    payload: CreateBookingCustomerDto,
    entityManager?: EntityManager,
  ): Promise<BookingCustomerDto> {
    if (entityManager) {
      return await entityManager.save(BookingCustomer, payload);
    }

    const createdBookingCustomer =
      this.bookingCustomerRepository.create(payload);

    return await this.bookingCustomerRepository.save(createdBookingCustomer);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<BookingCustomerWithRelationsDto[]>> {
    const paginatedBookingCustomer = await paginate(
      query,
      this.bookingCustomerRepository,
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
    entityManager?: EntityManager,
  ): Promise<BookingCustomerWithRelationsDto> {
    const query = {
      where: {
        id,
      },
      relations: {
        bookings: true,
      },
    };

    const bookingCustomerRepository = entityManager
      ? await entityManager.findOne(BookingCustomer, query)
      : await this.bookingCustomerRepository.findOne(query);

    if (!bookingCustomerRepository) {
      throw new NotFoundException(`booking customer not found`);
    }

    return bookingCustomerRepository;
  }

  async findOneByBookingId(
    bookingId: string,
    entityManager?: EntityManager,
  ): Promise<BookingCustomerWithRelationsDto> {
    await this.bookingHelperService.validateBookingExist(
      bookingId,
      entityManager,
    );

    const query = {
      where: {
        bookings: {
          id: bookingId,
        },
      },
      relations: {
        bookings: true,
      },
    };

    const bookingCustomerRepositoryRepository = entityManager
      ? await entityManager.findOne(BookingCustomer, query)
      : await this.bookingCustomerRepository.findOne(query);

    if (!bookingCustomerRepositoryRepository) {
      throw new NotFoundException(`booking customer not found`);
    }

    return bookingCustomerRepositoryRepository;
  }

  async update(
    id: string,
    payload: UpdateBookingCustomerDto,
    entityManager?: EntityManager,
  ): Promise<BookingCustomerWithRelationsDto> {
    await this.findOne(id);

    if (entityManager) {
      await entityManager.update(BookingCustomer, id, payload);
    } else {
      await this.bookingCustomerRepository.update(id, payload);
    }

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.bookingCustomerRepository.delete(id);
  }
}
