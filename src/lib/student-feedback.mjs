export const FEEDBACK_CHOICES = ['more_confident','no_change','more_confused','own_words'];

export function isFeedbackId(value) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

/** randomUUID needs HTTPS; getRandomValues also supports plain-HTTP LAN testing. */
export function createFeedbackId(cryptoApi = globalThis.crypto) {
  if (typeof cryptoApi?.randomUUID === 'function') return cryptoApi.randomUUID();
  if (typeof cryptoApi?.getRandomValues !== 'function') throw new Error('Secure random values unavailable');
  const bytes = new Uint8Array(16);
  cryptoApi.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes,n=>n.toString(16).padStart(2,'0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

/** Ready-made choices never transmit a hidden custom-response draft. */
export function normalizeFeedback(choice, text) {
  if (!FEEDBACK_CHOICES.includes(choice)) return null;
  if (choice !== 'own_words') return {choice,message:''};
  if (typeof text !== 'string') return null;
  const message = text.trim();
  return message.length > 0 && message.length <= 1000 ? {choice,message} : null;
}
