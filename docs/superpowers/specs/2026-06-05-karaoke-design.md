# Karaoke Language Learning App — Design Spec
**Date:** 2026-06-05

## Overview

A single-file browser app (`karaoke.html`) that combines YouTube video playback with synchronized, translated lyrics for language learning. Users paste a YouTube URL and raw lyrics, pick a target language, and the app fetches translations via the Claude API, then highlights lyrics in time with the video.

Fits the existing project pattern: one self-contained HTML file, no build step, no framework.

---

## Architecture

Single HTML file with three screens toggled via CSS class swaps on a root `#app` container. No DOM re-renders — panels exist in the DOM at all time, `display` swaps reveal the active screen.

State lives in a plain JS object (`APP`). No framework or bundler.

**Screens:**
1. `#screen-input` — URL, lyrics textarea, language picker, API key gate
2. `#screen-loading` — spinner + "Translating N lines…" counter
3. `#screen-player` — two-column YouTube + lyrics panel layout

---

## Input Screen

- YouTube URL text input
- Textarea for raw lyrics (plain text, one line per row)
- `<select>` for target language: Spanish, French, Japanese, Mandarin, Korean, Portuguese
- "Start" button — validates URL (non-empty, parseable video ID) and lyrics (non-empty)
- **API key gate:** on "Start" click, check `localStorage.getItem('anthropic_api_key')`. If absent, show an inline prompt asking the user to paste their Anthropic API key, then store it with `localStorage.setItem`. No separate screen — inline within the input screen flow.

---

## Translation Pipeline

Sequential — translation completes before the player screen is shown.

1. Parse textarea → `lines[]`: split by `\n`, trim each, filter empty strings
2. Show `#screen-loading` with line count
3. POST to `https://api.anthropic.com/v1/messages` with `x-api-key` header (browser-direct fetch; Anthropic supports cross-origin requests)
4. **Model:** `claude-sonnet-4-6`
5. **Prompt:** instruct Claude to return a JSON array — one object per lyric line — with shape:
   ```json
   [
     {
       "original": "original lyric line",
       "translation": "translated line",
       "phonetic": "romanization or pronunciation guide",
       "keywords": [{ "word": "word", "meaning": "meaning" }]
     }
   ]
   ```
   Include 3–6 keywords per line (notable vocabulary words). For phonetic: use romanization natural to the target language (pinyin for Mandarin, romaji for Japanese, Revised Romanization for Korean, IPA-lite for others).
6. Parse response JSON, store as `APP.lyrics[]`
7. Extract YouTube video ID from URL using regex
8. Initialize YouTube iframe via `YT.Player` constructor
9. Transition to `#screen-player` once `onReady` fires

---

## Player Screen Layout

Two-column on desktop (≥ 768px):

```
┌──────────────────────┬───────────────────────────┐
│                      │  lyrics panel (scrollable) │
│  YouTube iframe      │  ─────────────────────── │
│  (16:9 ratio)        │  [past line — muted]       │
│  left column         │  [CURRENT LINE — bold]     │
│                      │    translation (gray)       │
│                      │    phonetic (blue)          │
│                      │  [upcoming line — dim]      │
└──────────────────────┴───────────────────────────┘
```

On mobile (< 768px): stacks vertically — video on top, lyrics panel below with fixed height and scroll.

---

## Lyric Sync Engine

**Timestamp assignment:**
- After `onReady`, call `player.getDuration()`. If it returns 0 (metadata not yet loaded), retry every 500ms until non-zero.
- Assign: `timestamps[i] = (i / lines.length) * duration` for each line index `i`

**Polling:**
- `setInterval(500)`: call `player.getCurrentTime()`, find the largest `i` where `timestamps[i] <= currentTime`
- That index becomes `APP.currentLine`

**On line change:**
- Remove `.current`, `.past`, `.upcoming` classes from all line elements
- Apply `.past` to lines before current, `.current` to current, `.upcoming` to lines after
- Call `scrollIntoView({ behavior: 'smooth', block: 'center' })` on the current line element within the lyrics panel

---

## Tap-to-Translate

- On render, each word in every line is wrapped in `<span class="word" data-line="i">word</span>`
- Click handler on the lyrics panel: if `event.target` has class `.word` and its `data-line` matches `APP.currentLine`, look up the word in `APP.lyrics[i].keywords` (case-insensitive match on `word` field)
- Show a tooltip near the clicked element with: `word → meaning`
- If the word is not found in `keywords`, show "no translation available"
- Tooltip dismisses on: click-outside (document mousedown listener), or after 3 seconds via `setTimeout`
- Only one tooltip visible at a time

---

## Vocabulary Recap Modal

- YouTube `onStateChange` callback: when state equals `YT.PlayerState.ENDED`, show `#modal-recap`
- Collect all keywords across `APP.lyrics[]`, deduplicate by `word` (case-insensitive)
- Display as a scrollable grid of cards: `word | meaning`
- Header: **"You learned N words in [Language]!"**
- Two buttons: "Close" (hides modal), "Watch Again" (calls `player.seekTo(0)` + `player.playVideo()` + hides modal)

---

## API Key Handling

- Key stored in `localStorage` under key `'anthropic_api_key'`
- Sent as `x-api-key` header on every Claude API request
- If an API call returns 401, show an inline error with a "Reset API key" link that clears localStorage and re-prompts
- No server-side component; key lives entirely client-side (user is explicitly aware)

---

## Styling

- Background: `#0d0d0d` | Base text: `#e8e8e8`
- **Current line:** `font-size: 1.3em`, `font-weight: 700`, `color: #fff`, left border `4px solid #4ade80`
- **Past lines:** `opacity: 0.35`
- **Upcoming lines:** `opacity: 0.6`
- **Translation:** `font-size: 0.85em`, `color: #8b8b8b`, `font-style: italic`
- **Phonetic:** `font-size: 0.8em`, `color: #5a9fd4`
- **Accent color:** `#4ade80` (green) for current line indicator and interactive elements
- **Tooltip:** dark bg `#1a1a1a`, border `#333`, small rounded card
- **Font:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Recap modal:** centered overlay, backdrop blur, card with word grid
- Mobile-first responsive: single-column below 768px

---

## Error States

- YouTube URL invalid → inline error on input screen, no transition
- Claude API error → show error message on loading screen with "Try again" button
- Claude returns malformed JSON → fall back to showing original lyrics only, no translation/keywords
- Video duration unavailable after 5s of retries → show warning, use line-count-based estimates with 0 as start
