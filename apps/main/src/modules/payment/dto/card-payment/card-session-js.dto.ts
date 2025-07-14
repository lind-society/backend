export interface IRedirectUrlsDto {
  successReturnUrl: string;
  failureReturnUrl: string;
}

export class RedirectUrlsDto implements IRedirectUrlsDto {
  successReturnUrl: string;
  failureReturnUrl: string;
}
