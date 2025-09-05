import { paginateResponseMapper } from '@apps/main/common/helpers';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { EntityManager, Repository } from 'typeorm';
import { BookingHelperService } from '../helper/booking-helper.service';
import { BookingCustomer } from './../../../database/entities/booking-customer.entity';
import {
  BookingCustomerPaginationDto,
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
    isDashboardRequest: boolean,
    bookingId?: string,
    entityManager?: EntityManager,
  ): Promise<BookingCustomerWithRelationsDto> {
    if (!isDashboardRequest) {
      await this.bookingHelperService.validateBookingExist(
        bookingId,
        entityManager,
      );
    }

    const repository = this._getRepository(entityManager);

    const bookingCustomerEntity = repository.create(payload);

    const createdBookingCustomer = await repository.save(bookingCustomerEntity);

    return BookingCustomerWithRelationsDto.fromEntity(createdBookingCustomer);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<BookingCustomerPaginationDto[]>> {
    const paginatedBookingCustomers = await paginate(
      query,
      this.bookingCustomerRepository,
      {
        select: [
          'id',
          'name',
          'email',
          'phoneCountryCode',
          'phoneNumber',
          'createdAt',

          'bookings.id',
          'bookings.type',
          'bookings.totalAmount',
          'bookings.totalGuest',
          'bookings.bookingDate',
          'bookings.checkInDate',
          'bookings.checkOutDate',
          'bookings.status',

          'bookings.currency.id',
          'bookings.currency.name',
          'bookings.currency.code',
          'bookings.currency.symbol',

          'bookings.activity.id',
          'bookings.activity.name',
          'bookings.activity.category.id',
          'bookings.activity.category.name',

          'bookings.villa.id',
          'bookings.villa.name',
        ],
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
          bookings: {
            currency: true,
            activity: { category: true },
            villa: true,
          },
        },
      },
    );

    const bookingCustomers = BookingCustomerPaginationDto.fromEntities(
      paginatedBookingCustomers.data,
    );

    return paginateResponseMapper(paginatedBookingCustomers, bookingCustomers);
  }

  async findOne(
    id: string,
    needValidation: boolean,
    isDashboardRequest: boolean,
    bookingId?: string,
    entityManager?: EntityManager,
  ): Promise<BookingCustomerWithRelationsDto> {
    if (!isDashboardRequest) {
      await this.bookingHelperService.validateBookingExist(
        bookingId,
        entityManager,
      );

      if (needValidation) {
        await this._validateIdsExist(bookingId, id, entityManager);
      }
    } else {
      if (needValidation) {
        await this._validateBookingCustomerExist(id, entityManager);
      }
    }

    const repository = this._getRepository(entityManager);

    const bookingCustomer = await repository.findOne({
      select: {
        id: true,
        name: true,
        email: true,
        phoneCountryCode: true,
        phoneNumber: true,
        bookings: {
          id: true,
          type: true,
          totalAmount: true,
          totalGuest: true,
          bookingDate: true,
          checkInDate: true,
          checkOutDate: true,
          status: true,
          currency: {
            id: true,
            name: true,
            code: true,
            symbol: true,
          },
          activity: {
            id: true,
            name: true,
            category: {
              id: true,
              name: true,
            },
          },
          villa: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        id,
      },
      relations: {
        bookings: { currency: true, activity: { category: true }, villa: true },
      },
    });

    if (!bookingCustomer) {
      throw new NotFoundException(`booking customer not found`);
    }

    return BookingCustomerWithRelationsDto.fromEntity(bookingCustomer);
  }

  async update(
    id: string,
    payload: UpdateBookingCustomerDto,
    isDashboardRequest: boolean,
    bookingId?: string,
    entityManager?: EntityManager,
  ): Promise<BookingCustomerWithRelationsDto> {
    if (!isDashboardRequest) {
      await this._validateIdsExist(bookingId, id, entityManager);
    } else {
      await this._validateBookingCustomerExist(id, entityManager);
    }

    const repository = this._getRepository(entityManager);

    await repository.update(id, payload);

    return await this.findOne(id, false, true, null, entityManager);
  }

  async remove(id: string, isDashboardRequest: boolean, bookingId?: string) {
    if (!isDashboardRequest) {
      await this._validateIdsExist(bookingId, id);
    } else {
      await this._validateBookingCustomerExist(id);
    }

    await this.bookingCustomerRepository.delete(id);
  }

  // private methods
  private _getRepository(
    entityManager?: EntityManager,
  ): Repository<BookingCustomer> {
    return entityManager
      ? entityManager.getRepository(BookingCustomer)
      : this.bookingCustomerRepository;
  }

  async _validateBookingCustomerExist(
    id: string,
    entityManager?: EntityManager,
  ) {
    if (!id) {
      throw new BadRequestException('booking customer id is required');
    }

    const repository = this._getRepository(entityManager);

    const bookingCustomerExist = await repository.exists({
      where: { id },
    });

    if (!bookingCustomerExist) {
      throw new NotFoundException('booking customer not found');
    }
  }

  async _validateIdsExist(
    bookingId: string,
    id: string,
    entityManager?: EntityManager,
  ) {
    if (!bookingId) {
      throw new BadRequestException('booking id is required');
    }

    if (!id) {
      throw new BadRequestException('booking customer id is required');
    }

    await this.bookingHelperService.validateBookingExist(
      bookingId,
      entityManager,
    );

    const bookingCustomerExist = entityManager
      ? await entityManager.exists(BookingCustomer, { where: { id } })
      : await this.bookingCustomerRepository.exists({
          where: { id },
        });

    if (!bookingCustomerExist) {
      throw new NotFoundException('booking customer not found');
    }
  }

  // helper methods
  async findOneByBookingId(
    bookingId: string,
    entityManager?: EntityManager,
  ): Promise<BookingCustomerWithRelationsDto> {
    await this.bookingHelperService.validateBookingExist(
      bookingId,
      entityManager,
    );

    const repository = this._getRepository(entityManager);

    const bookingCustomer = await repository.findOne({
      select: {
        id: true,
        name: true,
        email: true,
        bookings: {
          id: true,
          type: true,
          totalAmount: true,
          totalGuest: true,
          bookingDate: true,
          checkInDate: true,
          checkOutDate: true,
          status: true,
          activity: {
            id: true,
            name: true,
            category: {
              id: true,
              name: true,
            },
          },
          villa: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        id: bookingId,
      },
      relations: {
        bookings: true,
      },
    });

    if (!bookingCustomer) {
      throw new NotFoundException(`booking customer not found`);
    }

    return BookingCustomerWithRelationsDto.fromEntity(bookingCustomer);
  }
}
