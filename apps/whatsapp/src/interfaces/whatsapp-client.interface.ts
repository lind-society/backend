export interface IWhatsappClient {
  sendMessage(chatId: string, message: string): Promise<void>;
}
