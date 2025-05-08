import { ISendMailOptions } from '@nestjs-modules/mailer';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class SendMailDto implements ISendMailOptions {
  @IsString()
  @IsNotEmpty()
  to!: string;

  @IsString()
  @IsNotEmpty()
  subject!: string;

  @IsString()
  @IsOptional()
  template?: string;

  @IsObject()
  @IsOptional()
  context?: Record<string, any>;
}
