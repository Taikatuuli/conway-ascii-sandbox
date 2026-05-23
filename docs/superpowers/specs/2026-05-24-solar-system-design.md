# Solar System Interactive Webpage — Design Spec

**Date:** 2026-05-24
**Status:** Approved

---

## Overview

A standalone `solar-system.html` file — no dependencies, no build step, vanilla HTML/CSS/JS. Displays all 8 planets orbiting the sun in a continuous animation. Clicking a planet zooms in and reveals a fact sheet panel. Entirely separate from the existing Conway sandbox project.

---

## Architecture

Single file: `solar-system.html`.

- **SVG** fills the full viewport and owns all simulation rendering: sun, orbit lines, planet bodies.
- **HTML `<div>` overlay** handles the fact sheet panel (hidden by default).
- **`const PLANETS`** at the top of the `<script>` block holds all planet data as a hardcoded array of objects — easy to edit.
- One `requestAnimationFrame` loop drives all animation.

No external libraries. No build tooling.

---

## Solar System Layout

**View:** Side-angle perspective simulated with flat ellipses — `ry` is approximately 1/5 of `rx` — giving the classic "looking at the solar system from a low angle" look without any CSS 3D transforms or coordinate projection math.

**Sun:** Centered in the SVG.

**Planets:** All 8 (Mercury through Neptune).

- Each planet has an SVG `<ellipse>` orbit line (stroke only, no fill).
- Each planet body is an SVG `<circle>` element with a fill color for now. When 3D renders are ready, replace each `<circle>` with an SVG `<image href="...">` of the same size — no other code changes needed.
- Orbit radii are spaced **logarithmically** so inner planets aren't crushed together and outer planets stay on screen.
- Orbital speeds are **proportional to real periods** (Mercury fast, Neptune barely crawling), scaled so all motion is visible.

---

## Animation

Single `requestAnimationFrame` loop. Each frame:

1. Advance each planet's angle by its orbital speed (radians per frame, derived from real period ratios).
2. Compute `x, y` from the ellipse parametric equation: `x = cx + rx * cos(angle)`, `y = cy + ry * sin(angle)`.
3. Update each planet's SVG `transform` attribute.

Animation continues uninterrupted when a fact sheet is open.

---

## Click & Zoom Interaction

**On planet click:**
1. SVG `viewBox` animates smoothly (~600ms, JS lerp via `requestAnimationFrame`) from the full system view to a close-up centered on the clicked planet.
2. The target is shifted slightly left to leave space for the fact sheet.
3. Simultaneously, the fact sheet slides in from the right.

The planet continues orbiting during and after the zoom. The viewBox tracks the planet's position each frame while zoomed in, so the planet stays roughly centered.

**On close (× button):**
1. Fact sheet slides out to the right.
2. `viewBox` animates back to the full system view.

---

## Fact Sheet Panel

**Position:** Fixed right-side overlay, ~40% viewport width.
**Background:** Semi-transparent dark panel.
**Animation:** CSS `transform: translateX(100%)` → `translateX(0)` on open; reversed on close.

**Contents (top to bottom):**

- × close button — top-right corner, absolute position
- Planet name — large heading
- Stats row: Diameter · Distance from Sun · Moons · Orbital Period
- "Discovery & History" — paragraph text
- "Significance for Humans" — paragraph text

---

## Planet Data (`PLANETS` constant)

Each planet object contains:

```js
{
  name: "Earth",
  color: "#4fa3e0",          // placeholder fill color
  orbitRx: 220,              // SVG units, logarithmically scaled
  orbitRy: 44,               // = orbitRx / 5
  orbitalPeriod: 365.25,     // days (used to compute speed ratio)
  size: 10,                  // planet radius in SVG units
  facts: {
    diameter: "12,742 km",
    distanceFromSun: "149.6 million km",
    moons: 1,
    orbitalPeriod: "365.25 days",
    description: "...",
    discovery: "...",
    significance: "..."
  }
}
```

---

## File Structure

```
solar-system.html    ← entire project lives here
```

---

## Out of Scope

- 3D planet images (user will swap in later via `<image href="...">`)
- Pluto
- Moons orbiting planets
- Real-time accurate planet positions
- Mobile touch handling (can be added later)
