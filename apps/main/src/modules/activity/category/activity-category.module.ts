import { ActivityCategory } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityCategoryController } from './activity-category.controller';
import { ActivityCategoryService } from './activity-category.service';

@Module({
  controllers: [ActivityCategoryController],
  providers: [ActivityCategoryService],
  imports: [TypeOrmModule.forFeature([ActivityCategory])],
  exports: [ActivityCategoryService],
})
export class ActivityCategoryModule {}
