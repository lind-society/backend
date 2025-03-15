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
import { Admin } from './admin.entity';
import { BlogCategory } from './blog-category.entity';

@Entity({ name: 'blogs' })
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ name: 'author_id', type: 'uuid', nullable: true })
  authorId!: string | null;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId!: string | null;

  @ManyToOne(() => Admin, (admin) => admin.blogs, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'author_id' })
  author!: Admin | null;

  @ManyToOne(() => BlogCategory, (blogCategory) => blogCategory.blogs, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category!: BlogCategory | null;

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
