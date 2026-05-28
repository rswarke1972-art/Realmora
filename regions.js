// regions.js

export const worldRegions = [

"Golden Isles",
"Northern Pass",
"Shadow Coast",
"Eastern Desert",
"Moon Valley",
"Iron Mountains",
"Frostlands",
"Crimson Plains",
"Emerald Woods",
"Sunspire Coast",
"Dragon Ridge",
"Storm Peaks",
"Obsidian Frontier",
"Silver Marsh",
"King's Reach",
"Whispering Forest",
"Westfall Province",
"Azure Coast",
"Blackstone Valley",
"High Crown"

];

export function
getRandomRegion(
takenRegions = []
) {

const available =
worldRegions.filter(
region =>
!takenRegions.includes(
region
)
);

if (
available.length === 0
) {
return
"Unknown Territory";
}

return available[
Math.floor(
Math.random()
*
available.length
)
];

}