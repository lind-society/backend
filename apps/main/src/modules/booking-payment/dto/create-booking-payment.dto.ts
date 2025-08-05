import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  BookingPaymentAvailableStatus,
  BookingPaymentFailureStage,
} from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
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

  @IsEnum(BookingPaymentFailureStage, {
    message: `booking payment failure stage must be one of: ${Object.values(BookingPaymentFailureStage).join(', ')}`,
  })
  @IsOptional()
  readonly failureStage?: BookingPaymentFailureStage;

  @IsString()
  @IsOptional()
  readonly failureReason?: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum refunded amount is 0' })
  @IsOptional()
  readonly refundedAmount?: number;

  @IsString()
  @IsOptional()
  readonly refundedReason?: string;

  @IsString()
  @IsOptional()
  readonly cancelledReason?: string;

  @IsString()
  @IsOptional()
  readonly paymentReferenceId?: string;

  @IsString()
  @IsOptional()
  readonly paymentRequestReferenceId?: string;

  @IsString()
  @IsOptional()
  readonly paymentSessionReferenceId?: string;

  @IsString()
  @IsOptional()
  readonly paymentTokenReferenceId?: string;

  @IsString()
  @IsOptional()
  readonly paymentRefundReferenceId?: string;

  @IsUUID()
  @IsOptional()
  readonly currencyId: string;

  @IsUUID()
  @IsOptional()
  readonly bookingId: string;

  @Type(() => Date)
  @IsDate({ message: 'paid at must be a valid date' })
  @IsOptional()
  readonly paidAt: Date;

  @Type(() => Date)
  @IsDate({ message: 'refunded at must be a valid date' })
  @IsOptional()
  readonly refundedAt: Date;

  @Type(() => Date)
  @IsDate({ message: 'cancelled at must be a valid date' })
  @IsOptional()
  readonly cancelledAt: Date;
}

export class CreateBookingPaymentSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingPaymentWithRelationsDto>
{
  readonly data: BookingPaymentWithRelationsDto;

  constructor(data: BookingPaymentWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create booking payment success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
