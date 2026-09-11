// politics.js

import {
  db,
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  increment,
  arrayUnion
} from "./firebase.js";

// ==========================
// CREATE GLOBAL VOTE
// ==========================
export async function createWorldVote(
  title,
  description,
  createdBy
) {

  try {

    await addDoc(
      collection(
        db,
        "world_votes"
      ),
      {

        title,
        description,

        yesVotes: 0,
        noVotes: 0,

        voters: [],

        createdBy,

        createdAt:
          Date.now(),

        active: true
      }
    );

    return true;

  } catch (error) {
    console.error(error);
    return false;
  }
}

// ==========================
// WATCH VOTES LIVE
// ==========================
export function watchWorldVotes(
  callback
) {

  return onSnapshot(
    collection(
      db,
      "world_votes"
    ),
    (snapshot) => {

      const votes = [];

      snapshot.forEach(
        (docItem) => {

        votes.push({
          id: docItem.id,
          ...docItem.data()
        });

      });

      callback(votes);
    }
  );
}

// ==========================
// CAST VOTE
// ==========================
export async function voteOnIssue(
  voteId,
  playerId,
  voteType
) {
  try {
    const voteRef = doc(db, "world_votes", voteId);
    const voteSnap = await getDoc(voteRef);

    if (!voteSnap.exists()) {
      return { success: false, error: "Vote issue does not exist." };
    }

    const data = voteSnap.data();
    if (data.voters && data.voters.includes(playerId)) {
      return { success: false, error: "Already voted" };
    }

    await updateDoc(
      voteRef,
      {
        [voteType === "yes" ? "yesVotes" : "noVotes"]: increment(1),
        voters: arrayUnion(playerId)
      }
    );
    return { success: true };
  } catch (error) {
    console.error("Error voting on issue:", error);
    return { success: false, error: error.message };
  }
}