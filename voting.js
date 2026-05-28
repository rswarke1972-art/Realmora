// voting.js

import {
  db,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot
} from "./firebase.js";

// ==========================
// WORLD VOTES POOL
// ==========================
export const WORLD_VOTES = [
  {
    id: "magic_ban",
    question: "Should magic be banned?",

    yesEffects: {
      war: 10,
      diplomacy: -10
    },

    noEffects: {
      diplomacy: 10,
      trust: 5
    }
  },

  {
    id: "raise_taxes",
    question: "Should kingdoms raise taxes?",

    yesEffects: {
      economy: 15,
      trust: -10
    },

    noEffects: {
      trust: 10
    }
  },

  {
    id: "global_army",
    question: "Create a united world army?",

    yesEffects: {
      war: 10,
      diplomacy: 10
    },

    noEffects: {
      economy: 5
    }
  }
];

// ==========================
// START GLOBAL VOTE
// ==========================
export async function createWorldVote() {
  try {
    const randomVote =
      WORLD_VOTES[
        Math.floor(Math.random() * WORLD_VOTES.length)
      ];

    const voteRef = doc(db, "world", "currentVote");

    await setDoc(voteRef, {
      ...randomVote,

      yesVotes: 0,
      noVotes: 0,

      voters: [],

      createdAt: Date.now(),

      expiresAt:
        Date.now() + 1000 * 60 * 5 // 5 minutes
    });

    console.log("🗳️ World Vote Started");

  } catch (error) {
    console.error(error);
  }
}

// ==========================
// WATCH VOTE
// ==========================
export function watchWorldVote(callback) {
  const voteRef = doc(db, "world", "currentVote");

  return onSnapshot(voteRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    }
  });
}

// ==========================
// CAST VOTE
// ==========================
export async function castVote(playerId, voteChoice) {
  try {
    const voteRef = doc(db, "world", "currentVote");

    const voteSnap = await getDoc(voteRef);

    if (!voteSnap.exists()) return;

    const data = voteSnap.data();

    if (data.voters.includes(playerId)) {
      console.log("Already voted");
      return;
    }

    const updates = {
      voters: [...data.voters, playerId]
    };

    if (voteChoice === "yes") {
      updates.yesVotes = data.yesVotes + 1;
    } else {
      updates.noVotes = data.noVotes + 1;
    }

    await updateDoc(voteRef, updates);

    console.log("✅ Vote Cast");

  } catch (error) {
    console.error(error);
  }
}