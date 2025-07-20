export interface IXenditRecurringConfigurationDto {
  recurring_expiry?: string;
  recurring_frequency?: number;
}

export class XenditRecurringConfigurationDto
  implements IXenditRecurringConfigurationDto
{
  recurring_expiry?: string;
  recurring_frequency?: number;
}
