import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from 'src/database/entities';
import { CurrencyModule } from '../currency/currency.module';
import { OwnerModule } from '../owner/owner.module';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ActivityBookingModule } from './booking/activity-booking.module';
import { ActivityCategoryModule } from './category/activity-category.module';

@Module({
  controllers: [ActivityController],
  providers: [ActivityService],
  imports: [
    TypeOrmModule.forFeature([Activity]),
    ActivityBookingModule,
    ActivityCategoryModule,
    CurrencyModule,
    OwnerModule,
  ],
  exports: [ActivityService],
})
export class ActivityModule {}
