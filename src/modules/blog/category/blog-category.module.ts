import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCategory } from 'src/database/entities';
import { BlogCategoryController } from './blog-category.controller';
import { BlogCategoryService } from './blog-category.service';

@Module({
  controllers: [BlogCategoryController],
  providers: [BlogCategoryService],
  imports: [TypeOrmModule.forFeature([BlogCategory])],
  exports: [BlogCategoryService],
})
export class BlogCategoryModule {}
