# Wordlay — Design Spec

**Date:** 2026-05-26  
**Status:** Approved

---

## Overview

Wordlay is a fridge-magnet poetry app. Users receive a random curated set of word tiles and arrange them on a square canvas. When happy with their poem, they can share it as a PNG image and/or a link that lets someone else view the poem and start their own.

Poems should feel snappy and meme-able. The interaction should feel tactile and magnetic.

---

## File Structure

```
wordlay/
  index.html   — markup and entry point
  style.css    — all styles
  script.js    — all logic, word bank included
```

Lives alongside `solar-system.html` and `index.html` (Game of Life) in the project root as a subfolder. No build step. No framework dependencies except one CDN script (`html2canvas`) for PNG export.

---

## Layout

Three zones stacked vertically, full viewport width:

1. **Top bar** — "Wordlay" logo (left), "🔀 New words" button + "Share ↗" button (right)
2. **Square canvas** — `width: 100vw; aspect-ratio: 1 / 1`. Light grey background (`#f9f9f9`). Subtle dot-grid overlay as visual snap hint. Tiles are absolutely-positioned children of this element.
3. **Card pile tray** — sits below the canvas. Displays remaining words as a stacked pile. Shows word count ("N words remaining"). Tap pile to cycle to next word; drag top card onto canvas to place it.

---

## Canvas & Tile Behaviour

- **Grid:** 24px snap grid. On pointer-up, tile position is rounded to nearest grid cell via `Math.round(x / 24) * 24`.
- **Snap feel:** `transition: left 80ms ease-out, top 80ms ease-out` applied on drop only (removed during drag for responsiveness).
- **Dragging:** Pointer Events API (`pointerdown`, `pointermove`, `pointerup`). `touch-action: none` on tiles to prevent scroll conflict on mobile.
- **Placing:** Dragging the top card from the pile onto the canvas removes it from the pile and adds it as a positioned tile on the canvas.
- **Discarding:** Dragging a placed tile to the canvas edge (within 20px of any edge) returns it to the bottom of the pile and removes it from the canvas.
- **Free arrangement:** Tiles can overlap freely. No collision detection.
- **Z-index:** The actively dragged tile always renders on top (`z-index: 1000` while dragging).

---

## Card Pile Tray

- Renders as a stacked visual (top 3 cards shown offset, rest hidden).
- Top card shows the current word. Cards beneath show as blank offset layers for depth.
- **Tap to cycle:** Tapping the pile (without dragging) moves the top card to the bottom, revealing the next word.
- **Drag to place:** Dragging the top card onto the canvas area and releasing places it at the drop position (snapped to grid).
- **Count label:** "N words remaining" updates as tiles are placed or discarded.
- **Empty state:** When all words are on the canvas, pile area shows "All words placed".

---

## Word Bank

Stored as a plain JS array in `script.js`, words tagged by type. The draw algorithm guarantees a balanced hand every session.

| Bucket | Bank size | Drawn per session |
|---|---|---|
| Nouns (concrete) | ~80 | 10 |
| Nouns (abstract) | ~40 | 5 |
| Verbs | ~80 | 10 |
| Adjectives | ~60 | 8 |
| Adverbs | ~30 | 4 |
| Prepositions / conjunctions | ~20 | all (~8) |
| Articles / pronouns | ~15 | all (~6) |

**~51 words per session.** Draw algorithm shuffles within each bucket independently, then draws the quota from each. Punchy nouns and verbs are marked as `priority: true` — these are placed at the top of the pile so the first few flips feel immediately interesting.

Word balance is explicitly designed to be tunable after playtesting.

---

## Sharing

"Share ↗" opens a small action sheet (positioned below the button) containing:

1. An optional **@name input field** — placeholder `your @name (optional)`. Value is remembered in `localStorage` so repeat sharers don't have to retype it. Max 30 characters, no spaces.
2. **Download image** button
3. **Copy link** button

### Attribution overlay
If an @name is entered, the exported PNG and the share-link read-only view both display an attribution line overlaid in the bottom-left corner of the canvas square:

> Made by **@username** · Wordlay

Styled as small white text on a subtle dark scrim (semi-transparent black gradient rising from the bottom edge). If no @name is entered, no overlay is shown.

### Download PNG
- `html2canvas` renders the square canvas element to a `<canvas>`, including the attribution overlay if present.
- Result is downloaded as `wordlay.png` via a temporary `<a download>` link.
- Exported image: canvas only (no top bar, no tray). Exactly 1:1 square.

### Copy Link
- Poem state is serialised as a compact JSON object: `{ tiles: [{ word, x, y }, ...], author: "@username" | null }`.
- Serialised with `JSON.stringify`, then `btoa()` to base64.
- Written to `window.location.hash`: `wordlay/#<base64string>`.
- URL is copied to clipboard via `navigator.clipboard.writeText()`.
- Button label briefly changes to "Copied!" as confirmation.

---

## Share Link Landing

When `window.location.hash` is non-empty on page load:

1. Decode the hash: `JSON.parse(atob(hash))`.
2. Render the poem in **read-only mode**: tiles positioned as encoded, non-draggable, canvas has a subtle overlay.
3. If `author` is present in the decoded state, display the attribution overlay ("Made by @username · Wordlay") in the bottom-left corner of the canvas, matching the PNG export appearance.
4. Show a **"Make your own →"** button prominently (centred below canvas).
5. Clicking "Make your own →" clears the hash from the URL, generates a fresh random word set, and enters normal interactive mode.

If hash decoding fails (malformed URL), silently fall back to a normal fresh session.

---

## "New Words" Button

Clicking "🔀 New words" in the top bar:
- Clears all placed tiles from the canvas.
- Draws a fresh random hand from the word bank.
- Resets the pile tray.
- No confirmation prompt — action is immediately reversible by refreshing (state is not persisted between sessions unless shared via URL).

---

## Aesthetic

Clean & Modern (to be refined by the user):
- Canvas background: `#f9f9f9`
- Tile background: `#ffffff`, border `1px solid #e5e5e5`, `border-radius: 6px`, subtle box-shadow
- Tile font: system sans-serif, `font-weight: 600`, `font-size: 14px`
- Slight random rotation per tile (`-1deg` to `+1deg`) applied once on creation for a natural feel
- Top bar: white, `border-bottom: 1px solid #e5e5e5`

---

## Out of Scope

- Persistent storage (no localStorage, no backend)
- User accounts
- Multiple theme packs
- Undo/redo history
- Collaborative / real-time multiplayer
