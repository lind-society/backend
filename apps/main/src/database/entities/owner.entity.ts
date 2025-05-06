import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Activity } from './activity.entity';
import { Property } from './property.entity';
import { Villa } from './villa.entity';

export enum OwnerType {
  Private = 'private',
  Company = 'company',
}

export enum OwnerStatus {
  Active = 'active',
  Inactive = 'inactive',
}

@Entity({ name: 'owners' })
export class Owner {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: OwnerType })
  type!: OwnerType;

  @Column({ name: 'company_name' })
  companyName!: string;

  @Column()
  email!: string;

  @Column({ name: 'phone_country_code' })
  phoneCountryCode!: string;

  @Column({ name: 'phone_number' })
  phoneNumber!: string;

  @Column()
  address!: string;

  @Column({ nullable: true })
  website!: string | null;

  @Column({ type: 'enum', enum: OwnerStatus })
  status!: OwnerStatus;

  @OneToMany(() => Activity, (property) => property.owner)
  activities!: Activity[];

  @OneToMany(() => Property, (property) => property.owner)
  properties!: Property[];

  @OneToMany(() => Villa, (villa) => villa.owner)
  villas!: Villa[];

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
