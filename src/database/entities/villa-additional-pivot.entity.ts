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
import { Additional } from './additional.entity';
import { Villa } from './villa.entity';

@Entity({ name: 'villa_additional_pivot' })
export class VillaAdditionalPivot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'villa_id', type: 'uuid' })
  villaId!: string;

  @Column({ name: 'additional_id', type: 'uuid' })
  additionalId!: string;

  @ManyToOne(() => Villa, (villa) => villa.villaAdditionals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'villa_id' })
  villa!: Villa;

  @ManyToOne(() => Additional, (additional) => additional.villaAdditionals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'additional_id' })
  additional!: Additional;

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
