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
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { EntityManager, Repository } from 'typeorm';
import { BookingHelperService } from '../booking/helper/booking-helper.service';
import {
  CreatePaymentRequestDto,
  CreatePaymentSessionDto,
  PaymentDto,
  PaymentRequestDto,
  PaymentSessionDto,
  PaymentTokenDto,
} from '../payment/dto';
import {
  CreatePaymentRefundDto,
  PaymentRefundDto,
} from '../payment/dto/refund';
import { PaymentService } from '../payment/payment.service';
import {
  BookingPaymentDto,
  BookingPaymentPaginationDto,
  BookingPaymentWithRelationsDto,
  CreateBookingPaymentDto,
  UpdateBookingPaymentDto,
} from './dto';
import {
  constructPaymentRefundPayload,
  constructPaymentRequestPayload,
  constructPaymentSessionPayload,
} from './helper';

@Injectable()
export class BookingPaymentService {
  constructor(
    @InjectRepository(BookingPayment)
    private bookingPaymentRepository: Repository<BookingPayment>,
    private bookingHelperService: BookingHelperService,
    private paymentService: PaymentService,
  ) {}

  // Basic Admin CRUD Actions
  async create(
    payload: CreateBookingPaymentDto,
    isDashboardRequest: boolean,
    bookingId?: string,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentWithRelationsDto> {
    const booking = await this.bookingHelperService.getBookingDetail(bookingId);

    this._validateBookingPaymentsStatusAndAmount(
      booking.totalAmount,
      booking.payments,
    );

    const repository = this._getRepository(entityManager);

    const bookingPaymentEntity = repository.create({
      status: isDashboardRequest
        ? (payload.status ?? BookingPaymentAvailableStatus.Pending)
        : BookingPaymentAvailableStatus.Pending,
      bookingId: isDashboardRequest ? payload.bookingId : bookingId,
      currencyId: booking.currencyId,
    });

    const createdBookingPayment = await repository.save(bookingPaymentEntity);

    return BookingPaymentWithRelationsDto.fromEntity(createdBookingPayment);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<BookingPaymentPaginationDto[]>> {
    const paginatedBookingPayments = await paginate(
      query,
      this.bookingPaymentRepository,
      {
        select: [
          'id',
          'paymentMethod',
          'paymentChannel',
          'amount',
          'status',
          'paidAt',
          'refundedAt',
          'cancelledAt',
          'createdAt',

          'currency.id',
          'currency.name',
          'currency.code',
          'currency.symbol',

          'booking.id',
          'booking.type',
          'booking.totalAmount',
          'booking.totalGuest',
          'booking.bookingDate',
          'booking.checkInDate',
          'booking.checkOutDate',
          'booking.status',

          'booking.customer.id',
          'booking.customer.name',
          'booking.customer.email',
          'booking.customer.phoneCountryCode',
          'booking.customer.phoneNumber',

          'booking.currency.id',
          'booking.currency.name',
          'booking.currency.code',
          'booking.currency.symbol',

          'booking.activity.id',
          'booking.activity.name',
          'booking.activity.category.id',
          'booking.activity.category.name',

          'booking.villa.id',
          'booking.villa.name',
        ],
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
          refundHistories: true,
        },
      },
    );

    const bookingPayments = BookingPaymentPaginationDto.fromEntities(
      paginatedBookingPayments.data,
    );

    return paginateResponseMapper(paginatedBookingPayments, bookingPayments);
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

    const repository = this._getRepository(entityManager);

    const bookingPayment = await repository.findOne({
      select: {
        id: true,
        paymentMethod: true,
        paymentChannel: true,
        amount: true,
        status: true,
        failureStage: true,
        failureReason: true,
        refundedAmount: true,
        refundedReason: true,
        cancelledReason: true,
        paymentReferenceId: true,
        paymentRequestReferenceId: true,
        paymentSessionReferenceId: true,
        paymentTokenReferenceId: true,
        paymentRefundReferenceId: true,
        refundedAt: true,
        cancelledAt: true,
        paidAt: true,
        currency: {
          id: true,
          name: true,
          code: true,
          symbol: true,
        },
        booking: {
          id: true,
          type: true,
          totalAmount: true,
          totalGuest: true,
          bookingDate: true,
          checkInDate: true,
          checkOutDate: true,
          status: true,
          customer: {
            id: true,
            name: true,
            email: true,
            phoneCountryCode: true,
            phoneNumber: true,
          },
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
        booking: { customer: true },
        currency: true,
        refundHistories: true,
      },
    });

    if (!bookingPayment) {
      throw new NotFoundException(`booking payment not found`);
    }

    return BookingPaymentWithRelationsDto.fromEntity(bookingPayment);
  }

  async update(
    id: string,
    payload: UpdateBookingPaymentDto,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentWithRelationsDto> {
    const [sanitizedId] = id.split('_');

    await this._validateBookingPaymentExist(sanitizedId, entityManager);

    const repository = this._getRepository(entityManager);

    await repository.update(sanitizedId, payload);

    return await this.findOne(sanitizedId, false, true, null, entityManager);
  }

  async remove(id: string) {
    await this._validateBookingPaymentExist(id);

    await this.bookingPaymentRepository.delete(id);
  }

  // Private Methods
  private _getRepository(
    entityManager?: EntityManager,
  ): Repository<BookingPayment> {
    return entityManager
      ? entityManager.getRepository(BookingPayment)
      : this.bookingPaymentRepository;
  }

  // Payment Gateway Related Methods

  // Payment Request
  async createPaymentRequest(
    bookingId: string,
    id: string,
    payload: CreatePaymentRequestDto,
    entityManager?: EntityManager,
  ): Promise<PaymentRequestDto> {
    await this._validateIdsExist(bookingId, id, entityManager);

    const booking = await this.bookingHelperService.getBookingDetail(
      bookingId,
      entityManager,
    );

    const paymentRequestPayload = constructPaymentRequestPayload(
      id,
      payload,
      booking,
    );

    const paymentRequest = await this.paymentService.createPaymentRequest(
      paymentRequestPayload,
    );

    return paymentRequest;
  }

  async cancelPaymentRequest(
    bookingId: string,
    id: string,
    entityManager?: EntityManager,
  ): Promise<PaymentRequestDto> {
    const bookingPayment = await this.findOne(
      id,
      true,
      false,
      bookingId,
      entityManager,
    );

    if (!bookingPayment.paymentRequestReferenceId) {
      throw new BadRequestException(
        'cancel payment request failed, payment request not found',
      );
    }
    const cancelPaymentRequest = await this.paymentService.cancelPaymentRequest(
      bookingPayment.paymentRequestReferenceId,
    );

    return cancelPaymentRequest;
  }

  // Payment Session (Currently used as card payment)
  async createPaymentSession(
    bookingId: string,
    id: string,
    payload: CreatePaymentSessionDto,
    entityManager?: EntityManager,
  ): Promise<PaymentSessionDto> {
    await this._validateIdsExist(bookingId, id, entityManager);

    const booking = await this.bookingHelperService.getBookingDetail(
      bookingId,
      entityManager,
    );

    const paymentRequestPayload = constructPaymentSessionPayload(
      id,
      payload,
      booking,
    );

    const paymentRequest = await this.paymentService.createPaymentSession(
      paymentRequestPayload,
    );

    return paymentRequest;
  }

  async cancelPaymentSession(
    bookingId: string,
    id: string,
    entityManager?: EntityManager,
  ): Promise<PaymentSessionDto> {
    const bookingPayment = await this.findOne(
      id,
      true,
      false,
      bookingId,
      entityManager,
    );

    if (!bookingPayment.paymentSessionReferenceId) {
      throw new BadRequestException(
        'cancel payment session failed, payment session not found',
      );
    }

    const cancelPaymentSession = await this.paymentService.cancelPaymentSession(
      bookingPayment.paymentSessionReferenceId,
    );

    return cancelPaymentSession;
  }

  // Payment
  async captureAuthorizedPayment(
    bookingId: string,
    id: string,
    entityManager?: EntityManager,
  ) {
    await this._validateIdsExist(bookingId, id, entityManager);

    const bookingPayment = await this.findOne(
      id,
      true,
      false,
      bookingId,
      entityManager,
    );

    if (!bookingPayment.paymentReferenceId) {
      throw new BadRequestException(
        'capture payment failed, payment is not unauthorized',
      );
    }

    const capturePayment = await this.paymentService.capturePayment(
      bookingPayment.paymentReferenceId,
    );

    return capturePayment;
  }

  // Refund
  async createPaymentRefund(
    bookingId: string,
    id: string,
    payload: CreatePaymentRefundDto,
    entityManager?: EntityManager,
  ): Promise<PaymentRefundDto> {
    await this._validateIdsExist(bookingId, id, entityManager);

    const bookingPayment = await this.findOne(
      id,
      true,
      false,
      bookingId,
      entityManager,
    );

    const paymentRefundPayload = constructPaymentRefundPayload(
      payload,
      bookingPayment,
    );

    const paymentRefund =
      await this.paymentService.createPaymentRefund(paymentRefundPayload);

    return paymentRefund;
  }

  // Admin Only Payment Gateway Related Actions
  async getPaymentRequestDetail(
    bookingPaymentId: string,
    entityManager?: EntityManager,
  ): Promise<PaymentRequestDto> {
    const bookingPayment = await this.findOne(
      bookingPaymentId,
      true,
      true,
      null,
      entityManager,
    );

    if (!bookingPayment.paymentRefundReferenceId) {
      throw new BadRequestException(
        'get payment request detail failed, payment request not found',
      );
    }

    return await this.paymentService.getPaymentRequestDetail(
      bookingPayment.paymentRequestReferenceId,
    );
  }

  async getPaymentSessionDetail(
    bookingPaymentId: string,
    entityManager?: EntityManager,
  ): Promise<PaymentSessionDto> {
    const bookingPayment = await this.findOne(
      bookingPaymentId,
      true,
      true,
      null,
      entityManager,
    );

    if (!bookingPayment.paymentSessionReferenceId) {
      throw new BadRequestException(
        'get payment session detail failed, payment session not found',
      );
    }

    return await this.paymentService.getPaymentSessionDetail(
      bookingPayment.paymentSessionReferenceId,
    );
  }

  async getPaymentDetail(
    bookingPaymentId: string,
    entityManager?: EntityManager,
  ): Promise<PaymentDto> {
    const bookingPayment = await this.findOne(
      bookingPaymentId,
      true,
      true,
      null,
      entityManager,
    );

    if (!bookingPayment.paymentReferenceId) {
      throw new BadRequestException(
        'get payment detail failed, payment reference not found',
      );
    }

    return await this.paymentService.getPaymentDetail(
      bookingPayment.paymentReferenceId,
    );
  }

  async getPaymentTokenDetail(
    bookingPaymentId: string,
    entityManager?: EntityManager,
  ): Promise<PaymentTokenDto> {
    const bookingPayment = await this.findOne(
      bookingPaymentId,
      true,
      true,
      null,
      entityManager,
    );

    if (!bookingPayment.paymentTokenReferenceId) {
      throw new BadRequestException(
        'get payment token detail failed, payment token reference not found',
      );
    }

    return await this.paymentService.getPaymentTokenDetail(
      bookingPayment.paymentTokenReferenceId,
    );
  }

  // other helper and private methods
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

    const bookingPayments = entityManager
      ? await entityManager.find(BookingPayment, query)
      : await this.bookingPaymentRepository.find(query);

    if (!bookingPayments) {
      throw new NotFoundException(`booking payment not found`);
    }

    return BookingPaymentWithRelationsDto.fromEntities(bookingPayments);
  }

  // private methods
  async _validateBookingPaymentExist(
    id: string,
    entityManager?: EntityManager,
  ) {
    if (!id) {
      throw new BadRequestException('booking payment id is required');
    }

    const repository = this._getRepository(entityManager);

    const bookingPaymentExist = await repository.exists({
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
      throw new BadRequestException('booking payment id is required');
    }

    await this.bookingHelperService.validateBookingExist(
      bookingId,
      entityManager,
    );

    const repository = this._getRepository(entityManager);

    const bookingPaymentExist = await repository.exists({
      where: { id },
    });

    if (!bookingPaymentExist) {
      throw new NotFoundException('booking payment not found');
    }
  }

  _validateBookingPaymentsStatusAndAmount(
    currentBookingTotalAmount: number,
    bookingPayments: BookingPaymentDto[],
  ): Promise<void> {
    if (!bookingPayments.length) {
      return;
    }

    const totalPaid = bookingPayments
      .filter(
        (payment) =>
          payment.status === BookingPaymentAvailableStatus.Paid ||
          payment.status === BookingPaymentAvailableStatus.Authorized,
      )
      .reduce((sum, p) => sum + p.amount, 0);

    if (totalPaid >= currentBookingTotalAmount) {
      throw new BadRequestException(
        'failed to create payment, booking has been paid.',
      );
    }

    const hasPendingOrAuthorized = bookingPayments.some((payment) =>
      [
        BookingPaymentAvailableStatus.Pending,
        BookingPaymentAvailableStatus.Authorized,
      ].includes(payment.status),
    );

    if (hasPendingOrAuthorized) {
      throw new BadRequestException(
        'Failed to create payment, previous payment is still in process.',
      );
    }
  }
}
