// ─────────────────────────────────────────────────────────────────────────────
// EVENT REACTION POPUP — self-injecting script
// Include: <script src="event_reaction_popup.js"></script>
// Call:    openReactionPopup({ event, card, onAccept, onDismiss })
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  // ── Inject CSS ──────────────────────────────────────────────────────────────
  if (document.getElementById('reaction-popup-styles')) return; // prevent double-inject
  const style = document.createElement('style');
  style.id = 'reaction-popup-styles';
  style.textContent = ":root {\n  --purple:      #3B1F5E;\n  --purple-deep: #2A1545;\n  --purple-mid:  #4E2A7A;\n  --purple-pale: #6B3FA0;\n  --gold:        #C9A84C;\n  --gold-light:  #E8C97A;\n  --gold-dim:    #8A6E2A;\n  --cream:       #F5EFD8;\n  --cream-dark:  #E8DFC0;\n  --ink:         #1A1025;\n  --ink-mid:     #2D1E45;\n  --text-body:   #3A2A5A;\n  --text-muted:  #7A6A8A;\n  --shadow:      rgba(20, 8, 40, 0.85);\n}\n\n/* ─── Demo launcher (remove in production) ────────────────────────────── */\n#demo-launcher {\n  text-align: center;\n}\n#demo-launcher h1 {\n  font-family: 'Cinzel Decorative', serif;\n  color: var(--gold);\n  font-size: 1.4rem;\n  margin-bottom: 0.5rem;\n  letter-spacing: 0.06em;\n}\n#demo-launcher p {\n  font-family: 'EB Garamond', serif;\n  color: var(--cream);\n  opacity: 0.75;\n  margin-bottom: 1.5rem;\n  font-size: 1.05rem;\n  font-style: italic;\n}\n.demo-btn {\n  font-family: 'Cinzel', serif;\n  background: var(--gold);\n  color: var(--ink);\n  border: none;\n  padding: 0.75rem 2rem;\n  font-size: 0.85rem;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  cursor: pointer;\n  border-radius: 2px;\n  transition: background 0.2s;\n}\n.demo-btn:hover { background: var(--gold-light); }\n\n/* ─── Overlay ──────────────────────────────────────────────────────────── */\n#reaction-overlay {\n  display: none;\n  position: fixed;\n  inset: 0;\n  background: rgba(10, 4, 20, 0.82);\n  backdrop-filter: blur(6px);\n  -webkit-backdrop-filter: blur(6px);\n  z-index: 9000;\n  align-items: center;\n  justify-content: center;\n  padding: 16px;\n  animation: overlayIn 0.35s ease;\n}\n#reaction-overlay.active { display: flex; }\n\n@keyframes overlayIn {\n  from { opacity: 0; }\n  to   { opacity: 1; }\n}\n\n/* ─── Popup Shell ──────────────────────────────────────────────────────── */\n#reaction-popup {\n  width: 100%;\n  max-width: 640px;\n  max-height: 92vh;\n  overflow-y: auto;\n  border-radius: 3px;\n  box-shadow: 0 24px 80px var(--shadow), 0 0 0 1px rgba(201,168,76,0.3);\n  animation: popupIn 0.4s cubic-bezier(0.22, 1, 0.36, 1);\n  scrollbar-width: thin;\n  scrollbar-color: var(--gold-dim) transparent;\n}\n#reaction-popup::-webkit-scrollbar { width: 5px; }\n#reaction-popup::-webkit-scrollbar-track { background: transparent; }\n#reaction-popup::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 3px; }\n\n@keyframes popupIn {\n  from { opacity: 0; transform: translateY(28px) scale(0.97); }\n  to   { opacity: 1; transform: translateY(0)    scale(1);    }\n}\n\n/* ─── Header ───────────────────────────────────────────────────────────── */\n.popup-header {\n  background: var(--ink);\n  padding: 1.5rem 1.75rem 1.25rem;\n  border-bottom: 1px solid rgba(201,168,76,0.2);\n  position: relative;\n  overflow: hidden;\n}\n.popup-header::before {\n  content: '';\n  position: absolute;\n  inset: 0;\n  background: radial-gradient(ellipse at 60% -10%, rgba(201,168,76,0.08) 0%, transparent 65%);\n  pointer-events: none;\n}\n\n.popup-eyebrow {\n  font-family: 'Cinzel', serif;\n  font-size: 0.65rem;\n  letter-spacing: 0.18em;\n  text-transform: uppercase;\n  color: var(--gold);\n  opacity: 0.8;\n  margin-bottom: 0.4rem;\n}\n\n.popup-event-name {\n  font-family: 'Cinzel Decorative', serif;\n  font-size: 1.35rem;\n  font-weight: 700;\n  color: var(--cream);\n  line-height: 1.2;\n  letter-spacing: 0.02em;\n  margin-bottom: 0.6rem;\n}\n\n.popup-flavour {\n  font-family: 'EB Garamond', serif;\n  font-size: 1rem;\n  font-style: italic;\n  color: rgba(245,239,216,0.65);\n  line-height: 1.55;\n}\n\n.popup-meta {\n  display: flex;\n  align-items: center;\n  gap: 0.6rem;\n  margin-top: 0.85rem;\n  flex-wrap: wrap;\n}\n\n.meta-badge {\n  font-family: 'Cinzel', serif;\n  font-size: 0.6rem;\n  letter-spacing: 0.12em;\n  text-transform: uppercase;\n  padding: 0.2rem 0.6rem;\n  border-radius: 2px;\n  border: 1px solid;\n}\n.meta-badge.category {\n  border-color: rgba(201,168,76,0.4);\n  color: var(--gold-light);\n  background: rgba(201,168,76,0.08);\n}\n.meta-badge.polarity-positive {\n  border-color: rgba(80,180,100,0.5);\n  color: #7DCF95;\n  background: rgba(80,180,100,0.08);\n}\n.meta-badge.polarity-negative {\n  border-color: rgba(180,70,70,0.5);\n  color: #D98080;\n  background: rgba(180,70,70,0.08);\n}\n\n.popup-ornament {\n  text-align: center;\n  font-size: 0.8rem;\n  color: var(--gold);\n  opacity: 0.4;\n  letter-spacing: 0.5em;\n  margin-top: 0.9rem;\n}\n\n/* ─── Body ─────────────────────────────────────────────────────────────── */\n.popup-body {\n  background: var(--cream);\n  padding: 1.5rem 1.75rem;\n}\n\n.popup-prompt {\n  font-family: 'Cinzel', serif;\n  font-size: 0.85rem;\n  font-weight: 600;\n  color: var(--ink);\n  text-align: center;\n  letter-spacing: 0.06em;\n  margin-bottom: 1.1rem;\n  opacity: 0.85;\n}\n\n/* ─── Choice Grid ──────────────────────────────────────────────────────── */\n.choice-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 0.55rem;\n  margin-bottom: 1.25rem;\n}\n\n.choice-btn {\n  background: #fff;\n  border: 1.5px solid rgba(59,31,94,0.18);\n  border-radius: 2px;\n  padding: 0.6rem 0.5rem;\n  cursor: pointer;\n  transition: all 0.18s ease;\n  text-align: center;\n  position: relative;\n  overflow: hidden;\n}\n.choice-btn:hover {\n  border-color: var(--purple-pale);\n  background: rgba(59,31,94,0.04);\n  transform: translateY(-1px);\n  box-shadow: 0 3px 10px rgba(59,31,94,0.12);\n}\n.choice-btn.selected {\n  border-color: var(--purple);\n  background: rgba(59,31,94,0.07);\n  box-shadow: 0 0 0 2px rgba(59,31,94,0.2);\n}\n.choice-btn.selected .choice-archetype {\n  color: var(--purple);\n}\n\n.choice-archetype {\n  font-family: 'Cinzel', serif;\n  font-size: 0.52rem;\n  letter-spacing: 0.15em;\n  text-transform: uppercase;\n  color: var(--text-muted);\n  margin-bottom: 0.3rem;\n  transition: color 0.18s;\n}\n.choice-label {\n  font-family: 'EB Garamond', serif;\n  font-size: 0.9rem;\n  color: var(--text-body);\n  line-height: 1.3;\n}\n\n/* ─── Confirm button ───────────────────────────────────────────────────── */\n.confirm-row {\n  text-align: center;\n  margin-bottom: 0.5rem;\n}\n.confirm-btn {\n  font-family: 'Cinzel', serif;\n  font-size: 0.75rem;\n  letter-spacing: 0.12em;\n  text-transform: uppercase;\n  background: var(--purple);\n  color: var(--cream);\n  border: none;\n  padding: 0.7rem 2rem;\n  cursor: pointer;\n  border-radius: 2px;\n  transition: background 0.2s, opacity 0.2s;\n  opacity: 0.45;\n  pointer-events: none;\n}\n.confirm-btn.active {\n  opacity: 1;\n  pointer-events: auto;\n}\n.confirm-btn.active:hover { background: var(--purple-mid); }\n\n/* ─── Loading state ────────────────────────────────────────────────────── */\n#narrative-loading {\n  display: none;\n  flex-direction: column;\n  align-items: center;\n  padding: 1.5rem 0;\n  gap: 0.75rem;\n}\n.spinner {\n  width: 28px;\n  height: 28px;\n  border: 2px solid rgba(59,31,94,0.15);\n  border-top-color: var(--purple);\n  border-radius: 50%;\n  animation: spin 0.9s linear infinite;\n}\n@keyframes spin { to { transform: rotate(360deg); } }\n.loading-text {\n  font-family: 'EB Garamond', serif;\n  font-style: italic;\n  font-size: 0.95rem;\n  color: var(--text-muted);\n}\n\n/* ─── Narrative panel ──────────────────────────────────────────────────── */\n#narrative-panel {\n  display: none;\n  animation: fadeUp 0.5s ease;\n}\n@keyframes fadeUp {\n  from { opacity: 0; transform: translateY(8px); }\n  to   { opacity: 1; transform: translateY(0); }\n}\n\n.narrative-divider {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  margin: 0.25rem 0 1.1rem;\n  color: var(--gold-dim);\n}\n.narrative-divider::before,\n.narrative-divider::after {\n  content: '';\n  flex: 1;\n  height: 1px;\n  background: linear-gradient(90deg, transparent, rgba(138,110,42,0.4), transparent);\n}\n.narrative-divider-icon {\n  font-size: 0.8rem;\n  opacity: 0.6;\n}\n\n.narrative-label {\n  font-family: 'Cinzel', serif;\n  font-size: 0.62rem;\n  letter-spacing: 0.18em;\n  text-transform: uppercase;\n  color: var(--text-muted);\n  margin-bottom: 0.55rem;\n}\n\n.narrative-text {\n  font-family: 'EB Garamond', serif;\n  font-size: 1.05rem;\n  line-height: 1.7;\n  color: var(--text-body);\n  font-style: italic;\n}\n\n.archetype-revealed {\n  display: inline-block;\n  font-family: 'Cinzel', serif;\n  font-size: 0.6rem;\n  letter-spacing: 0.15em;\n  text-transform: uppercase;\n  color: var(--purple-pale);\n  border: 1px solid rgba(107,63,160,0.3);\n  background: rgba(59,31,94,0.05);\n  padding: 0.18rem 0.5rem;\n  border-radius: 2px;\n  margin-top: 0.65rem;\n}\n\n.narrative-actions {\n  display: flex;\n  gap: 0.6rem;\n  margin-top: 1.1rem;\n  justify-content: flex-end;\n}\n.btn-accept {\n  font-family: 'Cinzel', serif;\n  font-size: 0.72rem;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  background: var(--purple);\n  color: var(--cream);\n  border: none;\n  padding: 0.6rem 1.4rem;\n  border-radius: 2px;\n  cursor: pointer;\n  transition: background 0.2s;\n}\n.btn-accept:hover { background: var(--purple-mid); }\n.btn-decline {\n  font-family: 'Cinzel', serif;\n  font-size: 0.72rem;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  background: transparent;\n  color: var(--text-muted);\n  border: 1px solid rgba(59,31,94,0.2);\n  padding: 0.6rem 1.2rem;\n  border-radius: 2px;\n  cursor: pointer;\n  transition: all 0.15s;\n}\n.btn-decline:hover { border-color: rgba(59,31,94,0.5); color: var(--text-body); }\n\n/* ─── Footer ───────────────────────────────────────────────────────────── */\n.popup-footer {\n  background: var(--ink);\n  padding: 0.65rem 1.75rem;\n  border-top: 1px solid rgba(201,168,76,0.12);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n.footer-card-name {\n  font-family: 'Cinzel', serif;\n  font-size: 0.65rem;\n  letter-spacing: 0.1em;\n  color: var(--gold);\n  opacity: 0.7;\n}\n.footer-logo {\n  font-family: 'Cinzel Decorative', serif;\n  font-size: 0.6rem;\n  letter-spacing: 0.15em;\n  color: var(--gold);\n  opacity: 0.4;\n}\n\n/* ─── Error state ──────────────────────────────────────────────────────── */\n.narrative-error {\n  font-family: 'EB Garamond', serif;\n  font-size: 0.9rem;\n  font-style: italic;\n  color: #B05050;\n  padding: 0.75rem;\n  background: rgba(180,80,80,0.08);\n  border: 1px solid rgba(180,80,80,0.2);\n  border-radius: 2px;\n  text-align: center;\n}\n";
  document.head.appendChild(style);

  // ── Inject overlay HTML ─────────────────────────────────────────────────────
  if (document.getElementById('reaction-overlay')) return; // prevent double-inject
  const _div = document.createElement('div');
  _div.innerHTML = '<div id="reaction-overlay">\n  <div id="reaction-popup" role="dialog" aria-modal="true" aria-labelledby="popup-event-title">\n\n    <!-- Header -->\n    <div class="popup-header">\n      <div class="popup-eyebrow">A Life Event Has Occurred</div>\n      <div class="popup-event-name" id="popup-event-title">—</div>\n      <div class="popup-flavour" id="popup-flavour">—</div>\n      <div class="popup-meta">\n        <span class="meta-badge category" id="meta-category">—</span>\n        <span class="meta-badge" id="meta-polarity">—</span>\n      </div>\n      <div class="popup-ornament">◆ ◆ ◆</div>\n    </div>\n\n    <!-- Body: choice phase -->\n    <div class="popup-body" id="popup-body">\n\n      <div class="popup-prompt">How do you respond?</div>\n\n      <div class="choice-grid" id="choice-grid">\n        <!-- Populated by JS -->\n      </div>\n\n      <div class="confirm-row">\n        <button class="confirm-btn" id="confirm-btn" onclick="submitChoice()">\n          Confirm My Response\n        </button>\n      </div>\n\n\n      <!-- Generating state -->\n      <div id="narrative-loading">\n        <div class="spinner"></div>\n        <div class="loading-text">The chronicle is being written…</div>\n      </div>\n\n      <!-- Narrative result -->\n      <div id="narrative-panel">\n        <div class="narrative-divider">\n          <span class="narrative-divider-icon">✦</span>\n        </div>\n        <div class="narrative-label">Your Card Reflects</div>\n        <div class="narrative-text" id="narrative-text">—</div>\n        <div>\n          <span class="archetype-revealed" id="archetype-badge">—</span>\n        </div>\n        <div class="narrative-actions">\n          <button class="btn-accept" onclick="acceptOutcome()">Accept &amp; Continue</button>\n        </div>\n      </div>\n\n    </div>\n\n    <!-- Footer -->\n    <div class="popup-footer">\n      <div class="footer-card-name" id="footer-card-name">—</div>\n      <div class="footer-logo">PfP · The Cardigan Collector</div>\n    </div>\n\n  </div>\n</div>\n';
  document.body.appendChild(_div.firstElementChild);

  // ── Popup logic ─────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────────────────
   REACTION POOLS
   16 choices per category, each tagged with one of six archetypes:
   Resist | Yield | Reflect | Act | Deflect | Transform
   ───────────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────
   CATEGORY ICONS (optional visual aid)
   ───────────────────────────────────────────────────────────────────────── */
const CATEGORY_ICONS = {
  financial: '💰', social: '🤝', health: '🩺', mental: '🧠',
  skill: '💡', creative: '🎨', luck: '🎲', physical: '💪',
  world: '🌍', mystery: '🌀',
};

/* ─────────────────────────────────────────────────────────────────────────
   STATE
   ───────────────────────────────────────────────────────────────────────── */
let _state = {
  event:          null,    // current event object
  choices:        [],      // 9 randomly drawn choices
  selectedIndex:  null,    // index into _state.choices
  narrative:      null,    // text from Claude
  onAccept:       null,    // callback(event, choice, narrative)
  onDismiss:      null,    // callback()
};

/* ─────────────────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────
   PUBLIC API
   Call this from your dashboard code to open the popup.

   openReactionPopup({
     event: {
       name:       "Clear Bill of Health",
       category:   "health",          // one of the 10 pool keys
       polarity:   "positive",        // "positive" | "negative"
       flavourText:"The physician found nothing amiss.",
     },
     card: {
       cardName:        "Lady Elspeth Vane",
       dominantDomain:  "health",
       rarityTier:      "Rare",
       financialStanding: "Comfortable",
       recentHistory:   "Two misfortunes in the past fortnight.",
     },
     onAccept:  (event, choice, narrative) => { ... },
     onDismiss: () => { ... },
   });
   ───────────────────────────────────────────────────────────────────────── */
function openReactionPopup({ event, card, onAccept, onDismiss }) {
  _state.event         = event;
  _state.card          = card;
  _state.selectedIndex = null;
  _state.narrative     = null;
  _state.onAccept      = onAccept  || null;
  _state.onDismiss     = onDismiss || null;

  // Draw 9 random choices from the category pool (fallback to mystery)
  const pool = REACTION_POOLS[event.category] || REACTION_POOLS.mystery;
  _state.choices = pickRandom(pool, 9);

  _renderPopup();

  const overlay = document.getElementById('reaction-overlay');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePopup() {
  const overlay = document.getElementById('reaction-overlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  if (_state.onDismiss) _state.onDismiss();
  _resetState();
}

function _resetState() {
  document.getElementById('narrative-panel').style.display = 'none';
  document.getElementById('choice-grid').style.display     = 'grid';
  document.getElementById('confirm-btn').style.display     = 'block';
  document.querySelector('.popup-prompt').style.display    = 'block';
}

/* ─────────────────────────────────────────────────────────────────────────
   RENDER
   ───────────────────────────────────────────────────────────────────────── */
function _renderPopup() {
  const { event, card, choices } = _state;

  // Header
  document.getElementById('popup-event-title').textContent = event.name;
  document.getElementById('popup-flavour').textContent     = event.flavourText || '';
  document.getElementById('footer-card-name').textContent  = card.cardName || '';

  const catBadge = document.getElementById('meta-category');
  catBadge.textContent = (CATEGORY_ICONS[event.category] || '') + ' ' + 
                          (event.category || 'Unknown');

  const polBadge = document.getElementById('meta-polarity');
  const isPos    = event.polarity === 'positive';
  polBadge.textContent  = isPos ? '✦ Fortunate' : '✦ Adverse';
  polBadge.className    = 'meta-badge ' + (isPos ? 'polarity-positive' : 'polarity-negative');

  // Reset visibility
  document.getElementById('narrative-panel').style.display = 'none';
  document.getElementById('choice-grid').style.display     = 'grid';
  document.getElementById('confirm-btn').style.display     = 'block';
  document.querySelector('.popup-prompt').style.display    = 'block';

  const confirmBtn = document.getElementById('confirm-btn');
  confirmBtn.classList.remove('active');

  // Build choice grid
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
    btn.addEventListener('click', () => selectChoice(i));
    grid.appendChild(btn);
  });
}

/* ─────────────────────────────────────────────────────────────────────────
   SELECTION
   ───────────────────────────────────────────────────────────────────────── */
function selectChoice(index) {
  _state.selectedIndex = index;

  document.querySelectorAll('.choice-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === index);
  });

  const confirmBtn = document.getElementById('confirm-btn');
  confirmBtn.classList.add('active');
}

/* ─────────────────────────────────────────────────────────────────────────
   SUBMIT — placeholder narrative (Claude integration coming via Cloud Function)
   ───────────────────────────────────────────────────────────────────────── */
function submitChoice() {
  if (_state.selectedIndex === null) return;

  const choice = _state.choices[_state.selectedIndex];

  // Hide choice phase
  document.getElementById('choice-grid').style.display  = 'none';
  document.getElementById('confirm-btn').style.display  = 'none';
  document.querySelector('.popup-prompt').style.display = 'none';

  // Set placeholder narrative and show it
  _state.narrative = 'The matter has been noted in the ledger of one\'s life, and the response recorded for posterity.';
  _showNarrative(choice);
}


/* ─────────────────────────────────────────────────────────────────────────
   SHOW NARRATIVE
   ───────────────────────────────────────────────────────────────────────── */
function _showNarrative(choice) {
  const panel = document.getElementById('narrative-panel');
  document.getElementById('narrative-text').textContent   = _state.narrative;
  document.getElementById('archetype-badge').textContent  = choice.archetype + ' Response';
  panel.style.display = 'block';
}

function _showNarrativeError(choice) {
  _state.narrative = null;

  const panel = document.getElementById('narrative-panel');
  document.getElementById('narrative-text').innerHTML =
    `<span class="narrative-error">The chronicle could not be written at this time. Please try again presently.</span>`;
  document.getElementById('archetype-badge').textContent = choice.archetype + ' Response';
  panel.style.display = 'block';
}

/* ─────────────────────────────────────────────────────────────────────────
   ACCEPT OUTCOME
   ───────────────────────────────────────────────────────────────────────── */
function acceptOutcome() {
  const choice = _state.choices[_state.selectedIndex];
  if (_state.onAccept) {
    _state.onAccept(_state.event, choice, _state.narrative);
  }
  closePopup();
}

/* ─────────────────────────────────────────────────────────────────────────
   MOCK DATA + DEMO LAUNCHER (remove in production)
   ───────────────────────────────────────────────────────────────────────── */
const DEMO_EVENTS = [
  {
    name:       'Clear Bill of Health',
    category:   'health',
    polarity:   'positive',
    flavourText:'The physician found nothing amiss — a small mercy in uncertain times.',
  },
  {
    name:       'The Creditor Calls',
    category:   'financial',
    polarity:   'negative',
    flavourText:'A knock at the door, and the cheerful ruin of the morning.',
  },
  {
    name:       'A Curious Visitation',
    category:   'mystery',
    polarity:   'negative',
    flavourText:'Something moved in the house that had no right to move at all.',
  },
  {
    name:       'Unexpected Recognition',
    category:   'social',
    polarity:   'positive',
    flavourText:'Spoken of at the club in terms one is not accustomed to hearing.',
  },
  {
    name:       'The Muse Departs',
    category:   'creative',
    polarity:   'negative',
    flavourText:'Three blank pages where yesterday there had been fire.',
  },
];

const DEMO_CARD = {
  cardName:          'Lady Elspeth Vane',
  dominantDomain:    'social',
  rarityTier:        'Rare',
  financialStanding: 'Comfortable',
  recentHistory:     'Two misfortunes in the past fortnight; one narrow triumph.',
};

function launchDemo() {
  const event = DEMO_EVENTS[Math.floor(Math.random() * DEMO_EVENTS.length)];
  openReactionPopup({
    event,
    card: DEMO_CARD,
    onAccept: (ev, choice, narrative) => {
      console.log('Accepted:', { event: ev.name, choice: choice.label, archetype: choice.archetype, narrative });
      alert(`Outcome recorded.\n\nEvent: ${ev.name}\nResponse: ${choice.label} [${choice.archetype}]`);
    },
    onDismiss: () => {
      console.log('Popup dismissed.');
    },
  });
}

})();
