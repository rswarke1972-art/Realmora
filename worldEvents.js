// worldEvents.js

import {
  db,
  doc,
  setDoc,
  getDoc,
  onSnapshot
} from "./firebase.js";

// ==========================
// GLOBAL WORLD EVENTS LIST
// ==========================
export const WORLD_EVENTS = [
  {
    id: "volcano",
    title: "🌋 Volcano Eruption",
    description:
      "The northern mountains exploded in fire. Trade roads are destroyed.",

    effects: {
      economy: -10,
      war: 5
    }
  },

  {
    id: "plague",
    title: "☠️ Plague Outbreak",
    description:
      "A mysterious plague spreads through villages.",

    effects: {
      trust: -15,
      economy: -5
    }
  },

  {
    id: "gold_rush",
    title: "💰 Golden Trade Route",
    description:
      "Merchants discovered a legendary trade passage.",

    effects: {
      economy: 15,
      diplomacy: 5
    }
  },

  {
    id: "era_of_peace",
    title: "🕊️ Era of Peace",
    description:
      "Kingdoms across the world sign peace treaties.",

    effects: {
      diplomacy: 15,
      trust: 10
    }
  },

  {
    id: "barbarian_invasion",
    title: "⚔️ Barbarian Invasion",
    description:
      "Barbarian tribes attack border settlements.",

    effects: {
      war: 10,
      trust: -5
    }
  }
];

// ==========================
// CREATE GLOBAL EVENT
// ==========================
export async function triggerWorldEvent() {
  try {
    const randomEvent =
      WORLD_EVENTS[Math.floor(Math.random() * WORLD_EVENTS.length)];

    const eventRef = doc(db, "world", "currentEvent");

    await setDoc(eventRef, {
      ...randomEvent,
      timestamp: Date.now()
    });

    console.log("🌍 World Event Triggered:", randomEvent.title);

  } catch (error) {
    console.error(error);
  }
}

// ==========================
// WATCH GLOBAL EVENT
// ==========================
export function watchWorldEvents(callback) {
  const eventRef = doc(db, "world", "currentEvent");

  return onSnapshot(eventRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    }
  });
}