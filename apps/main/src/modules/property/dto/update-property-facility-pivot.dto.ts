import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyFacililtyPivotDto } from './create-property-facility-pivot.dto';

export class UpdatePropertyFacililtyPivotDto extends PartialType(
  CreatePropertyFacililtyPivotDto,
) {}
