import { Inject, Injectable } from '@nestjs/common';
import { BalanceApi } from 'xendit-node/balance_and_transaction/apis';
import { Balance } from 'xendit-node/balance_and_transaction/models';

@Injectable()
export class BalanceService {
  constructor(
    @Inject('XENDIT_BALANCE_CLIENT')
    private readonly balanceClient: BalanceApi,
  ) {}

  async getBalance(): Promise<Balance> {
    const balance = await this.balanceClient.getBalance();

    return balance;
  }
}
