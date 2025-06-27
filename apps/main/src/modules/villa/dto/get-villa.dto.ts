import { BestSeller, DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { VillaWithRelationsDto } from './villa.dto';

export class GetVillaBestSellerQueryDto {
  @IsEnum(BestSeller, {
    message: `get villa best seller option must be one of: ${Object.values(BestSeller).join(', ')}`,
  })
  @IsNotEmpty()
  option: BestSeller = BestSeller.Rating;

  @IsUUID()
  @IsOptional()
  baseCurrencyId?: string;
}

export class GetVillaBestSellerDto {
  readonly data!: VillaWithRelationsDto[];
}

export class GetVillaPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: VillaWithRelationsDto[];
}

export class GetVillasSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetVillaPaginateDto>
{
  readonly data: GetVillaPaginateDto;

  constructor(data: GetVillaPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get villas success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetVillaSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaWithRelationsDto>
{
  readonly data: VillaWithRelationsDto;

  constructor(data: VillaWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'get villa success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetVillaBestSellerSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetVillaBestSellerDto>
{
  readonly data: GetVillaBestSellerDto;

  constructor(data: GetVillaBestSellerDto, option: BestSeller) {
    super({
      code: HttpStatus.OK,
      message: `get villa best seller based on ${option} success`,
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
