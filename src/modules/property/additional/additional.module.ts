import { Module } from '@nestjs/common';
import { AdditionalService } from './additional.service';
import { AdditionalController } from './additional.controller';
import { MediaModule } from './media/media.module';

@Module({
  controllers: [AdditionalController],
  providers: [AdditionalService],
  imports: [MediaModule],
})
export class AdditionalModule {}
