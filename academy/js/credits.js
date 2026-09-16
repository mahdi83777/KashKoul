import { PHOTO_CREDITS } from './config.js';

/** Courtesy photo credits in the footer (hidden when the list is empty). */
export function renderCredits() {
  const mount = document.getElementById('photo-credits');
  if (!mount || !PHOTO_CREDITS.length) return;
  const links = PHOTO_CREDITS.map(c => `<a href="${c.url}" target="_blank" rel="noopener">${c.name}</a>`).join(', ');
  mount.innerHTML = `Instrument photos: ${links} — CC0 / public domain, placeholders until our own photos are ready.`;
}
