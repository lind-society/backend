import { HttpStatus } from '@nestjs/common';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
import { CurrencyDto } from './currency.dto';

export class GetCurrenciesPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: CurrencyDto[];
}

export class GetCurrenciesSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetCurrenciesPaginateDto>
{
  readonly data: GetCurrenciesPaginateDto;

  constructor(data: GetCurrenciesPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get currencies success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetCurrencySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<CurrencyDto>
{
  readonly data: CurrencyDto;

  constructor(data: CurrencyDto) {
    super({
      code: HttpStatus.OK,
      message: 'get currency success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
