import { initWhatsAppLinks } from './whatsapp.js';
import { renderInstruments } from './instruments.js';
import { initHeroPointer, playOpening } from './hero.js';
import { initNav } from './nav.js';
import { renderCredits } from './credits.js';

initWhatsAppLinks();
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });   // footer © year
renderInstruments();
renderCredits();
initNav();
initHeroPointer();
playOpening();
