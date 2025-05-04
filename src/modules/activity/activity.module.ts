import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from 'src/database/entities';
import { ActivityBookingModule } from '../booking/activity-booking/activity-booking.module';
import { CurrencyModule } from '../currency/currency.module';
import { OwnerModule } from '../owner/owner.module';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ActivityCategoryModule } from './category/activity-category.module';

@Module({
  controllers: [ActivityController],
  providers: [ActivityService],
  imports: [
    TypeOrmModule.forFeature([Activity]),
    ActivityCategoryModule,
    ActivityBookingModule,
    CurrencyModule,
    OwnerModule,
  ],
  exports: [ActivityService],
})
export class ActivityModule {}
