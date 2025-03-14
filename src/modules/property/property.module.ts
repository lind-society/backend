import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from 'src/database/entities';
import { FacilityModule } from '../facility/facility.module';
import { OwnerModule } from '../owner/owner.module';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';

@Module({
  controllers: [PropertyController],
  providers: [PropertyService],
  imports: [TypeOrmModule.forFeature([Property]), FacilityModule, OwnerModule],
})
export class PropertyModule {}
