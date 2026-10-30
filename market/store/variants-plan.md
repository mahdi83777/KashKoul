# Products with variants (approved 2026-10-30, option B)

Each variant is imported from Spreadr as a single product (its own Amazon ID in `import-all.csv`), then
`market/tools/merge-variants.mjs` combines them into one product with an option, and deletes the extra copies.
Order after each import: `setup-products.mjs` → `merge-variants.mjs` → `setup-products.mjs` (prices per variant from
`cost`/`kg`, Arabic option names). Data: `merge_variants`, `options`, `kg` and `cost` on the product in `products.json`.

Variants left out (no price from Lebanon, ≤ 3 left, or not released) and families that stay single: Liquitex gesso,
Strathmore 400 sketch pad, Strathmore 300 watercolour pad, Fuxi sketch book, Kala ukulele, Hohner Special 20 and Blues Band,
KZ in-ears, New Bee cable. The guitars and basses show no price from Lebanon: their cost is read at import.

| Product | Option | Values |
|---|---|---|
| Liquitex BASICS Acrylic Paint Set, 12 Tubes | Set | 6 tubes (primary) · 12 tubes · 24 tubes · 36 tubes · 48 tubes |
| Winsor & Newton Drawing Ink, Black Indian, 14 ml | Color | Black Indian · Brick Red · Brilliant Green · Burnt Sienna · Canary Yellow · Violet · White |
| POSCA PC-5M Paint Markers, 8 Colors | Set | 8 colors · 24 colors |
| Arches Cold Press Watercolor Pad, 9 × 12 in | Size | 9 × 12 in, cold press · 9 × 12 in, hot press · 10 × 14 in, cold press |
| Hapikalor Watercolor Pad, 9 × 12 in, 20 Sheets | Size | 5.5 × 8.5 in · 9 × 12 in |
| ESRICH Stretched Canvas, 8 × 10 in, Pack of 5 | Size | 5 × 7 in, 8 canvases · 8 × 10 in, 5 canvases · 9 × 12 in, 5 canvases · 12 × 16 in, 3 canvases |
| ESRICH Canvas Boards, 8 × 10 in, Pack of 5 | Size | 8 × 10 in, 5 boards · 9 × 12 in, 5 boards · 5 × 7 in, 18 boards |
| Pilot Parallel Calligraphy Pen, 3.8 mm | Nib | 1.5 mm · 2.4 mm · 3.0 mm · 3.8 mm |
| upsimples Picture Frames, 8 × 10 in, Set of 5, Black | Color | Black · Natural · Gold · Silver |
| KALOUR Colored Pencils, Set of 72 | Set | 36 pencils · 72 pencils · 120 pencils |
| Ernie Ball Regular Slinky Electric Guitar Strings, 10–46 | Gauge | Regular Slinky 10–46 · Hybrid Slinky 9–46 · Power Slinky 11–48 |
| Elixir NANOWEB Electric Guitar Strings, 10–46 | Gauge | Super Light 9–42 · Light 10–46 · Medium 11–49 |
| D'Addario EXL110 Electric Guitar Strings, 10–46, 3 Sets | Pack | 3 sets · 10 sets |
| Ernie Ball Regular Slinky Bass Strings, 4-String, 50–105 | Gauge | Regular 50–105, 4 strings · Hybrid 45–105, 4 strings · Super 45–100, 4 strings · Regular 45–130, 5 strings |
| Dunlop Tortex Standard Picks, 0.73 mm, 12 Picks | Thickness | 0.50 mm (red) · 0.60 mm (orange) · 0.73 mm (yellow) · 0.88 mm (green) · 1.00 mm (blue) · 1.14 mm (purple) |
| Ernie Ball Polypro Guitar Strap, Black | Color | Black · Cream |
| Fender Polypropylene Guitar Strap, 2 in | Color | Black, white logo · Black, gray logo · Black, red logo |
| Rico Alto Sax Reeds, Strength 2.5, Box of 10 | Strength | 2 · 2.5 · 3 · 3.5 |
| Vandoren Traditional Tenor Sax Reeds, Strength 3, Box of 5 | Strength | 2 · 2.5 · 3 · 3.5 |
| Rico Bb Clarinet Reeds, Strength 2.5, Pack of 3 | Strength | 2 · 2.5 · 3 |
| Vic Firth American Classic 5A Drumsticks | Pack | 1 pair · 3 pairs |
| Evans Genera HD Dry Snare Head, 14 in | Size | 13 in · 14 in |
| Explore Land 61-Key Keyboard Cover | Size | 61 keys · 88 keys |
| Thomastik-Infeld Dominant Violin Strings, 4/4 | Violin size | 4/4 · 3/4 · 1/2 · 1/4 |
| Squier Sonic Stratocaster, Black | Color | Black · Arctic White · Flash Pink · Surf Green · Tahitian Coral |
| Squier Affinity Series Precision Bass PJ, Olympic White | Color | Olympic White · Surf Green · Lake Placid Blue |
| Fender CD-60 V3 Dreadnought Acoustic, Natural, with Case | Color | Natural · Black · Sunburst |
| Casio Casiotone CT-S1 Keyboard, 61 Keys, Red | Color | Black · White · Red |
| Mendini Solid Wood Viola Set, 15 in | Size | 12 in · 14 in · 15 in |
| XLR Microphone Cable, 3 m (10 ft) | Length | 2 m (6.6 ft) · 3 m (10 ft) · 4.5 m (15 ft) |
| Audio-Technica AT-LP60X Automatic Turntable, Black | Color | Black · Brown · Gun-Metal |
| EVEO Clear Outer Record Sleeves, 100 Pack | Type | Outer sleeves, 50 · Outer sleeves, 100 · Inner sleeves, 50 |
