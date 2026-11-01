import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum InquiryType {
  Contact = 'contact',
  Villa = 'villa',
  Property = 'property',
  Activity = 'activity',
  EarlyBird = 'early_bird',
  ManageProperty = 'manage_property',
}

export enum InquiryStatus {
  New = 'new',
  Read = 'read',
  Archived = 'archived',
}

/**
 * A message a visitor leaves on the public site (contact page, "send inquiry"
 * on a villa or property, early-bird and property-management requests).
 * Bookings have their own table; this is for conversations that are not yet one.
 */
@Entity({ name: 'inquiries' })
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'enum', enum: InquiryType })
  type!: InquiryType;

  @Index()
  @Column({ type: 'enum', enum: InquiryStatus, default: InquiryStatus.New })
  status!: InquiryStatus;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone!: string | null;

  @Column({ type: 'text', nullable: true })
  message!: string | null;

  /** The villa/property/activity the visitor was looking at, when there is one. */
  @Column({ name: 'reference_id', type: 'uuid', nullable: true })
  referenceId!: string | null;

  @Column({
    name: 'reference_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  referenceName!: string | null;

  /** Form-specific extras: dates, guest count, topic, package, ... */
  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
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
