import { PaymentAvailableCardOnFileType } from '@apps/main/modules/payment/enum';
import {
  IXenditRecurringConfigurationDto,
  XenditRecurringConfigurationDto,
} from '../xendit-payment-shared-field.dto';

export interface IXenditSessionCardDto {
  card_on_file_type: PaymentAvailableCardOnFileType;
  mid_label: string;
  allowed_bins: string[];
  skip_three_ds: boolean;
  recurring_configuration: IXenditRecurringConfigurationDto;
  statement_descriptor: string;
}

export interface IXenditSessionChannelPropertiesDto {
  cards?: IXenditSessionCardDto;
}

export interface IXenditCardsSessionJSDto {
  success_return_url: string;
  failure_return_url: string;
}

export class XenditSessionCardDto implements IXenditSessionCardDto {
  card_on_file_type: PaymentAvailableCardOnFileType;
  mid_label: string;
  allowed_bins: string[];
  skip_three_ds: boolean;
  recurring_configuration: XenditRecurringConfigurationDto;
  statement_descriptor: string;
}

export class XenditSessionChannelPropertiesDto
  implements IXenditSessionChannelPropertiesDto
{
  cards?: IXenditSessionCardDto;
}

export class XenditCardsSessionJSDto implements IXenditCardsSessionJSDto {
  success_return_url: string;
  failure_return_url: string;
}
