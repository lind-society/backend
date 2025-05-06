import { VillaPolicy } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VillaPolicyTypeModule } from './type/villa-policy-type.module';
import { VillaPolicyService } from './villa-policy.service';

@Module({
  providers: [VillaPolicyService],
  imports: [TypeOrmModule.forFeature([VillaPolicy]), VillaPolicyTypeModule],
  exports: [VillaPolicyTypeModule],
})
export class VillaPolicyModule {}
