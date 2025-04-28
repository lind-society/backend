import { Inject, Injectable } from '@nestjs/common';
import {
  GetAllTransactionsRequest,
  TransactionApi,
} from 'xendit-node/balance_and_transaction/apis';
import {
  TransactionResponse,
  TransactionsResponse,
} from 'xendit-node/balance_and_transaction/models';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('XENDIT_TRANSACTION_CLIENT')
    private readonly transactionClient: TransactionApi,
  ) {}

  private _sanitizeGetAllTransactionPayload(
    getAllTransactionPayload: GetAllTransactionsRequest,
  ): GetAllTransactionsRequest {
    const sanitizedGetAllTransactionPayload = {
      ...getAllTransactionPayload,
    };

    if (sanitizedGetAllTransactionPayload.created.gte) {
      sanitizedGetAllTransactionPayload.created.gte = new Date(
        sanitizedGetAllTransactionPayload.created.gte,
      );
    }

    if (sanitizedGetAllTransactionPayload.created.lte) {
      sanitizedGetAllTransactionPayload.created.lte = new Date(
        sanitizedGetAllTransactionPayload.created.lte,
      );
    }

    if (sanitizedGetAllTransactionPayload.updated.gte) {
      sanitizedGetAllTransactionPayload.updated.gte = new Date(
        sanitizedGetAllTransactionPayload.updated.gte,
      );
    }

    if (sanitizedGetAllTransactionPayload.updated.lte) {
      sanitizedGetAllTransactionPayload.updated.lte = new Date(
        sanitizedGetAllTransactionPayload.updated.lte,
      );
    }

    return sanitizedGetAllTransactionPayload;
  }

  async getTransactionById(id: string): Promise<TransactionResponse> {
    const transaction = await this.transactionClient.getTransactionByID({ id });

    return transaction;
  }

  async getAllTransactions(
    payload: GetAllTransactionsRequest,
  ): Promise<TransactionsResponse> {
    const sanitizedGetAllTransactionPayload =
      this._sanitizeGetAllTransactionPayload(payload);

    const transactions = await this.transactionClient.getAllTransactions(
      sanitizedGetAllTransactionPayload,
    );

    return transactions;
  }
}
