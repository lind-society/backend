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
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { BookingWithRelationsDto } from '../booking/dto';
import { BookingAccessService } from '../booking/helper/booking-access.service';
import { BookingHelperService } from '../booking/helper/booking-helper.service';
import {
  FINALIZED_BOOKING_STATUSES,
  isBookingOpenForPayment,
  isClosedBookingStatus,
} from '../booking/helper/booking-status.helper';
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
  StartBookingPaymentDto,
  UpdateBookingPaymentDto,
} from './dto';
import {
  constructPaymentRefundPayload,
  constructPaymentRequestPayload,
  constructPaymentSessionPayload,
} from './helper';

@Injectable()
export class BookingPaymentService {
  private _bookingPaymentDetailQuery: FindOneOptions<BookingPayment> = {
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
      // Both foreign keys are declared on the DTO and read by callers — most
      // importantly the gateway callback, which uses `bookingId` to move the
      // booking to `booked`. Leaving them out of the select makes them
      // `undefined` at runtime with nothing failing until that update runs.
      bookingId: true,
      currencyId: true,
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
    relations: {
      booking: { customer: true },
      currency: true,
      refundHistories: true,
    },
  };

  constructor(
    @InjectRepository(BookingPayment)
    private bookingPaymentRepository: Repository<BookingPayment>,
    private bookingHelperService: BookingHelperService,
    private bookingAccessService: BookingAccessService,
    private paymentService: PaymentService,
  ) {}

  async create(
    bookingId: string,
    payload: StartBookingPaymentDto,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentWithRelationsDto> {
    await this._validateRelationsExist(bookingId, null, true, entityManager);

    const booking = await this.bookingHelperService.getBookingDetail(
      bookingId,
      entityManager,
    );

    // This route is reachable by the guest holding the booking link, so both
    // the booking's readiness and the amount have to be decided here rather
    // than taken from the request.
    this._validateBookingIsPayable(booking, true);

    this._validateBookingPaymentsStatusAndAmount(
      booking.totalAmount,
      booking.payments,
    );

    const amount = this._resolveOutstandingAmount(booking);

    if (payload.amount != null && Number(payload.amount) !== amount) {
      throw new BadRequestException(
        `payment amount must be the outstanding balance of ${amount}`,
      );
    }

    const repository = this._getRepository(entityManager);

    // Listed field by field rather than spread: everything a caller may set is
    // named here, so widening `StartBookingPaymentDto` later cannot quietly
    // widen what a guest can write into the record.
    const bookingPaymentEntity = repository.create({
      paymentMethod: payload.paymentMethod,
      paymentChannel: payload.paymentChannel,
      amount,
      status: BookingPaymentAvailableStatus.Pending,
      bookingId: bookingId,
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
          booking: {
            customer: true,
            currency: true,
            activity: { category: true },
            villa: true,
          },
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

  async findByBookingId(
    bookingId: string,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentWithRelationsDto[]> {
    await this._validateRelationsExist(bookingId, null, true, entityManager);

    const repository = this._getRepository(entityManager);

    const bookingPayment = await repository.find({
      ...this._bookingPaymentDetailQuery,
      where: { bookingId },
    });

    if (!bookingPayment) {
      throw new NotFoundException(`booking payments not found`);
    }

    return BookingPaymentWithRelationsDto.fromEntities(bookingPayment);
  }

  async findOne(
    bookingId: string,
    id: string,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentWithRelationsDto> {
    await this._validateRelationsExist(bookingId, id, false, entityManager);

    const repository = this._getRepository(entityManager);

    const bookingPayment = await repository.findOne({
      ...this._bookingPaymentDetailQuery,
      where: { id },
    });

    if (!bookingPayment) {
      throw new NotFoundException(`booking payment not found`);
    }

    return BookingPaymentWithRelationsDto.fromEntity(bookingPayment);
  }

  async update(
    bookingId: string,
    id: string,
    payload: UpdateBookingPaymentDto,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentWithRelationsDto> {
    await this._validateRelationsExist(bookingId, id, false, entityManager);

    const repository = this._getRepository(entityManager);

    await repository.update(id, payload);

    return await this.findOne(bookingId, id, entityManager);
  }

  async remove(bookingId: string, id: string) {
    await this._validateRelationsExist(bookingId, id, false);

    await this.bookingPaymentRepository.delete(id);
  }

  // Dashboard Related Services
  async createFromDashboard(
    payload: CreateBookingPaymentDto,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentWithRelationsDto> {
    const booking = await this.bookingHelperService.getBookingDetail(
      payload.bookingId,
    );

    // Admin-only route: an admin may still record a payment while a booking is
    // being set up, so this only blocks bookings that are closed or already
    // settled — but the amount stays their call.
    this._validateBookingIsPayable(booking, false);

    this._validateBookingPaymentsStatusAndAmount(
      booking.totalAmount,
      booking.payments,
    );

    const repository = this._getRepository(entityManager);

    const bookingPaymentEntity = repository.create({
      ...payload,
      status: payload.status ?? BookingPaymentAvailableStatus.Pending,
      bookingId: booking.id,
      currencyId: booking.currencyId,
    });

    const createdBookingPayment = await repository.save(bookingPaymentEntity);

    return BookingPaymentWithRelationsDto.fromEntity(createdBookingPayment);
  }

  async findOneFromDashboard(
    id: string,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentWithRelationsDto> {
    await this._validateExists(id, entityManager);

    const repository = this._getRepository(entityManager);

    const bookingPayment = await repository.findOne({
      ...this._bookingPaymentDetailQuery,
      where: { id },
    });

    if (!bookingPayment) {
      throw new NotFoundException(`booking payment not found`);
    }

    return BookingPaymentWithRelationsDto.fromEntity(bookingPayment);
  }

  async updateFromDashboard(
    id: string,
    payload: UpdateBookingPaymentDto,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentWithRelationsDto> {
    await this._validateExists(id, entityManager);

    const repository = this._getRepository(entityManager);

    await repository.update(id, payload);

    return await this.findOneFromDashboard(id, entityManager);
  }

  async removeFromDashboard(id: string) {
    await this._validateExists(id);

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
    await this._validateRelationsExist(bookingId, id, false, entityManager);

    const booking = await this.bookingHelperService.getBookingDetail(
      bookingId,
      entityManager,
    );

    // Reachable with nothing but the booking link, so neither the readiness of
    // the booking nor the amount can be taken from the request.
    this._validateBookingIsPayable(booking, true);

    const bookingPayment = await this.findOne(bookingId, id, entityManager);

    const bookingLink = await this.bookingAccessService.findBookingLink(
      bookingId,
      entityManager,
    );

    const paymentRequestPayload = constructPaymentRequestPayload(
      id,
      payload,
      booking,
      Number(bookingPayment.amount),
      bookingLink,
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
    const bookingPayment = await this.findOne(bookingId, id, entityManager);

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
    await this._validateRelationsExist(bookingId, id, false, entityManager);

    const booking = await this.bookingHelperService.getBookingDetail(
      bookingId,
      entityManager,
    );

    this._validateBookingIsPayable(booking, true);

    const bookingPayment = await this.findOne(bookingId, id, entityManager);

    const bookingLink = await this.bookingAccessService.findBookingLink(
      bookingId,
      entityManager,
    );

    const paymentRequestPayload = constructPaymentSessionPayload(
      id,
      payload,
      booking,
      Number(bookingPayment.amount),
      bookingLink,
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
    const bookingPayment = await this.findOne(bookingId, id, entityManager);

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
    await this._validateRelationsExist(bookingId, id, false, entityManager);

    const bookingPayment = await this.findOne(bookingId, id, entityManager);

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
    await this._validateRelationsExist(bookingId, id, false, entityManager);

    const bookingPayment = await this.findOne(bookingId, id, entityManager);

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
    const bookingPayment = await this.findOneFromDashboard(
      bookingPaymentId,
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
    const bookingPayment = await this.findOneFromDashboard(
      bookingPaymentId,
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
    const bookingPayment = await this.findOneFromDashboard(
      bookingPaymentId,
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
    const bookingPayment = await this.findOneFromDashboard(
      bookingPaymentId,
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
  async _validateExists(id: string, entityManager?: EntityManager) {
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
        throw new BadRequestException('booking payment id is required');
      }

      await this._validateExists(id);

      // The payment id has to belong to the booking in the route. Without this
      // check, anyone able to reach one booking could drive the payments of
      // another simply by pairing their own booking id with a foreign payment
      // id — including refunds and cancellations.
      const belongsToBooking = await this._getRepository(entityManager).exists({
        where: { id, bookingId },
      });

      if (!belongsToBooking) {
        throw new NotFoundException('booking payment not found');
      }
    }
  }

  /**
   * A booking is only payable while it is actually waiting for money.
   *
   * `strict` is used on the guest-facing route: the customer may only pay once
   * the admin has confirmed availability and parked the booking at
   * `waiting_for_payment` (activities: `pending`). The dashboard route uses the
   * lenient form, which only rules out bookings that are closed or already
   * settled.
   */
  private _validateBookingIsPayable(
    booking: BookingWithRelationsDto,
    strict: boolean,
  ): void {
    if (isClosedBookingStatus(booking.status)) {
      throw new BadRequestException(
        'failed to create payment, this booking has been closed',
      );
    }

    if (FINALIZED_BOOKING_STATUSES.includes(booking.status)) {
      throw new BadRequestException(
        `failed to create payment, booking is already ${booking.status}`,
      );
    }

    if (strict && !isBookingOpenForPayment(booking.type, booking.status)) {
      throw new BadRequestException(
        `failed to create payment, booking is not open for payment yet (current status: ${booking.status})`,
      );
    }
  }

  /**
   * What is still owed on the booking. Anything already paid or authorised is
   * deducted so a retry after a partial payment asks for the remainder only.
   */
  private _resolveOutstandingAmount(booking: BookingWithRelationsDto): number {
    const settled = (booking.payments ?? [])
      .filter(
        (payment) =>
          payment.status === BookingPaymentAvailableStatus.Paid ||
          payment.status === BookingPaymentAvailableStatus.Authorized,
      )
      .reduce((sum, payment) => sum + Number(payment.amount), 0);

    return Math.max(Number(booking.totalAmount) - settled, 0);
  }

  private _validateBookingPaymentsStatusAndAmount(
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
