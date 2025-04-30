import { VillaPolicyType } from 'src/database/entities/villa-policy-type.entity';
import { VillaPolicyDto } from '../../dto';

export interface IVillaPolicyTypeDto
  extends Omit<VillaPolicyType, 'policies'> {}

export interface IVillaPolicyTypeWithRelationsDto extends IVillaPolicyTypeDto {
  policies?: VillaPolicyDto[];
}

export class VillaPolicyTypeDto implements IVillaPolicyTypeDto {
  readonly id!: string;
  readonly name!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class VillaPolicyTypeWithRelationsDto
  extends VillaPolicyTypeDto
  implements IVillaPolicyTypeWithRelationsDto
{
  readonly policies?: VillaPolicyDto[];
}
