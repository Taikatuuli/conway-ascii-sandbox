# Start Screen — Design Spec

**Date:** 2026-05-10  
**Status:** Approved

## Overview

A start screen overlay that appears when the page loads. It explains what Conway's Game of Life is and how to play, floats over a live simulation running behind it, and is dismissed by clicking a visible `[ BEGIN ]` button.

## Visual Design

A centered panel with a semi-transparent dark background (`rgba(13,10,0,0.92)`) and a `#886600` border, rendered in the same monospace font and color palette as the game.

**Color palette:**
- Title: `#ffcc44` (bright gold)
- Section labels: `#cc9922` (medium gold)
- Body text: `#ffdd88` (light gold, high contrast)
- Dividers: `#554400`
- Button border + text: `#ffcc44`
- Panel border: `#886600`

**Panel content (top to bottom):**

1. **Title** — `CONWAY ASCII SANDBOX`, letter-spacing 3px, centered
2. **Subtitle** — `a cellular automaton`, smaller, centered
3. **Divider**
4. **Section: THE RULES** — three lines, each prefixed with the relevant density character:
   - `█  alive + 2 or 3 neighbors → survives`
   - `░  alive + any other count  → dies`
   - `▓  dead  + exactly 3 neighbors → born`
5. **Divider**
6. **Section: CONTROLS** — four lines:
   - `left drag   → draw cells`
   - `right drag  → erase cells`
   - `space       → pause / resume`
   - `r           → clear grid`
7. **Divider**
8. **`[ BEGIN ]` button** — centered, bordered in `#ffcc44`

## Behaviour

**On load:**
- The simulation starts running immediately with ~30% of cells randomly seeded alive. This makes the field visually alive and animating behind the overlay before the user clicks Begin.
- The start screen is visible on top.
- Keyboard controls (Space, R) and mouse drawing are disabled while the start screen is visible.

**On Begin click:**
- The `#start-screen` div transitions `opacity` from `1` to `0` over 400ms (CSS transition).
- After the transition ends (`transitionend` event), the element is removed from the DOM.
- Keyboard and mouse controls become active.

## Architecture

All changes are to `index.html` only.

### HTML additions

```
<div id="start-screen">
  <div id="start-panel">
    <!-- title, subtitle, rules, controls, begin button -->
  </div>
</div>
```

`#start-screen`: `position: fixed; inset: 0` — covers the full viewport, centers the panel via flexbox.

`#start-panel`: the visible card with border, padding, and content.

### CSS additions

- `#start-screen`: fixed, full viewport, flex center, `z-index: 10`, `opacity: 1`, `transition: opacity 400ms`
- `#start-panel`: `background: rgba(13,10,0,0.92)`, `border: 1px solid #886600`, max-width, padding
- `#begin-btn`: `border: 1px solid #ffcc44`, `color: #ffcc44`, `cursor: pointer`, hover brightens slightly

### JS additions

**Random seed function** — called once before the loop starts (replacing the implicit blank start):
```javascript
function randomSeed(density = 0.3) {
  for (let i = 0; i < current.length; i++) {
    current[i] = Math.random() < density ? 1 : 0;
  }
  dirty = true;
}
```

**Input guard** — `mousedown` and `keydown` handlers check `if (startScreenVisible) return` before acting. A boolean `let startScreenVisible = true` is set to `false` when Begin is clicked.

**Begin handler:**
```javascript
document.getElementById('begin-btn').addEventListener('click', () => {
  const screen = document.getElementById('start-screen');
  screen.style.opacity = '0';
  screen.addEventListener('transitionend', () => screen.remove(), { once: true });
  startScreenVisible = false;
});
```

## Non-Goals

- No animated intro sequence
- No skip-on-any-key (button click only, per design decision)
- No "don't show again" persistence
