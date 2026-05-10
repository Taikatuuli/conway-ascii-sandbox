# Conway ASCII Sandbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fullscreen browser Conway's Game of Life sandbox rendered entirely in ASCII using a density gradient character set, with mouse drawing and keyboard controls.

**Architecture:** Single `index.html` with embedded CSS and JS. A flat `Uint8Array` double-buffer holds the grid. `requestAnimationFrame` drives rendering; a 100ms tick timer drives simulation. No dependencies.

**Tech Stack:** HTML, CSS, vanilla JS (ES6+), `Uint8Array`, `requestAnimationFrame`

---

## File Structure

| File | Purpose |
|---|---|
| `index.html` | Entire app — CSS, HTML skeleton, JS |

---

### Task 1: HTML/CSS Scaffold

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create `index.html` with fullscreen pre and overlay div**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Conway ASCII Sandbox</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: #0d0a00;
      overflow: hidden;
      width: 100vw;
      height: 100vh;
    }

    #field {
      position: fixed;
      top: 0; left: 0;
      width: 100vw;
      height: 100vh;
      font-family: 'Courier New', Courier, monospace;
      font-size: 14px;
      line-height: 1.4;
      color: #221800;
      white-space: pre;
      cursor: crosshair;
      user-select: none;
    }

    #overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%;
      padding: 8px 16px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 12px;
      color: #555;
      opacity: 0;
      transition: opacity 300ms;
      pointer-events: none;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <pre id="field"></pre>
  <div id="overlay">
    [SPACE] pause · [R] clear · left-drag draw · right-drag erase
  </div>
  <script>
    // implementation goes here
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

Open `index.html` in a browser (drag file into Chrome/Firefox or `open index.html`).
Expected: black/dark orange screen, no scrollbars, no visible text yet.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: html/css scaffold — fullscreen pre and overlay"
```

---

### Task 2: Character Measurement & Grid Init

**Files:**
- Modify: `index.html` (inside `<script>`)

- [ ] **Step 1: Measure character dimensions and compute grid size**

Replace the `// implementation goes here` comment with:

```javascript
const field = document.getElementById('field');
const overlay = document.getElementById('overlay');

// Measure a single character's rendered size
const probe = document.createElement('pre');
probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font-family:"Courier New",Courier,monospace;font-size:14px;line-height:1.4';
probe.textContent = 'X';
document.body.appendChild(probe);
const charW = probe.getBoundingClientRect().width;
const charH = probe.getBoundingClientRect().height;
document.body.removeChild(probe);

const COLS = Math.floor(window.innerWidth / charW);
const ROWS = Math.floor(window.innerHeight / charH);

let current = new Uint8Array(COLS * ROWS);
let next    = new Uint8Array(COLS * ROWS);

// Smoke test: log dimensions
console.log(`Grid: ${COLS} cols × ${ROWS} rows, char: ${charW.toFixed(2)}×${charH.toFixed(2)}px`);
```

- [ ] **Step 2: Verify in browser console**

Open DevTools → Console. Reload.
Expected: something like `Grid: 145 cols × 51 rows, char: 8.40×19.60px` (exact numbers vary by OS/browser).
No errors.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: measure char dimensions and init grid buffers"
```

---

### Task 3: Rule Engine

**Files:**
- Modify: `index.html` (append to `<script>`)

- [ ] **Step 1: Write the rule engine function**

Append after the grid init code:

```javascript
function nextGen(src, dst, cols, rows) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let n = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          n += src[((r + dr + rows) % rows) * cols + ((c + dc + cols) % cols)];
        }
      }
      const alive = src[r * cols + c];
      dst[r * cols + c] = alive ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
    }
  }
}
```

- [ ] **Step 2: Write inline unit tests using console.assert**

Append immediately after `nextGen`:

```javascript
// Unit tests for nextGen
(function testNextGen() {
  // Test: isolated live cell dies
  const g1 = new Uint8Array(9); // 3×3
  g1[4] = 1; // center alive, no neighbors
  const d1 = new Uint8Array(9);
  nextGen(g1, d1, 3, 3);
  console.assert(d1[4] === 0, 'isolated cell should die');

  // Test: dead cell with exactly 3 neighbors is born
  const g2 = new Uint8Array(9); // 3×3
  g2[0] = 1; g2[1] = 1; g2[3] = 1; // three neighbors around center
  const d2 = new Uint8Array(9);
  nextGen(g2, d2, 3, 3);
  console.assert(d2[4] === 1, 'dead cell with 3 neighbors should be born');

  // Test: live cell with 2 neighbors survives
  const g3 = new Uint8Array(9);
  g3[4] = 1; g3[0] = 1; g3[1] = 1; // center + 2 neighbors
  const d3 = new Uint8Array(9);
  nextGen(g3, d3, 3, 3);
  console.assert(d3[4] === 1, 'live cell with 2 neighbors should survive');

  // Test: live cell with 4 neighbors dies (overcrowding)
  const g4 = new Uint8Array(9);
  g4[4] = 1; g4[0] = 1; g4[1] = 1; g4[2] = 1; g4[3] = 1;
  const d4 = new Uint8Array(9);
  nextGen(g4, d4, 3, 3);
  console.assert(d4[4] === 0, 'live cell with 4 neighbors should die');

  console.log('nextGen tests passed');
})();
```

- [ ] **Step 3: Open browser and verify tests pass**

Open DevTools → Console. Reload.
Expected: `nextGen tests passed` with no assertion errors.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: rule engine with toroidal wrap and unit tests"
```

---

### Task 4: Renderer

**Files:**
- Modify: `index.html` (append to `<script>`)

- [ ] **Step 1: Write the neighbor-count helper and charFor function**

Append after the unit tests:

```javascript
function countNeighbors(grid, r, c) {
  let n = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      n += grid[((r + dr + ROWS) % ROWS) * COLS + ((c + dc + COLS) % COLS)];
    }
  }
  return n;
}

// Returns { ch, color } for a cell given alive state and neighbor count
function charFor(alive, neighbors) {
  if (alive) {
    return neighbors === 2 || neighbors === 3
      ? { ch: '█', color: '#ffcc44' }
      : { ch: '▓', color: '#cc9922' };
  }
  if (neighbors === 0) return { ch: '░', color: null };       // default color from CSS
  if (neighbors <= 2)  return { ch: '▒', color: '#443300' };
  return                      { ch: '▓', color: '#886600' };
}
```

- [ ] **Step 2: Write the render function**

Append immediately after `charFor`:

```javascript
function render() {
  const parts = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const alive = current[r * COLS + c];
      const n = countNeighbors(current, r, c);
      const { ch, color } = charFor(alive, n);
      parts.push(color ? `<span style="color:${color}">${ch}</span>` : ch);
    }
    if (r < ROWS - 1) parts.push('\n');
  }
  field.innerHTML = parts.join('');
}

// Smoke test: render a blank grid
render();
```

- [ ] **Step 3: Verify in browser**

Reload. Expected: entire viewport filled with dim `░` characters. No scrollbar. Field fills edge-to-edge.

- [ ] **Step 4: Smoke test with some live cells**

Open DevTools → Console and run:
```javascript
current[Math.floor(ROWS/2) * COLS + Math.floor(COLS/2)] = 1;
current[Math.floor(ROWS/2) * COLS + Math.floor(COLS/2) + 1] = 1;
current[Math.floor(ROWS/2) * COLS + Math.floor(COLS/2) + 2] = 1;
render();
```
Expected: three bright gold `█` characters appear in the center. Surrounding dead cells glow with `▒` or `▓`.

- [ ] **Step 5: Clear the manual test cells**

```javascript
current.fill(0); render();
```
Expected: back to all `░`.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: renderer — density gradient chars and color spans"
```

---

### Task 5: Game Loop

**Files:**
- Modify: `index.html` (append to `<script>`, remove smoke test render call)

- [ ] **Step 1: Remove the smoke test render call**

Delete this line from the end of the script:
```javascript
// Smoke test: render a blank grid
render();
```

- [ ] **Step 2: Write the game loop**

Append to the script:

```javascript
let paused = false;
let lastTick = 0;
const TICK_MS = 100;

function loop(ts) {
  if (!paused && ts - lastTick >= TICK_MS) {
    nextGen(current, next, COLS, ROWS);
    // swap buffers
    const tmp = current;
    current = next;
    next = tmp;
    lastTick = ts;
  }
  render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
```

- [ ] **Step 3: Seed a glider and verify the loop runs**

Open DevTools → Console. Run:
```javascript
// Glider pattern at top-left
const r = 5, c = 5;
current[r*COLS+c+1] = 1;
current[(r+1)*COLS+c+2] = 1;
current[(r+2)*COLS+c] = 1;
current[(r+2)*COLS+c+1] = 1;
current[(r+2)*COLS+c+2] = 1;
```
Expected: a glider pattern moves diagonally across the screen, field animates smoothly.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: game loop — rAF rendering with 100ms tick timer"
```

---

### Task 6: Input Handler

**Files:**
- Modify: `index.html` (append to `<script>`)

- [ ] **Step 1: Write the input handler**

Append to the script (before `requestAnimationFrame(loop)`):

```javascript
let dragging = false;
let drawMode = 1; // 1 = draw, 0 = erase

function cellAt(e) {
  const c = Math.floor(e.clientX / charW);
  const r = Math.floor(e.clientY / charH);
  return { r, c, valid: r >= 0 && r < ROWS && c >= 0 && c < COLS };
}

field.addEventListener('mousedown', e => {
  e.preventDefault();
  dragging = true;
  drawMode = e.button === 2 ? 0 : 1;
  const { r, c, valid } = cellAt(e);
  if (valid) current[r * COLS + c] = drawMode;
});

field.addEventListener('mousemove', e => {
  if (!dragging) return;
  const { r, c, valid } = cellAt(e);
  if (valid) current[r * COLS + c] = drawMode;
});

window.addEventListener('mouseup', () => { dragging = false; });
field.addEventListener('mouseleave', () => { dragging = false; });
field.addEventListener('contextmenu', e => e.preventDefault());
```

- [ ] **Step 2: Verify in browser**

Reload. Click and drag on the field.
Expected:
- Left drag: bright gold `█` cells appear under the cursor as you drag
- Right drag: cells are erased back to dim `░`
- Right-click menu does not appear

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: mouse input — left drag draw, right drag erase"
```

---

### Task 7: Keyboard Controls & Overlay

**Files:**
- Modify: `index.html` (append to `<script>`)

- [ ] **Step 1: Write keyboard handler**

Append to the script:

```javascript
document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    e.preventDefault();
    paused = !paused;
  }
  if (e.code === 'KeyR') {
    current.fill(0);
    next.fill(0);
  }
});
```

- [ ] **Step 2: Write overlay hover handler**

Append to the script:

```javascript
document.addEventListener('mousemove', e => {
  overlay.style.opacity = e.clientY < 60 ? '1' : '0';
});
```

- [ ] **Step 3: Verify in browser**

Reload. Draw some live cells, then:
- Press Space → simulation freezes (cells stop evolving), drawing still works
- Press Space again → simulation resumes
- Press R → grid clears to all `░`
- Move cursor near top of screen → overlay text fades in
- Move cursor away → overlay fades out

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: keyboard controls and hover overlay"
```

---

## Self-Review

**Spec coverage:**
- [x] Fullscreen `<pre>` field — Task 1
- [x] Density gradient chars ░▒▓█ — Task 4
- [x] Character/color mapping table from spec — Task 4 `charFor`
- [x] Double-buffered `Uint8Array` grid — Task 2
- [x] Conway's rules — Task 3
- [x] Toroidal edge wrapping — Task 3
- [x] `requestAnimationFrame` loop, 100ms tick — Task 5
- [x] Left drag draw, right drag erase — Task 6
- [x] Space pause/resume — Task 7
- [x] R clear — Task 7
- [x] Hover overlay fades in within 60px of top — Task 7

**No placeholders, no TODOs found.**

**Type/name consistency:** `current`, `next`, `COLS`, `ROWS`, `charW`, `charH`, `nextGen`, `render`, `charFor`, `countNeighbors`, `cellAt` — consistent across all tasks.
