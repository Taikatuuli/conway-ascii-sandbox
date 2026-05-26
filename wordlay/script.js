// Wordlay — fridge magnet poetry

// ─── Word Bank ────────────────────────────────────────────────────────────────

const WORD_BANK = {
  nounsConcrete: {
    quota: 10,
    words: [
      { w: 'moon', priority: true }, { w: 'fire', priority: true },
      { w: 'blood', priority: true }, { w: 'shadow', priority: true },
      { w: 'knife', priority: true }, { w: 'mirror', priority: true },
      { w: 'night', priority: true }, { w: 'ghost', priority: true },
      { w: 'flame', priority: true }, { w: 'spark', priority: true },
      { w: 'rain' }, { w: 'skin' }, { w: 'door' }, { w: 'glass' },
      { w: 'stone' }, { w: 'smoke' }, { w: 'wave' }, { w: 'light' },
      { w: 'hand' }, { w: 'eye' }, { w: 'mouth' }, { w: 'heart' },
      { w: 'bone' }, { w: 'road' }, { w: 'room' }, { w: 'window' },
      { w: 'river' }, { w: 'tree' }, { w: 'water' }, { w: 'floor' },
      { w: 'chair' }, { w: 'wall' }, { w: 'bed' }, { w: 'city' },
      { w: 'sky' }, { w: 'ocean' }, { w: 'lake' }, { w: 'desert' },
      { w: 'forest' }, { w: 'mountain' }, { w: 'valley' }, { w: 'bridge' },
      { w: 'tower' }, { w: 'garden' }, { w: 'street' }, { w: 'house' },
      { w: 'ship' }, { w: 'train' }, { w: 'clock' }, { w: 'key' },
      { w: 'letter' }, { w: 'book' }, { w: 'song' }, { w: 'word' },
      { w: 'cat' }, { w: 'dog' }, { w: 'bird' }, { w: 'flower' },
      { w: 'leaf' }, { w: 'star' }, { w: 'sun' }, { w: 'cloud' },
      { w: 'fog' }, { w: 'snow' }, { w: 'ice' }, { w: 'dust' },
      { w: 'ash' }, { w: 'rust' }, { w: 'silver' }, { w: 'gold' },
      { w: 'salt' }, { w: 'sugar' }, { w: 'milk' }, { w: 'coffee' },
      { w: 'wine' }, { w: 'honey' }, { w: 'dirt' }, { w: 'grass' },
    ]
  },
  nounsAbstract: {
    quota: 5,
    words: [
      { w: 'hunger', priority: true }, { w: 'silence', priority: true },
      { w: 'rage', priority: true }, { w: 'grief', priority: true },
      { w: 'desire', priority: true },
      { w: 'love' }, { w: 'doubt' }, { w: 'fear' }, { w: 'hope' },
      { w: 'shame' }, { w: 'pride' }, { w: 'joy' }, { w: 'memory' },
      { w: 'time' }, { w: 'death' }, { w: 'dream' }, { w: 'pain' },
      { w: 'beauty' }, { w: 'power' }, { w: 'need' }, { w: 'loss' },
      { w: 'change' }, { w: 'wonder' }, { w: 'chaos' }, { w: 'weight' },
      { w: 'emptiness' }, { w: 'peace' }, { w: 'freedom' }, { w: 'truth' },
      { w: 'longing' }, { w: 'faith' }, { w: 'anger' }, { w: 'guilt' },
      { w: 'bliss' }, { w: 'dread' }, { w: 'ache' }, { w: 'luck' },
      { w: 'fate' }, { w: 'lie' },
    ]
  },
  verbs: {
    quota: 10,
    words: [
      { w: 'breathe', priority: true }, { w: 'drown', priority: true },
      { w: 'burn', priority: true }, { w: 'bleed', priority: true },
      { w: 'scream', priority: true }, { w: 'whisper', priority: true },
      { w: 'hunt', priority: true }, { w: 'die', priority: true },
      { w: 'escape', priority: true }, { w: 'shatter', priority: true },
      { w: 'drink' }, { w: 'fall' }, { w: 'run' }, { w: 'sleep' },
      { w: 'wake' }, { w: 'touch' }, { w: 'break' }, { w: 'hold' },
      { w: 'lose' }, { w: 'find' }, { w: 'leave' }, { w: 'stay' },
      { w: 'watch' }, { w: 'wait' }, { w: 'listen' }, { w: 'speak' },
      { w: 'sing' }, { w: 'dance' }, { w: 'float' }, { w: 'sink' },
      { w: 'rise' }, { w: 'climb' }, { w: 'push' }, { w: 'pull' },
      { w: 'cut' }, { w: 'heal' }, { w: 'grow' }, { w: 'live' },
      { w: 'love' }, { w: 'hate' }, { w: 'need' }, { w: 'want' },
      { w: 'see' }, { w: 'feel' }, { w: 'know' }, { w: 'forget' },
      { w: 'remember' }, { w: 'carry' }, { w: 'drop' }, { w: 'throw' },
      { w: 'catch' }, { w: 'hide' }, { w: 'seek' }, { w: 'open' },
      { w: 'close' }, { w: 'walk' }, { w: 'fly' }, { w: 'swim' },
      { w: 'eat' }, { w: 'feed' }, { w: 'chase' }, { w: 'follow' },
      { w: 'trust' }, { w: 'laugh' }, { w: 'cry' }, { w: 'fight' },
      { w: 'give' }, { w: 'take' }, { w: 'read' }, { w: 'write' },
      { w: 'build' }, { w: 'destroy' }, { w: 'fix' }, { w: 'turn' },
      { w: 'move' }, { w: 'stop' }, { w: 'start' },
    ]
  },
  adjectives: {
    quota: 8,
    words: [
      { w: 'quiet' }, { w: 'wild' }, { w: 'soft' }, { w: 'dark' },
      { w: 'bright' }, { w: 'cold' }, { w: 'warm' }, { w: 'empty' },
      { w: 'full' }, { w: 'broken' }, { w: 'sharp' }, { w: 'deep' },
      { w: 'shallow' }, { w: 'heavy' }, { w: 'fast' }, { w: 'slow' },
      { w: 'old' }, { w: 'young' }, { w: 'beautiful' }, { w: 'strange' },
      { w: 'familiar' }, { w: 'lost' }, { w: 'alive' }, { w: 'dead' },
      { w: 'small' }, { w: 'huge' }, { w: 'rough' }, { w: 'smooth' },
      { w: 'dirty' }, { w: 'clean' }, { w: 'loud' }, { w: 'silent' },
      { w: 'free' }, { w: 'open' }, { w: 'closed' }, { w: 'burning' },
      { w: 'frozen' }, { w: 'raw' }, { w: 'bitter' }, { w: 'sweet' },
      { w: 'hollow' }, { w: 'fragile' }, { w: 'cruel' }, { w: 'gentle' },
      { w: 'fierce' }, { w: 'tender' }, { w: 'bold' }, { w: 'shy' },
      { w: 'tired' }, { w: 'awake' }, { w: 'long' }, { w: 'thin' },
      { w: 'pale' }, { w: 'golden' }, { w: 'black' }, { w: 'red' },
      { w: 'blue' }, { w: 'bleeding' }, { w: 'solid' }, { w: 'sacred' },
    ]
  },
  adverbs: {
    quota: 4,
    words: [
      { w: 'almost' }, { w: 'never' }, { w: 'always' }, { w: 'still' },
      { w: 'again' }, { w: 'already' }, { w: 'soon' }, { w: 'away' },
      { w: 'together' }, { w: 'alone' }, { w: 'now' }, { w: 'then' },
      { w: 'too' }, { w: 'just' }, { w: 'only' }, { w: 'even' },
      { w: 'ever' }, { w: 'once' }, { w: 'slowly' }, { w: 'quietly' },
      { w: 'deeply' }, { w: 'softly' }, { w: 'wildly' }, { w: 'silently' },
      { w: 'gently' }, { w: 'suddenly' }, { w: 'forever' }, { w: 'twice' },
      { w: 'barely' }, { w: 'truly' },
    ]
  },
  prepositions: {
    quota: null, // draw all
    words: [
      { w: 'into' }, { w: 'through' }, { w: 'beneath' }, { w: 'above' },
      { w: 'before' }, { w: 'after' }, { w: 'between' }, { w: 'beyond' },
      { w: 'within' }, { w: 'without' }, { w: 'under' }, { w: 'over' },
      { w: 'beside' }, { w: 'around' }, { w: 'against' }, { w: 'toward' },
      { w: 'from' }, { w: 'and' }, { w: 'but' }, { w: 'until' },
    ]
  },
  articles: {
    quota: null, // draw all
    words: [
      { w: 'the' }, { w: 'a' }, { w: 'I' }, { w: 'you' },
      { w: 'we' }, { w: 'they' }, { w: 'he' }, { w: 'she' },
      { w: 'it' }, { w: 'my' }, { w: 'your' }, { w: 'our' },
      { w: 'their' }, { w: 'me' }, { w: 'us' },
    ]
  }
};

// ─── Word Draw ────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Draw a balanced hand from the word bank.
 * Priority words fill their quota first; remainder is random.
 * Returns an array of word strings — priority words first, so the pile
 * starts with the most evocative words on top.
 */
function drawHand() {
  const hand = [];
  for (const bucket of Object.values(WORD_BANK)) {
    const priority = bucket.words.filter(w => w.priority);
    const normal = shuffle(bucket.words.filter(w => !w.priority));
    const pool = [...priority, ...normal];
    const quota = bucket.quota ?? pool.length;
    hand.push(...pool.slice(0, quota).map(w => w.w));
  }
  return hand;
}

// ─── State ────────────────────────────────────────────────────────────────────

let tileIdCounter = 0;

const state = {
  pile: [],    // [{ word: string, rotation: number }] — index 0 is top of pile
  canvas: [],  // [{ id: string, word: string, x: number, y: number, rotation: number }]
  readOnly: false,
};

function randomRotation() {
  return parseFloat((Math.random() * 2 - 1).toFixed(2)); // -1.00 to +1.00 degrees
}

function initSession(hand) {
  tileIdCounter = 0;
  state.pile = hand.map(word => ({ word, rotation: randomRotation() }));
  state.canvas = [];
  state.readOnly = false;
}

// ─── Render ───────────────────────────────────────────────────────────────────

const $pile      = document.getElementById('pile');
const $pileCount = document.getElementById('pile-count');
const $canvas    = document.getElementById('canvas');

function renderPile() {
  $pile.innerHTML = '';

  if (state.pile.length === 0) {
    $pileCount.textContent = 'All words placed';
    $pile.style.cursor = 'default';
    return;
  }

  $pile.style.cursor = 'grab';

  // Show up to 3 stacked cards, back-to-front
  const visible = state.pile.slice(0, 3).reverse(); // index 0 of visible = deepest card
  visible.forEach((item, i) => {
    const depth = visible.length - 1 - i; // 0 = top card
    const card = document.createElement('div');
    card.className = 'pile-card';
    card.style.transform = `rotate(${depth * 1.5}deg)`;
    card.style.top  = `${depth * 2}px`;
    card.style.left = `${depth * 2}px`;
    card.style.zIndex  = i;
    card.style.opacity = depth === 0 ? '1' : '0.5';
    if (depth === 0) {
      card.textContent = item.word;
      card.id = 'pile-top';
    }
    $pile.appendChild(card);
  });

  const n = state.pile.length;
  $pileCount.textContent = `${n} word${n === 1 ? '' : 's'} remaining`;
}

function renderCanvas() {
  $canvas.querySelectorAll('.tile').forEach(el => el.remove());
  state.canvas.forEach(tile => $canvas.appendChild(createTileElement(tile)));
}

function createTileElement(tile) {
  const el = document.createElement('div');
  el.className = 'tile' + (state.readOnly ? ' readonly' : '');
  el.dataset.id = tile.id;
  el.textContent = tile.word;
  el.style.left      = tile.x + 'px';
  el.style.top       = tile.y + 'px';
  el.style.transform = `rotate(${tile.rotation}deg)`;
  if (!state.readOnly) attachCanvasTileDrag(el, tile);
  return el;
}

function renderAttribution() {
  $canvas.querySelector('.attribution')?.remove();
  const raw = document.getElementById('author-input')?.value?.trim();
  if (!raw) return;
  const author = raw.startsWith('@') ? raw : '@' + raw;
  const el = document.createElement('div');
  el.className = 'attribution';
  el.textContent = `Made by ${author} · Wordlay`;
  $canvas.appendChild(el);
}

// ─── Drag Utilities ───────────────────────────────────────────────────────────

const GRID = 24;

function snapToGrid(val) {
  return Math.round(val / GRID) * GRID;
}

function createFloatingClone(word, x, y) {
  const el = document.createElement('div');
  el.className = 'tile dragging';
  el.textContent = word;
  el.style.position = 'fixed';
  el.style.left = x + 'px';
  el.style.top  = y + 'px';
  el.style.pointerEvents = 'none';
  document.body.appendChild(el);
  return el;
}

// ─── Canvas Tile Drag ─────────────────────────────────────────────────────────

const DISCARD_EDGE = 20; // px from canvas edge to trigger discard

function attachCanvasTileDrag(el, tile) {
  el.addEventListener('pointerdown', e => {
    e.preventDefault();
    e.stopPropagation();

    const canvasRect = $canvas.getBoundingClientRect();
    const offsetX = e.clientX - canvasRect.left - tile.x;
    const offsetY = e.clientY - canvasRect.top  - tile.y;

    el.classList.remove('snapping');
    el.classList.add('dragging');
    el.style.zIndex = 1000;
    el.setPointerCapture(e.pointerId);

    function onMove(ev) {
      const rawX = ev.clientX - canvasRect.left - offsetX;
      const rawY = ev.clientY - canvasRect.top  - offsetY;
      el.style.left = rawX + 'px';
      el.style.top  = rawY + 'px';
    }

    function onUp(ev) {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.classList.remove('dragging');
      el.style.zIndex = '';

      const rawX = ev.clientX - canvasRect.left - offsetX;
      const rawY = ev.clientY - canvasRect.top  - offsetY;
      const canvasW = $canvas.offsetWidth;
      const canvasH = $canvas.offsetHeight;

      const nearEdge =
        rawX < DISCARD_EDGE || rawY < DISCARD_EDGE ||
        rawX > canvasW - DISCARD_EDGE || rawY > canvasH - DISCARD_EDGE;

      if (nearEdge) {
        state.canvas = state.canvas.filter(t => t.id !== tile.id);
        state.pile.push({ word: tile.word, rotation: tile.rotation });
        el.remove();
        renderPile();
        attachPileDrag();
      } else {
        const x = Math.max(0, snapToGrid(rawX));
        const y = Math.max(0, snapToGrid(rawY));
        tile.x = x;
        tile.y = y;
        el.classList.add('snapping');
        el.style.left = x + 'px';
        el.style.top  = y + 'px';
      }
    }

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
  });
}

// ─── Pile Interaction ─────────────────────────────────────────────────────────

const DRAG_THRESHOLD = 5; // px movement before gesture becomes a drag

function cyclePile() {
  if (state.pile.length <= 1) return;
  state.pile.push(state.pile.shift()); // move top to bottom
  renderPile();
  attachPileDrag();
}

function attachPileDrag() {
  $pile.removeEventListener('pointerdown', onPilePointerDown);
  $pile.addEventListener('pointerdown', onPilePointerDown);
}

function onPilePointerDown(e) {
  if (state.pile.length === 0) return;
  e.preventDefault();

  const startX = e.clientX;
  const startY = e.clientY;
  let moved = false;
  let clone = null;

  const topCard = document.getElementById('pile-top');
  const rect = topCard ? topCard.getBoundingClientRect() : { left: startX, top: startY };
  const offsetX = startX - rect.left;
  const offsetY = startY - rect.top;

  $pile.setPointerCapture(e.pointerId);

  function onMove(ev) {
    if (!moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) > DRAG_THRESHOLD) {
      moved = true;
      clone = createFloatingClone(
        state.pile[0].word,
        ev.clientX - offsetX,
        ev.clientY - offsetY
      );
    }
    if (clone) {
      clone.style.left = (ev.clientX - offsetX) + 'px';
      clone.style.top  = (ev.clientY - offsetY) + 'px';
    }
  }

  function onUp(ev) {
    $pile.removeEventListener('pointermove', onMove);
    $pile.removeEventListener('pointerup', onUp);

    if (!moved) {
      cyclePile();
      return;
    }

    clone?.remove();
    clone = null;

    const canvasRect = $canvas.getBoundingClientRect();
    const overCanvas =
      ev.clientX >= canvasRect.left && ev.clientX <= canvasRect.right &&
      ev.clientY >= canvasRect.top  && ev.clientY <= canvasRect.bottom;

    if (overCanvas) {
      const rawX = ev.clientX - canvasRect.left - offsetX;
      const rawY = ev.clientY - canvasRect.top  - offsetY;
      const x = Math.max(0, snapToGrid(rawX));
      const y = Math.max(0, snapToGrid(rawY));

      const pileItem = state.pile.shift();
      const id = 'tile-' + (++tileIdCounter);
      state.canvas.push({ id, word: pileItem.word, x, y, rotation: pileItem.rotation });

      renderPile();
      attachPileDrag();
      renderCanvas();
    }
  }

  $pile.addEventListener('pointermove', onMove);
  $pile.addEventListener('pointerup', onUp);
}

// ─── Controls ─────────────────────────────────────────────────────────────────

function newSession() {
  $canvas.classList.remove('readonly');
  document.getElementById('readonly-banner').classList.add('hidden');
  window.location.hash = '';
  startFreshSession();
}

document.getElementById('btn-new-words').addEventListener('click', newSession);

// ─── Boot ─────────────────────────────────────────────────────────────────────

function startFreshSession() {
  const hand = drawHand();
  initSession(hand);
  renderPile();
  attachPileDrag();
  renderCanvas();
  const saved = localStorage.getItem('wordlay-author') || '';
  document.getElementById('author-input').value = saved;
  renderAttribution();
}

// ─── Share Sheet ──────────────────────────────────────────────────────────────

const $shareSheet   = document.getElementById('share-sheet');
const $shareOverlay = document.getElementById('share-overlay');
const $authorInput  = document.getElementById('author-input');

function openShareSheet() {
  const saved = localStorage.getItem('wordlay-author') || '';
  $authorInput.value = saved;
  $shareSheet.classList.remove('hidden');
  $shareOverlay.classList.remove('hidden');
  setTimeout(() => $authorInput.focus(), 50);
}

function closeShareSheet() {
  $shareSheet.classList.add('hidden');
  $shareOverlay.classList.add('hidden');
}

document.getElementById('btn-share').addEventListener('click', openShareSheet);
$shareOverlay.addEventListener('click', closeShareSheet);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeShareSheet(); });

$authorInput.addEventListener('input', () => {
  // Strip spaces live
  const cleaned = $authorInput.value.replace(/\s/g, '');
  $authorInput.value = cleaned;
  const val = cleaned.trim();
  if (val) {
    localStorage.setItem('wordlay-author', val);
  } else {
    localStorage.removeItem('wordlay-author');
  }
  renderAttribution();
});

// ─── Sharing: Copy Link ───────────────────────────────────────────────────────

function serializeState() {
  const raw = $authorInput.value.trim();
  const author = raw ? (raw.startsWith('@') ? raw : '@' + raw) : null;
  const payload = {
    tiles: state.canvas.map(t => ({ word: t.word, x: t.x, y: t.y, rotation: t.rotation })),
    author,
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

function copyLink() {
  const encoded = serializeState();
  const url = window.location.origin + window.location.pathname + '#' + encoded;
  window.location.hash = encoded;

  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('btn-copy-link');
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  }).catch(() => {
    window.prompt('Copy this link:', url);
  });
}

document.getElementById('btn-copy-link').addEventListener('click', copyLink);

// ─── Share Link Landing ───────────────────────────────────────────────────────

function loadSharedPoem(hash) {
  let payload;
  try {
    payload = JSON.parse(decodeURIComponent(escape(atob(hash))));
    if (!Array.isArray(payload.tiles)) throw new Error('invalid');
  } catch {
    return false; // malformed — fall back to fresh session
  }

  state.readOnly = true;
  state.pile = [];
  state.canvas = payload.tiles.map(t => ({
    id: 'tile-' + (++tileIdCounter),
    word: t.word,
    x: t.x,
    y: t.y,
    rotation: t.rotation ?? randomRotation(),
  }));

  renderPile();
  renderCanvas();
  $canvas.classList.add('readonly');

  if (payload.author) {
    const el = document.createElement('div');
    el.className = 'attribution';
    el.textContent = `Made by ${payload.author} · Wordlay`;
    $canvas.appendChild(el);
  }

  document.getElementById('readonly-banner').classList.remove('hidden');
  return true;
}

document.getElementById('btn-make-own').addEventListener('click', newSession);

// ─── Sharing: Download PNG ────────────────────────────────────────────────────

function downloadPNG() {
  html2canvas($canvas, {
    useCORS: true,
    scale: 2,
    backgroundColor: '#f9f9f9',
  }).then(canvasEl => {
    const link = document.createElement('a');
    link.download = 'wordlay.png';
    link.href = canvasEl.toDataURL('image/png');
    link.click();
    link.remove();
  }).catch(err => {
    console.error('PNG export failed:', err);
    alert('Export failed — please try again.');
  });
}

document.getElementById('btn-download').addEventListener('click', downloadPNG);

function boot() {
  const hash = window.location.hash.slice(1);
  if (hash) {
    const loaded = loadSharedPoem(hash);
    if (loaded) return;
  }
  startFreshSession();
}

document.addEventListener('DOMContentLoaded', boot);
