import { AxiosResponseWithRequest } from '@apps/main/modules/shared/axios/interfaces/axios-responses-interface';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import axios from 'axios';

export async function getRedirectUrl(shortUrl: string): Promise<string> {
  try {
    const response = await axios.get<AxiosResponseWithRequest>(shortUrl, {
      maxRedirects: 5,
      validateStatus: (status: number) =>
        status >= HttpStatus.OK && status < HttpStatus.BAD_REQUEST,
    });

    const redirectUrl = (response.request as any)?.res?.responseUrl;
    if (!redirectUrl) {
      throw new NotFoundException('redirected URL not found.');
    }

    return redirectUrl;
  } catch (error) {
    throw new NotFoundException('failed to get redirected URL.');
  }
}
