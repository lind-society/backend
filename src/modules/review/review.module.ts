import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/database/entities';
import { ActivityModule } from '../activity/activity.module';
import { VillaModule } from '../villa/villa.module';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [TypeOrmModule.forFeature([Review]), ActivityModule, VillaModule],
  exports: [ReviewService],
})
export class ReviewModule {}
