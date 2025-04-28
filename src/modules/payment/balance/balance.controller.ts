import { Controller, Get } from '@nestjs/common';
import { BalanceService } from './balance.service';

@Controller('payment/balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  async getBalance() {
    const response = await this.balanceService.getBalance();

    return response;
  }
}
