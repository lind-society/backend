import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { paginateResponseMapper } from 'src/common/helpers';
import { Booking } from 'src/database/entities';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../shared/dto';
import { BookingCustomerService } from './customer/customer.service';
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
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt', 'DESC']],
      defaultLimit: 10,
      searchableColumns: ['status'],
      relations: {
        customer: true,
        currency: true,
        payments: true,
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
