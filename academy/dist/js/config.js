// Site content that changes more often than the markup.

export const WHATSAPP_NUMBER = '96171257082';
export const WHATSAPP_DEFAULT_MESSAGE = "Hi Kashkoul Academy! I'd like to book a first lesson.";

/**
 * Instruments, in display order. Each one becomes a card in the Instruments section.
 *   en     English name
 *   ar     Arabic name
 *   blurb  one-line description shown on the card
 *   color  card colour variant — see css/sections/instruments.css (.card.<color>)
 *   img    file in assets/photos/
 */
export const INSTRUMENTS = [
  { en: 'Oud',        ar: 'عود',       blurb: 'Maqam · taqsim · repertoire',    color: 'terra',   img: 'oud-duotone.jpg' },
  { en: 'Percussion', ar: 'إيقاع',     blurb: 'Riq · daf · darbuka · iqaʿat',   color: 'mustard', img: 'daf.jpg' },
  { en: 'Violin',     ar: 'كمان',      blurb: 'Arabic & Western technique',     color: 'green',   img: 'violin.jpg' },
  { en: 'Buzuq',      ar: 'بزق',       blurb: 'Levantine long-neck lute',       color: 'sand',    img: 'buzuq.jpg' },
  { en: 'Guitar',     ar: 'غيتار',     blurb: 'Classical & fingerstyle',        color: 'paper',   img: 'guitar.jpg' },
  { en: 'Piano',      ar: 'بيانو',     blurb: 'Keys · theory · harmony',        color: 'pine',    img: 'piano.jpg' },
  { en: 'Qanun',      ar: 'قانون',     blurb: '26 courses · mandal technique',  color: 'mustard', img: 'qanun.jpg' },
  { en: 'Trumpet',    ar: 'ترومبيت',   blurb: 'Brass · breath · tone',          color: 'terra',   img: 'trumpet.jpg' },
  { en: 'Ney',        ar: 'ناي',       blurb: 'Breath · tone · the seven neys', color: 'wide',    img: 'ney.jpg' },
  { en: 'Saxophone',  ar: 'ساكسفون',   blurb: 'Jazz & Arabic phrasing',         color: 'green',   img: 'saxophone.jpg' },
  { en: 'Clarinet',   ar: 'كلارينيت',  blurb: 'Classical & folk repertoire',    color: 'sand',    img: 'clarinet.jpg' },
];

/**
 * Photo credits shown in the footer. All instrument photos are CC0 / Public Domain (see assets/photos/CREDITS.md),
 * so this is a courtesy, not a requirement — empty the list to hide the line.
 */
export const PHOTO_CREDITS = [
  { name: "USDAgov", url: "https://www.flickr.com/photos/41284017@N08/7511650066" },
  { name: "Gaz-zee-boh", url: "https://www.flickr.com/photos/23334177@N02/10715333865" },
  { name: "rawpixel", url: "https://www.rawpixel.com/image/3282684/free-photo-image-guitar-music-band-classical-musician" },
  { name: "Image Catalog", url: "https://www.flickr.com/photos/132795455@N08/17276477045" },
  { name: "U.S. National Archives", url: "https://www.rawpixel.com/image/8765742/photo-image-vintage-person-african-american" },
  { name: "U.S. Army Europe", url: "https://www.flickr.com/photos/37585279@N03/5711904947" },
];
