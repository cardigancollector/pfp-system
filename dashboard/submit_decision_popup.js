'use strict';

// ═══════════════════════════════════════════════════════════════════════════
//  PfP — DECISION POPUP
//  Shown after submitReaction returns activeThread.requiresAction === true.
//  Handles three decision types: LINK_CARD, ACCEPT_BIRTH, DECLINE.
//
//  Public API (one function):
//    window.openDecisionPopup({ activeThread, cardId, ownerToken })
//
//  activeThread shape (from submitReaction response):
//    { threadId, type, stage, label, requiresAction, actionPrompt }
// ═══════════════════════════════════════════════════════════════════════════

const DECISION_ENDPOINT = 'https://us-central1-pfp-system.cloudfunctions.net/submitDecision';

// Thread type → which decision types are available
const THREAD_DECISIONS = {
  MARRIAGE:   ['LINK_CARD', 'DECLINE'],
  CHILDBIRTH: ['ACCEPT_BIRTH', 'DECLINE'],
};

// Human-readable labels for each button
const DECISION_LABELS = {
  LINK_CARD:    { label: 'Link a Card',      icon: '🔗', desc: 'Join two cards in union' },
  ACCEPT_BIRTH: { label: 'Welcome the Child', icon: '✦',  desc: 'A new card will be created' },
  DECLINE:      { label: 'Not Yet',           icon: '↩',  desc: 'Defer this decision for now' },
};

// Thread type → icon shown in the popup header
const THREAD_ICONS = {
  MARRIAGE:   '⚭',
  CHILDBIRTH: '✦',
};

let _dState = {
  activeThread: null,
  cardId:       null,
  ownerToken:   null,
  chosen:       null,   // 'LINK_CARD' | 'ACCEPT_BIRTH' | 'DECLINE'
  linkedCardId: '',
};

// ── Public entry point ──────────────────────────────────────────────────────
window.openDecisionPopup = function({ activeThread, cardId, ownerToken }) {
  _dState.activeThread = activeThread;
  _dState.cardId       = cardId;
  _dState.ownerToken   = ownerToken;
  _dState.chosen       = null;
  _dState.linkedCardId = '';

  _ensureDecisionOverlay();
  _renderDecisionPopup();

  document.getElementById('decision-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
};

// ── DOM injection (runs once) ───────────────────────────────────────────────
function _ensureDecisionOverlay() {
  if (document.getElementById('decision-overlay')) return;

  const html = `
<style>
#decision-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(10,4,20,0.88);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 9100;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: dOverlayIn 0.35s ease;
}
#decision-overlay.active { display: flex; }
@keyframes dOverlayIn { from { opacity:0; } to { opacity:1; } }

#decision-popup {
  width: 100%;
  max-width: 520px;
  max-height: 92vh;
  overflow-y: auto;
  border-radius: 3px;
  box-shadow: 0 24px 80px rgba(20,8,40,0.9), 0 0 0 1px rgba(201,168,76,0.35);
  animation: dPopupIn 0.4s cubic-bezier(0.22,1,0.36,1);
  scrollbar-width: thin;
  scrollbar-color: #8A6E2A transparent;
  font-family: 'EB Garamond', serif;
}
@keyframes dPopupIn {
  from { opacity:0; transform:translateY(28px) scale(0.97); }
  to   { opacity:1; transform:translateY(0)    scale(1);    }
}

.dp-header {
  background: #12091E;
  padding: 1.6rem 1.75rem 1.3rem;
  border-bottom: 1px solid rgba(201,168,76,0.22);
  position: relative;
  overflow: hidden;
}
.dp-header::before {
  content:'';
  position:absolute; inset:0;
  background: radial-gradient(ellipse at 50% -20%, rgba(201,168,76,0.1) 0%, transparent 65%);
  pointer-events:none;
}
.dp-eyebrow {
  font-family:'Cinzel',serif;
  font-size:0.62rem; letter-spacing:0.2em; text-transform:uppercase;
  color:#C9A84C; opacity:0.8; margin-bottom:0.45rem;
}
.dp-thread-icon {
  font-size:2rem; display:block; text-align:center;
  margin-bottom:0.5rem; opacity:0.9;
}
.dp-title {
  font-family:'Cinzel Decorative',serif;
  font-size:1.2rem; font-weight:700; color:#F5EFD8;
  text-align:center; line-height:1.25; letter-spacing:0.02em;
  margin-bottom:0.6rem;
}
.dp-prompt {
  font-size:1rem; font-style:italic;
  color:rgba(245,239,216,0.7); line-height:1.6;
  text-align:center;
}
.dp-ornament { text-align:center; font-size:0.75rem; color:#C9A84C; opacity:0.35; letter-spacing:0.5em; margin-top:0.9rem; }

.dp-body { background:#F5EFD8; padding:1.5rem 1.75rem 1.25rem; }

/* Decision buttons */
.dp-choices { display:flex; flex-direction:column; gap:0.6rem; margin-bottom:1.1rem; }
.dp-choice-btn {
  background:#fff; border:1.5px solid rgba(59,31,94,0.18); border-radius:2px;
  padding:0.75rem 1rem; cursor:pointer; transition:all 0.18s ease;
  text-align:left; display:flex; align-items:center; gap:0.75rem;
}
.dp-choice-btn:hover { border-color:#6B3FA0; background:rgba(59,31,94,0.04); transform:translateX(2px); box-shadow:0 3px 12px rgba(59,31,94,0.1); }
.dp-choice-btn.selected { border-color:#3B1F5E; background:rgba(59,31,94,0.07); box-shadow:0 0 0 2px rgba(59,31,94,0.18); }
.dp-choice-btn.decline-btn { border-color:rgba(120,60,60,0.25); }
.dp-choice-btn.decline-btn:hover { border-color:rgba(180,60,60,0.5); background:rgba(180,60,60,0.04); }
.dp-choice-btn.decline-btn.selected { border-color:#9B2C2C; background:rgba(155,44,44,0.06); box-shadow:0 0 0 2px rgba(155,44,44,0.15); }

.dp-choice-icon { font-size:1.3rem; flex-shrink:0; width:28px; text-align:center; }
.dp-choice-info { flex:1; }
.dp-choice-label { font-family:'Cinzel',serif; font-size:0.78rem; letter-spacing:0.06em; color:#3A2A5A; margin-bottom:0.15rem; }
.dp-choice-desc  { font-family:'EB Garamond',serif; font-size:0.85rem; color:#7A6A8A; font-style:italic; }

/* Card ID input — shown only for LINK_CARD */
#dp-link-input-wrap {
  display: none;
  margin-bottom: 1rem;
  animation: dFadeUp 0.3s ease;
}
@keyframes dFadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
.dp-input-label {
  display:block; font-family:'Cinzel',serif; font-size:0.62rem;
  letter-spacing:0.18em; text-transform:uppercase; color:#7A6A8A;
  margin-bottom:0.4rem;
}
#dp-linked-card-input {
  width:100%; background:rgba(255,255,255,0.8);
  border:1px solid rgba(59,31,94,0.25); border-bottom:2px solid #3B1F5E;
  color:#1A1025; font-family:'EB Garamond',serif; font-size:1rem;
  padding:0.6rem 0.75rem; outline:none; border-radius:2px;
  transition:border-color 0.2s,background 0.2s; letter-spacing:1px;
}
#dp-linked-card-input:focus { border-color:#6B3FA0; background:#fff; }
.dp-input-hint { font-size:0.78rem; color:#9A8A8A; font-style:italic; margin-top:0.3rem; }

/* Confirm row */
.dp-confirm-row { text-align:center; margin-bottom:0.25rem; }
.dp-confirm-btn {
  font-family:'Cinzel',serif; font-size:0.75rem; letter-spacing:0.12em; text-transform:uppercase;
  background:#3B1F5E; color:#F5EFD8; border:none; padding:0.75rem 2.2rem;
  cursor:pointer; border-radius:2px; transition:background 0.2s,opacity 0.2s;
  opacity:0.4; pointer-events:none;
}
.dp-confirm-btn.active { opacity:1; pointer-events:auto; }
.dp-confirm-btn.active:hover { background:#4E2A7A; }

/* Result panel — shown after API call */
#dp-result-panel {
  display:none;
  animation: dFadeUp 0.4s ease;
  text-align:center; padding:0.5rem 0 0.25rem;
}
.dp-result-icon { font-size:2rem; margin-bottom:0.5rem; display:block; }
.dp-result-title {
  font-family:'Cinzel',serif; font-size:0.95rem; letter-spacing:0.06em;
  color:#3A2A5A; margin-bottom:0.4rem;
}
.dp-result-desc { font-family:'EB Garamond',serif; font-size:0.95rem; color:#5A4A7A; line-height:1.6; font-style:italic; }
.dp-result-marker {
  display:inline-block; margin-top:0.75rem;
  font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.15em;
  text-transform:uppercase; color:#6B3FA0;
  border:1px solid rgba(107,63,160,0.3); background:rgba(59,31,94,0.05);
  padding:0.2rem 0.6rem; border-radius:2px;
}
.dp-result-actions { display:flex; justify-content:center; margin-top:1.1rem; }
.dp-close-btn {
  font-family:'Cinzel',serif; font-size:0.72rem; letter-spacing:0.1em; text-transform:uppercase;
  background:#3B1F5E; color:#F5EFD8; border:none; padding:0.6rem 1.6rem;
  border-radius:2px; cursor:pointer; transition:background 0.2s;
}
.dp-close-btn:hover { background:#4E2A7A; }

/* Error message */
.dp-error { color:#9B2C2C; font-size:0.82rem; text-align:center; min-height:18px; margin-top:0.5rem; font-style:italic; }

/* Loading state */
.dp-loading { text-align:center; padding:1rem 0; }
.dp-loading-spinner {
  width:32px; height:32px; border:2px solid rgba(59,31,94,0.2);
  border-top-color:#3B1F5E; border-radius:50%;
  animation:dSpin 0.8s linear infinite; margin:0 auto 0.6rem;
}
@keyframes dSpin { to { transform:rotate(360deg); } }
.dp-loading-text { font-family:'Cinzel',serif; font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; color:#7A6A8A; }

.dp-footer {
  background:#12091E; padding:0.65rem 1.75rem;
  border-top:1px solid rgba(201,168,76,0.12);
  display:flex; align-items:center; justify-content:space-between;
}
.dp-footer-thread { font-family:'Cinzel',serif; font-size:0.62rem; letter-spacing:0.1em; color:#C9A84C; opacity:0.65; }
.dp-footer-logo   { font-family:'Cinzel Decorative',serif; font-size:0.58rem; letter-spacing:0.15em; color:#C9A84C; opacity:0.35; }
</style>

<div id="decision-overlay">
  <div id="decision-popup" role="dialog" aria-modal="true" aria-labelledby="dp-title">

    <div class="dp-header">
      <div class="dp-eyebrow">A Milestone Awaits Your Response</div>
      <span class="dp-thread-icon" id="dp-thread-icon">✦</span>
      <div class="dp-title" id="dp-title">—</div>
      <div class="dp-prompt" id="dp-prompt">—</div>
      <div class="dp-ornament">◆ ◆ ◆</div>
    </div>

    <div class="dp-body">

      <!-- Choice buttons (rendered dynamically) -->
      <div class="dp-choices" id="dp-choices"></div>

      <!-- Card ID input — only visible when LINK_CARD is selected -->
      <div id="dp-link-input-wrap">
        <label class="dp-input-label" for="dp-linked-card-input">Second Card's Evolution ID</label>
        <input type="text" id="dp-linked-card-input" placeholder="e.g. CARD-002"
               autocomplete="off" spellcheck="false"
               oninput="window._dpOnCardIdInput()" />
        <div class="dp-input-hint">Enter the Evolution ID printed on the second card.</div>
      </div>

      <!-- Confirm button -->
      <div class="dp-confirm-row">
        <button class="dp-confirm-btn" id="dp-confirm-btn" onclick="window._dpConfirm()">
          Record My Decision
        </button>
      </div>

      <!-- Error -->
      <div class="dp-error" id="dp-error"></div>

      <!-- Loading spinner (hidden until API call) -->
      <div class="dp-loading" id="dp-loading" style="display:none;">
        <div class="dp-loading-spinner"></div>
        <div class="dp-loading-text">Recording decision…</div>
      </div>

      <!-- Result panel (shown after API responds) -->
      <div id="dp-result-panel">
        <span class="dp-result-icon" id="dp-result-icon">✦</span>
        <div class="dp-result-title"  id="dp-result-title">—</div>
        <div class="dp-result-desc"   id="dp-result-desc">—</div>
        <div id="dp-result-marker-wrap"></div>
        <div class="dp-result-actions">
          <button class="dp-close-btn" onclick="window._dpClose()">Continue</button>
        </div>
      </div>

    </div>

    <div class="dp-footer">
      <div class="dp-footer-thread" id="dp-footer-thread">—</div>
      <div class="dp-footer-logo">PfP · Proof of Person</div>
    </div>

  </div>
</div>`;

  const div = document.createElement('div');
  div.innerHTML = html;
  document.body.appendChild(div);
}

// ── Render the popup for the current thread ─────────────────────────────────
function _renderDecisionPopup() {
  const { activeThread } = _dState;
  const threadType  = activeThread.type || 'MARRIAGE';
  const threadLabel = activeThread.label || threadType;

  // Header
  document.getElementById('dp-thread-icon').textContent = THREAD_ICONS[threadType] || '✦';
  document.getElementById('dp-title').textContent       = threadLabel;
  document.getElementById('dp-prompt').textContent      = activeThread.actionPrompt || 'A decision is required.';
  document.getElementById('dp-footer-thread').textContent = 'Thread: ' + threadLabel;

  // Reset state panels
  document.getElementById('dp-error').textContent           = '';
  document.getElementById('dp-loading').style.display       = 'none';
  document.getElementById('dp-result-panel').style.display  = 'none';
  document.getElementById('dp-link-input-wrap').style.display = 'none';

  const confirmBtn = document.getElementById('dp-confirm-btn');
  confirmBtn.style.display = 'block';
  confirmBtn.classList.remove('active');

  // Build choice buttons
  const decisionTypes = THREAD_DECISIONS[threadType] || ['DECLINE'];
  const choicesEl = document.getElementById('dp-choices');
  choicesEl.innerHTML = '';

  decisionTypes.forEach(type => {
    const def = DECISION_LABELS[type];
    const btn = document.createElement('button');
    btn.className = 'dp-choice-btn' + (type === 'DECLINE' ? ' decline-btn' : '');
    btn.setAttribute('data-decision', type);
    btn.innerHTML = `
      <div class="dp-choice-icon">${def.icon}</div>
      <div class="dp-choice-info">
        <div class="dp-choice-label">${_dEsc(def.label)}</div>
        <div class="dp-choice-desc">${_dEsc(def.desc)}</div>
      </div>
    `;
    btn.addEventListener('click', () => _dpSelectChoice(type));
    choicesEl.appendChild(btn);
  });
}

// ── Choice selection ────────────────────────────────────────────────────────
function _dpSelectChoice(decisionType) {
  _dState.chosen = decisionType;
  document.getElementById('dp-error').textContent = '';

  // Highlight selected button
  document.querySelectorAll('.dp-choice-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.getAttribute('data-decision') === decisionType);
  });

  // Show card ID input only for LINK_CARD
  const linkWrap = document.getElementById('dp-link-input-wrap');
  if (decisionType === 'LINK_CARD') {
    linkWrap.style.display = 'block';
    document.getElementById('dp-linked-card-input').value = '';
    _dState.linkedCardId = '';
    // Confirm stays locked until they type a card ID
    document.getElementById('dp-confirm-btn').classList.remove('active');
  } else {
    linkWrap.style.display = 'none';
    // Confirm is ready for ACCEPT_BIRTH or DECLINE
    document.getElementById('dp-confirm-btn').classList.add('active');
  }
}

// Called on every keystroke in the card ID input
window._dpOnCardIdInput = function() {
  const val = document.getElementById('dp-linked-card-input').value.trim();
  _dState.linkedCardId = val;
  // Enable confirm only if there's something typed
  const confirmBtn = document.getElementById('dp-confirm-btn');
  if (val.length > 0) {
    confirmBtn.classList.add('active');
  } else {
    confirmBtn.classList.remove('active');
  }
};

// ── Confirm — call submitDecision endpoint ──────────────────────────────────
window._dpConfirm = async function() {
  const { activeThread, cardId, ownerToken, chosen, linkedCardId } = _dState;
  if (!chosen) return;

  // Validate card ID for LINK_CARD
  if (chosen === 'LINK_CARD' && !linkedCardId) {
    document.getElementById('dp-error').textContent = 'Please enter the second card\'s Evolution ID.';
    return;
  }

  // Show loading, hide choice UI
  document.getElementById('dp-choices').style.display       = 'none';
  document.getElementById('dp-link-input-wrap').style.display = 'none';
  document.getElementById('dp-confirm-btn').style.display   = 'none';
  document.getElementById('dp-error').textContent            = '';
  document.getElementById('dp-loading').style.display        = 'flex';

  const body = {
    cardId:       cardId,
    ownerToken:   ownerToken,
    threadId:     activeThread.threadId,
    decisionType: chosen,
  };
  if (chosen === 'LINK_CARD') body.linkedCardId = linkedCardId;

  try {
    const res    = await fetch(DECISION_ENDPOINT, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    const result = await res.json();

    document.getElementById('dp-loading').style.display = 'none';

    if (result.success) {
      _showDecisionResult(chosen, result);
    } else {
      // Show error and let them retry
      _showChoicesAgain();
      document.getElementById('dp-error').textContent =
        result.error || 'Something went wrong. Please try again.';
    }
  } catch (err) {
    document.getElementById('dp-loading').style.display = 'none';
    _showChoicesAgain();
    document.getElementById('dp-error').textContent = 'Connection error — please try again.';
    console.error('submitDecision error:', err);
  }
};

// ── Show result after a successful API response ─────────────────────────────
function _showDecisionResult(decisionType, result) {
  const resultPanel = document.getElementById('dp-result-panel');
  let icon, title, desc, markerHtml = '';

  if (decisionType === 'LINK_CARD') {
    icon  = '⚭';
    title = 'The Union Has Been Recorded';
    desc  = result.message || 'Both cards are now bound in the ledger. Their histories are joined.';
    if (result.marker) {
      markerHtml = `<div class="dp-result-marker-wrap"><span class="dp-result-marker">${_dEsc(result.marker)}</span></div>`;
    }

  } else if (decisionType === 'ACCEPT_BIRTH') {
    icon  = '✦';
    title = 'A New Life Has Entered the World';
    desc  = result.message || 'A child card has been created and linked to this card.';
    if (result.claimCode) {
      desc += ' Claim code: ' + result.claimCode;
    }
    if (result.marker) {
      markerHtml = `<div class="dp-result-marker-wrap"><span class="dp-result-marker">${_dEsc(result.marker)}</span></div>`;
    }

  } else {
    // DECLINE
    icon  = '↩';
    title = 'Decision Deferred';
    desc  = result.message || 'The moment has passed for now. The thread remains open.';
  }

  document.getElementById('dp-result-icon').textContent    = icon;
  document.getElementById('dp-result-title').textContent   = title;
  document.getElementById('dp-result-desc').textContent    = desc;
  document.getElementById('dp-result-marker-wrap').innerHTML = markerHtml;

  resultPanel.style.display = 'block';
}

// ── Restore choice UI after an error ───────────────────────────────────────
function _showChoicesAgain() {
  document.getElementById('dp-choices').style.display     = 'flex';
  document.getElementById('dp-confirm-btn').style.display = 'block';
  document.getElementById('dp-confirm-btn').classList.add('active');

  // Re-show card input if LINK_CARD was selected
  if (_dState.chosen === 'LINK_CARD') {
    document.getElementById('dp-link-input-wrap').style.display = 'block';
  }
}

// ── Close the popup ─────────────────────────────────────────────────────────
window._dpClose = function() {
  document.getElementById('decision-overlay').classList.remove('active');
  document.body.style.overflow = '';
  _dState = { activeThread:null, cardId:null, ownerToken:null, chosen:null, linkedCardId:'' };
};

// ── Tiny XSS helper ─────────────────────────────────────────────────────────
function _dEsc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
