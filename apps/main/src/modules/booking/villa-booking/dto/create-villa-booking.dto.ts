import { DefaultHttpStatus } from '@apps/main/common/enums';
import { VillaBookingStatus } from '@apps/main/database/entities';
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
  ValidateNested,
} from 'class-validator';
import { CreateBookingCustomerDto } from '../../customer/dto';
import { VillaBookingWithRelationsDto } from './villa-booking.dto';

export class CreateVillaBookingDto {
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

  @IsEnum(VillaBookingStatus, {
    message: `villa booking status must be one of: ${Object.values(VillaBookingStatus).join(', ')}`,
  })
  @IsNotEmpty()
  readonly status: VillaBookingStatus = VillaBookingStatus.Requested;

  @IsUUID()
  @IsNotEmpty()
  readonly currencyId!: string;

  @IsUUID()
  @IsOptional()
  readonly customerId?: string;

  @IsUUID()
  @IsOptional()
  readonly villaId?: string;

  @Type(() => CreateBookingCustomerDto)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  readonly customer!: CreateBookingCustomerDto;
}

export class CreateVillaBookinguccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaBookingWithRelationsDto>
{
  readonly data: VillaBookingWithRelationsDto;

  constructor(data: VillaBookingWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create villa booking success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
