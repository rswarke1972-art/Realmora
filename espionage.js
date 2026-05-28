// espionage.js

import {
  db,
  doc,
  getDoc,
  updateDoc
} from "./firebase.js";

// ==========================
// SABOTAGE
// ==========================
export async function sabotageKingdom(
  attackerId,
  targetId
) {

  const successChance =
    Math.random();

  const attackerRef =
    doc(
      db,
      "kingdoms",
      attackerId
    );

  const targetRef =
    doc(
      db,
      "kingdoms",
      targetId
    );

  const attackerSnap =
    await getDoc(
      attackerRef
    );

  const targetSnap =
    await getDoc(
      targetRef
    );

  if (
    !attackerSnap.exists() ||
    !targetSnap.exists()
  ) {
    return null;
  }

  const attacker =
    attackerSnap.data();

  const target =
    targetSnap.data();

  // 70% success
  const success =
    successChance > 0.30;

  if (!success) {

    return {
      success: false,
      caught: true,
      attacker:
        attacker.rulerName,
      target:
        target.rulerName
    };
  }

  const targetStats =
    {
      ...target.stats
    };

  // random sabotage
  const sabotageTypes = [
    "economy",
    "trust",
    "war",
    "diplomacy"
  ];

  const selected =
    sabotageTypes[
      Math.floor(
        Math.random()
        * sabotageTypes.length
      )
    ];

  targetStats[selected] =
    Math.max(
      0,
      (targetStats[selected] || 50)
      - 15
    );

  await updateDoc(
    targetRef,
    {
      stats:
      targetStats
    }
  );

  return {
    success: true,
    target:
      target.rulerName,
    damagedStat:
      selected
  };
}