// Realmora 👑 - NPC Diplomacy Engine
// Simulates multiplayer interactions by managing relationships with 4 dynamic foreign kingdoms.

export const npcKingdomsData = {
  ironVanguard: {
    name: "Iron Vanguard ⚔️",
    desc: "Militaristic empire governed by a steel-hearted high command. They respect brute force and high war capabilities, but detest weakness.",
    type: "Militaristic",
    relationship: 50,
    crestColor: "#8f3434",
    crestSvg: `<path d="M20,10 L80,10 L80,30 L50,90 L20,30 Z" fill="#2a1b1b" stroke="#ffd700" stroke-width="2"/><path d="M35,30 L65,30 L50,75 Z" fill="#8f3434"/><path d="M50,15 L50,45 M38,25 L62,25" stroke="#ffd700" stroke-width="2.5"/>`
  },
  gildedSyndicate: {
    name: "Gilded Syndicate 💰",
    desc: "A wealthy confederation of merchant barons and coin guilds. They value silver, trade alliances, and low tariffs above all.",
    type: "Mercantile",
    relationship: 50,
    crestColor: "#d4af37",
    crestSvg: `<path d="M50,10 C70,10 90,30 90,55 C90,80 50,90 50,90 C50,90 10,80 10,55 C10,30 30,10 50,10 Z" fill="#1b1a15" stroke="#ffd700" stroke-width="2"/><circle cx="50" cy="50" r="22" fill="#d4af37" opacity="0.8"/><text x="50" y="58" font-family="Cinzel" font-size="24" fill="#1b1a15" font-weight="bold" text-anchor="middle">$</text>`
  },
  sylvanConclave: {
    name: "Sylvan Conclave 🌲",
    desc: "An isolationist woodland alliance of druids and woodwardens. They cherish nature, trust, and absolute peace.",
    type: "Isolationist",
    relationship: 50,
    crestColor: "#2ecc71",
    crestSvg: `<path d="M50,10 L90,45 L70,85 L30,85 L10,45 Z" fill="#111f18" stroke="#ffd700" stroke-width="2"/><path d="M50,22 L75,68 L25,68 Z" fill="#27ae60"/><path d="M50,15 L50,78" stroke="#ffd700" stroke-width="1.5"/>`
  },
  celestiaHegemony: {
    name: "Celestia Hegemony 🕊️",
    desc: "A massive, powerful solar theocracy ruled by the Hierophant. They favor marriages, sun temples, and pious alignment.",
    type: "Theocratic",
    relationship: 50,
    crestColor: "#e67e22",
    crestSvg: `<path d="M50,10 C50,10 90,40 90,70 C90,85 70,90 50,90 C30,90 10,85 10,70 C10,40 50,10 50,10 Z" fill="#201811" stroke="#ffd700" stroke-width="2"/><circle cx="50" cy="53" r="20" fill="#f39c12"/><path d="M50,33 L50,73 M30,53 L70,53" stroke="#ffffff" stroke-width="3"/>`
  }
};

// Returns relationship status string based on value
export function getDiplomacyStatus(score) {
  if (score <= 15) return { text: "Hostile / Cold War ⚔️", color: "#e74c3c" };
  if (score <= 39) return { text: "Suspicious 🕶️", color: "#e67e22" };
  if (score <= 60) return { text: "Neutral ⚖️", color: "#bdc3c7" };
  if (score <= 84) return { text: "Friendly / Treaty 🤝", color: "#2ecc71" };
  return { text: "Eternal Alliance 👑", color: "#9b59b6" };
}

// Adjusts relationship levels dynamically based on player actions & general stats
export function updateNPCRelationships(currentNPCs, choiceNpcEffects, globalStats) {
  const updated = { ...currentNPCs };
  const notifications = [];

  for (const key in updated) {
    const oldScore = updated[key].relationship;
    let delta = 0;

    // 1. Direct adjustment from choice consequences
    if (choiceNpcEffects && choiceNpcEffects[key] !== undefined) {
      delta += choiceNpcEffects[key];
    }

    // 2. Passive stat alignments (AI personalities react to overall stats)
    if (key === "ironVanguard") {
      if (globalStats.war >= 75) delta += 1;   // Respect militarism
      if (globalStats.war <= 25) delta -= 1;   // Contemn weak armies
    } else if (key === "gildedSyndicate") {
      if (globalStats.economy >= 75) delta += 1; // Trust wealthy players
      if (globalStats.economy <= 25) delta -= 2; // Distrust bankrupt rulers
    } else if (key === "sylvanConclave") {
      if (globalStats.trust >= 75) delta += 2;   // Love honorable rulers
      if (globalStats.war >= 75) delta -= 1;     // Flee heavy armies
    } else if (key === "celestiaHegemony") {
      if (globalStats.diplomacy >= 75) delta += 1.5; // Appreciate diplomats
    }

    // Calculate new clamped score (0 to 100)
    const newScore = Math.max(0, Math.min(100, Math.round(oldScore + delta)));
    updated[key].relationship = newScore;

    // Generate notification if change was notable
    const difference = newScore - oldScore;
    if (Math.abs(difference) >= 4) {
      const direction = difference > 0 ? "improved" : "deteriorated";
      const arrow = difference > 0 ? "▲" : "▼";
      const statusText = getDiplomacyStatus(newScore).text;
      
      notifications.push({
        text: `${npcKingdomsData[key].name} relationship ${direction} (${arrow} ${difference > 0 ? "+" : ""}${difference}). Current: ${statusText}`,
        npcKey: key,
        value: difference
      });
    }
  }

  return { updatedNPCs: updated, notifications };
}

// Simulated dynamic "Interventions" from NPC kingdoms every X turns
// returns a custom pop-up card if triggered
export function checkDiplomaticInterventions(state) {
  // Trigger once in a while (e.g. turn 10, 20, 30, 40, etc.) to keep game interactive
  if (state.turn > 1 && state.turn % 10 === 0) {
    // Select the NPC with the most extreme relationship (highest or lowest)
    let selectedNpc = null;
    let extremeValue = 50;
    
    for (const key in state.npcKingdoms) {
      const score = state.npcKingdoms[key].relationship;
      if (Math.abs(score - 50) > Math.abs(extremeValue - 50)) {
        extremeValue = score;
        selectedNpc = key;
      }
    }

    if (!selectedNpc) {
      // Pick one randomly if all are close to 50
      const keys = Object.keys(state.npcKingdoms);
      selectedNpc = keys[Math.floor(Math.random() * keys.length)];
      extremeValue = state.npcKingdoms[selectedNpc].relationship;
    }

    const name = npcKingdomsData[selectedNpc].name;

    // Case 1: Extremely Hostile
    if (extremeValue <= 20) {
      return {
        id: `npc_threat_${selectedNpc}`,
        title: `CRISIS: ${name} Threat!`,
        story: `${name} has formally sent a high commander to your throne room. Angered by your actions, they declare you a threat to global peace and demand a diplomatic fine of 25 Economy to avert immediate war.`,
        theme: "war",
        category: "npc_intervention",
        choices: [
          {
            text: "Pay the fine (Prevent a war) [ -25 Economy ]",
            consequence: "You pacify their legions with direct gold payouts.",
            effects: { economy: -25, trust: 5, war: 0, diplomacy: 15 },
            npcEffects: { [selectedNpc]: 25 },
            personality: "diplomat"
          },
          {
            text: "Refuse and kick them out! [ +15 War, -20 Trust ]",
            consequence: "Their legions mobilize. Border tension climbs to catastrophic levels.",
            effects: { economy: 5, trust: -20, war: 25, diplomacy: -20 },
            npcEffects: { [selectedNpc]: -15 },
            personality: "conqueror"
          }
        ]
      };
    }

    // Case 2: Extremely Friendly
    if (extremeValue >= 80) {
      return {
        id: `npc_alliance_${selectedNpc}`,
        title: `TREATY: ${name} Alliance`,
        story: `${name} celebrates our eternal friendship! Their sovereign has sent custom chests filled with rare resources and offers a formal military mutual-aid pact to secure our crowns.`,
        theme: "diplomacy",
        category: "npc_intervention",
        choices: [
          {
            text: "Sign the Grand Alliance Pact! [ +20 Trust, +20 Diplomacy ]",
            consequence: "You sign the gilded papers. The realm celebrates our unbreakable covenant.",
            effects: { economy: 5, trust: 25, war: 10, diplomacy: 30 },
            npcEffects: { [selectedNpc]: 10 },
            personality: "compassionate"
          },
          {
            text: "Refuse politely (We stand alone) [ +10 Economy ]",
            consequence: "You accept their gifts but reject the formal binding papers to maintain absolute independence.",
            effects: { economy: 20, trust: -10, war: -5, diplomacy: -10 },
            npcEffects: { [selectedNpc]: -15 },
            personality: "balanced"
          }
        ]
      };
    }

    // Case 3: Standard intervention (Gilded Syndicate trade proposal or Sylvan request)
    if (selectedNpc === "gildedSyndicate") {
      return {
        id: "syndicate_joint_venture",
        title: "Syndicate Guild Deal",
        story: "The Gilded Syndicate proposes a rapid joint shipping venture. If we invest 15 Economy, they guarantee a 40 Economy return in 5 turns, or safe insurance if it fails.",
        theme: "economy",
        category: "npc_intervention",
        choices: [
          {
            text: "Invest in the Syndicate Deal [ -15 Economy ]",
            consequence: "You dispatch royal vessels loaded with gold. A risky but high-potential merchant gamble.",
            effects: { economy: -15, trust: 5, war: 0, diplomacy: 10 },
            npcEffects: { gildedSyndicate: 15 },
            personality: "opportunist",
            flagsSet: ["syndicate_deal_active"]
          },
          {
            text: "Decline and save our reserves",
            consequence: "You reject the gamble. The merchants depart, looking for other clients.",
            effects: { economy: 5, trust: 0, war: 0, diplomacy: 0 },
            personality: "balanced"
          }
        ]
      };
    }
  }

  return null;
}
