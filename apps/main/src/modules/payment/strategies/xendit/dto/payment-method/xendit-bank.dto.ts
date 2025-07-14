export interface IXenditBankDto {
  bank_code: string;
  collection_type: string;
  transfer_amount: number;
  bank_branch: string;
  account_holder_name: string;
  identity_amount: number;
}

export class XenditBankDto implements IXenditBankDto {
  bank_code: string;
  collection_type: string;
  transfer_amount: number;
  bank_branch: string;
  account_holder_name: string;
  identity_amount: number;
}
