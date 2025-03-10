import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Feature } from './feature.entity';
import { Villa } from './villa.entity';

@Entity({ name: 'villa_feature_pivot' })
export class VillaFeaturePivot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'villa_id', type: 'uuid' })
  villaId!: string;

  @Column({ name: 'feature_id', type: 'uuid' })
  featureId!: string;

  @ManyToOne(() => Villa, (villa) => villa.villaFeatures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'villa_id' })
  villa!: Villa;

  @ManyToOne(() => Feature, (feature) => feature.villaFeatures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'feature_id' })
  feature!: Feature;

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
