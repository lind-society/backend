import { DefaultHttpStatus } from '@apps/main/common/enums';
import { OnlyOneFieldAllowedConstraint } from '@apps/main/common/validations';
import { BookingStatus } from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateBookingCustomerDto } from '../customer/dto';
import { BookingWithRelationsDto } from './booking.dto';

export class CreateBookingDto {
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'total guest must be a valid number' },
  )
  @Min(1, { message: 'minimum total guest is 1' })
  @IsNotEmpty()
  readonly totalGuest!: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0, { message: 'minimum total amount is 0' })
  @IsNotEmpty()
  readonly totalAmount!: number;

  @Type(() => Date)
  @IsDate({ message: 'check in date must be a valid date' })
  @IsNotEmpty()
  readonly checkInDate!: Date;

  @Type(() => Date)
  @IsDate({ message: 'check in date must be a valid date' })
  @IsNotEmpty()
  readonly checkOutDate!: Date;

  @IsEnum(BookingStatus, {
    message: `booking status must be one of: ${Object.values(BookingStatus).join(', ')}`,
  })
  @IsNotEmpty()
  readonly status!: BookingStatus;

  @IsUUID()
  @IsNotEmpty()
  readonly currencyId!: string;

  @IsUUID()
  @IsOptional()
  readonly customerId?: string;

  @IsUUID()
  @IsOptional()
  readonly activityId?: string;

  @IsUUID()
  @IsOptional()
  readonly villaId?: string;

  @Type(() => CreateBookingCustomerDto)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  readonly customer!: CreateBookingCustomerDto;

  @ValidateIf((o) => !o.activityId && !o.villaId)
  @IsNotEmpty({
    message: 'At least one of activityId or villaId must be provided',
  })
  readonly _atLeastOneIdRequired?: string;

  @Validate(OnlyOneFieldAllowedConstraint, ['activityId', 'villaId'])
  readonly _onlyOneIdAllowed?: never;
}

export class CreateBookinguccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingWithRelationsDto>
{
  readonly data: BookingWithRelationsDto;

  constructor(data: BookingWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create booking success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
