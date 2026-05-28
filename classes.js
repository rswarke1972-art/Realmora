// classes.js

export const kingdomClasses = {

merchant: {
name:
"Trade Dynasty 💰",

bonus: {
economy: 20
},

description:
"Masters of wealth and commerce."
},

guard: {
name:
"War Empire ⚔️",

bonus: {
war: 20
},

description:
"Military-focused conquerors."
},

embassy: {
name:
"Diplomatic Federation 🕊️",

bonus: {
diplomacy: 20
},

description:
"Experts in treaties and alliances."
},

monarch: {
name:
"Royal Kingdom 👑",

bonus: {
trust: 20
},

description:
"Beloved rulers trusted by citizens."
}

};

// ======================
// APPLY CLASS BONUS
// ======================
export function
applyClassBonus(
stats,
focus
) {

const cls =
kingdomClasses[
focus
];

if (!cls) {
return stats;
}

const updated =
{ ...stats };

for (
const stat
in cls.bonus
) {

updated[stat] =
Math.min(
100,
(updated[stat]
|| 50)
+
cls.bonus[
stat
]
);

}

return updated;
}