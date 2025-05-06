import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export interface IAvailableVillaWithPriceRule {
  id: string;
  name: string;
  priceRuleStartDate?: string | null;
  priceRuleEndDate?: string | null;
}

export interface IUnavailableVilla {
  id: string;
}

export class GetVillaWithPriceRuleDto {
  @Type(() => Date)
  @IsDate({ message: 'start date must be a valid date' })
  @IsNotEmpty()
  readonly startDate!: Date;

  @Type(() => Date)
  @IsDate({ message: 'end date must be a valid date' })
  @IsNotEmpty()
  readonly endDate!: Date;
}

export class GetUnavailableVillaDto extends GetVillaWithPriceRuleDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly ids?: string[];
}

export class VillaWithPriceRuleDto implements IAvailableVillaWithPriceRule {
  readonly id!: string;
  readonly name!: string;
  readonly priceRuleStartDate?: string | null;
  readonly priceRuleEndDate?: string | null;
}

export class UnavailableVillaDto implements IUnavailableVilla {
  readonly id!: string;
}

export class GetAvailableVillaSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaWithPriceRuleDto[]>
{
  readonly data: VillaWithPriceRuleDto[];

  constructor(data: VillaWithPriceRuleDto[]) {
    super({
      code: HttpStatus.OK,
      message: 'get available villa success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
