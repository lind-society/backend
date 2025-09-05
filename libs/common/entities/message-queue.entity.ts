import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageQueueStatus, MessageQueueType } from './shared-enum.entity';

@Entity({ name: 'message_queues', schema: 'queue' })
export class MessageQueue {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'message_queue_type',
    type: 'enum',
    enum: MessageQueueType,
    enumName: 'message_queue_type_enum',
  })
  @Index()
  type!: MessageQueueType;

  @Column()
  recipient!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({
    name: 'message_queue_status',
    type: 'enum',
    enum: MessageQueueStatus,
    enumName: 'message_queue_status_enum',
    default: MessageQueueStatus.Pending,
  })
  @Index()
  status!: MessageQueueStatus;

  @Column({ type: 'integer', default: 0 })
  retryCount!: number;

  @Column({ name: 'scheduled_at', type: 'timestamptz', nullable: true })
  @Index()
  scheduledAt!: Date | null;

  @Column({ name: 'sent_at', type: 'timestamptz', nullable: true })
  sentAt!: Date | null;

  @Column({ type: 'text', nullable: true })
  errorMessage!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

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
