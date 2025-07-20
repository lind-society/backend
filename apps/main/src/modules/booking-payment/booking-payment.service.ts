import { paginateResponseMapper } from '@apps/main/common/helpers';
import { BookingPayment } from '@apps/main/database/entities';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { BookingHelperService } from '../booking/helper/booking-helper.service';
import { PaymentInvoiceDto } from '../payment/dto';
import { PaymentService } from '../payment/payment.service';
import {
  BookingPaymentWithRelationsDto,
  CreateBookingPaymentDto,
  CreateBookingPaymentWithInvoiceDto,
  UpdateBookingPaymentDto,
} from './dto';

@Injectable()
export class BookingPaymentService {
  constructor(
    @InjectDataSource()
    private datasource: DataSource,
    @InjectRepository(BookingPayment)
    private bookingPaymentRepository: Repository<BookingPayment>,
    private bookingHelperService: BookingHelperService,
    private paymentService: PaymentService,
  ) {}

  async create(
    payload: CreateBookingPaymentDto,
    bookingIdFromParam?: string,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentWithRelationsDto> {
    const bookingId = payload.bookingId ?? bookingIdFromParam;

    const repository = entityManager
      ? entityManager.getRepository(BookingPayment)
      : this.bookingPaymentRepository;

    const createdBookingPayment = repository.create({ ...payload, bookingId });

    return await this.bookingPaymentRepository.save(createdBookingPayment);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<BookingPaymentWithRelationsDto[]>> {
    const paginatedBookingPayment = await paginate(
      query,
      this.bookingPaymentRepository,
      {
        sortableColumns: ['createdAt', 'amount', 'status', 'paymentMethod'],
        defaultSortBy: [['createdAt', 'DESC']],
        nullSort: 'last',
        defaultLimit: 10,
        maxLimit: 100,
        filterableColumns: {
          amount: [FilterOperator.GTE, FilterOperator.LTE],
          status: [FilterOperator.EQ],
          paymentMethod: [FilterOperator.EQ],
          createdAt: [FilterOperator.GTE, FilterOperator.LTE],
        },
        relations: {
          booking: { customer: true },
          currency: true,
        },
      },
    );

    return paginateResponseMapper(paginatedBookingPayment);
  }

  async findAllByBookingId(
    bookingId: string,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentWithRelationsDto[]> {
    await this.bookingHelperService.validateBookingExist(
      bookingId,
      entityManager,
    );

    const query = {
      where: {
        bookingId,
      },
      relations: {
        booking: { customer: true },
        currency: true,
      },
    };

    const bookingPaymentRepository = entityManager
      ? await entityManager.find(BookingPayment, query)
      : await this.bookingPaymentRepository.find(query);

    if (!bookingPaymentRepository) {
      throw new NotFoundException(`booking payment not found`);
    }

    return bookingPaymentRepository;
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
    entityManager?: EntityManager,
  ): Promise<BookingPaymentWithRelationsDto> {
    if (!entityManager) {
      await this.findOne(id);
    }

    const repository = entityManager
      ? entityManager.getRepository(BookingPayment)
      : this.bookingPaymentRepository;

    await repository.update(id, payload);

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.bookingPaymentRepository.delete(id);
  }

  // Payment Gateway related methods
  async createInvoice(
    bookingId: string,
    payload: CreateBookingPaymentWithInvoiceDto,
  ): Promise<PaymentInvoiceDto> {
    const bookingDetail =
      await this.bookingHelperService.getBookingDetailById(bookingId);

    return await this.datasource.transaction(async (manager: EntityManager) => {
      const bookingPayment = await this.create(
        {
          ...payload,
          currencyId: bookingDetail.currencyId,
          paymentReferenceId: '',
          bookingId: '',
          paidAt: '',
        },
        bookingId,
        manager,
      );

      const invoice = await this.paymentService.createInvoice({
        ...payload,
        externalId: bookingPayment.id,
        metadata: {
          ...payload,
          bookingId,
          bookingPaymentId: bookingPayment.id,
        },
      });

      await this.update(
        bookingPayment.id,
        { paymentReferenceId: invoice.id },
        manager,
      );

      return invoice;
    });
  }

  async createPaymentRequest(
    bookingId: string,
    payload: any,
    entityManager?: EntityManager,
  ): Promise<any> {
    await this.bookingHelperService.validateBookingExist(
      bookingId,
      entityManager,
    );

    const paymentRequest =
      await this.paymentService.createPaymentRequest(payload);

    return paymentRequest;
  }
}
