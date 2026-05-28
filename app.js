// Realmora 👑 - Core Gameplay Engine
import { getRandomEvent, events } from './events.js';

import {
  createKingdom,
  getKingdom,
  watchKingdom,
  updateKingdom,
  watchWorld,
  setPlayerOnline,
  sendInteraction,
  respondToInteraction,
  deleteInteraction,
  watchMyInteractions
} from "./world.js";

import {
  db,
  doc,
  setDoc,
  getDoc,
  onSnapshot
} from "./firebase.js";

import { loginPlayer, watchPlayerAuth } from "./auth.js";

import {
  triggerWorldEvent,
  watchWorldEvents
} from "./worldEvents.js";

import {
  createWorldVote,
  watchWorldVote,
  castVote
} from "./voting.js";

import {
  createAlliance,
  watchAlliances,
  joinAlliance
} from "./alliances.js";

import {
  watchLeaderboard
} from "./leaderboard.js";

import {
  resolveWar
} from "./war.js";

import {
  createWorldVote as createPoliticsVote,
  watchWorldVotes,
  voteOnIssue
}
from "./politics.js";

import {
  sabotageKingdom
}
from "./espionage.js";

import {
kingdomClasses,
applyClassBonus
}
from "./classes.js";

import {
achievements,
checkAchievements
}
from "./achievements.js";


import { 
  npcKingdomsData, 
  getDiplomacyStatus, 
  updateNPCRelationships, 
  checkDiplomaticInterventions 
} from './diplomacy.js';

// Start authentication
loginPlayer();

watchPlayerAuth(async (user) => {
  if (!user) return;

  console.log("Realmora Ready 👑");

  window.playerId = user.uid;

  setPlayerOnline(user.uid, true);

  const kingdom = await getKingdom(user.uid);

  if (!kingdom) {
    await createKingdom(user.uid, {
      rulerName: "Arthur",
      kingdomName: "Magadh",
      focus: "merchant"
    });
  }

  watchWorld(
(kingdoms)=>{

renderRealPlayers(
kingdoms,
user.uid
);

renderLeaderboard(
kingdoms
);

});

  // Watch multiplayer live requests
  watchMyInteractions(user.uid, (interactions, direction) => {
    handleInteractionsUpdate(interactions, direction);
  });

  watchWorldEvents((event) => {
  if (!event) return;

  applyWorldEvent(event);
});

watchWorldVote((vote) => {
  if (!vote) return;

  showVotePopup(vote);
});

watchAlliances((alliances) => {
  renderAlliances(alliances);
});

watchLeaderboard(
  (rankings) => {
    renderLeaderboard(
      rankings
    );
  }
);

watchWorldVotes(
(votes)=>{
renderWorldVotes(
votes
);
});
});


// ==================== 1. DEFAULT GAME STATE ====================
const defaultState = {
  player: {
    rulerName: "",
    kingdomName: "",
    focus: "merchant", // merchant, guard, embassy, monarch
    personality: "Balanced Monarch",
    personalityScores: {
      compassionate: 0,
      conqueror: 0,
      diplomat: 0,
      manipulator: 0,
      opportunist: 0
    }
  },
  stats: {
    economy: 50,
    trust: 50,
    war: 50,
    diplomacy: 50
  },
  turn: 1,
  survivedTurns: 0,
  riskLevel: "Low", // Low, Medium, High, Extreme
  flags: [],
  history: [],
  achievements: [],
  npcKingdoms: {
    ironVanguard: { relationship: 50 },
    gildedSyndicate: { relationship: 50 },
    sylvanConclave: { relationship: 50 },
    celestiaHegemony: { relationship: 50 }
  },
  multiplayer: {
    allies: [],
    enemies: []
  },
  activeCard: null,
  gameOver: false,
  gameOverReason: ""
};

let state = JSON.parse(JSON.stringify(defaultState));

// ==================== 2. PROCEDURAL SOUND SYNTHESIZER (WEB AUDIO API) ====================
// Generates highly polished acoustic atmospheric sounds without needing raw MP3 files!
class AudioSynthManager {
  constructor() {
    this.ctx = null;
    this.droneOsc = null;
    this.droneFilter = null;
    this.isEnabled = false;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  toggle() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    if (this.isEnabled) {
      this.stopDrone();
      this.isEnabled = false;
      return false;
    } else {
      this.startDrone();
      this.isEnabled = true;
      return true;
    }
  }

  // Plays a deep royal ambient pad/drone in the background
  startDrone() {
    try {
      this.init();
      // Low pass filtered saw wave for deep velvet texture
      this.droneOsc = this.ctx.createOscillator();
      this.droneFilter = this.ctx.createBiquadFilter();
      const gainNode = this.ctx.createGain();

      this.droneOsc.type = 'sawtooth';
      this.droneOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // Deep A1 note
      
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(140, this.ctx.currentTime);
      this.droneFilter.Q.setValueAtTime(3, this.ctx.currentTime);

      gainNode.gain.setValueAtTime(0.06, this.ctx.currentTime); // Subdued volume

      this.droneOsc.connect(this.droneFilter);
      this.droneFilter.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      this.droneOsc.start();

      // Ambient frequency sweep modulation
      this.modInterval = setInterval(() => {
        if (!this.ctx || !this.droneFilter) return;
        const targetFreq = 110 + Math.random() * 80;
        this.droneFilter.frequency.exponentialRampToValueAtTime(targetFreq, this.ctx.currentTime + 4);
      }, 5000);

    } catch (e) {
      console.warn("Could not start synthesised ambience:", e);
    }
  }

  stopDrone() {
    if (this.droneOsc) {
      try {
        this.droneOsc.stop();
        this.droneOsc.disconnect();
      } catch(e) {}
      this.droneOsc = null;
    }
    if (this.modInterval) {
      clearInterval(this.modInterval);
    }
  }

  // Play an elegant sparkling gold chime when drawing cards or clicking
  playChime() {
    if (!this.isEnabled) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      // Multiple high-pitched oscillators to form a royal bell tone
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 chord
      freqs.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.exponentialRampToValueAtTime(f + (Math.random() * 20), now + 1);
        
        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 1.2);
      });

      gainNode.connect(this.ctx.destination);
    } catch(e) {}
  }

  // Play a military war drum/strike for bad events or crisis
  playStrike() {
    if (!this.isEnabled) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(20, now + 0.6); // Deep slide down

      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, now);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch(e) {}
  }

  // Play a triumphant brass-like synth trumpet when winning or shifting personality
  playTriumph() {
    if (!this.isEnabled) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.09, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      // Root, Third, Fifth, Octave, and Major Ninth
      const notes = [293.66, 369.99, 440.00, 587.33, 659.25]; // D4 Major 9
      notes.forEach((f) => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        
        // Slight vibrato
        osc.frequency.linearRampToValueAtTime(f + 4, now + 0.5);
        osc.frequency.linearRampToValueAtTime(f - 4, now + 1.0);
        osc.frequency.linearRampToValueAtTime(f, now + 1.8);

        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 2.0);
      });

      gainNode.connect(this.ctx.destination);
    } catch(e) {}
  }
}

const audioSynth = new AudioSynthManager();

// ==================== 3. DOM ELEMENT REFERENCES ====================
const DOM = {
  screens: {
    landing: document.getElementById('screen-landing'),
    setup: document.getElementById('screen-setup'),
    gameplay: document.getElementById('screen-gameplay'),
    endgame: document.getElementById('screen-endgame')
  },
  buttons: {
    playNew: document.getElementById('btn-play-new'),
    playContinue: document.getElementById('btn-play-continue'),
    setupConfirm: document.getElementById('btn-setup-confirm'),
    setupBack: document.getElementById('btn-setup-back'),
    gameSave: document.getElementById('btn-game-save'),
    gameRestart: document.getElementById('btn-game-restart'),
    endingNew: document.getElementById('btn-ending-new'),
    endingLedger: document.getElementById('btn-ending-ledger'),
    soundToggle: document.getElementById('btn-sound-toggle'),
    tabDiplomacy: document.getElementById('tab-btn-diplomacy'),
    tabWorld: document.getElementById('tab-btn-world'),
    tabChronicle: document.getElementById('tab-btn-chronicle')
  },
  inputs: {
    rulerName: document.getElementById('setup-ruler-name'),
    kingdomName: document.getElementById('setup-kingdom-name')
  },
  stats: {
    economyText: document.getElementById('stat-val-economy'),
    trustText: document.getElementById('stat-val-trust'),
    warText: document.getElementById('stat-val-war'),
    diplomacyText: document.getElementById('stat-val-diplomacy'),
    economyFill: document.getElementById('stat-fill-economy'),
    trustFill: document.getElementById('stat-fill-trust'),
    warFill: document.getElementById('stat-fill-war'),
    diplomacyFill: document.getElementById('stat-fill-diplomacy')
  },
  profile: {
    avatar: document.getElementById('ruler-crest-sigil'),
    rulerName: document.getElementById('label-ruler-name'),
    kingdomName: document.getElementById('label-kingdom-name'),
    personality: document.getElementById('label-personality'),
    turnNumber: document.getElementById('label-turn-number'),
    riskState: document.getElementById('label-risk-state')
  },
  card: {
    badge: document.getElementById('card-badge'),
    title: document.getElementById('card-title-text'),
    story: document.getElementById('card-story-text'),
    choices: document.getElementById('card-choices'),
    previewOverlay: document.getElementById('choice-consequence-preview'),
    previewText: document.getElementById('preview-text'),
    previewStatTags: document.getElementById('preview-stat-tags'),
    notification: document.getElementById('choice-notification'),
    narrativeFeedback: document.getElementById('choice-narrative-feedback'),
    bannerDeltas: document.getElementById('choice-banner-deltas')
  },
  drawers: {
    diplomacy: document.getElementById('drawer-diplomacy'),
    world: document.getElementById('drawer-world'),
    chronicle: document.getElementById('drawer-chronicle')
  },
  historyTimeline: document.getElementById('history-timeline-ledger'),
  pwa: {
    dialog: document.getElementById('pwa-install-dialog'),
    dismiss: document.getElementById('btn-pwa-dismiss'),
    install: document.getElementById('btn-pwa-install')
  },
  modal: {overlay: document.getElementById('kingdom-profile-modal'),
close: document.getElementById('modal-close'),
avatar: document.getElementById('modal-avatar'),
titleRuler: document.getElementById('modal-title-ruler'),
titleKingdom: document.getElementById('modal-title-kingdom'),
relationship: document.getElementById('modal-relationship-badge'),

economy: document.getElementById('modal-stat-economy'),
trust: document.getElementById('modal-stat-trust'),
war: document.getElementById('modal-stat-war'),
diplomacy: document.getElementById('modal-stat-diplomacy'),

btnAlliance: document.getElementById('btn-action-alliance'),
btnTrade: document.getElementById('btn-action-trade'),
btnSpy: document.getElementById('btn-action-spy'),

btnSabotage:
document.getElementById(
  'btn-action-sabotage'
),

btnWar:
document.getElementById(
  'btn-action-war'
)},
  notificationsContainer: document.getElementById('notifications-container')
};

// SVG templates for starting banner sigils
const SIGILS = {
  merchant: "👑",
  guard: "⚔️",
  embassy: "🕊️",
  monarch: "🔮"
};

// ==================== 4. ROUTER CONTROLLER ====================
function navigateTo(screenKey) {
  for (const key in DOM.screens) {
    if (key === screenKey) {
      DOM.screens[key].classList.add('active');
    } else {
      DOM.screens[key].classList.remove('active');
    }
  }
}

// ==================== 5. SAVE SYSTEM (LOCALSTORAGE) ====================
function saveGame() {
  localStorage.setItem('realmora_save', JSON.stringify(state));
  showToast("Reign progress securely saved in Royal Archives 💾");
  audioSynth.playChime();
}

function loadGame() {
  const raw = localStorage.getItem('realmora_save');
  if (raw) {
    try {
      state = JSON.parse(raw);
      // Ensure multiplayer property is initialized for backwards compatibility
      if (!state.multiplayer) {
        state.multiplayer = { allies: [], enemies: [] };
      }
      return true;
    } catch (e) {
      console.error("Save corrupted:", e);
      return false;
    }
  }
  return false;
}

function deleteSave() {
  localStorage.removeItem('realmora_save');
}

function showToast(message) {
  // Synthesize a quick text alert dynamically
  const toast = document.createElement('div');
  toast.className = 'glass-panel';
  toast.style.position = 'fixed';
  toast.style.top = '1rem';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.padding = '0.75rem 1.5rem';
  toast.style.zIndex = '9999';
  toast.style.border = '1px solid var(--color-gold)';
  toast.style.color = '#ffffff';
  toast.style.fontSize = '0.85rem';
  toast.style.boxShadow = 'var(--shadow-gold-glow)';
  toast.innerText = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transition = 'opacity 0.5s ease';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 2500);
}

// ==================== 6. THE GAMEPLAY SYSTEM ====================

// Initialize setup state
let selectedFocus = "merchant";
document.querySelectorAll('.focus-card').forEach(card => {
  card.addEventListener('click', (e) => {
    document.querySelectorAll('.focus-card').forEach(c => c.classList.remove('selected'));
    const target = e.currentTarget;
    target.classList.add('selected');
    selectedFocus = target.dataset.focus;
    audioSynth.playChime();
  });
});

// Confirm Claiming Throne
DOM.buttons.setupConfirm.addEventListener('click', () => {
  const rulerVal = DOM.inputs.rulerName.value.trim();
  const kingdomVal = DOM.inputs.kingdomName.value.trim();

  if (!rulerVal || !kingdomVal) {
    showToast("You must name your Ruler and Kingdom to claim the throne!");
    audioSynth.playStrike();
    return;
  }

  startNewGame(rulerVal, kingdomVal, selectedFocus);
});

DOM.buttons.setupBack.addEventListener('click', () => navigateTo('landing'));

// Launch new reign
function startNewGame(rulerName, kingdomName, focus) {
  state = JSON.parse(JSON.stringify(defaultState));
  state.player.rulerName = rulerName;
  state.player.kingdomName = kingdomName;
  state.player.focus = focus;
  state.stats =
applyClassBonus(
state.stats,
focus
);

  // Starting Focus Bonuses
  if (focus === "merchant") state.stats.economy = 65;
  if (focus === "guard") state.stats.war = 65;
  if (focus === "embassy") state.stats.diplomacy = 65;
  if (focus === "monarch") state.stats.trust = 65;

  state.activeCard = getRandomEvent(state, state.history);
  
  // Custom initial history item
  state.history.push({
    turn: 0,
    eventTitle: "The Coronation",
    choiceChosen: `Ruler ${rulerName} claimed the crown of ${kingdomName}!`,
    consequence: `House specialization focused on the ${focus.toUpperCase()} network.`
  });

  saveGame();
  audioSynth.playTriumph();

  // Create Kingdom document in Firebase Firestore
if (window.playerId) {
  createKingdom(window.playerId, {
    rulerName,
    kingdomName,
    focus,
    classType: focus,
    stats: state.stats,
    turn: state.turn,
    status: "alive"
  });
}
  
  navigateTo('gameplay');
  updateUI();
  drawActiveCard();
}

// Draw a decision card
function drawActiveCard() {
  // Check if a queued intervention applies
  const intervention = checkDiplomaticInterventions(state);
  if (intervention) {
    state.activeCard = intervention;
  } else {
    state.activeCard = getRandomEvent(state, state.history);
  }
  
  DOM.card.previewOverlay.classList.remove('active');
  DOM.card.notification.classList.remove('active');

  // Load state onto DOM
  DOM.card.title.innerText = state.activeCard.title;
  DOM.card.story.innerText = state.activeCard.story;
  DOM.card.badge.innerText = state.activeCard.theme ? state.activeCard.theme.toUpperCase() : "ROYAL DECREE";

  // Re-populate Choice Buttons
  DOM.card.choices.innerHTML = "";
  state.activeCard.choices.forEach((choice, index) => {
    // Check conditional requirements
    if (choice.requiredFlags) {
      const hasAll = choice.requiredFlags.every(f => state.flags.includes(f));
      if (!hasAll) return; // Skip rendering choices with missing unlocked flags
    }

    const btn = document.createElement('button');
    btn.className = "btn-choice";
    btn.innerText = choice.text;
    
    // Consequence Previews on hover
    btn.addEventListener('mouseenter', () => renderConsequencePreview(choice));
    btn.addEventListener('mouseleave', () => DOM.card.previewOverlay.classList.remove('active'));
    
    // Tap to apply Choice
    btn.addEventListener('click', () => {
      applyChoice(index, choice);
    });

    DOM.card.choices.appendChild(btn);
  });

  audioSynth.playChime();
}

// Visual Hover Feedback helper
function renderConsequencePreview(choice) {
  DOM.card.previewOverlay.classList.add('active');
  DOM.card.previewText.innerText = choice.consequence;
  DOM.card.previewStatTags.innerHTML = "";

  // Render stat delta tags
  const icons = { economy: "💰", trust: "🤝", war: "⚔️", diplomacy: "🕊️" };
  for (const stat in choice.effects) {
    const val = choice.effects[stat];
    if (val === 0) continue;
    
    const tag = document.createElement('span');
    tag.className = `stat-tag ${val > 0 ? 'positive' : 'negative'}`;
    tag.innerHTML = `${stat.toUpperCase()} ${val > 0 ? '+' : ''}${val} ${icons[stat]}`;
    DOM.card.previewStatTags.appendChild(tag);
  }
}

// Apply Choice and show elegant result modal prior to next turn
function applyChoice(choiceIndex, choice) {
  // Play sound response
  const containsNegative = Object.values(choice.effects).some(v => v < 0);
  if (containsNegative) {
    audioSynth.playStrike();
  } else {
    audioSynth.playChime();
  }

  // 1. Process standard stats with clamp limits
  for (const stat in choice.effects) {
    state.stats[stat] = Math.max(0, Math.min(10000, state.stats[stat] + choice.effects[stat]));
  }

  // 2. Process flags
  if (choice.flagsSet) {
    choice.flagsSet.forEach(flag => {
      if (!state.flags.includes(flag)) {
        state.flags.push(flag);
      }
    });
  }

  // 3. Evolve ruler personality score based on choice category
  if (choice.personality) {
    state.player.personalityScores[choice.personality] += 1;
    calculatePersonality();
  }

  // 4. Update NPC relationships
  const oldNPCs = JSON.parse(JSON.stringify(state.npcKingdoms));
  const { updatedNPCs, notifications } = updateNPCRelationships(
    state.npcKingdoms, 
    choice.npcEffects, 
    state.stats
  );
  state.npcKingdoms = updatedNPCs;

  // 5. Append this selection to chronology history ledger
  state.history.push({
    turn: state.turn,
    eventId: state.activeCard.id,
    eventTitle: state.activeCard.title,
    choiceChosen: choice.text,
    consequence: choice.consequence
  });

  // 6. Draw dynamic consequence details inside fullscreen overlay
  DOM.card.narrativeFeedback.innerText = choice.consequence;
  DOM.card.bannerDeltas.innerHTML = "";

  const icons = { economy: "💰", trust: "🤝", war: "⚔️", diplomacy: "🕊️" };
  for (const stat in choice.effects) {
    const val = choice.effects[stat];
    if (val === 0) continue;
    const item = document.createElement('div');
    item.className = `banner-delta-item ${val > 0 ? 'text-gold' : 'text-muted'}`;
    item.style.color = val > 0 ? "var(--color-success)" : "var(--color-danger)";
    item.innerText = `${stat.toUpperCase()} ${val > 0 ? '+' : ''}${val} ${icons[stat]}`;
    DOM.card.bannerDeltas.appendChild(item);
  }

  // Add NPC notification details to popup list
  notifications.forEach(n => {
    const item = document.createElement('div');
    item.className = "banner-delta-item";
    item.style.color = n.value > 0 ? "var(--color-info)" : "var(--color-warning)";
    item.style.fontSize = "0.75rem";
    item.innerText = n.text;
    DOM.card.bannerDeltas.appendChild(item);
  });

  // Show choice modal popup overlay
  DOM.card.notification.classList.add('active');

  // Single listener on overlay background to close and trigger next turn safely
  DOM.card.notification.onclick = () => {
    DOM.card.notification.classList.remove('active');
    DOM.card.notification.onclick = null;
    advanceTurn();
  };
}

// Complete the current turn and verify endings
function advanceTurn() {
  state.turn += 1;

  // Every 10 turns trigger global event
if (state.turn % 10 === 0) {
  triggerWorldEvent();
}

// Every 15 turns start world vote
if (state.turn % 15 === 0) {
  createPoliticsVote();
}
  state.survivedTurns = state.turn - 1;

  // Dynamic Risk System updates
  calculateRiskLevel();

  // Check critical stats or maximum win turn limit
  const isGameOver = checkEndgameConditions();
  if (isGameOver) return;

  // Save current turn state
  saveGame();

  // Sync turn and stats to Firebase Firestore in real-time
  if (window.playerId) {
    updateKingdom(window.playerId, {
      turn: state.turn,
      stats: state.stats,
      status: "alive"
    });
  }

  // Re-update screen view metrics
  updateUI();

  // Draw next card
  drawActiveCard();
}

function calculateRiskLevel() {
  const lowStatsCount = Object.values(state.stats).filter(v => v < 20).length;
  if (lowStatsCount === 0) state.riskLevel = "Low";
  else if (lowStatsCount === 1) state.riskLevel = "Medium";
  else if (lowStatsCount === 2) state.riskLevel = "High";
  else state.riskLevel = "Extreme";
}

function calculatePersonality() {
  const scores = state.player.personalityScores;
  let maxPersonality = "Balanced Monarch";
  let maxScore = 0;

  const mapping = {
    compassionate: "Compassionate Leader 💜",
    conqueror: "Ruthless Conqueror ⚔️",
    diplomat: "Wise Diplomat 👑",
    manipulator: "Manipulative Strategist 🕶️",
    opportunist: "Opportunistic Ruler 🔥"
  };

  for (const key in scores) {
    if (scores[key] > maxScore) {
      maxScore = scores[key];
      maxPersonality = mapping[key];
    } else if (scores[key] === maxScore && maxScore > 0) {
      // Tie breaker sets standard Balanced Monarch
      maxPersonality = "Balanced Monarch 🌱";
    }
  }

  state.player.personality = maxPersonality;
}

// Render dynamic data across gameplay screens
function updateUI() {
  // Update stats bar figures and animations
  const MAX_STAT = 10000;

for (const stat in state.stats) {

  const val = state.stats[stat];

  DOM.stats[`${stat}Text`].innerText =
    val.toLocaleString();

  // Convert stat into %
  const percent =
    Math.min(
      (val / MAX_STAT) * 100,
      100
    );

  DOM.stats[
    `${stat}Fill`
  ].style.width =
    `${percent}%`;

  // Crisis logic
  const widget =
    document.getElementById(
      `widget-${stat}`
    );

  if (val < 20) {
    widget.classList.add(
      'crisis'
    );
  } else {
    widget.classList.remove(
      'crisis'
    );
  }
}

  // Header and Profile labels
  DOM.profile.rulerName.innerText = state.player.rulerName;
  DOM.profile.kingdomName.innerText = state.player.kingdomName;
  DOM.profile.personality.innerText = state.player.personality;
  DOM.profile.turnNumber.innerText = state.turn;
  DOM.profile.riskState.innerText = state.riskLevel;

  // Set avatar sigil matching selected specialty
  DOM.profile.avatar.innerText = SIGILS[state.player.focus] || "👑";

  // Render dynamic CSS class to the risk text widget
  DOM.profile.riskState.className = `risk-val ${state.riskLevel.toLowerCase()}`;

  // Update NPC Kingdoms alliances
  for (const key in state.npcKingdoms) {
    const score = state.npcKingdoms[key].relationship;
    const bar = document.getElementById(`bar-${key}`);
    const status = document.getElementById(`status-${key}`);
    const crestBox = document.getElementById(`crest-${key}`);

    if (bar && status) {
      bar.style.width = `${score}%`;
      const statusObj = getDiplomacyStatus(score);
      status.innerText = statusObj.text;
      status.style.color = statusObj.color;
      
      // Inject customizable gold crest SVG vectors
      if (crestBox) {
        crestBox.innerHTML = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${npcKingdomsData[key].crestSvg}</svg>`;
      }
    }
  }

  // Build mobile diplomacy list grid
  DOM.drawers.diplomacy.innerHTML = "";
  const mobileWrap = document.createElement('div');
  mobileWrap.style.display = "flex";
  mobileWrap.style.gap = "0.5rem";
  mobileWrap.style.overflowX = "auto";
  mobileWrap.style.paddingBottom = "0.5rem";

  for (const key in state.npcKingdoms) {
    const score = state.npcKingdoms[key].relationship;
    const nData = npcKingdomsData[key];
    const statusObj = getDiplomacyStatus(score);
    
    const card = document.createElement('div');
    card.className = "glass-panel";
    card.style.padding = "0.6rem";
    card.style.minWidth = window.innerWidth <= 768 ? "min(160px, 76vw)" : "160px";
    card.style.flex = "0 0 auto";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "4px";

    card.innerHTML = `
      <div style="display:flex; align-items:center; gap:6px;">
        <div style="width:24px; height:24px; border-radius:3px; background:rgba(0,0,0,0.3); border:0.5px solid rgba(255,255,255,0.1); padding:2px;">
          <svg viewBox="0 0 100 100" style="width:100%; height:100%;">${nData.crestSvg}</svg>
        </div>
        <span style="font-size:0.75rem; font-weight:700; color:#fff;">${nData.name}</span>
      </div>
      <div style="width:100%; height:3px; background:rgba(0,0,0,0.5); border-radius:1.5px; overflow:hidden; margin-top:2px;">
        <div style="height:100%; width:${score}%; background:var(--color-gold); transition:width 0.4s ease;"></div>
      </div>
      <span style="font-size:0.6rem; font-weight:700; color:${statusObj.color};">${statusObj.text}</span>
    `;
    mobileWrap.appendChild(card);
  }
  DOM.drawers.diplomacy.appendChild(mobileWrap);

  // Render Timeline Chronicles Ledger
  DOM.historyTimeline.innerHTML = "";
  if (state.history.length === 0) {
    DOM.historyTimeline.innerHTML = `<p class="text-muted" style="font-size:0.8rem; text-align:center; padding:1rem 0;">No entries in your history ledger yet.</p>`;
  } else {
    // Reverse historical order to render latest choice first
    const reversed = [...state.history].reverse();
    reversed.forEach(h => {
      const div = document.createElement('div');
      div.className = "history-item";
      div.innerHTML = `
        <div class="history-item-header">
          <span>Turn ${h.turn} • ${h.eventTitle || 'Decision'}</span>
        </div>
        <div class="history-item-choice">${h.choiceChosen}</div>
        <div class="history-item-consequence">${h.consequence}</div>
      `;
      DOM.historyTimeline.appendChild(div);
    });
  }

  const newAchievements =
checkAchievements(
state
);

newAchievements
.forEach(
(id)=>{

if(
!state
.achievements
.includes(id)
){

state
.achievements
.push(id);

const found =
achievements
.find(
a=>a.id===id
);

if(found){

showFullScreenAlert(
"🏅 Achievement Unlocked!",
`
${found.name}

${found.description}
`,
false
);

audioSynth
.playTriumph();

}

}
});

renderAchievements();
}

// ==================== 7. MULTI-ENDING ENDGAME MANAGER ====================
function checkEndgameConditions() {
  // 1. Defeat Game Over conditions (Stat hits 0)
  if (state.stats.economy <= 0) {
    triggerEndgame("bankruptcy");
    return true;
  }
  if (state.stats.trust <= 0) {
    triggerEndgame("rebellion");
    return true;
  }
  if (state.stats.war <= 0) {
    triggerEndgame("war_defeat");
    return true;
  }
  if (state.stats.diplomacy <= 0) {
    triggerEndgame("isolation_collapse");
    return true;
  }

  // 2. Win Game Over conditions (Survive 100 turns)
  if (state.turn >= 100) {
    // Check specific ending branches based on achievements
    if (state.player.personality.includes("Compassionate") || state.stats.trust >= 80) {
      triggerEndgame("golden_age");
    } else if (state.player.personality.includes("Conqueror") || state.stats.war >= 80) {
      triggerEndgame("tyrant_empire");
    } else if (state.player.personality.includes("Diplomat") || state.stats.diplomacy >= 80) {
      triggerEndgame("diplomatic_empire");
    } else if (state.player.personality.includes("Manipulator") || state.stats.economy >= 80) {
      triggerEndgame("economic_empire");
    } else {
      triggerEndgame("legacy_balanced");
    }
    return true;
  }

  return false;
}

function triggerEndgame(endingType) {
  state.gameOver = true;
  deleteSave();

  // Update Firebase for death/victory
  if (window.playerId) {
    updateKingdom(window.playerId, {
      status: `collapsed (${endingType})`,
      online: false
    });
  }

  // Select narrative flavor matching ending type
  const endings = {
    bankruptcy: {
      title: "The Treasury Collapse 💰",
      crest: "💸",
      narrative: `Having driven ${state.player.kingdomName} into severe bankruptcy, your silver vaults lay completely empty. The Gilded Syndicate foreclosed on your mines and castle, while your guards deserted because they were unpaid. You were locked away in debtor's jail, leaving your country in total financial ruins.`
    },
    rebellion: {
      title: "The Crimson Revolution 🤝",
      crest: "🔥",
      narrative: `Citizens' trust reached absolute zero. Furious at your heavy hand and lack of tithing relief, a furious crowd of thousands stormed the palace. The iron guard laid down their shields, refusing to fire on families. You were deposed and exiled, and a free republic was declared.`
    },
    war_defeat: {
      title: "The Iron Annexation ⚔️",
      crest: "☠️",
      narrative: `Your military readiness collapsed completely. Spotting your total lack of garrison guard forces, the armored legions of the Iron Vanguard marched across your border keepers unopposed. The castle was burned, and ${state.player.kingdomName} became a simple mineral province of their growing empire.`
    },
    isolation_collapse: {
      title: "The Diplomatic Embargo 🕊️",
      crest: "🛡️",
      narrative: `Your international diplomacy fell to zero. Neighboring empires signed an absolute global blockade embargo against your realm. No imports of food or iron entered, and all ports were blocked. Your merchant navy rotted in harbor, and the crown collapsed slowly from within.`
    },
    golden_age: {
      title: "The Golden Age of Peace 💜",
      crest: "👑",
      narrative: `Hailed as a legend of mercy, you survived 100 turns! Through your compassionate leader policies and Sylvan Conclave eternal alliances, ${state.player.kingdomName} entered a legendary Golden Age. Crop blights vanished, schools and public works flourished, and your legacy remains engraved in gold.`
    },
    tyrant_empire: {
      title: "The Empire of Iron Fear ⚔️",
      crest: "🐉",
      narrative: `Having survived 100 turns as a Ruthless Conqueror, you unified the provinces under a tight grip of steel. Neighboring kingdoms pay you silent tribute out of terror. You built the border walls high, creating a flawless military dictatorship where order reigns absolute through fear.`
    },
    diplomatic_empire: {
      title: "The Celestial Union 🕊️",
      crest: "⚖️",
      narrative: `As a Wise Diplomat, you successfully survived 100 turns. By managing continuous complex treaties and marriages, you established the Grand Global Arbitration Senate. Rulers from all lands travel to your court in ${state.player.kingdomName} to settle border disputes.`
    },
    economic_empire: {
      title: "The Silver Hegemony 💰",
      crest: "💎",
      narrative: `Governing as a Manipulative Strategist, you survived 100 turns. Your silver vaults are so massive that your coin guilds dictate the trade tariffs of the entire globe. You quietly purchased neighboring lands outright without firing a single arrow, ruling as the shadow master of coin.`
    },
    legacy_balanced: {
      title: "The Legend of the Throne 🌱",
      crest: "🏛️",
      narrative: `Balancing your stats perfectly, you ruled ${state.player.kingdomName} for 100 turns. By maintaining a dynamic strategy of compromise, you avoided structural collapses, keeping the borders protected and silver vaults stable. History remembers you as a highly stable, wise ruler.`
    }
  };

  const end = endings[endingType] || endings.bankruptcy;
  
  DOM.card.notification.classList.remove('active');
  navigateTo('endgame');

  // Load DOM elements
  document.getElementById('ending-icon-badge').innerText = end.crest;
  document.getElementById('ending-title').innerText = end.title;
  document.getElementById('ending-narrative-text').innerText = end.narrative;
  document.getElementById('ending-val-turns').innerText = state.survivedTurns;
  document.getElementById('ending-val-personality').innerText = state.player.personality;
  
  // Count active positive alliances
  let treatyCount = 0;
  for (const k in state.npcKingdoms) {
    if (state.npcKingdoms[k].relationship >= 80) treatyCount++;
  }
  document.getElementById('ending-val-treaties').innerText = treatyCount;

  // Sound cue
  if (endingType.includes("empire") || endingType === "golden_age" || endingType === "legacy_balanced") {
    audioSynth.playTriumph();
  } else {
    audioSynth.playStrike();
  }
}

// Show chronology timeline directly from endings screen
DOM.buttons.endingLedger.addEventListener('click', () => {
  navigateTo('gameplay');
  DOM.buttons.tabChronicle.click();
});

DOM.buttons.endingNew.addEventListener('click', () => {
  navigateTo('setup');
  DOM.inputs.rulerName.value = "";
  DOM.inputs.kingdomName.value = "";
});

DOM.buttons.gameRestart.addEventListener('click', () => {
  if (confirm("Are you sure you want to abdicate the throne? This will erase your current reign progress!")) {
    deleteSave();
    audioSynth.playStrike();
    navigateTo('landing');
    DOM.buttons.playContinue.style.display = "none";
  }
});

DOM.buttons.gameSave.addEventListener('click', () => saveGame());

// ==================== 8. DRAWER METRICS & SOUND INTERACTIVE TOGGLES ====================
DOM.buttons.tabDiplomacy
.addEventListener(
'click',
()=>setActiveTab(
'diplomacy'
)
);

DOM.buttons.tabWorld
.addEventListener(
'click',
()=>setActiveTab(
'world'
)
);

DOM.buttons.tabChronicle
.addEventListener(
'click',
()=>setActiveTab(
'chronicle'
)
);

DOM.buttons.soundToggle.addEventListener('click', () => {
  const isPlaying = audioSynth.toggle();
  DOM.buttons.soundToggle.innerText = isPlaying ? "🔊" : "🔇";
});

// ==================== 9. INITIAL LOAD ROUTER ====================
window.addEventListener('DOMContentLoaded', () => {
  // Check if save exists to display continue button
  const hasSave = loadGame();
  if (hasSave && state.player.rulerName) {
    DOM.buttons.playContinue.style.display = "flex";
  }

  // Hook play button
  DOM.buttons.playNew.addEventListener('click', () => {
    deleteSave(); // clear any pre-existing run
    navigateTo('setup');
    audioSynth.playChime();
  });

  DOM.buttons.playContinue.addEventListener('click', () => {
    navigateTo('gameplay');
    updateUI();
    drawActiveCard();
    showToast("Welcome back to your Throne Room, Sovereign 👑");

    if (window.playerId) {
      setPlayerOnline(window.playerId, true);
      updateKingdom(window.playerId, {
        online: true,
        stats: state.stats,
        turn: state.turn,
        status: "alive"
      });
    }
  });

  // Initialize Profile Modal Events
  initProfileModalEvents();

  const createBtn =
document.getElementById(
  "btn-create-alliance"
);

if (createBtn) {

  createBtn.addEventListener(
    "click",
    async () => {

      const name =
        prompt(
          "Enter alliance name:"
        );

      if (!name) return;

      const result =
        await createAlliance(
          name,
          window.playerId,
          state.player
            .rulerName
        );

      if (result.success) {
        showToast(
          "👑 Empire created!"
        );
      } else {
        showToast(
          result.error
        );
      }
    }
  );
}
});

// ==================== 10. PWA SERVICE WORKER & PROMPT HANDLING ====================
let deferredInstallPrompt = null;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Realmora service worker successfully registered!', reg.scope))
      .catch(err => console.warn('Service worker registration failed:', err));
  });
}

// Listen for PWA installation prompt
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent browser's default prompt
  event.preventDefault();
  // Cache install event
  deferredInstallPrompt = event;
  
  // Show custom gold install card
  DOM.pwa.dialog.style.display = "block";
});

DOM.pwa.dismiss.addEventListener('click', () => {
  DOM.pwa.dialog.style.display = "none";
});

DOM.pwa.install.addEventListener('click', async () => {
  DOM.pwa.dialog.style.display = "none";
  if (deferredInstallPrompt) {
    // Show prompt
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    console.log(`User PWA installation response: ${choice.outcome}`);
    deferredInstallPrompt = null;
  }
});

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js");

      console.log("✅ Service Worker Registered");
      console.log(registration);

    } catch (error) {
      console.error("❌ Service Worker Error:", error);
    }
  });
}

let activeTargetPlayer = null;

function renderRealPlayers(kingdoms, myId) {
  const desktopContainer = document.getElementById("real-players-list");
  const mobileContainer = document.getElementById("real-players-list-mobile");

  if (desktopContainer) desktopContainer.innerHTML = "";
  if (mobileContainer) mobileContainer.innerHTML = "";

  const otherPlayers = kingdoms.filter(k => k.playerId !== myId);

  if (otherPlayers.length === 0) {
    const placeholder = "<p class='text-muted' style='font-size: 0.8rem; padding: 0.5rem 0;'>No other rulers online...</p>";
    if (desktopContainer) desktopContainer.innerHTML = placeholder;
    if (mobileContainer) mobileContainer.innerHTML = placeholder;
    return;
  }

  otherPlayers.forEach(player => {
    const isOnline = player.online;
    const onlineIndicator = isOnline 
      ? '<span style="color:#2ecc71; font-weight:600;">🟢 Online</span>' 
      : '<span style="color:#7f8c8d; font-weight:500;">⚫ Offline</span>';
    
    // 1. Render to Desktop List
    if (desktopContainer) {
      const card = document.createElement("div");
      card.className = "npc-item";
      card.style.flexDirection = "column";
      card.style.alignItems = "stretch";
      card.style.gap = "6px";
      card.style.padding = "0.75rem";

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:700; color:#fff; font-size:0.82rem;">👑 ${player.rulerName}</span>
          <span style="font-size:0.65rem;">${onlineIndicator}</span>
        </div>
        <div style="font-size:0.75rem; color:var(--color-text-muted);">
          🏰 Kingdom: <strong style="color:var(--color-gold-pale); font-family:var(--font-royal);">${player.kingdomName}</strong>
        </div>
        ⚜️ Class:
<strong>
${player.classType
|| "Kingdom"}
</strong>
        <div style="
display:flex;
justify-content:space-between;
align-items:center;
font-size:0.7rem;
margin-top:2px;
">

  <span>
    Turn:
    <strong>
      ${player.turn || 1}
    </strong>
  </span>

  <span>
    🗺️ Land:
    <strong>
      ${player.territories || 1}
    </strong>
  </span>

</div>

<div style="
margin-top:4px;
font-size:0.65rem;
color:var(--color-success);
font-weight:600;
text-transform:uppercase;
">

  ⚔️ ${player.status || 'Alive'}

</div>
        <button class="btn-royal-outline btn-view-player" style="font-size:0.75rem; padding:0.4rem; margin-top:4px; width:100%; text-align:center;">View Kingdom</button>
      `;
      
      card.querySelector(".btn-view-player").addEventListener("click", () => openPlayerProfile(player));
      desktopContainer.appendChild(card);
    }

    // 2. Render to Mobile Horizontal Scroll Drawer
    if (mobileContainer) {
      const card = document.createElement("div");
      card.className = "glass-panel";
      card.style.padding = "0.75rem";
      card.style.minWidth = window.innerWidth <= 768 ? "min(180px, 82vw)" : "180px";
      card.style.flex = "0 0 auto";
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.gap = "4px";

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.78rem; font-weight:700; color:#fff;">👑 ${player.rulerName}</span>
          <span style="font-size:0.55rem;">${onlineIndicator}</span>
        </div>
        <span style="font-size:0.7rem; color:var(--color-text-muted);">🏰 ${player.kingdomName}</span>
        <div style="
display:flex;
justify-content:space-between;
align-items:center;
font-size:0.65rem;
margin-top:2px;
">

  <span>
    Turn:
    <strong>
      ${player.turn || 1}
    </strong>
  </span>

  <span>
    🗺️
    <strong>
      ${player.territories || 1}
    </strong>
  </span>

</div>

<div style="
font-size:0.6rem;
color:var(--color-success);
font-weight:600;
margin-top:3px;
">

  ⚔️ ${player.status || 'Alive'}

</div>
        <button class="btn-royal-outline btn-view-player-mobile" style="font-size:0.7rem; padding:0.35rem; margin-top:4px; width:100%; text-align:center;">View Kingdom</button>
      `;

      card.querySelector(".btn-view-player-mobile").addEventListener("click", () => openPlayerProfile(player));
      mobileContainer.appendChild(card);
    }
  });
}

function openPlayerProfile(player) {
  activeTargetPlayer = player;
  const modal = DOM.modal;

  if (!modal.overlay) return;

  modal.titleRuler.innerText = player.rulerName;
  modal.titleKingdom.innerText = player.kingdomName;
  modal.titleKingdom.innerText =
`
${player.kingdomName}

🏛️ Capital:
${player.capital
|| "Unknown"}

🗺️ Regions:
${(
player
.ownedRegions
|| []
).join(", ")}
`;

  // Render dynamic relationship badge
  const rel = getPlayerRelationship(player.playerId);
  modal.relationship.innerText = rel.text;
  modal.relationship.style.color = rel.color;

  // Reveal stats if they are our Allies
  const isAllied = state.multiplayer.allies.includes(player.playerId);
  if (isAllied) {
    modal.economy.innerText = player.stats?.economy ?? 50;
    modal.trust.innerText = player.stats?.trust ?? 50;
    modal.war.innerText = player.stats?.war ?? 50;
    modal.diplomacy.innerText = player.stats?.diplomacy ?? 50;
    modal.economy.style.color = "var(--color-success)";
    modal.trust.style.color = "var(--color-success)";
    modal.war.style.color = "var(--color-success)";
    modal.diplomacy.style.color = "var(--color-success)";
  } else {
    // Stats remain hidden behind fog of war until spying or alliance
    modal.economy.innerText = "??";
    modal.trust.innerText = "??";
    modal.war.innerText = "??";
    modal.diplomacy.innerText = "??";
    modal.economy.style.color = "var(--color-text-muted)";
    modal.trust.style.color = "var(--color-text-muted)";
    modal.war.style.color = "var(--color-text-muted)";
    modal.diplomacy.style.color = "var(--color-text-muted)";
  }

  modal.overlay.style.display = "flex";
  audioSynth.playChime();
}

function getPlayerRelationship(otherPlayerId) {
  if (!state.multiplayer) {
    state.multiplayer = { allies: [], enemies: [] };
  }
  if (state.multiplayer.allies.includes(otherPlayerId)) {
    return { text: "Allies 🤝", color: "var(--color-success)" };
  }
  if (state.multiplayer.enemies.includes(otherPlayerId)) {
    return { text: "At War ⚔️", color: "var(--color-danger)" };
  }
  return { text: "Neutral ⚖️", color: "var(--color-text-muted)" };
}

function initProfileModalEvents() {
  const modal = DOM.modal;

  if (modal.close) {
    modal.close.addEventListener('click', () => {
      modal.overlay.style.display = "none";
      audioSynth.playChime();
    });
  }

  if (modal.overlay) {
    modal.overlay.addEventListener('click', (e) => {
      if (e.target === modal.overlay) {
        modal.overlay.style.display = "none";
        audioSynth.playChime();
      }
    });
  }

  if (modal.btnAlliance) {
    modal.btnAlliance.addEventListener('click', async () => {
      if (!activeTargetPlayer) return;
      const targetId = activeTargetPlayer.playerId;

      if (state.multiplayer.allies.includes(targetId)) {
        showToast("🤝 Already allied with this ruler!");
        audioSynth.playStrike();
        return;
      }

      if (state.multiplayer.enemies.includes(targetId)) {
        showToast("⚔️ Cannot ally while at war!");
        audioSynth.playStrike();
        return;
      }

      const success = await sendInteraction(
        "alliance",
        window.playerId,
        state.player.rulerName,
        state.player.kingdomName,
        targetId
      );

      if (success) {
        showToast(`📨 Alliance request sent to Ruler ${activeTargetPlayer.rulerName}!`);
        audioSynth.playChime();
        modal.overlay.style.display = "none";
      }
    });
  }

  if (modal.btnTrade) {
    modal.btnTrade.addEventListener('click', async () => {
      if (!activeTargetPlayer) return;
      const targetId = activeTargetPlayer.playerId;

      // 60 seconds Trade Cooldown
      const lastTrade = localStorage.getItem('trade_cooldown_' + targetId) || 0;
      const elapsed = Date.now() - lastTrade;
      if (elapsed < 60000) {
        const remaining = Math.round((60000 - elapsed) / 1000);
        showToast(`⏳ Cooldown active for another ${remaining} seconds.`);
        audioSynth.playStrike();
        return;
      }

      const success = await sendInteraction(
        "trade",
        window.playerId,
        state.player.rulerName,
        state.player.kingdomName,
        targetId
      );

      if (success) {
        localStorage.setItem('trade_cooldown_' + targetId, Date.now());
        showToast(`💰 Trade caravans dispatched to ${activeTargetPlayer.kingdomName}!`);
        audioSynth.playChime();
        modal.overlay.style.display = "none";
      }
    });
  }

  if (modal.btnSpy) {
    modal.btnSpy.addEventListener('click', () => {
      if (!activeTargetPlayer) return;
      const targetId = activeTargetPlayer.playerId;

      modal.overlay.style.display = "none";
      showToast("🕵️ Operative sneaking through shadows...");
      audioSynth.playStrike();

      setTimeout(async () => {
        const success = Math.random() >= 0.3; // 70% success, 30% failure
        
        if (!success) {
          // Failed! Notify target
          await sendInteraction(
            "spy_caught",
            window.playerId,
            state.player.rulerName,
            state.player.kingdomName,
            targetId
          );

          // Deduct 10 trust from player locally
          state.stats.trust = Math.max(0, state.stats.trust - 10);
          saveGame();
          if (window.playerId) {
            updateKingdom(window.playerId, { stats: state.stats });
          }
          updateUI();

          showFullScreenAlert(
            "🕵️ Spy Discovered!",
            `Our secret agent was caught and beheaded in ${activeTargetPlayer.kingdomName}! The political scandal cost us -10 Citizens' Trust.`,
            true
          );
        } else {
          // Successful! Display Stats Report popup
          showSpySuccessReport(activeTargetPlayer);
        }
      }, 1500);
    });
  }

  if (modal.btnWar) {
    modal.btnWar.addEventListener('click', async () => {
      if (!activeTargetPlayer) return;
      const targetId = activeTargetPlayer.playerId;

      if (state.multiplayer.enemies.includes(targetId)) {
        showToast("⚔️ Already at war with this ruler!");
        audioSynth.playStrike();
        return;
      }

      if (!confirm(`Are you absolutely sure you want to declare WAR against Ruler ${activeTargetPlayer.rulerName}? All alliances will collapse.`)) {
        return;
      }

      // Update state
      state.multiplayer.allies = state.multiplayer.allies.filter(id => id !== targetId);
      state.multiplayer.enemies.push(targetId);
      saveGame();

      if (window.playerId) {
        updateKingdom(window.playerId, {
          "diplomacy.allies": state.multiplayer.allies,
          "diplomacy.enemies": state.multiplayer.enemies
        });
      }
      updateUI();

      // Dispatch War declaration document
      await sendInteraction(
        "war",
        window.playerId,
        state.player.rulerName,
        state.player.kingdomName,
        targetId
      );

      const result =
await resolveWar(
  window.playerId,
  targetId
);

if (result) {

showFullScreenAlert(
"⚔️ WAR RESULTS",
`
🏆 Winner:
${result.winner}

⚔️ Battle Report

${result.attacker}
Power:
${result.attackerScore}

${result.defender}
Power:
${result.defenderScore}

🗺️ Territory Captured!

${capturedRegion}
`,
true
);

}
      modal.overlay.style.display = "none";
    });
  }

  if (modal.btnSabotage) {

modal.btnSabotage
.addEventListener(
'click',
async () => {

if (
!activeTargetPlayer
) return;

const result =
await sabotageKingdom(
window.playerId,
activeTargetPlayer.playerId
);

if (
!result.success
) {

showFullScreenAlert(
"🕵️ Mission Failed!",
`
Our agents were captured
while infiltrating
${activeTargetPlayer.kingdomName}.

⚠️ War tensions rise.
`,
true
);

return;
}

showFullScreenAlert(
"🔥 Sabotage Success!",
`
We successfully damaged
${result.target}'s

${result.damagedStat.toUpperCase()}

by -15
`,
true
);

modal.overlay
.style.display =
"none";

});
}
}

function showFullScreenAlert(title, message, isCritical) {
  if (isCritical) {
    audioSynth.playStrike();
  } else {
    audioSynth.playChime();
  }

  const alertBox = document.createElement("div");
  alertBox.className = "modal-overlay";
  alertBox.innerHTML = `
    <div class="modal-content glass-panel" style="text-align:center;">
      <h3 class="font-royal" style="font-size:1.5rem; margin-bottom:1rem; color:${isCritical ? 'var(--color-danger)' : 'var(--color-gold)'};">${title}</h3>
      <p style="font-size:0.95rem; line-height:1.5; color:#fff; margin-bottom:1.5rem;">${message}</p>
      <button class="btn-royal btn-close-alert" style="width:100%;">Acknowledge Sovereign 👑</button>
    </div>
  `;

  document.body.appendChild(alertBox);
  alertBox.querySelector(".btn-close-alert").addEventListener("click", () => {
    alertBox.remove();
    audioSynth.playChime();
  });
}

function showSpySuccessReport(player) {
  audioSynth.playTriumph();

  const report = document.createElement("div");
  report.className = "modal-overlay";
  report.innerHTML = `
    <div class="modal-content glass-panel" style="text-align:center; max-width:380px;">
      <h3 class="font-royal text-gold" style="font-size:1.5rem; margin-bottom:0.5rem;">🕵️ Spy Dossier</h3>
      <span class="text-muted" style="font-size:0.8rem; text-transform:uppercase; letter-spacing:1px; color:#2ecc71;">Bypassed Outposts</span>
      
      <p style="font-size:0.88rem; margin:1rem 0; color:#fff; line-height:1.4;">
        Infiltration of <strong style="color:var(--color-gold-pale);">${player.kingdomName}</strong> succeeded! Here are their raw parameters:
      </p>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:1.2rem;">
        <div class="modal-stat-box" style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); padding:0.5rem; border-radius:6px; display:flex; flex-direction:column; gap:2px;">
          <span>💰</span>
          <span style="font-size:0.6rem; color:var(--color-text-muted); text-transform:uppercase;">Economy</span>
          <span style="font-size:1.1rem; font-weight:700; color:#2ecc71;">${player.stats?.economy ?? 50}</span>
        </div>
        <div class="modal-stat-box" style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); padding:0.5rem; border-radius:6px; display:flex; flex-direction:column; gap:2px;">
          <span>🤝</span>
          <span style="font-size:0.6rem; color:var(--color-text-muted); text-transform:uppercase;">Trust</span>
          <span style="font-size:1.1rem; font-weight:700; color:#2ecc71;">${player.stats?.trust ?? 50}</span>
        </div>
        <div class="modal-stat-box" style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); padding:0.5rem; border-radius:6px; display:flex; flex-direction:column; gap:2px;">
          <span>⚔️</span>
          <span style="font-size:0.6rem; color:var(--color-text-muted); text-transform:uppercase;">War</span>
          <span style="font-size:1.1rem; font-weight:700; color:#2ecc71;">${player.stats?.war ?? 50}</span>
        </div>
        <div class="modal-stat-box" style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); padding:0.5rem; border-radius:6px; display:flex; flex-direction:column; gap:2px;">
          <span>🕊️</span>
          <span style="font-size:0.6rem; color:var(--color-text-muted); text-transform:uppercase;">Diplomacy</span>
          <span style="font-size:1.1rem; font-weight:700; color:#2ecc71;">${player.stats?.diplomacy ?? 50}</span>
        </div>
      </div>
      
      <div style="font-size:0.78rem; color:var(--color-text-muted); margin-bottom:1.5rem;">
        Turn Progress: <strong>${player.turn || 1}</strong> • Status: <strong style="color:#2ecc71;">${player.status || 'Alive'}</strong>
      </div>
      
      <button class="btn-royal btn-close-spy" style="width:100%;">Burn Dossier 📜</button>
    </div>
  `;

  document.body.appendChild(report);
  report.querySelector(".btn-close-spy").addEventListener("click", () => {
    report.remove();
    audioSynth.playChime();
  });
}

let activeNotificationCards = new Map();

function handleInteractionsUpdate(interactions, direction) {
  const container = document.getElementById("notifications-container");
  if (!container) return;

  if (direction === "incoming") {
    interactions.forEach(inter => {
      if (inter.status === "pending") {
        if (!activeNotificationCards.has(inter.id)) {
          createNotificationCard(inter);
        }
      }

      // Handle caught spy notification
      if (inter.type === "spy_caught" && inter.status === "pending") {
        respondToInteraction(inter.id, "acknowledged");
        
        // Increase trust slightly (+5 trust)
        state.stats.trust = Math.min(100, state.stats.trust + 5);
        saveGame();
        if (window.playerId) {
          updateKingdom(window.playerId, { stats: state.stats });
        }
        updateUI();

        createNotificationCard({
          ...inter,
          id: inter.id + "_spy_alert",
          type: "spy_alert"
        });
      }

      // Handle War alert
      if (inter.type === "war" && inter.status === "pending") {
        respondToInteraction(inter.id, "acknowledged");

        // Sever alliances if existed
        state.multiplayer.allies = state.multiplayer.allies.filter(id => id !== inter.senderId);
        // Add to enemies
        if (!state.multiplayer.enemies.includes(inter.senderId)) {
          state.multiplayer.enemies.push(inter.senderId);
        }
        saveGame();

        if (window.playerId) {
          updateKingdom(window.playerId, {
            "diplomacy.allies": state.multiplayer.allies,
            "diplomacy.enemies": state.multiplayer.enemies
          });
        }
        updateUI();

        createNotificationCard({
          ...inter,
          id: inter.id + "_war_alert",
          type: "war_alert"
        });
      }
    });
  } else if (direction === "outgoing") {
    interactions.forEach(inter => {
      // Receiver accepted request
      if (inter.status === "accepted") {
        if (!activeNotificationCards.has(inter.id + "_accepted")) {
          activeNotificationCards.set(inter.id + "_accepted", true);

          if (inter.type === "alliance") {
            if (!state.multiplayer.allies.includes(inter.receiverId)) {
              state.multiplayer.allies.push(inter.receiverId);
              state.stats.diplomacy = Math.min(100, state.stats.diplomacy + 10);
              saveGame();
              if (window.playerId) {
                updateKingdom(window.playerId, {
                  "diplomacy.allies": state.multiplayer.allies,
                  stats: state.stats
                });
              }
              updateUI();
            }
          } else if (inter.type === "trade") {
            state.stats.economy = Math.min(100, state.stats.economy + 10);
            saveGame();
            if (window.playerId) {
              updateKingdom(window.playerId, { stats: state.stats });
            }
            updateUI();
          }

          createNotificationCard({
            ...inter,
            id: inter.id + "_accepted_alert",
            type: `${inter.type}_accepted`
          });

          // Clean up database document
          deleteInteraction(inter.id);
        }
      }

      // Receiver rejected request
      if (inter.status === "rejected") {
        if (!activeNotificationCards.has(inter.id + "_rejected")) {
          activeNotificationCards.set(inter.id + "_rejected", true);

          createNotificationCard({
            ...inter,
            id: inter.id + "_rejected_alert",
            type: `${inter.type}_rejected`
          });

          // Clean up
          deleteInteraction(inter.id);
        }
      }
    });
  }
}

function createNotificationCard(inter) {
  const container = document.getElementById("notifications-container");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "notification-card";
  card.dataset.id = inter.id;

  let title = "📨 Royal Courier";
  let msg = "A courier message has arrived from another kingdom.";
  let hasActions = false;

  if (inter.type === "alliance") {
    title = "📨 Alliance Offer";
    msg = `Ruler <strong>${inter.senderRuler}</strong> of <strong>${inter.senderKingdom}</strong> is requesting a royal alliance. Both realms will gain +10 Diplomacy.`;
    hasActions = true;
  } else if (inter.type === "trade") {
    title = "💰 Trade Proposal";
    msg = `Ruler <strong>${inter.senderRuler}</strong> of <strong>${inter.senderKingdom}</strong> is proposing a trade caravans deal. Both realms will gain +10 Economy.`;
    hasActions = true;
  } else if (inter.type === "spy_alert") {
    title = "🕵️ Alert: Spy Captured!";
    msg = `A shadow spy from the kingdom of <strong>${inter.senderKingdom}</strong> was captured by our palace guard. Robust defense measures have boosted Citizens' Trust (+5 Trust).`;
  } else if (inter.type === "war_alert") {
    title = "⚔️ EMERGENCY: WAR DECLARED!";
    msg = `Ruler <strong>${inter.senderRuler}</strong> of the kingdom of <strong>${inter.senderKingdom}</strong> has formally declared war on us! All alliances are void.`;
    audioSynth.playStrike();
  } else if (inter.type === "alliance_accepted") {
    title = "🤝 Alliance Sealed!";
    msg = `Ruler <strong>${inter.senderRuler || "the target"}</strong> accepted our alliance request! +10 Diplomacy.`;
    audioSynth.playTriumph();
  } else if (inter.type === "trade_accepted") {
    title = "💰 Trade Deal Sealed!";
    msg = `Ruler <strong>${inter.senderRuler || "the target"}</strong> accepted our trade caravan! +10 Economy.`;
    audioSynth.playTriumph();
  } else if (inter.type === "alliance_rejected") {
    title = "❌ Alliance Declined";
    msg = `Our alliance request was declined by Ruler <strong>${inter.senderRuler || "the target"}</strong>.`;
  } else if (inter.type === "trade_rejected") {
    title = "❌ Trade Deal Declined";
    msg = `Our trade caravans deal proposal was declined by Ruler <strong>${inter.senderRuler || "the target"}</strong>.`;
  }

  card.innerHTML = `
    <div class="notification-title" style="font-family:var(--font-royal); font-size:0.85rem; color:var(--color-gold); font-weight:700; letter-spacing:0.5px;">${title}</div>
    <div class="notification-message" style="font-size:0.8rem; color:var(--color-text-light); line-height:1.4;">${msg}</div>
    <div class="notification-actions" style="display:flex; gap:8px; justify-content:flex-end; margin-top:4px;"></div>
  `;

  const actionsArea = card.querySelector(".notification-actions");

  if (hasActions) {
    const btnAccept = document.createElement("button");
    btnAccept.className = "notification-btn accept";
    btnAccept.innerText = "Accept";
    btnAccept.style.cssText = "font-size:0.72rem; font-weight:600; padding:0.4rem 0.8rem; border-radius:4px; border:none; cursor:pointer; background:linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dark) 100%); color:var(--color-bg-base); font-weight:700;";
    btnAccept.addEventListener("click", async () => {
      await respondToInteraction(inter.id, "accepted");
      
      if (inter.type === "alliance") {
        if (!state.multiplayer.allies.includes(inter.senderId)) {
          state.multiplayer.allies.push(inter.senderId);
          state.stats.diplomacy = Math.min(100, state.stats.diplomacy + 10);
          saveGame();
          if (window.playerId) {
            updateKingdom(window.playerId, {
              "diplomacy.allies": state.multiplayer.allies,
              stats: state.stats
            });
          }
          updateUI();
        }
      } else if (inter.type === "trade") {
        state.stats.economy = Math.min(100, state.stats.economy + 10);
        saveGame();
        if (window.playerId) {
          updateKingdom(window.playerId, { stats: state.stats });
        }
        updateUI();
      }

      dismissCard(card);
    });

    const btnReject = document.createElement("button");
    btnReject.className = "notification-btn reject";
    btnReject.innerText = "Reject";
    btnReject.style.cssText = "font-size:0.72rem; font-weight:600; padding:0.4rem 0.8rem; border-radius:4px; border:none; cursor:pointer; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:var(--color-text-muted);";
    btnReject.addEventListener("click", async () => {
      await respondToInteraction(inter.id, "rejected");
      dismissCard(card);
    });

    actionsArea.appendChild(btnReject);
    actionsArea.appendChild(btnAccept);
  } else {
    const btnDismiss = document.createElement("button");
    btnDismiss.className = "notification-btn reject";
    btnDismiss.innerText = "Dismiss";
    btnDismiss.style.cssText = "font-size:0.72rem; font-weight:600; padding:0.4rem 0.8rem; border-radius:4px; border:none; cursor:pointer; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:var(--color-text-muted);";
    btnDismiss.addEventListener("click", () => {
      dismissCard(card);
    });
    actionsArea.appendChild(btnDismiss);

    // Auto-dismiss passive alerts after 10 seconds
    setTimeout(() => {
      if (card.parentNode) {
        dismissCard(card);
      }
    }, 10000);
  }

  activeNotificationCards.set(inter.id, card);
  container.appendChild(card);
}

function dismissCard(card) {
  card.classList.add("dismissing");
  card.addEventListener("animationend", () => {
    card.remove();
    activeNotificationCards.delete(card.dataset.id);
  });
}

function setActiveTab(tabKey) {
  const tabs = {
    diplomacy: {
      btn: DOM.buttons.tabDiplomacy,
      drawer: DOM.drawers.diplomacy
    },
    world: {
      btn: DOM.buttons.tabWorld,
      drawer: DOM.drawers.world
    },
    chronicle: {
      btn: DOM.buttons.tabChronicle,
      drawer: DOM.drawers.chronicle
    }
  };

  for (const key in tabs) {
    if (key === tabKey) {
      tabs[key].btn.classList.add('active');
      tabs[key].drawer.classList.add('active');
    } else {
      tabs[key].btn.classList.remove('active');
      tabs[key].drawer.classList.remove('active');
    }
  }

  audioSynth.playChime();
}

window.addEventListener("beforeunload", () => {
  if (window.playerId) {
    setPlayerOnline(window.playerId, false);
  }
});

function applyWorldEvent(event) {
  // Prevent same event repeating
  if (state.lastWorldEvent === event.timestamp) return;

  state.lastWorldEvent = event.timestamp;

  // Apply effects
  for (const stat in event.effects) {
    if (state.stats[stat] !== undefined) {
      state.stats[stat] = Math.max(
        0,
        Math.min(100,
          state.stats[stat] + event.effects[stat]
        )
      );
    }
  }

  saveGame();

  if (window.playerId) {
    updateKingdom(window.playerId, {
      stats: state.stats
    });
  }

  updateUI();

  // Show cinematic popup
  showFullScreenAlert(
    event.title,
    `${event.description}

World Effects:
${Object.entries(event.effects)
  .map(([k, v]) =>
    `${k.toUpperCase()} ${v > 0 ? "+" : ""}${v}`
  )
  .join(" • ")}`,
    true
  );

  console.log("🌍 Applied World Event");
}

function showVotePopup(vote) {
  if (!vote) return;

  if (
    state.lastVoteId === vote.createdAt
  ) return;

  state.lastVoteId = vote.createdAt;

  const modal = document.createElement("div");
  modal.className = "modal-overlay";

  modal.innerHTML = `
    <div class="modal-content glass-panel" style="text-align:center; max-width:420px;">

      <h2 class="font-royal text-gold">
        🗳️ WORLD DECISION
      </h2>

      <p style="margin:1rem 0; color:#fff;">
        ${vote.question}
      </p>

      <div style="display:flex; gap:10px;">

        <button
          class="btn-royal btn-vote-yes"
          style="flex:1;"
        >
          YES ⚔️
        </button>

        <button
          class="btn-royal-outline btn-vote-no"
          style="flex:1;"
        >
          NO 🕊️
        </button>

      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".btn-vote-yes")
    .addEventListener("click", async () => {

      await castVote(
        window.playerId,
        "yes"
      );

      modal.remove();

      showToast("🗳️ Vote submitted!");
    });

  modal.querySelector(".btn-vote-no")
    .addEventListener("click", async () => {

      await castVote(
        window.playerId,
        "no"
      );

      modal.remove();

      showToast("🗳️ Vote submitted!");
    });
}

function renderAlliances(
  alliances
) {
  const container =
    document.getElementById(
      "alliances-list"
    );

  if (!container) return;

  container.innerHTML = "";

  alliances.forEach(
    alliance => {

      const card =
        document.createElement(
          "div"
        );

      card.className =
        "glass-panel";

      card.style.padding =
        "0.8rem";

      card.style.marginBottom =
        "0.6rem";

      card.innerHTML = `
        <h4 class="text-gold">
          👑 ${alliance.name}
        </h4>

        <div style="
          font-size:0.8rem;
          color:#aaa;
          margin:0.4rem 0;
        ">
          Members:
          ${alliance.members.length}
        </div>

        <div style="
          display:flex;
          flex-wrap:wrap;
          gap:6px;
        ">
          ${alliance.members
            .map(
              m =>
                `<span>
                  ${m.name}
                </span>`
            )
            .join("")}
        </div>

        <button
          class="btn-royal-outline join-btn"
          style="
            width:100%;
            margin-top:0.6rem;
          "
        >
          Join Alliance
        </button>
      `;

      card
      .querySelector(
        ".join-btn"
      )
      .addEventListener(
        "click",
        async () => {

          await joinAlliance(
            alliance.id,
            window.playerId,
            state.player
              .rulerName
          );

          showToast(
            `🤝 Joined ${alliance.name}`
          );
        }
      );

      container.appendChild(
        card
      );
    });
}

function renderWorldVotes(
  votes
) {

  const container =
    document.getElementById(
      "world-votes-list"
    );

  if (!container) return;

  container.innerHTML = "";

  votes.forEach(
    (vote) => {

    const card =
      document.createElement(
        "div"
      );

    card.className =
      "glass-panel";

    card.style.padding =
      "0.75rem";

    card.style.marginBottom =
      "0.5rem";

    card.innerHTML = `
      <div style="
      font-weight:700;
      color:#fff;
      margin-bottom:0.4rem;
      ">

        🌍 ${vote.title}

      </div>

      <div style="
      font-size:0.78rem;
      color:#aaa;
      margin-bottom:0.7rem;
      ">

        ${vote.description}

      </div>

      <div style="
      display:flex;
      justify-content:
      space-between;
      margin-bottom:0.5rem;
      ">

        <span>
        ✅ Yes:
        ${vote.yesVotes}
        </span>

        <span>
        ❌ No:
        ${vote.noVotes}
        </span>

      </div>

      <div style="
      display:flex;
      gap:8px;
      ">

        <button
        class="btn-royal btn-vote-yes"
        style="flex:1;">

          YES

        </button>

        <button
        class="btn-royal-outline btn-vote-no"
        style="flex:1;">

          NO

        </button>

      </div>
    `;

    card
    .querySelector(
      ".btn-vote-yes"
    )
    .addEventListener(
      "click",
      () => {

      voteOnIssue(
        vote.id,
        window.playerId,
        "yes"
      );

    });

    card
    .querySelector(
      ".btn-vote-no"
    )
    .addEventListener(
      "click",
      () => {

      voteOnIssue(
        vote.id,
        window.playerId,
        "no"
      );

    });

    container
    .appendChild(
      card
    );
  });
}

function renderLeaderboard(
kingdoms
) {

const container =
document.getElementById(
"leaderboard-list"
);

if (!container) return;

container.innerHTML = "";

// ranking formula
const sorted =
[...kingdoms]
.sort(
(a,b)=>{

const scoreA =
(a.territories || 1)
* 30
+
(a.stats?.war || 50)
+
(a.stats?.economy || 50);

const scoreB =
(b.territories || 1)
* 30
+
(b.stats?.war || 50)
+
(b.stats?.economy || 50);

return scoreB
- scoreA;
});

sorted
.slice(0,10)
.forEach(
(player,index)=>{

const card =
document.createElement(
"div"
);

card.className =
"glass-panel";

card.style.padding =
"0.65rem";

card.style.marginBottom =
"0.5rem";

let crown = "";

if(index===0)
crown="👑";

if(index===1)
crown="🥈";

if(index===2)
crown="🥉";

card.innerHTML =
`
<div style="
display:flex;
justify-content:
space-between;
align-items:center;
">

<div>

<div style="
font-weight:700;
color:#fff;
font-size:0.8rem;
">

${crown}
#${index+1}
${player.rulerName}

</div>

<div style="
font-size:0.7rem;
color:#aaa;
">

🏰
${player.kingdomName}

</div>

</div>

<div style="
text-align:right;
font-size:0.68rem;
">

🗺️
${player.territories || 1}

<br>

⚔️
${player.stats?.war || 50}

</div>

</div>
`;
container
.appendChild(card);

});
}

function
renderAchievements(){

const container =
document.getElementById(
"achievements-list"
);

if(!container)
return;

container.innerHTML="";

if(
!state
.achievements
.length
){

container.innerHTML=
`
<p class=
"text-muted">

No achievements yet.

</p>
`;

return;
}

state
.achievements
.forEach(
(id)=>{

const found=
achievements
.find(
a=>a.id===id
);

if(!found)
return;

const card=
document
.createElement(
"div"
);

card.className=
"glass-panel";

card.style.padding=
"0.6rem";

card.style.marginBottom=
"0.4rem";

card.innerHTML=
`
<div style="
font-weight:700;
color:#fff;
">

${found.name}

</div>

<div style="
font-size:0.72rem;
color:#aaa;
">

${found.description}

</div>
`;

container
.appendChild(
card
);

});
}