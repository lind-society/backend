import { paginateResponseMapper } from '@apps/main/common/helpers';
import { BookingPaymentRefund } from '@apps/main/database/entities';
import { PaginateResponseDataProps } from '@apps/main/modules/shared/dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { BookingHelperService } from '../../booking/helper/booking-helper.service';
import {
  BookingPaymentRefundDto,
  BookingPaymentRefundPaginationDto,
  BookingPaymentRefundWithRelationsDto,
  CreateBookingPaymentRefundDto,
  UpdateBookingPaymentRefundDto,
} from './dto';

@Injectable()
export class BookingPaymentRefundService {
  constructor(
    @InjectRepository(BookingPaymentRefund)
    private bookingPaymentRefundRepository: Repository<BookingPaymentRefund>,
    private bookingHelperService: BookingHelperService,
  ) {}

  async create(
    payload: CreateBookingPaymentRefundDto,
    isDashboardRequest: boolean,
    bookingId?: string,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentRefundDto> {
    if (!isDashboardRequest) {
      await this.bookingHelperService.validateBookingExist(
        bookingId,
        entityManager,
      );
    }

    const repository = entityManager
      ? entityManager.getRepository(BookingPaymentRefund)
      : this.bookingPaymentRefundRepository;

    const bookingPaymentRefundEntity = repository.create(payload);
    const createdBookingPaymentRefund = await repository.save(
      bookingPaymentRefundEntity,
    );

    return BookingPaymentRefundWithRelationsDto.fromEntity(
      createdBookingPaymentRefund,
    );
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<BookingPaymentRefundPaginationDto[]>> {
    const paginatedBookingPaymentRefunds = await paginate(
      query,
      this.bookingPaymentRefundRepository,
      {
        select: [
          'id',
          'amount',
          'reason',
          'status',
          'createdAt',

          'currency.id',
          'currency.name',
          'currency.code',
          'currency.symbol',

          'payments.id',
          'payments.paymentMethod',
          'payments.paymentChannel',
          'payments.failureStage',
          'payments.failureReason',
          'payments.refundedAmount',
          'payments.refundedReason',
          'payments.refundedAt',
          'payments.cancelledReason',
          'payments.cancelledAt',
          'payments.amount',
          'payments.paidAt',
          'payments.status',

          'payments.currency.id',
          'payments.currency.name',
          'payments.currency.code',
          'payments.currency.symbol',
        ],
        sortableColumns: ['createdAt', 'status'],
        defaultSortBy: [['createdAt', 'DESC']],
        nullSort: 'last',
        defaultLimit: 10,
        maxLimit: 100,
        filterableColumns: {
          status: [FilterOperator.EQ],
          createdAt: [FilterOperator.GTE, FilterOperator.LTE],
        },
        searchableColumns: ['status', 'reason'],
        relations: {
          bookingPayment: true,
        },
      },
    );

    const bookingPaymentRefunds =
      BookingPaymentRefundPaginationDto.fromEntities(
        paginatedBookingPaymentRefunds.data,
      );

    return paginateResponseMapper(
      paginatedBookingPaymentRefunds,
      bookingPaymentRefunds,
    );
  }

  async findOne(
    id: string,
    needValidation: boolean,
    isDashboardRequest: boolean,
    bookingId?: string,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentRefundWithRelationsDto> {
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
        await this._validateBookingPaymentRefundExist(id, entityManager);
      }
    }

    const query: FindOneOptions<BookingPaymentRefund> = {
      select: {
        id: true,
        amount: true,
        reason: true,
        status: true,
        failureReason: true,
        currency: {
          id: true,
          name: true,
          code: true,
          symbol: true,
        },
        bookingPayment: {
          id: true,
          paymentMethod: true,
          paymentChannel: true,
          failureStage: true,
          failureReason: true,
          refundedAmount: true,
          refundedReason: true,
          refundedAt: true,
          cancelledReason: true,
          cancelledAt: true,
          amount: true,
          paidAt: true,
          status: true,
          currency: {
            id: true,
            name: true,
            code: true,
            symbol: true,
          },
        },
      },
      where: {
        id,
      },
      relations: {
        bookingPayment: true,
      },
    };

    const bookingPaymentRefund = entityManager
      ? await entityManager.findOne(BookingPaymentRefund, query)
      : await this.bookingPaymentRefundRepository.findOne(query);

    if (!bookingPaymentRefund) {
      throw new NotFoundException(`booking payment refund not found`);
    }

    return BookingPaymentRefundWithRelationsDto.fromEntity(
      bookingPaymentRefund,
    );
  }

  async update(
    id: string,
    payload: UpdateBookingPaymentRefundDto,
    isDashboardRequest: boolean,
    bookingId?: string,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentRefundWithRelationsDto> {
    if (!isDashboardRequest) {
      await this._validateIdsExist(bookingId, id, entityManager);
    } else {
      await this._validateBookingPaymentRefundExist(id, entityManager);
    }

    const repository = entityManager
      ? entityManager.getRepository(BookingPaymentRefund)
      : this.bookingPaymentRefundRepository;

    await repository.update(id, payload);

    return await this.findOne(id, false, true, null, entityManager);
  }

  async remove(id: string, isDashboardRequest: boolean, bookingId?: string) {
    if (!isDashboardRequest) {
      await this._validateIdsExist(bookingId, id);
    } else {
      await this._validateBookingPaymentRefundExist(id);
    }

    await this.bookingPaymentRefundRepository.delete(id);
  }

  // private methods
  async _validateBookingPaymentRefundExist(
    id: string,
    entityManager?: EntityManager,
  ) {
    if (!id) {
      throw new BadRequestException('id is required');
    }

    const bookingPaymentRefundExist = entityManager
      ? await entityManager.exists(BookingPaymentRefund, { where: { id } })
      : await this.bookingPaymentRefundRepository.exists({
          where: { id },
        });

    if (!bookingPaymentRefundExist) {
      throw new NotFoundException('booking payment refund not found');
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

    const bookingPaymentRefundExist = entityManager
      ? await entityManager.exists(BookingPaymentRefund, { where: { id } })
      : await this.bookingPaymentRefundRepository.exists({
          where: { id },
        });

    if (!bookingPaymentRefundExist) {
      throw new NotFoundException('booking payment refund not found');
    }
  }

  // helper methods
  async findOneByBookingId(
    bookingId: string,
    entityManager?: EntityManager,
  ): Promise<BookingPaymentRefundWithRelationsDto> {
    await this.bookingHelperService.validateBookingExist(
      bookingId,
      entityManager,
    );

    const query = {
      where: {
        bookingPayment: {
          id: bookingId,
        },
      },
      relations: {
        bookingPayment: true,
      },
    };

    const bookingPaymentRefund = entityManager
      ? await entityManager.findOne(BookingPaymentRefund, query)
      : await this.bookingPaymentRefundRepository.findOne(query);

    if (!bookingPaymentRefund) {
      throw new NotFoundException(`booking payment refund not found`);
    }

    return BookingPaymentRefundWithRelationsDto.fromEntity(
      bookingPaymentRefund,
    );
  }
}
