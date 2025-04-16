import { Review } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityModule } from '../activity/activity.module';
import { PropertyModule } from '../property/property.module';
import { VillaModule } from '../villa/villa.module';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [
    TypeOrmModule.forFeature([Review]),
    ActivityModule,
    PropertyModule,
    VillaModule,
  ],
  exports: [ReviewService],
})
export class ReviewModule {}
