// Realmora 👑 - Kingdom Event Cards Database
// Highly immersive, elegant political fantasy decisions.
// Contains 55 unique events, rare cards, and narrative chains with delayed consequences.

export const events = [
  // ==================== CHAIN 1: THE SYLVAN FAMINE ====================
  {
    id: "sylvan_famine",
    title: "Sylvan Famine Relief",
    story: "The Sylvan Conclave, our isolationist neighboring kingdom, has suffered a catastrophic blight. Their ambassador stands in our court, humbly begging for grain to feed their starving villages. Our advisors warn that wheat is scarce.",
    theme: "diplomacy",
    category: "chain_starter",
    choices: [
      {
        text: "Help Generously (Empty our reserve granaries)",
        consequence: "You feed their populace, securing undying gratitude but leaving your own treasury empty and vulnerable.",
        effects: { economy: -25, trust: 20, war: -5, diplomacy: 25 },
        npcEffects: { sylvanConclave: 35, gildedSyndicate: -5 },
        personality: "compassionate",
        flagsSet: ["sylvan_helped_generously"]
      },
      {
        text: "Send Small Aid (A token gesture of friendship)",
        consequence: "A moderate shipment of grain is dispatched. They are politely appreciative, but still struggle.",
        effects: { economy: -10, trust: 10, war: 0, diplomacy: 10 },
        npcEffects: { sylvanConclave: 15 },
        personality: "diplomat",
        flagsSet: ["sylvan_helped_token"]
      },
      {
        text: "Refuse Bluntly (We must feed our own first)",
        consequence: "The Sylvan ambassador departs in cold anger. Our borders grow tense, but our granaries remain overflowing.",
        effects: { economy: 15, trust: -15, war: 5, diplomacy: -15 },
        npcEffects: { sylvanConclave: -25 },
        personality: "opportunist",
        flagsSet: ["sylvan_refused"]
      },
      {
        text: "Exploit Their Weakness (Force an unequal land concession)",
        consequence: "You offer food ONLY if they sign over fertile borderlands. They accept out of desperation, but their hatred seethes.",
        effects: { economy: 30, trust: -25, war: 15, diplomacy: -20 },
        npcEffects: { sylvanConclave: -45, ironVanguard: 10 },
        personality: "manipulator",
        flagsSet: ["sylvan_exploited"]
      }
    ]
  },
  {
    id: "sylvan_retribution",
    title: "The Sylvan Retribution",
    story: "Years ago, you refused to help the Sylvan Conclave in their hour of famine. Having rebuilt their strength, their druids have summoned a mystical wild-growth that chokes our northern trade roads. An army of Sylvan warriors stands at the ready.",
    theme: "war",
    category: "chain_follower",
    requiredFlags: ["sylvan_refused"],
    choices: [
      {
        text: "Offer heavy financial reparations to clear the road",
        consequence: "You pay a steep price in gold to placate their wrath and reopen trade.",
        effects: { economy: -25, trust: -5, war: -10, diplomacy: 15 },
        npcEffects: { sylvanConclave: 20 },
        personality: "diplomat"
      },
      {
        text: "Launch a counter-offensive to burn the overgrown vines",
        consequence: "Blood is spilled as your iron legions clash with their woodwardens. The vines burn, but the war escalates.",
        effects: { economy: -10, trust: -15, war: 20, diplomacy: -20 },
        npcEffects: { sylvanConclave: -30, ironVanguard: 15 },
        personality: "conqueror"
      },
      {
        text: "Negotiate a trade pact under threat of total war",
        consequence: "You use high diplomacy to force a compromise, but trust remains low.",
        effects: { economy: -5, trust: 5, war: 5, diplomacy: 10 },
        npcEffects: { sylvanConclave: 5 },
        personality: "manipulator"
      }
    ]
  },
  {
    id: "sylvan_gratitude",
    title: "Sylvan Gratitude",
    story: "Because of your past generosity during their famine, the Sylvan Conclave sends an entourage of mystical woodwardens. They bear highly prized rare lumber, enchanted soil that triples agricultural yields, and offer a sacred protective treaty.",
    theme: "diplomacy",
    category: "chain_follower",
    requiredFlags: ["sylvan_helped_generously"],
    choices: [
      {
        text: "Integrate Sylvan Wardens into our army",
        consequence: "Enchanted armor and woodland beasts bolster your defenses dramatically.",
        effects: { economy: 5, trust: 15, war: 25, diplomacy: 10 },
        npcEffects: { sylvanConclave: 10, ironVanguard: -10 },
        personality: "conqueror"
      },
      {
        text: "Invest the enchanted wood into the merchant navy",
        consequence: "Ships built with Sylvan timber rule the trade routes. Wealth pours into the treasury.",
        effects: { economy: 35, trust: 10, war: -5, diplomacy: 15 },
        npcEffects: { gildedSyndicate: 15 },
        personality: "opportunist"
      },
      {
        text: "Declare an Eternal Alliance",
        consequence: "Your two kingdoms declare an unbreakable bond, cementing global trust and peace.",
        effects: { economy: 10, trust: 30, war: 10, diplomacy: 30 },
        npcEffects: { sylvanConclave: 40 },
        personality: "compassionate"
      }
    ]
  },

  // ==================== CHAIN 2: THE ANCIENT RELIC ====================
  {
    id: "relic_discovery",
    title: "The Sacred Relic",
    story: "Peasants digging a canal have unearthed the 'Calyx of Solar Light', a legendary holy relic lost for three centuries. The Celestia Hegemony, a powerful religious empire, asserts the relic belongs to their god and demands its immediate return.",
    theme: "religious",
    category: "chain_starter",
    choices: [
      {
        text: "Surrender it with holy ceremony",
        consequence: "The Hierophant of Celestia blesses your reign publicly. Your international reputation skyrockets.",
        effects: { economy: -5, trust: 25, war: -10, diplomacy: 25 },
        npcEffects: { celestiaHegemony: 35, sylvanConclave: 10 },
        personality: "diplomat",
        flagsSet: ["relic_returned"]
      },
      {
        text: "Sell it to the Gilded Syndicate secretly",
        consequence: "You melt down or trade the relic to merchant barons for a astronomical chest of gold. The church is deeply suspicious.",
        effects: { economy: 35, trust: -15, war: 0, diplomacy: -10 },
        npcEffects: { gildedSyndicate: 25, celestiaHegemony: -25 },
        personality: "opportunist",
        flagsSet: ["relic_sold"]
      },
      {
        text: "Display it in our Royal Cathedral as a sign of crown authority",
        consequence: "Your own populace is awed, and your soldiers feel divine favor, but Celestia vows holy vengeance.",
        effects: { economy: 5, trust: 15, war: 15, diplomacy: -15 },
        npcEffects: { celestiaHegemony: -30 },
        personality: "conqueror",
        flagsSet: ["relic_kept"]
      }
    ]
  },
  {
    id: "celestia_crusade",
    title: "The Hierophant's Crusade",
    story: "Vengeance has arrived. The Hierophant of Celestia Hegemony, furious that you kept or sold their sacred relic, has declared a Holy Crusade against your kingdom. Zealous soldiers amass at your western border.",
    theme: "war",
    category: "chain_follower",
    requiredFlags: ["relic_kept", "relic_sold"],
    choices: [
      {
        text: "Hire hardened foreign mercenaries to defend the walls",
        consequence: "Gold flows like water to secure sellswords. They defend the borders, but empty your vaults.",
        effects: { economy: -30, trust: -5, war: 20, diplomacy: -5 },
        npcEffects: { gildedSyndicate: 15, ironVanguard: 10 },
        personality: "opportunist"
      },
      {
        text: "Plead for peace through a massive diplomatic confession",
        consequence: "You humiliate the crown, pay massive damages, and sign strict treaties. The crusade halts, but you look weak.",
        effects: { economy: -15, trust: 10, war: -15, diplomacy: 20 },
        npcEffects: { celestiaHegemony: 25 },
        personality: "diplomat"
      },
      {
        text: "Conscript the peasants to fight a legendary holy war",
        consequence: "You rally your populace into a patriotic frenzy. The battle is victorious but ravages trust and fields.",
        effects: { economy: -15, trust: -20, war: 30, diplomacy: -25 },
        npcEffects: { ironVanguard: 20, sylvanConclave: -20 },
        personality: "conqueror"
      }
    ]
  },

  // ==================== CHAIN 3: SPY NETWORK ====================
  {
    id: "spy_discovered",
    title: "The Golden Syndicate Spy",
    story: "A high-ranking advisor in your court has been caught red-handed smuggling military maps to the Gilded Syndicate. He begs for his life, offering to act as a double agent or pay his own ransom.",
    theme: "diplomacy",
    category: "chain_starter",
    choices: [
      {
        text: "Behead him on the spot (Send a message)",
        consequence: "His head is sent back in a chest. The military is inspired by your strength, but the Syndicate is outraged.",
        effects: { economy: -5, trust: 5, war: 15, diplomacy: -20 },
        npcEffects: { ironVanguard: 20, gildedSyndicate: -30 },
        personality: "conqueror",
        flagsSet: ["spy_beheaded"]
      },
      {
        text: "Force him into double agency",
        consequence: "He returns to his duties, feeding false plans to the Syndicate. You now have a hidden intelligence network.",
        effects: { economy: 5, trust: -10, war: 5, diplomacy: 10 },
        npcEffects: { gildedSyndicate: -5 },
        personality: "manipulator",
        flagsSet: ["spy_network_active"]
      },
      {
        text: "Ransom him back for massive gold",
        consequence: "The merchant barons pay handsomely to cover their tracks. You pocket the gold, but your soldiers grumble.",
        effects: { economy: 30, trust: -10, war: -10, diplomacy: 5 },
        npcEffects: { gildedSyndicate: 15, ironVanguard: -15 },
        personality: "opportunist",
        flagsSet: ["spy_ransomed"]
      }
    ]
  },
  {
    id: "ambush_foiled",
    title: "The Border Ambush Foiled",
    story: "Thanks to the secret information fed by your double agent spy, you discover that the Iron Vanguard had planned a highly coordinated surprise ambush on your northern mineral caravan.",
    theme: "war",
    category: "chain_follower",
    requiredFlags: ["spy_network_active"],
    choices: [
      {
        text: "Spring a counter-ambush and slaughter them",
        consequence: "Your legions surround and obliterate their vanguard. A colossal military triumph!",
        effects: { economy: 15, trust: -10, war: 30, diplomacy: -15 },
        npcEffects: { ironVanguard: -30 },
        personality: "conqueror"
      },
      {
        text: "Blackmail the Iron Vanguard with the evidence",
        consequence: "You expose their plot privately. To buy your silence and avoid global shame, they sign a favorable trade pact.",
        effects: { economy: 20, trust: 15, war: -5, diplomacy: 20 },
        npcEffects: { ironVanguard: 10, celestiaHegemony: 10 },
        personality: "manipulator"
      }
    ]
  },

  // ==================== CHAIN 4: THE ALCHEMIST ====================
  {
    id: "alchemist_funding",
    title: "The Elixir of Sovereign",
    story: "A strange, wild-eyed alchemist has arrived at the palace. He claims that with 20 turns of funding, he can distill a legendary elixir that grants absolute wisdom, glowing vigor, and dynamic charisma to the drinker.",
    theme: "mystical",
    category: "chain_starter",
    choices: [
      {
        text: "Provide massive royal funding (Spare no expense)",
        consequence: "You build him a glowing glass laboratory. It heavily drains the treasury, and advisors call you mad.",
        effects: { economy: -25, trust: -5, war: 0, diplomacy: -5 },
        personality: "manipulator",
        flagsSet: ["alchemist_heavy_funded"]
      },
      {
        text: "Provide modest funding and monitor him closely",
        consequence: "He works in a damp dungeon cell under heavy royal guard supervision.",
        effects: { economy: -10, trust: 0, war: 0, diplomacy: 0 },
        personality: "diplomat",
        flagsSet: ["alchemist_mild_funded"]
      },
      {
        text: "Banish him as a dangerous fraud",
        consequence: "He is thrown out of the gates. Your practical-minded advisors rejoice.",
        effects: { economy: 5, trust: 10, war: 0, diplomacy: 0 },
        personality: "opportunist",
        flagsSet: ["alchemist_banished"]
      }
    ]
  },
  {
    id: "elixir_outcome_great",
    title: "The Elixir Revealed",
    story: "The alchemist emerges from his glowing laboratory! He presents a crystal vial of swirling, brilliant violet liquid. He bows deeply, urging you to drink the Elixir of Sovereign before the entire court.",
    theme: "mystical",
    category: "chain_follower",
    requiredFlags: ["alchemist_heavy_funded"],
    choices: [
      {
        text: "Drink the swirling elixir with absolute faith",
        consequence: "A warm, divine energy surges through your veins! Your mind opens to grand complex strategies. Your people view you as a demigod.",
        effects: { economy: 15, trust: 25, war: 15, diplomacy: 25 },
        personality: "compassionate",
        flagsSet: ["sovereign_elixir_drunk"]
      },
      {
        text: "Force a death-row prisoner to test it first",
        consequence: "The prisoner drinks it, looks absolutely radiant, and immediately breaks his chains, escaping into the night. You gain the potion, but the court is stunned by your coldness.",
        effects: { economy: 5, trust: -15, war: 10, diplomacy: 15 },
        personality: "manipulator",
        flagsSet: ["sovereign_elixir_feared"]
      }
    ]
  },

  // ==================== GENERAL EVENTS (5-55) ====================
  {
    id: "peasant_revolt",
    title: "The Peasant's Uprising",
    story: "Outraged by high taxes and draft requirements, a mob of thousand furious peasants has armed itself with pitchforks, marching towards the royal manor, demanding immediate relief.",
    theme: "rebellion",
    choices: [
      {
        text: "Crush them with the Iron Guard (No mercy)",
        consequence: "The streets run red. Rebellion is extinguished, but trust with your people is shattered.",
        effects: { economy: -5, trust: -30, war: 15, diplomacy: -10 },
        npcEffects: { ironVanguard: 15, sylvanConclave: -20 },
        personality: "conqueror"
      },
      {
        text: "Abolish taxes temporarily and hear their grievances",
        consequence: "You calm the mob. Trust is fully restored, but your treasury faces sudden bankruptcy.",
        effects: { economy: -30, trust: 25, war: -10, diplomacy: 10 },
        npcEffects: { gildedSyndicate: -15 },
        personality: "compassionate"
      },
      {
        text: "Execute the instigators but grant partial tax cuts",
        consequence: "A politically balanced reaction. The crowd disperses with a mix of fear and gratitude.",
        effects: { economy: -10, trust: 5, war: 0, diplomacy: 5 },
        personality: "diplomat"
      }
    ]
  },
  {
    id: "gilded_syndicate_tariff",
    title: "Syndicate Tariff Dispute",
    story: "The merchant barons of the Gilded Syndicate have doubled the import tariffs on iron ore, halting our blacksmiths and weapon production. They demand exclusive mineral rights in our valleys.",
    theme: "economy",
    choices: [
      {
        text: "Submit to their demands (Protect the trade flow)",
        consequence: "Our smiths get materials, but Syndicate merchants now own our most valuable silver and iron mines.",
        effects: { economy: 15, trust: -10, war: -10, diplomacy: 15 },
        npcEffects: { gildedSyndicate: 30 },
        personality: "opportunist"
      },
      {
        text: "Retaliate with trade embargoes and navy blockades",
        consequence: "You spark a tense cold war. Trust is shattered, war prep rises, but trade takes a massive hit.",
        effects: { economy: -25, trust: -15, war: 20, diplomacy: -15 },
        npcEffects: { gildedSyndicate: -35, ironVanguard: 10 },
        personality: "conqueror"
      },
      {
        text: "Negotiate a compromise through diplomatic channels",
        consequence: "After weeks of intense political debate, you secure a moderate tariff rate.",
        effects: { economy: -5, trust: 10, war: 0, diplomacy: 15 },
        npcEffects: { gildedSyndicate: 10 },
        personality: "diplomat"
      }
    ]
  },
  {
    id: "iron_vanguard_threat",
    title: "The Iron Vanguard's Demands",
    story: "A colossal, armored legionnaire from the militaristic Iron Vanguard slams his broadsword onto your floor. They demand 2,000 royal swords as a 'peace tribute', hinting at invasion if refused.",
    theme: "war",
    choices: [
      {
        text: "Deliver the weaponry (Buy peace)",
        consequence: "You disarm your own defenses to buy temporary peace. The army feels betrayed.",
        effects: { economy: -15, trust: -5, war: -20, diplomacy: 15 },
        npcEffects: { ironVanguard: 20, sylvanConclave: -5 },
        personality: "diplomat"
      },
      {
        text: "Refuse and mobilize the border defenses!",
        consequence: "Your legions stand ready on the battlements. Tension spikes, but your military pride is preserved.",
        effects: { economy: -5, trust: 10, war: 25, diplomacy: -20 },
        npcEffects: { ironVanguard: -30, sylvanConclave: 10 },
        personality: "conqueror"
      },
      {
        text: "Manipulate them (Sow discord inside their high command)",
        consequence: "You bribe their generals behind the ambassador's back, delaying any invasion with internal politics.",
        effects: { economy: -15, trust: 10, war: 5, diplomacy: 10 },
        npcEffects: { ironVanguard: -10 },
        personality: "manipulator"
      }
    ]
  },
  {
    id: "great_plague",
    title: "The Crimson Fever",
    story: "A deadly, bleeding plague is sweeping across the capital. Villages are quarantined, and corpses lie in the streets. The royal physicians beg for funding to build sanitation clinics.",
    theme: "rebellion",
    choices: [
      {
        text: "Seal the royal castle gates and quarantine the city strictly",
        consequence: "You protect the aristocracy and keep treasury safe, but the commoners die in droves and curse your name.",
        effects: { economy: 5, trust: -35, war: -10, diplomacy: -10 },
        npcEffects: { sylvanConclave: -25 },
        personality: "manipulator"
      },
      {
        text: "Pour out gold reserves for medicine and public relief",
        consequence: "Your treasury is severely drained, but the plague is halted. The populace praises your mercy.",
        effects: { economy: -35, trust: 30, war: 0, diplomacy: 15 },
        npcEffects: { sylvanConclave: 20, celestiaHegemony: 15 },
        personality: "compassionate"
      },
      {
        text: "Pray to the gods and let the disease run its course",
        consequence: "You lose countless workers and soldiers, but your treasury and guards remain unbothered.",
        effects: { economy: -15, trust: -15, war: -15, diplomacy: 5 },
        npcEffects: { celestiaHegemony: 10 },
        personality: "opportunist"
      }
    ]
  },
  {
    id: "royal_marriage",
    title: "The Diplomatic Union",
    story: "The sovereign of the Celestia Hegemony offers their youngest child in marriage to your royal family. This union promises eternal peace but requires you to convert to their high sun faith.",
    theme: "royal",
    choices: [
      {
        text: "Accept the marriage and embrace the Sun Faith",
        consequence: "An incredibly luxurious wedding cements a powerful union, but traditionalists in your kingdom grow furious.",
        effects: { economy: -10, trust: 15, war: -10, diplomacy: 35 },
        npcEffects: { celestiaHegemony: 40, sylvanConclave: -20 },
        personality: "diplomat"
      },
      {
        text: "Refuse the marriage offer politely",
        consequence: "You maintain religious independence, but the Hegemony takes it as a cold insult.",
        effects: { economy: 0, trust: 5, war: 5, diplomacy: -15 },
        npcEffects: { celestiaHegemony: -20 },
        personality: "balanced"
      },
      {
        text: "Propose a secular joint trade treaty instead",
        consequence: "You sidestep the marriage and faith conversion, replacing it with a complex mercantile deal.",
        effects: { economy: 20, trust: 10, war: 0, diplomacy: 10 },
        npcEffects: { gildedSyndicate: 15, celestiaHegemony: 5 },
        personality: "manipulator"
      }
    ]
  },
  {
    id: "bandit_horde",
    title: "The Whispering Bandits",
    story: "A powerful league of outlaws has blockaded the southern silver pass. They plunder caravans and demand protection money, claiming they represent the 'true crown of the poor.'",
    theme: "war",
    choices: [
      {
        text: "Send the army to wipe them out completely",
        consequence: "A short, brutal campaign sweeps the pass clean. Safe roads boost economy, but bandits become martyrs.",
        effects: { economy: 15, trust: -10, war: 20, diplomacy: -5 },
        npcEffects: { ironVanguard: 15 },
        personality: "conqueror"
      },
      {
        text: "Negotiate and absorb them into the Royal Watch",
        consequence: "You offer them legal jobs as guards. The roads are safe, but nobles are shocked you hired criminals.",
        effects: { economy: -5, trust: 15, war: 10, diplomacy: 5 },
        personality: "diplomat"
      },
      {
        text: "Secretly fund them to raid neighboring kingdoms",
        consequence: "You pay them a bribe to redirect their violence outward. Gold flows in, but your morals are heavily stained.",
        effects: { economy: 20, trust: -15, war: -5, diplomacy: -15 },
        npcEffects: { sylvanConclave: -20, gildedSyndicate: -20 },
        personality: "manipulator"
      }
    ]
  },
  {
    id: "merchant_guild_strike",
    title: "The Merchant Guild Strike",
    story: "Angered by royal cargo search laws, the Merchant Guild has locked up all warehouses in the harbor. Ships rot at dock, and commerce is paralyzed.",
    theme: "economy",
    choices: [
      {
        text: "Force the warehouses open and seize the cargo",
        consequence: "You break the strike with steel. Gold flow resumes instantly, but merchant trust is ruined.",
        effects: { economy: 25, trust: -20, war: 5, diplomacy: -15 },
        npcEffects: { gildedSyndicate: -30 },
        personality: "conqueror"
      },
      {
        text: "Acquiesce and abolish the search laws entirely",
        consequence: "The harbor reopens happily, but contraband and illegal weapons now flood your streets unchecked.",
        effects: { economy: 10, trust: 15, war: -15, diplomacy: 10 },
        npcEffects: { gildedSyndicate: 25 },
        personality: "compassionate"
      },
      {
        text: "Incorporate the Guild Masters into the Royal Senate",
        consequence: "You give them political power in exchange for immediate resumption of trade.",
        effects: { economy: 15, trust: 10, war: 0, diplomacy: 10 },
        npcEffects: { gildedSyndicate: 15 },
        personality: "manipulator"
      }
    ]
  },
  {
    id: "heresy_accusation",
    title: "The Heretic Scholar",
    story: "A brilliant astronomer has published a thesis claiming the sun does not revolve around the realm. The priests of Celestia are screaming heresy, demanding he be burned at the stake.",
    theme: "religious",
    choices: [
      {
        text: "Burn the scholar (Placate the church)",
        consequence: "The ashes scatter. The priests praise your piety, but free-thinkers and scientists flee the kingdom in terror.",
        effects: { economy: -15, trust: 10, war: -5, diplomacy: 15 },
        npcEffects: { celestiaHegemony: 25, sylvanConclave: -15 },
        personality: "opportunist"
      },
      {
        text: "Protect him and fund a Royal Academy of Science",
        consequence: "You champion progress! Technological advances boost our prestige and economy, but the priesthood is enraged.",
        effects: { economy: 20, trust: 15, war: 5, diplomacy: -25 },
        npcEffects: { celestiaHegemony: -35, sylvanConclave: 10 },
        personality: "compassionate"
      },
      {
        text: "Exile the scholar and confiscate his books quietly",
        consequence: "A moderate compromise. The scholar lives, the priests are satisfied, and the crown keeps the secrets.",
        effects: { economy: 5, trust: 5, war: 0, diplomacy: 5 },
        personality: "diplomat"
      }
    ]
  },
  {
    id: "gold_vein_found",
    title: "The Deep Gold Vein",
    story: "Miners in our southern ridge have broken through into a massive, glittering vein of pure gold. It could fund a generation of projects, but the miners warn it lies in a seismically unstable cavern.",
    theme: "economy",
    choices: [
      {
        text: "Mine it aggressively (Max output immediately)",
        consequence: "Gold floods the vaults! But a massive cave-in traps dozens of miners, sparking labor riots.",
        effects: { economy: 40, trust: -25, war: -5, diplomacy: 0 },
        npcEffects: { gildedSyndicate: 20 },
        personality: "opportunist"
      },
      {
        text: "Reinforce the shafts heavily and mine slowly",
        consequence: "Safe, responsible mining yields a steady stream of wealth and earns deep respect from the workers.",
        effects: { economy: 20, trust: 20, war: 0, diplomacy: 5 },
        personality: "compassionate"
      },
      {
        text: "Sell the mining rights to the Gilded Syndicate",
        consequence: "They take all the physical risk, paying you a massive lump sum upfront.",
        effects: { economy: 30, trust: 5, war: 0, diplomacy: 10 },
        npcEffects: { gildedSyndicate: 25 },
        personality: "manipulator"
      }
    ]
  },
  {
    id: "barbarian_horde_border",
    title: "The Horde at the Gate",
    story: "A wild confederation of clans from the frozen wastes has descended upon our border farms. They carry torches and demand thousands of cattle, or they will raid our northern provinces.",
    theme: "war",
    choices: [
      {
        text: "Ride out and meet them in blood-soaked battle",
        consequence: "You smash their ranks in a glorious victory, but your army suffers heavy casualties.",
        effects: { economy: -10, trust: 10, war: 20, diplomacy: -15 },
        npcEffects: { ironVanguard: 25 },
        personality: "conqueror"
      },
      {
        text: "Offer them borderlands to settle and join our army",
        consequence: "The raiders become your legal subjects and fearsome front-line defenders. The army grows, but local nobles are terrified.",
        effects: { economy: -15, trust: -10, war: 25, diplomacy: 15 },
        personality: "manipulator"
      },
      {
        text: "Pay them off in gold to go raid elsewhere",
        consequence: "They pocket your gold and ride off toward the Gilded Syndicate. Your borders are safe, but you look cowardly.",
        effects: { economy: -25, trust: 5, war: -10, diplomacy: -5 },
        npcEffects: { gildedSyndicate: -25 },
        personality: "opportunist"
      }
    ]
  },
  {
    id: "refugee_influx",
    title: "The Refugee Crisis",
    story: "A devastating civil war in a distant eastern empire has pushed thousands of desperate, starving refugees to our gates. They beg for shelter and bread inside our walls.",
    theme: "diplomacy",
    choices: [
      {
        text: "Open the gates and integrate them (Provide shelter)",
        consequence: "Your kindness warms the hearts of the people, but food reserves drop and tax collectors are strained.",
        effects: { economy: -20, trust: 25, war: -5, diplomacy: 20 },
        npcEffects: { sylvanConclave: 15, celestiaHegemony: 15 },
        personality: "compassionate"
      },
      {
        text: "Turn them away at spearpoint (Protect our borders)",
        consequence: "You preserve resources, but the sight of starving families driven off by force leaves a stain on your moral reputation.",
        effects: { economy: 10, trust: -25, war: 10, diplomacy: -20 },
        npcEffects: { sylvanConclave: -20, celestiaHegemony: -15 },
        personality: "conqueror"
      },
      {
        text: "Put them to work in the state silver mines",
        consequence: "You provide basic rations and shelter in exchange for grueling, mandatory labor. Economy sky-rockets, trust plunges.",
        effects: { economy: 25, trust: -15, war: 10, diplomacy: -10 },
        personality: "manipulator"
      }
    ]
  },
  {
    id: "flooded_valley",
    title: "The Great Monsoon",
    story: "Unprecedented monsoon rains have burst the earthen dams of our central agricultural valley. Farmlands are submerged, and families are trapped on roofs. The army is needed for rescue efforts.",
    theme: "nature",
    choices: [
      {
        text: "Deploy the army to save lives and rebuild dams",
        consequence: "Your legions drop their weapons and pick up shovels. The valley is saved, but military readiness drops.",
        effects: { economy: -15, trust: 25, war: -20, diplomacy: 10 },
        npcEffects: { sylvanConclave: 15 },
        personality: "compassionate"
      },
      {
        text: "Prioritize guarding the silver stockpiles in high ground",
        consequence: "Your wealth is perfectly secure, but hundreds of peasants drown, shouting curses at the crown.",
        effects: { economy: 15, trust: -30, war: 5, diplomacy: -10 },
        personality: "opportunist"
      },
      {
        text: "Request engineering aid from the Gilded Syndicate",
        consequence: "Their brilliant engineers drain the valley quickly, but they charge a massive fee and acquire land mortgages.",
        effects: { economy: -25, trust: 10, war: 0, diplomacy: 15 },
        npcEffects: { gildedSyndicate: 25 },
        personality: "diplomat"
      }
    ]
  },
  {
    id: "royal_assassination_attempt",
    title: "Poison in the Chalice",
    story: "During a royal banquet, a stray dog eats a fallen piece of meat from your plate and drops dead instantly. An assassin is active in the palace! The captain of guards demands a total lockdown and mass interrogations.",
    theme: "royal",
    choices: [
      {
        text: "Order absolute castle lockdown (Interrogate everyone under torture)",
        consequence: "Your guards discover the conspirators, but the brutal, paranoid castle atmosphere terrifies the court.",
        effects: { economy: -5, trust: -20, war: 15, diplomacy: -10 },
        npcEffects: { ironVanguard: 10 },
        personality: "conqueror"
      },
      {
        text: "Handle it quietly via secret agents",
        consequence: "Your spies shadow suspicious figures, catching the poisoner in his sleep. Wealth is spent, but peace is preserved.",
        effects: { economy: -15, trust: 10, war: 0, diplomacy: 10 },
        personality: "manipulator"
      },
      {
        text: "Accuse a foreign diplomat publicly to drum up war support",
        consequence: "You blame the Iron Vanguard. Your people rally in patriotic anger, but diplomacy with them collapses.",
        effects: { economy: 5, trust: 15, war: 20, diplomacy: -30 },
        npcEffects: { ironVanguard: -40 },
        personality: "opportunist"
      }
    ]
  },
  {
    id: "monument_construction",
    title: "The Grand Sovereign Obelisk",
    story: "Your architect presents a plan to build the 'Aureum Pillar', a towering, gold-clad monument visible from space, symbolizing your kingdom's absolute dominance and artistic elegance.",
    theme: "royal",
    choices: [
      {
        text: "Build it to immortalize our reign (Pour gold)",
        consequence: "The vault is emptied, but the shining golden pillar inspires absolute awe. Foreign kingdoms view us as a superpower.",
        effects: { economy: -35, trust: 25, war: -10, diplomacy: 30 },
        npcEffects: { celestiaHegemony: 20, gildedSyndicate: 15 },
        personality: "opportunist"
      },
      {
        text: "Reject it as wasteful vanity",
        consequence: "You redirect the gold into local grain mills. The people respect your pragmatic humility.",
        effects: { economy: 15, trust: 15, war: 0, diplomacy: -5 },
        personality: "balanced"
      },
      {
        text: "Co-fund it with the Merchants (Sell advertising plaques)",
        consequence: "A bizarre hybrid. The pillar rises, but it is covered in massive metal logos of guild companies, looking highly gaudy.",
        effects: { economy: 10, trust: -10, war: -5, diplomacy: 10 },
        npcEffects: { gildedSyndicate: 25 },
        personality: "manipulator"
      }
    ]
  },
  {
    id: "druid_sacred_grove",
    title: "The Iron Wood Dispute",
    story: "Royal lumberjacks have entered the 'Glow-Wood' forest to harvest timber for war galleys. A circle of Sylvan Conclave druids bars the way, threatening to curse our harvests if a single ancient oak is cut.",
    theme: "nature",
    choices: [
      {
        text: "Cut the wood anyway (We need ships of war!)",
        consequence: "You get heavy oak galleys. But the druids curse your fields; crops shrivel, and Sylvan trust is zero.",
        effects: { economy: -10, trust: -25, war: 25, diplomacy: -20 },
        npcEffects: { sylvanConclave: -40, ironVanguard: 15 },
        personality: "conqueror"
      },
      {
        text: "Halt the logging and declare the grove a sanctuary",
        consequence: "The druids bless your reign. Agriculture flourishes, and Sylvan trust climbs. Your military lacks timber, though.",
        effects: { economy: 10, trust: 20, war: -20, diplomacy: 20 },
        npcEffects: { sylvanConclave: 35 },
        personality: "compassionate"
      },
      {
        text: "Purchase the wood legally from Sylvan merchants at triple price",
        consequence: "You pay a steep financial premium to get the wood peacefully without angering the spirits.",
        effects: { economy: -25, trust: 10, war: 10, diplomacy: 15 },
        npcEffects: { sylvanConclave: 15 },
        personality: "diplomat"
      }
    ]
  },
  {
    id: "royal_treasury_audit",
    title: "The Auditing Scandal",
    story: "A thorough audit of the royal treasury reveals that the master of coin has embezzled thousands of gold sovereigns to build a private estate. He is a close cousin to the Duke of High-Hill.",
    theme: "economy",
    choices: [
      {
        text: "Strip him of all assets and execute him publicly",
        consequence: "You recover the embezzled gold. The Duke of High-Hill is mortified but silent. The public loves your justice.",
        effects: { economy: 25, trust: 15, war: -5, diplomacy: -5 },
        personality: "conqueror"
      },
      {
        text: "Pardon him in exchange for a massive 'voluntary' donation",
        consequence: "A quiet, highly lucrative political deal. The noble families thank your mercy, but the populace smells corruption.",
        effects: { economy: 35, trust: -15, war: 0, diplomacy: 5 },
        personality: "manipulator"
      },
      {
        text: "Reassign him to a remote, frozen border outpost",
        consequence: "A moderate, balanced punishment. The gold is lost, but the political scandal is neatly buried.",
        effects: { economy: -5, trust: 5, war: 5, diplomacy: 5 },
        personality: "diplomat"
      }
    ]
  },
  {
    id: "navy_expansion",
    title: "The Iron Sovereign Galleys",
    story: "Our naval admirals request a massive increase in funding to build a fleet of heavy, iron-plated warships to patrol our coastal trade routes and secure absolute sea supremacy.",
    theme: "war",
    choices: [
      {
        text: "Build the Armada! (Rule the seas)",
        consequence: "Your grand ironclads patrol the waves. Pirate raids vanish, boosting commerce, but army funding shrinks.",
        effects: { economy: 15, trust: 5, war: 25, diplomacy: -10 },
        npcEffects: { ironVanguard: 15, gildedSyndicate: -10 },
        personality: "conqueror"
      },
      {
        text: "Reject naval expansion (Focus on land fortress defense)",
        consequence: "You keep treasury intact and reinforce castles, but foreign pirates plunder your sea trade paths.",
        effects: { economy: -15, trust: 5, war: 10, diplomacy: 5 },
        personality: "balanced"
      },
      {
        text: "Partner with Gilded Syndicate to build a joint mercenary fleet",
        consequence: "You split the initial costs, but the Syndicate gets 50% of all seized pirate loot and custom toll rights.",
        effects: { economy: 5, trust: 10, war: 15, diplomacy: 15 },
        npcEffects: { gildedSyndicate: 25 },
        personality: "manipulator"
      }
    ]
  },
  {
    id: "mystic_prophecy",
    title: "The Eclipse Prophecy",
    story: "A blind, glowing oracle crawls into your court. She screams that a celestial eclipse is coming in three turns, and that the crown must sacrifice a white stallion and lock all citizens in their homes to ward off demons.",
    theme: "mystical",
    choices: [
      {
        text: "Follow the prophecy strictly (Enforce lockdown)",
        consequence: "The eclipse passes safely. The superstitious populace is profoundly relieved and trusts you, but trade stops.",
        effects: { economy: -20, trust: 25, war: -10, diplomacy: 0 },
        npcEffects: { celestiaHegemony: 20 },
        personality: "compassionate"
      },
      {
        text: "Throw the oracle out of court as a delusional madwoman",
        consequence: "You keep markets and armies active. The eclipse arrives; peasants panic, but the crown laughs it off.",
        effects: { economy: 15, trust: -20, war: 5, diplomacy: 0 },
        npcEffects: { celestiaHegemony: -15 },
        personality: "opportunist"
      },
      {
        text: "Exploit the eclipse to claim divine right",
        consequence: "You announce that YOU are causing the eclipse to punish sinners. You terrify your people, boosting control and war prep.",
        effects: { economy: 5, trust: -10, war: 20, diplomacy: -5 },
        personality: "manipulator"
      }
    ]
  },
  {
    id: "mercenary_mutiny",
    title: "The Sellsword Revolt",
    story: " Hardened foreign mercenaries we hired to guard our southern fortresses have gone weeks without pay. They have seized the silver armory and are threatening to burn the city if they aren't paid immediately.",
    theme: "war",
    choices: [
      {
        text: "Pay them double their backpay immediately",
        consequence: "They take the gold and return to duty, laughing. Vault is heavily drained, and your regular guards are jealous.",
        effects: { economy: -30, trust: -5, war: 15, diplomacy: -5 },
        personality: "diplomat"
      },
      {
        text: "Order our loyal Royal Guard to slaughter the mutineers",
        consequence: "A bloodbath in the fortress. The mutineers are slain, but the fort is heavily damaged and defenses are weakened.",
        effects: { economy: -5, trust: -15, war: -20, diplomacy: -10 },
        npcEffects: { ironVanguard: -15 },
        personality: "conqueror"
      },
      {
        text: "Trick them with poisoned casks of royal wine",
        consequence: "You send wine to 'celebrate a deal.' They drink and die in agony in their sleep. Brutal, efficient, and cheap.",
        effects: { economy: 5, trust: -25, war: 10, diplomacy: -15 },
        personality: "manipulator"
      }
    ]
  },
  {
    id: "scientific_guild_balloons",
    title: "The Sky-Sail Invention",
    story: "A Guild of eccentric inventors has created a floating canvas contraption powered by hot air. They request a massive crown grant to build a fleet of 'Sky-Sails' for royal aerial mapping and scout duties.",
    theme: "mystical",
    choices: [
      {
        text: "Fund the skyfleet generously",
        consequence: "Golden balloons float over the kingdom. We map the terrain and spot enemy borders perfectly. Strategy increases.",
        effects: { economy: -25, trust: 10, war: 20, diplomacy: 15 },
        npcEffects: { sylvanConclave: -10, ironVanguard: 15 },
        personality: "opportunist"
      },
      {
        text: "Decline and stick to cavalry scouts",
        consequence: "You save gold, keeping the treasury stable and standard guards comfortable.",
        effects: { economy: 10, trust: 5, war: 0, diplomacy: 0 },
        personality: "balanced"
      }
    ]
  },
  {
    id: "border_wall_construction",
    title: "The Iron Sentinel Wall",
    story: "Military advisors urge you to construct the 'Iron Sentinel', a colossal stone wall studded with heavy ballistas along our entire land border to repel any possible invasions.",
    theme: "war",
    choices: [
      {
        text: "Build the wall! (Isolate and defend)",
        consequence: "A legendary fortification rises. Defensive war prep skyrockets, but neighboring kingdoms view it as a hostile insult.",
        effects: { economy: -30, trust: 10, war: 30, diplomacy: -25 },
        npcEffects: { ironVanguard: -20, sylvanConclave: -20 },
        personality: "conqueror"
      },
      {
        text: "Keep the borders open and invest in treaties instead",
        consequence: "You spend gold on diplomatic feasts and border embassies, improving trust and relationships immensely.",
        effects: { economy: -15, trust: 25, war: -10, diplomacy: 30 },
        npcEffects: { celestiaHegemony: 20, sylvanConclave: 20 },
        personality: "diplomat"
      }
    ]
  },
  {
    id: "guild_currency_debasement",
    title: "Debasing the Royal Coin",
    story: "The treasury is running thin. The master of coin suggests secretly mixing lead and copper into our gold coins, effectively doubling our available spending currency overnight.",
    theme: "economy",
    choices: [
      {
        text: "Debase the currency (Double our liquid gold)",
        consequence: "Immediate massive wealth! But within a few turns, inflation spikes, merchants lose all trust, and prices triple.",
        effects: { economy: 35, trust: -30, war: 0, diplomacy: -15 },
        npcEffects: { gildedSyndicate: -40 },
        personality: "opportunist"
      },
      {
        text: "Maintain currency purity and enforce strict spending",
        consequence: "Economy is tight but gold coin trust remains stellar. Merchants respect your integrity.",
        effects: { economy: -10, trust: 20, war: 0, diplomacy: 10 },
        npcEffects: { gildedSyndicate: 25 },
        personality: "balanced"
      }
    ]
  },
  {
    id: "royal_hunt_trespass",
    title: "The Sacred Stag Hunt",
    story: "While hunting in the royal forests, your archers shoot down a magnificent white stag, only to discover a high-born Sylvan Conclave emissary mourning over it. The stag was a sacred forest deity.",
    theme: "nature",
    choices: [
      {
        text: "Apologize deeply and offer royal compensation",
        consequence: "You pay heavy damages in silver and sign a wildlife preservation pact, soothing Sylvan fury.",
        effects: { economy: -20, trust: 10, war: -5, diplomacy: 20 },
        npcEffects: { sylvanConclave: 25 },
        personality: "diplomat"
      },
      {
        text: "Claim the animal was on crown territory and keep the meat",
        consequence: "You host a decadent venison feast for your nobles, but the Sylvan Conclave declares you a desecrator.",
        effects: { economy: 5, trust: -20, war: 10, diplomacy: -25 },
        npcEffects: { sylvanConclave: -35 },
        personality: "conqueror"
      }
    ]
  },
  {
    id: "witch_trial",
    title: "The Witch of High-Hill",
    story: "A local herbalist who saved dozens from the plague has been accused of dark witchcraft by fanatical priests of Celestia. A mob is preparing to burn her cabin down.",
    theme: "religious",
    choices: [
      {
        text: "Intervene and appoint her as Royal Physician",
        consequence: "You save a brilliant medical mind! Public health improves, but Celestia priests denounce you as a demon-lover.",
        effects: { economy: 10, trust: 15, war: 0, diplomacy: -25 },
        npcEffects: { celestiaHegemony: -35, sylvanConclave: 20 },
        personality: "compassionate"
      },
      {
        text: "Allow the execution to proceed (Avoid holy friction)",
        consequence: "She burns. The priests are ecstatic, but the local populace is terrified and loses trust.",
        effects: { economy: -5, trust: -25, war: -5, diplomacy: 20 },
        npcEffects: { celestiaHegemony: 25 },
        personality: "opportunist"
      }
    ]
  },
  {
    id: "gladiator_games",
    title: "The Sovereign Colosseum",
    story: "To distract the peasants from recent tax increases, your champion suggests holding a massive month-long gladitorial tournament, featuring beasts, fighters, and mock naval battles.",
    theme: "royal",
    choices: [
      {
        text: "Host a blood-soaked spectacle (Pour gold)",
        consequence: "The masses are absolutely thrilled! Rebellion risk plummets and trust soaring, but treasury is dry.",
        effects: { economy: -30, trust: 30, war: 15, diplomacy: 5 },
        npcEffects: { ironVanguard: 20, sylvanConclave: -15 },
        personality: "opportunist"
      },
      {
        text: "Ban gladitorial combat as barbaric and waste of gold",
        consequence: "You save money and direct resources to agriculture, but the bored peasants grumble about your dull rule.",
        effects: { economy: 15, trust: -10, war: -10, diplomacy: -5 },
        personality: "balanced"
      }
    ]
  },
  {
    id: "iron_vanguard_joint_invasion",
    title: "A Conqueror's Pact",
    story: "The Iron Vanguard's supreme general approaches you with a map. He proposes a joint military invasion of the peaceful Sylvan Conclave. We split their fertile valleys 50/50.",
    theme: "war",
    choices: [
      {
        text: "Sign the pact! (Mobilize for invasion)",
        consequence: "Your armies march together! You conquer massive lands, boosting economy and army status, but the global trust in your word is utterly destroyed.",
        effects: { economy: 35, trust: -40, war: 30, diplomacy: -35 },
        npcEffects: { ironVanguard: 40, sylvanConclave: -100, celestiaHegemony: -30 },
        personality: "conqueror"
      },
      {
        text: "Refuse and warn the Sylvan Conclave immediately",
        consequence: "You expose the plot. The Sylvan Conclave praises your virtue, forming a tight defensive alliance, but Vanguard hates you.",
        effects: { economy: -5, trust: 35, war: -15, diplomacy: 30 },
        npcEffects: { sylvanConclave: 45, ironVanguard: -45 },
        personality: "compassionate"
      },
      {
        text: "Leak the plans to both sides and sell weapons",
        consequence: "You play them against each other, selling steel to both. You get filthy rich while they bleed.",
        effects: { economy: 40, trust: -25, war: 10, diplomacy: -20 },
        npcEffects: { ironVanguard: -20, sylvanConclave: -25, gildedSyndicate: 15 },
        personality: "manipulator"
      }
    ]
  },
  {
    id: "church_taxation",
    title: "Taxing the High Altars",
    story: "Your treasury is almost bankrupt. Advisors point out that the temples of Celestia hold vast piles of gold, jewels, and untaxed tithing boxes. They suggest imposing a emergency crown tax on the clergy.",
    theme: "religious",
    choices: [
      {
        text: "Enforce a strict 20% tax on the church vaults",
        consequence: "A flood of gold enters the royal coffers! However, the Hierophant declares you a tyrant, and peasant trust craters.",
        effects: { economy: 35, trust: -30, war: -5, diplomacy: -25 },
        npcEffects: { celestiaHegemony: -40 },
        personality: "opportunist"
      },
      {
        text: "Exempt the church and borrow gold at high interest instead",
        consequence: "You keep holy relations pristine, but you accumulate massive royal debts to the Gilded Syndicate.",
        effects: { economy: -25, trust: 15, war: 0, diplomacy: 15 },
        npcEffects: { celestiaHegemony: 25, gildedSyndicate: 10 },
        personality: "diplomat"
      }
    ]
  },
  {
    id: "drought_peasant_prayers",
    title: "The Scorched Crops",
    story: "A brutal drought has turned our wheat fields to dust. The peasants are praying for rain and begging you to perform a royal rain ceremony, which involves sacrificing the crown's finest stallion.",
    theme: "nature",
    choices: [
      {
        text: "Perform the sacrifice and console the people",
        consequence: "The stallion is slain. Your populace feels deeply cared for, improving trust, but military horse cavalry shrinks.",
        effects: { economy: -5, trust: 20, war: -15, diplomacy: 10 },
        personality: "compassionate"
      },
      {
        text: "Build stone aqueducts from the high mountain rivers",
        consequence: "You solve the crisis with technology! A permanent boost to agriculture and economy, but costs massive gold.",
        effects: { economy: -25, trust: 15, war: 0, diplomacy: 5 },
        personality: "balanced"
      }
    ]
  },
  {
    id: "black_market_uncovered",
    title: "The Silk Road Black Market",
    story: "Royal scouts have busted a massive subterranean smuggling ring in the capital, trading illegal magical weapons and poisons. The ringleader offers you a chest of dark gold for your silence.",
    theme: "economy",
    choices: [
      {
        text: "Accept the bribe and let them operate quietly",
        consequence: "A heavy bag of black market gold is added to your vaults, but crime rises, weakening trust and army safety.",
        effects: { economy: 30, trust: -20, war: -15, diplomacy: -5 },
        npcEffects: { gildedSyndicate: 10 },
        personality: "manipulator"
      },
      {
        text: "Execute the smugglers and seize their contraband",
        consequence: "You seize their high-grade iron and magical weapons, boosting our military gear instantly.",
        effects: { economy: 10, trust: 15, war: 20, diplomacy: 5 },
        npcEffects: { ironVanguard: 15 },
        personality: "conqueror"
      }
    ]
  },
  {
    id: "cartography_dispute",
    title: "The Border Mapping Feud",
    story: "Our royal cartographers have discovered a mapping error: a strategic, iron-rich valley currently marked as Iron Vanguard territory actually falls inside our legal borders. They are already mining it.",
    theme: "diplomacy",
    choices: [
      {
        text: "Seize the valley by military force!",
        consequence: "Your legion swiftly drives out their miners. We get the iron mines, but war prep with Vanguard escalates to crisis levels.",
        effects: { economy: 20, trust: -10, war: 25, diplomacy: -30 },
        npcEffects: { ironVanguard: -45 },
        personality: "conqueror"
      },
      {
        text: "Sell our claim to the valley for a massive sum",
        consequence: "You avoid war completely and secure a massive gold chest. The military calls you weak but your vaults are full.",
        effects: { economy: 30, trust: 10, war: -15, diplomacy: 15 },
        npcEffects: { ironVanguard: 20, gildedSyndicate: 10 },
        personality: "opportunist"
      },
      {
        text: "Arbitrate the dispute through a neutral Sylvan council",
        consequence: "A lengthy legal panel. We split the valley resources, earning international respect and stable peace.",
        effects: { economy: 10, trust: 20, war: -5, diplomacy: 25 },
        npcEffects: { sylvanConclave: 25, ironVanguard: 10 },
        personality: "diplomat"
      }
    ]
  },
  {
    id: "royal_mint_heist",
    title: "Heist at the Royal Mint",
    story: "A highly coordinated gang of thieves has tunnelled into the Royal Mint, stealing thousands of gold plates and fleeing on swift horses toward the Sylvan forests.",
    theme: "economy",
    choices: [
      {
        text: "Send the cavalry across the border to hunt them down",
        consequence: "You capture the thieves and recover the gold, but you violated Sylvan borders, causing diplomatic outrage.",
        effects: { economy: 20, trust: -15, war: 10, diplomacy: -25 },
        npcEffects: { sylvanConclave: -35, ironVanguard: 15 },
        personality: "conqueror"
      },
      {
        text: "Ask Sylvan woodwardens to capture them and split the gold",
        consequence: "A friendly cooperative operation. They return the thieves; you lose some gold to fees but build trust.",
        effects: { economy: 5, trust: 20, war: -5, diplomacy: 20 },
        npcEffects: { sylvanConclave: 25 },
        personality: "diplomat"
      }
    ]
  },
  {
    id: "secret_society_royal_court",
    title: "The Obsidian Dagger Faction",
    story: "A spy uncovers that several high nobles have formed a secret society called 'The Obsidian Dagger', plotting to limit the crown's power and install a noble senate in your place.",
    theme: "rebellion",
    choices: [
      {
        text: "Arrest and execute all members (Strike first)",
        consequence: "The conspiracy is crushed in blood. Nobles fall in line out of absolute terror, but trust collapses.",
        effects: { economy: -5, trust: -25, war: 10, diplomacy: -15 },
        personality: "conqueror"
      },
      {
        text: "Infiltrate their meetings and blackmail them individually",
        consequence: "You control the society from the shadows. You extract gold tributes and complete loyalty.",
        effects: { economy: 20, trust: 5, war: 5, diplomacy: 10 },
        personality: "manipulator"
      },
      {
        text: "Grant their reforms and create a Constitutional Senate",
        consequence: "You hand over some crown power. Trust and stability skyrocket, but your economic control shrinks.",
        effects: { economy: -20, trust: 30, war: -10, diplomacy: 15 },
        personality: "compassionate"
      }
    ]
  },
  {
    id: "rare_meteor_strike",
    title: "The Star-Fall Crystal",
    story: "RARE EVENT! A blazing celestial meteor has crashed into our northern fields. In the smoking crater lies a glowing, star-fall crystal of pure magical energy. Druids, Alchemists, and Foreign empires want it.",
    theme: "mystical",
    choices: [
      {
        text: "Gift it to the Sylvan Druids to heal the earth",
        consequence: "The druids perform a grand ritual. Crop diseases disappear worldwide, and trust in your wisdom is infinite.",
        effects: { economy: 15, trust: 35, war: -10, diplomacy: 30 },
        npcEffects: { sylvanConclave: 50 },
        personality: "compassionate"
      },
      {
        text: "Forge it into a legendary sword of power",
        consequence: "Your royal blacksmith builds 'Astraea', a glowing star-blade. Your soldiers feel absolute military dominance.",
        effects: { economy: -10, trust: 10, war: 40, diplomacy: -20 },
        npcEffects: { ironVanguard: 30, sylvanConclave: -20 },
        personality: "conqueror"
      },
      {
        text: "Sell it to Gilded Syndicate for an insane fortune",
        consequence: "The merchant lords pay a legendary sum of gold. You are suddenly incredibly wealthy.",
        effects: { economy: 55, trust: -10, war: -5, diplomacy: 10 },
        npcEffects: { gildedSyndicate: 45 },
        personality: "opportunist"
      }
    ]
  },
  {
    id: "royal_heir_scandal",
    title: "The Crown Heir's Escapade",
    story: "Your eldest child and royal heir has been caught in a scandalous, highly romantic affair with a low-born tavern servant, breaking a long-standing bethrothal to a foreign princess.",
    theme: "royal",
    choices: [
      {
        text: "Force the heir to end the affair and marry the princess",
        consequence: "You preserve royal duty and international peace, but your child hates you and your family trust drops.",
        effects: { economy: 5, trust: -10, war: -5, diplomacy: 20 },
        personality: "balanced"
      },
      {
        text: "Sanction the true-love marriage and break the treaty",
        consequence: "A beautifully romantic gesture that warms your citizens' hearts, but the foreign empire calls it war-worthy.",
        effects: { economy: -5, trust: 25, war: 10, diplomacy: -25 },
        personality: "compassionate"
      },
      {
        text: "Quietly ship the servant to a remote colony with a payout",
        consequence: "The scandal is swept away with gold. Heir is miserable, but international alliances remain untouched.",
        effects: { economy: -10, trust: 5, war: 0, diplomacy: 10 },
        personality: "manipulator"
      }
    ]
  },
  {
    id: "ancient_plague_tomb",
    title: "Tomb of the Sealed King",
    story: "Archaeologists have found the sealed stone vault of 'Malkor the Cursed'. Hieroglyphs warn that a devastating lung rot is sealed within. The Duke wants the legendary jewels inside.",
    theme: "mystical",
    choices: [
      {
        text: "Break the seal and plunder the riches!",
        consequence: "You get a huge chest of ancient rubies. But a dark spore escapes; a mild plague erupts, hurting trust.",
        effects: { economy: 30, trust: -25, war: -10, diplomacy: -10 },
        personality: "opportunist"
      },
      {
        text: "Keep the tomb permanently sealed and guarded",
        consequence: "You preserve safety. The priests praise your reverence for the dead.",
        effects: { economy: -5, trust: 15, war: 0, diplomacy: 5 },
        npcEffects: { celestiaHegemony: 15 },
        personality: "balanced"
      }
    ]
  },
  {
    id: "monopoly_charter",
    title: "The Salt Trade Monopoly",
    story: "The Gilded Syndicate offers you a massive bribe to sign the 'Salt Charter', granting their merchants absolute exclusive rights to sell salt in our cities, allowing them to charge whatever they want.",
    theme: "economy",
    choices: [
      {
        text: "Accept the bribe and sign the Salt Charter",
        consequence: "A massive bribe fills your personal vaults. But salt prices skyrocket, and commoners starve and curse your name.",
        effects: { economy: 35, trust: -35, war: -5, diplomacy: -10 },
        npcEffects: { gildedSyndicate: 35 },
        personality: "opportunist"
      },
      {
        text: "Refuse and declare salt a free-trade crown good",
        consequence: "Prices plummet. The peasants are overjoyed by their cheap meals. Syndicate is very annoyed.",
        effects: { economy: -15, trust: 25, war: 5, diplomacy: 10 },
        npcEffects: { gildedSyndicate: -25 },
        personality: "compassionate"
      }
    ]
  },
  {
    id: "colony_rebellion",
    title: "The Southern Island Mutiny",
    story: "Our distant sugar-producing colony has risen in mutiny, chasing out the royal tax collectors and declaring a free republic. We need to deploy the navy to crush it.",
    theme: "war",
    choices: [
      {
        text: "Deploy naval bombardments to reclaim the port",
        consequence: "Brutal, decisive bombardment forces their surrender. Wealth flow is restored, but the colony is scarred.",
        effects: { economy: 20, trust: -20, war: 15, diplomacy: -15 },
        npcEffects: { ironVanguard: 15 },
        personality: "conqueror"
      },
      {
        text: "Grant them autonomous commonwealth status",
        consequence: "They remain trade partners but pay much lower taxes. They love you, but our treasury shrinks.",
        effects: { economy: -20, trust: 25, war: -10, diplomacy: 15 },
        npcEffects: { sylvanConclave: 15 },
        personality: "compassionate"
      }
    ]
  },
  {
    id: "glimmer_dust_addiction",
    title: "Glimmer-Dust Epidemic",
    story: "A highly addictive, glowing narcotic called 'Glimmer-Dust' is spreading through our barracks. Soldiers are selling their armor to buy the dust, and military drills are in absolute chaos.",
    theme: "rebellion",
    choices: [
      {
        text: "Enforce a death penalty for possession (Purge the ranks)",
        consequence: "Military order is restored with terrifying iron discipline. Army is safe, but guards are highly fearful.",
        effects: { economy: -5, trust: -15, war: 20, diplomacy: -10 },
        npcEffects: { ironVanguard: 15 },
        personality: "conqueror"
      },
      {
        text: "Establish crown-funded rehabilitation sanitariums",
        consequence: "You treat the addiction as a sickness, saving lives. Trust rises, but vaults and medical staff are drained.",
        effects: { economy: -20, trust: 20, war: 5, diplomacy: 5 },
        personality: "compassionate"
      },
      {
        text: "Tax it heavily and regulate its sale quietly",
        consequence: "You pocket massive sin-tax gold while keeping soldiers moderately buzzed. Morally questionable.",
        effects: { economy: 25, trust: -15, war: -10, diplomacy: 5 },
        personality: "manipulator"
      }
    ]
  },
  {
    id: "royal_aqueduct_project",
    title: "The Aqueduct of Sophia",
    story: "Our engineers present a plan to build a monumental stone aqueduct, bringing clean mountain spring water directly into the capital's slums, ending recurring cholera epidemics.",
    theme: "economy",
    choices: [
      {
        text: "Fund this grand public work! (Clean water for all)",
        consequence: "A beautiful marble aqueduct changes the city. Disease drops, agricultural trade thrives, and trust is immense.",
        effects: { economy: 15, trust: 30, war: -5, diplomacy: 15 },
        npcEffects: { sylvanConclave: 15 },
        personality: "compassionate"
      },
      {
        text: "Reject it (The poor can drink from the river)",
        consequence: "You keep gold for defense and other priorities, but the slums remain disease-ridden.",
        effects: { economy: 10, trust: -15, war: 10, diplomacy: -5 },
        personality: "balanced"
      }
    ]
  },
  {
    id: "foreign_assassin_captured",
    title: "The Captured Assassin",
    story: "Your royal guard has caught a shadow-dancer in your bedchamber, wearing the crest of the militaristic Iron Vanguard. Under interrogation, he reveals they planned to slay you to spark an invasion.",
    theme: "war",
    choices: [
      {
        text: "Behead him and catapult his head back over their border",
        consequence: "A massive, terrifying message. Your soldiers cheer in defiance, but Vanguard prepares for total war.",
        effects: { economy: -5, trust: 10, war: 25, diplomacy: -35 },
        npcEffects: { ironVanguard: -50 },
        personality: "conqueror"
      },
      {
        text: "Keep him locked in high-security cells for leverage",
        consequence: "You hold the proof of their treaty violation, keeping them politically paralyzed and peaceful.",
        effects: { economy: 0, trust: 15, war: 5, diplomacy: 20 },
        npcEffects: { ironVanguard: 10, celestiaHegemony: 15 },
        personality: "manipulator"
      },
      {
        text: "Ransom him back quietly for a massive mineral concession",
        consequence: "You trade his life for ownership of their lucrative sulfur mountains. Wealth spikes, but you look soft on terror.",
        effects: { economy: 30, trust: -5, war: -10, diplomacy: 10 },
        npcEffects: { ironVanguard: 15 },
        personality: "opportunist"
      }
    ]
  },
  {
    id: "philosophers_stone_lead",
    title: "Alchemist's Lead Breakthrough",
    story: "Our Royal Alchemist rushes in, clutching a glowing hot iron pan. He has successfully transmuted lead into pure silver, but warns that the chemicals used release a poisonous cloud of sulfur.",
    theme: "mystical",
    choices: [
      {
        text: "Order mass production in the capital's furnaces",
        consequence: "Treasury overflows with freshly forged silver! But the air turns toxic, killing vegetation and sickening thousands.",
        effects: { economy: 40, trust: -30, war: -10, diplomacy: -15 },
        npcEffects: { sylvanConclave: -35 },
        personality: "opportunist"
      },
      {
        text: "Bury the formula and burn the lab (Too dangerous)",
        consequence: "You protect public health. The alchemist is deeply offended, but the Sylvan Conclave druids praise your stewardship.",
        effects: { economy: -5, trust: 15, war: 0, diplomacy: 10 },
        npcEffects: { sylvanConclave: 25 },
        personality: "balanced"
      }
    ]
  },
  {
    id: "royal_menagerie",
    title: "The Sovereign Menagerie",
    story: "A famous merchant explorer presents a collection of rare, magical beasts caught in distant continents, including a baby griffin and a glowing phoenix. He offers them to the crown for a price.",
    theme: "royal",
    choices: [
      {
        text: "Buy them to build a majestic Royal Menagerie",
        consequence: "The spectacular beasts awe visiting diplomats and locals. Cultural prestige and trust soar.",
        effects: { economy: -25, trust: 25, war: 5, diplomacy: 20 },
        npcEffects: { celestiaHegemony: 15, sylvanConclave: 15 },
        personality: "opportunist"
      },
      {
        text: "Hire the phoenix as a military scout trainer",
        consequence: "The phoenix's fiery skies improve coordinates and tactical training for your archers.",
        effects: { economy: -15, trust: 5, war: 25, diplomacy: 0 },
        npcEffects: { ironVanguard: 15 },
        personality: "conqueror"
      }
    ]
  },
  {
    id: "cathedral_fire",
    title: "The Golden Cathedral Burns",
    story: "A tragic lightning strike has set the grand Golden Cathedral of the Sun ablaze. It is burning to the ground. The Hierophant demands the crown rebuild it immediately with royal funds.",
    theme: "religious",
    choices: [
      {
        text: "Fund a grand marble reconstruction immediately",
        consequence: "You empty the vaults to build a even grander temple. The church is deeply grateful, but economy hits crisis levels.",
        effects: { economy: -35, trust: 20, war: -5, diplomacy: 20 },
        npcEffects: { celestiaHegemony: 35 },
        personality: "compassionate"
      },
      {
        text: "Offer basic wooden support and tell priests to raise donations",
        consequence: "You save gold. The priests are insulted, but the Gilded Syndicate offers to co-finance in exchange for temple rent.",
        effects: { economy: -10, trust: 5, war: 0, diplomacy: 10 },
        npcEffects: { gildedSyndicate: 15, celestiaHegemony: -15 },
        personality: "diplomat"
      }
    ]
  },
  {
    id: "bandit_queen_negotiation",
    title: "The Outlaw Queen's Offer",
    story: "The legendary Bandit Queen, 'Sylvia the Red', has slipped into your chamber, unarmed. She offers to cease all highway robberies if you appoint her as Duchess of the Southern Marshes.",
    theme: "rebellion",
    choices: [
      {
        text: "Accept the deal and legalise her status",
        consequence: "The southern highways are perfectly safe overnight, boosting trade. But normal nobles are highly insulted by this pardon.",
        effects: { economy: 20, trust: -15, war: 5, diplomacy: 10 },
        personality: "manipulator"
      },
      {
        text: "Summon the guards and hang her in the courtyard",
        consequence: "You execute the threat. Outlaw bands lose their leader and scatter, but her supporters vow fiery revenge.",
        effects: { economy: 5, trust: 10, war: 10, diplomacy: -15 },
        personality: "conqueror"
      }
    ]
  },
  {
    id: "monumental_irrigation_canal",
    title: "The Emperor's Canal",
    story: "Your chief surveyor suggests building a massive, hand-dug canal connecting the great northern lake to our southern dry plains, transforming desert wastes into fertile farmland.",
    theme: "economy",
    choices: [
      {
        text: "Mobilize the peasantry to dig the canal (Pour gold)",
        consequence: "A colossal public work! Agricultural wealth explodes, stabilizing the economy for years to come.",
        effects: { economy: 30, trust: 20, war: -10, diplomacy: 10 },
        npcEffects: { sylvanConclave: 15 },
        personality: "compassionate"
      },
      {
        text: "Decline (Focus gold on mercenary garrisons)",
        consequence: "You keep military defenses tight, but agricultural growth remains completely stagnant.",
        effects: { economy: -10, trust: 5, war: 20, diplomacy: -5 },
        personality: "conqueror"
      }
    ]
  },
  {
    id: "diplomatic_leak",
    title: "The Ambassador's Diary",
    story: "A highly compromising personal diary belonging to the Celestia ambassador has been leaked to our court. It contains highly insults about your crown and details of their secret border spy posts.",
    theme: "diplomacy",
    choices: [
      {
        text: "Publish it globally to humiliate their empire",
        consequence: "They are thoroughly embarrassed. Trust in their word drops, but your relations with them freeze.",
        effects: { economy: 5, trust: 20, war: 10, diplomacy: -30 },
        npcEffects: { celestiaHegemony: -50, gildedSyndicate: 15 },
        personality: "opportunist"
      },
      {
        text: "Return it to him privately in exchange for border concessions",
        consequence: "You quietly blackmail him. He closes the spy posts and gives you trade favors. Sleek and elegant.",
        effects: { economy: 20, trust: 10, war: -5, diplomacy: 20 },
        npcEffects: { celestiaHegemony: 15 },
        personality: "manipulator"
      }
    ]
  },
  {
    id: "iron_vanguard_border_clash",
    title: "The Fortress Raid",
    story: "A border skirmish erupted yesterday when a hot-headed Iron Vanguard commander led a raid on our northern grain towers, claiming they were reclaiming stolen lands.",
    theme: "war",
    choices: [
      {
        text: "Retaliate instantly by burning their border keep",
        consequence: "You send a fiery military response. Honor is satisfied, but soldiers bleed and trade channels collapse.",
        effects: { economy: -15, trust: -10, war: 25, diplomacy: -25 },
        npcEffects: { ironVanguard: -40 },
        personality: "conqueror"
      },
      {
        text: "Demand financial damages through peaceful diplomacy",
        consequence: "You avoid war. Vanguard pays a small token, but your army complains that the crown lacks steel.",
        effects: { economy: 10, trust: 15, war: -15, diplomacy: 20 },
        npcEffects: { ironVanguard: 10 },
        personality: "diplomat"
      }
    ]
  },
  {
    id: "gilded_syndicate_loan",
    title: "The Iron Mortgage Offer",
    story: "With vaults running dry, the Gilded Syndicate offers a low-interest loan of 30,000 gold sovereigns. The catch: they get full foreclosure rights on our central iron mines if we default.",
    theme: "economy",
    choices: [
      {
        text: "Accept the loan and pocket the gold",
        consequence: "Vaults are filled instantly! But you are now deeply in debt to merchant barons, hurting trust.",
        effects: { economy: 35, trust: -15, war: -5, diplomacy: 5 },
        npcEffects: { gildedSyndicate: 20 },
        personality: "opportunist"
      },
      {
        text: "Decline and raise domestic taxes strictly instead",
        consequence: "You avoid foreign debt, but your populace groans under the heavy new crown taxes.",
        effects: { economy: 15, trust: -25, war: 5, diplomacy: -10 },
        personality: "balanced"
      }
    ]
  },
  {
    id: "sylvan_sacred_beast",
    title: "The Captured Forest Kirin",
    story: "Your hunters have caught a Kirin, a magnificent, glowing antlered stallion sacred to Sylvan Conclave. Sylvan woodwardens surround our hunting lodge, demanding its release under threat of war.",
    theme: "nature",
    choices: [
      {
        text: "Release the Kirin immediately with royal apologies",
        consequence: "The beast runs free. Sylvan druids bless your crops and trust soaring. The hunters are disappointed.",
        effects: { economy: -5, trust: 30, war: -15, diplomacy: 25 },
        npcEffects: { sylvanConclave: 40 },
        personality: "compassionate"
      },
      {
        text: "Tame it to serve as the Royal Mount",
        consequence: "You ride a legendary glowing beast into court. Peasants view you with supernatural awe, but Sylvan hatred seethes.",
        effects: { economy: 10, trust: -20, war: 20, diplomacy: -25 },
        npcEffects: { sylvanConclave: -45, celestiaHegemony: -10 },
        personality: "conqueror"
      }
    ]
  },
  {
    id: "celestia_sun_temple",
    title: "Sun Temple in the Capital",
    story: "Hierophant of Celestia Hegemony offers to fund a colossal, solid gold 'Cathedral of Solar Cleansing' in our capital city, completely free of charge. However, only Sun Faith priests may administer law inside its district.",
    theme: "religious",
    choices: [
      {
        text: "Allow it (Accept the foreign funding)",
        consequence: "A beautiful glowing temple rises, boosting trust and prestige, but we lose legal sovereignty over the temple district.",
        effects: { economy: 20, trust: 15, war: -10, diplomacy: 20 },
        npcEffects: { celestiaHegemony: 35, sylvanConclave: -15 },
        personality: "diplomat"
      },
      {
        text: "Decline the offer (Keep crown sovereignty absolute)",
        consequence: "You maintain independent laws, but the Hegemony takes it as a major insult to their god.",
        effects: { economy: -5, trust: 5, war: 5, diplomacy: -15 },
        npcEffects: { celestiaHegemony: -25 },
        personality: "balanced"
      }
    ]
  },
  {
    id: "orphanage_construction",
    title: "Orphanage of the Lilies",
    story: "A quiet, gentle nun begs for a modest crown grant to build a sanctuary for children orphaned during our recent wars, claiming it will heal the generational scars of the capital.",
    theme: "rebellion",
    choices: [
      {
        text: "Fund the orphanage and build royal schools",
        consequence: "A beautiful sanctuary rises. Your mercy warms the heart of every citizen. Generational trust is sealed.",
        effects: { economy: -15, trust: 30, war: -10, diplomacy: 15 },
        npcEffects: { sylvanConclave: 15, celestiaHegemony: 15 },
        personality: "compassionate"
      },
      {
        text: "Decline (We need steel, not charities)",
        consequence: "You save gold, keeping the military strong, but the slums remain filled with beggar children.",
        effects: { economy: 5, trust: -15, war: 15, diplomacy: -5 },
        personality: "conqueror"
      }
    ]
  }
];

// Helper functions for Card Selection Engine
export function getRandomEvent(currentState, history) {
  // 1. Separate events into candidates
  const candidates = events.filter(e => {
    // Prevent drawing already played events to avoid repetition
    const alreadyPlayed = history.some(h => h.eventId === e.id);
    if (alreadyPlayed) return false;

    // Check if requiredFlags are satisfied
    if (e.requiredFlags) {
      const playerFlags = currentState.flags || [];
      const hasAllRequired = e.requiredFlags.every(flag => playerFlags.includes(flag));
      if (!hasAllRequired) return false;
    }

    return true;
  });

  // 2. Prioritize chain-follower events that have their conditions met!
  const chainFollowers = candidates.filter(e => e.category === "chain_follower");
  if (chainFollowers.length > 0) {
    // 30% chance to force a chain follower if available to keep the story connected
    if (Math.random() < 0.4) {
      const randomIndex = Math.floor(Math.random() * chainFollowers.length);
      return chainFollowers[randomIndex];
    }
  }

  // 3. Fallback to standard random selection
  if (candidates.length === 0) {
    // If all events are exhausted, recycle general non-chain events
    const generalEvents = events.filter(e => !e.category || e.category !== "chain_starter");
    const randomIndex = Math.floor(Math.random() * generalEvents.length);
    return generalEvents[randomIndex];
  }

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}
