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
