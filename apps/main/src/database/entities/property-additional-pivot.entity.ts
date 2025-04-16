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
import { Property } from './property.entity';

@Entity({ name: 'property_additional_pivot' })
export class PropertyAdditionalPivot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'property_id', type: 'uuid' })
  propertyId!: string;

  @Column({ name: 'additional_id', type: 'uuid' })
  additionalId!: string;

  @ManyToOne(() => Property, (property) => property.propertyAdditionals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'property_id' })
  property!: Property;

  @ManyToOne(() => Additional, (additional) => additional.propertyAdditionals, {
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
