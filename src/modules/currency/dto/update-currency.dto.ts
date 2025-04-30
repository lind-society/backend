import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreateCurrencyDto } from './create-currency.dto';
import { CurrencyDto } from './currency.dto';

export class UpdateCurrencyDto extends PartialType(CreateCurrencyDto) {}

export class UpdateCurrencySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<CurrencyDto>
{
  readonly data: CurrencyDto;

  constructor(data: CurrencyDto) {
    super({
      code: HttpStatus.OK,
      message: 'update currency success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
