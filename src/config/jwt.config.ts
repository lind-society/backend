import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { JWT_AT_SECRET, JWT_RT_SECRET, JWT_AT_EXPIRE, JWT_RT_EXPIRE } =
  envValues;

export const jwtConfig = registerAs('jwt', () => ({
  atSecret: JWT_AT_SECRET,
  rtSecret: JWT_RT_SECRET,
  atExpire: JWT_AT_EXPIRE,
  rtExpire: JWT_RT_EXPIRE,
}));
