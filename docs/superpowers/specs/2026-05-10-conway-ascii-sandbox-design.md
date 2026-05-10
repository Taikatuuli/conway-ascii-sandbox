# Conway's Game of Life — ASCII Sandbox

**Date:** 2026-05-10  
**Status:** Approved

## Overview

A fullscreen browser sandbox built on Conway's Game of Life. The entire viewport is a `<pre>` element filled with ASCII characters that reflect the simulation state. The user draws and erases cells with the mouse; the field evolves on its own. No win condition, no score — pure generative play.

## Visual Design

The field uses a density gradient character set: `░ ▒ ▓ █`

Each cell maps to a character based on whether it is alive and how many live neighbors it has:

| State | Neighbors | Character | Color |
|---|---|---|---|
| Dead | 0 | `░` | very dim |
| Dead | 1–2 | `▒` | dim |
| Dead | 3 (about to be born) | `▓` | medium |
| Alive | 2–3 (stable) | `█` | bright gold |
| Alive | other (dying/overcrowded) | `▓` | medium gold |

Dead cells near live neighbors glow dimmer shades of the same warm golden palette, making clusters feel dense and hot. The field breathes visibly as generations pass.

## Architecture

Single `index.html` file with embedded CSS and JS. No build step, no dependencies.

### Structure

```
index.html
  <style>   — fullscreen pre, cursor crosshair, overlay fade transition
  <pre>     — the field, fills 100vw × 100vh
  <div>     — hover overlay (controls hint, fades in near top edge)
  <script>  — grid, rule engine, renderer, input handler, game loop
```

### Components

**Grid**  
A flat `Uint8Array` of `rows × cols` cells (0 = dead, 1 = alive). Dimensions computed at startup from `Math.floor(viewport / charSize)`. Double-buffered: a second `Uint8Array` of the same size acts as the write target each tick; buffers are swapped after each generation.

**Rule Engine**  
Pure function `nextGen(src, dst, cols, rows)`. Iterates every cell, counts its 8 neighbors (wrapping at edges), applies Conway's rules, writes result into `dst`. No allocation per tick.

Conway's rules:
- Live cell with 2 or 3 live neighbors → survives
- Live cell with any other count → dies
- Dead cell with exactly 3 live neighbors → born
- All other dead cells → stay dead

**Renderer**  
After each tick, walks the grid once. For each cell, selects a character and color class based on alive state and neighbor count. Builds a single string and sets `pre.innerHTML`. Color is applied via `<span>` wrappers only where needed (non-default color cells), keeping string size manageable.

**Input Handler**  
- `mousedown` — record button (left=draw, right=erase), toggle cell under cursor, set drag mode
- `mousemove` — if dragging, toggle cell under cursor
- `mouseup` / `mouseleave` — end drag
- `contextmenu` — `preventDefault` to suppress right-click menu

Cell under cursor is computed from `event.clientX / charWidth` and `event.clientY / charHeight`.

**Game Loop**  
`requestAnimationFrame` drives rendering. A separate tick timer (default interval: 100ms) triggers `nextGen`. This decouples visual smoothness from simulation speed. When paused, `nextGen` is skipped but `rAF` continues (so mouse drawing still renders immediately).

## Controls

Shown as a dim overlay that fades in when the cursor is within 60px of the top edge, fades out otherwise (CSS `opacity` transition, 300ms).

| Input | Action |
|---|---|
| Left click / drag | Draw live cells |
| Right click / drag | Erase cells |
| Space | Pause / resume |
| R | Clear grid |

## Data Flow (per tick)

1. `nextGen(current, next, cols, rows)` — writes into swap buffer
2. Swap `current` ↔ `next`
3. Walk grid → build ASCII string with inline `<span>` color wrappers
4. `pre.innerHTML = string`

## Edge Wrapping

The grid wraps toroidally — cells on the left edge treat the right edge as their neighbor and vice versa, same for top/bottom. This prevents dead borders and lets gliders travel indefinitely.

## Non-Goals

- No rule-set switching
- No speed controls (fixed 100ms tick)
- No save/load
- No mobile / touch support
