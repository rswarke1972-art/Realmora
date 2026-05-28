// world.js

import {
  db,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  query,
  where,
  deleteDoc
} from "./firebase.js";

// ===============================
// CREATE PLAYER KINGDOM
// ===============================
export async function createKingdom(playerId, kingdomData) {
  try {
    const kingdomRef = doc(db, "kingdoms", playerId);

    await setDoc(kingdomRef, {
      playerId,
      rulerName: kingdomData.rulerName || "Unknown Ruler",
      kingdomName: kingdomData.kingdomName || "Unnamed Kingdom",

      stats: {
        economy: 50,
        trust: 50,
        war: 50,
        diplomacy: 50
      },

      focus: kingdomData.focus || "merchant",

      diplomacy: {
        allies: [],
        enemies: [],
        neutral: []
      },

      status: "alive",
      turn: 1,
      territories: 1,
landPower: 1,

capital:
`${kingdomData.kingdomName} Prime`,

ownedRegions: [
"Starting Province"
],
      createdAt: Date.now(),
      online: true
    });

    console.log("🏰 Kingdom Created");

  } catch (error) {
    console.error("❌ Create Kingdom Error:", error);
  }
}

// ===============================
// GET KINGDOM DATA
// ===============================
export async function getKingdom(playerId) {
  try {
    const kingdomRef = doc(db, "kingdoms", playerId);
    const snapshot = await getDoc(kingdomRef);

    if (snapshot.exists()) {
      return snapshot.data();
    }

    return null;

  } catch (error) {
    console.error("❌ Get Kingdom Error:", error);
  }
}

// ===============================
// UPDATE KINGDOM
// ===============================
export async function updateKingdom(playerId, updates) {
  try {
    const kingdomRef = doc(db, "kingdoms", playerId);

    await updateDoc(kingdomRef, updates);

    console.log("⚔️ Kingdom Updated");

  } catch (error) {
    console.error("❌ Update Kingdom Error:", error);
  }
}

// ===============================
// LIVE REAL-TIME WORLD SYNC
// ===============================
export function watchKingdom(playerId, callback) {
  const kingdomRef = doc(db, "kingdoms", playerId);

  return onSnapshot(kingdomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    }
  });
}

// ===============================
// GLOBAL WORLD LISTENER
// ===============================
export function watchWorld(callback) {
  const kingdomsRef = collection(db, "kingdoms");

  return onSnapshot(kingdomsRef, (snapshot) => {
    const kingdoms = [];

    snapshot.forEach((doc) => {
      kingdoms.push({
        id: doc.id,
        ...doc.data()
      });
    });

    callback(kingdoms);
  });
}

export async function setPlayerOnline(playerId, isOnline) {
  try {
    const kingdomRef = doc(db, "kingdoms", playerId);

    await updateDoc(kingdomRef, {
      online: isOnline,
      lastSeen: Date.now()
    });

    console.log("🌍 Online Status Updated");

  } catch (error) {
    console.error(error);
  }
}

// ===============================
// SEND MULTIPLAYER INTERACTION
// ===============================
export async function sendInteraction(type, senderId, senderRuler, senderKingdom, receiverId) {
  try {
    const id = `${type}_${senderId}_${receiverId}`;
    const ref = doc(db, "interactions", id);
    
    await setDoc(ref, {
      id,
      type,
      senderId,
      senderRuler,
      senderKingdom,
      receiverId,
      status: "pending",
      timestamp: Date.now()
    });

    console.log(`🤝 Interaction sent: ${type} from ${senderRuler} to ${receiverId}`);
    return true;
  } catch (error) {
    console.error("❌ Send Interaction Error:", error);
    return false;
  }
}

// ===============================
// RESPOND TO INTERACTION
// ===============================
export async function respondToInteraction(interactionId, status) {
  try {
    const ref = doc(db, "interactions", interactionId);
    await updateDoc(ref, { status });
    console.log(`⚖️ Interaction responded: ${interactionId} -> ${status}`);
    return true;
  } catch (error) {
    console.error("❌ Respond Interaction Error:", error);
    return false;
  }
}

// ===============================
// CLEAN UP INTERACTION
// ===============================
export async function deleteInteraction(interactionId) {
  try {
    const ref = doc(db, "interactions", interactionId);
    await deleteDoc(ref);
    console.log(`🗑️ Interaction deleted: ${interactionId}`);
    return true;
  } catch (error) {
    console.error("❌ Delete Interaction Error:", error);
    return false;
  }
}

// ===============================
// WATCH MY LIVE INTERACTIONS
// ===============================
export function watchMyInteractions(playerId, callback) {
  const ref = collection(db, "interactions");
  
  // Real-time listener for incoming interactions (where current player is receiver)
  const qIncoming = query(ref, where("receiverId", "==", playerId));
  const unsubIncoming = onSnapshot(qIncoming, (snapshot) => {
    const list = [];
    snapshot.forEach((doc) => {
      list.push(doc.data());
    });
    callback(list, "incoming");
  });

  // Real-time listener for outgoing interactions (where current player is sender)
  const qOutgoing = query(ref, where("senderId", "==", playerId));
  const unsubOutgoing = onSnapshot(qOutgoing, (snapshot) => {
    const list = [];
    snapshot.forEach((doc) => {
      list.push(doc.data());
    });
    callback(list, "outgoing");
  });

  // Return a cleanup function that cancels both snapshots
  return () => {
    unsubIncoming();
    unsubOutgoing();
  };
}

// ===============================
// GET ACTIVE WAR DOC ID
// ===============================
export const getWarId = (id1, id2) => {
  return id1 < id2 ? `war_${id1}_${id2}` : `war_${id2}_${id1}`;
};

// ===============================
// DECLARE MULTIPLAYER WAR
// ===============================
export async function declareWar(myId, targetId) {
  try {
    const id = getWarId(myId, targetId);
    const ref = doc(db, "wars", id);
    
    await setDoc(ref, {
      id,
      attackerId: myId,
      defenderId: targetId,
      createdAt: Date.now(),
      status: "active",
      warScore: 0,
      battleHistory: [],
      peaceOfferBy: ""
    });

    console.log(`⚔️ War declared between ${myId} and ${targetId}`);
    return true;
  } catch (error) {
    console.error("❌ Declare War Error:", error);
    return false;
  }
}

// ===============================
// UPDATE WAR DOCUMENT
// ===============================
export async function updateWar(warId, updates) {
  try {
    const ref = doc(db, "wars", warId);
    await updateDoc(ref, updates);
    console.log(`⚔️ War updated: ${warId}`);
    return true;
  } catch (error) {
    console.error("❌ Update War Error:", error);
    return false;
  }
}

// ===============================
// WATCH ACTIVE WARS FOR PLAYER
// ===============================
export function watchActiveWars(playerId, callback) {
  const ref = collection(db, "wars");
  const q1 = query(ref, where("attackerId", "==", playerId), where("status", "==", "active"));
  const q2 = query(ref, where("defenderId", "==", playerId), where("status", "==", "active"));
  
  let activeWars = {};
  
  const unsub1 = onSnapshot(q1, (snapshot) => {
    snapshot.forEach(doc => { activeWars[doc.id] = doc.data(); });
    callback(Object.values(activeWars));
  });
  
  const unsub2 = onSnapshot(q2, (snapshot) => {
    snapshot.forEach(doc => { activeWars[doc.id] = doc.data(); });
    callback(Object.values(activeWars));
  });
  
  return () => {
    unsub1();
    unsub2();
  };
}