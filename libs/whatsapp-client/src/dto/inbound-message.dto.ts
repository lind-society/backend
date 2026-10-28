import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * One incoming WhatsApp message, normalised by the microservice before it
 * reaches the main app: `phoneNumber` is digits only (the `@c.us` suffix and
 * any punctuation are stripped) so it can be compared against the phone
 * numbers stored on owners and customers.
 */
export class InboundMessageDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;

  /** WhatsApp's own message id, carried through for de-duplication and logs. */
  @IsString()
  @IsOptional()
  messageId?: string;

  /** ISO timestamp of when the microservice received the message. */
  @IsString()
  @IsOptional()
  receivedAt?: string;
}
