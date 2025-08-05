import { DefaultHttpStatus } from '@apps/main/common/enums';
import { BookingPaymentRefundStatus } from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { BookingPaymentRefundWithRelationsDto } from './booking-payment-refund.dto';

export class CreateBookingPaymentRefundDto {
  @IsString()
  @IsString()
  readonly reason: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum amount is 0' })
  @IsNotEmpty()
  readonly amount: number;

  @IsEnum(BookingPaymentRefundStatus, {
    message: `booking payment refund status must be one of: ${Object.values(BookingPaymentRefundStatus).join(', ')}`,
  })
  @IsOptional()
  readonly status?: BookingPaymentRefundStatus;

  @IsString()
  @IsOptional()
  readonly failureReason?: string;

  @IsUUID()
  @IsNotEmpty()
  readonly currencyId: string;

  @IsUUID()
  @IsNotEmpty()
  readonly bookingPaymentId: string;

  @IsString()
  @IsNotEmpty()
  readonly paymentRefundRequestReferenceId?: string;
}

export class CreateBookingPaymentRefundSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingPaymentRefundWithRelationsDto>
{
  readonly data: BookingPaymentRefundWithRelationsDto;

  constructor(data: BookingPaymentRefundWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create booking payment refund success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
