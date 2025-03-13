import { VillaPolicy, VillaPolicyType } from 'src/database/entities';
import { VillaDto } from '../../dto';

export interface IVillaPolicyDto extends Omit<VillaPolicy, 'villaPolicies'> {}

export interface IVillaPolicyWithRelationsDto extends IVillaPolicyDto {
  villas?: VillaDto[];
}

export class VillaPolicyDto implements IVillaPolicyDto {
  readonly id!: string;
  readonly name!: string;
  readonly type!: VillaPolicyType;
  readonly description!: string | null;
  readonly icon!: string | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class VillaPolicyWithRelationsDto
  extends VillaPolicyDto
  implements IVillaPolicyWithRelationsDto
{
  readonly villas?: VillaDto[];
}
