import { VillaPolicy } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VillaPolicyService } from './villa-policy.service';

@Module({
  providers: [VillaPolicyService],
  imports: [TypeOrmModule.forFeature([VillaPolicy])],
})
export class VillaPolicyModule {}
