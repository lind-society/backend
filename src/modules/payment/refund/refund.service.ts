import { Inject, Injectable } from '@nestjs/common';
import {
  CancelRefundRequest,
  CreateRefundRequest,
  GetAllRefundsRequest,
  GetRefundRequest,
  RefundApi,
} from 'xendit-node/refund/apis';
import { Refund, RefundList } from 'xendit-node/refund/models';

@Injectable()
export class RefundService {
  constructor(
    @Inject('XENDIT_REFUND_CLIENT')
    private readonly refundClient: RefundApi,
  ) {}

  async createRefund(payload: CreateRefundRequest): Promise<Refund> {
    const refund = await this.refundClient.createRefund({
      ...payload,
      idempotencyKey: payload.idempotencyKey || crypto.randomUUID(),
    });

    return refund;
  }

  async getRefund(payload: GetRefundRequest): Promise<Refund> {
    const refund = await this.refundClient.getRefund({
      ...payload,
      idempotencyKey: payload.idempotencyKey || crypto.randomUUID(),
    });

    return refund;
  }

  async getAllRefund(payload: GetAllRefundsRequest): Promise<RefundList> {
    const refunds = await this.refundClient.getAllRefunds(payload);

    return refunds;
  }

  async cancelRefund(payload: CancelRefundRequest): Promise<Refund> {
    const refund = await this.refundClient.cancelRefund(payload);

    return refund;
  }
}
