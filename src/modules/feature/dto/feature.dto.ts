import { Feature } from 'src/database/entities';
import { CurrencyDto } from 'src/modules/currency/dto';
import { PropertyDto } from 'src/modules/property/dto/property.dto';
import { VillaDto } from 'src/modules/villa/dto';

export interface IFeatureDto
  extends Omit<Feature, 'propertyFeatures' | 'villaFeatures' | 'currency'> {}

export interface IFeatureWithRelationsDto extends IFeatureDto {
  currency?: CurrencyDto;
  properties?: PropertyDto[];
  villas?: VillaDto[];
}

export class FeatureDto implements IFeatureDto {
  readonly id!: string;
  readonly name!: string;
  readonly icon!: string | null;
  readonly free!: boolean;
  readonly currencyId!: string | null;
  readonly price!: number | null;
  readonly list!: string[] | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class FeatureWithRelationsDto
  extends FeatureDto
  implements IFeatureWithRelationsDto
{
  readonly currency?: CurrencyDto;
  readonly properties?: PropertyDto[];
  readonly villas?: VillaDto[];
}
