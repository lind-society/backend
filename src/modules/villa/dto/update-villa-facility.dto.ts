import { PartialType } from '@nestjs/mapped-types';
import { CreateVillaFacililtyDto } from './create-villa-facility.dto';

export class UpdateVillaFacililtyDto extends PartialType(
  CreateVillaFacililtyDto,
) {}
