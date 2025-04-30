import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from 'src/database/entities/package.entity';
import { PackageBenefitModule } from './benefit/package-benefit.module';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';

@Module({
  controllers: [PackageController],
  providers: [PackageService],
  imports: [TypeOrmModule.forFeature([Package]), PackageBenefitModule],
})
export class PackageModule {}
