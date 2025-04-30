import { PartialType } from '@nestjs/mapped-types';
import { CreateVillaFacililtyPivotDto } from './create-villa-facility-pivot.dto';

export class UpdateVillaFacililtyPivotDto extends PartialType(
  CreateVillaFacililtyPivotDto,
) {}
