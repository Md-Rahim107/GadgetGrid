// n8n webhooks — preserve config while keeping values in env
export const CHAT_WEBHOOK = import.meta.env.VITE_CHAT_WEBHOOK;
export const ORDER_WEBHOOK = import.meta.env.VITE_ORDER_WEBHOOK;

if (!CHAT_WEBHOOK || !ORDER_WEBHOOK) {
  throw new Error('Missing webhook environment variables. Set VITE_CHAT_WEBHOOK and VITE_ORDER_WEBHOOK in .env');
}
