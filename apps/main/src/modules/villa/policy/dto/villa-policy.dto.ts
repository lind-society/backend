import { VillaPolicy } from '@apps/main/database/entities';
import { IconDto } from '@apps/main/modules/shared/dto';
import { VillaDto } from '../../dto';

export interface IVillaPolicyDto
  extends Omit<VillaPolicy, 'villaPolicies' | 'type'> {}

export interface IVillaPolicyWithRelationsDto extends IVillaPolicyDto {
  villas?: VillaDto[];
}

export class VillaPolicyDto implements IVillaPolicyDto {
  readonly id!: string;
  readonly name!: string;
  readonly typeId!: string;
  readonly description!: string | null;
  readonly icon!: IconDto | null;
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
