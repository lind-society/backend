import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';

export class ConvertedPriceRequestDto {
  @IsUUID()
  @IsNotEmpty()
  readonly baseCurrencyId!: string;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 15 },
    { message: 'price must be a valid number' },
  )
  @IsNotEmpty()
  readonly basePrice!: number;

  @IsUUID()
  @IsNotEmpty()
  readonly targetCurrencyId!: string;
}

export class ConvertedPriceResponsetDto {
  readonly initial: priceDetailDto;
  readonly converted: priceDetailDto;
}

export class priceDetailDto {
  readonly price!: number;
  readonly currencyId: string;
  readonly currencyCode!: string;
  readonly currencyName!: string;
  readonly currencySymbol!: string;
}

export class ConvertedPriceSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<ConvertedPriceResponsetDto>
{
  readonly data: ConvertedPriceResponsetDto;

  constructor(data: ConvertedPriceResponsetDto) {
    super({
      code: HttpStatus.OK,
      message: 'convert price to base price success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
