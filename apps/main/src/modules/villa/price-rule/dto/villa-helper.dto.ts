import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
  PaginationQueryDto,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export interface IPriceRuleFilterDate {
  startDate: Date;
  endDate: Date;
}

export interface IAvailableVilla {
  id: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface IAvailableVillaWithPriceRule {
  id: string;
  name: string;
  priceRuleStartDate?: string | null;
  priceRuleEndDate?: string | null;
}

export interface IUnavailableVilla {
  id: string;
}

export interface IUnavailableVillas {
  ids?: string[];
}

export class PriceRuleFilterDateDto implements IPriceRuleFilterDate {
  @Type(() => Date)
  @IsDate({ message: 'start date must be a valid date' })
  @IsNotEmpty()
  readonly startDate!: Date;

  @Type(() => Date)
  @IsDate({ message: 'end date must be a valid date' })
  @IsNotEmpty()
  readonly endDate!: Date;
}

export class GetVillaWithPriceRuleDto
  extends PaginationQueryDto
  implements IPriceRuleFilterDate
{
  @Transform(({ value }) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  })
  @Type(() => Date)
  @IsDate({ message: 'start date must be a valid date' })
  @IsNotEmpty()
  readonly startDate!: Date;

  @Transform(({ value }) => {
    const date = new Date(value);
    date.setHours(23, 59, 59, 999);
    return date;
  })
  @Type(() => Date)
  @IsDate({ message: 'end date must be a valid date' })
  @IsNotEmpty()
  readonly endDate!: Date;
}

export class GetUnavailableVillaDto
  extends PriceRuleFilterDateDto
  implements IUnavailableVillas
{
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

export class AvailableVillaDto implements IAvailableVilla {
  readonly id!: string;
  readonly name!: string;
  readonly city!: string;
  readonly state!: string;
  readonly country!: string;
}

export class GetAvailableVillaPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: AvailableVillaDto[];
}

export class GetAvailableVillaSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetAvailableVillaPaginateDto>
{
  readonly data: GetAvailableVillaPaginateDto;

  constructor(data: GetAvailableVillaPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get available villa success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
