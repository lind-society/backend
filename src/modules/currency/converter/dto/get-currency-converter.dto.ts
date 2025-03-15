import { HttpStatus } from '@nestjs/common';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
import { CurrencyConverterDto } from './currency-converter.dto';

export class GetCurrencyConvertersPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: CurrencyConverterDto[];
}

export class GetCurrencyConvertersSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetCurrencyConvertersPaginateDto>
{
  readonly data: GetCurrencyConvertersPaginateDto;

  constructor(data: GetCurrencyConvertersPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get currency converters success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetCurrencyConverterSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<CurrencyConverterDto>
{
  readonly data: CurrencyConverterDto;

  constructor(data: CurrencyConverterDto) {
    super({
      code: HttpStatus.OK,
      message: 'get currency converter success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
