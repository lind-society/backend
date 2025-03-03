import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Additional } from 'src/database/entities';
import { AdditionalService } from './additional.service';
import { MediaModule } from './media/media.module';
import { MediaService } from './media/media.service';

@Module({
  providers: [AdditionalService],
  imports: [TypeOrmModule.forFeature([Additional]), MediaModule],
  exports: [AdditionalService, MediaService],
})
export class AdditionalModule {}
