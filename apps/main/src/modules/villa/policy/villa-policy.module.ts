import { VillaPolicy } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VillaPolicyTypeModule } from './type/villa-policy-type.module';
import { VillaPolicyController } from './villa-policy-controller';
import { VillaPolicyService } from './villa-policy.service';

@Module({
  controllers: [VillaPolicyController],
  providers: [VillaPolicyService],
  imports: [TypeOrmModule.forFeature([VillaPolicy]), VillaPolicyTypeModule],
  exports: [VillaPolicyTypeModule],
})
export class VillaPolicyModule {}
