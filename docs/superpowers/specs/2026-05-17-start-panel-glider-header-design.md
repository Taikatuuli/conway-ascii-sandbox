# Start Panel — Glider Header Zone

## Goal

Add a glider art header zone to the top of the start panel, making the ASCII art feel more polished and thematic by embedding a Game of Life pattern directly into the design.

## Design

### Structure change

The current panel opens with the `[ GAME OF LIFE ]` title as the very first element. The new structure adds two elements before it:

1. A plain top border: `+` corners with `---` fill (no label)
2. A glider art zone: 5 rows of cell characters

The existing `[ GAME OF LIFE ]` divider then acts as the transition from the art zone into the content below. Everything after it (description, how to play, collapsible rules, start button, attribution) is unchanged.

### Glider art zone

- 5 rows tall, full panel width
- Characters: `+` for alive cells, `·` for dead/fading cells, spaces for empty
- A glider pattern (`+` cells in the canonical 3-cell diagonal formation) centered horizontally in the zone
- Sparse scatter of `·` characters around the glider — low density, glider is the clear focal point
- Rendered as a `<pre>` or `white-space: pre` div with matching font/size to the rest of the panel
- No side border pseudo-elements on this zone — it sits flush inside the outer `+---+` frame
- Static HTML, no JavaScript

### Visual tone

- Glider cells: `#ffffff` (same as other live cells in the game)
- Scattered dead cells: `#333333` or `#444444` (dim, not distracting)
- Matches the existing monospace font, 12px, letter-spacing 0.5px

## Scope

- Edit `index.html` only
- Add a new CSS class for the glider zone if needed
- No changes to JavaScript, game logic, or any other content
