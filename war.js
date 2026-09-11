// war.js

import {
  db,
  doc,
  getDoc,
  updateDoc
} from "./firebase.js";

import {
getRandomRegion
}
from "./regions.js";

// ======================
// WAR FORMULA
// ======================
export async function resolveWar(
  attackerId,
  defenderId
) {

  const attackerRef =
    doc(
      db,
      "kingdoms",
      attackerId
    );

  const defenderRef =
    doc(
      db,
      "kingdoms",
      defenderId
    );

  const attackerSnap =
    await getDoc(
      attackerRef
    );

  const defenderSnap =
    await getDoc(
      defenderRef
    );

  if (
    !attackerSnap.exists() ||
    !defenderSnap.exists()
  ) {
    return null;
  }

  const attacker =
    attackerSnap.data();

  const defender =
    defenderSnap.data();

  // ======================
  // FORMULA
  // ======================

  const aStats =
    attacker.stats || {};

  const dStats =
    defender.stats || {};

  const attackerScore =
    calculateWarPower(
      attacker
    );

  const defenderScore =
    calculateWarPower(
      defender
    );

  const attackerWon =
    attackerScore >
    defenderScore;

  const winner =
    attackerWon
      ? attacker
      : defender;

  const loser =
    attackerWon
      ? defender
      : attacker;

  const winnerId =
    attackerWon
      ? attackerId
      : defenderId;

  const loserId =
    attackerWon
      ? defenderId
      : attackerId;

  // ======================
  // APPLY CONSEQUENCES
  // ======================

  const winnerStats =
    {
      ...winner.stats
    };

  const loserStats =
    {
      ...loser.stats
    };

  const loserCanLose = (loser.ownedRegions && loser.ownedRegions.length > 1);
  let capturedRegion = null;
  let winnerTerritories = winner.territories || 1;
  let loserTerritories = loser.territories || 1;
  let newLoserRegions = loser.ownedRegions || ["Starting Province"];

  if (loserCanLose) {
    capturedRegion = newLoserRegions[newLoserRegions.length - 1];
    newLoserRegions = newLoserRegions.slice(0, -1);
    winnerTerritories += 1;
    loserTerritories -= 1;
  } else {
    // Defender only has 1 region left (capital). Attacker conquers a new unclaimed region instead.
    capturedRegion = getRandomRegion(winner.ownedRegions || []);
    winnerTerritories += 1;
  }

  winnerStats.economy =
    Math.min(
      100,
      (winnerStats.economy || 50)
      + 15
    );

  winnerStats.trust =
    Math.min(
      100,
      (winnerStats.trust || 50)
      + 5
    );

  loserStats.economy =
    Math.max(
      0,
      (loserStats.economy || 50)
      - 20
    );

  loserStats.trust =
    Math.max(
      0,
      (loserStats.trust || 50)
      - 15
    );

  await updateDoc(
    doc(db, "kingdoms", winnerId),
    {
      stats: winnerStats,
      territories: winnerTerritories,
      landPower: winnerTerritories,
      ownedRegions: [
        ...(winner.ownedRegions || []),
        capturedRegion
      ]
    }
  );

  await updateDoc(
    doc(db, "kingdoms", loserId),
    {
      stats: loserStats,
      territories: loserTerritories,
      landPower: loserTerritories,
      ownedRegions: newLoserRegions
    }
  );

  return {
    attacker: attacker.rulerName,
    defender: defender.rulerName,
    winner: winner.rulerName,
    loser: loser.rulerName,
    attackerScore: Math.round(attackerScore),
    defenderScore: Math.round(defenderScore),
    capturedRegion: capturedRegion
  };
}

// ======================
// POWER CALCULATION
// ======================
function calculateWarPower(
  kingdom
) {

  const stats =
    kingdom.stats || {};

  const military =
    (stats.war || 50)
    * 0.40;

  const economy =
    (stats.economy || 50)
    * 0.20;

  const diplomacy =
    (stats.diplomacy || 50)
    * 0.15;

  const trust =
    (stats.trust || 50)
    * 0.15;

  const randomLuck =
    Math.random() * 10;

  let total =
    military +
    economy +
    diplomacy +
    trust +
    randomLuck;

  // Class Passive: Military Dominion gets +10% war power
  if (kingdom.focus === "military") {
    total *= 1.10;
  }

  return total;
}