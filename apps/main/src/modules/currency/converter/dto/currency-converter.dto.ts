import { CurrencyConverter } from '@apps/main/database/entities';
import { CurrencyDto } from '../../dto';

export interface ICurrencyConverterDto
  extends Omit<CurrencyConverter, 'baseCurrency' | 'targetCurrency'> {}

export interface ICurrencyConverterWithRelationDto
  extends ICurrencyConverterDto {
  baseCurrency?: CurrencyDto;
  targetCurrency?: CurrencyDto;
}

export class CurrencyConverterDto implements ICurrencyConverterDto {
  readonly id!: string;
  readonly baseCurrencyId!: string;
  readonly targetCurrencyId!: string;
  readonly exchangeRate!: number;
  readonly description!: string | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}

export class CurrencyConverterWithRelationDto
  extends CurrencyConverterDto
  implements ICurrencyConverterWithRelationDto
{
  readonly baseCurrency?: CurrencyDto;
  readonly targetCurrency?: CurrencyDto;
}
