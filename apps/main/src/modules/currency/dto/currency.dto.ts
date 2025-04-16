import { Currency } from '@apps/main/database/entities';

export interface ICurrencyDto extends Currency {}

export class CurrencyDto implements ICurrencyDto {
  readonly id!: string;
  readonly code!: string;
  readonly name!: string;
  readonly symbol!: string | null;
  readonly allowDecimal!: boolean | null;
  readonly allowRound!: boolean | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date | null;
  readonly deletedAt!: Date | null;
}
