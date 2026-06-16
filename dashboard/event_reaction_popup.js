'use strict';

const REACTION_POOLS = {

  financial: [
    { label: "Tighten my belt and endure",            archetype: "Resist"    },
    { label: "Accept the loss with grace",            archetype: "Yield"     },
    { label: "Count what remains",                    archetype: "Reflect"   },
    { label: "Seek a new source of income",           archetype: "Act"       },
    { label: "Blame misfortune and move on",          archetype: "Deflect"   },
    { label: "Convert hardship into discipline",      archetype: "Transform" },
    { label: "Refuse to spend a single farthing",     archetype: "Resist"    },
    { label: "Invest what little I have left",        archetype: "Act"       },
    { label: "Surrender to debt's embrace",           archetype: "Yield"     },
    { label: "Reflect upon past extravagances",       archetype: "Reflect"   },
    { label: "Call upon a wealthy acquaintance",      archetype: "Deflect"   },
    { label: "Reframe poverty as liberation",         archetype: "Transform" },
    { label: "Guard my savings fiercely",             archetype: "Resist"    },
    { label: "Accept charity without shame",          archetype: "Yield"     },
    { label: "Take stock of hidden assets",           archetype: "Reflect"   },
    { label: "Gamble on an unlikely venture",         archetype: "Act"       },
  ],

  social: [
    { label: "Stand my ground in company",            archetype: "Resist"    },
    { label: "Defer to those more connected",         archetype: "Yield"     },
    { label: "Study the room before speaking",        archetype: "Reflect"   },
    { label: "Make my presence known",                archetype: "Act"       },
    { label: "Blame the gathering's poor manners",    archetype: "Deflect"   },
    { label: "Use the slight to fuel ambition",       archetype: "Transform" },
    { label: "Refuse the invitation entirely",        archetype: "Resist"    },
    { label: "Accept whatever role is offered",       archetype: "Yield"     },
    { label: "Recall what was said of me before",     archetype: "Reflect"   },
    { label: "Introduce myself boldly",               archetype: "Act"       },
    { label: "Attribute the snub to jealousy",        archetype: "Deflect"   },
    { label: "Reinvent how others perceive me",       archetype: "Transform" },
    { label: "Maintain my dignity in silence",        archetype: "Resist"    },
    { label: "Follow the crowd's inclination",        archetype: "Yield"     },
    { label: "Observe before passing judgement",      archetype: "Reflect"   },
    { label: "Seek an audience with the host",        archetype: "Act"       },
  ],

  health: [
    { label: "Push through the discomfort",           archetype: "Resist"    },
    { label: "Rest and let the body decide",          archetype: "Yield"     },
    { label: "Take careful stock of my symptoms",     archetype: "Reflect"   },
    { label: "Summon the physician at once",          archetype: "Act"       },
    { label: "Attribute it to the foul weather",      archetype: "Deflect"   },
    { label: "Let illness sharpen my resolve",        archetype: "Transform" },
    { label: "Refuse to acknowledge the weakness",    archetype: "Resist"    },
    { label: "Submit to bed rest without protest",    archetype: "Yield"     },
    { label: "Consider the life I have been living",  archetype: "Reflect"   },
    { label: "Pursue a rigorous new regimen",         archetype: "Act"       },
    { label: "Blame the season's malevolent air",     archetype: "Deflect"   },
    { label: "Emerge from illness transformed",       archetype: "Transform" },
    { label: "Soldier on regardless",                 archetype: "Resist"    },
    { label: "Accept nature's verdict",               archetype: "Yield"     },
    { label: "Document the ailment precisely",        archetype: "Reflect"   },
    { label: "Seek a second opinion forthwith",       archetype: "Act"       },
  ],

  mental: [
    { label: "Refuse to give the thought room",       archetype: "Resist"    },
    { label: "Allow the feeling to pass through",     archetype: "Yield"     },
    { label: "Examine the source of the darkness",    archetype: "Reflect"   },
    { label: "Write it all down immediately",         archetype: "Act"       },
    { label: "Blame the pressures of the age",        archetype: "Deflect"   },
    { label: "Turn inward struggle outward",          archetype: "Transform" },
    { label: "Steel myself against despair",          archetype: "Resist"    },
    { label: "Surrender to the melancholy",           archetype: "Yield"     },
    { label: "Trace the thought to its origin",       archetype: "Reflect"   },
    { label: "Speak to a confidant at once",          archetype: "Act"       },
    { label: "Dismiss it as nervous exhaustion",      archetype: "Deflect"   },
    { label: "Let the wound become wisdom",           archetype: "Transform" },
    { label: "Occupy the mind with industry",         archetype: "Resist"    },
    { label: "Rest the mind without guilt",           archetype: "Yield"     },
    { label: "Sit with the discomfort quietly",       archetype: "Reflect"   },
    { label: "Seek a change of scenery at once",      archetype: "Act"       },
  ],

  skill: [
    { label: "Persist where others would stop",       archetype: "Resist"    },
    { label: "Accept the limits of my talent",        archetype: "Yield"     },
    { label: "Consider where I went astray",          archetype: "Reflect"   },
    { label: "Practise until the hour is late",       archetype: "Act"       },
    { label: "Attribute failure to poor instruction", archetype: "Deflect"   },
    { label: "Use the stumble to refine technique",   archetype: "Transform" },
    { label: "Refuse to concede defeat",              archetype: "Resist"    },
    { label: "Step aside for those more gifted",      archetype: "Yield"     },
    { label: "Study what the masters did",            archetype: "Reflect"   },
    { label: "Take on a more demanding challenge",    archetype: "Act"       },
    { label: "Lay the blame on faulty tools",         archetype: "Deflect"   },
    { label: "Reinvent my approach entirely",         archetype: "Transform" },
    { label: "Grind until mastery arrives",           archetype: "Resist"    },
    { label: "Acknowledge what I do not know",        archetype: "Yield"     },
    { label: "Review each misstep carefully",         archetype: "Reflect"   },
    { label: "Seek a mentor without delay",           archetype: "Act"       },
  ],

  creative: [
    { label: "Produce despite the block",             archetype: "Resist"    },
    { label: "Let the muse come in her own time",     archetype: "Yield"     },
    { label: "Return to the work that inspired me",   archetype: "Reflect"   },
    { label: "Begin something entirely new",          archetype: "Act"       },
    { label: "Blame the dull surroundings",           archetype: "Deflect"   },
    { label: "Convert the failure into material",     archetype: "Transform" },
    { label: "Insist on completing the piece",        archetype: "Resist"    },
    { label: "Set the work aside without shame",      archetype: "Yield"     },
    { label: "Trace where the vision was lost",       archetype: "Reflect"   },
    { label: "Fill the page until something catches", archetype: "Act"       },
    { label: "Attribute dullness to the audience",    archetype: "Deflect"   },
    { label: "Let destruction become a new style",    archetype: "Transform" },
    { label: "Persist through uninspired hours",      archetype: "Resist"    },
    { label: "Invite chance to take the reins",       archetype: "Yield"     },
    { label: "Sit with the unfinished work quietly",  archetype: "Reflect"   },
    { label: "Present the work raw and unfinished",   archetype: "Act"       },
  ],

  luck: [
    { label: "Reject fortune's fickle offer",         archetype: "Resist"    },
    { label: "Accept whatever fate delivers",         archetype: "Yield"     },
    { label: "Examine why this came to me",           archetype: "Reflect"   },
    { label: "Press the advantage immediately",       archetype: "Act"       },
    { label: "Put the mishap down to bad stars",      archetype: "Deflect"   },
    { label: "Turn the windfall into momentum",       archetype: "Transform" },
    { label: "Refuse to be ruled by chance",          archetype: "Resist"    },
    { label: "Bow to the inevitable",                 archetype: "Yield"     },
    { label: "Consider what I did to earn this",      archetype: "Reflect"   },
    { label: "Wager on the streak continuing",        archetype: "Act"       },
    { label: "Credit mere coincidence",               archetype: "Deflect"   },
    { label: "Treat the curse as a teacher",          archetype: "Transform" },
    { label: "Decline the gift on principle",         archetype: "Resist"    },
    { label: "Take what is given quietly",            archetype: "Yield"     },
    { label: "Search for the pattern beneath",        archetype: "Reflect"   },
    { label: "Act before the luck expires",           archetype: "Act"       },
  ],

  physical: [
    { label: "Train harder than before",              archetype: "Resist"    },
    { label: "Accept the body's natural state",       archetype: "Yield"     },
    { label: "Study what my body is telling me",      archetype: "Reflect"   },
    { label: "Take up a demanding regimen",           archetype: "Act"       },
    { label: "Blame the strain on poor conditions",   archetype: "Deflect"   },
    { label: "Build strength from weakness",          archetype: "Transform" },
    { label: "Refuse to slow despite fatigue",        archetype: "Resist"    },
    { label: "Concede to the body's need for rest",   archetype: "Yield"     },
    { label: "Inventory my physical habits honestly", archetype: "Reflect"   },
    { label: "Set a new personal ambition",           archetype: "Act"       },
    { label: "Attribute it to poor constitution",     archetype: "Deflect"   },
    { label: "Use the setback to rebuild better",     archetype: "Transform" },
    { label: "Endure what must be endured",           archetype: "Resist"    },
    { label: "Listen to what the body asks for",      archetype: "Yield"     },
    { label: "Review my habits with candour",         archetype: "Reflect"   },
    { label: "Begin immediately, without delay",      archetype: "Act"       },
  ],

  world: [
    { label: "Stand against the tide of change",      archetype: "Resist"    },
    { label: "Accept the world as it remakes itself", archetype: "Yield"     },
    { label: "Consider what this moment means",       archetype: "Reflect"   },
    { label: "Position myself for what is coming",    archetype: "Act"       },
    { label: "Blame those in power for the chaos",    archetype: "Deflect"   },
    { label: "Let upheaval become opportunity",       archetype: "Transform" },
    { label: "Refuse to alter my established ways",   archetype: "Resist"    },
    { label: "Flow with the current, not against it", archetype: "Yield"     },
    { label: "Trace the event to its deeper cause",   archetype: "Reflect"   },
    { label: "Involve myself in the moment directly", archetype: "Act"       },
    { label: "Lay the trouble at society's door",     archetype: "Deflect"   },
    { label: "Let the world's upheaval reshape me",   archetype: "Transform" },
    { label: "Maintain my principles under pressure", archetype: "Resist"    },
    { label: "Submit to the larger forces at work",   archetype: "Yield"     },
    { label: "Observe before forming conclusions",    archetype: "Reflect"   },
    { label: "Seek those who might act with me",      archetype: "Act"       },
  ],

  mystery: [
    { label: "Refuse to acknowledge the uncanny",     archetype: "Resist"    },
    { label: "Surrender to what I cannot explain",    archetype: "Yield"     },
    { label: "Sit with the strangeness quietly",      archetype: "Reflect"   },
    { label: "Investigate at once",                   archetype: "Act"       },
    { label: "Attribute it to fevered imagination",   archetype: "Deflect"   },
    { label: "Let the mystery alter me",              archetype: "Transform" },
    { label: "Deny what my eyes have shown me",       archetype: "Resist"    },
    { label: "Accept the impossible as true",         archetype: "Yield"     },
    { label: "Search for meaning in the omen",        archetype: "Reflect"   },
    { label: "Chase the phenomenon to its source",    archetype: "Act"       },
    { label: "Credit the peculiar to ill sleep",      archetype: "Deflect"   },
    { label: "Allow the unknown to expand me",        archetype: "Transform" },
    { label: "Resist the pull of the inexplicable",   archetype: "Resist"    },
    { label: "Yield to the call of the unseen",       archetype: "Yield"     },
    { label: "Contemplate what has been revealed",    archetype: "Reflect"   },
    { label: "Step toward the threshold",             archetype: "Act"       },
  ],

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
  _state.choices = pickRandom(pool, 9);

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
      <div class="choice-archetype">${esc(choice.archetype)}</div>
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
  document.getElementById('archetype-badge').textContent = choice.archetype + ' Response';
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
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 4000);
}

window.showToast = showToast;