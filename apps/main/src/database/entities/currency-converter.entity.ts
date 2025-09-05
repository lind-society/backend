import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Currency } from './currency.entity';

@Entity({ name: 'currency_converters' })
@Unique(['baseCurrencyId', 'targetCurrencyId'])
export class CurrencyConverter {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'base_currency_id', type: 'uuid', nullable: true })
  baseCurrencyId!: string;

  @Column({ name: 'target_currency_id', type: 'uuid', nullable: true })
  targetCurrencyId!: string;

  @Column({ name: 'exchange_rate', type: 'decimal', precision: 20, scale: 15 })
  exchangeRate!: number;

  @Column({ nullable: true })
  description!: string | null;

  @ManyToOne(() => Currency, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'base_currency_id' })
  baseCurrency!: Currency;

  @ManyToOne(() => Currency, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'target_currency_id' })
  targetCurrency!: Currency;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    select: false,
  })
  deletedAt!: Date | null;
}
