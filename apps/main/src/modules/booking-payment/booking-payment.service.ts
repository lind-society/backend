import { paginateResponseMapper } from '@apps/main/common/helpers';
import {
  BookingPayment,
  BookingPaymentAvailableStatus,
} from '@apps/main/database/entities';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { BookingHelperService } from '../booking/helper/booking-helper.service';
import {
  CreatePaymentRequestDto,
  PaymentInvoiceDto,
  PaymentRequestDto,
} from '../payment/dto';
import { PaymentService } from '../payment/payment.service';
import {
  BookingPaymentWithRelationsDto,
  CreateBookingPaymentDto,
  CreateBookingPaymentWithInvoiceDto,
  UpdateBookingPaymentDto,
} from './dto';
import { constructPaymentPayload } from './helper';

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
    isDashboardRequest: boolean,
    bookingId?: string,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentWithRelationsDto> {
    const booking =
      await this.bookingHelperService.getBookingCurrencyId(bookingId);

    const repository = entityManager
      ? entityManager.getRepository(BookingPayment)
      : this.bookingPaymentRepository;

    const createdBookingPayment = repository.create({
      status: payload.status ?? BookingPaymentAvailableStatus.Pending,
      bookingId: isDashboardRequest ? payload.bookingId : bookingId,
      currencyId: booking.currencyId,
    });

    return await repository.save(createdBookingPayment);
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

  async findOne(
    id: string,
    needValidation: boolean,
    isDashboardRequest: boolean,
    bookingId?: string,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentWithRelationsDto> {
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
        await this._validateBookingPaymentExist(id, entityManager);
      }
    }

    const query = {
      where: {
        id,
      },
      relations: {
        booking: { customer: true },
        currency: true,
      },
    };

    const bookingPayment = entityManager
      ? await entityManager.findOne(BookingPayment, query)
      : await this.bookingPaymentRepository.findOne(query);

    if (!bookingPayment) {
      throw new NotFoundException(`booking payment not found`);
    }

    return bookingPayment;
  }

  async update(
    id: string,
    payload: UpdateBookingPaymentDto,
    isDashboardRequest: boolean,
    bookingId?: string,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentWithRelationsDto> {
    if (!isDashboardRequest) {
      await this._validateIdsExist(bookingId, id, entityManager);
    } else {
      await this._validateBookingPaymentExist(id, entityManager);
    }

    const repository = entityManager
      ? entityManager.getRepository(BookingPayment)
      : this.bookingPaymentRepository;

    await repository.update(id, payload);

    return await this.findOne(id, false, true, null, entityManager);
  }

  async remove(id: string, isDashboardRequest: boolean, bookingId?: string) {
    if (!isDashboardRequest) {
      await this._validateIdsExist(bookingId, id);
    } else {
      await this._validateBookingPaymentExist(id);
    }

    await this.bookingPaymentRepository.delete(id);
  }

  // private methods
  async _validateBookingPaymentExist(
    id: string,
    entityManager?: EntityManager,
  ) {
    if (!id) {
      throw new BadRequestException('id is required');
    }

    const bookingPaymentExist = entityManager
      ? await entityManager.exists(BookingPayment, { where: { id } })
      : await this.bookingPaymentRepository.exists({
          where: { id },
        });

    if (!bookingPaymentExist) {
      throw new NotFoundException('booking payment not found');
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
      throw new BadRequestException('id is required');
    }

    await this.bookingHelperService.validateBookingExist(
      bookingId,
      entityManager,
    );

    const bookingPaymentExist = entityManager
      ? await entityManager.exists(BookingPayment, { where: { id } })
      : await this.bookingPaymentRepository.exists({
          where: { id },
        });

    if (!bookingPaymentExist) {
      throw new NotFoundException('booking payment not found');
    }
  }

  // Payment Gateway related methods
  async createInvoice(
    bookingId: string,
    payload: CreateBookingPaymentWithInvoiceDto,
  ): Promise<PaymentInvoiceDto> {
    const bookingDetail =
      await this.bookingHelperService.getBookingCurrencyId(bookingId);

    return await this.datasource.transaction(async (manager: EntityManager) => {
      const bookingPayment = await this.create(
        {
          ...payload,
          currencyId: bookingDetail.currencyId,
        },
        false,
        bookingId,
        manager,
      );

      const invoice = await this.paymentService.createInvoice({
        ...payload,
        metadata: {
          bookingId,
          bookingPaymentId: bookingPayment.id,
        },
      });

      await this.update(
        bookingId,
        { paymentReferenceId: invoice.id },
        false,
        bookingPayment.id,
        manager,
      );

      return invoice;
    });
  }

  async createPaymentRequest(
    bookingId: string,
    id: string,
    payload: CreatePaymentRequestDto,
    entityManager?: EntityManager,
  ): Promise<PaymentRequestDto> {
    const booking = await this.bookingHelperService.getBookingDetail(
      bookingId,
      entityManager,
    );

    const paymentPayload = constructPaymentPayload(id, payload, booking);

    const paymentRequest =
      await this.paymentService.createPaymentRequest(paymentPayload);

    return paymentRequest;
  }

  // other helper methodss
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
}
