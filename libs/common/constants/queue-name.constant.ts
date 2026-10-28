export const MAIL_QUEUE = 'mail_queue';
export const PAYMENT_QUEUE = 'payment_queue';
export const WHATSAPP_QUEUE = 'whatsapp_queue';

/**
 * Messages travelling the other way: from the WhatsApp microservice back into
 * the main app. Kept apart from `WHATSAPP_QUEUE` so a backlog of outgoing
 * messages can never delay an owner's reply, and so each side consumes only
 * what it owns.
 */
export const WHATSAPP_INBOUND_QUEUE = 'whatsapp_inbound_queue';
