import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageBenefit } from 'src/database/entities/package-benefit.entity';
import { PackageBenefitController } from './package-benefit.controller';
import { PackageBenefitService } from './package-benefit.service';

@Module({
  controllers: [PackageBenefitController],
  providers: [PackageBenefitService],
  imports: [TypeOrmModule.forFeature([PackageBenefit])],
  exports: [PackageBenefitService],
})
export class PackageBenefitModule {}
