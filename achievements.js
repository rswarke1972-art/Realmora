// achievements.js

export const achievements = [

{
id: "first_war",
name:
"⚔️ First Blood",
description:
"Win your first war."
},

{
id: "empire_10",
name:
"👑 Emperor",
description:
"Own 10 territories."
},

{
id: "economy_100",
name:
"💰 Trade Lord",
description:
"Reach 100 economy."
},

{
id: "diplomacy_100",
name:
"🕊️ Peacekeeper",
description:
"Reach 100 diplomacy."
},

{
id: "war_100",
name:
"🔥 Warmonger",
description:
"Reach 100 war power."
},

{
id: "spy_master",
name:
"🗡️ Shadow Master",
description:
"Successfully sabotage a rival."
}

];

// ====================
// CHECK ACHIEVEMENTS
// ====================
export function
checkAchievements(
state
) {

const unlocked =
[];

if (
  state.flags &&
  state.flags.includes("won_first_war")
) {
  unlocked.push("first_war");
}

if (
  state.flags &&
  state.flags.includes("spy_sabotage_success")
) {
  unlocked.push("spy_master");
}

if (
  (state.territories || 1) >= 10 ||
  (state.history && state.history.some(h => h.eventTitle === "The Coronation" && state.territories >= 10))
) {
  unlocked.push("empire_10");
}

if (
  state.stats &&
  state.stats.economy >= 100
) {
  unlocked.push("economy_100");
}

if (
  state.stats &&
  state.stats.diplomacy >= 100
) {
  unlocked.push("diplomacy_100");
}

if (
  state.stats &&
  state.stats.war >= 100
) {
  unlocked.push("war_100");
}

return unlocked;
}