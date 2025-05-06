import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { VillaPriceRuleDto } from './villa-price-rule.dto';

export class GetVillaPriceRulePaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: VillaPriceRuleDto[];
}

export class GetVillaPriceRulesSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetVillaPriceRulePaginateDto>
{
  readonly data: GetVillaPriceRulePaginateDto;

  constructor(data: GetVillaPriceRulePaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get villa price rules success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetVillaPriceRuleSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaPriceRuleDto>
{
  readonly data: VillaPriceRuleDto;

  constructor(data: VillaPriceRuleDto) {
    super({
      code: HttpStatus.OK,
      message: 'get villa price rule success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
