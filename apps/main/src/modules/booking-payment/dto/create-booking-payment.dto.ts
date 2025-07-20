import { DefaultHttpStatus } from '@apps/main/common/enums';
import { BookingPaymentAvailableStatus } from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { CreatePaymentInvoiceDto } from '../../payment/dto';
import { BookingPaymentWithRelationsDto } from './booking-payment.dto';

export class CreateBookingPaymentDto {
  @IsString()
  @IsOptional()
  readonly paymentMethod?: string;

  @IsString()
  @IsOptional()
  readonly paymentChannel?: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum amount is 0' })
  @IsOptional()
  readonly amount?: number;

  @IsEnum(BookingPaymentAvailableStatus, {
    message: `booking payment status must be one of: ${Object.values(BookingPaymentAvailableStatus).join(', ')}`,
  })
  @IsOptional()
  readonly status?: BookingPaymentAvailableStatus;

  @IsString()
  @IsOptional()
  readonly paymentReferenceId: string;

  @IsUUID()
  @IsNotEmpty()
  readonly currencyId: string;

  @IsUUID()
  @IsNotEmpty()
  readonly bookingId: string;

  @Type(() => Date)
  @IsDate({ message: 'paid at must be a valid date' })
  @IsOptional()
  readonly paidAt: string;
}

export class CreateBookingPaymentWithInvoiceDto extends IntersectionType(
  CreateBookingPaymentDto,
  CreatePaymentInvoiceDto,
) {}

export class CreateBookingPaymentSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingPaymentWithRelationsDto>
{
  readonly data: BookingPaymentWithRelationsDto;

  constructor(data: BookingPaymentWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create booking customer success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
