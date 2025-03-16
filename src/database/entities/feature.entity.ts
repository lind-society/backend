import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Currency } from './currency.entity';
import { PropertyFeaturePivot } from './property-feature-pivot.entity';
import { VillaFeaturePivot } from './villa-feature-pivot.entity';

@Entity({ name: 'features' })
export class Feature {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  icon!: string | null;

  @Column()
  free!: boolean;

  @Column({ name: 'currency_id', type: 'uuid', nullable: true })
  currencyId!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price!: number | null;

  @Column({ type: 'varchar', array: true, nullable: true })
  list!: string[] | null;

  @OneToMany(
    () => PropertyFeaturePivot,
    (propertyFeaturePivot) => propertyFeaturePivot.feature,
  )
  propertyFeatures!: PropertyFeaturePivot[];

  @OneToMany(
    () => VillaFeaturePivot,
    (villaFeaturePivot) => villaFeaturePivot.feature,
  )
  villaFeatures!: VillaFeaturePivot[];

  @ManyToOne(() => Currency, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'currency_id' })
  currency!: Currency;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt!: Date | null;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    select: false,
  })
  deletedAt!: Date | null;
}
