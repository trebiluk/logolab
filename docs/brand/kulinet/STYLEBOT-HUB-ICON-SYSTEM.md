# StyleBot → Debugzy — Tech Room hub icon system

**GO:** Flo / Diego 2026-09-22 · color firm logos per app  
**Art source:** `shared/brand/kulinet/kulinet-family-logo-board.png` · kit `STYLEBOT-KULINET-BRAND.md`  
**Repo target:** `trebiluk/apps-kulibert` (and LogoLab repo when examples land)  
**HOLD:** no hub HTML thrash until you cut; StyleBot art is source of truth

---

## Files (propose under `apps-kulibert/icons/` or `public/icons/`)

Export from board / redraw as SVG (prefer SVG for Chromebook):

| File | App | Notes |
|------|-----|-------|
| `icon-kulinet-k.svg` | Parent corner | K on triad plate · also 32/48/64 png |
| `icon-techworks.svg` | TechWorks | Geometric T |
| `icon-baboo.svg` | Baboo | Floor-plan · Stark blue |
| `icon-koderized.svg` | Koderized | `</>` |
| `icon-bertycad.svg` | BertyCAD | Iso cube |
| `icon-bertybots.svg` | Berty’s Botz | Microchip |
| `icon-berty-run.svg` | Berty Run | Shop robot head |
| `icon-sprocket.svg` | Sprocket | Gear |
| `icon-drift.svg` | Drift | Nodes |
| `icon-den.svg` | Bearcat Den | Briefcase |
| `icon-paperlab.svg` | PaperLab | Bookmark |
| `icon-logolab.svg` | LogoLab | Camera/frame |
| `icon-tech-room.svg` | Tech Room | Triad door / play-in-plate |

**Sizes for hub tiles:** SVG primary · PNG fallbacks `@1x 72` · `@2x 144` (tile ~6.9–7.6rem).  
**Corner mark:** 24 / 32 / 48 px.

---

## Hub wiring rules

1. Each `a.tile` uses that app’s firm SVG — **color** stroke/fill per kit accents.  
2. Label = product name (Berty Run not Pipe Draft).  
3. Hits stay ≥44 · icon + text.  
4. Do not reuse one cyan Lucide for all.  
5. KuliNet **K** badge optional in hub footer / About — required later in each product chrome.

---

## Acceptance

Hard-refresh apps.kulibert.net → tiles match board marks · no pipe leftover on Berty Run · Baboo stays floor-plan not wrench.

*StyleBot · 2026-09-22*
