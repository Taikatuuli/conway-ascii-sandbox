# Generation Counter — Design Spec

**Date:** 2026-05-10  
**Status:** Approved

## Overview

A small always-visible generation counter fixed to the bottom-right corner of the viewport. It increments each simulation tick and resets when the grid is cleared.

## Visual Design

- **Content:** `GEN 0`, updating to `GEN 142` etc. on each tick
- **Position:** `position: fixed; bottom: 12px; right: 16px; z-index: 5`
- **Font:** Courier New, 12px, letter-spacing 1px
- **Color:** `#886600` (medium gold — readable without competing with the field)
- **No background, no border** — sits directly over the field, unobtrusive

## Architecture

All changes to `index.html` only.

### HTML addition

```html
<div id="gen-counter">GEN 0</div>
```

Added to `<body>` alongside `#field` and `#overlay`.

### CSS addition

```css
#gen-counter {
  position: fixed;
  bottom: 12px;
  right: 16px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 12px;
  letter-spacing: 1px;
  color: #886600;
  pointer-events: none;
  z-index: 5;
}
```

### JS additions

- `let gen = 0` declared alongside `paused`, `lastTick`, `TICK_MS`
- `const genCounter = document.getElementById('gen-counter')` alongside `field` and `overlay`
- Inside `loop()`, after the buffer swap: `gen++; genCounter.textContent = \`GEN ${gen}\`;`
- Inside the `KeyR` handler: `gen = 0; genCounter.textContent = 'GEN 0';`

## Non-Goals

- No pause indicator in the counter (e.g. `GEN 142 ⏸`)
- No population count
- No elapsed time display
