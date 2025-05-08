export enum MessageQueueType {
  Mail = 'mail',
  Payment = 'payment',
  Whatsapp = 'whatsapp',
}

export enum MessageQueueStatus {
  Failed = 'failed',
  Pending = 'pending',
  Processing = 'processing',
  Sent = 'sent',
}
