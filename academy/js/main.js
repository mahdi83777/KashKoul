import { initWhatsAppLinks } from './whatsapp.js';
import { renderInstruments } from './instruments.js';
import { initHeroPointer, playOpening } from './hero.js';
import { initNav } from './nav.js';
import { renderCredits } from './credits.js';

initWhatsAppLinks();
renderInstruments();
renderCredits();
initNav();
initHeroPointer();
playOpening();
