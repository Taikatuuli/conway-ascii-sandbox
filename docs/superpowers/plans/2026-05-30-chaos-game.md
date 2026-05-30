# Chaos Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `chaos.html` — a free-form chaos game attractor painter where the user places vertices, watches a fractal assemble dot by dot, and can drag vertices to morph the attractor live.

**Architecture:** Single self-contained HTML file (no dependencies, no build step). A `requestAnimationFrame` render loop runs the chaos game engine (N steps/frame into a pre-allocated Float32Array) and blits results directly to canvas pixels via `ImageData` for maximum throughput at 5M points. Controls slide up from the bottom on hover.

**Tech Stack:** Vanilla JS, Canvas 2D API (`ImageData` for pixel writes), CSS transitions for UI animations.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `chaos.html` | Create | Everything — shell, styles, canvas, engine, UI, render loop |

---

### Task 1: HTML Shell & Canvas

**Files:**
- Create: `chaos.html`

- [ ] **Step 1: Create the file**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Chaos Game</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: #000;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    #c {
      display: block;
      cursor: crosshair;
    }
  </style>
</head>
<body>
<canvas id="c"></canvas>
<script>
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  function frame() {
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
</script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Open `chaos.html` directly in a browser. Expected: black full-viewport canvas, no scrollbars, no errors in console.

- [ ] **Step 3: Commit**

```bash
git add chaos.html
git commit -m "feat: chaos game shell with canvas and RAF loop"
```

---

### Task 2: Vertex Placement & Rendering

**Files:**
- Modify: `chaos.html`

Vertices are stored as `{x, y, hue}` objects. Max 8. Clicking empty canvas places a vertex. Each vertex renders as a bright dot with a small label (V1, V2…). An initial hint text disappears after the first vertex is placed.

- [ ] **Step 1: Add vertex state and hint HTML**

Add before `</style>`:
```css
#hint {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255,255,255,0.25);
  font-size: 13px;
  letter-spacing: 0.12em;
  pointer-events: none;
  transition: opacity 600ms;
}
#hint.hidden { opacity: 0; }
```

Add before `</body>`:
```html
<div id="hint">click to place a vertex</div>
```

- [ ] **Step 2: Add vertex state and constants**

Add inside `<script>` after `resize()`:
```js
const MAX_VERTICES = 8;
const VERTEX_RADIUS = 8; // px hit radius
const HUES = [0, 210, 120, 40, 280, 170, 330, 60]; // one per vertex slot
let vertices = []; // [{x, y, hue}]

const hint = document.getElementById('hint');
```

- [ ] **Step 3: Add vertex rendering**

Add inside `frame()`, replacing its empty body:
```js
function frame() {
  requestAnimationFrame(frame);
  // (dot render will go here in Task 4)
  renderVertices();
}

function renderVertices() {
  vertices.forEach((v, i) => {
    // Glow
    const grad = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, 16);
    grad.addColorStop(0, `hsla(${v.hue},80%,70%,0.5)`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(v.x, v.y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Dot
    ctx.fillStyle = `hsl(${v.hue},80%,70%)`;
    ctx.beginPath();
    ctx.arc(v.x, v.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.fillStyle = `hsla(${v.hue},60%,70%,0.7)`;
    ctx.font = '11px monospace';
    ctx.fillText(`V${i + 1}`, v.x + 10, v.y - 8);
  });
}
```

- [ ] **Step 4: Add click-to-place handler**

Add after the `renderVertices` function:
```js
canvas.addEventListener('click', e => {
  if (e.button !== 0) return;
  // Don't place if clicking near existing vertex
  const near = vertices.find(v => dist(v, e) < VERTEX_RADIUS * 2);
  if (near) return;
  if (vertices.length >= MAX_VERTICES) return;

  const hue = HUES[vertices.length];
  vertices.push({ x: e.clientX, y: e.clientY, hue });

  if (vertices.length === 1) hint.classList.add('hidden');
});

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
```

- [ ] **Step 5: Verify in browser**

Open `chaos.html`. Click to place vertices — each should appear as a colored glowing dot with a label (V1, V2…). Hint text should disappear after the first click. Clicking near an existing vertex should not place a new one. Max 8 vertices should be enforceable (8th placed, 9th click does nothing).

- [ ] **Step 6: Commit**

```bash
git add chaos.html
git commit -m "feat: vertex placement and rendering"
```

---

### Task 3: Chaos Game Engine

**Files:**
- Modify: `chaos.html`

Pre-allocate a `Float32Array` for 5M dots (`[x, y, colorIdx]` per dot, so 15M floats). Run N chaos game steps per frame, advancing a write pointer that wraps around.

- [ ] **Step 1: Add engine state**

Add after the `dist` function:
```js
const MAX_DOTS = 5_000_000;
const dots = new Float32Array(MAX_DOTS * 3); // [x, y, colorIdx, x, y, colorIdx, ...]
let dotCount = 0;   // total dots ever written (capped at MAX_DOTS)
let writePtr = 0;   // next write index (0..MAX_DOTS-1)

let seed = { x: 0, y: 0 };
let running = false;

// Settings (will be driven by controls in Task 6)
let jumpRatio = 0.5;
let speed = 1000; // steps per frame
```

- [ ] **Step 2: Add engine step function**

Add after the engine state:
```js
function startEngine() {
  if (vertices.length < 2) return;
  // Seed from center of vertex cloud
  seed.x = vertices.reduce((s, v) => s + v.x, 0) / vertices.length;
  seed.y = vertices.reduce((s, v) => s + v.y, 0) / vertices.length;
  running = true;
}

function clearDots() {
  dotCount = 0;
  writePtr = 0;
}

function runSteps(n) {
  if (!running || vertices.length < 2) return;
  for (let i = 0; i < n; i++) {
    const vIdx = Math.floor(Math.random() * vertices.length);
    const v = vertices[vIdx];
    seed.x += jumpRatio * (v.x - seed.x);
    seed.y += jumpRatio * (v.y - seed.y);

    const ptr = writePtr * 3;
    dots[ptr]     = seed.x;
    dots[ptr + 1] = seed.y;
    dots[ptr + 2] = vIdx;

    writePtr = (writePtr + 1) % MAX_DOTS;
    if (dotCount < MAX_DOTS) dotCount++;
  }
}
```

- [ ] **Step 3: Auto-start engine when 2nd vertex placed**

Replace the click handler's vertex push with:
```js
vertices.push({ x: e.clientX, y: e.clientY, hue });

if (vertices.length === 1) hint.classList.add('hidden');
if (vertices.length === 2) startEngine();
```

- [ ] **Step 4: Call runSteps in the frame loop**

Update `frame()`:
```js
function frame() {
  requestAnimationFrame(frame);
  runSteps(speed);
  // dot render goes in Task 4
  renderVertices();
}
```

- [ ] **Step 5: Verify in browser**

Open `chaos.html`. Place 2 vertices. Open console and type `dotCount` — it should be increasing rapidly. No visual dots yet (rendering comes next), but the engine should be running silently.

- [ ] **Step 6: Commit**

```bash
git add chaos.html
git commit -m "feat: chaos game engine with Float32Array dot storage"
```

---

### Task 4: Dot Rendering via ImageData

**Files:**
- Modify: `chaos.html`

Use `ctx.createImageData` to write pixels directly into a `Uint8ClampedArray` buffer, then blit with `ctx.putImageData`. This is ~10× faster than `fillRect` at millions of points.

- [ ] **Step 1: Add ImageData buffer**

Add after `let seed = ...`:
```js
let imageData = null;

function initImageData() {
  imageData = ctx.createImageData(W, H);
}
```

Update `resize()`:
```js
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initImageData();
  clearDots();
}
```

- [ ] **Step 2: Add dot render function**

Add after `initImageData`:
```js
function renderDots() {
  if (!imageData) return;

  // Clear buffer to black
  imageData.data.fill(0);
  const buf = imageData.data;

  for (let i = 0; i < dotCount; i++) {
    const ptr = i * 3;
    const px = dots[ptr]     | 0;
    const py = dots[ptr + 1] | 0;
    if (px < 0 || px >= W || py < 0 || py >= H) continue;

    const pixel = (py * W + px) * 4;
    const [r, g, b] = dotColor(i, dots[ptr + 2] | 0);
    // Additive blend: brighten existing pixel
    buf[pixel]     = Math.min(255, buf[pixel]     + r);
    buf[pixel + 1] = Math.min(255, buf[pixel + 1] + g);
    buf[pixel + 2] = Math.min(255, buf[pixel + 2] + b);
    buf[pixel + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}
```

- [ ] **Step 3: Add dotColor function**

Add after `renderDots`:
```js
// colorMode: 'vertex' | 'single' | 'age'
let colorMode = 'vertex';

function dotColor(dotIndex, vIdx) {
  if (colorMode === 'single') return [220, 220, 220];

  if (colorMode === 'age') {
    // Newer dots (near writePtr) are bright, older are dim
    const age = (dotIndex < writePtr)
      ? writePtr - dotIndex
      : MAX_DOTS - dotIndex + writePtr;
    const brightness = Math.max(20, 220 - (age / MAX_DOTS) * 200);
    return [brightness, brightness, brightness];
  }

  // 'vertex' mode — hue from the vertex that was chosen
  const hue = vertices[vIdx] ? vertices[vIdx].hue : 0;
  return hslToRgb(hue, 75, 65);
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}
```

- [ ] **Step 4: Wire renderDots into frame loop**

Update `frame()`:
```js
function frame() {
  requestAnimationFrame(frame);
  runSteps(speed);
  renderDots();
  renderVertices(); // drawn on top of dots
}
```

- [ ] **Step 5: Verify in browser**

Open `chaos.html`. Place a triangle of 3 vertices. After a few seconds a colored Sierpinski-like fractal should assemble. Vertices render as glowing dots on top of the fractal cloud. No console errors.

- [ ] **Step 6: Commit**

```bash
git add chaos.html
git commit -m "feat: ImageData dot renderer with vertex/single/age color modes"
```

---

### Task 5: Vertex Dragging & Right-Click Removal

**Files:**
- Modify: `chaos.html`

Dragging a vertex updates its position live, clears the dot cloud, and restarts the seed. Right-clicking a vertex removes it.

- [ ] **Step 1: Add drag state**

Add after `let running = false`:
```js
let dragVertex = null; // reference to vertex being dragged
```

- [ ] **Step 2: Add mousedown / mousemove / mouseup handlers**

Add after the click handler:
```js
canvas.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  dragVertex = vertices.find(v => dist(v, e) < VERTEX_RADIUS * 2) || null;
  if (dragVertex) canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('mousemove', e => {
  if (!dragVertex) return;
  dragVertex.x = e.clientX;
  dragVertex.y = e.clientY;
  clearDots();
  startEngine(); // re-seed from new center
});

window.addEventListener('mouseup', e => {
  if (e.button !== 0) return;
  dragVertex = null;
  canvas.style.cursor = 'crosshair';
});
```

- [ ] **Step 3: Add right-click removal**

Add after the mouseup handler:
```js
canvas.addEventListener('contextmenu', e => {
  e.preventDefault();
  const v = vertices.find(v => dist(v, e) < VERTEX_RADIUS * 2);
  if (!v) return;
  vertices.splice(vertices.indexOf(v), 1);
  clearDots();
  if (vertices.length >= 2) startEngine();
  else { running = false; }
  if (vertices.length === 0) hint.classList.remove('hidden');
});
```

- [ ] **Step 4: Guard click against drag end**

Update click handler to skip if a drag just completed:
```js
canvas.addEventListener('click', e => {
  if (e.button !== 0) return;
  if (dragVertex) return; // was a drag, not a fresh click
  const near = vertices.find(v => dist(v, e) < VERTEX_RADIUS * 2);
  if (near) return;
  if (vertices.length >= MAX_VERTICES) return;

  const hue = HUES[vertices.length];
  vertices.push({ x: e.clientX, y: e.clientY, hue });

  if (vertices.length === 1) hint.classList.add('hidden');
  if (vertices.length === 2) startEngine();
});
```

- [ ] **Step 5: Verify in browser**

Place 3+ vertices. Click and drag one — the fractal cloud should clear and rebuild around the new geometry in real time. Right-click a vertex to remove it. Removing all vertices should show the hint again.

- [ ] **Step 6: Commit**

```bash
git add chaos.html
git commit -m "feat: vertex dragging (live attractor morph) and right-click removal"
```

---

### Task 6: Controls Strip

**Files:**
- Modify: `chaos.html`

A panel that slides up from the bottom on hover (same pattern as Conway's stamp bar). Contains jump ratio slider, speed slider, color mode selector, and presets menu.

- [ ] **Step 1: Add controls HTML**

Add before `</body>`:
```html
<div id="controls">
  <div class="ctrl-row">
    <label class="ctrl-label">Jump ratio</label>
    <input type="range" id="ratio-slider" min="30" max="90" value="50" step="1">
    <span class="ctrl-val" id="ratio-val">0.50</span>
  </div>
  <div class="ctrl-row">
    <label class="ctrl-label">Speed</label>
    <input type="range" id="speed-slider" min="100" max="5000" value="1000" step="100">
    <span class="ctrl-val" id="speed-val">1000</span>
  </div>
  <div class="ctrl-row">
    <label class="ctrl-label">Color</label>
    <div class="ctrl-toggle" id="color-toggle">
      <button class="toggle-btn active" data-mode="vertex">By vertex</button>
      <button class="toggle-btn" data-mode="single">Single</button>
      <button class="toggle-btn" data-mode="age">Age</button>
    </div>
  </div>
  <div class="ctrl-row">
    <label class="ctrl-label">Preset</label>
    <div class="ctrl-toggle" id="preset-btns">
      <button class="toggle-btn" data-preset="triangle">Triangle</button>
      <button class="toggle-btn" data-preset="square">Square</button>
      <button class="toggle-btn" data-preset="pentagon">Pentagon</button>
      <button class="toggle-btn" data-preset="hexagon">Hexagon</button>
    </div>
  </div>
</div>
<div id="ctrl-trigger"></div>
```

- [ ] **Step 2: Add controls CSS**

Add inside `<style>`:
```css
#ctrl-trigger {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  height: 24px;
  z-index: 4;
}

#controls {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: rgba(0,0,0,0.92);
  border-top: 1px solid #222;
  padding: 14px 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 32px;
  align-items: center;
  transform: translateY(100%);
  transition: transform 300ms ease-out;
  z-index: 3;
}

#controls.open { transform: translateY(0); }

.ctrl-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ctrl-label {
  color: #666;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
  min-width: 72px;
}

.ctrl-val {
  color: #999;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  min-width: 36px;
}

input[type=range] {
  -webkit-appearance: none;
  width: 120px;
  height: 2px;
  background: #333;
  outline: none;
  border-radius: 1px;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
}

.ctrl-toggle {
  display: flex;
  gap: 4px;
}

.toggle-btn {
  background: none;
  border: 1px solid #333;
  color: #666;
  font-size: 11px;
  letter-spacing: 0.08em;
  padding: 3px 8px;
  cursor: pointer;
  border-radius: 2px;
  transition: all 150ms;
  font-family: inherit;
}

.toggle-btn:hover { border-color: #666; color: #ccc; }
.toggle-btn.active { border-color: #fff; color: #fff; }
```

- [ ] **Step 3: Wire controls JS**

Add after the contextmenu handler:
```js
// Controls panel open/close
const controls = document.getElementById('controls');
const ctrlTrigger = document.getElementById('ctrl-trigger');

ctrlTrigger.addEventListener('mouseenter', () => controls.classList.add('open'));
controls.addEventListener('mouseleave', () => controls.classList.remove('open'));

// Jump ratio slider
const ratioSlider = document.getElementById('ratio-slider');
const ratioVal = document.getElementById('ratio-val');
ratioSlider.addEventListener('input', () => {
  jumpRatio = ratioSlider.value / 100;
  ratioVal.textContent = jumpRatio.toFixed(2);
  clearDots();
  startEngine();
});

// Speed slider
const speedSlider = document.getElementById('speed-slider');
const speedVal = document.getElementById('speed-val');
speedSlider.addEventListener('input', () => {
  speed = parseInt(speedSlider.value);
  speedVal.textContent = speed;
});

// Color mode toggle
document.getElementById('color-toggle').addEventListener('click', e => {
  const btn = e.target.closest('.toggle-btn');
  if (!btn) return;
  colorMode = btn.dataset.mode;
  document.querySelectorAll('#color-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
});
```

- [ ] **Step 4: Verify in browser**

Hover near the bottom edge — controls panel should slide up. Adjust jump ratio and watch the fractal change shape. Adjust speed. Toggle color modes. Panel should slide back down when mouse leaves.

- [ ] **Step 5: Commit**

```bash
git add chaos.html
git commit -m "feat: controls strip with jump ratio, speed, and color mode"
```

---

### Task 7: Presets

**Files:**
- Modify: `chaos.html`

Presets snap vertices to a centered polygon, clear the dot cloud, and restart the engine. Hexagons and pentagons have specific known jump ratios for clean fractals.

- [ ] **Step 1: Add preset data and function**

Add after the `hslToRgb` function:
```js
const PRESETS = {
  triangle:  { n: 3, ratio: 0.5  },
  square:    { n: 4, ratio: 0.5  },
  pentagon:  { n: 5, ratio: 0.618 },
  hexagon:   { n: 6, ratio: 0.5  },
};

function applyPreset(name) {
  const p = PRESETS[name];
  if (!p) return;

  const cx = W / 2, cy = H / 2;
  const r = Math.min(W, H) * 0.38;

  vertices = [];
  for (let i = 0; i < p.n; i++) {
    const angle = (i / p.n) * Math.PI * 2 - Math.PI / 2;
    vertices.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      hue: HUES[i],
    });
  }

  jumpRatio = p.ratio;
  ratioSlider.value = Math.round(p.ratio * 100);
  ratioVal.textContent = p.ratio.toFixed(3);

  clearDots();
  hint.classList.add('hidden');
  startEngine();
}
```

- [ ] **Step 2: Wire preset buttons**

Add after the color mode toggle handler:
```js
document.getElementById('preset-btns').addEventListener('click', e => {
  const btn = e.target.closest('.toggle-btn');
  if (!btn) return;
  applyPreset(btn.dataset.preset);
});
```

- [ ] **Step 3: Verify in browser**

Open controls panel. Click "Triangle" — 3 vertices appear in a triangle, Sierpinski pattern assembles. Click "Pentagon" — 5 vertices appear, pentaflake pattern emerges. Each preset should update the jump ratio slider to its known value.

- [ ] **Step 4: Commit**

```bash
git add chaos.html
git commit -m "feat: polygon presets (triangle, square, pentagon, hexagon)"
```

---

### Task 8: Keyboard Shortcuts

**Files:**
- Modify: `chaos.html`

**Space** clears the dot cloud (keeps vertices, watches fractal rebuild). **R** resets everything.

- [ ] **Step 1: Add keyboard handler**

Add after the `applyPreset` function:
```js
window.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return; // don't capture when slider focused

  if (e.code === 'Space') {
    e.preventDefault();
    clearDots();
    startEngine();
  }

  if (e.code === 'KeyR') {
    vertices = [];
    clearDots();
    running = false;
    hint.classList.remove('hidden');
  }
});
```

- [ ] **Step 2: Verify in browser**

Place vertices and watch the fractal form. Press Space — dot cloud clears, fractal rebuilds from scratch. Press R — all vertices and dots clear, hint reappears.

- [ ] **Step 3: Commit**

```bash
git add chaos.html
git commit -m "feat: keyboard shortcuts (Space=clear dots, R=reset)"
```

---

### Task 9: Polish & Titles

**Files:**
- Modify: `chaos.html`

Add a subtle page title, tweak cursors, and ensure the controls panel doesn't open accidentally on mobile-sized windows.

- [ ] **Step 1: Add title and dot-count display**

Add to `<style>`:
```css
#title {
  position: fixed;
  top: 18px;
  left: 24px;
  color: rgba(255,255,255,0.18);
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  pointer-events: none;
  user-select: none;
}

#dot-count {
  position: fixed;
  bottom: 28px;
  right: 24px;
  color: rgba(255,255,255,0.18);
  font-size: 11px;
  letter-spacing: 0.12em;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
  user-select: none;
}
```

Add before `</body>`:
```html
<div id="title">chaos game</div>
<div id="dot-count"></div>
```

- [ ] **Step 2: Update dot count display each frame**

Add at the end of `frame()`:
```js
const dotCountEl = document.getElementById('dot-count');
dotCountEl.textContent = dotCount > 0
  ? `${(dotCount / 1_000_000).toFixed(2)}M pts`
  : '';
```

- [ ] **Step 3: Cursor: change to grab near a vertex**

Add at the end of `frame()`:
```js
if (!dragVertex) {
  const nearAny = vertices.some(v => dist(v, { x: lastMX, y: lastMY }) < VERTEX_RADIUS * 2);
  canvas.style.cursor = nearAny ? 'grab' : 'crosshair';
}
```

Track mouse position by adding:
```js
let lastMX = 0, lastMY = 0;
canvas.addEventListener('mousemove', e => { lastMX = e.clientX; lastMY = e.clientY; });
```

(Add this before the existing `mousemove` handler — the existing one only fires during drag, so this tracks position globally.)

- [ ] **Step 4: Verify final experience**

Open `chaos.html`. Full flow:
1. Black canvas, hint text centered
2. Click to place 3 vertices — hint hides, Sierpinski assembles
3. Hover bottom — controls slide up
4. Adjust jump ratio — fractal morphs
5. Try "Pentagon" preset — pentaflake forms
6. Drag a vertex — cloud clears, new attractor forms live
7. Right-click a vertex — removed
8. Space — cloud rebuilds
9. R — full reset, hint returns
10. Dot count shows in bottom-right

- [ ] **Step 5: Commit**

```bash
git add chaos.html
git commit -m "feat: polish — title, dot count, grab cursor near vertices"
```

---

## Self-Review

**Spec coverage:**
- ✅ Click to place vertex (max 8) — Task 2
- ✅ Drag vertex → morph live, cloud resets — Task 5
- ✅ Right-click → remove vertex — Task 5
- ✅ Space → clear cloud, keep vertices — Task 8
- ✅ R → full reset — Task 8
- ✅ Jump ratio slider (0.3–0.9, default 0.5) — Task 6
- ✅ Speed slider (100–5000, default 1000) — Task 6
- ✅ Color modes: by vertex, single, age — Task 4 + Task 6
- ✅ Presets: triangle, square, pentagon, hexagon — Task 7
- ✅ Hint text disappears after first vertex — Task 2
- ✅ Single file, no dependencies — Task 1
- ✅ Float32Array, 5M dot capacity — Task 3
- ✅ ImageData pixel rendering — Task 4
- ✅ Dot count display — Task 9

**Type/name consistency check:**
- `clearDots()` used consistently across Tasks 3, 5, 6, 7, 8 ✅
- `startEngine()` used consistently across Tasks 3, 5, 6, 7, 8 ✅
- `dotCount` / `writePtr` / `dots` used consistently ✅
- `colorMode` referenced in `dotColor()` and set in controls ✅
- `jumpRatio` referenced in `runSteps()` and set in slider + presets ✅
- `speed` referenced in `frame()` and set in slider ✅
- `ratioSlider` / `ratioVal` referenced in `applyPreset` — must be declared before `applyPreset` is called. Both are declared in Task 6 (controls JS section) which runs before Task 7 wires preset buttons. ✅
