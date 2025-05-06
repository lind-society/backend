import { VillaPolicyType } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VillaPolicyTypeController } from './villa-policy-type.controller';
import { VillaPolicyTypeService } from './villa-policy-type.service';

@Module({
  controllers: [VillaPolicyTypeController],
  providers: [VillaPolicyTypeService],
  imports: [TypeOrmModule.forFeature([VillaPolicyType])],
  exports: [VillaPolicyTypeService],
})
export class VillaPolicyTypeModule {}
