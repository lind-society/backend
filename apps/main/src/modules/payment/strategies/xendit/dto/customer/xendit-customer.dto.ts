export interface IXenditCustomerIndividualDetailDto {
  given_names?: string;
  surname?: string;
  [key: string]: any;
}

export class XenditCustomerIndividualDetailDto
  implements IXenditCustomerIndividualDetailDto
{
  given_names?: string;
  surname?: string;
  [key: string]: any;
}

export class IXenditCustomerDto {
  reference_id: string;
  type: string;
  email: string;
  mobile_number: string;
  individual_detail?: IXenditCustomerIndividualDetailDto;
}

export class XenditCustomerDto implements IXenditCustomerDto {
  reference_id: string;
  type: string;
  email: string;
  mobile_number: string;
  individual_detail?: IXenditCustomerIndividualDetailDto;
}
