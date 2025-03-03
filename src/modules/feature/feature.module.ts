import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from 'src/database/entities';
import { FeatureService } from './feature.service';

@Module({
  providers: [FeatureService],
  imports: [TypeOrmModule.forFeature([Feature])],
  exports: [FeatureService],
})
export class FeatureModule {}
