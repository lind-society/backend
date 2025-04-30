import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  readonly phoneNumber!: string;

  @IsString()
  @IsNotEmpty()
  readonly message?: string;
}
