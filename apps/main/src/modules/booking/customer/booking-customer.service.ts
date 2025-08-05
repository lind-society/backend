import { paginateResponseMapper } from '@apps/main/common/helpers';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { BookingHelperService } from '../helper/booking-helper.service';
import { BookingCustomer } from './../../../database/entities/booking-customer.entity';
import {
  BookingCustomerDto,
  BookingCustomerWithRelationsDto,
  CreateBookingCustomerDto,
  UpdateBookingCustomerDto,
} from './dto';

@Injectable()
export class BookingCustomerService {
  constructor(
    @InjectDataSource()
    private datasource: DataSource,
    @InjectRepository(BookingCustomer)
    private bookingCustomerRepository: Repository<BookingCustomer>,
    private bookingHelperService: BookingHelperService,
  ) {}

  async create(
    payload: CreateBookingCustomerDto,
    isDashboardRequest: boolean,
    bookingId?: string,
    entityManager?: EntityManager,
  ): Promise<BookingCustomerDto> {
    if (!isDashboardRequest) {
      await this.bookingHelperService.validateBookingExist(
        bookingId,
        entityManager,
      );
    }

    const repository = entityManager
      ? entityManager.getRepository(BookingCustomer)
      : this.bookingCustomerRepository;

    const createdBookingCustomer = repository.create(payload);

    return await repository.save(createdBookingCustomer);
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

    const query = {
      where: {
        id,
      },
      relations: {
        bookings: true,
      },
    };

    const bookingCustomer = entityManager
      ? await entityManager.findOne(BookingCustomer, query)
      : await this.bookingCustomerRepository.findOne(query);

    if (!bookingCustomer) {
      throw new NotFoundException(`booking customer not found`);
    }

    return bookingCustomer;
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

    const repository = entityManager
      ? entityManager.getRepository(BookingCustomer)
      : this.bookingCustomerRepository;

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
  async _validateBookingCustomerExist(
    id: string,
    entityManager?: EntityManager,
  ) {
    if (!id) {
      throw new BadRequestException('booking customer id is required');
    }

    const bookingCustomerExist = entityManager
      ? await entityManager.exists(BookingCustomer, { where: { id } })
      : await this.bookingCustomerRepository.exists({
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
}
