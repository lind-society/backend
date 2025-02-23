import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog, BlogCategory } from 'src/database/entities';
import { BlogCategoryModule } from './blog-category/blog-category.module';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  controllers: [BlogController],
  providers: [BlogService],
  imports: [TypeOrmModule.forFeature([Blog, BlogCategory]), BlogCategoryModule],
})
export class BlogModule {}
