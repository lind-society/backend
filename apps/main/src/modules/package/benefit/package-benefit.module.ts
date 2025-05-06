import { PackageBenefit } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageBenefitController } from './package-benefit.controller';
import { PackageBenefitService } from './package-benefit.service';

@Module({
  controllers: [PackageBenefitController],
  providers: [PackageBenefitService],
  imports: [TypeOrmModule.forFeature([PackageBenefit])],
  exports: [PackageBenefitService],
})
export class PackageBenefitModule {}
