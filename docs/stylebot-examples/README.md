# StyleBot design examples (drop folder)

Drop **PNGs, SVGs, and mocks** here for StyleBot art that may later wire into the LogoLab gallery / mark board.

## Rules

- **School-safe** only (classroom-appropriate marks and diagrams).
- **No student PII** — no names, photos, Shop IDs, class lists, or identifiable work.
- Prefer original lab brands / invented marks. Do not drop trademarked logo traces.
- Keep filenames plain (`pictorial-foxfire.png`, `lettermark-study-01.svg`). No spaces if you can help it.

## How LogoLab is served on the hub

`https://apps.kulibert.net/logolab/` is **not** a static copy, git submodule, or symlink inside `trebiluk/apps-kulibert`.

It is a **Vercel rewrite / proxy** from the hub project to the LogoLab deployment:

- Hub: `trebiluk/apps-kulibert` → `vercel.json` rewrites `/logolab` and `/logolab/:path*` to `https://logolab-rho.vercel.app/`
- Canonical app repo: `trebiluk/logolab` (this tree)
- Live classroom door: https://apps.kulibert.net/logolab/

So examples committed here land in **this** repo. Shipping them into the student UI still needs an app change (gallery wiring) — dropping files alone does not publish them to the live mark board.

## Empty keep

`.gitkeep` holds the directory until the first real asset lands.
