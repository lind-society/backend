import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { BookingCustomerDto } from './booking-customer.dto';

export class CreateBookingCustomerDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsNotEmpty()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  readonly phoneNumber!: string;
}

export class CreateBookingCustomerSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<BookingCustomerDto>
{
  readonly data: BookingCustomerDto;

  constructor(data: BookingCustomerDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create booking customer success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
