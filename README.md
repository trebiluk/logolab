# BertyBot's LogoLab

Grades 6–8 looking-and-thinking unit on how logos work. Original lab brands, broken clinic marks, paper sketching, ELL supports, XP, and printables. **Not a logo generator.**

**Classroom door:** [apps.kulibert.net/logolab](https://apps.kulibert.net/logolab/) (same-origin Tech Room tile)  
**Live:** [logolab-rho.vercel.app/logolab](https://logolab-rho.vercel.app/logolab/)  
**No student accounts.** Progress stays in the browser (`localStorage`).

## For class

Open the Tech Room tile **LogoLab**. Students can:

- Warm up from memory, walk five lessons, play studio games (keys 1–9)
- Switch English / Español, hear glossary terms
- Print worksheets and a certificate
- Brag a rank + XP on the score wall

Famous real logos stay in talk and paper sketches — they are not copied on screen.

## KuliNet design examples

StyleBot’s KuliNet pack for this looking unit (Diego / Flo). Not wired into the student app, and not a hub-tile swap on apps.kulibert.net.

- [LogoLab design examples brief](docs/stylebot-examples/STYLEBOT-LOGOLAB-DESIGN-EXAMPLES.md)
- [Parent brand kit](docs/brand/kulinet/STYLEBOT-KULINET-BRAND.md)
- [Hub icon file map](docs/brand/kulinet/STYLEBOT-HUB-ICON-SYSTEM.md) — names and sizes only; live hub HTML stays on HOLD
- [Family logo board](docs/brand/kulinet/kulinet-family-logo-board.png)

## Deploy

Vercel project **logolab**, GitHub `trebiluk/logolab` `main`. Auth off. No database.

```sh
npm install
npm run dev      # local
npm run build    # production
```
