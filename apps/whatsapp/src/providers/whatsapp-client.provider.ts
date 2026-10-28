import { WhatsappClientProviders } from '@libs/common/enums';
import { Inject, Injectable, Logger } from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as qrcode from 'qrcode-terminal';
import { Client, Message } from 'whatsapp-web.js';
import {
  IWhatsappClient,
  IWhatsappConnectionState,
  IWhatsappIncomingMessage,
  WhatsappIncomingMessageHandler,
  WhatsappLinkStatus,
} from '../interfaces';

/** WhatsApp's suffix for group chats; individual chats end in `@c.us`. */
const GROUP_CHAT_SUFFIX = '@g.us';

/** Accounts addressed by Linked ID rather than by phone number. */
const LID_SUFFIX = '@lid';

@Injectable()
export class WhatsappClientProvider implements IWhatsappClient {
  private readonly logger = new Logger(WhatsappClientProvider.name);
  private isReady = false;
  private connectionRetries = 0;
  private readonly maxRetries = 5;
  private readonly retryDelay = 10000; // 10.000 ms = 10 s
  private reconnectTimer: NodeJS.Timeout | null = null;
  private readonly incomingMessageHandlers: WhatsappIncomingMessageHandler[] =
    [];

  /* ---- state surfaced to the admin dashboard ---------------------------- */
  private status: WhatsappLinkStatus = 'initializing';
  /** Raw pairing string from the `qr` event; rendered to PNG on demand. */
  private latestQr: string | null = null;
  private qrIssuedAt: Date | null = null;
  private lastReadyAt: Date | null = null;
  private lastDisconnectedAt: Date | null = null;
  private lastDisconnectReason: string | null = null;

  constructor(
    @Inject(WhatsappClientProviders.Main) private readonly client: Client,
  ) {
    this.setupEventListeners();
  }

  onIncomingMessage(handler: WhatsappIncomingMessageHandler): void {
    this.incomingMessageHandlers.push(handler);
  }

  private setupEventListeners() {
    this.client.on('qr', (qr) => {
      this.logger.log('QR Code received. Scan to authenticate:');
      // Terminal output stays for developers; the string is also retained so
      // the admin dashboard can render it for non-technical staff.
      qrcode.generate(qr, { small: true });
      this.latestQr = qr;
      this.qrIssuedAt = new Date();
      this.status = 'qr_required';
    });

    // Pairing accepted; the session is being restored but is not usable yet.
    this.client.on('authenticated', () => {
      this.latestQr = null;
      this.qrIssuedAt = null;
      this.status = 'authenticating';
      this.logger.log('WhatsApp session authenticated');
    });

    // Incoming messages. Registered once here rather than per handler, so
    // reconnects never leave the app deaf or double-subscribed.
    this.client.on('message', (message: Message) => {
      void this.handleIncomingMessage(message);
    });

    // Ready event
    this.client.on('ready', () => {
      this.isReady = true;
      this.connectionRetries = 0;
      this.latestQr = null;
      this.qrIssuedAt = null;
      this.status = 'connected';
      this.lastReadyAt = new Date();
      this.logger.log('WhatsApp Client is ready!');
    });

    // Authentication failure
    this.client.on('auth_failure', (msg) => {
      this.isReady = false;
      this.status = 'auth_failure';
      this.lastDisconnectReason = msg;
      this.lastDisconnectedAt = new Date();
      this.logger.error(`Authentication failed: ${msg}`);
      this.scheduleReconnect();
    });

    // Disconnected event
    this.client.on('disconnected', (reason) => {
      this.isReady = false;
      this.status = 'disconnected';
      this.lastDisconnectReason = String(reason);
      this.lastDisconnectedAt = new Date();
      this.logger.warn(`WhatsApp client disconnected: ${reason}`);
      this.scheduleReconnect();
    });

    // Error event
    this.client.on('error', (error) => {
      this.logger.error(`WhatsApp client error: ${error.message}`);

      // Check if error is related to the WidFactory issue
      if (error.message && error.message.includes('WidFactory')) {
        this.logger.warn(
          'Detected WidFactory error - this may require a fresh session',
        );
        this.handleWidFactoryError();
      }
    });
  }

  /**
   * Normalises a message and fans it out to the registered handlers. Group
   * chats and the app's own outgoing messages are dropped: only a one-to-one
   * message from a real person can be an owner replying to us.
   *
   * A throwing handler is logged and skipped — a bad consumer must not stop the
   * others from seeing the message, nor crash the WhatsApp client.
   */
  private async handleIncomingMessage(message: Message): Promise<void> {
    try {
      if (!message || message.fromMe) {
        return;
      }

      if (!message.from || message.from.endsWith(GROUP_CHAT_SUFFIX)) {
        return;
      }

      const phoneNumber = await this.resolveSenderNumber(message);
      const body = (message.body ?? '').trim();

      if (!phoneNumber || !body) {
        return;
      }

      const payload: IWhatsappIncomingMessage = {
        phoneNumber,
        message: body,
        messageId: message.id?._serialized,
        receivedAt: new Date(
          message.timestamp ? message.timestamp * 1000 : Date.now(),
        ).toISOString(),
      };

      this.logger.log(`incoming message from ${phoneNumber}`);

      for (const handler of this.incomingMessageHandlers) {
        try {
          await handler(payload);
        } catch (error) {
          this.logger.error(
            `incoming message handler failed: ${error.message}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(`failed to process incoming message: ${error.message}`);
    }
  }

  /**
   * Works out the sender's actual phone number.
   *
   * WhatsApp increasingly addresses accounts by LID, so `message.from` arrives
   * as `261873484230869@lid` rather than `6285117653195@c.us`. That id matches
   * no owner in the database, so a genuine "AVAILABLE" reply gets dismissed as
   * `no_pending_booking`.
   *
   * `contact.number` is no help — for a LID-addressed contact it returns the
   * LID again. `getContactLidAndPhone` is the mapping that actually resolves
   * one to the other.
   */
  private async resolveSenderNumber(message: Message): Promise<string> {
    const fromId = this.normalisePhoneNumber(message.from);

    if (!message.from.includes(LID_SUFFIX)) {
      return fromId;
    }

    try {
      const [mapping] = await this.client.getContactLidAndPhone([message.from]);
      const phoneNumber = mapping?.pn
        ? this.normalisePhoneNumber(mapping.pn)
        : '';

      if (phoneNumber) {
        return phoneNumber;
      }

      this.logger.warn(
        `no phone number mapped for ${message.from}, falling back to the raw id`,
      );
    } catch (error) {
      this.logger.warn(
        `could not map ${message.from} to a phone number: ${error.message}`,
      );
    }

    return fromId;
  }

  /** `6281234567890@c.us` -> `6281234567890`. */
  private normalisePhoneNumber(from: string): string {
    return from.split('@')[0].replace(/\D/g, '');
  }

  /** Same shape, used on the way out before resolving the number. */
  private toBareNumber(chatId: string): string {
    return this.normalisePhoneNumber(chatId);
  }

  private handleWidFactoryError() {
    try {
      // Clear the session and force a new QR code
      if (this.client) {
        this.client
          .destroy()
          .catch((e) =>
            this.logger.error(`Error destroying client: ${e.message}`),
          );
      }

      // Small delay before reinitializing
      setTimeout(() => {
        this.logger.log('Reinitializing client after WidFactory error');
        this.initialize();
      }, 2000);
    } catch (error) {
      this.logger.error(`Failed to handle WidFactory error: ${error.message}`);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    // Clear any existing reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.connectionRetries++;

    if (this.connectionRetries <= this.maxRetries) {
      const delay = this.retryDelay * Math.min(this.connectionRetries, 3); // Exponential backoff up to 3x
      this.logger.log(
        `Scheduling reconnection attempt ${this.connectionRetries}/${this.maxRetries} in ${delay / 1000} seconds`,
      );

      this.reconnectTimer = setTimeout(() => {
        this.logger.log('Attempting to reconnect WhatsApp client...');
        this.initialize();
      }, delay);
    } else {
      this.logger.error(
        `Maximum reconnection attempts (${this.maxRetries}) reached. Manual intervention required.`,
      );
      // Here you could trigger an alert or notify admins
    }
  }

  async onModuleInit() {
    await this.initialize();
  }

  async initialize() {
    try {
      this.logger.log('Initializing WhatsApp connection...');

      // Check if client is already initialized
      if (this.client.pupPage) {
        this.logger.log('Client already has a page, destroying first...');
        try {
          await this.client.destroy();
        } catch (destroyError) {
          this.logger.warn(
            `Error destroying existing client: ${destroyError.message}`,
          );
        }
      }

      await this.client.initialize();
    } catch (error) {
      this.isReady = false;
      this.logger.error(
        `Failed to initialize WhatsApp client: ${error.message}`,
      );

      // If it's a browser launch error, we need to handle it differently
      if (error.message.includes('Failed to launch the browser process')) {
        this.logger.error(
          'Browser process failed to launch. This may require manual intervention.',
        );
        // Try to force restart the client
        await this.forceRestart();
        return;
      }

      this.scheduleReconnect();
    }
  }

  async onModuleDestroy() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    try {
      this.logger.log('Destroying WhatsApp Client...');
      await this.client.destroy();
    } catch (error) {
      this.logger.error(`Error during client shutdown: ${error.message}`);
    }
  }

  async sendMessage(chatId: string, message: string): Promise<void> {
    if (!this.isReady) {
      throw new Error('WhatsApp client is not ready');
    }

    // Additional check for client state
    if (!this.client) {
      this.logger.error('WhatsApp client is null or undefined');
      this.isReady = false;
      throw new Error('WhatsApp client is null or undefined');
    }

    // Check if the client has a valid page
    if (!this.client.pupPage) {
      this.logger.error(
        'WhatsApp client is not properly initialized (no page)',
      );
      this.isReady = false;
      this.scheduleReconnect();
      throw new Error('WhatsApp client is not properly initialized (no page)');
    }

    // Validate inputs
    if (!chatId || typeof chatId !== 'string') {
      throw new Error(`Invalid chatId: ${chatId}`);
    }

    if (!message || typeof message !== 'string') {
      throw new Error(`Invalid message: ${message}`);
    }

    try {
      this.logger.log(`Attempting to send message to ${chatId}`);

      // Check browser health before sending
      const isHealthy = await this.isBrowserHealthy();
      if (!isHealthy) {
        throw new Error('Browser is not healthy, cannot send message');
      }

      // Ask WhatsApp to resolve the number rather than assuming `<number>@c.us`.
      //
      // WhatsApp now addresses accounts by LID, and a hand-built `@c.us` id it
      // has no mapping for fails with "No LID for user" — which is what every
      // send did here. `getNumberId` returns the id WhatsApp actually wants, and
      // returns null when the number simply has no WhatsApp account, which is
      // worth reporting as itself rather than as a cryptic send failure.
      const numberId = await this.client.getNumberId(
        this.toBareNumber(chatId),
      );

      if (!numberId) {
        throw new Error(
          `${this.toBareNumber(chatId)} is not registered on WhatsApp`,
        );
      }

      // Send the message
      const result = await this.client.sendMessage(
        numberId._serialized,
        message,
      );

      // A missing return value is NOT a failed send.
      //
      // whatsapp-web.js regularly delivers the message but then fails to
      // serialize the Message object it hands back, returning undefined.
      // Treating that as an error marked delivered messages as failed, which
      // pushed them onto the retry queue and sent the recipient a duplicate a
      // few seconds later. Verified against a real handset: the message arrives.
      //
      // A genuine failure throws, and is handled below.
      if (!result) {
        this.logger.warn(
          `Message to ${chatId} was sent but returned no receipt (whatsapp-web.js serialization); not retrying`,
        );
      }

      this.logger.log(`Message sent successfully to ${chatId}`);
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp message: ${error.message}`);
      this.logger.error(
        `ChatId: ${chatId}, Message length: ${message?.length || 0}`,
      );

      // Check if we need to reconnect based on specific errors
      if (
        error.message.includes('not connected') ||
        error.message.includes('browser') ||
        error.message.includes('session') ||
        error.message.includes('WidFactory') ||
        error.message.includes('serialize') ||
        error.message.includes('getMessageModel')
      ) {
        this.logger.warn(
          'Detected connection-related error, scheduling reconnect',
        );
        this.isReady = false;
        this.scheduleReconnect();
      }

      throw error;
    }
  }

  /**
   * Snapshot for the admin dashboard. The pairing string is rendered to a PNG
   * data URL here so the frontend only has to drop it into an `<img>` — no QR
   * library, no encoding rules to keep in sync.
   */
  async getConnectionState(): Promise<IWhatsappConnectionState> {
    let qrImage: string | null = null;

    if (this.status === 'qr_required' && this.latestQr) {
      try {
        qrImage = await QRCode.toDataURL(this.latestQr, {
          margin: 1,
          width: 320,
        });
      } catch (error) {
        this.logger.error(`Failed to render QR code: ${error.message}`);
      }
    }

    // `isConnected()` is the source of truth: the browser page can die without
    // whatsapp-web.js emitting `disconnected`, which would otherwise leave the
    // dashboard cheerfully reporting a link that no longer works.
    const status: WhatsappLinkStatus =
      this.status === 'connected' && !this.isConnected()
        ? 'disconnected'
        : this.status;

    return {
      status,
      qrImage,
      qrIssuedAt: this.qrIssuedAt?.toISOString() ?? null,
      linkedNumber: this.client?.info?.wid?.user ?? null,
      linkedName: this.client?.info?.pushname ?? null,
      lastReadyAt: this.lastReadyAt?.toISOString() ?? null,
      lastDisconnectedAt: this.lastDisconnectedAt?.toISOString() ?? null,
      lastDisconnectReason: this.lastDisconnectReason,
      retries: this.connectionRetries,
      maxRetries: this.maxRetries,
    };
  }

  /**
   * Unlinks the handset and wipes the stored session so the next initialisation
   * issues a fresh QR. This is how staff move the integration to another
   * number without touching the server.
   */
  async logout(): Promise<void> {
    this.logger.log('Logout requested — clearing the stored session');
    this.isReady = false;
    this.connectionRetries = 0;
    this.latestQr = null;
    this.qrIssuedAt = null;
    this.lastReadyAt = null;
    this.status = 'initializing';

    try {
      await this.client.logout();
    } catch (error) {
      // A client that never linked has no session to log out of; destroying and
      // re-initialising still gets us back to a QR, so this is not fatal.
      this.logger.warn(`logout() failed, falling back to destroy: ${error.message}`);
      try {
        await this.client.destroy();
      } catch (destroyError) {
        this.logger.error(`destroy() also failed: ${destroyError.message}`);
      }
    }

    setTimeout(() => {
      void this.initialize();
    }, 1000);
  }

  isConnected(): boolean {
    return this.isReady && !!this.client && !!this.client.pupPage;
  }

  private async isBrowserHealthy(): Promise<boolean> {
    try {
      if (!this.client || !this.client.pupPage) {
        return false;
      }

      // Try to get page title to check if browser is responsive
      const title = await this.client.pupPage.title();
      return !!title;
    } catch (error) {
      this.logger.warn(`Browser health check failed: ${error.message}`);
      return false;
    }
  }

  async forceReconnect(): Promise<void> {
    this.logger.log('Force reconnect requested');
    this.connectionRetries = 0;

    try {
      await this.client.destroy();
    } catch (e) {
      this.logger.error(
        `Error destroying client during force reconnect: ${e.message}`,
      );
    }

    // Small delay before reinitializing
    setTimeout(() => {
      this.initialize();
    }, 1000);
  }

  async forceRestart(): Promise<void> {
    this.logger.log(
      'Force restart requested - this will create a new client instance',
    );
    this.connectionRetries = 0;
    this.isReady = false;

    try {
      // Destroy the current client
      if (this.client) {
        await this.client.destroy();
      }
    } catch (e) {
      this.logger.error(
        `Error destroying client during force restart: ${e.message}`,
      );
    }

    // Note: In a real implementation, you might want to emit an event
    // to the module to recreate the client instance
    this.logger.warn('Client destroyed. Manual restart may be required.');
  }
}
