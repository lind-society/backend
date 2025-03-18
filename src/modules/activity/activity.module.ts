import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from 'src/database/entities';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ActivityCategoryModule } from './category/activity-category.module';

@Module({
  controllers: [ActivityController],
  providers: [ActivityService],
  imports: [TypeOrmModule.forFeature([Activity]), ActivityCategoryModule],
})
export class ActivityModule {}
