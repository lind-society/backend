import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VillaPolicy } from 'src/database/entities';
import { VillaPolicyService } from './policy.service';

@Module({
  providers: [VillaPolicyService],
  imports: [TypeOrmModule.forFeature([VillaPolicy])],
})
export class VillaPolicyModule {}
