import { WhatsappClientService } from '@libs/whatsapp-client';
import { Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards';

/**
 * Admin-facing view of the WhatsApp link.
 *
 * The pairing QR used to exist only as ASCII art in the microservice's terminal,
 * which meant linking a handset required server access. These endpoints put the
 * same information behind the dashboard login so non-technical staff can do it.
 */
@UseGuards(JwtAuthGuard)
@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappClient: WhatsappClientService) {}

  /** Current link state, plus the pairing QR while one is pending. */
  @Get('connection')
  async connection() {
    const data = await this.whatsappClient.getConnectionState();

    return { status: 'success', code: 200, data };
  }

  /** Retry the connection without dropping the stored session. */
  @Post('reconnect')
  @HttpCode(200)
  async reconnect() {
    const connected = await this.whatsappClient.forceReconnect();

    return {
      status: 'success',
      code: 200,
      data: { reconnected: connected },
    };
  }

  /** Unlink the handset so a fresh QR is issued — used to switch numbers. */
  @Post('logout')
  @HttpCode(200)
  async logout() {
    const result = await this.whatsappClient.logout();

    return { status: 'success', code: 200, data: result };
  }
}
