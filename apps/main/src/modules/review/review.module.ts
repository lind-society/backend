import { Review } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [TypeOrmModule.forFeature([Review])],
  exports: [ReviewService],
})
export class ReviewModule {}
