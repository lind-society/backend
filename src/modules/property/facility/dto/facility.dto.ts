import { Facility } from 'src/database/entities';
import { FacilityCategoryDto } from '../facility-category/dto';

export interface IFacilityDto extends Omit<Facility, 'facilityCategories'> {}

export interface IFacilityWithRelationsDto extends IFacilityDto {
  categories?: FacilityCategoryDto[];
}

export class FacilityDto implements IFacilityDto {
  readonly id!: string;
  readonly name!: string;
  readonly icon!: string;
  readonly additionalPrice!: number;
  readonly description!: any;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class FacilityWithRelationsDto
  extends FacilityDto
  implements IFacilityWithRelationsDto
{
  readonly categories?: FacilityCategoryDto[];
}
