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

    const capturedRegion =
getRandomRegion(
winner.ownedRegions
|| []
);

    // Territory gain
const winnerTerritories =
  (winner.territories || 1)
  + 1;

const loserTerritories =
  Math.max(
    1,
    (loser.territories || 1)
    - 1
  );

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
doc(
db,
"kingdoms",
winnerId
),
{
stats:
winnerStats,

territories:
winnerTerritories,

landPower:
winnerTerritories,

ownedRegions: [

...(winner
.ownedRegions
|| []),

capturedRegion

]
}
);
  await updateDoc(
  doc(
    db,
    "kingdoms",
    loserId
  ),
  {
    stats:
      loserStats,

    territories:
      loserTerritories,

    landPower:
      loserTerritories,

      ownedRegions:
(loser
.ownedRegions
|| [])
.slice(0,-1)
  }
);

  return {
    attacker:
      attacker.rulerName,

    defender:
      defender.rulerName,

    winner:
      winner.rulerName,

    loser:
      loser.rulerName,

    attackerScore:
      Math.round(
        attackerScore
      ),

    defenderScore:
      Math.round(
        defenderScore
      )
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

  return (
    military +
    economy +
    diplomacy +
    trust +
    randomLuck
  );
}