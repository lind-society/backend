import { Request } from 'express';
import { AdminPayloadDto } from 'src/modules/admin/dto';

export type AuthorizedRequest = Request & {
  headers: { authorization: string };
  user: AdminPayloadDto;
};
