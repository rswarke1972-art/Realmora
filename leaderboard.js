// leaderboard.js

import {
  db,
  collection,
  onSnapshot
} from "./firebase.js";

// ==========================
// WATCH LEADERBOARD
// ==========================
export function watchLeaderboard(callback) {

  const kingdomsRef =
    collection(db, "kingdoms");

  return onSnapshot(
    kingdomsRef,
    (snapshot) => {

      const rankings = [];

      snapshot.forEach((doc) => {
        const data = doc.data();

        const stats =
          data.stats || {};

        // Power Score Formula
        const powerScore =
          (stats.economy || 0) * 0.25 +
          (stats.trust || 0) * 0.25 +
          (stats.war || 0) * 0.25 +
          (stats.diplomacy || 0) * 0.25 +
          (data.turn || 1) * 2;

        rankings.push({
          id: doc.id,
          rulerName:
            data.rulerName ||
            "Unknown",

          kingdomName:
            data.kingdomName ||
            "Unknown",

          score:
            Math.round(
              powerScore
            ),

          turn:
            data.turn || 1
        });
      });

      rankings.sort(
        (a, b) =>
          b.score - a.score
      );

      callback(rankings);
    }
  );
}