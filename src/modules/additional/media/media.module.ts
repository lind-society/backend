import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from 'src/database/entities';
import { MediaService } from './media.service';

@Module({
  providers: [MediaService],
  imports: [TypeOrmModule.forFeature([Media])],
})
export class MediaModule {}
