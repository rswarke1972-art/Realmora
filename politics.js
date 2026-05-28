// politics.js

import {
  db,
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  increment
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

  const voteRef =
    doc(
      db,
      "world_votes",
      voteId
    );

  await updateDoc(
    voteRef,
    {
      [voteType === "yes"
        ? "yesVotes"
        : "noVotes"]:
      increment(1),

      voters:
      increment(0)
    }
  );
}