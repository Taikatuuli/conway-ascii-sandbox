# Start Panel Glider Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a glider art header zone to the top of the start panel in index.html — a sparse field of `·` and `+` cell characters with a glider pattern centered, sitting above the `[ GAME OF LIFE ]` title divider.

**Architecture:** Pure HTML/CSS edit to index.html. A new `.glider-art` CSS class styles a `<pre>` block. A new plain `ascii-hr` top border and a new `ascii-section` glider zone are prepended to `#start-panel`. No JavaScript changes.

**Tech Stack:** HTML, CSS, monospace ASCII characters

---

### Task 1: Add `.glider-art` CSS class

**Files:**
- Modify: `index.html` — `<style>` block, after `#start-panel` rule (~line 298)

- [ ] **Step 1: Add the CSS rule**

Insert after the closing `}` of `#start-panel` (around line 298):

```css
.glider-art {
  margin: 0;
  padding: 4px 0;
  white-space: pre;
  font-family: 'Courier New', Courier, monospace;
  font-size: 12px;
  line-height: 1.8;
  letter-spacing: 0.5px;
  color: #2a2a2a;
  overflow: hidden;
}

.glider-art .alive {
  color: #ffffff;
}
```

- [ ] **Step 2: Verify no style conflicts**

Open `index.html` in a browser. The start screen should look identical to before — no visible change yet.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "add glider-art CSS class for start panel header zone"
```

---

### Task 2: Add glider header HTML to start panel

**Files:**
- Modify: `index.html` — `#start-panel` div (~line 476)

- [ ] **Step 1: Prepend the top border and glider zone**

The current `#start-panel` opens with the `[ GAME OF LIFE ]` title as its first child. Replace:

```html
    <div id="start-panel">
      <div class="ascii-hr"><span class="ascii-hr-fill">----------------------------</span><span class="ascii-hr-label">[ GAME OF LIFE ]</span><span class="ascii-hr-fill">----------------------------</span></div>
```

With:

```html
    <div id="start-panel">
      <div class="ascii-hr"><span class="ascii-hr-fill">--------------------------------------------------------------------------------</span></div>
      <div class="ascii-section">
        <div class="ascii-section-inner" style="padding-top:8px;padding-bottom:8px;">
          <pre class="glider-art"
>·  ·     ·        ·              ·     ·    ·      ·   ·
·       ·          ·      <span class="alive">+</span>      ·          ·    ·     ·
  ·          ·                     <span class="alive">+</span>    ·          ·     
·     ·  ·            <span class="alive">+</span><span class="alive">+</span><span class="alive">+</span>    ·       ·      ·        ·
  ·        ·    ·          ·       ·     ·      ·   ·  </pre>
        </div>
      </div>
      <div class="ascii-hr"><span class="ascii-hr-fill">----------------------------</span><span class="ascii-hr-label">[ GAME OF LIFE ]</span><span class="ascii-hr-fill">----------------------------</span></div>
```

Note on the glider positions (standard SE-moving glider):
- Row 1, ~col 27: single `+` (top of glider)
- Row 2, ~col 33: single `+` (middle-right of glider)
- Row 3, ~cols 22–24: `+++` (base of glider)

The `<pre>` tag must be on the same line as the opening `>` to avoid extra whitespace. The `·` characters should be a mix of `#2a2a2a` (from `.glider-art` default) and the scattered feel comes from irregular spacing between them.

- [ ] **Step 2: Open in browser and check visually**

Expected:
- A plain `+---+` border at the very top of the panel
- A sparse cell field below it with three bright `+` chars forming a glider shape
- The `[ GAME OF LIFE ]` title divider immediately below the cell zone
- All existing content (description, how to play, start button) unchanged below

If the glider feels off-center or the `·` density looks wrong, nudge character positions in the `<pre>` until it reads naturally. The goal: glider is clearly the focal point, scattered `·` are subtle.

- [ ] **Step 3: Check on a narrow viewport (375px)**

Resize browser to 375px width. The glider art should clip gracefully (overflow:hidden) without breaking the panel layout.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "add glider art header zone to start panel"
```

---

### Task 3: Push to GitHub

- [ ] **Step 1: Push**

```bash
git push
```

- [ ] **Step 2: Verify on live URL**

Open `https://game-of-life.vercel.app` and confirm the glider header appears correctly on both desktop and mobile.
