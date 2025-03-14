import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyFacililtyDto } from './create-property-facility.dto';

export class UpdatePropertyFacililtyDto extends PartialType(
  CreatePropertyFacililtyDto,
) {}
