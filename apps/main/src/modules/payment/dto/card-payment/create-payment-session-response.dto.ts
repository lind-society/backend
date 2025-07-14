import { HttpResponseDefaultProps, HttpResponseOptions } from '@apps/main/modules/shared/dto';
import { IRedirectUrlsDto, RedirectUrlsDto } from './card-session-js.dto';
import { HttpStatus } from '@nestjs/common';
import { DefaultHttpStatus } from '@apps/main/common/enums';

export interface ICreatePaymentSessionResponseDto {
  payment_session_id: string;
  created: string;
  updated: string;
  reference_id: string;
  currency: string;
  amount: number;
  country: string;
  customer_id: string;
  expires_at: string;
  session_type: string;
  mode: string;
  locale: string;
  business_id: string;
  redirectUrls: IRedirectUrlsDto;
}

export class CreatePaymentSessionResponseDto
  implements ICreatePaymentSessionResponseDto
{
  payment_session_id: string;
  created: string;
  updated: string;
  reference_id: string;
  currency: string;
  amount: number;
  country: string;
  customer_id: string;
  expires_at: string;
  session_type: string;
  mode: string;
  locale: string;
  business_id: string;
  redirectUrls: RedirectUrlsDto;
}

export class CreatePaymentSessionResponseSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<CreatePaymentSessionResponseDto>
{
  readonly data: CreatePaymentSessionResponseDto;

  constructor(data: CreatePaymentSessionResponseDto) {
    super({
      code: HttpStatus.OK,
      message: 'create payment session success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
