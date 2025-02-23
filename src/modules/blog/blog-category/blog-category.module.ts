import { Module } from '@nestjs/common';
import { BlogCategoryService } from './blog-category.service';
import { BlogCategoryController } from './blog-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog, BlogCategory } from 'src/database/entities';

@Module({
  controllers: [BlogCategoryController],
  providers: [BlogCategoryService],
  imports: [TypeOrmModule.forFeature([Blog, BlogCategory])],
})
export class BlogCategoryModule {}
