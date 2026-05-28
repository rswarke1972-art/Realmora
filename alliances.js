// alliances.js

import {
  db,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot
} from "./firebase.js";

// ==========================
// CREATE ALLIANCE
// ==========================
export async function createAlliance(
  allianceName,
  leaderId,
  leaderName
) {
  try {
    const allianceId =
      allianceName
        .toLowerCase()
        .replace(/\s+/g, "_");

    const allianceRef =
      doc(db, "alliances", allianceId);

    const existing =
      await getDoc(allianceRef);

    if (existing.exists()) {
      return {
        success: false,
        error:
          "Alliance name already exists."
      };
    }

    await setDoc(allianceRef, {
      id: allianceId,
      name: allianceName,

      leaderId,
      leaderName,

      members: [
        {
          id: leaderId,
          name: leaderName,
          role: "Leader"
        }
      ],

      createdAt: Date.now(),

      diplomacyBonus: 10,
      warBonus: 10
    });

    return { success: true };

  } catch (error) {
    console.error(error);
  }
}

// ==========================
// WATCH ALL ALLIANCES
// ==========================
export function watchAlliances(
  callback
) {
  const alliancesRef =
    collection(db, "alliances");

  return onSnapshot(
    alliancesRef,
    (snapshot) => {

      const alliances = [];

      snapshot.forEach((doc) => {
        alliances.push(doc.data());
      });

      callback(alliances);
    }
  );
}

// ==========================
// JOIN ALLIANCE
// ==========================
export async function joinAlliance(
  allianceId,
  playerId,
  playerName
) {
  try {
    const allianceRef =
      doc(
        db,
        "alliances",
        allianceId
      );

    const snapshot =
      await getDoc(allianceRef);

    if (!snapshot.exists()) return;

    const data =
      snapshot.data();

    const alreadyMember =
      data.members.some(
        m => m.id === playerId
      );

    if (alreadyMember) return;

    await updateDoc(
      allianceRef,
      {
        members: [
          ...data.members,
          {
            id: playerId,
            name: playerName,
            role: "Member"
          }
        ]
      }
    );

  } catch (error) {
    console.error(error);
  }
}