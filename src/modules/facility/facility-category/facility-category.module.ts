import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilityCategory } from 'src/database/entities';
import { FacilityCategoryController } from './facility-category.controller';
import { FacilityCategoryService } from './facility-category.service';

@Module({
  controllers: [FacilityCategoryController],
  providers: [FacilityCategoryService],
  imports: [TypeOrmModule.forFeature([FacilityCategory])],
})
export class FacilityCategoryModule {}
