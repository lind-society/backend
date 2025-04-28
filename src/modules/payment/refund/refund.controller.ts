import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
} from '@nestjs/common';
import { RefundService } from './refund.service';
import { GetAllRefundsRequest } from 'xendit-node/refund/apis';
import { CreateRefund } from 'xendit-node/refund/models';

@Controller('refund')
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  @Post()
  async createRefund(
    @Headers('idempotency-key') idempotencyKeyHeader: string,
    @Body() payload: CreateRefund,
  ) {
    try {
      const response = await this.refundService.createRefund({
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
  async getAllRefund(@Body() payload: GetAllRefundsRequest) {
    try {
      const response = await this.refundService.getAllRefund(payload);

      return response;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get(':id')
  async getRefund(
    @Headers('idempotency-key') idempotencyKeyHeader: string,
    @Param('id') refundId: string,
  ) {
    try {
      const response = await this.refundService.getRefund({
        idempotencyKey: idempotencyKeyHeader,
        refundID: refundId,
      });

      return response;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Delete(':id')
  async cancelRefund(
    @Headers('idempotency-key') idempotencyKeyHeader: string,
    @Param('id') refundId: string,
  ) {
    try {
      const response = await this.refundService.cancelRefund({
        idempotencyKey: idempotencyKeyHeader,
        refundID: refundId,
      });

      return response;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
