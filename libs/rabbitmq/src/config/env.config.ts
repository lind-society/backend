import { IsNotEmpty, IsString } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  RABBIT_MQ_URI!: string;

  @IsString()
  @IsNotEmpty()
  RABBIT_MQ_WHATSAPP_QUEUE!: string;
}
