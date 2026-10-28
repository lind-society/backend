// Dependency Injection Token
export const WHATSAPP_SERVICE = 'WHATSAPP_SERVICE';
export const WHATSAPP_INBOUND_SERVICE = 'WHATSAPP_INBOUND_SERVICE';

// Message Pattern
export const SEND_WHATSAPP_MESSAGE = 'send.whatsapp.message';
export const WHATSAPP_HEALTH_CHECK = 'whatsapp.health.check';
export const WHATSAPP_FORCE_RECONNECT = 'whatsapp.force.reconnect';
export const WHATSAPP_FORCE_RESTART = 'whatsapp.force.restart';
/** Full link state + pairing QR, for the admin dashboard. */
export const WHATSAPP_CONNECTION_STATE = 'whatsapp.connection.state';
/** Unlink the handset and clear the session so a new QR is issued. */
export const WHATSAPP_LOGOUT = 'whatsapp.logout';

/**
 * Emitted (fire-and-forget) by the WhatsApp microservice for every incoming
 * private message. It is an event rather than a request/response because the
 * sender has nobody to hand a reply back to.
 */
export const WHATSAPP_INBOUND_MESSAGE = 'whatsapp.inbound.message';
