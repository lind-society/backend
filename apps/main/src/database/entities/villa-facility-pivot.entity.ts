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
import { Villa } from './villa.entity';

@Entity({ name: 'villa_facility_pivot' })
export class VillaFacilityPivot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'villa_id', type: 'uuid' })
  villaId!: string;

  @Column({ name: 'facility_id', type: 'uuid' })
  facilityId!: string;

  @Column({
    name: 'include_description',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  includeDescription!: boolean;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @ManyToOne(() => Villa, (villa) => villa.villaFacilities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'villa_id' })
  villa!: Villa;

  @ManyToOne(() => Facility, (facility) => facility.villaFacilities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'facility_id' })
  facility!: Facility;

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
