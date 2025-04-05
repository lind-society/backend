import { HttpStatus } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { RegexValidator } from 'src/common/decorators';
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

  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  @RegexValidator('phoneCountryCode')
  readonly phoneCountryCode!: string;

  @IsNumberString()
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
