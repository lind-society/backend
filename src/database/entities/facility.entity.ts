import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PropertyFacilityPivot } from './property-facility-pivot.entity';
import { VillaFacilityPivot } from './villa-facility-pivot.entity';

export enum FacilityType {
  Main = 'main',
  Optional = 'optional',
}

@Entity({ name: 'facilities' })
export class Facility {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  icon!: string | null;

  @Column({
    type: 'enum',
    enum: FacilityType,
    default: FacilityType.Optional,
  })
  type!: FacilityType;

  @OneToMany(
    () => PropertyFacilityPivot,
    (propertyFacilityPivot) => propertyFacilityPivot.facility,
  )
  propertyFacilities!: PropertyFacilityPivot[];

  @OneToMany(
    () => VillaFacilityPivot,
    (villaFacilityPivot) => villaFacilityPivot.facility,
  )
  villaFacilities!: VillaFacilityPivot[];

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
