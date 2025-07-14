import { Environment } from '@libs/common/enums';

export function constructFrontendUrl(): string {
  const currentEnvironment = process.env.NODE_ENV;

  switch (currentEnvironment) {
    case Environment.Development:
      return process.env.FE_DEVELOPMENT;

    case Environment.Staging:
      return process.env.FE_STAGING;

    case Environment.Production:
      return process.env.FE_PRODUCTION;

    default:
      return process.env.FE_DEVELOPMENT;
  }
}
