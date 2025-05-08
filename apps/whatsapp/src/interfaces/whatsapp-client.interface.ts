export interface IWhatsappClient {
  isConnected(): boolean;
  forceReconnect(): Promise<void>;
  sendMessage(chatId: string, message: string): Promise<void>;
}
