import { AdminPayloadDto } from '@apps/main/modules/admin/dto';
import { Request } from 'express';

export type AuthorizedRequest = Request & {
  headers: { authorization: string };
  user: AdminPayloadDto;
};
