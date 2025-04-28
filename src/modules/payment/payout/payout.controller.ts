import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
} from '@nestjs/common';
import { PayoutService } from './payout.service';
import { CreatePayoutRequest } from 'xendit-node/payout/models';
import {
  GetPayoutChannelsRequest,
  GetPayoutsRequest,
} from 'xendit-node/payout/apis';

@Controller('payout')
export class PayoutController {
  constructor(private readonly payoutService: PayoutService) {}

  @Post()
  async createPayout(
    @Headers('idempotency-key') idempotencyKeyHeader: string,
    @Body() payload: CreatePayoutRequest,
  ) {
    try {
      const response = await this.payoutService.createPayout({
        idempotencyKey: idempotencyKeyHeader,
        data: payload,
      });

      return response;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get()
  async getAllPayout(@Body() payload: GetPayoutsRequest) {
    try {
      const response = await this.payoutService.getPayouts(payload);

      return response;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get('channel')
  async getPayoutChannels(@Body() payload: GetPayoutChannelsRequest) {
    try {
      const response = await this.payoutService.getPayoutChannels(payload);

      return response;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get(':id')
  async getPayout(@Param('id') payoutId: string) {
    try {
      const response = await this.payoutService.getPayoutById(payoutId);

      return response;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Delete(':id')
  async cancelPayout(@Param('id') payoutId: string) {
    try {
      const response = await this.payoutService.cancelPayout(payoutId);

      return response;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
