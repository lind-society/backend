import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { CurrencyDto } from './currency.dto';

export class CreateCurrencyDto {
  @IsString()
  @Length(3, 3)
  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase())
  readonly code!: string;

  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @Length(1, 5)
  @IsOptional()
  readonly symbol?: string;

  @IsBoolean()
  @IsOptional()
  readonly allowDecimal!: boolean;

  @IsBoolean()
  @IsOptional()
  readonly allowRound!: boolean;
}

export class CreateCurrencySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<CurrencyDto>
{
  readonly data: CurrencyDto;

  constructor(data: CurrencyDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create currency success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
