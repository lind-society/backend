import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Villa } from 'src/database/entities';
import { FacilityModule } from '../facility/facility.module';
import { OwnerModule } from '../owner/owner.module';
import { VillaController } from './villa.controller';
import { VillaService } from './villa.service';

@Module({
  controllers: [VillaController],
  providers: [VillaService],
  imports: [TypeOrmModule.forFeature([Villa]), FacilityModule, OwnerModule],
  exports: [VillaService],
})
export class VillaModule {}
