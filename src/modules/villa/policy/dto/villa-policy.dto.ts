import { VillaPolicy } from 'src/database/entities';
import { PropertyDto } from 'src/modules/property/dto';

export interface IVillaPolicyDto extends Omit<VillaPolicy, 'villaPolicies'> {}

export interface IVillaPolicyWithRelationsDto extends IVillaPolicyDto {
  properties?: PropertyDto[];
}

export class VillaPolicyDto implements IVillaPolicyDto {
  readonly id!: string;
  readonly name!: string;
  readonly icon!: string | null;
  readonly list!: string[] | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class VillaPolicyWithRelationsDto
  extends VillaPolicyDto
  implements IVillaPolicyWithRelationsDto
{
  readonly properties?: PropertyDto[];
}
