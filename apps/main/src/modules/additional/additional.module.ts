import { Additional } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdditionalService } from './additional.service';

@Module({
  providers: [AdditionalService],
  imports: [TypeOrmModule.forFeature([Additional])],
  exports: [AdditionalService],
})
export class AdditionalModule {}
