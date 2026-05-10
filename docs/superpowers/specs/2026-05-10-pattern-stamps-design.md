# Pattern Stamps — Design Spec

**Date:** 2026-05-10  
**Status:** Approved

## Overview

A fixed bottom toolbar with 4 named pattern buttons. Clicking one enters stamp mode: a ghost preview follows the cursor across the field, and clicking places the pattern into the grid. Stamp mode is cancelled by clicking the active button again or pressing Escape. The stamp stays selected after placing so the user can drop multiple copies.

## Patterns

| Name | Size | Description |
|---|---|---|
| Glider | 3×3 | Travels diagonally forever |
| Blinker | 1×3 | Simplest oscillator, period 2 |
| Pulsar | 13×13 | Symmetric period-3 oscillator |
| Gosper Gun | 9×36 | Fires a glider every 30 ticks |

### Pattern cell data (row, col offsets from top-left)

**Glider:**
```javascript
[[0,1],[1,2],[2,0],[2,1],[2,2]]
```

**Blinker:**
```javascript
[[0,0],[0,1],[0,2]]
```

**Pulsar:**
```javascript
[
  [0,2],[0,3],[0,4],[0,8],[0,9],[0,10],
  [2,0],[2,5],[2,7],[2,12],
  [3,0],[3,5],[3,7],[3,12],
  [4,0],[4,5],[4,7],[4,12],
  [5,2],[5,3],[5,4],[5,8],[5,9],[5,10],
  [7,2],[7,3],[7,4],[7,8],[7,9],[7,10],
  [8,0],[8,5],[8,7],[8,12],
  [9,0],[9,5],[9,7],[9,12],
  [10,0],[10,5],[10,7],[10,12],
  [12,2],[12,3],[12,4],[12,8],[12,9],[12,10]
]
```

**Gosper Glider Gun:**
```javascript
[
  [0,24],
  [1,22],[1,24],
  [2,12],[2,13],[2,20],[2,21],[2,34],[2,35],
  [3,11],[3,15],[3,20],[3,21],[3,34],[3,35],
  [4,0],[4,1],[4,10],[4,16],[4,20],[4,21],
  [5,0],[5,1],[5,10],[5,14],[5,16],[5,17],[5,22],[5,24],
  [6,10],[6,16],[6,24],
  [7,11],[7,15],
  [8,12],[8,13]
]
```

## Visual Design

### Toolbar

- `position: fixed; bottom: 0; left: 0; right: 0`
- `background: rgba(13,10,0,0.95); border-top: 1px solid #332200`
- `padding: 6px 12px; display: flex; align-items: center; gap: 2px`
- Label: `STAMPS` in `#443300`, 10px, letter-spacing 1px, margin-right 8px
- Hint text: `ESC to cancel` in `#332200`, 10px, shown only when a stamp is active

### Buttons (unselected)

- `border: 1px solid #443300; color: #664400; font-size: 10px; letter-spacing: 1px; padding: 4px 12px; cursor: pointer`

### Buttons (selected)

- `border: 1px solid #ffcc44; color: #ffcc44; background: rgba(255,204,68,0.08)`

### Ghost preview

- Ghost cells rendered in `#cc9922` over the field as the cursor moves
- Rendered by the `render()` function using a `ghostCells` array — not written to the grid
- Clipped to valid grid bounds (cells that would fall outside the grid are skipped)

### Gen counter z-index

The gen counter sits at `z-index: 5`. The toolbar sits at `z-index: 6` so it renders above it.

## Behaviour

**Entering stamp mode:**
- Click a pattern button → `activePattern` set to that pattern object, button highlights, hint text appears
- Cursor remains crosshair (already set globally)

**Ghost preview:**
- On `mousemove` over `#field`, compute top-left grid position from cursor coordinates
- Build `ghostCells` array: pattern offsets + cursor position, filtered to valid bounds
- Set `dirty = true` to trigger a render

**Placing a stamp:**
- On `mousedown` over `#field` while `activePattern` is set:
  - Intercept before the normal draw handler runs
  - Write pattern cells to `current[]`, set `dirty = true`
  - Stamp stays active (do not clear `activePattern`) so multiple copies can be placed
  - Normal left/right drag drawing is suppressed while stamp mode is active

**Cancelling stamp mode:**
- Click the active button again → `activePattern = null`, ghost clears, hint hides
- Press Escape → same

**Interaction with existing controls:**
- Space (pause) and R (clear) still work normally during stamp mode
- R resets `gen`, clears grid, and clears any ghost

## Architecture

All changes to `index.html` only.

### HTML addition

```html
<div id="stamp-bar">
  <span id="stamp-label">STAMPS</span>
  <button class="stamp-btn" data-pattern="glider">GLIDER</button>
  <button class="stamp-btn" data-pattern="blinker">BLINKER</button>
  <button class="stamp-btn" data-pattern="pulsar">PULSAR</button>
  <button class="stamp-btn" data-pattern="gosper">GOSPER GUN</button>
  <span id="stamp-hint">ESC to cancel</span>
</div>
```

### CSS additions

```css
#stamp-bar {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: rgba(13,10,0,0.95);
  border-top: 1px solid #332200;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 12px;
  font-family: 'Courier New', Courier, monospace;
  z-index: 6;
}

#stamp-label {
  color: #443300;
  font-size: 10px;
  letter-spacing: 1px;
  margin-right: 8px;
}

.stamp-btn {
  border: 1px solid #443300;
  background: none;
  color: #664400;
  font-family: 'Courier New', Courier, monospace;
  font-size: 10px;
  letter-spacing: 1px;
  padding: 4px 12px;
  cursor: pointer;
}

.stamp-btn.active {
  border-color: #ffcc44;
  color: #ffcc44;
  background: rgba(255,204,68,0.08);
}

#stamp-hint {
  color: #332200;
  font-size: 10px;
  margin-left: 12px;
  display: none;
}

#stamp-hint.visible {
  display: inline;
}
```

### JS additions

**Pattern data:**
```javascript
const PATTERNS = {
  glider:  { name: 'GLIDER',     cells: [[0,1],[1,2],[2,0],[2,1],[2,2]] },
  blinker: { name: 'BLINKER',    cells: [[0,0],[0,1],[0,2]] },
  pulsar:  { name: 'PULSAR',     cells: [[0,2],[0,3],[0,4],[0,8],[0,9],[0,10],[2,0],[2,5],[2,7],[2,12],[3,0],[3,5],[3,7],[3,12],[4,0],[4,5],[4,7],[4,12],[5,2],[5,3],[5,4],[5,8],[5,9],[5,10],[7,2],[7,3],[7,4],[7,8],[7,9],[7,10],[8,0],[8,5],[8,7],[8,12],[9,0],[9,5],[9,7],[9,12],[10,0],[10,5],[10,7],[10,12],[12,2],[12,3],[12,4],[12,8],[12,9],[12,10]] },
  gosper:  { name: 'GOSPER GUN', cells: [[0,24],[1,22],[1,24],[2,12],[2,13],[2,20],[2,21],[2,34],[2,35],[3,11],[3,15],[3,20],[3,21],[3,34],[3,35],[4,0],[4,1],[4,10],[4,16],[4,20],[4,21],[5,0],[5,1],[5,10],[5,14],[5,16],[5,17],[5,22],[5,24],[6,10],[6,16],[6,24],[7,11],[7,15],[8,12],[8,13]] },
};
```

**State:**
```javascript
let activePattern = null;   // null | pattern object
let ghostCells = [];        // [{r, c}] — cells to highlight in render
let ghostOrigin = { r: 0, c: 0 }; // top-left of ghost
```

**`render()` change** — after building each cell's character, check if `{r, c}` is in `ghostCells` set and override with `{ ch: '█', color: '#cc9922' }` if so. Use a `Set` of `r*COLS+c` keys for O(1) lookup.

**Stamp button handler:**
```javascript
document.querySelectorAll('.stamp-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.pattern;
    if (activePattern && activePattern === PATTERNS[key]) {
      // deselect
      activePattern = null;
      ghostCells = [];
      dirty = true;
      document.querySelectorAll('.stamp-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('stamp-hint').classList.remove('visible');
    } else {
      activePattern = PATTERNS[key];
      document.querySelectorAll('.stamp-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('stamp-hint').classList.add('visible');
    }
  });
});
```

**`mousemove` handler change** — after the overlay opacity update, add:
```javascript
if (activePattern) {
  const { r, c } = cellAt(e);
  ghostOrigin = { r, c };
  ghostCells = activePattern.cells
    .map(([dr, dc]) => ({ r: r + dr, c: c + dc }))
    .filter(({ r, c }) => r >= 0 && r < ROWS && c >= 0 && c < COLS);
  dirty = true;
}
```

**`mousedown` handler change** — at the top of the handler, intercept stamp placement:
```javascript
if (activePattern) {
  e.preventDefault();
  ghostCells.forEach(({ r, c }) => { current[r * COLS + c] = 1; });
  dirty = true;
  return; // skip normal draw/erase
}
```

**`keydown` handler change** — add Escape handling:
```javascript
if (e.code === 'Escape' && activePattern) {
  activePattern = null;
  ghostCells = [];
  dirty = true;
  document.querySelectorAll('.stamp-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('stamp-hint').classList.remove('visible');
}
```

**`KeyR` handler change** — clear ghost on reset:
```javascript
ghostCells = [];
```

## Non-Goals

- No pattern rotation or flip
- No drag-to-place (single click only)
- No custom pattern import
