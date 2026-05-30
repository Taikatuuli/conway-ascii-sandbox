# Chaos Game — Free-Form Attractor Painter

**Date:** 2026-05-30  
**File:** `chaos.html`  
**Status:** Approved for implementation

---

## Overview

A single-file interactive experiment where the user places polygon vertices freely on a canvas and watches a fractal attractor assemble itself, dot by dot, through the chaos game algorithm. The core appeal is the real-time morphing: dragging a vertex reshapes the attractor live while particles keep streaming, revealing how geometry encodes structure.

---

## Core Experience

Full-viewport canvas, black background. The canvas starts empty with a single dim hint: *"click to place a vertex"* — which disappears after the first vertex is placed.

- Click anywhere to place a vertex (max 8). Vertices appear as small bright dots labeled V1, V2…
- Once 2+ vertices exist, the chaos game starts automatically
- A seed point jumps between randomly chosen vertices by the jump ratio, plotting each landing position as a tiny colored dot
- The fractal assembles live — structure emerges from noise over hundreds of thousands of iterations

**Space** clears the dot cloud but keeps vertices, so the user can watch the fractal rebuild from scratch. **R** resets everything.

---

## Interactions

| Action | Result |
|---|---|
| Click empty canvas | Place vertex |
| Drag vertex | Morph attractor live, cloud resets |
| Right-click vertex | Remove vertex |
| Space | Clear dot cloud, keep vertices |
| R | Full reset |

---

## Controls Strip

Slides up from the bottom (same pattern as Conway's stamp bar). Contains:

- **Jump ratio** — range 0.3–0.9, default 0.5. The single most important parameter. Controls how far each point jumps toward the chosen vertex.
- **Speed** — range 100–5000 dots/frame, default 1000. Low = meditative; high = instant form.
- **Color mode** — three options:
  - *By vertex* — each vertex owns a hue; its dots inherit it
  - *Single* — pure white on black
  - *Age* — new dots bright, old ones fade, showing the live frontier
- **Presets** — snaps vertices to centered polygon: Triangle (Sierpinski), Square, Pentagon, Hexagon. Clears cloud and restarts on selection.

---

## Algorithm

The chaos game:
1. Pick a random vertex `vk` (with optional restrictions — not in scope for v1)
2. Compute next point: `xn+1 = xn + r · (vk − xn)` where `r` is the jump ratio
3. Plot a dot at `xn+1`
4. Repeat

Each vertex is assigned a color from a fixed hue palette. In *by vertex* mode, the dot inherits the color of the chosen vertex.

---

## Architecture

**Single file:** `chaos.html`, no dependencies, alongside `index.html` and `solar-system.html`.

### Data structures

- `vertices[]` — array of `{x, y, hue}`, max 8 entries
- `dots` — pre-allocated `Float32Array` of `[x, y, colorIndex]` triples, capacity ~5M points. A write pointer advances and wraps, keeping the cloud fresh as old dots are overwritten.

### Rendering

Canvas 2D. Each frame:
1. Clear canvas
2. Batch draw all dots by color (minimize state changes) as 1×1 pixel fills
3. Draw vertex markers on top

No WebGL required — at 5M points, Canvas 2D pixel fills are fast enough.

### Drag behavior

On `mousedown` within hit radius of a vertex, enter drag mode. Each `mousemove` updates vertex position and clears the dot cloud. The chaos game immediately resumes with the new geometry.

### Vertex colors

When vertex set changes, precompute RGBA strings per vertex using evenly spaced hues (e.g., `hsl(i * 360/n, 70%, 65%)`). Age mode overrides color with brightness derived from dot index relative to write pointer.

---

## Visual Style

Consistent with the project's existing experiments:
- Black background (`#000`)
- Minimal UI — controls hidden until needed, hint text disappears after first interaction
- No instructions overlay needed beyond the initial hint
- Vertex labels (V1, V2…) in dim monospace, disappear at high dot density or after a short delay

---

## Out of Scope (v1)

- Vertex restrictions (e.g., "can't repeat same vertex") — powerful but adds UI complexity; consider for a future iteration
- Multiple simultaneous attractors
- Export / save PNG (can add later, consistent with other experiments)
- Mobile / touch support
