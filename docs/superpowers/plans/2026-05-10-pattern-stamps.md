# Pattern Stamps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fixed bottom toolbar with 4 pattern buttons (Glider, Blinker, Pulsar, Gosper Gun) that let the user stamp Conway patterns onto the grid with a ghost preview.

**Architecture:** All changes to `index.html`. Three new globals (`activePattern`, `ghostCells`, `ghostOrigin`), a `PATTERNS` data object, CSS for the toolbar and buttons, and modifications to `render()`, `mousedown`, `mousemove`, and `keydown` handlers.

**Tech Stack:** HTML, CSS, vanilla JS (ES6+) — no new dependencies.

---

## File Structure

| File | Purpose |
|---|---|
| `index.html` | Entire app — all changes here |

### Key existing globals (do not rename)
- `current` — live grid `Uint8Array`
- `dirty` — render flag, set `true` to trigger next render
- `ROWS`, `COLS` — grid dimensions
- `charW`, `charH` — character pixel dimensions
- `cellAt(e)` — converts mouse event to `{r, c, valid}`
- `render()` — rebuilds `field.innerHTML` from `current`

---

### Task 1: HTML + CSS — Toolbar

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add `#stamp-bar` HTML after the `#overlay` div (line 49)**

Insert this between `</div>` (overlay close) and `<script>`:

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

- [ ] **Step 2: Add CSS for the toolbar inside `<style>` (after the `#overlay` block)**

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

- [ ] **Step 3: Verify in browser**

Reload `http://localhost:8080`. Expected: a dark bar appears at the bottom of the screen with `STAMPS GLIDER BLINKER PULSAR GOSPER GUN`. No buttons are highlighted yet. The game field still fills the rest of the viewport.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: stamp toolbar html and css"
```

---

### Task 2: Pattern Data + State Variables

**Files:**
- Modify: `index.html` (inside `<script>`, after the `dirty` declaration on line ~161)

- [ ] **Step 1: Add state variables after `let dirty = true;`**

```javascript
    let activePattern = null;  // null | pattern object from PATTERNS
    let ghostCells    = [];    // [{r, c}] rendered as ghost in render()
```

- [ ] **Step 2: Add PATTERNS data object immediately after the state variables**

```javascript
    const PATTERNS = {
      glider: {
        cells: [[0,1],[1,2],[2,0],[2,1],[2,2]]
      },
      blinker: {
        cells: [[0,0],[0,1],[0,2]]
      },
      pulsar: {
        cells: [
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
      },
      gosper: {
        cells: [
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
      }
    };
```

- [ ] **Step 3: Verify with console.assert**

Open DevTools → Console. Reload. Run:
```javascript
console.assert(PATTERNS.glider.cells.length === 5, 'glider has 5 cells');
console.assert(PATTERNS.blinker.cells.length === 3, 'blinker has 3 cells');
console.assert(PATTERNS.pulsar.cells.length === 40, 'pulsar has 40 cells');
console.assert(PATTERNS.gosper.cells.length === 36, 'gosper has 36 cells');
console.assert(activePattern === null, 'activePattern starts null');
console.assert(ghostCells.length === 0, 'ghostCells starts empty');
console.log('pattern data ok');
```
Expected: `pattern data ok` with no assertion errors.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: pattern data and stamp state variables"
```

---

### Task 3: Render — Ghost Cell Overlay

**Files:**
- Modify: `index.html` — replace the `render()` function

- [ ] **Step 1: Replace the existing `render()` function with the ghost-aware version**

Find the current `render()` function (starts at `function render() {`) and replace the entire function with:

```javascript
    function render() {
      const ghostSet = new Set(ghostCells.map(({ r, c }) => r * COLS + c));
      const parts = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (ghostSet.has(r * COLS + c)) {
            parts.push('<span style="color:#cc9922">█</span>');
            continue;
          }
          const alive = current[r * COLS + c];
          const n = countNeighbors(current, r, c);
          const { ch, color } = charFor(alive, n);
          parts.push(color ? `<span style="color:${color}">${ch}</span>` : ch);
        }
        if (r < ROWS - 1) parts.push('\n');
      }
      field.innerHTML = parts.join('');
    }
```

- [ ] **Step 2: Verify ghost rendering via console**

Open DevTools → Console. Reload. Run:
```javascript
ghostCells = [{r: 10, c: 10}, {r: 10, c: 11}, {r: 10, c: 12}];
dirty = true;
```
Expected: three medium-gold `█` characters appear at roughly the middle-left area. Run `ghostCells = []; dirty = true;` to clear.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: render ghost cells overlay"
```

---

### Task 4: Stamp Button Click Handlers

**Files:**
- Modify: `index.html` — append to `<script>` before `requestAnimationFrame(loop)`

- [ ] **Step 1: Add stamp button click handler before `requestAnimationFrame(loop)`**

```javascript
    const stampHint = document.getElementById('stamp-hint');

    document.querySelectorAll('.stamp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.pattern;
        if (activePattern === PATTERNS[key]) {
          activePattern = null;
          ghostCells = [];
          dirty = true;
          document.querySelectorAll('.stamp-btn').forEach(b => b.classList.remove('active'));
          stampHint.classList.remove('visible');
        } else {
          activePattern = PATTERNS[key];
          document.querySelectorAll('.stamp-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          stampHint.classList.add('visible');
        }
      });
    });
```

- [ ] **Step 2: Verify button activation in browser**

Reload. Click `GLIDER` button.
Expected: GLIDER button border turns gold (`#ffcc44`), `ESC to cancel` appears to the right.
Click GLIDER again. Expected: button returns to dim, hint disappears.
Click PULSAR. Expected: PULSAR highlights. Click GLIDER. Expected: PULSAR unhighlights, GLIDER highlights (only one active at a time).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: stamp button activation and deactivation"
```

---

### Task 5: Mouse + Keyboard — Ghost Preview, Stamp Placement, Escape

**Files:**
- Modify: `index.html` — update three existing event handlers

- [ ] **Step 1: Update `field.addEventListener('mousemove', ...)` to compute ghost cells**

Find this block:
```javascript
    field.addEventListener('mousemove', e => {
      if (!dragging) return;
      const { r, c, valid } = cellAt(e);
      if (valid) { current[r * COLS + c] = drawMode; dirty = true; }
    });
```

Replace with:
```javascript
    field.addEventListener('mousemove', e => {
      if (activePattern) {
        const { r, c } = cellAt(e);
        ghostCells = activePattern.cells
          .map(([dr, dc]) => ({ r: r + dr, c: c + dc }))
          .filter(({ r, c }) => r >= 0 && r < ROWS && c >= 0 && c < COLS);
        dirty = true;
      }
      if (!dragging) return;
      const { r, c, valid } = cellAt(e);
      if (valid) { current[r * COLS + c] = drawMode; dirty = true; }
    });
```

- [ ] **Step 2: Add `field.addEventListener('mouseleave', ...)` to clear ghost when cursor exits**

Append after the mousemove handler:
```javascript
    field.addEventListener('mouseleave', () => {
      if (activePattern) { ghostCells = []; dirty = true; }
    });
```

- [ ] **Step 3: Update `field.addEventListener('mousedown', ...)` to intercept stamp placement**

Find this block:
```javascript
    field.addEventListener('mousedown', e => {
      e.preventDefault();
      dragging = true;
      drawMode = e.button === 2 ? 0 : 1;
      const { r, c, valid } = cellAt(e);
      if (valid) { current[r * COLS + c] = drawMode; dirty = true; }
    });
```

Replace with:
```javascript
    field.addEventListener('mousedown', e => {
      if (activePattern) {
        e.preventDefault();
        ghostCells.forEach(({ r, c }) => { current[r * COLS + c] = 1; });
        dirty = true;
        return;
      }
      e.preventDefault();
      dragging = true;
      drawMode = e.button === 2 ? 0 : 1;
      const { r, c, valid } = cellAt(e);
      if (valid) { current[r * COLS + c] = drawMode; dirty = true; }
    });
```

- [ ] **Step 4: Update `document.addEventListener('keydown', ...)` to handle Escape and clear ghost on R**

Find this block:
```javascript
    document.addEventListener('keydown', e => {
      if (e.code === 'Space') {
        e.preventDefault();
        paused = !paused;
      }
      if (e.code === 'KeyR') {
        current.fill(0);
        next.fill(0);
        dirty = true;
      }
    });
```

Replace with:
```javascript
    document.addEventListener('keydown', e => {
      if (e.code === 'Space') {
        e.preventDefault();
        paused = !paused;
      }
      if (e.code === 'KeyR') {
        current.fill(0);
        next.fill(0);
        ghostCells = [];
        dirty = true;
      }
      if (e.code === 'Escape' && activePattern) {
        activePattern = null;
        ghostCells = [];
        dirty = true;
        document.querySelectorAll('.stamp-btn').forEach(b => b.classList.remove('active'));
        stampHint.classList.remove('visible');
      }
    });
```

- [ ] **Step 5: Verify full stamp flow in browser**

Reload `http://localhost:8080`. Test the following:

1. Click `GLIDER` → ghost glider pattern follows your cursor over the field (medium gold `█` cells)
2. Click on the field → glider is stamped, simulation evolves it (press Space to pause first for clearer view)
3. Move cursor → ghost still follows (stamp stays active for multiple placements)
4. Press Escape → ghost disappears, GLIDER button unhighlights
5. Click `GOSPER GUN` → ghost of the 9×36 gun appears (may be clipped near edges)
6. Click near an edge → only the in-bounds cells are stamped (no crash)
7. Press R → grid clears, ghost clears

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: ghost preview, stamp placement, escape cancel"
```

---

## Self-Review

**Spec coverage:**
- [x] Fixed bottom toolbar with 4 buttons — Task 1
- [x] Toolbar CSS: colors, border, font, z-index 6 — Task 1
- [x] Button selected state (`.active` class) — Task 1 CSS + Task 4 JS
- [x] `STAMPS` label + `ESC to cancel` hint — Task 1 HTML + Task 4 JS
- [x] Pattern cell data: Glider, Blinker, Pulsar, Gosper Gun — Task 2
- [x] `activePattern` and `ghostCells` state — Task 2
- [x] Ghost rendered in `#cc9922` using Set for O(1) lookup — Task 3
- [x] Ghost clipped to valid grid bounds — Task 5 (filter in mousemove)
- [x] Stamp button click: activate / deactivate — Task 4
- [x] Only one button active at a time — Task 4
- [x] Ghost follows cursor on `#field` mousemove — Task 5
- [x] Ghost clears on `mouseleave` — Task 5
- [x] mousedown intercepts stamp placement, skips normal draw — Task 5
- [x] Stamp stays active after placement (multiple drops) — Task 5 (no clear after place)
- [x] Escape cancels stamp mode — Task 5
- [x] R clears ghost — Task 5
- [x] Space and R still work during stamp mode — Task 5

**No placeholders found.**

**Name consistency:** `activePattern`, `ghostCells`, `PATTERNS`, `stampHint`, `cellAt`, `dirty` — consistent across all tasks.
