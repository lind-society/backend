import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/database/entities';
import { VillaModule } from '../villa/villa.module';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [TypeOrmModule.forFeature([Review]), VillaModule],
  exports: [ReviewService],
})
export class ReviewModule {}
