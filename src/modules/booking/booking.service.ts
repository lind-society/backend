import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { Booking } from 'src/database/entities';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import { BookingCustomerService } from './customer/booking-customer.service';
import {
  BookingWithRelationsDto,
  CreateBookingDto,
  UpdateBookingDto,
} from './dto';

@Injectable()
export class BookingService {
  constructor(
    private datasource: DataSource,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private bookingCustomerService: BookingCustomerService,
  ) {}

  async create(payload: CreateBookingDto): Promise<BookingWithRelationsDto> {
    return await this.datasource.transaction(async (manager: EntityManager) => {
      const createdBookingCustomer = await this.bookingCustomerService.create(
        payload.customer,
        manager,
      );

      const createdBooking = await manager.save(Booking, {
        ...payload,
        customerId: createdBookingCustomer.id,
      });

      return createdBooking;
    });
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<BookingWithRelationsDto[]>> {
    const paginatedBooking = await paginate(query, this.bookingRepository, {
      sortableColumns: [
        'createdAt',
        'totalAmount',
        'totalGuest',
        'checkInDate',
        'checkOutDate',
        'status',
      ],
      defaultSortBy: [['createdAt', 'DESC']],
      nullSort: 'last',
      defaultLimit: 10,
      maxLimit: 100,
      filterableColumns: {
        totalAmount: [
          FilterOperator.EQ,
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        totalGuest: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE],
        checkInDate: [
          FilterOperator.EQ,
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        checkOutDate: [
          FilterOperator.EQ,
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        status: [FilterOperator.EQ],
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],
      },
      searchableColumns: ['customer.name', 'activity.name', 'villa.name'],
      relations: {
        customer: true,
        currency: true,
        activity: {
          owner: true,
          currency: true,
        },
        villa: {
          owner: true,
          currency: true,
        },
        review: true,
        payments: { currency: true },
      },
    });

    return paginateResponseMapper(paginatedBooking);
  }

  async findOne(id: string): Promise<BookingWithRelationsDto> {
    const bookingPayment = await this.bookingRepository.findOne({
      where: {
        id,
      },
      relations: {
        customer: true,
        currency: true,
        activity: {
          owner: true,
          currency: true,
        },
        villa: {
          owner: true,
          currency: true,
        },
        review: true,
        payments: { currency: true },
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
    const initialBooking = await this.findOne(id);

    const { customer: customerData, ...bookingData } = payload;

    await this.datasource.transaction(async (manager: EntityManager) => {
      if (payload.customer) {
        await this.bookingCustomerService.update(
          initialBooking.customerId,
          customerData,
          manager,
        );
      }

      await manager.update(Booking, id, bookingData);
    });

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.bookingRepository.delete(id);
  }
}
