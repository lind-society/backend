import { registerAs } from '@nestjs/config';
import { envValues } from './env-values.config';

const { JWT_AT_SECRET, JWT_RT_SECRET, JWT_AT_EXPIRE, JWT_RT_EXPIRE } =
  envValues;

export const jwtConfig = registerAs('jwt', () => ({
  accessToken: {
    secret: JWT_AT_SECRET,
    expire: JWT_AT_EXPIRE,
  },
  refreshToken: {
    secret: JWT_RT_SECRET,
    expire: JWT_RT_EXPIRE,
  },
}));
