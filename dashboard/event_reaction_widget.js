/* event_reaction_widget.js
   ─────────────────────────────────────────────────────────────────────────
   Replaces event_reaction_popup.js. Injects its own styles and markup into
   the page (same self-contained pattern the old popup script used), and
   exposes two entry points for index.html to call:

     openReactionPopup({ cardId, onLogged, onDismiss })
       Opens Frame 1 (verb/phrase/object picker). Used right after qrScan
       reports an event fired.

     showLifetimeChoices({ cardId })
       Opens straight to the Lifetime Choices page. Used by the new
       "Your Reactions to Life Events" dashboard button.

   All scoring math and the ±125 number draw happen server-side
   (previewReaction / logReaction Cloud Functions) — this file only
   displays what the server returns.
   ───────────────────────────────────────────────────────────────────────── */
(function () {

const PREVIEW_URL = 'https://us-central1-pfp-system.cloudfunctions.net/previewReaction';
const LOG_URL      = 'https://us-central1-pfp-system.cloudfunctions.net/logReaction';

// Same master lists as the backend — used here only to render six random
// choices per column. The server independently validates whatever gets
// submitted, so there's no trust placed in this copy.
const VERBS = ["Resist","Embrace","Chase","Abandon","Protect","Destroy","Build","Break","Seek","Escape",
"Confront","Ignore","Trust","Question","Forgive","Betray","Nurture","Neglect","Defend","Attack",
"Create","Erase","Remember","Forget","Accept","Reject","Give","Take","Share","Hide",
"Reveal","Conceal","Support","Undermine","Inspire","Discourage","Heal","Wound","Guide","Mislead",
"Strengthen","Weaken","Celebrate","Mourn","Welcome","Banish","Cherish","Dismiss","Uplift","Diminish"];

const PHRASES = ["The pull of","The weight of","A moment of","The shadow of","The memory of","The promise of",
"The fear of","The echo of","The chance of","The habit of","The comfort of","The burden of",
"The spirit of","The illusion of","The truth behind","The silence of","The noise of","The edge of",
"The heart of","The roots of","The story of","The path toward","The grip of","The warmth of",
"The chill of","The rhythm of","The pattern of","The mystery of","The doubt within","The hope for",
"The dream of","The nightmare of","The taste of","The sound of","The sight of","The touch of",
"The scent of","The voice of","The face of","The mask of","The wall of","The bridge to",
"The door to","The key to","The end of","The start of","The middle of","The core of",
"The surface of","The depths of","The height of","The reach of","The limit of","The edge between",
"The balance of","The weight behind","The current of","The tide of","The storm of","The calm after",
"The spark of","The flame of","The ashes of","The remains of","The ruins of","The seeds of",
"The bloom of","The fade of","The rise of","The fall of","The climb toward","The descent into",
"The distance from","The closeness of","The absence of","The presence of","The weight of losing","The joy of finding",
"The cost of","The value of","The price of","The reward of","The risk of","The chance of losing",
"The odds of","The threat of","The gift of","The curse of","The blessing of","The trap of",
"The maze of","The web of","The chain of","The thread of","The knot of","The tangle of",
"The weight of the past","The shape of","The color of","The sound of silence"];

const OBJECTS = ["Evil","Longing","Fear","Hope","Change","Love","Loss","Time","Growth","Doubt",
"Freedom","Chaos","Order","Silence","Memory","Regret","Courage","Grief","Joy","Peace",
"War","Loyalty","Betrayal","Family","Failure","Success","Ambition","Guilt","Shame","Pride",
"Justice","Mercy","Revenge","Forgiveness","Destiny","Fate","Chance","Faith","Devotion","Sacrifice",
"Power","Weakness","Strength","Wisdom","Ignorance","Youth","Age","Life","Death","Beginnings",
"Endings","Home","Exile","Belonging","Isolation","Friendship","Enemies","Secrets","Lies","Honesty",
"Disorder","Balance","Instinct","Reason","Passion","Logic","Desire","Restraint","Temptation","Discipline",
"Rebellion","Conformity","Identity","Purpose","Meaning","Emptiness","Fulfillment","Struggle","Triumph","Defeat",
"Victory","Surrender","Duty","Honor","Dishonor","Legacy","History","The unknown","The future","The past",
"Consequence","Opportunity","Danger","Safety","Comfort","Discomfort","Evolution","Ruin","Kindness","Cruelty"];

const DRAW_COUNT = 6;

/* ── Inject fonts + styles ─────────────────────────────────────────────── */
function injectFonts() {
  if (document.getElementById('erw-fonts')) return;
  const link = document.createElement('link');
  link.id = 'erw-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap';
  document.head.appendChild(link);
}

function injectStyles() {
  if (document.getElementById('erw-styles')) return;
  const style = document.createElement('style');
  style.id = 'erw-styles';
  style.textContent = `
#erw-overlay {
  display: none; position: fixed; inset: 0; z-index: 9000;
  background: rgba(10, 11, 20, 0.78); backdrop-filter: blur(6px);
  align-items: center; justify-content: center; padding: 20px;
  font-family: 'Space Grotesk', sans-serif;
}
#erw-overlay.active { display: flex; }
#erw-box {
  --ink: #171a2b; --ink-soft: #2a2f4a; --parchment: #eee7d8;
  --gold: #c9a34e; --gold-bright: #e4c273; --pos: #4f8f6b; --neg: #b3564a;
  --line: rgba(238, 231, 216, 0.14);
  width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto;
  background: var(--ink); color: var(--parchment);
  border: 1px solid var(--gold); border-radius: 14px;
  padding: 26px 26px 24px; position: relative;
  box-shadow: 0 24px 80px rgba(0,0,0,0.6);
}
#erw-box .erw-close {
  position: absolute; top: 14px; right: 16px; background: none; border: none;
  color: rgba(238,231,216,0.5); font-size: 20px; cursor: pointer; line-height: 1;
  padding: 4px; border-radius: 6px;
}
#erw-box .erw-close:hover { color: var(--gold-bright); }
#erw-box button {
  font-family: 'Space Grotesk', sans-serif; font-size: 13.5px; font-weight: 600;
  padding: 10px 22px; border-radius: 999px; border: 1px solid var(--gold);
  cursor: pointer; transition: transform .1s ease, background .15s ease;
  background: transparent; color: var(--parchment);
}
#erw-box button:active { transform: scale(0.97); }
#erw-box button:disabled { opacity: .35; cursor: not-allowed; }
.erw-primary { background: var(--gold) !important; color: var(--ink) !important; }
.erw-primary:hover { background: var(--gold-bright) !important; }
.erw-ghost { border-color: var(--line) !important; }
.erw-ghost:hover { border-color: var(--gold) !important; }

.erw-page { display: none; }
.erw-page.active { display: block; }

.erw-row-section { background: var(--ink-soft); border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px; margin-bottom: 10px; }
.erw-row-label { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--gold-bright); margin-bottom:8px; }
.erw-row-grid { display:grid; gap:6px; }
.erw-verb-grid, .erw-object-grid { grid-template-columns: repeat(3, 1fr); }
.erw-phrase-grid { grid-template-columns: repeat(2, 1fr); }
.erw-option { display:block; position:relative; }
.erw-option input { position:absolute; opacity:0; inset:0; cursor:pointer; margin:0; }
.erw-option .erw-card { border:1px solid var(--line); border-radius:7px; padding:7px 8px; font-size:12.5px; line-height:1.25; text-align:center; cursor:pointer; transition: border-color .15s ease, background .15s ease; }
.erw-option input:checked + .erw-card { border-color: var(--gold); background: rgba(201,163,78,0.14); }
.erw-option:hover .erw-card { border-color: rgba(201,163,78,0.5); }

.erw-actions { display:flex; justify-content:center; gap:12px; margin: 18px 0 4px; }

.erw-sentence-row { display:flex; align-items:flex-start; justify-content:center; gap:14px; flex-wrap:wrap; margin: 6px 0 20px; }
.erw-sentence-part { text-align:center; min-width:84px; }
.erw-sentence-part .erw-word { font-family:'Fraunces',serif; font-weight:700; font-size:18px; margin-bottom:8px; }
.erw-num { font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:700; }
.erw-num.positive { color: var(--pos); } .erw-num.negative { color: var(--neg); }
.erw-dash { font-family:'Fraunces',serif; font-size:18px; color: rgba(238,231,216,.35); padding-top:2px; }

.erw-percent-row { text-align:center; font-size:14.5px; padding:14px 0; border-top:1px solid var(--line); margin-bottom:4px; }
.erw-percent-row .erw-neg { color: var(--neg); font-weight:600; }
.erw-percent-row .erw-pos { color: var(--pos); font-weight:600; }

.erw-total-row { text-align:center; padding-top:16px; border-top:1px solid var(--line); }
.erw-total-label { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color: rgba(238,231,216,.5); margin-bottom:6px; }
.erw-total-num { font-family:'JetBrains Mono',monospace; font-size:32px; font-weight:700; }
.erw-total-num.positive { color: var(--pos); } .erw-total-num.negative { color: var(--neg); }

.erw-reading-row { font-size:14.5px; line-height:1.65; color: rgba(238,231,216,.85); padding:16px 2px 0; margin-top:16px; border-top:1px solid var(--line); }

.erw-stats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:16px; padding-top:16px; border-top:1px solid var(--line); }
.erw-stat-card { text-align:center; padding:12px 8px; border:1px solid var(--line); border-radius:9px; }
.erw-stat-label { font-family:'JetBrains Mono',monospace; font-size:9.5px; letter-spacing:.1em; text-transform:uppercase; color: rgba(238,231,216,.5); margin-bottom:6px; }
.erw-stat-value { font-size:14px; font-weight:600; line-height:1.3; }
.erw-hl-pos { color: var(--pos); } .erw-hl-neg { color: var(--neg); }

.erw-log-row { text-align:center; margin-top:18px; padding-top:16px; border-top:1px solid var(--line); }

.erw-status { text-align:center; font-family:'JetBrains Mono',monospace; font-size:12px; color: rgba(238,231,216,.5); min-height:16px; margin: 4px 0 2px; }

.erw-life-summary { margin: 4px 0 18px; padding:14px 16px; border:1px solid var(--line); border-radius:12px; background: var(--ink-soft); font-size:14px; line-height:1.6; color: rgba(238,231,216,.85); }

.erw-history-entry { border:1px solid var(--line); border-radius:12px; padding:14px 16px; margin-bottom:10px; background: var(--ink-soft); }
.erw-history-entry .erw-h-date { font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color: var(--gold-bright); margin-bottom:6px; }
.erw-history-entry .erw-h-event { font-family:'Fraunces',serif; font-weight:700; font-size:16px; margin-bottom:2px; }
.erw-history-entry .erw-h-sentence { font-family:'Fraunces',serif; font-weight:700; font-size:16px; margin-bottom:6px; }
.erw-history-entry .erw-h-total-row { display:flex; align-items:center; justify-content:flex-end; gap:8px; }
.erw-history-entry .erw-h-total { font-family:'JetBrains Mono',monospace; font-weight:700; font-size:14px; }
.erw-h-icon { cursor:pointer; border:1px solid var(--gold); border-radius:50%; width:22px; height:22px; display:inline-flex; align-items:center; justify-content:center; font-size:11px; color: var(--gold-bright); background: transparent; }
.erw-h-icon:hover { background: rgba(201,163,78,.15); }

.erw-empty { text-align:center; color: rgba(238,231,216,.5); padding:24px 0; font-size:13.5px; }

h2.erw-title { font-family:'Fraunces',serif; font-size:20px; margin: 0 0 4px; color: var(--gold-bright); }
p.erw-subtitle { font-size:13px; color: rgba(238,231,216,.6); margin: 0 0 18px; }

@media (max-width: 520px) {
  .erw-verb-grid, .erw-object-grid { grid-template-columns: repeat(2, 1fr); }
  .erw-stats-grid { grid-template-columns: repeat(2, 1fr); }
}
`;
  document.head.appendChild(style);
}

/* ── Inject markup ────────────────────────────────────────────────────── */
function injectMarkup() {
  if (document.getElementById('erw-overlay')) return;
  const div = document.createElement('div');
  div.id = 'erw-overlay';
  div.innerHTML = `
    <div id="erw-box" role="dialog" aria-modal="true">
      <button class="erw-close" id="erw-close-btn" aria-label="Close">&times;</button>

      <div class="erw-page active" id="erw-page-frame1">
        <h2 class="erw-title" id="erw-frame1-title"></h2>
        <div class="erw-row-section">
          <div class="erw-row-label">Verb</div>
          <div class="erw-row-grid erw-verb-grid" id="erw-verb-options"></div>
        </div>
        <div class="erw-row-section">
          <div class="erw-row-label">Phrase</div>
          <div class="erw-row-grid erw-phrase-grid" id="erw-phrase-options"></div>
        </div>
        <div class="erw-row-section">
          <div class="erw-row-label">Object</div>
          <div class="erw-row-grid erw-object-grid" id="erw-object-options"></div>
        </div>
        <div class="erw-actions">
          <button class="erw-primary" id="erw-confirm-btn" disabled>Lock in selection</button>
        </div>
        <div class="erw-status" id="erw-frame1-status"></div>
      </div>

      <div class="erw-page" id="erw-page-frame2">
        <div class="erw-sentence-row" id="erw-sentence-row"></div>
        <div class="erw-percent-row" id="erw-percent-out"></div>
        <div class="erw-total-row">
          <div class="erw-total-label">Total</div>
          <div class="erw-total-num" id="erw-total-out"></div>
        </div>
        <div class="erw-reading-row" id="erw-reading-out"></div>
        <div class="erw-stats-grid" id="erw-stats-grid"></div>
        <div class="erw-log-row" id="erw-log-row">
          <button class="erw-primary" id="erw-log-btn">Log This Reaction</button>
        </div>
        <div class="erw-status" id="erw-frame2-status"></div>
      </div>

      <div class="erw-page" id="erw-page-lifetime">
        <h2 class="erw-title">Lifetime Choices</h2>
        <p class="erw-subtitle">Every reaction you've logged, kept over time.</p>
        <div class="erw-life-summary" id="erw-life-summary"></div>
        <div id="erw-history-list"></div>
        <div class="erw-actions">
          <button class="erw-ghost" id="erw-back-btn">Back to Dashboard</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(div);

  document.getElementById('erw-close-btn').addEventListener('click', closeOverlay);
  document.getElementById('erw-back-btn').addEventListener('click', closeOverlay);
}

/* ── State ─────────────────────────────────────────────────────────────── */
let _state = {
  cardId: null,
  eventName: null,
  onLogged: null,
  onDismiss: null,
  selected: { verb: null, phrase: null, object: null },
  pendingResult: null,   // result returned by previewReaction, awaiting log
};

function sample(arr, n) {
  const copy = arr.slice();
  const picked = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    picked.push(copy.splice(idx, 1)[0]);
  }
  return picked;
}

function formatNum(n) { return (n > 0 ? '+' : '') + n; }

function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── Overlay open/close ───────────────────────────────────────────────── */
function openOverlay(pageId) {
  document.getElementById('erw-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  showPage(pageId);
}

function closeOverlay() {
  document.getElementById('erw-overlay').classList.remove('active');
  document.body.style.overflow = '';
  if (_state.onDismiss) _state.onDismiss();
}

function showPage(pageId) {
  ['erw-page-frame1', 'erw-page-frame2', 'erw-page-lifetime'].forEach(id => {
    document.getElementById(id).classList.toggle('active', id === pageId);
  });
}

/* ── Frame 1: picker ──────────────────────────────────────────────────── */
function renderOptions(containerId, groupName, words) {
  const container = document.getElementById(containerId);
  container.innerHTML = words.map((word, i) => `
    <label class="erw-option">
      <input type="radio" name="erw-${groupName}" value="${esc(word)}">
      <div class="erw-card">${esc(word)}</div>
    </label>
  `).join('');
  container.querySelectorAll('input[type="radio"]').forEach(input => {
    input.addEventListener('change', e => {
      _state.selected[groupName] = e.target.value;
      updateConfirmButton();
    });
  });
}

function updateConfirmButton() {
  const { verb, phrase, object } = _state.selected;
  document.getElementById('erw-confirm-btn').disabled = !(verb && phrase && object);
}

function startFrame1() {
  _state.selected = { verb: null, phrase: null, object: null };
  _state.pendingResult = null;
  const titleEl = document.getElementById('erw-frame1-title');
  titleEl.textContent = _state.eventName
    ? `The ${_state.eventName} event just fired! How do you react?`
    : 'An event just fired! How do you react?';
  renderOptions('erw-verb-options', 'verb', sample(VERBS, DRAW_COUNT));
  renderOptions('erw-phrase-options', 'phrase', sample(PHRASES, DRAW_COUNT));
  renderOptions('erw-object-options', 'object', sample(OBJECTS, DRAW_COUNT));
  document.getElementById('erw-confirm-btn').disabled = true;
  document.getElementById('erw-frame1-status').textContent = '';
}

async function lockInSelection() {
  const { verb, phrase, object } = _state.selected;
  if (!verb || !phrase || !object) return;

  const btn = document.getElementById('erw-confirm-btn');
  btn.disabled = true;
  document.getElementById('erw-frame1-status').textContent = 'Locking in…';

  try {
    const res = await fetch(PREVIEW_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: _state.cardId, verb, phrase, object, eventName: _state.eventName }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Could not lock in selection.');

    _state.pendingResult = data.result;
    renderFrame2(data.result, { readOnly: false });
    showPage('erw-page-frame2');
  } catch (err) {
    document.getElementById('erw-frame1-status').textContent = err.message || 'Something went wrong — try again.';
    btn.disabled = false;
  }
}

/* ── Frame 2: result ──────────────────────────────────────────────────── */
function renderFrame2(r, { readOnly }) {
  document.getElementById('erw-sentence-row').innerHTML = `
    <div class="erw-sentence-part">
      <div class="erw-word">${esc(r.verb.word)}</div>
      <div class="erw-num ${r.verb.number >= 0 ? 'positive' : 'negative'}">${formatNum(r.verb.number)}</div>
    </div>
    <div class="erw-dash">&mdash;</div>
    <div class="erw-sentence-part">
      <div class="erw-word">${esc(r.phrase.word)}</div>
      <div class="erw-num ${r.phrase.number >= 0 ? 'positive' : 'negative'}">${formatNum(r.phrase.number)}</div>
    </div>
    <div class="erw-dash">&mdash;</div>
    <div class="erw-sentence-part">
      <div class="erw-word">${esc(r.object.word)}</div>
      <div class="erw-num ${r.object.number >= 0 ? 'positive' : 'negative'}">${formatNum(r.object.number)}</div>
    </div>
  `;

  document.getElementById('erw-percent-out').innerHTML =
    `This selection is <span class="erw-neg">${r.negativePercent}% negative</span> and <span class="erw-pos">${r.positivePercent}% positive</span>.`;

  const totalEl = document.getElementById('erw-total-out');
  totalEl.textContent = formatNum(r.total);
  totalEl.className = 'erw-total-num ' + (r.total >= 0 ? 'positive' : 'negative');

  document.getElementById('erw-reading-out').innerHTML = r.reading;

  const dominantHtml = `${esc(r.dominant.word)} <span class="${r.dominant.number >= 0 ? 'erw-hl-pos' : 'erw-hl-neg'}">(${esc(r.dominant.label)})</span>`;

  document.getElementById('erw-stats-grid').innerHTML = [
    ['Intensity', esc(r.intensity.label)],
    ['Dominant Part', dominantHtml],
    ['Agreement', esc(r.agreement.text)],
    ['Spread', String(r.spread)],
    ['Driven By', esc(r.drivenBy)],
    ['Consensus', `${r.consensus.percent}% (${esc(r.consensus.label)})`],
  ].map(([label, value]) => `
    <div class="erw-stat-card">
      <div class="erw-stat-label">${label}</div>
      <div class="erw-stat-value">${value}</div>
    </div>
  `).join('');

  const logRow = document.getElementById('erw-log-row');
  document.getElementById('erw-frame2-status').textContent = '';
  if (readOnly) {
    logRow.innerHTML = `<button class="erw-ghost" id="erw-back-to-lifetime-btn">Back to Lifetime Choices</button>`;
    document.getElementById('erw-back-to-lifetime-btn').addEventListener('click', () => {
      openLifetimeChoices(_state.cardId, { keepOpen: true });
    });
  } else {
    logRow.innerHTML = `<button class="erw-primary" id="erw-log-btn">Log This Reaction</button>`;
    document.getElementById('erw-log-btn').addEventListener('click', logReaction);
  }
}

async function logReaction() {
  const btn = document.getElementById('erw-log-btn');
  btn.disabled = true;
  document.getElementById('erw-frame2-status').textContent = 'Saving…';

  try {
    const res = await fetch(LOG_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: _state.cardId }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Could not save this reaction.');

    if (_state.onLogged) _state.onLogged(_state.pendingResult);
    _state.pendingResult = null;

    await openLifetimeChoices(_state.cardId, { keepOpen: true });
  } catch (err) {
    document.getElementById('erw-frame2-status').textContent = err.message || 'Something went wrong — try again.';
    btn.disabled = false;
  }
}

/* ── Lifetime Choices ─────────────────────────────────────────────────── */
function toClause(sentence) {
  let s = sentence.trim();
  if (s.endsWith('.')) s = s.slice(0, -1);
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function renderLifeSummary(entries) {
  const container = document.getElementById('erw-life-summary');
  const count = entries.length;

  if (count === 0) {
    container.innerHTML = `<p>You haven't lived through any events yet. Log a reaction to start building your story.</p>`;
    return;
  }

  const sumTotal = entries.reduce((sum, e) => sum + e.total, 0);
  const overall = sumTotal > 0 ? 'positive' : sumTotal < 0 ? 'negative' : 'balanced';
  const eventWord = count === 1 ? 'event' : 'events';
  let text = `You have lived through ${count} ${eventWord}, and it's been a ${overall} life so far.`;

  let highest = entries[0], lowest = entries[0];
  entries.forEach(e => {
    if (e.total > highest.total) highest = e;
    if (e.total < lowest.total) lowest = e;
  });

  if (count === 1) {
    text += ` The defining moment came on ${highest.dateStr}: ${toClause(highest.sentence)} — that choice shaped everything so far, landing at ${formatNum(highest.total)}.`;
  } else {
    text += ` The high point came on ${highest.dateStr}: ${toClause(highest.sentence)} — that choice helped, landing at ${formatNum(highest.total)}.`;
    text += ` The low point came on ${lowest.dateStr}: ${toClause(lowest.sentence)} — that choice hurt, landing at ${formatNum(lowest.total)}.`;
  }

  container.innerHTML = `<p>${text}</p>`;
}

function renderHistoryList(entries) {
  const container = document.getElementById('erw-history-list');
  if (entries.length === 0) {
    container.innerHTML = `<div class="erw-empty">No reactions logged yet.</div>`;
    return;
  }
  container.innerHTML = entries.map((e, i) => `
    <div class="erw-history-entry">
      <div class="erw-h-date">${esc(e.dateStr)}</div>
      ${e.eventName ? `<div class="erw-h-event">${esc(e.eventName)}</div>` : ''}
      ${e.sentence ? `<div class="erw-h-sentence">You decided to ${esc(toClause(e.sentence))}.</div>` : ''}
      <div class="erw-h-total-row">
        <span class="erw-h-total ${e.total >= 0 ? 'erw-hl-pos' : 'erw-hl-neg'}">${formatNum(e.total)}</span>
        <button class="erw-h-icon" data-idx="${i}" title="View full breakdown">&#9432;</button>
      </div>
    </div>
  `).join('');
  container.querySelectorAll('.erw-h-icon').forEach(btn => {
    btn.addEventListener('click', () => {
      const entry = entries[parseInt(btn.dataset.idx, 10)];
      renderFrame2(entry, { readOnly: true });
      showPage('erw-page-frame2');
    });
  });
}

// Reads this card's logged REACTION entries straight from Firestore
// (cards/{cardId}/ledger, filtered to type == 'REACTION'), same way the
// dashboard already reads its recent-activity ledger entries.
async function fetchReactionHistory(cardId) {
  const db = window._pfpFirestore;
  const q = window._pfpFirestoreQuery(
    window._pfpFirestoreCollection(db, 'cards', cardId, 'ledger'),
    window._pfpFirestoreWhere('type', '==', 'REACTION'),
    window._pfpFirestoreOrderBy('date', 'desc')
  );
  const snap = await window._pfpFirestoreGetDocs(q);
  const entries = [];
  snap.forEach(doc => {
    const d = doc.data();
    entries.push({
      eventName: d.eventName || null,
      verb: d.verb, phrase: d.phrase, object: d.object,
      total: d.total, intensity: d.intensity, dominant: d.dominant,
      agreement: d.agreement, spread: d.spread, drivenBy: d.drivenBy,
      consensus: d.consensus, sentence: d.sentence, reading: d.readingLine,
      percentLine: d.percentLine,
      positivePercent: undefined,
      negativePercent: undefined,
      dateStr: d.date && d.date.toDate ? d.date.toDate().toLocaleDateString() : '',
    });
  });
  // Frame 2 replay needs positive/negative percent split too — recover it
  // from the stored percent line rather than storing it twice in the ledger.
  entries.forEach(e => {
    const m = e.percentLine && e.percentLine.match(/(\d+)% negative.*?(\d+)% positive/);
    if (m) { e.negativePercent = parseInt(m[1], 10); e.positivePercent = parseInt(m[2], 10); }
  });
  return entries;
}

async function openLifetimeChoices(cardId, opts) {
  opts = opts || {};
  if (!opts.keepOpen) openOverlay('erw-page-lifetime');
  else showPage('erw-page-lifetime');

  document.getElementById('erw-life-summary').innerHTML = '<p>Loading…</p>';
  document.getElementById('erw-history-list').innerHTML = '';

  try {
    const entries = await fetchReactionHistory(cardId);
    renderLifeSummary(entries);
    renderHistoryList(entries);
  } catch (err) {
    console.error('Lifetime Choices load failed:', err);
    document.getElementById('erw-life-summary').innerHTML = '<p>Could not load reaction history — try again shortly.</p>';
  }
}

/* ── Public API ────────────────────────────────────────────────────────── */
function init() {
  injectFonts();
  injectStyles();
  injectMarkup();
  document.getElementById('erw-confirm-btn').addEventListener('click', lockInSelection);
}

window.openReactionPopup = function ({ cardId, eventName, onLogged, onDismiss }) {
  init();
  _state.cardId = cardId;
  _state.eventName = eventName || null;
  _state.onLogged = onLogged || null;
  _state.onDismiss = onDismiss || null;
  startFrame1();
  openOverlay('erw-page-frame1');
};

window.showLifetimeChoices = function ({ cardId, onDismiss }) {
  init();
  _state.cardId = cardId;
  _state.onDismiss = onDismiss || null;
  openLifetimeChoices(cardId, {});
};

})();
