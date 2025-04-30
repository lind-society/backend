import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  Validate,
  ValidateIf,
} from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import { OnlyOneFieldAllowedConstraint } from 'src/common/validations';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { BookingPaymentWithRelationsDto } from './booking-payment.dto';

export class CreateBookingPaymentDto {
  @IsString()
  @IsNotEmpty()
  readonly paymentMethod!: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum amount is 0' })
  @IsNotEmpty()
  readonly amount!: number;

  @IsString()
  @IsNotEmpty()
  readonly status!: string;

  @IsUUID()
  @IsNotEmpty()
  readonly currencyId!: string;

  @IsUUID()
  @IsOptional()
  readonly activityBookingId?: string;

  @IsUUID()
  @IsOptional()
  readonly villaBookingId?: string;

  @ValidateIf((o) => !o.activityBookingId && !o.villaBookingId)
  @IsNotEmpty({
    message:
      'At least one of activityBookingId or villaBookingId must be provided',
  })
  readonly _atLeastOneIdRequired?: string;

  @Validate(OnlyOneFieldAllowedConstraint, [
    'activityBookingId',
    'villaBookingId',
  ])
  readonly _onlyOneIdAllowed?: never;
}

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
