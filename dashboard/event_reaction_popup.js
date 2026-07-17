'use strict';

// Generic (not category-flavoured) tiered pool — Option A, confirmed this session.
// All 18 archetypes (6 trios x virtuous/neutral/corrosive), 6 tiers each = 108 entries.
// Every category currently points at this same pool; category-specific flavour is a
// deferred later pass (see handoff doc).
const GENERIC_POOL = [
    { label: 'shrug off a slight', archetype: 'Resist', tier: 1 },
    { label: 'hold a small line', archetype: 'Resist', tier: 2 },
    { label: 'refuse under real pressure', archetype: 'Resist', tier: 3 },
    { label: 'stand firm at real cost', archetype: 'Resist', tier: 4 },
    { label: 'refuse despite serious loss', archetype: 'Resist', tier: 5 },
    { label: 'refuse at the cost of everything', archetype: 'Resist', tier: 6 },
    { label: 'hesitate for a moment', archetype: 'Waver', tier: 1 },
    { label: 'freeze under mild pressure', archetype: 'Waver', tier: 2 },
    { label: 'can\'t commit either way', archetype: 'Waver', tier: 3 },
    { label: 'stall at a real crossroads', archetype: 'Waver', tier: 4 },
    { label: 'freeze when it counts most', archetype: 'Waver', tier: 5 },
    { label: 'paralyzed at the decisive moment', archetype: 'Waver', tier: 6 },
    { label: 'brush off a fact', archetype: 'Deny', tier: 1 },
    { label: 'ignore a warning sign', archetype: 'Deny', tier: 2 },
    { label: 'refuse a plain truth', archetype: 'Deny', tier: 3 },
    { label: 'deny what\'s visibly true', archetype: 'Deny', tier: 4 },
    { label: 'deny reality others depend on', archetype: 'Deny', tier: 5 },
    { label: 'deny it while it destroys someone', archetype: 'Deny', tier: 6 },
    { label: 'let a small thing go', archetype: 'Yield', tier: 1 },
    { label: 'accept a minor setback', archetype: 'Yield', tier: 2 },
    { label: 'accept real loss gracefully', archetype: 'Yield', tier: 3 },
    { label: 'yield something that mattered', archetype: 'Yield', tier: 4 },
    { label: 'accept devastating loss with grace', archetype: 'Yield', tier: 5 },
    { label: 'surrender everything with dignity', archetype: 'Yield', tier: 6 },
    { label: 'let a small thing slide by', archetype: 'Drift', tier: 1 },
    { label: 'let a minor matter drift', archetype: 'Drift', tier: 2 },
    { label: 'let something real go unresolved', archetype: 'Drift', tier: 3 },
    { label: 'let something that mattered slip', archetype: 'Drift', tier: 4 },
    { label: 'let something significant erode', archetype: 'Drift', tier: 5 },
    { label: 'let something vital slip away entirely', archetype: 'Drift', tier: 6 },
    { label: 'feel briefly discouraged', archetype: 'Despair', tier: 1 },
    { label: 'lose heart for a while', archetype: 'Despair', tier: 2 },
    { label: 'give up on something real', archetype: 'Despair', tier: 3 },
    { label: 'collapse under real weight', archetype: 'Despair', tier: 4 },
    { label: 'drag others into the collapse', archetype: 'Despair', tier: 5 },
    { label: 'total hopelessness, others harmed', archetype: 'Despair', tier: 6 },
    { label: 'notice a small pattern', archetype: 'Reflect', tier: 1 },
    { label: 'pause and reconsider', archetype: 'Reflect', tier: 2 },
    { label: 'genuinely reckon with a mistake', archetype: 'Reflect', tier: 3 },
    { label: 'reassess something core', archetype: 'Reflect', tier: 4 },
    { label: 'rebuild understanding of self', archetype: 'Reflect', tier: 5 },
    { label: 'life-altering reckoning', archetype: 'Reflect', tier: 6 },
    { label: 'turn the thought over, once', archetype: 'Muse', tier: 1 },
    { label: 'circle the thought, no landing', archetype: 'Muse', tier: 2 },
    { label: 'sit with a real question, unresolved', archetype: 'Muse', tier: 3 },
    { label: 'turn over a costly question, no answer', archetype: 'Muse', tier: 4 },
    { label: 'dwell without resolving, high stakes', archetype: 'Muse', tier: 5 },
    { label: 'endless deliberation, nothing resolved', archetype: 'Muse', tier: 6 },
    { label: 'make a small excuse', archetype: 'Rationalize', tier: 1 },
    { label: 'bend a fact to feel better', archetype: 'Rationalize', tier: 2 },
    { label: 'justify a real wrong', archetype: 'Rationalize', tier: 3 },
    { label: 'build a story to avoid guilt', archetype: 'Rationalize', tier: 4 },
    { label: 'elaborate self-justification', archetype: 'Rationalize', tier: 5 },
    { label: 'justify serious harm to someone else', archetype: 'Rationalize', tier: 6 },
    { label: 'take a small step', archetype: 'Act', tier: 1 },
    { label: 'act instead of waiting', archetype: 'Act', tier: 2 },
    { label: 'act under real pressure', archetype: 'Act', tier: 3 },
    { label: 'act at real personal risk', archetype: 'Act', tier: 4 },
    { label: 'decisive action, high stakes', archetype: 'Act', tier: 5 },
    { label: 'act at great cost, changes everything', archetype: 'Act', tier: 6 },
    { label: 'glance, then look away', archetype: 'Observe', tier: 1 },
    { label: 'watch a small opening pass', archetype: 'Observe', tier: 2 },
    { label: 'watch a real opportunity pass', archetype: 'Observe', tier: 3 },
    { label: 'watch a costly moment pass', archetype: 'Observe', tier: 4 },
    { label: 'watch a major chance pass', archetype: 'Observe', tier: 5 },
    { label: 'watch the defining moment pass', archetype: 'Observe', tier: 6 },
    { label: 'take a small unearned edge', archetype: 'Exploit', tier: 1 },
    { label: 'use a minor opening', archetype: 'Exploit', tier: 2 },
    { label: 'use someone\'s small misfortune', archetype: 'Exploit', tier: 3 },
    { label: 'profit off real misfortune', archetype: 'Exploit', tier: 4 },
    { label: 'exploit serious hardship', archetype: 'Exploit', tier: 5 },
    { label: 'exploit someone\'s ruin for major gain', archetype: 'Exploit', tier: 6 },
    { label: 'reframe something small', archetype: 'Transform', tier: 1 },
    { label: 'turn a setback into a lesson', archetype: 'Transform', tier: 2 },
    { label: 'convert real pain into growth', archetype: 'Transform', tier: 3 },
    { label: 'rebuild after real damage', archetype: 'Transform', tier: 4 },
    { label: 'forge real strength from crisis', archetype: 'Transform', tier: 5 },
    { label: 'turn devastation into lasting change', archetype: 'Transform', tier: 6 },
    { label: 'leave a small thing untouched', archetype: 'Stall', tier: 1 },
    { label: 'put off a small decision', archetype: 'Stall', tier: 2 },
    { label: 'leave a real decision hanging', archetype: 'Stall', tier: 3 },
    { label: 'delay a decision that has weight', archetype: 'Stall', tier: 4 },
    { label: 'leave a major decision open', archetype: 'Stall', tier: 5 },
    { label: 'leave the biggest decision untouched', archetype: 'Stall', tier: 6 },
    { label: 'a small self-serving lapse', archetype: 'Betray', tier: 1 },
    { label: 'put self first, minor cost to other', archetype: 'Betray', tier: 2 },
    { label: 'let someone else take a small hit', archetype: 'Betray', tier: 3 },
    { label: 'shift real cost onto someone else', archetype: 'Betray', tier: 4 },
    { label: 'betray someone\'s trust for gain', archetype: 'Betray', tier: 5 },
    { label: 'betray someone completely, lasting harm', archetype: 'Betray', tier: 6 },
    { label: 'admit a small fault', archetype: 'Own', tier: 1 },
    { label: 'acknowledge a real mistake', archetype: 'Own', tier: 2 },
    { label: 'take responsibility publicly', archetype: 'Own', tier: 3 },
    { label: 'own a costly mistake', archetype: 'Own', tier: 4 },
    { label: 'accept full consequence of real harm', archetype: 'Own', tier: 5 },
    { label: 'full accountability for major damage', archetype: 'Own', tier: 6 },
    { label: 'let a minor question go unanswered', archetype: 'Evade', tier: 1 },
    { label: 'let a small doubt go unaddressed', archetype: 'Evade', tier: 2 },
    { label: 'let real uncertainty stand', archetype: 'Evade', tier: 3 },
    { label: 'let a costly ambiguity stand', archetype: 'Evade', tier: 4 },
    { label: 'let serious uncertainty go unresolved', archetype: 'Evade', tier: 5 },
    { label: 'let the most consequential question go unanswered', archetype: 'Evade', tier: 6 },
    { label: 'shift small blame', archetype: 'Deflect', tier: 1 },
    { label: 'blame circumstance', archetype: 'Deflect', tier: 2 },
    { label: 'blame someone else, minor unfairness', archetype: 'Deflect', tier: 3 },
    { label: 'let someone else take real blame', archetype: 'Deflect', tier: 4 },
    { label: 'scapegoat someone for real harm', archetype: 'Deflect', tier: 5 },
    { label: 'fully blame another for major harm caused', archetype: 'Deflect', tier: 6 },
];

const REACTION_POOLS = {
  financial: GENERIC_POOL,
  social: GENERIC_POOL,
  health: GENERIC_POOL,
  mental: GENERIC_POOL,
  skill: GENERIC_POOL,
  creative: GENERIC_POOL,
  luck: GENERIC_POOL,
  physical: GENERIC_POOL,
  world: GENERIC_POOL,
  mystery: GENERIC_POOL,
};

const CATEGORY_ICONS = {
  financial: '💰', social: '🤝', health: '🩺', mental: '🧠',
  skill: '💡', creative: '🎨', luck: '🎲', physical: '💪',
  world: '🌍', mystery: '🌀',
};

let _state = {
  event:         null,
  card:          null,
  choices:       [],
  selectedIndex: null,
  narrative:     null,
  onAccept:      null,
  onDismiss:     null,
};

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

const VIRTUOUS_ARCHETYPES  = ["Resist", "Yield", "Reflect", "Act", "Transform", "Own"];
const NEUTRAL_ARCHETYPES   = ["Waver", "Drift", "Muse", "Observe", "Stall", "Evade"];
const CORROSIVE_ARCHETYPES = ["Deny", "Despair", "Rationalize", "Exploit", "Betray", "Deflect"];

// The 6 trios: [virtuous, neutral, corrosive]. e.g. Resist curdles into Deny,
// with Waver as the uncommitted middle ground.
const ARCHETYPE_TRIOS = [
  ["Resist", "Waver", "Deny"],
  ["Yield", "Drift", "Despair"],
  ["Reflect", "Muse", "Rationalize"],
  ["Act", "Observe", "Exploit"],
  ["Transform", "Stall", "Betray"],
  ["Own", "Evade", "Deflect"],
];

// Fisher-Yates shuffle. Returns a new array; does not mutate the input.
function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Picks one random entry from the pool matching the given archetype.
// Tier is not linked across a trio's three sides — each pick is independent
// (a tier-1 Resist can land next to a tier-5 Waver and a tier-3 Deny).
function pickOneEntryForArchetype(pool, archetype) {
  const matches = pool.filter(entry => entry.archetype === archetype);
  return matches[Math.floor(Math.random() * matches.length)];
}

// Draws 9 choices from a category pool: picks 3 of the 6 trios at random,
// then takes all three sides (virtuous, neutral, corrosive) of each of those
// trios. Every trio picked is fully represented; the other 3 trios don't
// appear at all this time. Rotating which 3 trios show up is what happens
// naturally across repeated calls/events, since the pick is random each time.
function pickStratifiedChoices(pool) {
  const chosenTrios = shuffle(ARCHETYPE_TRIOS).slice(0, 3);

  const chosenArchetypes = chosenTrios.flat(); // 3 trios x 3 sides = 9 archetypes

  const choices = chosenArchetypes.map(archetype => pickOneEntryForArchetype(pool, archetype));

  return shuffle(choices);
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

window.openReactionPopup = function({ event, card, onAccept, onDismiss }) {
  _state.event         = event;
  _state.card          = card;
  _state.selectedIndex = null;
  _state.narrative     = null;
  _state.onAccept      = onAccept  || null;
  _state.onDismiss     = onDismiss || null;

  const pool = REACTION_POOLS[event.category] || REACTION_POOLS.mystery;
  _state.choices = pickStratifiedChoices(pool);

  _ensureOverlay();
  _renderPopup();

  const overlay = document.getElementById('reaction-overlay');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

function _ensureOverlay() {
  if (document.getElementById('reaction-overlay')) return;

  const html = `
<style>
#reaction-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(10,4,20,0.82);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 9000;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: overlayIn 0.35s ease;
}
#reaction-overlay.active { display: flex; }
@keyframes overlayIn { from { opacity:0; } to { opacity:1; } }

#reaction-popup {
  width: 100%;
  max-width: 640px;
  max-height: 92vh;
  overflow-y: auto;
  border-radius: 3px;
  box-shadow: 0 24px 80px rgba(20,8,40,0.85), 0 0 0 1px rgba(201,168,76,0.3);
  animation: popupIn 0.4s cubic-bezier(0.22,1,0.36,1);
  scrollbar-width: thin;
  scrollbar-color: #8A6E2A transparent;
  font-family: 'EB Garamond', serif;
}
@keyframes popupIn {
  from { opacity:0; transform:translateY(28px) scale(0.97); }
  to   { opacity:1; transform:translateY(0)    scale(1);    }
}

.popup-header {
  background: #1A1025;
  padding: 1.5rem 1.75rem 1.25rem;
  border-bottom: 1px solid rgba(201,168,76,0.2);
  position: relative;
  overflow: hidden;
}
.popup-header::before {
  content:'';
  position:absolute; inset:0;
  background: radial-gradient(ellipse at 60% -10%, rgba(201,168,76,0.08) 0%, transparent 65%);
  pointer-events:none;
}
.popup-eyebrow {
  font-family:'Cinzel',serif;
  font-size:0.65rem; letter-spacing:0.18em; text-transform:uppercase;
  color:#C9A84C; opacity:0.8; margin-bottom:0.4rem;
}
.popup-event-name {
  font-family:'Cinzel Decorative',serif;
  font-size:1.35rem; font-weight:700; color:#F5EFD8;
  line-height:1.2; letter-spacing:0.02em; margin-bottom:0.6rem;
}
.popup-flavour {
  font-size:1rem; font-style:italic;
  color:rgba(245,239,216,0.65); line-height:1.55;
}
.popup-meta {
  display:flex; align-items:center; gap:0.6rem;
  margin-top:0.85rem; flex-wrap:wrap;
}
.meta-badge {
  font-family:'Cinzel',serif;
  font-size:0.6rem; letter-spacing:0.12em; text-transform:uppercase;
  padding:0.2rem 0.6rem; border-radius:2px; border:1px solid;
}
.meta-badge.category { border-color:rgba(201,168,76,0.4); color:#E8C97A; background:rgba(201,168,76,0.08); }
.meta-badge.polarity-positive { border-color:rgba(80,180,100,0.5); color:#7DCF95; background:rgba(80,180,100,0.08); }
.meta-badge.polarity-negative { border-color:rgba(180,70,70,0.5);  color:#D98080; background:rgba(180,70,70,0.08); }
.popup-ornament { text-align:center; font-size:0.8rem; color:#C9A84C; opacity:0.4; letter-spacing:0.5em; margin-top:0.9rem; }

.popup-body { background:#F5EFD8; padding:1.5rem 1.75rem; }
.popup-prompt {
  font-family:'Cinzel',serif; font-size:0.85rem; font-weight:600;
  color:#1A1025; text-align:center; letter-spacing:0.06em;
  margin-bottom:1.1rem; opacity:0.85;
}
.choice-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0.55rem; margin-bottom:1.25rem; }
.choice-btn {
  background:#fff; border:1.5px solid rgba(59,31,94,0.18); border-radius:2px;
  padding:0.6rem 0.5rem; cursor:pointer; transition:all 0.18s ease;
  text-align:center; position:relative; overflow:hidden;
}
.choice-btn:hover { border-color:#6B3FA0; background:rgba(59,31,94,0.04); transform:translateY(-1px); box-shadow:0 3px 10px rgba(59,31,94,0.12); }
.choice-btn.selected { border-color:#3B1F5E; background:rgba(59,31,94,0.07); box-shadow:0 0 0 2px rgba(59,31,94,0.2); }
.choice-btn.selected .choice-archetype { color:#3B1F5E; }
.choice-archetype { font-family:'Cinzel',serif; font-size:0.52rem; letter-spacing:0.15em; text-transform:uppercase; color:#7A6A8A; margin-bottom:0.3rem; transition:color 0.18s; }
.choice-label { font-family:'EB Garamond',serif; font-size:0.9rem; color:#3A2A5A; line-height:1.3; }

.confirm-row { text-align:center; margin-bottom:0.5rem; }
.confirm-btn {
  font-family:'Cinzel',serif; font-size:0.75rem; letter-spacing:0.12em; text-transform:uppercase;
  background:#3B1F5E; color:#F5EFD8; border:none; padding:0.7rem 2rem;
  cursor:pointer; border-radius:2px; transition:background 0.2s,opacity 0.2s;
  opacity:0.45; pointer-events:none;
}
.confirm-btn.active { opacity:1; pointer-events:auto; }
.confirm-btn.active:hover { background:#4E2A7A; }

.narrative-divider {
  display:flex; align-items:center; gap:0.75rem;
  margin:0.25rem 0 1.1rem; color:#8A6E2A;
}
.narrative-divider::before,.narrative-divider::after {
  content:''; flex:1; height:1px;
  background:linear-gradient(90deg,transparent,rgba(138,110,42,0.4),transparent);
}
.narrative-divider-icon { font-size:0.8rem; opacity:0.6; }
.narrative-label { font-family:'Cinzel',serif; font-size:0.62rem; letter-spacing:0.18em; text-transform:uppercase; color:#7A6A8A; margin-bottom:0.55rem; }
.narrative-text { font-family:'EB Garamond',serif; font-size:1.05rem; line-height:1.7; color:#3A2A5A; font-style:italic; }
.archetype-revealed {
  display:inline-block; font-family:'Cinzel',serif; font-size:0.6rem;
  letter-spacing:0.15em; text-transform:uppercase; color:#6B3FA0;
  border:1px solid rgba(107,63,160,0.3); background:rgba(59,31,94,0.05);
  padding:0.18rem 0.5rem; border-radius:2px; margin-top:0.65rem;
}
.narrative-actions { display:flex; gap:0.6rem; margin-top:1.1rem; justify-content:flex-end; }
.btn-accept {
  font-family:'Cinzel',serif; font-size:0.72rem; letter-spacing:0.1em; text-transform:uppercase;
  background:#3B1F5E; color:#F5EFD8; border:none; padding:0.6rem 1.4rem;
  border-radius:2px; cursor:pointer; transition:background 0.2s;
}
.btn-accept:hover { background:#4E2A7A; }

.popup-footer {
  background:#1A1025; padding:0.65rem 1.75rem;
  border-top:1px solid rgba(201,168,76,0.12);
  display:flex; align-items:center; justify-content:space-between;
}
.footer-card-name { font-family:'Cinzel',serif; font-size:0.65rem; letter-spacing:0.1em; color:#C9A84C; opacity:0.7; }
.footer-logo { font-family:'Cinzel Decorative',serif; font-size:0.6rem; letter-spacing:0.15em; color:#C9A84C; opacity:0.4; }

#narrative-panel { display:none; animation:fadeUp 0.5s ease; }
@keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
</style>

<div id="reaction-overlay">
  <div id="reaction-popup" role="dialog" aria-modal="true" aria-labelledby="popup-event-title">
    <div class="popup-header">
      <div class="popup-eyebrow">A Life Event Has Occurred</div>
      <div class="popup-event-name" id="popup-event-title">—</div>
      <div class="popup-flavour" id="popup-flavour">—</div>
      <div class="popup-meta">
        <span class="meta-badge category" id="meta-category">—</span>
        <span class="meta-badge" id="meta-polarity">—</span>
      </div>
      <div class="popup-ornament">◆ ◆ ◆</div>
    </div>
    <div class="popup-body" id="popup-body">
      <div class="popup-prompt">How do you respond?</div>
      <div class="choice-grid" id="choice-grid"></div>
      <div class="confirm-row">
        <button class="confirm-btn" id="confirm-btn" onclick="window._pfpConfirmChoice()">Confirm My Response</button>
      </div>
      <div id="narrative-panel">
        <div class="narrative-divider"><span class="narrative-divider-icon">✦</span></div>
        <div class="narrative-label">Your Card Reflects</div>
        <div class="narrative-text" id="narrative-text">—</div>
        <div><span class="archetype-revealed" id="archetype-badge">—</span></div>
        <div class="narrative-actions">
          <button class="btn-accept" onclick="window._pfpAcceptOutcome()">Accept &amp; Continue</button>
        </div>
      </div>
    </div>
    <div class="popup-footer">
      <div class="footer-card-name" id="footer-card-name">—</div>
      <div class="footer-logo">PfP · The Cardigan Collector</div>
    </div>
  </div>
</div>`;

  const div = document.createElement('div');
  div.innerHTML = html;
  document.body.appendChild(div);
}

function _renderPopup() {
  const { event, card, choices } = _state;

  document.getElementById('popup-event-title').textContent = event.name;
  document.getElementById('popup-flavour').textContent     = event.flavourText || '';
  document.getElementById('footer-card-name').textContent  = card ? card.cardName || '' : '';

  const catBadge = document.getElementById('meta-category');
  catBadge.textContent = (CATEGORY_ICONS[event.category] || '') + ' ' + (event.category || 'Unknown');

  const polBadge = document.getElementById('meta-polarity');
  const isPos    = event.polarity === 'positive';
  polBadge.textContent = isPos ? '✦ Fortunate' : '✦ Adverse';
  polBadge.className   = 'meta-badge ' + (isPos ? 'polarity-positive' : 'polarity-negative');

  document.getElementById('narrative-panel').style.display = 'none';
  document.getElementById('choice-grid').style.display     = 'grid';
  document.getElementById('confirm-btn').style.display     = 'block';
  document.querySelector('.popup-prompt').style.display    = 'block';
  document.getElementById('confirm-btn').classList.remove('active');

  const grid = document.getElementById('choice-grid');
  grid.innerHTML = '';
  choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.setAttribute('data-index', i);
    btn.innerHTML = `
      <div class="choice-label">${esc(choice.label)}</div>
    `;
    btn.addEventListener('click', () => _selectChoice(i));
    grid.appendChild(btn);
  });
}

function _selectChoice(index) {
  _state.selectedIndex = index;
  document.querySelectorAll('.choice-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === index);
  });
  document.getElementById('confirm-btn').classList.add('active');
}

window._pfpConfirmChoice = function() {
  if (_state.selectedIndex === null) return;
  const choice = _state.choices[_state.selectedIndex];

  document.getElementById('choice-grid').style.display  = 'none';
  document.getElementById('confirm-btn').style.display  = 'none';
  document.querySelector('.popup-prompt').style.display = 'none';

  _state.narrative = 'The matter has been noted in the ledger of one\'s life, and the response recorded for posterity.';

  document.getElementById('narrative-text').textContent  = _state.narrative;
  document.getElementById('archetype-badge').textContent = 'Response Recorded';
  document.getElementById('narrative-panel').style.display = 'block';
};

window._pfpAcceptOutcome = function() {
  const choice = _state.choices[_state.selectedIndex];
  if (_state.onAccept) {
    _state.onAccept(_state.event, choice, _state.narrative);
  }
  const overlay = document.getElementById('reaction-overlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  _state = { event:null, card:null, choices:[], selectedIndex:null, narrative:null, onAccept:null, onDismiss:null };
};

function showToast(message) {
  let toast = document.getElementById('pfp-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'pfp-toast';
    toast.style.cssText = `
      position:fixed; bottom:32px; left:50%; transform:translateX(-50%);
      background:#1A1025; color:#F5EFD8; border:1px solid #C9A84C;
      font-family:'EB Garamond',serif; font-size:1rem;
      padding:14px 28px; border-radius:3px; z-index:9999;
      box-shadow:0 8px 32px rgba(0,0,0,0.5);
      white-space:pre-line; text-align:center;
      opacity:0; transition:opacity 0.3s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 8000);
}

window.showToast = showToast;