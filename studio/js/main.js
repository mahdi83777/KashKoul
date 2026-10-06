import { initWhatsAppLinks } from './whatsapp.js';
import { initUses } from './uses.js';
import { initLightbox } from './lightbox.js';
import { initNav } from './nav.js';
import { initReveal } from './reveal.js';
import { initHeroPointer, playOpening, initEntryTyping } from './hero.js';
import { initPlaceholders } from './placeholders.js';

initUses();
initWhatsAppLinks();   // after the sections that render their own [data-wa] links
initLightbox();
initNav();
initReveal();
initPlaceholders();
initHeroPointer();
initEntryTyping();
playOpening();
