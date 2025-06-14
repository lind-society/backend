import { envPaths } from '@libs/common/constants';
import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';
import { config, DotenvConfigOptions } from 'dotenv';

export class LibEnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  RABBIT_MQ_URI!: string;
}

export function envConfig(options?: DotenvConfigOptions) {
  return config({
    path: envPaths[process.env.NODE_ENV || 'development'],
    ...options,
  });
}

export function validateEnv<T>(schema: new () => T) {
  return (config: Record<string, unknown>): T => {
    const validatedConfig = plainToInstance(schema, config, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig as object, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    return validatedConfig;
  };
}
