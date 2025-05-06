import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { CreateVillaPriceRuleDto } from './create-villa-price-rule.dto';
import { VillaPriceRuleWithRelationsDto } from './villa-price-rule.dto';

export class UpdateVillaPriceRuleDto extends PartialType(
  CreateVillaPriceRuleDto,
) {}

export class UpdateVillaPriceRuleSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaPriceRuleWithRelationsDto>
{
  readonly data: VillaPriceRuleWithRelationsDto;

  constructor(data: VillaPriceRuleWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'update villa price rule success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
