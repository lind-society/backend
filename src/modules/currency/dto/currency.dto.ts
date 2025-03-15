import { Currency } from 'src/database/entities';

export interface ICurrencyDto extends Currency {}

export class CurrencyDto implements ICurrencyDto {
  readonly id!: string;
  readonly code!: string;
  readonly name!: string;
  readonly symbol!: string | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}
