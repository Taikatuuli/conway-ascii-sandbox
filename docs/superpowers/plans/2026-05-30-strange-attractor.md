# Strange Attractor Asset Generator — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `attractor.html` — a single-file interactive Thomas attractor explorer with real-time controls and SVG export.

**Architecture:** Canvas preview renders a 30 000-point ring buffer of 3D trajectory points, projected to 2D via θ/φ rotation on every frame. On export, the simulation re-runs fresh and serializes the trajectory as a single SVG `<path>`. No external dependencies.

**Tech Stack:** Vanilla JS, Canvas 2D API, Float32Array ring buffer, SVG string serialization.

---

## File

- **Create:** `attractor.html` (project root — matches `chaos.html`, `solar-system.html` pattern)

No other files are created or modified.

---

## Task 1: HTML scaffold + CSS

**Files:**
- Create: `attractor.html`

- [ ] **Step 1: Create the file with boilerplate, CSS, and DOM structure**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Strange Attractor</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: #000;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    #c { display: block; }

    #title {
      position: fixed;
      top: 18px; left: 24px;
      color: rgba(255,255,255,0.18);
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      pointer-events: none;
      user-select: none;
    }

    #pt-count {
      position: fixed;
      bottom: 28px; right: 24px;
      color: rgba(255,255,255,0.18);
      font-size: 11px;
      letter-spacing: 0.12em;
      font-variant-numeric: tabular-nums;
      pointer-events: none;
      user-select: none;
    }

    #ctrl-trigger {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      height: 24px;
      z-index: 3;
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
      z-index: 4;
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
      min-width: 40px;
    }

    input[type=range] {
      -webkit-appearance: none;
      width: 120px; height: 2px;
      background: #333;
      outline: none;
      border-radius: 1px;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px; height: 12px;
      border-radius: 50%;
      background: #fff;
      cursor: pointer;
    }

    input[type=color] {
      -webkit-appearance: none;
      width: 24px; height: 24px;
      border: 1px solid #333;
      border-radius: 3px;
      background: none;
      cursor: pointer;
      padding: 0;
    }
    input[type=color]::-webkit-color-swatch-wrapper { padding: 2px; }
    input[type=color]::-webkit-color-swatch { border: none; border-radius: 2px; }

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

    #export-btn {
      background: none;
      border: 1px solid #444;
      color: #aaa;
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 5px 14px;
      cursor: pointer;
      border-radius: 2px;
      font-family: inherit;
      transition: all 150ms;
      margin-left: 8px;
    }
    #export-btn:hover { border-color: #fff; color: #fff; }
  </style>
</head>
<body>

<canvas id="c"></canvas>
<div id="title">thomas attractor</div>
<div id="pt-count"></div>

<div id="ctrl-trigger"></div>
<div id="controls">

  <div class="ctrl-row">
    <label class="ctrl-label">b</label>
    <input type="range" id="b-slider" min="10" max="30" value="19" step="1">
    <span class="ctrl-val" id="b-val">0.19</span>
  </div>

  <div class="ctrl-row">
    <label class="ctrl-label">θ yaw</label>
    <input type="range" id="theta-slider" min="0" max="628" value="80" step="1">
    <span class="ctrl-val" id="theta-val">0.80</span>
  </div>

  <div class="ctrl-row">
    <label class="ctrl-label">φ pitch</label>
    <input type="range" id="phi-slider" min="-157" max="157" value="30" step="1">
    <span class="ctrl-val" id="phi-val">0.30</span>
  </div>

  <div class="ctrl-row">
    <label class="ctrl-label">Points</label>
    <input type="range" id="iter-slider" min="5000" max="50000" value="30000" step="1000">
    <span class="ctrl-val" id="iter-val">30k</span>
  </div>

  <div class="ctrl-row">
    <label class="ctrl-label">Opacity</label>
    <input type="range" id="opacity-slider" min="20" max="100" value="60" step="1">
    <span class="ctrl-val" id="opacity-val">0.60</span>
  </div>

  <div class="ctrl-row">
    <label class="ctrl-label">Line</label>
    <input type="color" id="line-color" value="#ffffff">
  </div>

  <div class="ctrl-row">
    <label class="ctrl-label">Background</label>
    <input type="color" id="bg-color" value="#000000">
  </div>

  <div class="ctrl-row">
    <label class="ctrl-label">Export size</label>
    <div style="display:flex;gap:4px" id="size-btns">
      <button class="toggle-btn" data-w="1280" data-h="720">720p</button>
      <button class="toggle-btn active" data-w="1920" data-h="1080">1080p</button>
      <button class="toggle-btn" data-w="2560" data-h="1440">1440p</button>
      <button class="toggle-btn" data-w="3840" data-h="2160">4K</button>
    </div>
    <button id="export-btn">↓ SVG</button>
  </div>

</div>

<script>
// (JS added in subsequent tasks)
</script>
</body>
</html>
```

- [ ] **Step 2: Open `attractor.html` in a browser and verify**

Expected: black page, no console errors. Hovering the bottom edge should do nothing yet (JS stub). Title "thomas attractor" visible top-left.

- [ ] **Step 3: Commit**

```bash
git add attractor.html
git commit -m "feat: attractor scaffold — HTML, CSS, DOM structure"
```

---

## Task 2: Thomas simulation + ring buffer

**Files:**
- Modify: `attractor.html` — replace the `<script>` stub

- [ ] **Step 1: Replace the `<script>` stub with state + simulation code**

Replace `// (JS added in subsequent tasks)` with:

```js
// ─── Constants ───────────────────────────────────────────────
const DT        = 0.05;
const WARMUP    = 500;    // steps discarded before recording starts
const MAX_BUF   = 50000;  // max ring-buffer capacity (matches slider max)

// ─── Mutable state ───────────────────────────────────────────
const state = {
  b:         0.19,
  theta:     0.80,
  phi:       0.30,
  bufCap:    30000,   // active ring-buffer size (controlled by slider)
  opacity:   0.60,
  lineColor: '#ffffff',
  bgColor:   '#000000',
  exportW:   1920,
  exportH:   1080,
};

// ─── Ring buffer (3D trajectory points) ──────────────────────
const buf3d  = new Float32Array(MAX_BUF * 3); // [x,y,z, x,y,z, ...]
let bufHead  = 0;   // write pointer
let bufLen   = 0;   // valid point count (0 → bufCap)

// Running simulation cursor
let sx = 0.1, sy = 0.0, sz = 0.0;

function resetSim() {
  sx = 0.1; sy = 0.0; sz = 0.0;
  bufHead = 0;
  bufLen  = 0;
  // Warmup — advance without recording so we start on the attractor
  for (let i = 0; i < WARMUP; i++) {
    const dx = Math.sin(sy) - state.b * sx;
    const dy = Math.sin(sz) - state.b * sy;
    const dz = Math.sin(sx) - state.b * sz;
    sx += dx * DT;
    sy += dy * DT;
    sz += dz * DT;
  }
}

function advanceBuffer(steps) {
  const b = state.b;
  const cap = state.bufCap;
  let x = sx, y = sy, z = sz;
  for (let i = 0; i < steps; i++) {
    const dx = Math.sin(y) - b * x;
    const dy = Math.sin(z) - b * y;
    const dz = Math.sin(x) - b * z;
    x += dx * DT;
    y += dy * DT;
    z += dz * DT;
    const p = bufHead * 3;
    buf3d[p]     = x;
    buf3d[p + 1] = y;
    buf3d[p + 2] = z;
    bufHead = (bufHead + 1) % cap;
    if (bufLen < cap) bufLen++;
  }
  sx = x; sy = y; sz = z;
}

resetSim();
```

- [ ] **Step 2: Open in browser, open console, verify no errors**

Expected: no errors. `bufLen` is 0 because `advanceBuffer` hasn't been called yet.

- [ ] **Step 3: Commit**

```bash
git add attractor.html
git commit -m "feat: Thomas simulation + ring buffer"
```

---

## Task 3: Projection + preview render loop

**Files:**
- Modify: `attractor.html` — append to `<script>` after Task 2 code

- [ ] **Step 1: Add canvas resize, projection, and render loop**

Append inside `<script>`, after `resetSim();`:

```js
// ─── Canvas setup ─────────────────────────────────────────────
const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// ─── Projection ───────────────────────────────────────────────
// Projects a 3D point [x,y,z] to 2D [u,v] using yaw θ and pitch φ.
// u = cos(θ)·x − sin(θ)·y
// v = sin(φ)·(sin(θ)·x + cos(θ)·y) + cos(φ)·z
function project(x, y, z, cosT, sinT, cosP, sinP) {
  const u = cosT * x - sinT * y;
  const v = sinP * (sinT * x + cosT * y) + cosP * z;
  return [u, v];
}

// ─── Draw frame ───────────────────────────────────────────────
function drawFrame() {
  const n = bufLen;
  if (n < 2) return;

  const cap  = state.bufCap;
  const cosT = Math.cos(state.theta);
  const sinT = Math.sin(state.theta);
  const cosP = Math.cos(state.phi);
  const sinP = Math.sin(state.phi);

  // Pass 1: project all points, compute bounds
  const pu = new Float32Array(n);
  const pv = new Float32Array(n);
  let minU =  Infinity, maxU = -Infinity;
  let minV =  Infinity, maxV = -Infinity;

  const start = (bufLen === cap) ? bufHead : 0;

  for (let i = 0; i < n; i++) {
    const idx = (start + i) % cap;
    const p   = idx * 3;
    const [u, v] = project(buf3d[p], buf3d[p+1], buf3d[p+2], cosT, sinT, cosP, sinP);
    pu[i] = u; pv[i] = v;
    if (u < minU) minU = u; if (u > maxU) maxU = u;
    if (v < minV) minV = v; if (v > maxV) maxV = v;
  }

  // Pass 2: scale to canvas with padding
  const PAD   = 48;
  const rangeU = maxU - minU || 1;
  const rangeV = maxV - minV || 1;
  const scale  = Math.min((W - PAD * 2) / rangeU, (H - PAD * 2) / rangeV);
  const offX   = (W - rangeU * scale) / 2 - minU * scale;
  const offY   = (H - rangeV * scale) / 2 - minV * scale;

  // Clear + background
  ctx.fillStyle = state.bgColor;
  ctx.fillRect(0, 0, W, H);

  // Draw polyline
  ctx.strokeStyle  = state.lineColor;
  ctx.globalAlpha  = state.opacity;
  ctx.lineWidth    = 1;
  ctx.lineJoin     = 'round';
  ctx.beginPath();
  ctx.moveTo(pu[0] * scale + offX, pv[0] * scale + offY);
  for (let i = 1; i < n; i++) {
    ctx.lineTo(pu[i] * scale + offX, pv[i] * scale + offY);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// ─── Animation loop ───────────────────────────────────────────
const ptCountEl = document.getElementById('pt-count');

function frame() {
  requestAnimationFrame(frame);
  advanceBuffer(500);
  drawFrame();
  ptCountEl.textContent = bufLen > 0
    ? `${(bufLen / 1000).toFixed(0)}k pts`
    : '';
}

frame();
```

- [ ] **Step 2: Open in browser and verify**

Expected: Thomas attractor appears and fills in over ~2 seconds. Line is white on black. Point counter counts up to ~30k in the bottom-right. No console errors.

- [ ] **Step 3: Commit**

```bash
git add attractor.html
git commit -m "feat: projection + live preview render loop"
```

---

## Task 4: Controls panel wiring

**Files:**
- Modify: `attractor.html` — append to `<script>`

- [ ] **Step 1: Wire controls panel open/close + all sliders/pickers**

Append inside `<script>`, after `frame();`:

```js
// ─── Controls panel open/close ────────────────────────────────
const controls    = document.getElementById('controls');
const ctrlTrigger = document.getElementById('ctrl-trigger');
ctrlTrigger.addEventListener('mouseenter', () => controls.classList.add('open'));
controls.addEventListener('mouseleave',    () => controls.classList.remove('open'));

// ─── b (dissipation) — resets simulation when changed ─────────
const bSlider = document.getElementById('b-slider');
const bVal    = document.getElementById('b-val');
bSlider.addEventListener('input', () => {
  state.b = bSlider.value / 100;
  bVal.textContent = state.b.toFixed(2);
  resetSim();
});

// ─── θ yaw — re-projects, no reset needed ─────────────────────
const thetaSlider = document.getElementById('theta-slider');
const thetaVal    = document.getElementById('theta-val');
thetaSlider.addEventListener('input', () => {
  state.theta = thetaSlider.value / 100;
  thetaVal.textContent = state.theta.toFixed(2);
});

// ─── φ pitch — re-projects, no reset needed ───────────────────
const phiSlider = document.getElementById('phi-slider');
const phiVal    = document.getElementById('phi-val');
phiSlider.addEventListener('input', () => {
  state.phi = phiSlider.value / 100;
  phiVal.textContent = state.phi.toFixed(2);
});

// ─── Iterations (buffer capacity) ─────────────────────────────
const iterSlider = document.getElementById('iter-slider');
const iterVal    = document.getElementById('iter-val');
iterSlider.addEventListener('input', () => {
  state.bufCap = parseInt(iterSlider.value);
  iterVal.textContent = (state.bufCap / 1000).toFixed(0) + 'k';
  // Clamp bufLen and bufHead to new capacity
  if (bufLen > state.bufCap)  bufLen  = state.bufCap;
  if (bufHead >= state.bufCap) bufHead = bufHead % state.bufCap;
});

// ─── Opacity ──────────────────────────────────────────────────
const opacitySlider = document.getElementById('opacity-slider');
const opacityVal    = document.getElementById('opacity-val');
opacitySlider.addEventListener('input', () => {
  state.opacity = opacitySlider.value / 100;
  opacityVal.textContent = state.opacity.toFixed(2);
});

// ─── Color pickers ────────────────────────────────────────────
document.getElementById('line-color').addEventListener('input', e => {
  state.lineColor = e.target.value;
});
document.getElementById('bg-color').addEventListener('input', e => {
  state.bgColor = e.target.value;
});

// ─── Export size toggle ───────────────────────────────────────
document.getElementById('size-btns').addEventListener('click', e => {
  const btn = e.target.closest('.toggle-btn');
  if (!btn) return;
  state.exportW = parseInt(btn.dataset.w);
  state.exportH = parseInt(btn.dataset.h);
  document.querySelectorAll('#size-btns .toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
});
```

- [ ] **Step 2: Open in browser, hover bottom edge, verify panel slides up**

Expected: panel appears. Moving `b` slider causes the attractor to dissolve and rebuild. Moving `θ`/`φ` sliders smoothly rotates the attractor. Opacity, color pickers all take effect immediately.

- [ ] **Step 3: Commit**

```bash
git add attractor.html
git commit -m "feat: wire all controls to state"
```

---

## Task 5: SVG export

**Files:**
- Modify: `attractor.html` — append to `<script>`

- [ ] **Step 1: Add `buildSVG` function and export button handler**

Append inside `<script>`, after the controls wiring:

```js
// ─── SVG export ───────────────────────────────────────────────
function buildSVG() {
  const { b, theta, phi, bufCap, opacity, lineColor, bgColor, exportW, exportH } = state;

  // Fresh simulation run (no ring buffer — clean output)
  let x = 0.1, y = 0.0, z = 0.0;
  // Warmup
  for (let i = 0; i < WARMUP; i++) {
    const dx = Math.sin(y) - b * x;
    const dy = Math.sin(z) - b * y;
    const dz = Math.sin(x) - b * z;
    x += dx * DT; y += dy * DT; z += dz * DT;
  }

  // Collect points
  const cosT = Math.cos(theta), sinT = Math.sin(theta);
  const cosP = Math.cos(phi),   sinP = Math.sin(phi);

  const pu = new Float32Array(bufCap);
  const pv = new Float32Array(bufCap);
  let minU =  Infinity, maxU = -Infinity;
  let minV =  Infinity, maxV = -Infinity;

  for (let i = 0; i < bufCap; i++) {
    const dx = Math.sin(y) - b * x;
    const dy = Math.sin(z) - b * y;
    const dz = Math.sin(x) - b * z;
    x += dx * DT; y += dy * DT; z += dz * DT;
    const u = cosT * x - sinT * y;
    const v = sinP * (sinT * x + cosT * y) + cosP * z;
    pu[i] = u; pv[i] = v;
    if (u < minU) minU = u; if (u > maxU) maxU = u;
    if (v < minV) minV = v; if (v > maxV) maxV = v;
  }

  // Scale to output dimensions
  const PAD    = Math.round(exportH * 0.04);
  const rangeU = maxU - minU || 1;
  const rangeV = maxV - minV || 1;
  const scale  = Math.min((exportW - PAD * 2) / rangeU, (exportH - PAD * 2) / rangeV);
  const offX   = (exportW - rangeU * scale) / 2 - minU * scale;
  const offY   = (exportH - rangeV * scale) / 2 - minV * scale;

  // Build SVG path string
  const parts = new Array(bufCap);
  parts[0] = `M ${(pu[0] * scale + offX).toFixed(2)},${(pv[0] * scale + offY).toFixed(2)}`;
  for (let i = 1; i < bufCap; i++) {
    parts[i] = `L ${(pu[i] * scale + offX).toFixed(2)},${(pv[i] * scale + offY).toFixed(2)}`;
  }

  // stroke-width scales with output height so 1px at 1080p → 2px at 4K
  const strokeWidth = (exportH / 1080).toFixed(3);

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${exportW}" height="${exportH}" viewBox="0 0 ${exportW} ${exportH}">`,
    `  <rect width="${exportW}" height="${exportH}" fill="${bgColor}"/>`,
    `  <path d="${parts.join(' ')}" fill="none" stroke="${lineColor}" stroke-width="${strokeWidth}" opacity="${opacity.toFixed(2)}" stroke-linejoin="round"/>`,
    `</svg>`,
  ].join('\n');
}

document.getElementById('export-btn').addEventListener('click', () => {
  const svg  = buildSVG();
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'attractor.svg';
  a.click();
  URL.revokeObjectURL(url);
});
```

- [ ] **Step 2: Open in browser, open controls panel, click "↓ SVG"**

Expected: browser downloads `attractor.svg`. Open the file — should show the Thomas attractor as a vector path on the chosen background color. Open in a browser or Figma to verify it's a proper SVG.

- [ ] **Step 3: Test at 4K export size**

Change export size to 4K in the panel, then click Export again. Open the SVG — verify the stroke is visibly slightly thicker than the 1080p export (stroke-width ~3.56 vs ~1).

- [ ] **Step 4: Commit**

```bash
git add attractor.html
git commit -m "feat: SVG export with resolution-scaled stroke width"
```

---

## Task 6: Keyboard shortcut + final polish

**Files:**
- Modify: `attractor.html` — append to `<script>`

- [ ] **Step 1: Add keyboard shortcut and verify `pt-count` visibility**

Append inside `<script>`:

```js
// ─── Keyboard shortcuts ───────────────────────────────────────
window.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.code === 'KeyR') {
    resetSim();
  }
});
```

- [ ] **Step 2: Verify the full experience in browser**

Check each of the following:
1. Page loads with attractor visible within ~2 seconds
2. Hovering bottom edge reveals controls panel; moving mouse away hides it
3. `b` slider: changing value clears and rebuilds the attractor
4. `θ` and `φ` sliders: smoothly rotate without clearing
5. `Points` slider: changing adjusts density
6. `Opacity` slider: makes lines more/less transparent
7. Line color picker: line color updates live
8. Background color picker: background updates live
9. Export → downloads `attractor.svg` with correct bg/line colors
10. Pressing `R` resets and rebuilds the attractor
11. Point counter shows e.g. `30k pts` in bottom-right
12. Title `thomas attractor` visible top-left

- [ ] **Step 3: Commit**

```bash
git add attractor.html
git commit -m "feat: keyboard shortcut R to reset attractor"
```

---

## Self-Review Checklist

- [x] **b control** → resets sim ✓ (Task 4)
- [x] **θ/φ controls** → re-project without reset ✓ (Task 4)
- [x] **Ring buffer** → ring wraps correctly with `% cap` ✓ (Task 2)
- [x] **Warmup** → 500 steps discarded before recording in both preview and export ✓ (Tasks 2, 5)
- [x] **SVG stroke-width** → scales with `exportH / 1080` ✓ (Task 5)
- [x] **Export size** → independent of preview canvas ✓ (Task 5)
- [x] **Opacity** → `ctx.globalAlpha` for canvas, `opacity` attr for SVG ✓ (Tasks 3, 5)
- [x] **Controls panel** → same slide-up pattern as `chaos.html` ✓ (Tasks 1, 4)
- [x] **No external deps** ✓ — vanilla JS only
