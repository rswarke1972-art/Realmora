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

  // Class Passive: Spy Network gets 85% success rate, others get 70%
  const threshold = (attacker.focus === "spy") ? 0.15 : 0.30;
  const success =
    successChance > threshold;

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

  // Class Passive: Spy Network deals -20 damage, others deal -15
  const sabotageAmount = (attacker.focus === "spy") ? 20 : 15;

  targetStats[selected] =
    Math.max(
      0,
      (targetStats[selected] || 50)
      - sabotageAmount
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