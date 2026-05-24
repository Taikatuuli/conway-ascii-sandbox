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
- Orbit ellipses use **real eccentricity values** from NASA/JPL Keplerian elements — Mercury's orbit is noticeably elliptical, most others are nearly circular.
- Orbital speeds use **mean motion** (constant angular speed derived from real periods) — accurate enough visually; full Kepler's equation per-frame is not needed.

---

## Orbital Position Computation

On page load, each planet's **starting angle** is computed from today's date using simplified Keplerian elements (source: NASA/JPL "Keplerian Elements for Approximate Positions of the Major Planets"):

1. Compute days since J2000.0 epoch (2000-Jan-1.5): `d = (today - J2000) / 86400000`
2. For each planet: `M = M0 + n * d` (mean anomaly from mean longitude `M0` and mean motion `n` in degrees/day)
3. Solve Kepler's equation for eccentric anomaly `E`: `E = M + e * sin(M)` (iterate 3–5 times for convergence)
4. Convert to true anomaly `ν`: `tan(ν/2) = sqrt((1+e)/(1-e)) * tan(E/2)`
5. Map `ν` to SVG ellipse angle (adjusting for argument of perihelion so perihelion aligns with the correct point on the display ellipse)

The `requestAnimationFrame` loop then advances each planet by its mean motion each frame — no per-frame Kepler solve needed.

## Animation

Single `requestAnimationFrame` loop. Each frame:

1. Advance each planet's angle by its mean motion (degrees/day converted to radians/frame at 60fps).
2. Compute `x, y` from the ellipse parametric equation: `x = cx + rx * cos(angle)`, `y = cy + ry * sin(angle)`.
3. Update each planet's SVG `transform` attribute.

Planet elements use `will-change: transform` since they update `transform` on every frame.

Orbit easing: `linear` — constant-speed circular motion, the one UI context where linear is correct.

Animation continues uninterrupted when a fact sheet is open.

**Accessibility:** `@media (prefers-reduced-motion: reduce)` pauses the orbit animation loop and disables all transition animations.

---

## Click & Zoom Interaction

**On planet click:**
1. SVG `viewBox` animates (~300ms, `ease-in-out` — on-screen element moving) from the full system view to a close-up centered on the clicked planet.
2. The target is shifted slightly left to leave space for the fact sheet.
3. Simultaneously, the fact sheet slides in from the right (~300ms, `ease-out` — element entering the screen).

Zoom and fact sheet use the same duration (300ms) — paired elements rule, they animate as a unit.

The planet continues orbiting during and after the zoom. The viewBox tracks the planet's position each frame while zoomed in, so the planet stays roughly centered.

**On close (× button):**
1. Fact sheet slides out to the right (~240ms, `ease-out` — ~20% faster than entrance per exit convention).
2. `viewBox` animates back to the full system view (~300ms, `ease-in-out`).

---

## Fact Sheet Panel

**Position:** Fixed right-side overlay, ~40% viewport width.
**Background:** Semi-transparent dark panel.
**Animation:** CSS `transform: translateX(100%)` → `translateX(0)` on open (300ms, `ease-out`); `translateX(0)` → `translateX(100%)` on close (240ms, `ease-out`).

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
  orbitRy: 44,               // = orbitRx / 5 (display — aspect ratio of angled view)
  size: 10,                  // planet radius in SVG units
  // Keplerian elements (NASA/JPL J2000 values)
  a: 1.00000011,             // semi-major axis (AU)
  e: 0.01671022,             // eccentricity
  M0: 100.46435,             // mean longitude at J2000 (degrees)
  n: 0.98560028,             // mean motion (degrees/day)
  w: 102.94719,              // longitude of perihelion (degrees)
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
- Full Kepler's equation per-frame (mean motion is sufficient visually)
- Mobile touch handling (can be added later)
