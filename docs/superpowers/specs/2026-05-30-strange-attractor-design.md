# Strange Attractor Asset Generator — Design Spec
**Date:** 2026-05-30

## Overview

A single-file tool (`attractor.html`) for generating minimalistic background images from the Thomas strange attractor. Interactive live preview with real-time parameter controls, plus SVG export at configurable output resolutions.

Fits the existing project pattern: one self-contained HTML file, fullscreen canvas, slide-up controls panel.

---

## Architecture

**Approach:** Canvas preview + SVG path builder on export.

- The canvas renders the attractor continuously for a smooth interactive experience.
- On export, the simulation is re-run fresh and serialized directly to an SVG string — no canvas involved.
- This keeps the preview fast and the SVG output clean.

---

## Structure

Three logical parts in one HTML file:

1. **Canvas** — fills the viewport, renders the attractor in real-time via `requestAnimationFrame`
2. **Controls panel** — slides up from the bottom on hover (same pattern as `chaos.html`)
3. **Export button** — inside the controls panel, generates and downloads the SVG

---

## Attractor: Thomas

```
dx/dt = sin(y) − b·x
dy/dt = sin(z) − b·y
dz/dt = sin(x) − b·z
```

Single dissipation parameter `b`. Typical range `0.18–0.21`:
- `~0.19` → dense toroidal form
- Higher → thinner, more open
- Lower → increasingly chaotic

---

## Preview Loop

- Each animation frame advances ~500 steps (dt = 0.05), appended to a ring buffer of ~30,000 3D points.
- The canvas clears and redraws the full buffer as a single polyline every frame.
- **Rotation is applied at draw time** — 3D points are stored once, projected on every frame using the current θ/φ. No recomputation needed when angles change.
- Points are scaled to fit the canvas with uniform padding after projection.

### Projection

Each stored point `[x, y, z]` is rotated by yaw θ and pitch φ:

```js
u = cos(θ)·x − sin(θ)·y
v = sin(φ)·(sin(θ)·x + cos(θ)·y) + cos(φ)·z
```

The resulting `[u, v]` pair is the screen coordinate before scaling.

---

## Controls

All controls live in the slide-up panel:

| Control | Type | Range / Options |
|---|---|---|
| `b` (dissipation) | Slider | 0.10 → 0.30 |
| `θ` (yaw) | Slider | 0 → 2π |
| `φ` (pitch) | Slider | −π/2 → π/2 |
| Iterations | Slider | 5,000 → 50,000 |
| Line color | Color picker | — |
| Background color | Color picker | — |
| Line opacity | Slider | 0.2 → 1.0 |

---

## Export

On **Export SVG** click:

1. Re-run the Thomas simulation with current `b`, `iterations`, `θ`, `φ` (clean run, no ring buffer)
2. Scale projected coordinates to the selected output size
3. Build a minimal SVG document:
   ```xml
   <svg xmlns="..." width="W" height="H" viewBox="0 0 W H">
     <rect width="W" height="H" fill="<bg-color>"/>
     <path d="M x,y L x,y ..." fill="none" stroke="<line-color>" stroke-width="1" opacity="<opacity>"/>
   </svg>
   ```
4. Trigger download as `attractor.svg`

### Output Size Presets

| Label | Dimensions |
|---|---|
| 720p | 1280 × 720 |
| 1080p | 1920 × 1080 (default) |
| 1440p | 2560 × 1440 |
| 4K | 3840 × 2160 |

Output size is independent of preview canvas size — preview at screen resolution, export at 4K.

---

## Visual Style

Consistent with the rest of the project:
- Black background (default), no chrome
- Monospace labels, minimal UI
- Controls hidden by default, revealed on hover near bottom edge
- No external dependencies — vanilla JS + Canvas API only

---

## File

- **Output file:** `attractor.html` in project root
- **No new dependencies** — vanilla JS, single file
