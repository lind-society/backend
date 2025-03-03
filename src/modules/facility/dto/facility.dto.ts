import { Facility } from 'src/database/entities';
import { PropertyDto } from 'src/modules/property/dto/property.dto';

export interface IFacilityDto extends Omit<Facility, 'propertyFacilities'> {}

export interface IFacilityWithRelationsDto extends IFacilityDto {
  properties?: PropertyDto[];
}

export class FacilityDto implements IFacilityDto {
  readonly id!: string;
  readonly name!: string;
  readonly icon!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class FacilityWithRelationsDto
  extends FacilityDto
  implements IFacilityWithRelationsDto
{
  readonly properties?: PropertyDto[];
}
