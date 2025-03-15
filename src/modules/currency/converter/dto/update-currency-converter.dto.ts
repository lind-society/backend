import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreateCurrencyConverterDto } from './create-currency-converter.dto';
import { CurrencyConverterDto } from './currency-converter.dto';

export class UpdateCurrencyConverterDto extends PartialType(
  CreateCurrencyConverterDto,
) {}

export class UpdateCurrencyConverterSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<CurrencyConverterDto>
{
  readonly data: CurrencyConverterDto;

  constructor(data: CurrencyConverterDto) {
    super({
      code: HttpStatus.OK,
      message: 'update currency converter success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
