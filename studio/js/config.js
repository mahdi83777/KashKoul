// Site content that changes more often than the markup. Most edits happen here.

// Shared with the Academy until the Studio has its own line.
export const WHATSAPP_NUMBER = '96178721968';
export const WHATSAPP_DEFAULT_MESSAGE = "Hi Kashkoul Studio! I'd like to check availability.";

/** Typed out under the hero headline, one phrase after another. */
export const HERO_TYPED = 'Podcasts · Sessions · Shoots · Workshops';

/**
 * What people book the place for. Each one becomes a row in the list, and swaps the photo beside it.
 *   title / note  the row
 *   img           file in assets/photos/
 *   caption       shown on the preview
 *   wa            the WhatsApp message the row sends
 */
export const USES = [
  { title: 'Podcasts & interviews', note: 'Library set, two chairs, two lights. The most-booked corner.', img: 'library-set-lights.jpg', caption: 'The library set', wa: "I'd like to book the studio for a podcast." },
  { title: 'Music sessions',        note: 'Live takes in the salon, tracking in the acoustic room.',       img: 'oud-corner.jpg',        caption: 'Room B · the oud corner', wa: "I'd like to book the studio for a music session." },
  { title: 'Brand & product content', note: 'Three backdrops, a Canon R8 on site, natural light all day.', img: 'salon-wide-softbox.jpg', caption: 'The salon, lit', wa: "I'd like to book the studio for brand content." },
  { title: 'Talks & workshops',     note: 'Salon seating for <span class="ph" title="Placeholder — confirm seated capacity">[12–15]</span>, kitchen next door.', img: 'salon-sofa.jpg', caption: 'The salon, seated', wa: "I'd like to book the studio for a workshop." },
  { title: 'Rehearsals',            note: 'Bands, ensembles, Academy students before a show.',             img: 'oud-chair-wide.jpg',    caption: 'Room B', wa: "I'd like to book the studio for a rehearsal." },
  { title: 'Golden-hour shoots',    note: 'Two sea-facing balconies. Bring the outfit.',                   img: 'balcony-1a.jpg',        caption: 'Balcony one · 5:40pm', wa: "I'd like to book a balcony golden-hour shoot." },
];
