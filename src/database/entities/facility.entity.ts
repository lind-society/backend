import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FacilityCategoryPivot } from './facility-category-pivot.entity';

@Entity()
export class Facility {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  icon!: string | null;

  @Column({ name: 'additional_price', type: 'decimal', nullable: true })
  additionalPrice!: number | null;

  @Column({ type: 'jsonb', nullable: true })
  description!: any | null;

  @OneToMany(
    () => FacilityCategoryPivot,
    (facilityCategoryPivot) => facilityCategoryPivot.facility,
  )
  facilityCategories!: FacilityCategoryPivot[];

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
