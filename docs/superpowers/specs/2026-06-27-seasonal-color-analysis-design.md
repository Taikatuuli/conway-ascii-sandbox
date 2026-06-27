# Seasonal — Color Palette Explorer

**Date:** 2026-06-27
**Type:** New standalone HTML page

## Overview

A self-contained single HTML file (`seasonal.html`) where a user uploads a photo of themselves and tries on the 12 seasonal color palettes to visually determine which season suits their complexion. No automated analysis — the user browses and decides for themselves.

## Core Flow

1. **Upload screen** — drag-and-drop or click to upload a photo. Photo is read via FileReader and stays entirely in the browser (never sent anywhere).
2. **Explorer screen** — photo displayed with a colored background; user browses palettes and toggles view modes until they find their season.

## View Modes

Three modes, toggled via a pill toggle in the photo panel:

### Solid
A single swatch color fills the entire background behind the photo. Clicking any swatch in the palette panel updates the background color instantly.

### Stripes
The currently selected sub-season's palette colors appear as equal-width vertical strips behind the photo — mimicking a real color draping session.

### Metals
The palette panel dims (non-interactive). Two buttons appear below the photo: **✦ Gold** and **✦ Silver**. Clicking each fills the background with the corresponding foil texture image (user-provided, embedded as base64 in the HTML). This is a quick undertone check.

## Season Data — 12 Sub-Seasons

Organized into 4 family tabs. Each sub-season has a name, 3 trait keywords, and 5 hex swatches.

| Family | Sub-season | Traits |
|--------|-----------|--------|
| Spring | True Spring | Warm · Clear · Medium |
| Spring | Light Spring | Warm · Delicate · Light |
| Spring | Bright Spring | Warm · Vivid · High contrast |
| Summer | Light Summer | Cool · Soft · Light |
| Summer | True Summer | Cool · Muted · Medium |
| Summer | Soft Summer | Cool · Greyed · Neutral |
| Autumn | Soft Autumn | Warm · Muted · Neutral |
| Autumn | True Autumn | Warm · Rich · Medium |
| Autumn | Deep Autumn | Warm · Deep · Saturated |
| Winter | Deep Winter | Cool · Deep · Rich |
| Winter | True Winter | Cool · High contrast · Vivid |
| Winter | Bright Winter | Cool · Vivid · High contrast |

## UI Layout

**Header** (full width): App name "Seasonal" with four season color dots (spring peach, summer blue, autumn tan, winter navy). "Upload new photo" link on the right resets to the upload screen.

**Left panel** (flexible width): Mode toggle at top, photo frame (rounded rectangle, ~200×260px) in center, contextual controls below (swatch hint in Solid/Stripes; gold/silver chips in Metals).

**Right panel** (fixed ~270px): Family tabs (Spring/Summer/Autumn/Winter) at top. Scrollable list of 3 sub-season cards below — each card shows the sub-season name, traits, and 5 clickable swatches. Active swatch and active sub-season are both visually indicated. Footer bar shows current context.

## Assets

Two foil texture images (user-provided):
- **Gold foil** — warm golden metallic texture
- **Silver foil** — cool silver metallic texture

Both embedded as base64 data URLs so the file remains fully self-contained. Applied via CSS `background-image` on the photo frame background div.

## Implementation Notes

- Single file, no build step, no dependencies, no CDN.
- Photo loaded with `FileReader.readAsDataURL`, displayed via `<img>` tag inside the photo frame.
- Photo frame uses `position: relative`; background layer is `position: absolute; inset: 0` behind the photo.
- Stripes mode: dynamically generates N equal-width `<div>` strips from the active sub-season's swatch array.
- Metals mode: switches background to `background-image: url(...)` with the embedded base64 texture.
- Active state tracked in JS: `{ mode, familyIndex, subSeasonIndex, swatchIndex }`.
- All state changes re-render only the background layer — photo element stays mounted.

## Out of Scope

- Automated color analysis of the uploaded photo
- Saving or sharing results
- Mobile layout (desktop-first for now)
- More than 5 swatches per sub-season
