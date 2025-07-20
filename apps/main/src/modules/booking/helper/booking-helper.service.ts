import {
  constructFrontendUrl,
  constructPhoneNumber,
  constructReadableDate,
} from '@apps/main/common/helpers';
import { Booking, BookingType } from '@apps/main/database/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreatePaymentInvoiceDto } from '../../payment/dto';
import {
  PaymentAvailableCurrency,
  PaymentAvailableCustomerType,
  PaymentAvailableItemType,
} from '../../payment/enum';
import { BookingDto, BookingWithRelationsDto } from '../dto';

@Injectable()
export class BookingHelperService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async validateBookingExist(
    bookingId: string,
    entityManager?: EntityManager,
  ): Promise<void> {
    const condition = {
      where: { id: bookingId },
    };

    const bookingExist = entityManager
      ? await entityManager.exists(Booking, condition)
      : await this.bookingRepository.exists(condition);

    if (!bookingExist) {
      throw new NotFoundException('booking not found');
    }
  }

  async getBookingDetailById(
    bookingId: string,
    entityManager?: EntityManager,
  ): Promise<BookingDto> {
    const condition = {
      select: { id: true, currencyId: true },
      where: { id: bookingId },
    };

    const booking = entityManager
      ? await entityManager.findOne(Booking, condition)
      : await this.bookingRepository.findOne(condition);

    if (!booking) {
      throw new NotFoundException('booking not found');
    }

    return booking;
  }

  mapBookingToInvoiceRequestDto(
    bookingDto: BookingWithRelationsDto,
  ): CreatePaymentInvoiceDto {
    const bookingName =
      bookingDto.type === BookingType.Activity
        ? bookingDto.activity.name
        : bookingDto.villa.name;
    const bookingDescription =
      bookingDto.type === BookingType.Activity
        ? this._constructActivityInvoicePaymentDescription(bookingDto)
        : this._constructVillaInvoicePaymentDescription(bookingDto);
    const baseRedirectUrl = constructFrontendUrl();
    const phoneNumber = constructPhoneNumber(
      bookingDto.customer.phoneCountryCode,
      bookingDto.customer.phoneNumber,
    );

    return {
      externalId: `${bookingDto.id}_${Date.now()}`,
      amount: bookingDto.totalAmount,
      currency:
        bookingDto.currency.code.toUpperCase() as PaymentAvailableCurrency,
      description: bookingDescription,
      customer: {
        referenceId: crypto.randomUUID(),
        type: PaymentAvailableCustomerType.Individual,
        individualDetail: {
          givenNames: bookingDto.customer.name,
        },
      },
      items: [
        {
          name: bookingName,
          type:
            bookingDto.type === BookingType.Activity
              ? PaymentAvailableItemType.PhysicalService
              : PaymentAvailableItemType.PhysicalProduct,
          quantity: bookingDto.totalGuest,
          netUnitAmount: bookingDto.totalAmount,
          category: bookingDto.type,
        },
      ],
      invoiceDuration: 3600,
      successRedirectUrl: `${baseRedirectUrl}/${bookingDto.id}/success`,
      failureRedirectUrl: `${baseRedirectUrl}/${bookingDto.id}/fail`,
    };
  }

  private _constructActivityInvoicePaymentDescription(
    bookingDto: BookingWithRelationsDto,
  ): string {
    const bookingTargetName =
      bookingDto.type === BookingType.Activity
        ? bookingDto.activity.name
        : bookingDto.villa.name;

    return `Payment for booking ${bookingDto.type} ${bookingTargetName} in ${constructReadableDate(bookingDto.bookingDate)} by ${bookingDto.customer.name}`;
  }

  private _constructVillaInvoicePaymentDescription(
    bookingDto: BookingWithRelationsDto,
  ): string {
    const bookingTargetName =
      bookingDto.type === BookingType.Activity
        ? bookingDto.activity.name
        : bookingDto.villa.name;

    return `Payment for booking ${bookingDto.type} ${bookingTargetName} in ${constructReadableDate(bookingDto.checkInDate)} - ${constructReadableDate(bookingDto.checkOutDate)} by ${bookingDto.customer.name}`;
  }
}
