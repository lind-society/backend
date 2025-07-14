export class IXenditCreateCustomerRequestDto {
  reference_id?: string;
  type?: string;
  given_names?: string;
  surname?: string;
  email?: string;
  mobile_number?: string;
  addresses?: Record<string, any>[];
}

export class XenditCreateCustomerRequestDto
  implements IXenditCreateCustomerRequestDto
{
  reference_id?: string;
  type?: string;
  given_names?: string;
  surname?: string;
  email?: string;
  mobile_number?: string;
  addresses?: Record<string, any>[];
}
