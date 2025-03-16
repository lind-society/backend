import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';

export class ConvertPriceToBasePriceRequestDto {
  @IsUUID()
  @IsNotEmpty()
  readonly priceCurrencyId!: string;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 15 },
    { message: 'price must be a valid number' },
  )
  @IsNotEmpty()
  readonly price!: number;

  @IsUUID()
  @IsNotEmpty()
  readonly baseCurrencyId!: string;
}

export class ConvertPriceToBasePriceResponsetDto {
  readonly basePrice!: number;
  readonly basePriceCode!: string | null;
  readonly basePriceName!: string | null;
  readonly basePriceSymbol!: string | null;
}

export class ConvertPriceToBasePriceSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<ConvertPriceToBasePriceResponsetDto>
{
  readonly data: ConvertPriceToBasePriceResponsetDto;

  constructor(data: ConvertPriceToBasePriceResponsetDto) {
    super({
      code: HttpStatus.OK,
      message: 'convert price to base price success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
