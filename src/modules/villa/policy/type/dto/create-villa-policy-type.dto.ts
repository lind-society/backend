import { HttpStatus } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { VillaPolicyTypeWithRelationsDto } from './villa-policy-type.dto';

export class CreateVillaPolicyTypeDto {
  @Transform(({ value }) =>
    value
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  )
  @IsString()
  @IsNotEmpty()
  readonly name!: string;
}

export class CreateVillaPolicyTypeSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaPolicyTypeWithRelationsDto>
{
  readonly data: VillaPolicyTypeWithRelationsDto;

  constructor(data: VillaPolicyTypeWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create villa policy type success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
