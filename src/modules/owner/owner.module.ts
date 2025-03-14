import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from 'src/database/entities';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';

@Module({
  controllers: [OwnerController],
  providers: [OwnerService],
  imports: [TypeOrmModule.forFeature([Owner])],
  exports: [OwnerService],
})
export class OwnerModule {}
