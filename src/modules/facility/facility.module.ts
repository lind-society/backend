import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facility } from 'src/database/entities';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';

@Module({
  controllers: [FacilityController],
  providers: [FacilityService],
  imports: [TypeOrmModule.forFeature([Facility])],
  exports: [FacilityService],
})
export class FacilityModule {}
