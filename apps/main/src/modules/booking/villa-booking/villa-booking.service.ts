import {
  constructPhoneNumber,
  paginateResponseMapper,
} from '@apps/main/common/helpers';
import { VillaBooking } from '@apps/main/database/entities';
import { WhatsappClientService } from '@libs/whatsapp-client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PaginateResponseDataProps } from '../../shared/dto';
import { BookingCustomerService } from '../customer/booking-customer.service';
import {
  CreateVillaBookingDto,
  UpdateVillaBookingDto,
  VillaBookingWithRelationsDto,
} from './dto';

@Injectable()
export class VillaBookingService {
  constructor(
    private datasource: DataSource,
    @InjectRepository(VillaBooking)
    private villaBookingRepository: Repository<VillaBooking>,
    private bookingCustomerService: BookingCustomerService,
    private whatsappClientService: WhatsappClientService,
  ) {}

  async create(
    payload: CreateVillaBookingDto,
  ): Promise<VillaBookingWithRelationsDto> {
    return await this.datasource.transaction(async (manager: EntityManager) => {
      const createdVillaBookingCustomer =
        await this.bookingCustomerService.create(payload.customer, manager);

      const createdVillaBooking = await manager.save(VillaBooking, {
        ...payload,
        customerId: createdVillaBookingCustomer.id,
      });

      const bookingDetail = await this.findOne(createdVillaBooking.id, manager);

      await this.whatsappClientService.sendMessage({
        phoneNumber: constructPhoneNumber(
          payload.customer.phoneCountryCode,
          payload.customer.phoneNumber,
        ),
        message: this._formatVillaBookingMessage(bookingDetail),
      });

      return bookingDetail;
    });
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<PaginateResponseDataProps<VillaBookingWithRelationsDto[]>> {
    const paginatedVillaBooking = await paginate(
      query,
      this.villaBookingRepository,
      {
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
          totalGuest: [
            FilterOperator.EQ,
            FilterOperator.GTE,
            FilterOperator.LTE,
          ],
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

          customerId: [FilterOperator.EQ],
          'payments.id': [FilterOperator.EQ],
          villaId: [FilterOperator.EQ],
          activityId: [FilterOperator.EQ],
        },
        searchableColumns: ['customer.name', 'villa.name'],
        relations: {
          customer: true,
          currency: true,
          villa: {
            owner: true,
            currency: true,
          },
          review: true,
          payments: { currency: true },
        },
      },
    );

    return paginateResponseMapper(paginatedVillaBooking);
  }

  async findOne(
    id: string,
    entityManager?: EntityManager,
  ): Promise<VillaBookingWithRelationsDto> {
    const repository = entityManager
      ? entityManager.getRepository(VillaBooking)
      : this.villaBookingRepository;

    const bookingPayment = await repository.findOne({
      where: {
        id,
      },
      relations: {
        customer: true,
        currency: true,
        villa: {
          owner: true,
          currency: true,
        },
        review: true,
        payments: { currency: true },
      },
    });

    if (!bookingPayment) {
      throw new NotFoundException(`villa booking not found`);
    }

    return bookingPayment;
  }

  async update(
    id: string,
    payload: UpdateVillaBookingDto,
  ): Promise<VillaBookingWithRelationsDto> {
    const initialVillaBooking = await this.findOne(id);

    const { customer: customerData, ...bookingData } = payload;

    await this.datasource.transaction(async (manager: EntityManager) => {
      if (payload.customer) {
        await this.bookingCustomerService.update(
          initialVillaBooking.customerId,
          customerData,
          manager,
        );
      }

      await manager.update(VillaBooking, id, bookingData);
    });

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.villaBookingRepository.delete(id);
  }

  private _formatVillaBookingMessage(
    booking: VillaBookingWithRelationsDto,
  ): string {
    const checkInDate = new Date(booking.checkInDate).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    });
    const checkOutDate = new Date(booking.checkOutDate).toLocaleString(
      'en-GB',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
      },
    );

    return `Thank you ${booking.customer.name} for booking with us at ${booking.villa?.name}!
  
🏡 *Villa*: ${booking.villa?.name} (${booking.villa?.secondaryName || '-'})
📍 *Address*: ${booking.villa?.address}, ${booking.villa?.city}, ${booking.villa?.state}, ${booking.villa?.country}
🗓️ *Check-in*: ${checkInDate} WIB
🗓️ *Check-out*: ${checkOutDate} WIB
👥 *Total Guests*: ${booking.totalGuest}
💵 *Total Amount*: ${booking.currency?.symbol || ''} ${Number(booking.totalAmount).toLocaleString('id-ID')}
🗺️ *Map*: ${booking.villa?.mapLink || '-'}
  
We look forward to welcoming you!`;
  }
}
