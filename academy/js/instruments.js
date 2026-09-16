import { INSTRUMENTS } from './config.js';
import { whatsappLink } from './whatsapp.js';

const card = (i, n) => `
  <a class="card photo ${i.color}" href="${whatsappLink(`Hi Kashkoul! I'm interested in ${i.en} lessons.`)}" target="_blank" rel="noopener" aria-label="${i.en} lessons — ask on WhatsApp">
    <img src="assets/photos/${i.img}" alt="" loading="lazy">
    <span class="idx">${String(n + 1).padStart(2, '0')}</span>
    <span class="go" aria-hidden="true">→</span>
    <span><span class="t">${i.en}<span class="ar">${i.ar}</span></span><span class="s">${i.blurb}</span></span>
  </a>`;

/** Renders one card per instrument into #cards. */
export function renderInstruments() {
  const mount = document.getElementById('cards');
  if (mount) mount.innerHTML = INSTRUMENTS.map(card).join('');
}
