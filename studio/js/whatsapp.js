import { WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE } from './config.js';

/** Builds a wa.me link; anything that isn't already a greeting gets one. */
export const waLink = (message = WHATSAPP_DEFAULT_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message.startsWith('Hi') ? message : `Hi Kashkoul Studio! ${message}`)}`;

/** Points every [data-wa] element at WhatsApp, using its own message when it has one. */
export function initWhatsAppLinks(root = document) {
  root.querySelectorAll('[data-wa]').forEach(a => { a.href = waLink(a.dataset.wa || undefined); });
}
