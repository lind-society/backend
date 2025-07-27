import { PaymentChannel } from '@apps/main/database/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentChannelController } from './payment-channel.controller';
import { PaymentChannelService } from './payment-channel.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentChannel])],
  controllers: [PaymentChannelController],
  providers: [PaymentChannelService],
})
export class PaymentChannelModule {}
