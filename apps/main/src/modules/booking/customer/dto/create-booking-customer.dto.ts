import {
  PhoneNumberValidator,
  RegexValidator,
} from '@apps/main/common/decorators';
import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { BookingCustomerDto } from './booking-customer.dto';

export class CreateBookingCustomerDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  @IsString()
  @RegexValidator('phoneCountryCode')
  @IsNotEmpty()
  readonly phoneCountryCode!: string;

  @IsNumberString()
  @RegexValidator('phoneNumber')
  @PhoneNumberValidator('phoneCountryCode')
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
