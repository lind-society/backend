import { Body, Controller, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { GetAllTransactionsRequest } from 'xendit-node/balance_and_transaction/apis';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('')
  async getAllTransactions(@Body() payload: GetAllTransactionsRequest) {
    try {
      const result = await this.transactionService.getAllTransactions(payload);

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Get(':id')
  async getTransactionById(@Param('id') id: string) {
    try {
      const result = await this.transactionService.getTransactionById(id);

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
