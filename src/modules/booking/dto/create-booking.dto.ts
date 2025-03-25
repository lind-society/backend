import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Min,
} from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import { BookingStatus } from 'src/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
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
  @IsNotEmpty()
  readonly customerId!: string;
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
