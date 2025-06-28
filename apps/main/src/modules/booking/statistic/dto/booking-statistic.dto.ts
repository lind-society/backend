import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';

export class TotalBookingDto {
  readonly date?: string | null;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
  readonly total!: number;
}

export class TotalBookingPerMonthDto {
  readonly month!: number;
  readonly monthName!: string;
  readonly startDate!: string;
  readonly endDate!: string;
  readonly total!: number;
}

export class TotalBookingPerYearDto {
  readonly year!: number;
  readonly totalPerMonth!: TotalBookingPerMonthDto[];
  readonly totalPerYear!: number;
}

export class GetBookingDailySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<TotalBookingDto>
{
  readonly data: TotalBookingDto;

  constructor(data: TotalBookingDto) {
    super({
      code: HttpStatus.OK,
      message: 'get daily booking statistic success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetBookingYearlySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<TotalBookingPerYearDto>
{
  readonly data: TotalBookingPerYearDto;

  constructor(data: TotalBookingPerYearDto) {
    super({
      code: HttpStatus.OK,
      message: 'get yearly booking statistic success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetBookingDateRangeSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<TotalBookingDto>
{
  readonly data: TotalBookingDto;

  constructor(data: TotalBookingDto, type: string) {
    super({
      code: HttpStatus.OK,
      message: `get ${type} booking statistic success`,
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
