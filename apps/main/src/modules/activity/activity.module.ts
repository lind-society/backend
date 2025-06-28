import { Activity } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingModule } from '../booking/booking.module';
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
    BookingModule,
    CurrencyModule,
    OwnerModule,
  ],
  exports: [ActivityService],
})
export class ActivityModule {}
