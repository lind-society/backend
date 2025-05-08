import { HttpResponseOptions } from '@apps/main/modules/shared/dto';
import { Response } from 'express';

export function sendHttpResponse<T>(
  res: Response,
  response: HttpResponseOptions<T>,
): void {
  res.status(response.code).json(response);
}
