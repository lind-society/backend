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
  ValidateNested,
} from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import { ActivityBookingStatus } from 'src/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreateBookingCustomerDto } from '../../../booking/customer/dto';
import { ActivityBookingWithRelationsDto } from './activity-booking.dto';

export class CreateActivityBookingDto {
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
  @IsDate({ message: 'booking date must be a valid date' })
  @IsNotEmpty()
  readonly bookingDate!: Date;

  @IsEnum(ActivityBookingStatus, {
    message: `activity booking status must be one of: ${Object.values(ActivityBookingStatus).join(', ')}`,
  })
  @IsNotEmpty()
  readonly status: ActivityBookingStatus = ActivityBookingStatus.Pending;

  @IsUUID()
  @IsNotEmpty()
  readonly currencyId!: string;

  @IsUUID()
  @IsOptional()
  readonly customerId?: string;

  @IsUUID()
  @IsOptional()
  readonly activityId?: string;

  @Type(() => CreateBookingCustomerDto)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  readonly customer!: CreateBookingCustomerDto;
}

export class CreateActivityBookinguccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<ActivityBookingWithRelationsDto>
{
  readonly data: ActivityBookingWithRelationsDto;

  constructor(data: ActivityBookingWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create activity booking success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
