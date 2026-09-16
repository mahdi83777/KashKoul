import { WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE } from './config.js';

/** wa.me deep link with a prefilled message. */
export const whatsappLink = (text = WHATSAPP_DEFAULT_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/** Every element with a `data-wa` attribute becomes a WhatsApp link. */
export function initWhatsAppLinks() {
  document.querySelectorAll('[data-wa]').forEach(a => { a.href = whatsappLink(); });
}
