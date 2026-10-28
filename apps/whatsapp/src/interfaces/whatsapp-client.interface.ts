/**
 * An incoming message after the client has stripped WhatsApp's addressing
 * (`6281...@c.us`) down to a bare phone number.
 */
export interface IWhatsappIncomingMessage {
  phoneNumber: string;
  message: string;
  messageId?: string;
  receivedAt?: string;
}

export type WhatsappIncomingMessageHandler = (
  message: IWhatsappIncomingMessage,
) => void | Promise<void>;

/**
 * Lifecycle of the WhatsApp link, phrased for the admin UI rather than for the
 * library. Non-technical staff only ever need to act on `qr_required`.
 */
export type WhatsappLinkStatus =
  | 'initializing'
  | 'qr_required'
  | 'authenticating'
  | 'connected'
  | 'disconnected'
  | 'auth_failure';

export interface IWhatsappConnectionState {
  status: WhatsappLinkStatus;
  /** PNG data URL of the pairing code — only set while `qr_required`. */
  qrImage: string | null;
  /** When the current QR was issued; they expire after ~60s. */
  qrIssuedAt: string | null;
  /** Phone number of the linked handset, once known. */
  linkedNumber: string | null;
  linkedName: string | null;
  lastReadyAt: string | null;
  lastDisconnectedAt: string | null;
  lastDisconnectReason: string | null;
  /** Reconnect attempts since the last successful link. */
  retries: number;
  maxRetries: number;
}

export interface IWhatsappClient {
  isConnected(): boolean;
  forceReconnect(): Promise<void>;
  sendMessage(chatId: string, message: string): Promise<void>;
  forceRestart(): Promise<void>;
  /**
   * Registers a handler for incoming private messages. Handlers are additive
   * and survive reconnects, because they are held here rather than on the
   * underlying whatsapp-web.js client.
   */
  onIncomingMessage(handler: WhatsappIncomingMessageHandler): void;
  /** Snapshot for the admin dashboard, including the pairing QR when needed. */
  getConnectionState(): Promise<IWhatsappConnectionState>;
  /**
   * Unlinks the handset and clears the stored session, so the next
   * initialisation issues a fresh QR. Used when switching to another number.
   */
  logout(): Promise<void>;
}
