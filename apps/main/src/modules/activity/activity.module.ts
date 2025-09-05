import { Activity } from '@apps/main/database/entities';
import { ActivityView } from '@apps/main/database/entities/views/activity.view.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingModule } from '../booking/booking.module';
import { CurrencyModule } from '../currency/currency.module';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

@Module({
  controllers: [ActivityController],
  providers: [ActivityService],
  imports: [
    TypeOrmModule.forFeature([Activity, ActivityView]),
    BookingModule,
    CurrencyModule,
  ],
  exports: [ActivityService],
})
export class ActivityModule {}
