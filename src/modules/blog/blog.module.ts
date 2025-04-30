import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog, BlogCategory } from 'src/database/entities';
import { AdminModule } from '../admin/admin.module';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogCategoryModule } from './category/blog-category.module';

@Module({
  controllers: [BlogController],
  providers: [BlogService],
  imports: [
    TypeOrmModule.forFeature([Blog, BlogCategory]),
    AdminModule,
    BlogCategoryModule,
  ],
})
export class BlogModule {}
