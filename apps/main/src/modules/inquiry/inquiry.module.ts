import { Inquiry } from '@apps/main/database/entities';
import { MailClientModule } from '@libs/mail-client';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry]), MailClientModule],
  controllers: [InquiryController],
  providers: [InquiryService],
})
export class InquiryModule {}
