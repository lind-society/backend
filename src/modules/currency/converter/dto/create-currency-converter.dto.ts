import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CurrencyConverterDto } from './currency-converter.dto';

export class CreateCurrencyConverterDto {
  @IsUUID()
  @IsNotEmpty()
  readonly baseCurrencyId!: string;

  @IsUUID()
  @IsNotEmpty()
  readonly targetCurrencyId!: string;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 15 },
    { message: 'exchangeRate must be a valid number' },
  )
  @IsOptional()
  readonly exchangeRate?: number;

  @IsString()
  @IsOptional()
  readonly description?: string;
}

export class CreateCurrencyConverterSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<CurrencyConverterDto>
{
  readonly data: CurrencyConverterDto;

  constructor(data: CurrencyConverterDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create currency converter success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
