import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Villa } from 'src/database/entities';
import { VillaPolicyModule } from './policy/policy.module';
import { VillaController } from './villa.controller';
import { VillaService } from './villa.service';

@Module({
  controllers: [VillaController],
  providers: [VillaService],
  imports: [TypeOrmModule.forFeature([Villa]), VillaPolicyModule],
})
export class VillaModule {}
