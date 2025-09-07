import { paginateResponseMapper } from '@apps/main/common/helpers';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
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
  private _bookingCustomerDetailQuery: FindOneOptions<BookingCustomer> = {
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
    relations: {
      bookings: { currency: true, activity: { category: true }, villa: true },
    },
  };

  constructor(
    @InjectRepository(BookingCustomer)
    private bookingCustomerRepository: Repository<BookingCustomer>,
    private bookingHelperService: BookingHelperService,
  ) {}

  async create(
    bookingId: string,
    payload: CreateBookingCustomerDto,
    entityManager?: EntityManager,
  ): Promise<BookingCustomerWithRelationsDto> {
    await this._validateRelationsExist(bookingId, null, true);

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

  async findByBookingId(
    bookingId: string,
    entityManager?: EntityManager,
  ): Promise<BookingCustomerWithRelationsDto[]> {
    await this._validateRelationsExist(bookingId, null, true);

    const repository = this._getRepository(entityManager);

    const bookingCustomer = await repository.find({
      ...this._bookingCustomerDetailQuery,
      where: { bookings: { id: bookingId } },
    });

    if (!bookingCustomer) {
      throw new NotFoundException(`booking customer not found`);
    }

    return BookingCustomerWithRelationsDto.fromEntities(bookingCustomer);
  }

  async findOne(
    bookingId: string,
    id: string,
    entityManager?: EntityManager,
  ): Promise<BookingCustomerWithRelationsDto> {
    await this._validateRelationsExist(bookingId, id, false);

    const repository = this._getRepository(entityManager);

    const bookingCustomer = await repository.findOne({
      ...this._bookingCustomerDetailQuery,
      where: { bookings: { id: bookingId } },
    });

    if (!bookingCustomer) {
      throw new NotFoundException(`booking customer not found`);
    }

    return BookingCustomerWithRelationsDto.fromEntity(bookingCustomer);
  }

  async update(
    bookingId: string,
    id: string,
    payload: UpdateBookingCustomerDto,
    entityManager?: EntityManager,
  ): Promise<BookingCustomerWithRelationsDto> {
    await this._validateRelationsExist(bookingId, id, false);

    const repository = this._getRepository(entityManager);

    await repository.update(id, payload);

    return await this.findOne(id, bookingId);
  }

  async remove(bookingId: string, id: string) {
    await this._validateRelationsExist(bookingId, id, false);

    await this.bookingCustomerRepository.delete(id);
  }

  // Dashboard Related Services
  async createFromDashboard(
    payload: CreateBookingCustomerDto,
    entityManager?: EntityManager,
  ): Promise<BookingCustomerWithRelationsDto> {
    const repository = this._getRepository(entityManager);

    const bookingCustomerEntity = repository.create(payload);

    const createdBookingCustomer = await repository.save(bookingCustomerEntity);

    return BookingCustomerWithRelationsDto.fromEntity(createdBookingCustomer);
  }

  async findOneFromDashboard(
    id: string,
    entityManager?: EntityManager,
  ): Promise<BookingCustomerWithRelationsDto> {
    await this.validateExists(id, entityManager);

    const repository = this._getRepository(entityManager);

    const bookingCustomer = await repository.findOne({
      ...this._bookingCustomerDetailQuery,
      where: { id },
    });

    if (!bookingCustomer) {
      throw new NotFoundException(`booking customer not found`);
    }

    return BookingCustomerWithRelationsDto.fromEntity(bookingCustomer);
  }

  async updateFromDashboard(
    id: string,
    payload: UpdateBookingCustomerDto,
    entityManager?: EntityManager,
  ): Promise<BookingCustomerWithRelationsDto> {
    await this.validateExists(id, entityManager);

    const repository = this._getRepository(entityManager);

    await repository.update(id, payload);

    return await this.findOneFromDashboard(id, entityManager);
  }

  async removeFromDashboard(id: string) {
    await this.validateExists(id);

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

  async validateExists(id: string, entityManager?: EntityManager) {
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

  async _validateRelationsExist(
    bookingId: string,
    id: string,
    isCreateAction: boolean,
    entityManager?: EntityManager,
  ) {
    if (!bookingId) {
      throw new BadRequestException('booking id is required');
    }

    await this.bookingHelperService.validateBookingExist(
      bookingId,
      entityManager,
    );

    if (!isCreateAction) {
      if (!id) {
        throw new BadRequestException('booking customer id is required');
      }

      await this.validateExists(id);
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
