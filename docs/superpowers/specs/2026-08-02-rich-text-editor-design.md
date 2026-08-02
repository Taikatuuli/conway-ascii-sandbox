# Rich Text Editor — Design Spec

Date: 2026-08-02

## Summary

A standalone, self-contained rich text editor tool (`richtext.html`), matching the
style of the repo's other single-file tools (`seasonal.html`, `attractor.html`,
`chaos.html`): no build step, no external dependencies, no backend. It lets the
user write formatted content with a toolbar and keyboard shortcuts, insert links
and images, insert "dynamic variable" chips whose displayed value can be edited
in one place, and insert fixed content blocks from a small starter library —
including via a Notion-style `/` slash command menu. Content auto-persists to
`localStorage` and can be copied out as clean HTML.

## Architecture

- Single file: `richtext.html`. Inline `<style>` and `<script>`, no dependencies,
  no CDN links — consistent with every other tool in this repo.
- **Editor surface**: a `contenteditable` `<div id="editor">`. Formatting
  commands are implemented directly against the Selection/Range APIs rather
  than `document.execCommand` (deprecated, inconsistent across browsers).
- **Toolbar**: fixed bar above the surface with grouped buttons (see below).
- **Keyboard shortcuts**: a single `keydown` listener on the editor dispatches
  to the same command functions the toolbar buttons call.
- **Slash command menu**: typing `/` opens an inline filterable popover
  anchored at the caret.
- **Variables panel**: a toggleable side/floating panel listing all variables
  currently used in the document, each with an input for its live value.
- **Blocks panel**: a toggleable panel listing the starter content-block
  library, searchable by name.
- **Persistence**: document HTML + variable values are auto-saved to
  `localStorage` (debounced) and restored on load.

## Data model

```js
// In-memory + persisted to localStorage under a single key
{
  docHTML: string,           // editor.innerHTML, source of truth for content
  variables: {                // name -> current value
    "clientName": "Acme Co",
    ...
  }
}
```

Variable chips in `docHTML` are:
```html
<span class="var-chip" contenteditable="false" data-var-name="clientName">{{clientName}}</span>
```
Display text inside the chip is kept in sync with `variables[name]` whenever
that value changes (chip shows `variables[name]` if set, otherwise the raw
`{{name}}` placeholder).

Content blocks are a hardcoded JS array (not persisted, not user-editable via
UI in this iteration — edit the array in source to change the library):
```js
const BLOCK_LIBRARY = [
  { name: "Bio blurb", type: "text", html: "<p>...</p>" },
  { name: "CTA snippet", type: "text", html: "<p>...</p>" },
  { name: "Logo placeholder", type: "image", html: "<img src='data:...' alt='logo'>" },
  ...
];
```
Inserting a block copies its `html` into the document at the caret; it is not
linked back to the library entry (editing the inserted copy does not affect
the library or other insertions).

## Toolbar & shortcuts

Groups, left to right:

1. **Text style**: Bold (⌘B), Italic (⌘I), Underline (⌘U), Inline code
2. **Headings**: H1 (⌘1), H2 (⌘2), H3 (⌘3), Paragraph (⌘0)
3. **Lists**: Bullet list, Numbered list
4. **Blockquote**
5. **Align**: Left, Center, Right
6. **Link**: opens URL popover (⌘K); if selection is already a link, popover
   also offers Edit/Remove
7. **Image**: opens file picker → `FileReader.readAsDataURL` → insert `<img>`
   at caret
8. **Font size**: dropdown (S / M / L / XL, mapped to fixed px values applied
   via `<span style="font-size:...">` wrapping the selection)
9. **Insert Variable**: prompts for a variable name (inline popover), inserts
   a chip, adds/updates a row in the Variables panel
10. **Blocks**: opens the Blocks panel
11. **Undo / Redo**

## Slash command menu

Typing `/` when the caret is at the start of an empty block, or after
whitespace, opens an inline popover listing:
- Heading 1/2/3, Bullet list, Numbered list, Blockquote, Link, Image, Variable
- Every entry in `BLOCK_LIBRARY`, each prefixed with its type

The list filters live as more characters are typed after `/`. Arrow
keys move selection, Enter confirms, Esc closes without inserting. On
confirm, the `/query` text is deleted and the corresponding action runs at
that caret position (same command functions the toolbar uses).

## Variables panel

- Toggled by its toolbar button.
- Lists every distinct `data-var-name` present in the current document.
- Each row: variable name (read-only) + text input bound to
  `variables[name]`. Editing the input updates every chip with that name in
  the document immediately.
- A variable with no value set yet displays its raw `{{name}}` placeholder in
  the editor.

## Blocks panel

- Toggled by its toolbar button.
- Search input filters the starter library by name.
- Clicking an entry inserts its HTML at the current caret position (or at the
  end of the document if focus was outside the editor).

## Undo / redo

Custom snapshot-based stack (push `docHTML` + selection offset before each
discrete edit — typing burst, formatting command, block/variable/image
insertion). Native `contenteditable` undo is not used, since chip/block
insertion needs to be a single atomic undo step, not a per-keystroke one.

## Persistence & export

- **Auto-save**: on every change, debounce (~500ms) then write
  `{docHTML, variables}` to a single `localStorage` key. On page load, if
  that key exists, restore it into the editor and Variables panel.
- **Copy HTML**: toolbar action serializes current content to a clean HTML
  string for clipboard copy (`navigator.clipboard.writeText`). During
  serialization, each `var-chip` span is replaced with its plain-text current
  value (or, if unset, the raw `{{name}}` text) — the exported HTML never
  contains chip markup. Shows a brief toast confirming the copy.
- **New document**: clears the editor and localStorage, behind a
  confirmation prompt (destructive).

## Error handling

- Image upload: if a selected file isn't an image type or `FileReader` fails,
  show an inline toast and skip insertion — no partial `<img>` is inserted.
- Clipboard copy failure (e.g. permissions): fall back to selecting the
  exported HTML in a hidden textarea so the user can manually copy, plus a
  toast explaining the fallback.
- `localStorage` unavailable/full: catch the write error, show a toast that
  auto-save failed, and continue functioning in-memory for the session.

## Testing

This repo has no automated test suite for its tool pages; verification is
manual, in-browser, per existing convention. Before calling this done, verify
in the local preview:
- Each toolbar action and its keyboard shortcut
- Slash menu: filtering, arrow/Enter/Esc behavior, each entry type
- Variable insert → panel row appears → editing value updates chip(s) live →
  export substitutes correctly
- Block insert (text and image types) from both panel and slash menu
- Image upload insert, including a non-image file to confirm the error path
- Undo/redo across a mix of typing, formatting, and block/variable/image
  inserts
- Save → reload page → content and variable values restored
- Copy HTML → paste into a plain text area to confirm output is clean and
  chip-free
- Responsive check at a narrow viewport width, since the toolbar is dense

## Out of scope (for this iteration)

- In-app CRUD for the block library (starter set only, edit source to change)
- Multi-document management (single document per browser/localStorage)
- Real-time collaboration or any backend/server component
- Table support
