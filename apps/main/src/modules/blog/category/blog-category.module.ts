import { BlogCategory } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCategoryController } from './blog-category.controller';
import { BlogCategoryService } from './blog-category.service';

@Module({
  controllers: [BlogCategoryController],
  providers: [BlogCategoryService],
  imports: [TypeOrmModule.forFeature([BlogCategory])],
  exports: [BlogCategoryService],
})
export class BlogCategoryModule {}
