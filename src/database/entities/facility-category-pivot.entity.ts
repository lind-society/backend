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
import { Facility } from './facility.entity';
import { FacilityCategory } from './facility-category.entity';

@Entity()
export class FacilityCategoryPivot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Facility, (facility) => facility.facilityCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'facility_id' })
  facility!: Facility;

  @Column({ name: 'facility_id', type: 'uuid' })
  facilityId!: string;

  @ManyToOne(
    () => FacilityCategory,
    (facilityCategory) => facilityCategory.facilityCategories,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'facility_category_id' })
  facilityCategory!: FacilityCategory;

  @Column({ name: 'facility_category_id', type: 'uuid' })
  facilityCategoryId!: string;

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
