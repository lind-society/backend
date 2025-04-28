import { Inject, Injectable } from '@nestjs/common';
import {
  Channel,
  GetPayouts200Response,
  GetPayouts200ResponseDataInner,
} from 'xendit-node/payout/models';
import {
  CancelPayoutRequest,
  CreatePayoutOperationRequest,
  GetPayoutChannelsRequest,
  GetPayoutsRequest,
  PayoutApi,
} from 'xendit-node/payout/apis';

@Injectable()
export class PayoutService {
  constructor(
    @Inject('XENDIT_PAYOUT_CLIENT')
    private readonly payoutClient: PayoutApi,
  ) {}

  async createPayout(
    payload: CreatePayoutOperationRequest,
  ): Promise<GetPayouts200ResponseDataInner> {
    const payout = await this.payoutClient.createPayout({
      ...payload,
      idempotencyKey: payload.idempotencyKey || crypto.randomUUID(),
    });

    return payout;
  }

  async getPayoutById(id: string): Promise<GetPayouts200ResponseDataInner> {
    const payout = await this.payoutClient.getPayoutById({ id });

    return payout;
  }

  async getPayoutChannels(
    payload: GetPayoutChannelsRequest,
  ): Promise<Array<Channel>> {
    const payout = await this.payoutClient.getPayoutChannels(payload);

    return payout;
  }

  async getPayouts(payload: GetPayoutsRequest): Promise<GetPayouts200Response> {
    const payouts = await this.payoutClient.getPayouts(payload);

    return payouts;
  }

  async cancelPayout(id: string): Promise<GetPayouts200ResponseDataInner> {
    const payout = await this.payoutClient.cancelPayout({ id });

    return payout;
  }
}
