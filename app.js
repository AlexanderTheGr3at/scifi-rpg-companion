// =========================
// GLOBAL STATE MANAGEMENT
// =========================

let currentView = 'hub-view';
let diceHistory = [];

// Powers management
let activeBioticPowers = [];
let activeTechPowers = [];
let bioticPowerIdCounter = 1;
let techPowerIdCounter = 1;

// Power upgrade tracking
let powerUpgrades = {}; // { powerId: { level5: 'upgradeName', level10: 'upgradeName', level15: true } }

// Base attributes tracking (without bonuses)
let baseAttributes = {
    health: 0,
    combat: 0,
    evasion: 0,
    speed: 0,
    charisma: 0,
    tech: 0,
    biotics: 0
};

// Flag to prevent duplicate event listener setup
let characterEventListenersSetup = false;

// =========================
// GAME DATA DEFINITIONS
// =========================

const classData = {
    'Soldier': {
        description: 'Pure combat specialist and battlefield anchor. Front-line fighter, weapon specialist, sustained damage dealer, tactical flexibility.',
        effects: '• +2 to Health, +1 to Combat\n• Weapon Mastery: Choose weapon type for +1 damage permanently\n• Heavy Weapons Training: Can use heavy weapons and move at half speed\n• Soldier Training: Extra shots on multi-shot weapons\n• Ammo Specialization: Switch between Incendiary/Disruptor/Cryo ammo types\n• Adrenaline Rush: +1d4 weapon damage, half incoming damage, immunity to Stunned/Slowed (2 uses/mission)\n• Concussive Shot: 1d6+Combat damage, knock prone or stagger (4-8 uses/mission)\n• All armor types with no penalties'
    },
    'Engineer': {
        description: 'Technology expert who manipulates the battlefield through electronic warfare and gadgetry.',
        effects: '• +2 to Tech attribute\n• +1 to Health attribute\n• Access to advanced tech abilities\n• Drone and turret deployment\n• Electronic warfare capabilities'
    },
    'Adept': {
        description: 'Pure biotic specialist who wields the fundamental forces of the universe.',
        effects: '• +2 to Biotics attribute\n• Access to powerful biotic abilities\n• Can manipulate gravity and mass\n• Increased biotic energy pool'
    },
    'Vanguard': {
        description: 'Aggressive fighter who combines biotic powers with close-combat expertise for devastating hit-and-run tactics.',
        effects: '• +1 to Combat, +1 to Biotics\n• Biotic charge abilities for closing distance\n• Can use medium armor effectively\n• Enhanced mobility in combat'
    },
    'Sentinel': {
        description: 'Versatile operative who blends tech and biotic abilities to support allies and control the battlefield.',
        effects: '• +1 to Tech, +1 to Biotics\n• Tech armor for enhanced protection\n• Can combine tech and biotic powers\n• Support and defensive specialization'
    },
    'Infiltrator': {
        description: 'Tech-enhanced precision specialist and stealth operative. Long-range elimination, stealth operations, tech disruption, precision support.',
        effects: '• +1 to Health, +1 to Combat, +1 to Tech\n• Sniper Specialist: +1 damage with sniper rifles, choose 1 additional Tier 1 tech power\n• Stealth Operations: +2 to stealth/infiltration/reconnaissance rolls\n• Precision Training: +1 to hit at 12+ hexes, crits deal +2d6 damage\n• Tactical Cloak: Invisible for 2 rounds, +2 attack, first attack +1d6 damage (3-7 uses/mission)\n• Weapon Access: Pistols, SMGs, Sniper Rifles\n• All armor types (heavy armor has tech power penalties)'
    }
};

// Class-specific powers that are automatically granted
const classSpecificPowers = {
    'Soldier': [
        {
            name: 'Adrenaline Rush',
            type: 'class',
            description: 'Combat enhancement that boosts damage and provides damage resistance.',
            effects: '• Duration: 2 rounds\n• +1d4 weapon damage\n• Reduce incoming damage by half (after armor reduction)\n• Immunity to Stunned and Slowed\n• Cannot be used again until previous effect ends\n• Uses: 2 per mission'
        },
        {
            name: 'Concussive Shot',
            type: 'class',
            description: 'Ranged attack that deals damage and can knock enemies prone.',
            effects: '• Range: 12 hexes\n• 1d6+Combat damage\n• Target makes Evasion Check vs. Combat DC (10+Combat) or Knocked Prone\n• Targets with barriers are Staggered instead (half movement next turn)\n• Uses: 4-8 per mission (based on Combat attribute)'
        }
    ],
    'Infiltrator': [
        {
            name: 'Tactical Cloak',
            type: 'class',
            description: 'Advanced stealth technology that renders the user invisible.',
            effects: '• Duration: 2 rounds or until you attack\n• Become invisible to enemies\n• +2 to all attack rolls while cloaked\n• First attack while cloaked deals +1d6 damage\n• Cannot be used while adjacent to enemies\n• Moving does not break cloak\n• Uses: 3-7 per mission (based on Tech attribute)'
        }
    ],
    'Engineer': [],
    'Adept': [],
    'Vanguard': [],
    'Sentinel': []
};

const raceData = {
    'Human': {
        description: 'Adaptable and determined, humans are newcomers to the galactic community but have quickly established themselves as a major power.',
        effects: 'Starting Stats: Health 5, Combat 0, Evasion 4, Speed 4, Charisma 0, Tech 0, Biotics 0\n\n• +1 to a stat of your choice\n• Adaptable: Re-roll one failed Charisma or Combat roll per mission'
    },
    'Asari': {
        description: 'Long-lived and naturally biotic, the asari are known for their wisdom, diplomacy, and powerful biotic abilities.',
        effects: 'Starting Stats: Health 5, Combat 0, Evasion 4, Speed 4, Charisma 0, Tech 0, Biotics 1\n\n• +1 to Biotic Energy\n• Meditative Calm: Recover 1 Biotic Energy per mission\n• Proficient in Biotics: One additional biotic power at creation'
    },
    'Turian': {
        description: 'Disciplined militaristic culture with natural tactical aptitude and strong sense of duty and honor.',
        effects: 'Starting Stats: Health 5, Combat 1, Evasion 4, Speed 4, Charisma 0, Tech 0, Biotics 0\n\n• +1 to Combat Proficiency\n• Combat Focus: Re-roll one failed Combat roll per mission'
    },
    'Krogan': {
        description: 'Physically powerful and resilient warriors from a harsh homeworld, known for their incredible durability.',
        effects: 'Starting Stats: Health 7, Combat 1, Evasion 4, Speed 4, Charisma -1, Tech 0, Biotics 0\n\n• +1 to Health bonus\n• Ignore Heavy Armor Movement Penalties\n• Redundant Organs: Once per battle, ignore fatal damage and remain at 1 HP'
    },
    'Salarian': {
        description: 'Highly intelligent and fast-thinking, salarians excel at science, espionage, and rapid problem-solving.',
        effects: '• +2 to Tech\n• +1 to Evasion\n• Enhanced intelligence and memory\n• Fast reflexes and quick thinking\n• Scientific and research bonuses'
    },
    'Quarian': {
        description: 'Nomadic people living in environmental suits, with exceptional technical skills developed from shipboard life.',
        effects: '• +2 to Tech\n• +1 to Evasion\n• Master engineers and technicians\n• Environmental suit provides protection\n• Ship and fleet operation expertise'
    },
    'Drell': {
        description: 'Reptilian species with perfect memory and natural agility, often serving as assassins or scholars.',
        effects: '• +1 to Combat\n• +1 to Charisma\n• Perfect memory (eidetic recall)\n• Natural climbing and acrobatic abilities\n• Enhanced reflexes'
    },
    'Batarian': {
        description: 'Four-eyed humanoids known for their slave trade and antagonistic relationship with humans.',
        effects: '• +1 to Combat\n• +1 to Tech\n• Enhanced vision and depth perception\n• Criminal underworld connections\n• Slavers guild knowledge'
    },
    'Vorcha': {
        description: 'Short-lived but highly adaptive species with rapid regeneration and ability to adapt to environments.',
        effects: '• +2 to Health\n• +1 to Combat\n• Rapid regeneration\n• Environmental adaptation\n• Resilience to damage and disease'
    },
    'Volus': {
        description: 'Small, pressure-suit wearing traders and economists who are the financial backbone of Citadel space.',
        effects: '• +2 to Charisma\n• +1 to Tech\n• Financial and trade expertise\n• Pressure suit environmental protection\n• Economic analysis and negotiation skills'
    }
};

const backgroundData = {
    'Military': {
        description: 'Served in organized armed forces, trained in tactics, discipline, and combat operations.',
        effects: '• Combat training and weapons familiarity\n• Military contacts and protocols\n• Leadership and command experience\n• Access to military equipment and intel'
    },
    'Corporate Executive': {
        description: 'High-level business leader with extensive corporate networks and financial resources.',
        effects: '• Substantial financial resources\n• Corporate contacts and influence\n• Business negotiation expertise\n• Access to corporate facilities and data'
    },
    'Frontier Colonist': {
        description: 'Grew up on the edge of civilized space, learning to survive in harsh conditions.',
        effects: '• Survival and self-reliance skills\n• Knowledge of frontier territories\n• Resourcefulness and improvisation\n• Familiarity with dangerous wildlife'
    },
    'Criminal Underground': {
        description: 'Operated outside the law in criminal organizations, learning stealth and underworld connections.',
        effects: '• Criminal contacts and black market access\n• Stealth and infiltration skills\n• Knowledge of illegal activities\n• Street smarts and survival instincts'
    },
    'Academic Researcher': {
        description: 'Dedicated scholar with extensive knowledge and research experience.',
        effects: '• Vast academic knowledge\n• Research and analysis skills\n• Academic contacts and library access\n• Scientific method and critical thinking'
    },
    'Mercenary': {
        description: 'Professional soldier-for-hire with combat experience across multiple conflicts.',
        effects: '• Combat experience and tactics\n• Mercenary band connections\n• Flexible moral code\n• Knowledge of conflicts and battlefields'
    },
    'Engineer': {
        description: 'Technical specialist with engineering training and practical technical skills.',
        effects: '• Engineering and technical expertise\n• Equipment maintenance and repair\n• Technical problem-solving\n• Understanding of complex systems'
    },
    'Medic': {
        description: 'Medical professional trained in healing and biological sciences.',
        effects: '• Medical knowledge and healing skills\n• Access to medical supplies\n• Biological and chemical expertise\n• Emergency response training'
    },
    'Pilot': {
        description: 'Skilled vehicle operator with extensive experience flying spacecraft and atmospheric craft.',
        effects: '• Expert piloting skills\n• Spacecraft and vehicle knowledge\n• Navigation and astrogation\n• Pilot network contacts'
    },
    'Diplomat': {
        description: 'Trained in negotiation, cultural sensitivity, and inter-species relations.',
        effects: '• Diplomatic immunity and protocols\n• Cultural knowledge and etiquette\n• Negotiation and persuasion skills\n• Government and embassy contacts'
    },
    'N7 Operative': {
        description: 'Elite Systems Alliance special forces operative with the highest military training.',
        effects: '• Elite military training and tactics\n• Advanced combat specializations\n• Alliance command authority\n• Access to classified operations'
    },
    'C-Sec Officer': {
        description: 'Citadel Security officer trained in law enforcement and maintaining peace.',
        effects: '• Law enforcement authority\n• Investigation and forensics training\n• Citadel security clearance\n• Contact with other law enforcement'
    },
    'Spectre Agent': {
        description: 'Elite Citadel Council agent with unlimited authority to preserve galactic peace.',
        effects: '• Council authority and resources\n• Above-the-law operational freedom\n• Advanced training in all specialties\n• Galactic intelligence network access'
    },
    'Alliance Marine': {
        description: 'Systems Alliance ground forces specialist trained for planetary assault operations.',
        effects: '• Advanced military combat training\n• Planetary assault specialization\n• Alliance military support\n• Knowledge of Alliance operations'
    },
    'Cerberus Operative': {
        description: 'Human-first organization member with advanced training and controversial methods.',
        effects: '• Advanced black ops training\n• Cerberus technology and resources\n• Human supremacist contacts\n• Classified human tech access'
    },
    'Terminus Smuggler': {
        description: 'Outlaw operating in lawless space, expert at avoiding authorities and moving contraband.',
        effects: '• Criminal network in Terminus systems\n• Smuggling routes and safe houses\n• Ship modification expertise\n• Black market connections'
    },
    'Citadel Politician': {
        description: 'Galactic government official with political power and diplomatic connections.',
        effects: '• Political influence and authority\n• Diplomatic contacts across species\n• Government resource access\n• Knowledge of galactic politics'
    },
    'Omega Mercenary': {
        description: 'Hardened fighter from the lawless station Omega, experienced in brutal combat.',
        effects: '• Brutal combat experience\n• Omega underworld connections\n• Survival in lawless environments\n• Knowledge of criminal organizations'
    },
    'STG Agent': {
        description: 'Salarian Special Tasks Group operative trained in espionage and intelligence.',
        effects: '• Advanced espionage training\n• Intelligence gathering expertise\n• Salarian government authority\n• Access to classified information'
    },
    'Migrant Fleet Engineer': {
        description: 'Quarian engineer responsible for maintaining the massive ships of the Migrant Fleet.',
        effects: '• Advanced ship engineering skills\n• Quarian fleet technology access\n• Resource conservation expertise\n• Knowledge of fleet operations'
    }
};

const weaponData = {
    // Assault Rifles
    'M-8 Avenger': {
        description: 'The M-8 Avenger is the standard-issue assault rifle of the Systems Alliance military. Proven in countless engagements across the galaxy, this versatile weapon offers dependable performance in all combat situations.',
        effects: '• Range: 14 hexes\n• Damage: 1d6 + Combat\n• Damage Type: Kinetic\n• Shots: 2 (Soldier: 3)\n• Thermal Clips: 1 per mission\n• Traits: Reliable\n• Cost: 500 credits\n• Rarity: Standard',
        traits: {
            'Reliable': 'Reroll one failed attack roll per mission'
        }
    },
    'M-15 Vindicator': {
        description: 'Burst-fire assault rifle with excellent accuracy and stopping power.',
        effects: '• Damage: 2d8 (burst)\n• Range: Medium\n• Burst-fire mode\n• High accuracy'
    },
    'M-76 Revenant': {
        description: 'Heavy machine gun with devastating firepower and high rate of fire.',
        effects: '• Damage: 3d6\n• Range: Long\n• Full-auto capable\n• Heavy weapon penalties'
    },
    'M-96 Mattock': {
        description: 'Semi-automatic rifle combining assault rifle power with sniper precision.',
        effects: '• Damage: 2d8\n• Range: Long\n• Semi-auto precision\n• Scope attachment'
    },
    'M-37 Falcon': {
        description: 'Grenade launcher that fires micro-grenades with explosive payload.',
        effects: '• Damage: 3d8 (explosive)\n• Range: Medium\n• Area of effect\n• Limited ammo'
    },
    'Geth Pulse Rifle': {
        description: 'Alien technology weapon firing concentrated energy pulses.',
        effects: '• Damage: 2d6 (energy)\n• Range: Medium\n• No ammo concerns\n• Geth technology'
    },

    // Sniper Rifles
    'M-92 Mantis': {
        description: 'Standard sniper rifle with exceptional range and stopping power.',
        effects: '• Damage: 3d8\n• Range: Extreme\n• Single-shot precision\n• Scope included'
    },
    'M-97 Viper': {
        description: 'Semi-automatic sniper rifle for rapid precision shots.',
        effects: '• Damage: 2d8\n• Range: Long\n• Semi-auto capability\n• Fast follow-up shots'
    },
    'M-98 Widow': {
        description: 'Heavy sniper rifle capable of penetrating heavy armor and barriers.',
        effects: '• Damage: 4d8\n• Range: Extreme\n• Armor penetration\n• Massive stopping power'
    },
    'Black Widow': {
        description: 'Advanced sniper rifle with three-round burst capability.',
        effects: '• Damage: 3d8 (3-round burst)\n• Range: Extreme\n• Burst precision\n• Elite weapon'
    },

    // Shotguns
    'M-23 Katana': {
        description: 'Standard shotgun effective at close range with wide spread.',
        effects: '• Damage: 3d6\n• Range: Close\n• Wide spread pattern\n• Close-quarters specialist'
    },
    'M-27 Scimitar': {
        description: 'Semi-automatic shotgun with rapid fire capability.',
        effects: '• Damage: 2d8\n• Range: Close\n• Semi-auto fire\n• Fast reload'
    },
    'M-300 Claymore': {
        description: 'Heavy shotgun with devastating close-range damage.',
        effects: '• Damage: 4d6\n• Range: Close\n• Massive damage\n• Slow reload'
    },
    'Geth Plasma Shotgun': {
        description: 'Alien energy weapon that charges for increased damage.',
        effects: '• Damage: 2d6-4d6 (charge)\n• Range: Close\n• Chargeable shot\n• Energy-based'
    },

    // SMGs
    'M-4 Shuriken': {
        description: 'Compact submachine gun for close-quarters combat.',
        effects: '• Damage: 1d8\n• Range: Close\n• High rate of fire\n• Compact design'
    },
    'M-9 Tempest': {
        description: 'High-velocity SMG with excellent accuracy.',
        effects: '• Damage: 2d6\n• Range: Close\n• High accuracy\n• Stable platform'
    },
    'M-12 Locust': {
        description: 'Precise SMG with burst-fire capability.',
        effects: '• Damage: 1d10 (burst)\n• Range: Close\n• Burst-fire mode\n• High precision'
    },

    // Pistols
    'M-3 Predator': {
        description: 'Standard sidearm used throughout the galaxy.',
        effects: '• Damage: 1d8\n• Range: Medium\n• Reliable backup\n• Quick draw'
    },
    'M-5 Phalanx': {
        description: 'Heavy pistol with increased stopping power.',
        effects: '• Damage: 2d6\n• Range: Medium\n• High damage\n• Slower fire rate'
    },
    'M-6 Carnifex': {
        description: 'High-caliber hand cannon with massive damage potential.',
        effects: '• Damage: 2d8\n• Range: Medium\n• Massive damage\n• Limited capacity'
    },
    'M-77 Paladin': {
        description: 'Elite heavy pistol with armor-penetrating rounds.',
        effects: '• Damage: 2d10\n• Range: Medium\n• Armor penetration\n• Elite weapon'
    }
};

const armorData = {
    // Light Armor - Sirta Foundation: Phoenix Armor
    'Phoenix Armor I': {
        description: 'Phoenix Armor emphasizes medical and survival enhancements. Ideal for support and medical roles, it provides modest protection and barriers, supplemented by passive health regeneration.',
        effects: '• Armor Rating: 1\n• Barriers: 5\n• Tech/Biotic Protection: +1\n• Cost: 1,000 credits\n• Allowed Users: Human, Turian, Quarian'
    },
    'Phoenix Armor II': {
        description: 'Phoenix Armor emphasizes medical and survival enhancements. Ideal for support and medical roles, it provides modest protection and barriers, supplemented by passive health regeneration.',
        effects: '• Armor Rating: 3\n• Barriers: 7\n• Tech/Biotic Protection: +2\n• Cost: 2,500 credits\n• Allowed Users: Human, Turian, Quarian'
    },
    'Phoenix Armor III': {
        description: 'Phoenix Armor emphasizes medical and survival enhancements. Ideal for support and medical roles, it provides modest protection and barriers, supplemented by passive health regeneration.',
        effects: '• Armor Rating: 5\n• Barriers: 9\n• Tech/Biotic Protection: +3\n• Medical Enhancement: Once per mission, restore 3 HP at the start of your turn\n• Cost: 6,000 credits\n• Allowed Users: Human, Turian, Quarian'
    },

    // Light Armor - Serrice Council: Phantom Armor
    'Phantom Armor I': {
        description: 'Phantom Armor specializes in providing strong resistance against tech and biotic attacks. Designed specifically for operatives facing high-tech and biotic threats.',
        effects: '• Armor Rating: 2\n• Barriers: 6\n• Tech/Biotic Protection: +2\n• Cost: 1,500 credits\n• Allowed Users: Human, Turian, Asari'
    },
    'Phantom Armor II': {
        description: 'Phantom Armor specializes in providing strong resistance against tech and biotic attacks. Designed specifically for operatives facing high-tech and biotic threats.',
        effects: '• Armor Rating: 4\n• Barriers: 8\n• Tech/Biotic Protection: +3\n• Cost: 3,500 credits\n• Allowed Users: Human, Turian, Asari'
    },
    'Phantom Armor III': {
        description: 'Phantom Armor specializes in providing strong resistance against tech and biotic attacks. Designed specifically for operatives facing high-tech and biotic threats.',
        effects: '• Armor Rating: 6\n• Barriers: 10\n• Tech/Biotic Protection: +4\n• Biotic Attunement: Once per mission, reduce incoming biotic damage by 50% for one turn\n• Cost: 8,000 credits\n• Allowed Users: Human, Turian, Asari'
    },

    // Light Armor - Aldrin Labs: Hydra Armor
    'Hydra Armor I': {
        description: 'Hydra Armor is practical, mass-produced armor designed for operatives requiring balanced defense and mobility.',
        effects: '• Armor Rating: 2\n• Barriers: 6\n• Cost: 1,500 credits\n• Allowed Users: Human, Quarian'
    },
    'Hydra Armor II': {
        description: 'Hydra Armor is practical, mass-produced armor designed for operatives requiring balanced defense and mobility.',
        effects: '• Armor Rating: 4\n• Barriers: 8\n• Cost: 3,500 credits\n• Allowed Users: Human, Quarian'
    },
    'Hydra Armor III': {
        description: 'Hydra Armor is practical, mass-produced armor designed for operatives requiring balanced defense and mobility.',
        effects: '• Armor Rating: 6\n• Barriers: 10\n• Energy Efficiency: Once per mission, reduce the Biotic Energy cost of your next biotic power by 5\n• Cost: 8,000 credits\n• Allowed Users: Human, Quarian'
    },

    // Light Armor - Aldrin Labs: Agent Armor
    'Agent Armor I': {
        description: 'Agent Armor is a versatile, mass-produced Turian-exclusive light armor set. Reliable and affordable but slightly less protective compared to premium armor brands.',
        effects: '• Armor Rating: 2\n• Barriers: 6\n• Cost: 1,500 credits\n• Allowed Users: Turian only'
    },
    'Agent Armor II': {
        description: 'Agent Armor is a versatile, mass-produced Turian-exclusive light armor set. Reliable and affordable but slightly less protective compared to premium armor brands.',
        effects: '• Armor Rating: 4\n• Barriers: 8\n• Cost: 3,500 credits\n• Allowed Users: Turian only'
    },
    'Agent Armor III': {
        description: 'Agent Armor is a versatile, mass-produced Turian-exclusive light armor set. Reliable and affordable but slightly less protective compared to premium armor brands.',
        effects: '• Armor Rating: 6\n• Barriers: 10\n• Cloak and Dagger: When wearer eliminates an enemy in melee, gain +2" movement\n• Cost: 8,000 credits\n• Allowed Users: Turian only'
    },

    // Light Armor - Ariake Technologies: Mercenary Armor
    'Mercenary Armor I': {
        description: 'Mercenary Armor is renowned for its high-grade ablative weave technology. This armor excels in offering balanced protection and improved survivability through damage mitigation.',
        effects: '• Armor Rating: 2\n• Barriers: 6\n• Cost: 1,500 credits\n• Allowed Users: Human, Turian'
    },
    'Mercenary Armor II': {
        description: 'Mercenary Armor is renowned for its high-grade ablative weave technology. This armor excels in offering balanced protection and improved survivability through damage mitigation.',
        effects: '• Armor Rating: 4\n• Barriers: 8\n• Cost: 3,500 credits\n• Allowed Users: Human, Turian'
    },
    'Mercenary Armor III': {
        description: 'Mercenary Armor is renowned for its high-grade ablative weave technology. This armor excels in offering balanced protection and improved survivability through damage mitigation.',
        effects: '• Armor Rating: 6\n• Barriers: 10\n• Enhanced Ablative Weave: Once per mission, reduce incoming weapon damage by 50% for one turn\n• Cost: 8,000 credits\n• Allowed Users: Human, Turian'
    },

    // Light Armor - Devlon Industries: Explorer Armor
    'Explorer Armor I': {
        description: 'Explorer Armor is designed specifically for environmental resilience. Favored by adventurers and explorers, this armor provides balanced protection and barrier strength.',
        effects: '• Armor Rating: 1\n• Barriers: 4\n• Tech/Biotic Protection: +1\n• Cost: 1,000 credits\n• Allowed Users: Human, Turian, Quarian, Asari'
    },
    'Explorer Armor II': {
        description: 'Explorer Armor is designed specifically for environmental resilience. Favored by adventurers and explorers, this armor provides balanced protection and barrier strength.',
        effects: '• Armor Rating: 2\n• Barriers: 6\n• Tech/Biotic Protection: +2\n• Cost: 2,500 credits\n• Allowed Users: Human, Turian, Quarian, Asari'
    },
    'Explorer Armor III': {
        description: 'Explorer Armor is designed specifically for environmental resilience. Favored by adventurers and explorers, this armor provides balanced protection and barrier strength.',
        effects: '• Armor Rating: 3\n• Barriers: 8\n• Tech/Biotic Protection: +3\n• Environmental Seals: Grants resistance to Level 1 environmental hazards\n• Cost: 5,500 credits\n• Allowed Users: Human, Turian, Quarian, Asari'
    },

    // Light Armor - Elkoss Combine: Assassin Armor
    'Assassin Armor I': {
        description: 'Assassin Armor is a budget-friendly, functional armor that prioritizes simplicity and effectiveness. Designed for human operatives, it offers reliable protection at an affordable price.',
        effects: '• Armor Rating: 2\n• Barriers: 5\n• Cost: 900 credits\n• Allowed Users: Human'
    },
    'Assassin Armor II': {
        description: 'Assassin Armor is a budget-friendly, functional armor that prioritizes simplicity and effectiveness. Designed for human operatives, it offers reliable protection at an affordable price.',
        effects: '• Armor Rating: 4\n• Barriers: 7\n• Cost: 2,200 credits\n• Allowed Users: Human'
    },
    'Assassin Armor III': {
        description: 'Assassin Armor is a budget-friendly, functional armor that prioritizes simplicity and effectiveness. Designed for human operatives, it offers reliable protection at an affordable price.',
        effects: '• Armor Rating: 6\n• Barriers: 9\n• Shadow Operative: Once per mission, reroll one failed hit roll\n• Cost: 5,000 credits\n• Allowed Users: Human'
    },

    // Light Armor - ERCS: Duelist Armor
    'Duelist Armor I': {
        description: 'Duelist Armor is a budget-friendly option emphasizing mobility and agile defense. Designed for operatives who rely more on avoiding attacks rather than enduring them.',
        effects: '• Armor Rating: 2\n• Barriers: 6\n• Cost: 1,250 credits\n• Allowed Users: Human, Turian'
    },
    'Duelist Armor II': {
        description: 'Duelist Armor is a budget-friendly option emphasizing mobility and agile defense. Designed for operatives who rely more on avoiding attacks rather than enduring them.',
        effects: '• Armor Rating: 4\n• Barriers: 8\n• Cost: 3,000 credits\n• Allowed Users: Human, Turian'
    },
    'Duelist Armor III': {
        description: 'Duelist Armor is a budget-friendly option emphasizing mobility and agile defense. Designed for operatives who rely more on avoiding attacks rather than enduring them.',
        effects: '• Armor Rating: 6\n• Barriers: 10\n• Quick Reflexes: Once per mission, after an attack is declared against you but before it is rolled, gain +2 Evasion for the rest of the turn\n• Cost: 7,000 credits\n• Allowed Users: Human, Turian'
    },

    // Medium Armor - ERCS: Guardian Armor
    'Guardian Armor I': {
        description: 'Guardian Armor is a cost-effective armor series designed for affordability and practical defense. Ideal for budget-conscious operatives, it provides decent protection without sacrificing mobility or simplicity.',
        effects: '• Armor Rating: 2\n• Barriers: 6\n• Cost: 1,250 credits\n• Allowed Users: Human, Turian'
    },
    'Guardian Armor II': {
        description: 'Guardian Armor is a cost-effective armor series designed for affordability and practical defense. Ideal for budget-conscious operatives, it provides decent protection without sacrificing mobility or simplicity.',
        effects: '• Armor Rating: 4\n• Barriers: 8\n• Cost: 3,000 credits\n• Allowed Users: Human, Turian'
    },
    'Guardian Armor III': {
        description: 'Guardian Armor is a cost-effective armor series designed for affordability and practical defense. Ideal for budget-conscious operatives, it provides decent protection without sacrificing mobility or simplicity.',
        effects: '• Armor Rating: 6\n• Barriers: 10\n• Shock Absorption Padding: Once per mission, negate a Stun or Knockdown effect immediately after it is applied to the wearer\n• Cost: 7,000 credits\n• Allowed Users: Human, Turian'
    },

    // Medium Armor - Hahne-Kedar: Mantis Armor
    'Mantis Armor I': {
        description: 'Mantis Armor is versatile medium armor designed for operatives engaged in direct combat situations. Offering balanced protection, barriers, and moderate tech/biotic resistance.',
        effects: '• Armor Rating: 3\n• Barriers: 7\n• Cost: 2,500 credits\n• Allowed Users: Human, Turian'
    },
    'Mantis Armor II': {
        description: 'Mantis Armor is versatile medium armor designed for operatives engaged in direct combat situations. Offering balanced protection, barriers, and moderate tech/biotic resistance.',
        effects: '• Armor Rating: 5\n• Barriers: 9\n• Tech/Biotic Protection: +1\n• Cost: 5,500 credits\n• Allowed Users: Human, Turian'
    },
    'Mantis Armor III': {
        description: 'Mantis Armor is versatile medium armor designed for operatives engaged in direct combat situations. Offering balanced protection, barriers, and moderate tech/biotic resistance.',
        effects: '• Armor Rating: 7\n• Barriers: 11\n• Tech/Biotic Protection: +2\n• Precision Targeting Suite: Once per mission, add +1 to your combat rolls for the remainder of the turn\n• Cost: 12,000 credits\n• Allowed Users: Human, Turian'
    },

    // Medium Armor - Hahne-Kedar: Silverback Armor
    'Silverback Armor I': {
        description: 'Silverback Armor is sturdy and dependable medium armor designed for frontline command and battlefield leadership. It provides strong protection and superior tech/biotic resistance.',
        effects: '• Armor Rating: 3\n• Barriers: 7\n• Tech/Biotic Protection: +1\n• Cost: 2,500 credits\n• Allowed Users: Human, Turian'
    },
    'Silverback Armor II': {
        description: 'Silverback Armor is sturdy and dependable medium armor designed for frontline command and battlefield leadership. It provides strong protection and superior tech/biotic resistance.',
        effects: '• Armor Rating: 5\n• Barriers: 9\n• Tech/Biotic Protection: +2\n• Cost: 5,500 credits\n• Allowed Users: Human, Turian'
    },
    'Silverback Armor III': {
        description: 'Silverback Armor is sturdy and dependable medium armor designed for frontline command and battlefield leadership. It provides strong protection and superior tech/biotic resistance.',
        effects: '• Armor Rating: 7\n• Barriers: 11\n• Tech/Biotic Protection: +3\n• Hold the Line: Once per mission, you and all allies within 3" gain +1 Armor until the start of your next turn\n• Cost: 12,000 credits\n• Allowed Users: Human, Turian'
    },

    // Medium Armor - Rosenkov Materials: Thermal Armor
    'Thermal Armor I': {
        description: 'Thermal Armor is engineered for operatives working in hazardous environments. Its integrated environmental shielding and thermal regulation systems make it ideal for survival in extreme conditions.',
        effects: '• Armor Rating: 3\n• Barriers: 7\n• Tech/Biotic Protection: +1\n• Cost: 3,000 credits\n• Allowed Users: Human, Turian'
    },
    'Thermal Armor II': {
        description: 'Thermal Armor is engineered for operatives working in hazardous environments. Its integrated environmental shielding and thermal regulation systems make it ideal for survival in extreme conditions.',
        effects: '• Armor Rating: 5\n• Barriers: 9\n• Tech/Biotic Protection: +2\n• Cost: 6,500 credits\n• Allowed Users: Human, Turian'
    },
    'Thermal Armor III': {
        description: 'Thermal Armor is engineered for operatives working in hazardous environments. Its integrated environmental shielding and thermal regulation systems make it ideal for survival in extreme conditions.',
        effects: '• Armor Rating: 7\n• Barriers: 11\n• Tech/Biotic Protection: +3\n• Thermal Conditioning: Ignore damage from environmental hazards or hazard-based effects\n• Cost: 14,000 credits\n• Allowed Users: Human, Turian'
    },

    // Medium Armor - Aldrin Labs: Onyx Armor
    'Onyx Armor I': {
        description: 'Onyx Armor is medium armor known for its reliability and affordability. Favored by versatile operatives, it provides balanced protection and barrier strength without specialized tech or biotic protection.',
        effects: '• Armor Rating: 2\n• Barriers: 6\n• Cost: 1,500 credits\n• Allowed Users: Human, Turian, Quarian'
    },
    'Onyx Armor II': {
        description: 'Onyx Armor is medium armor known for its reliability and affordability. Favored by versatile operatives, it provides balanced protection and barrier strength without specialized tech or biotic protection.',
        effects: '• Armor Rating: 4\n• Barriers: 8\n• Cost: 3,500 credits\n• Allowed Users: Human, Turian, Quarian'
    },
    'Onyx Armor III': {
        description: 'Onyx Armor is medium armor known for its reliability and affordability. Favored by versatile operatives, it provides balanced protection and barrier strength without specialized tech or biotic protection.',
        effects: '• Armor Rating: 6\n• Barriers: 10\n• Lightweight Build: Passive effect. Gain +1" movement while wearing this armor\n• Cost: 8,000 credits\n• Allowed Users: Human, Turian, Quarian'
    },

    // Medium Armor - Armax Arsenal: Predator Armor
    'Predator Armor I': {
        description: 'Predator Armor is high-performance, military-grade medium armor designed for intense combat scenarios. It features strong barriers, solid armor plating, and considerable tech and biotic defense.',
        effects: '• Armor Rating: 4\n• Barriers: 8\n• Tech/Biotic Protection: +1\n• Cost: 5,000 credits\n• Allowed Users: Human, Turian, Krogan'
    },
    'Predator Armor II': {
        description: 'Predator Armor is high-performance, military-grade medium armor designed for intense combat scenarios. It features strong barriers, solid armor plating, and considerable tech and biotic defense.',
        effects: '• Armor Rating: 6\n• Barriers: 10\n• Tech/Biotic Protection: +2\n• Cost: 10,000 credits\n• Allowed Users: Human, Turian, Krogan'
    },
    'Predator Armor III': {
        description: 'Predator Armor is high-performance, military-grade medium armor designed for intense combat scenarios. It features strong barriers, solid armor plating, and considerable tech and biotic defense.',
        effects: '• Armor Rating: 8\n• Barriers: 12\n• Tech/Biotic Protection: +3\n• Shield Overload: Once per mission, when your Barriers drop to 0, instantly regain 3 Barriers\n• Cost: 20,000 credits\n• Allowed Users: Human, Turian, Krogan'
    },

    // Medium Armor - Devlon Industries: Liberator Armor
    'Liberator Armor I': {
        description: 'Liberator Armor provides robust environmental hazard resistance, suitable for operatives engaging in varied planetary operations. Balanced armor protection combined with reliable barriers.',
        effects: '• Armor Rating: 2\n• Barriers: 5\n• Cost: 1,500 credits\n• Allowed Users: Human, Turian, Krogan'
    },
    'Liberator Armor II': {
        description: 'Liberator Armor provides robust environmental hazard resistance, suitable for operatives engaging in varied planetary operations. Balanced armor protection combined with reliable barriers.',
        effects: '• Armor Rating: 4\n• Barriers: 7\n• Tech/Biotic Protection: +1\n• Cost: 3,500 credits\n• Allowed Users: Human, Turian, Krogan'
    },
    'Liberator Armor III': {
        description: 'Liberator Armor provides robust environmental hazard resistance, suitable for operatives engaging in varied planetary operations. Balanced armor protection combined with reliable barriers.',
        effects: '• Armor Rating: 6\n• Barriers: 9\n• Tech/Biotic Protection: +2\n• Environmental Seals: Provides resistance to environmental hazards\n• Cost: 8,000 credits\n• Allowed Users: Human, Turian, Krogan'
    },

    // Medium Armor - Elkoss Combine: Gladiator Armor
    'Gladiator Armor I': {
        description: 'Gladiator Armor provides affordable and functional protection for frontline operatives. The armor emphasizes resilience and combat effectiveness.',
        effects: '• Armor Rating: 2\n• Barriers: 5\n• Cost: 900 credits\n• Allowed Users: Human, Turian'
    },
    'Gladiator Armor II': {
        description: 'Gladiator Armor provides affordable and functional protection for frontline operatives. The armor emphasizes resilience and combat effectiveness.',
        effects: '• Armor Rating: 4\n• Barriers: 7\n• Cost: 2,200 credits\n• Allowed Users: Human, Turian'
    },
    'Gladiator Armor III': {
        description: 'Gladiator Armor provides affordable and functional protection for frontline operatives. The armor emphasizes resilience and combat effectiveness.',
        effects: '• Armor Rating: 6\n• Barriers: 9\n• Gladiator\'s Guard: Once per mission, when targeted by an attack but before damage is rolled, gain +1 Armor for the rest of the turn\n• Cost: 5,000 credits\n• Allowed Users: Human, Turian'
    },

    // Heavy Armor - ERCS: Warlord Armor
    'Warlord Armor I': {
        description: 'Warlord Armor is an affordable yet sturdy heavy armor specifically designed for Krogan warriors. The armor provides reliable protection at the expense of advanced shielding and mobility.',
        effects: '• Armor Rating: 3\n• Barriers: 7\n• Cost: 2,500 credits\n• Allowed Users: Krogan'
    },
    'Warlord Armor II': {
        description: 'Warlord Armor is an affordable yet sturdy heavy armor specifically designed for Krogan warriors. The armor provides reliable protection at the expense of advanced shielding and mobility.',
        effects: '• Armor Rating: 5\n• Barriers: 9\n• Cost: 5,500 credits\n• Allowed Users: Krogan'
    },
    'Warlord Armor III': {
        description: 'Warlord Armor is an affordable yet sturdy heavy armor specifically designed for Krogan warriors. The armor provides reliable protection at the expense of advanced shielding and mobility.',
        effects: '• Armor Rating: 7\n• Barriers: 11\n• Heavyweight Build: Passive effect. Wearer suffers -1" movement but gains +1 melee damage permanently\n• Cost: 12,000 credits\n• Allowed Users: Krogan'
    },

    // Heavy Armor - Geth Armory: Battlemaster Armor
    'Battlemaster Armor I': {
        description: 'Battlemaster Armor is elite heavy armor designed exclusively for Krogan warriors. It provides exceptional barriers and outstanding tech/biotic protection.',
        effects: '• Armor Rating: 5\n• Barriers: 9\n• Tech/Biotic Protection: +3\n• Cost: 70,000 credits\n• Allowed Users: Krogan'
    },
    'Battlemaster Armor II': {
        description: 'Battlemaster Armor is elite heavy armor designed exclusively for Krogan warriors. It provides exceptional barriers and outstanding tech/biotic protection.',
        effects: '• Armor Rating: 7\n• Barriers: 11\n• Tech/Biotic Protection: +4\n• Cost: 350,000 credits\n• Allowed Users: Krogan'
    },
    'Battlemaster Armor III': {
        description: 'Battlemaster Armor is elite heavy armor designed exclusively for Krogan warriors. It provides exceptional barriers and outstanding tech/biotic protection.',
        effects: '• Armor Rating: 9\n• Barriers: 13\n• Tech/Biotic Protection: +5\n• Geth Shielding: Once per mission, negate one tech or biotic attack completely\n• Cost: 800,000 credits\n• Allowed Users: Krogan'
    },

    // Heavy Armor - Geth Armory: Berserker Armor
    'Berserker Armor I': {
        description: 'Berserker Armor is elite heavy armor designed specifically for Krogan warriors. It provides exceptional protection, superior barriers, and strong tech/biotic defenses.',
        effects: '• Armor Rating: 5\n• Barriers: 9\n• Tech/Biotic Protection: +3\n• Cost: 70,000 credits\n• Allowed Users: Krogan'
    },
    'Berserker Armor II': {
        description: 'Berserker Armor is elite heavy armor designed specifically for Krogan warriors. It provides exceptional protection, superior barriers, and strong tech/biotic defenses.',
        effects: '• Armor Rating: 7\n• Barriers: 11\n• Tech/Biotic Protection: +4\n• Cost: 350,000 credits\n• Allowed Users: Krogan'
    },
    'Berserker Armor III': {
        description: 'Berserker Armor is elite heavy armor designed specifically for Krogan warriors. It provides exceptional protection, superior barriers, and strong tech/biotic defenses.',
        effects: '• Armor Rating: 9\n• Barriers: 13\n• Tech/Biotic Protection: +5\n• Berserker Rage: Once per mission, gain +2 melee damage on the next melee attack made this turn\n• Cost: 800,000 credits\n• Allowed Users: Krogan'
    },

    // Heavy Armor - Geth Armory: Rage Armor
    'Rage Armor I': {
        description: 'Rage Armor is a premium Krogan-exclusive armor set. It\'s designed with superior shields and exceptional tech/biotic resistance, ideal for elite Krogan warriors.',
        effects: '• Armor Rating: 5\n• Barriers: 9\n• Tech/Biotic Protection: +3\n• Cost: 70,000 credits\n• Allowed Users: Krogan only'
    },
    'Rage Armor II': {
        description: 'Rage Armor is a premium Krogan-exclusive armor set. It\'s designed with superior shields and exceptional tech/biotic resistance, ideal for elite Krogan warriors.',
        effects: '• Armor Rating: 7\n• Barriers: 11\n• Tech/Biotic Protection: +4\n• Cost: 350,000 credits\n• Allowed Users: Krogan only'
    },
    'Rage Armor III': {
        description: 'Rage Armor is a premium Krogan-exclusive armor set. It\'s designed with superior shields and exceptional tech/biotic resistance, ideal for elite Krogan warriors.',
        effects: '• Armor Rating: 9\n• Barriers: 13\n• Tech/Biotic Protection: +5\n• Emergency Barrier: Once per mission, when Barriers are depleted, instantly gain 3 temporary Barriers\n• Cost: 800,000 credits\n• Allowed Users: Krogan only'
    },

    // Heavy Armor - Hahne-Kedar: Scorpion Armor
    'Scorpion Armor I': {
        description: 'Scorpion Armor is rugged, frontline armor designed to withstand disorienting force and stay operational. It provides solid physical and barrier protection with moderate tech/biotic resistance.',
        effects: '• Armor Rating: 4\n• Barriers: 8\n• Cost: 3,000 credits\n• Allowed Users: Human, Krogan'
    },
    'Scorpion Armor II': {
        description: 'Scorpion Armor is rugged, frontline armor designed to withstand disorienting force and stay operational. It provides solid physical and barrier protection with moderate tech/biotic resistance.',
        effects: '• Armor Rating: 6\n• Barriers: 10\n• Tech/Biotic Protection: +1\n• Cost: 6,000 credits\n• Allowed Users: Human, Krogan'
    },
    'Scorpion Armor III': {
        description: 'Scorpion Armor is rugged, frontline armor designed to withstand disorienting force and stay operational. It provides solid physical and barrier protection with moderate tech/biotic resistance.',
        effects: '• Armor Rating: 8\n• Barriers: 12\n• Tech/Biotic Protection: +2\n• Shock Stabilizers: Once per mission, ignore the effects of being Stunned or made Prone\n• Cost: 14,000 credits\n• Allowed Users: Human, Krogan'
    },

    // Heavy Armor - Kassa Fabrication: Colossus Armor
    'Colossus Armor I': {
        description: 'The Colossus Armor series represents the pinnacle of personal protection. Known for outstanding durability and superior barrier regeneration, it\'s the top choice for elite operatives.',
        effects: '• Armor Rating: 5\n• Barriers: 9\n• Tech/Biotic Protection: +1\n• Cost: 174,000 credits\n• Allowed Users: Human, Krogan'
    },
    'Colossus Armor II': {
        description: 'The Colossus Armor series represents the pinnacle of personal protection. Known for outstanding durability and superior barrier regeneration, it\'s the top choice for elite operatives.',
        effects: '• Armor Rating: 7\n• Barriers: 11\n• Tech/Biotic Protection: +2\n• Cost: 420,000 credits\n• Allowed Users: Human, Krogan'
    },
    'Colossus Armor III': {
        description: 'The Colossus Armor series represents the pinnacle of personal protection. Known for outstanding durability and superior barrier regeneration, it\'s the top choice for elite operatives.',
        effects: '• Armor Rating: 9\n• Barriers: 13\n• Tech/Biotic Protection: +3\n• Micro-Generator Shielding: Once per mission, instantly restore 5 Barriers\n• Cost: 560,000 credits\n• Allowed Users: Human, Krogan'
    },

    // Heavy Armor - Rosenkov Materials: Titan Armor
    'Titan Armor I': {
        description: 'Titan Armor is highly durable heavy armor known for robust and reactive defenses. Ideal for front-line operatives, Titan Armor provides substantial barriers and armor protection.',
        effects: '• Armor Rating: 4\n• Barriers: 8\n• Cost: 3,500 credits\n• Allowed Users: Human, Krogan'
    },
    'Titan Armor II': {
        description: 'Titan Armor is highly durable heavy armor known for robust and reactive defenses. Ideal for front-line operatives, Titan Armor provides substantial barriers and armor protection.',
        effects: '• Armor Rating: 6\n• Barriers: 10\n• Tech/Biotic Protection: +1\n• Cost: 8,000 credits\n• Allowed Users: Human, Krogan'
    },
    'Titan Armor III': {
        description: 'Titan Armor is highly durable heavy armor known for robust and reactive defenses. Ideal for front-line operatives, Titan Armor provides substantial barriers and armor protection.',
        effects: '• Armor Rating: 8\n• Barriers: 12\n• Tech/Biotic Protection: +2\n• Reactive Plating: Once per mission, after taking damage, gain +2 Armor for the rest of the turn\n• Cost: 18,000 credits\n• Allowed Users: Human, Krogan'
    },

    // Heavy Armor - Rosenkov Materials: Ursa Armor
    'Ursa Armor I': {
        description: 'Ursa Armor is Rosenkov Materials\' premier tank-class armor. Forged for maximum battlefield resilience, it allows frontline units to absorb punishment and keep pressing forward.',
        effects: '• Armor Rating: 5\n• Barriers: 9\n• Tech/Biotic Protection: +1\n• Cost: 6,000 credits\n• Allowed Users: Human, Krogan'
    },
    'Ursa Armor II': {
        description: 'Ursa Armor is Rosenkov Materials\' premier tank-class armor. Forged for maximum battlefield resilience, it allows frontline units to absorb punishment and keep pressing forward.',
        effects: '• Armor Rating: 7\n• Barriers: 11\n• Tech/Biotic Protection: +2\n• Cost: 13,000 credits\n• Allowed Users: Human, Krogan'
    },
    'Ursa Armor III': {
        description: 'Ursa Armor is Rosenkov Materials\' premier tank-class armor. Forged for maximum battlefield resilience, it allows frontline units to absorb punishment and keep pressing forward.',
        effects: '• Armor Rating: 9\n• Barriers: 13\n• Tech/Biotic Protection: +3\n• Unstoppable Bulk: Once per mission, when you take damage, reduce it by 2 and become immune to being Stunned or made Prone for the rest of the turn\n• Cost: 28,000 credits\n• Allowed Users: Human, Krogan'
    },

    // Heavy Armor - Armax Arsenal: Predator X Armor
    'Predator X Armor I': {
        description: 'Predator X Armor is a heavy-duty variant designed for maximum frontline durability and combat resilience. This armor excels in providing substantial physical protection and robust barriers.',
        effects: '• Armor Rating: 5\n• Barriers: 9\n• Tech/Biotic Protection: +1\n• Cost: 7,500 credits\n• Allowed Users: Human, Krogan'
    },
    'Predator X Armor II': {
        description: 'Predator X Armor is a heavy-duty variant designed for maximum frontline durability and combat resilience. This armor excels in providing substantial physical protection and robust barriers.',
        effects: '• Armor Rating: 7\n• Barriers: 11\n• Tech/Biotic Protection: +2\n• Cost: 15,000 credits\n• Allowed Users: Human, Krogan'
    },
    'Predator X Armor III': {
        description: 'Predator X Armor is a heavy-duty variant designed for maximum frontline durability and combat resilience. This armor excels in providing substantial physical protection and robust barriers.',
        effects: '• Armor Rating: 9\n• Barriers: 13\n• Tech/Biotic Protection: +3\n• Fortress Protocol: Once per mission, gain +2 Armor but -1" movement for the next 2 turns\n• Cost: 30,000 credits\n• Allowed Users: Human, Krogan'
    }
};

const omniToolData = {
    // Tier 1
    'Hahne-Kedar OT-11': {
        description: 'Basic Hahne-Kedar omni-tool with range enhancement capabilities.',
        effects: 'Manufacturer: Hahne-Kedar\nCost: 100 credits | Rarity: Common\n\nPassive Bonus:\n• +1 Power Range\n\nSpecial Effect (Once per Combat):\n• Refund TP if a Tech attack misses'
    },
    'Elanus \'Hornet\' Interface': {
        description: 'Elanus Risk Control omni-tool focused on attack enhancement.',
        effects: 'Manufacturer: Elanus Risk Control\nCost: 125 credits | Rarity: Common\n\nPassive Bonus:\n• +1 Power Attack\n\nSpecial Effect (Once per Combat):\n• Reroll one Tech attack roll'
    },
    'Rosenkov \'Patchline\'': {
        description: 'Rosenkov Materials omni-tool optimized for utility applications.',
        effects: 'Manufacturer: Rosenkov Materials\nCost: 125 credits | Rarity: Common\n\nPassive Bonus:\n• -1 TP cost for non-damaging Tech abilities\n\nSpecial Effect (Once per Combat):\n• Auto-succeed on one tech Interact'
    },

    // Tier 2
    'Serrice \'Corelink\' Harness': {
        description: 'Serrice Council omni-tool with balanced enhancement capabilities.',
        effects: 'Manufacturer: Serrice Council\nCost: 400 credits | Rarity: Rare\n\nPassive Bonuses:\n• +1 Power Range\n• +1 Power Attack\n\nSpecial Effect (Once per Combat):\n• Use a Tech ability as a Free Action'
    },
    'Armax Tactical Uplink': {
        description: 'Armax Arsenal omni-tool designed for combat applications.',
        effects: 'Manufacturer: Armax Arsenal\nCost: 450 credits | Rarity: Rare\n\nPassive Bonus:\n• +2 Power Attack\n\nSpecial Effect (Once per Combat):\n• Ignore cover bonuses for one Tech attack'
    },
    'Devlon \'Pathfinder\' Toolset': {
        description: 'Devlon Industries omni-tool for utility and exploration.',
        effects: 'Manufacturer: Devlon Industries\nCost: 375 credits | Rarity: Uncommon\n\nPassive Bonus:\n• -1 TP cost for utility Tech powers\n\nSpecial Effect (Once per Combat):\n• Cast one Tech ability without needing line of sight'
    },

    // Tier 3
    'Ariake \'Phantom\' Suite': {
        description: 'Ariake Technologies elite omni-tool with advanced capabilities.',
        effects: 'Manufacturer: Ariake Technologies\nCost: 900 credits | Rarity: Very Rare\n\nPassive Bonuses:\n• +2 Power Range\n• +1 Power Attack\n\nSpecial Effect (Once per Combat):\n• Cast the same Tech ability twice in one action'
    },
    'Kassa \'Vanguard\' Neural Link': {
        description: 'Kassa Fabrication omni-tool with neural interface technology.',
        effects: 'Manufacturer: Kassa Fabrication\nCost: 1,000 credits | Rarity: Very Rare\n\nPassive Bonus:\n• +2 Power Attack\n\nSpecial Effect (Once per Combat):\n• All Tech abilities cost -1 TP this round'
    },
    'Elanus \'Sovereign\' Node Array': {
        description: 'Elanus Risk Control legendary omni-tool with unmatched precision.',
        effects: 'Manufacturer: Elanus Risk Control\nCost: 1,200 credits | Rarity: Legendary\n\nPassive Bonus:\n• +2 Power Attack\n\nSpecial Effect (Once per Combat):\n• Ignore Evasion on one Tech attack'
    }
};

const bioticAmpData = {
    // Tier 1
    'L1 Biotic Amp': {
        description: 'Standard military-grade biotic amplifier with range enhancement.',
        effects: 'Cost: 500 credits | Rarity: Standard\n\nPassive Bonus:\n• +1 hex Biotic Power Range\n\nSpecial Effect (Once per Combat):\n• Gain +1 to a Biotic attack roll'
    },
    'L2 Biotic Amp': {
        description: 'Advanced biotic amplifier with cost reduction capabilities.',
        effects: 'Cost: 500 credits | Rarity: Standard\n\nPassive Bonus:\n• Reduce BE cost of 1 ability by 1\n\nSpecial Effect (Once per Combat):\n• Regain 1 BE after using a Biotic ability'
    },
    'Elanus Nova Amp': {
        description: 'Elanus Risk Control biotic amplifier with energy regeneration.',
        effects: 'Manufacturer: Elanus Risk Control\nCost: 500 credits | Rarity: Standard\n\nPassive Bonus:\n• +1 BE Regen at turn start\n\nSpecial Effect (Once per Combat):\n• Use any Tier 1 Biotic power without spending BE'
    },
    'Ariake Pulse Amp': {
        description: 'Ariake Technologies amplifier specialized for kinetic powers.',
        effects: 'Manufacturer: Ariake Technologies\nCost: 500 credits | Rarity: Standard\n\nPassive Bonus:\n• +1 to Biotics rolls with Push or Pull\n\nSpecial Effect (Once per Combat):\n• Push or Pull gains +2 range'
    },
    'Harmonix Focus Amp': {
        description: 'Harmonix Systems amplifier optimized for Biotic Charge.',
        effects: 'Manufacturer: Harmonix Systems\nCost: 500 credits | Rarity: Standard\n\nPassive Bonus:\n• +1 Evasion when using Biotic Charge\n\nSpecial Effect (Once per Combat):\n• Biotic Charge deals +1d6 damage'
    },

    // Tier 2
    'L3 Biotic Amp': {
        description: 'Advanced biotic amplifier with extended range capabilities.',
        effects: 'Cost: 1,500 credits | Rarity: Rare\n\nPassive Bonus:\n• +2 hexes Biotic Power Range\n\nSpecial Effect (Once per Combat):\n• Ignore line-of-sight for a Biotic attack'
    },
    'L4 Biotic Amp': {
        description: 'Professional-grade amplifier with enhanced cost reduction.',
        effects: 'Cost: 1,500 credits | Rarity: Rare\n\nPassive Bonus:\n• Reduce BE cost of 2 abilities by 1\n\nSpecial Effect (Once per Combat):\n• Immediately regain 2 BE'
    },
    'Aldrin Catalyst Amp': {
        description: 'Aldrin Labs amplifier with regenerative capabilities.',
        effects: 'Manufacturer: Aldrin Labs\nCost: 1,500 credits | Rarity: Rare\n\nPassive Bonus:\n• +2 BE Regen at mission start\n\nSpecial Effect (Once per Combat):\n• Heal 1 HP when using any Biotic power'
    },
    'Serrice Resonance Amp': {
        description: 'Serrice Council amplifier specialized for Warp and Singularity.',
        effects: 'Manufacturer: Serrice Council\nCost: 1,500 credits | Rarity: Rare\n\nPassive Bonus:\n• +1 to Biotics rolls with Warp or Singularity\n\nSpecial Effect (Once per Combat):\n• Ignore armor when using Warp'
    },
    'Harmonix Surge Amp': {
        description: 'Harmonix Systems advanced Biotic Charge amplifier.',
        effects: 'Manufacturer: Harmonix Systems\nCost: 1,500 credits | Rarity: Rare\n\nPassive Bonus:\n• +1 Combat after Biotic Charge (1 turn)\n\nSpecial Effect (Once per Combat):\n• Stun target after Charge'
    },

    // Tier 3
    'L5 Biotic Amp': {
        description: 'Elite biotic amplifier with maximum range enhancement.',
        effects: 'Cost: 3,000 credits | Rarity: Elite\n\nPassive Bonus:\n• +3 hexes Biotic Power Range\n\nSpecial Effect (Once per Combat):\n• All Biotic attacks gain +1 range this round'
    },
    'L6 Biotic Amp': {
        description: 'Ultimate biotic amplifier with maximum cost reduction.',
        effects: 'Cost: 3,000 credits | Rarity: Elite\n\nPassive Bonus:\n• Reduce BE cost of 3 abilities by 1\n\nSpecial Effect (Once per Combat):\n• Regain 3 BE instantly'
    },
    'Rosenkov Kinetic Amp': {
        description: 'Rosenkov Materials amplifier with massive energy reserves.',
        effects: 'Manufacturer: Rosenkov Materials\nCost: 3,000 credits | Rarity: Elite\n\nPassive Bonus:\n• +3 BE Regen at mission start\n\nSpecial Effect (Once per Combat):\n• Next Biotic power used gains +1d6 damage'
    },
    'Serrice Overload Amp': {
        description: 'Serrice Council elite amplifier with universal enhancement.',
        effects: 'Manufacturer: Serrice Council\nCost: 3,000 credits | Rarity: Elite\n\nPassive Bonus:\n• +1 to all Biotics rolls\n\nSpecial Effect (Once per Combat):\n• Biotic attacks ignore cover'
    },
    'Harmonix Apex Amp': {
        description: 'Harmonix Systems ultimate Biotic Charge amplifier.',
        effects: 'Manufacturer: Harmonix Systems\nCost: 3,000 credits | Rarity: Elite\n\nPassive Bonus:\n• After Charge, next melee +1d6 damage\n\nSpecial Effect (Once per Combat):\n• Gain +1 Evasion for rest of turn after Charge'
    }
};

// Enhanced power data with upgrade trees
const bioticPowersUpgradeData = {
    'Throw': {
        tier: 1,
        baseCost: 3, // BE
        range: 10,
        damageType: 'Biotic',
        targeting: 'Single enemy within line of sight',
        xpCost: 30,
        base: {
            description: 'You seize an enemy with biotic force and hurl them through the air.',
            effects: 'Cost: 3 BE | Range: 10 hexes | Damage Type: Biotic\n\nEffect: Make a Biotics vs. Evasion attack roll:\n• On hit target takes:\n  - Hurled up to 3 hexes in direction of your choice and Knocked Prone\n  - If target is currently Lifted, throwing distance increases to 5 hexes\n  - 1d6 + Biotics collision damage if they hit terrain, objects, or figures vs. All Enemy Types\n• On miss: No effect\n\nSpecial:\n• Both target and any figure they collide with take collision damage\n• Collision damage is reduced by Armor\n• You choose the direction of the throw\n\nQuick Cast Compatibility:\n• Can be combined with other Tier 1 or Tier 2 powers using Quick Cast rules\n• Cost becomes 4 BE when Quick Cast\n• Both powers suffer -2 to hit when Quick Cast\n• Excellent for repositioning enemies before using area powers'
        },
        level5: [
            {
                name: 'Powerful Throw',
                cost: 5,
                xpCost: 48,
                description: 'Enhances collision force for increased damage.',
                effects: 'Cost: 5 BE | Range: 10 hexes\n\nEffect: You seize an enemy with biotic force and hurl them through the air with devastating impact. Make a Biotics vs. Evasion attack roll:\n• On hit target takes:\n  - Hurled up to 3 hexes in direction of your choice and Knocked Prone\n  - If target is currently Lifted, throwing distance increases to 5 hexes\n  - 1d8 + Biotics collision damage if they hit terrain, objects, or figures vs. All Enemy Types\n• On miss: No effect\n\nSpecial:\n• Both target and any figure they collide with take enhanced collision damage\n• Collision damage is reduced by Armor\n• You choose the direction of the throw'
            },
            {
                name: 'Extended Throw',
                cost: 5,
                xpCost: 48,
                description: 'Increases throwing range for better positioning options.',
                effects: 'Cost: 5 BE | Range: 10 hexes\n\nEffect: You seize an enemy with biotic force and hurl them across greater distances. Make a Biotics vs. Evasion attack roll:\n• On hit target takes:\n  - Hurled up to 5 hexes in direction of your choice and Knocked Prone\n  - If target is currently Lifted, throwing distance increases to 7 hexes\n  - 1d6 + Biotics collision damage if they hit terrain, objects, or figures vs. All Enemy Types\n• On miss: No effect\n\nSpecial:\n• Both target and any figure they collide with take collision damage\n• Collision damage is reduced by Armor\n• Greater throwing distance creates more positioning opportunities'
            }
        ],
        level10: [
            {
                name: 'Explosive Throw',
                cost: 8,
                xpCost: 77,
                description: 'Replaces Powerful Throw with chain collision effects.',
                effects: 'Cost: 8 BE | Range: 10 hexes\n\nEffect: You seize an enemy with biotic force and hurl them with explosive impact. Make a Biotics vs. Evasion attack roll:\n• On hit target takes:\n  - Hurled up to 3 hexes in direction of your choice and Knocked Prone\n  - If target is currently Lifted, throwing distance increases to 5 hexes\n  - 2d4 + Biotics collision damage if they hit terrain, objects, or figures vs. All Enemy Types\n  - If target hits another figure, that figure is also Knocked Prone and pushed 1 hex away\n• On miss: No effect\n\nSpecial:\n• Both target and collision victim take full collision damage\n• Chain effects can disrupt multiple enemy positions\n• Collision damage is reduced by Armor'
            },
            {
                name: 'Long Throw',
                cost: 8,
                xpCost: 77,
                description: 'Replaces Extended Throw with debuffing collision effects.',
                effects: 'Cost: 8 BE | Range: 10 hexes\n\nEffect: You seize an enemy with biotic force and hurl them across vast distances. Make a Biotics vs. Evasion attack roll:\n• On hit target takes:\n  - Hurled up to 7 hexes in direction of your choice and Knocked Prone\n  - If target is currently Lifted, throwing distance increases to 9 hexes\n  - 1d6 + Biotics collision damage if they hit terrain, objects, or figures vs. All Enemy Types\n  - Staggered for 1 turn after landing if they collide with anything\n• On miss: No effect\n\nSpecial:\n• Both target and any figure they collide with take collision damage\n• Collision damage is reduced by Armor\n• Staggered effect only applies if collision occurs'
            }
        ],
        level15: {
            name: 'Kinetic Mastery',
            cost: 13,
            xpCost: 124,
            description: 'Adds explosive area effects to your Level 10 Throw.',
            effects: 'Specialty Enhancement: Adds to Level 10 Effect\n\nKinetic Mastery: If the thrown target collides with another figure, a 1-hex radius biotic detonation deals 2d4 + Biotics damage to all enemies in the area vs. All Enemy Types. Enemies in the blast must make an Evasion Check vs. Biotic DC or be Knocked Prone.'
        }
    },
    'Warp': {
        tier: 2,
        baseCost: 8,
        range: 14,
        damageType: 'Biotic',
        targeting: 'Single enemy within line of sight',
        xpCost: 70,
        base: {
            description: 'You hurl a dense biotic projectile that destabilizes molecular structure.',
            effects: 'Cost: 8 BE | Range: 14 hexes | Damage Type: Biotic\n\nEffect: Make a Biotics vs. Evasion attack roll:\n• On hit target takes:\n  - 2d4 + Biotics damage vs. All Enemy Types\n  - +1d6 barrier damage vs. Biotic Barriers\n  - 2 Armor Degradation (permanent)\n• On miss: No effect\n\nSpecial:\n• Damage is reduced by Armor\n• Biotic Barriers block the Armor Degradation effect but take all damage normally\n• Armor Degradation is permanent for the mission and stacks with multiple hits\n• Cannot reduce armor below 0\n\nQuick Cast Compatibility:\n• Can be combined with other Tier 1 or Tier 2 powers using Quick Cast rules\n• Cost becomes 9 BE when Quick Cast\n• Both powers suffer -2 to hit when Quick Cast\n• Perfect for stripping armor before weapon attacks'
        },
        level5: [
            {
                name: 'Precision Collapse',
                cost: 11,
                xpCost: 48,
                description: 'Replaces base effect with enhanced armor destruction.',
                effects: 'Cost: 11 BE | Range: 14 hexes\n\nEffect: Make a Biotics vs. Evasion attack roll:\n• On hit target takes:\n  - 2d6 + Biotics damage vs. All Enemy Types\n  - +1d8 barrier damage vs. Biotic Barriers\n  - 3 Armor Degradation (permanent)\n• On miss: No effect\n\nSpecial:\n• Damage is reduced by Armor\n• Biotic Barriers block the Armor Degradation effect but take all damage normally\n• Armor Degradation is permanent for the mission and stacks with multiple hits\n• Cannot reduce armor below 0'
            },
            {
                name: 'Mass Tearing',
                cost: 11,
                xpCost: 48,
                description: 'Replaces base effect with biotic vulnerability.',
                effects: 'Cost: 11 BE | Range: 14 hexes\n\nEffect: Make a Biotics vs. Evasion attack roll:\n• On hit target takes:\n  - 2d4 + Biotics damage vs. All Enemy Types\n  - +1d6 barrier damage vs. Biotic Barriers\n  - 2 Armor Degradation (permanent)\n  - -1 to all Evasion checks against Biotic abilities until end of your next turn\n• On miss: No effect\n\nSpecial:\n• Damage is reduced by Armor\n• Biotic Barriers block the Armor Degradation effect but take all damage normally\n• Armor Degradation is permanent for the mission and stacks with multiple hits\n• Cannot reduce armor below 0'
            }
        ],
        level10: [
            {
                name: 'Annihilation Field',
                cost: 16,
                xpCost: 77,
                description: 'Replaces Precision Collapse with maximum damage.',
                effects: 'Cost: 16 BE | Range: 14 hexes\n\nEffect: Make a Biotics vs. Evasion attack roll:\n• On hit target takes:\n  - 3d4 + Biotics damage vs. All Enemy Types\n  - +2d4 barrier damage vs. Biotic Barriers\n  - 3 Armor Degradation (permanent)\n• On miss: No effect\n\nSpecial:\n• Damage is reduced by Armor\n• Biotic Barriers block the Armor Degradation effect but take all damage normally\n• Armor Degradation is permanent for the mission and stacks with multiple hits\n• Cannot reduce armor below 0'
            },
            {
                name: 'Biotic Unraveling',
                cost: 16,
                xpCost: 77,
                description: 'Replaces Mass Tearing with extended vulnerability.',
                effects: 'Cost: 16 BE | Range: 14 hexes\n\nEffect: Make a Biotics vs. Evasion attack roll:\n• On hit target takes:\n  - 2d4 + Biotics damage vs. All Enemy Types\n  - +1d6 barrier damage vs. Biotic Barriers\n  - 2 Armor Degradation (permanent)\n  - -2 to all Evasion checks vs. Biotic abilities for 2 full rounds\n• On miss: No effect\n\nSpecial:\n• Damage is reduced by Armor\n• Biotic Barriers block the Armor Degradation effect but take all damage normally\n• Armor Degradation is permanent for the mission and stacks with multiple hits\n• Cannot reduce armor below 0'
            }
        ],
        level15: {
            name: 'Warp Mastery',
            cost: 24,
            xpCost: 124,
            description: 'Enhances your Level 10 Warp with ultimate destructive power.',
            effects: 'Specialty Enhancement: Adds to Level 10 Effect\n\nWarp Mastery: Damage increases to 4d4 + Biotics and armor reduction increases to 4 Armor Degradation (permanent). Additionally, choose one enhancement:\n• Option A: If target is reduced to 0 HP, adjacent enemies take 1d8 + Biotics Armor-bypassing damage\n• Option B: Target suffers -2 to Biotic Evasion for 3 rounds while all enemies within 3 hexes suffer -1 to Biotic Evasion for 2 rounds and are Slowed for 1 round'
        }
    }
};

const techPowersUpgradeData = {
    'Overload': {
        tier: 1,
        baseCost: 3,
        range: 14,
        damageType: 'Electrical',
        targeting: 'Single enemy within line of sight',
        xpCost: 30,
        base: {
            description: 'You discharge a concentrated electromagnetic pulse that overloads technological systems.',
            effects: 'Cost: 3 TP | Range: 14 hexes | Damage Type: Electrical\n\nEffect: Make a Tech vs. Evasion attack roll:\n• On hit target takes:\n  - 1d4+4+Tech electrical damage vs. All Enemy Types\n  - +2d4 electrical damage vs. Kinetic Barriers\n• On miss: No effect\n\nSpecial:\n• Electrical damage type\n• Enhanced effectiveness against technological shield systems\n• Synthetic enemies are Stunned for 1 turn if reduced to 0 Kinetic Barriers by this attack\n\nQuick Cast Compatibility:\n• Can be combined with other Tier 1 or Tier 2 powers using Quick Cast rules\n• Cost becomes 4 TP when Quick Cast\n• Both powers suffer -2 to hit when Quick Cast\n• Excellent setup power - strip barriers then follow with other abilities'
        },
        level5: [
            {
                name: 'Neural Shock',
                cost: 5,
                xpCost: 48,
                description: 'Replaces base effect with enhanced version that affects organic nervous systems.',
                effects: 'Cost: 5 TP | Range: 14 hexes\n\nEffect: You discharge a concentrated electromagnetic pulse that overloads technological and biological systems. Make a Tech vs. Evasion attack roll:\n• On hit target takes:\n  - 1d4+6+Tech electrical damage vs. All Enemy Types\n  - +2d4 electrical damage vs. Kinetic Barriers\n• On miss: No effect\n\nSpecial:\n• Electrical damage type\n• Enhanced effectiveness against technological shield systems\n• All enemies are Stunned for 1 turn if reduced to 0 Kinetic Barriers by this attack\n• Organic enemies with cybernetic implants take +1d4 damage'
            },
            {
                name: 'Improved Overload',
                cost: 5,
                xpCost: 48,
                description: 'Replaces base effect with increased shield disruption capability.',
                effects: 'Cost: 5 TP | Range: 14 hexes\n\nEffect: You discharge a concentrated electromagnetic pulse that overloads technological systems. Make a Tech vs. Evasion attack roll:\n• On hit target takes:\n  - 1d4+4+Tech electrical damage vs. All Enemy Types\n  - +3d4 electrical damage vs. Kinetic Barriers\n• On miss: No effect\n\nSpecial:\n• Electrical damage type\n• Enhanced effectiveness against technological shield systems\n• Synthetic enemies are Stunned for 2 turns if reduced to 0 Kinetic Barriers by this attack'
            }
        ],
        level10: [
            {
                name: 'Advanced Neural Shock',
                cost: 8,
                xpCost: 77,
                description: 'Replaces Neural Shock with superior electromagnetic disruption.',
                effects: 'Cost: 8 TP | Range: 14 hexes\n\nEffect: You discharge a concentrated electromagnetic pulse that overloads technological and biological systems. Make a Tech vs. Evasion attack roll:\n• On hit target takes:\n  - 1d4+8+Tech electrical damage vs. All Enemy Types\n  - +3d4 electrical damage vs. Kinetic Barriers\n• On miss: No effect\n\nSpecial:\n• Electrical damage type\n• Enhanced effectiveness against technological shield systems\n• All enemies are Stunned for 2 turns if reduced to 0 Kinetic Barriers by this attack\n• Organic enemies with cybernetic implants take +2d4 damage'
            },
            {
                name: 'Perfect Overload',
                cost: 8,
                xpCost: 77,
                description: 'Replaces Improved Overload with maximum shield disruption capability.',
                effects: 'Cost: 8 TP | Range: 14 hexes\n\nEffect: You discharge a concentrated electromagnetic pulse that overloads technological systems. Make a Tech vs. Evasion attack roll:\n• On hit target takes:\n  - 1d4+4+Tech electrical damage vs. All Enemy Types\n  - +4d4 electrical damage vs. Kinetic Barriers\n• On miss: No effect\n\nSpecial:\n• Electrical damage type\n• Enhanced effectiveness against technological shield systems\n• Synthetic enemies are Stunned for 3 turns if reduced to 0 Kinetic Barriers by this attack\n• Automatically destroys any Kinetic Barriers with 15 or fewer points remaining'
            }
        ],
        level15: {
            name: 'Chain Overload',
            cost: 12,
            xpCost: 124,
            description: 'Adds arcing electrical discharge to your Level 10 effect.',
            effects: 'Specialty Enhancement: Adds to Level 10 Effect\n\nChain Overload: When you hit with your primary attack, electricity automatically chains to 3 additional enemies within 4 hexes of the original target. Each chained target takes your Level 10 Overload effect with half the bonus dice (+2d4 vs. Kinetic Barriers instead of +3d4 or +4d4) but keeps all flat bonuses and the Tech modifier.'
        }
    }
};

// Legacy power data for compatibility
const bioticPowersData = {
    // Offensive Powers
    'Throw': {
        description: 'A basic biotic attack that hurls enemies away using mass effect fields.',
        effects: '• Throws target back 5 meters\n• 2d6 damage on impact\n• Can affect multiple targets\n• Cooldown: 1 round'
    },
    'Warp': {
        description: 'Advanced biotic power that destabilizes target\'s mass effect fields.',
        effects: '• 3d6 damage over time\n• Reduces armor effectiveness\n• Affects barriers and shields\n• Duration: 3 rounds'
    },
    'Singularity': {
        description: 'Creates a localized gravity well that pulls enemies together.',
        effects: '• Creates 3m radius gravity well\n• Pulls enemies to center\n• 2d6 damage per round trapped\n• Duration: 4 rounds'
    },
    'Biotic Charge': {
        description: 'Propels the user forward with biotic energy to close distance instantly.',
        effects: '• Instant movement to target\n• 3d8 impact damage\n• Restores barriers\n• Cooldown: 2 rounds'
    },
    'Slam': {
        description: 'Lifts target and slams them to the ground with tremendous force.',
        effects: '• Lifts then slams target\n• 4d6 damage\n• Knockdown effect\n• Armor ignoring'
    },
    'Reave': {
        description: 'Damages enemies while healing the user through biotic vampirism.',
        effects: '• 2d8 damage to target\n• Heals user for half damage dealt\n• Affects barriers and armor\n• Duration: 2 rounds'
    },
    'Lash': {
        description: 'Grabs and whips enemies with biotic tendrils.',
        effects: '• 2d6 damage\n• Pulls or pushes target\n• Can affect multiple enemies\n• Quick cooldown'
    },

    // Defensive Powers
    'Barrier': {
        description: 'Creates a protective biotic field around the user.',
        effects: '• +4 to damage resistance\n• Absorbs 20 points of damage\n• Regenerates over time\n• Duration: Until depleted'
    },
    'Stasis': {
        description: 'Freezes target in a time-dilated biotic field.',
        effects: '• Target cannot move or act\n• Immune to damage while frozen\n• Cannot affect large enemies\n• Duration: 3 rounds'
    },
    'Lift': {
        description: 'Suspends enemies in the air, leaving them helpless.',
        effects: '• Target helpless while lifted\n• Cannot act or move\n• Vulnerable to other attacks\n• Duration: 3 rounds'
    },
    'Pull': {
        description: 'Draws enemies toward the user using biotic attraction.',
        effects: '• Pulls target closer\n• Disrupts enemy positioning\n• Can affect multiple targets\n• Breaks enemy cover'
    },

    // Support Powers
    'Unity': {
        description: 'Revives and heals allies using shared biotic energy.',
        effects: '• Revives unconscious allies\n• Restores 3d6 health\n• Affects all nearby allies\n• Long cooldown'
    },
    'Dominate': {
        description: 'Takes control of enemy minds using biotic influence.',
        effects: '• Controls enemy actions\n• Target fights for you\n• Only affects organics\n• Duration: 4 rounds'
    },
    'Mind Control': {
        description: 'Advanced mental manipulation through biotic neural interference.',
        effects: '• Complete control of target\n• Access to target abilities\n• Affects any organic\n• Duration: 3 rounds'
    }
};

const techPowersData = {
    // Hacking Powers
    'Sabotage': {
        description: 'Disrupts enemy weapons and equipment through electronic interference.',
        effects: '• Causes weapon malfunction\n• 2d6 tech damage\n• Affects synthetic enemies\n• Duration: 2 rounds'
    },
    'AI Hacking': {
        description: 'Takes control of artificial intelligence systems.',
        effects: '• Controls AI/synthetic enemies\n• Target fights for you\n• Only affects synthetics\n• Duration: 4 rounds'
    },
    'Overload': {
        description: 'Overcharges electronic systems causing explosive feedback.',
        effects: '• 3d6 electrical damage\n• Destroys shields instantly\n• Chain effect to nearby enemies\n• Disables electronics'
    },
    'Neural Shock': {
        description: 'Delivers electrical impulses that disrupt neural activity.',
        effects: '• 2d8 damage + stun\n• Affects organic enemies\n• Bypasses shields\n• Disrupts biotic powers'
    },

    // Combat Powers
    'Incinerate': {
        description: 'Launches burning plasma that ignites enemies.',
        effects: '• 3d6 fire damage initially\n• 1d6 damage per round (burning)\n• Affects armor heavily\n• Duration: 3 rounds'
    },
    'Cryo Blast': {
        description: 'Freezes enemies in super-cooled plasma.',
        effects: '• 2d6 cold damage\n• Slows enemy movement\n• Makes enemies brittle\n• Area of effect'
    },
    'Energy Drain': {
        description: 'Drains energy from shields and barriers to restore your own.',
        effects: '• Drains enemy shields/barriers\n• Restores your shields\n• 2d6 damage to synthetics\n• No cooldown'
    },
    'Combat Drone': {
        description: 'Deploys an automated combat drone to assist in battle.',
        effects: '• Drone attacks independently\n• 1d8 damage per round\n• Distracts enemies\n• Duration: 5 rounds'
    },

    // Defense Powers
    'Tech Armor': {
        description: 'Encases the user in protective energy fields and hardened plating.',
        effects: '• +6 damage resistance\n• Immune to tech attacks\n• Explodes when depleted\n• Duration: Until depleted'
    },
    'Defense Matrix': {
        description: 'Projects defensive barriers around allies.',
        effects: '• +2 damage resistance to allies\n• Protects against projectiles\n• Affects whole squad\n• Duration: 4 rounds'
    },
    'Fortification': {
        description: 'Hardens armor and increases physical resistance.',
        effects: '• +4 to armor rating\n• Resistance to physical damage\n• Immunity to knockdown\n• Duration: 5 rounds'
    },

    // Support Powers
    'First Aid': {
        description: 'Deploys medical nanobots for emergency healing.',
        effects: '• Restores 2d6+2 health\n• Cures poison/disease\n• Can be used on others\n• Quick activation'
    },
    'Decryption': {
        description: 'Advanced code-breaking algorithms for bypassing security.',
        effects: '• Unlocks encrypted systems\n• Bypasses security doors\n• Accesses classified data\n• Passive enhancement'
    },
    'Electronics': {
        description: 'Manipulates electronic systems and improves tech efficiency.',
        effects: '• Enhances all tech powers\n• Repairs damaged equipment\n• Improves shield recharge\n• Passive enhancement'
    },
    'Hacking': {
        description: 'Infiltrates and controls computer systems and networks.',
        effects: '• Controls enemy systems\n• Gathers intelligence\n• Disables security measures\n• Passive enhancement'
    }
};

// =========================
// APP INITIALIZATION
// =========================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDiceHistory();
    setupAutoResizeTextareas();
});

function initializeApp() {
    console.log('🚀 Sci-Fi Solo RPG Companion App initialized');

    // Show hub view by default
    showView('hub-view');

    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
    }

    // PWA Install Prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;

        // Show install button/hint if desired
        console.log('💾 PWA can be installed');
    });

    // Handle app installation
    window.addEventListener('appinstalled', () => {
        console.log('🎉 PWA was installed');
        deferredPrompt = null;
    });
}

// =========================
// EVENT LISTENERS SETUP
// =========================

function setupEventListeners() {
    // Central dice roller button
    document.getElementById('dice-roller-btn').addEventListener('click', openDiceModal);

    // Radial navigation buttons
    document.getElementById('character-btn').addEventListener('click', () => showView('character-view'));
    document.getElementById('rules-btn').addEventListener('click', () => showView('rules-view'));
    document.getElementById('enemies-btn').addEventListener('click', () => showView('enemies-view'));
    document.getElementById('encounters-btn').addEventListener('click', () => showView('encounters-view'));
    document.getElementById('ship-btn').addEventListener('click', () => showView('ship-view'));
    document.getElementById('notes-btn').addEventListener('click', () => showView('notes-view'));

    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target.dataset.target || 'hub-view';
            showView(target);
        });
    });

    // Dice modal controls
    document.getElementById('close-dice-modal').addEventListener('click', closeDiceModal);
    document.getElementById('roll-dice-btn').addEventListener('click', rollDice);
    document.getElementById('dice-formula').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') rollDice();
    });

    // Individual die buttons
    document.querySelectorAll('.die-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const dieType = e.target.dataset.die;
            document.getElementById('dice-formula').value = `1${dieType}`;
            rollDice();
        });
    });

    // Modal backdrop click to close
    document.getElementById('dice-modal').addEventListener('click', (e) => {
        if (e.target.id === 'dice-modal') {
            closeDiceModal();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Character sheet event listeners (try to set up immediately, will retry when character view opens)
    setupCharacterEventListeners();
}

// =========================
// VIEW MANAGEMENT
// =========================

function showView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    // Show target view
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
        currentView = viewId;

        // Add any view-specific initialization
        if (viewId === 'character-view') {
            initializeCharacterView();
        }
    }
}

function initializeCharacterView() {
    // Initialize character sheet functionality
    console.log('Character view initialized');
    initializeCharacterSheet();

    // Make sure character event listeners are set up now that view is active
    setupCharacterEventListeners();
}

// =========================
// DICE ROLLING SYSTEM
// =========================

function openDiceModal() {
    const modal = document.getElementById('dice-modal');
    modal.classList.add('active');
    document.getElementById('dice-formula').focus();
}

function closeDiceModal() {
    const modal = document.getElementById('dice-modal');
    modal.classList.remove('active');
}

function rollDice() {
    const formula = document.getElementById('dice-formula').value.trim();
    if (!formula) return;

    try {
        const result = parseDiceFormula(formula);
        displayDiceResult(formula, result);
        addToHistory(formula, result);
        saveDiceHistory();
    } catch (error) {
        displayDiceResult(formula, { error: error.message });
    }
}

function parseDiceFormula(formula) {
    // Clean the formula
    const cleanFormula = formula.toLowerCase().replace(/\s+/g, '');

    // Handle simple die rolls (e.g., "d20", "3d6")
    const simpleMatch = cleanFormula.match(/^(\d+)?d(\d+)$/);
    if (simpleMatch) {
        const count = parseInt(simpleMatch[1]) || 1;
        const sides = parseInt(simpleMatch[2]);
        return rollMultipleDice(count, sides);
    }

    // Handle complex formulas (e.g., "3d6+2", "2d10-1")
    const complexMatch = cleanFormula.match(/^(\d+)?d(\d+)([+-]\d+)?$/);
    if (complexMatch) {
        const count = parseInt(complexMatch[1]) || 1;
        const sides = parseInt(complexMatch[2]);
        const modifier = parseInt(complexMatch[3]) || 0;

        const diceResult = rollMultipleDice(count, sides);
        return {
            ...diceResult,
            modifier: modifier,
            total: diceResult.total + modifier
        };
    }

    // Handle advantage/disadvantage (e.g., "adv", "dis")
    if (cleanFormula === 'adv' || cleanFormula === 'advantage') {
        return rollAdvantage();
    }
    if (cleanFormula === 'dis' || cleanFormula === 'disadvantage') {
        return rollDisadvantage();
    }

    throw new Error('Invalid dice formula. Examples: d20, 3d6, 2d10+5, adv, dis');
}

function rollMultipleDice(count, sides) {
    if (count < 1 || count > 100) throw new Error('Dice count must be between 1 and 100');
    if (sides < 2 || sides > 1000) throw new Error('Dice sides must be between 2 and 1000');

    const rolls = [];
    let total = 0;

    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
    }

    return {
        count: count,
        sides: sides,
        rolls: rolls,
        total: total,
        modifier: 0
    };
}

function rollAdvantage() {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;
    const total = Math.max(roll1, roll2);

    return {
        count: 2,
        sides: 20,
        rolls: [roll1, roll2],
        total: total,
        modifier: 0,
        advantage: true
    };
}

function rollDisadvantage() {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;
    const total = Math.min(roll1, roll2);

    return {
        count: 2,
        sides: 20,
        rolls: [roll1, roll2],
        total: total,
        modifier: 0,
        disadvantage: true
    };
}

function displayDiceResult(formula, result) {
    const resultDiv = document.getElementById('dice-result');

    if (result.error) {
        resultDiv.innerHTML = `
            <div style="color: #ef4444;">
                <strong>Error:</strong> ${result.error}
            </div>
        `;
        return;
    }

    let html = `<div class="result-formula">${formula}</div>`;

    if (result.advantage) {
        html += `
            <div class="result-details">Advantage: [${result.rolls.join(', ')}]</div>
            <div class="result-total" style="color: #22c55e;">Result: ${result.total}</div>
        `;
    } else if (result.disadvantage) {
        html += `
            <div class="result-details">Disadvantage: [${result.rolls.join(', ')}]</div>
            <div class="result-total" style="color: #ef4444;">Result: ${result.total}</div>
        `;
    } else {
        if (result.rolls.length > 1) {
            html += `<div class="result-details">Rolls: [${result.rolls.join(', ')}]</div>`;
        }
        if (result.modifier !== 0) {
            const modifierStr = result.modifier > 0 ? `+${result.modifier}` : `${result.modifier}`;
            html += `<div class="result-details">Base: ${result.total - result.modifier} ${modifierStr}</div>`;
        }
        html += `<div class="result-total">Total: ${result.total}</div>`;
    }

    resultDiv.innerHTML = html;

    // Add animation effect
    resultDiv.style.transform = 'scale(0.8)';
    setTimeout(() => {
        resultDiv.style.transform = 'scale(1)';
    }, 100);
}

// =========================
// DICE HISTORY MANAGEMENT
// =========================

function addToHistory(formula, result) {
    const historyItem = {
        timestamp: new Date().toLocaleTimeString(),
        formula: formula,
        result: result
    };

    diceHistory.unshift(historyItem);

    // Keep only last 20 rolls
    if (diceHistory.length > 20) {
        diceHistory = diceHistory.slice(0, 20);
    }

    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');

    if (diceHistory.length === 0) {
        historyList.innerHTML = '<div style="color: #64748b; text-align: center;">No rolls yet</div>';
        return;
    }

    historyList.innerHTML = diceHistory.map(item => {
        let resultText = '';
        if (item.result.error) {
            resultText = `Error: ${item.result.error}`;
        } else if (item.result.advantage) {
            resultText = `Advantage: ${item.result.total}`;
        } else if (item.result.disadvantage) {
            resultText = `Disadvantage: ${item.result.total}`;
        } else {
            resultText = `Total: ${item.result.total}`;
        }

        return `
            <div class="history-item">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #00d9ff;">${item.formula}</span>
                    <span style="color: #64748b; font-size: 0.8em;">${item.timestamp}</span>
                </div>
                <div style="color: #e2e8f0; margin-top: 0.25rem;">${resultText}</div>
            </div>
        `;
    }).join('');
}

function saveDiceHistory() {
    localStorage.setItem('scifiRpgDiceHistory', JSON.stringify(diceHistory));
}

function loadDiceHistory() {
    const saved = localStorage.getItem('scifiRpgDiceHistory');
    if (saved) {
        diceHistory = JSON.parse(saved);
        updateHistoryDisplay();
    }
}

// =========================
// KEYBOARD SHORTCUTS
// =========================

function handleKeyboardShortcuts(e) {
    // Only handle shortcuts when not typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch(e.key.toLowerCase()) {
        case 'escape':
            if (currentView !== 'hub-view') {
                showView('hub-view');
            } else {
                closeDiceModal();
            }
            break;
        case 'd':
        case ' ':
            if (currentView === 'hub-view') {
                openDiceModal();
            }
            break;
        case '1':
            if (currentView === 'hub-view') showView('character-view');
            break;
        case '2':
            if (currentView === 'hub-view') showView('rules-view');
            break;
        case '3':
            if (currentView === 'hub-view') showView('enemies-view');
            break;
        case '4':
            if (currentView === 'hub-view') showView('encounters-view');
            break;
        case '5':
            if (currentView === 'hub-view') showView('ship-view');
            break;
        case '6':
            if (currentView === 'hub-view') showView('notes-view');
            break;
    }
}

// =========================
// UTILITY FUNCTIONS
// =========================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =========================
// FEATURE FLAGS & CONFIG
// =========================

const APP_CONFIG = {
    version: '1.0.0',
    features: {
        characterSheet: true,
        diceRoller: true,
        rulesReference: false,
        enemyDatabase: false,
        encounterManager: false,
        shipInventory: false,
        campaignNotes: false
    }
};

// =========================
// CHARACTER SHEET FUNCTIONALITY
// =========================

// Squad Management Variables
let currentCharacterIndex = 1;
let squadData = {
    1: {},
    2: {},
    3: {},
    4: {}
};

// Status Effects Management
let activeStatusEffects = [];

function initializeCharacterSheet() {
    console.log('Initializing character sheet...');

    // Load saved squad data
    loadSquadData();

    // Initialize character 1
    loadCharacterFromMemory(currentCharacterIndex);
    updateTabNames();
    updateStatusEffectsDisplay();
}

function setupCharacterEventListeners() {
    if (characterEventListenersSetup) {
        console.log('Character event listeners already set up, skipping');
        return;
    }

    console.log('Setting up character event listeners...');

    // Character field change listeners for auto-save
    const fields = [
        'character-name', 'character-class', 'character-race', 'character-background',
        'health', 'combat', 'evasion', 'speed', 'charisma', 'tech', 'biotics', 'credits',
        'primary-weapon', 'secondary-weapon', 'armor', 'omni-tool', 'biotic-amp',
        'hp-current', 'hp-max', 'biotic-energy-current', 'biotic-energy-max',
        'tech-points-current', 'tech-points-max', 'kb-current', 'kb-max',
        'bb-current', 'bb-max', 'armor-value'
    ];

    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.addEventListener('input', debounce(autoSaveCharacter, 500));
            element.addEventListener('change', autoSaveCharacter);

            // Special handling for attributes that affect derived stats
            if (['health', 'tech', 'biotics'].includes(fieldId)) {
                element.addEventListener('input', updateDerivedStats);
                element.addEventListener('change', updateDerivedStats);
            }
        }
    });

    // Class and race change listeners for stat updates
    const classElement = document.getElementById('character-class');
    const raceElement = document.getElementById('character-race');

    if (classElement) {
        classElement.addEventListener('change', () => {
            updateClassStats();
            updateClassDescription();
            updateClassSpecificPowers();
            autoSaveCharacter();
        });
    }

    if (raceElement) {
        raceElement.addEventListener('change', () => {
            updateRaceStats();
            updateRaceDescription();
            autoSaveCharacter();
        });
    }

    // Background change listener for description updates
    const backgroundElement = document.getElementById('character-background');
    if (backgroundElement) {
        backgroundElement.addEventListener('change', () => {
            updateBackgroundDescription();
            autoSaveCharacter();
        });
    }

    // Equipment change listeners for description updates
    const equipmentElements = [
        'primary-weapon', 'secondary-weapon', 'armor', 'omni-tool', 'biotic-amp'
    ];

    equipmentElements.forEach(equipmentId => {
        const element = document.getElementById(equipmentId);
        if (element) {
            element.addEventListener('change', () => {
                updateEquipmentDescription(equipmentId);
                autoSaveCharacter();
            });
        }
    });

    // Clear button event listener
    const clearBtn = document.getElementById('clear-character-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllCharacterData);
    }

    // Set up powers listeners
    setupPowersListeners();

    // Mark as set up to prevent duplicate setup
    characterEventListenersSetup = true;
    console.log('Character event listeners setup complete');
}

function setupStatusEffectsListeners() {
    const addEffectBtn = document.getElementById('add-effect-btn');
    const effectSelect = document.getElementById('effect-select');
    const durationSelect = document.getElementById('duration-select');

    if (addEffectBtn) {
        addEffectBtn.addEventListener('click', addStatusEffect);
    }

    // Enable/disable add button based on selections
    [effectSelect, durationSelect].forEach(select => {
        if (select) {
            select.addEventListener('change', () => {
                updateAddButtonState();
            });
        }
    });

    // Initialize button state
    updateAddButtonState();
}

// Squad Management Functions
function switchCharacter(characterIndex) {
    // Save current character data before switching
    saveCurrentCharacterToMemory();

    // Update current character index
    currentCharacterIndex = characterIndex;

    // Update tab visual states
    document.querySelectorAll('.tab-button').forEach(tab => tab.classList.remove('active'));
    const activeTab = document.getElementById(`tab-${characterIndex}`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Load the selected character data
    loadCharacterFromMemory(characterIndex);

    // Update tab name in case character name changed
    updateTabNames();
}

function saveCurrentCharacterToMemory() {
    squadData[currentCharacterIndex] = {
        // Character Basics
        name: getValue('character-name'),
        characterClass: getValue('character-class'),
        race: getValue('character-race'),
        background: getValue('character-background'),

        // Core Attributes
        health: getValue('health'),
        combat: getValue('combat'),
        evasion: getValue('evasion'),
        speed: getValue('speed'),
        charisma: getValue('charisma'),
        tech: getValue('tech'),
        biotics: getValue('biotics'),
        credits: getValue('credits'),

        // Equipment
        primaryWeapon: getValue('primary-weapon'),
        secondaryWeapon: getValue('secondary-weapon'),
        armor: getValue('armor'),
        omniTool: getValue('omni-tool'),
        bioticAmp: getValue('biotic-amp'),

        // Combat Stats
        hpCurrent: getValue('hp-current'),
        hpMax: getValue('hp-max'),
        bioticEnergyCurrent: getValue('biotic-energy-current'),
        bioticEnergyMax: getValue('biotic-energy-max'),
        techPointsCurrent: getValue('tech-points-current'),
        techPointsMax: getValue('tech-points-max'),
        kbCurrent: getValue('kb-current'),
        kbMax: getValue('kb-max'),
        bbCurrent: getValue('bb-current'),
        bbMax: getValue('bb-max'),
        armorValue: getValue('armor-value'),
        statusEffects: [...activeStatusEffects],

        // Powers
        bioticPowers: [...activeBioticPowers],
        techPowers: [...activeTechPowers],
        powerUpgrades: { ...powerUpgrades },

        // Base attributes (without class/race bonuses)
        baseAttributes: { ...baseAttributes }
    };
}

function loadCharacterFromMemory(characterIndex) {
    const data = squadData[characterIndex] || {};

    // Character Basics
    setValue('character-name', data.name || '');
    setValue('character-class', data.characterClass || '');
    setValue('character-race', data.race || '');
    setValue('character-background', data.background || '');

    // Core Attributes
    setValue('health', data.health || '0');
    setValue('combat', data.combat || '0');
    setValue('evasion', data.evasion || '0');
    setValue('speed', data.speed || '0');
    setValue('charisma', data.charisma || '0');
    setValue('tech', data.tech || '0');
    setValue('biotics', data.biotics || '0');
    setValue('credits', data.credits || '0');

    // Equipment
    setValue('primary-weapon', data.primaryWeapon || '');
    setValue('secondary-weapon', data.secondaryWeapon || '');
    setValue('armor', data.armor || '');
    setValue('omni-tool', data.omniTool || '');
    setValue('biotic-amp', data.bioticAmp || '');

    // Combat Stats
    setValue('hp-current', data.hpCurrent || '0');
    setValue('hp-max', data.hpMax || '0');
    setValue('biotic-energy-current', data.bioticEnergyCurrent || '0');
    setValue('biotic-energy-max', data.bioticEnergyMax || '0');
    setValue('tech-points-current', data.techPointsCurrent || '0');
    setValue('tech-points-max', data.techPointsMax || '0');
    setValue('kb-current', data.kbCurrent || '0');
    setValue('kb-max', data.kbMax || '0');
    setValue('bb-current', data.bbCurrent || '0');
    setValue('bb-max', data.bbMax || '0');
    setValue('armor-value', data.armorValue || '0');

    // Load status effects
    activeStatusEffects = data.statusEffects || [];
    updateStatusEffectsDisplay();

    // Load powers
    activeBioticPowers = data.bioticPowers || [];
    activeTechPowers = data.techPowers || [];
    powerUpgrades = data.powerUpgrades || {};
    updateBioticPowersDisplay();
    updateTechPowersDisplay();

    // Load base attributes and recalculate with bonuses
    if (data.baseAttributes) {
        baseAttributes = { ...data.baseAttributes };
        recalculateAllAttributes(); // Recalculate with current class/race bonuses
    }

    // Update description fields based on loaded selections
    updateClassDescription();
    updateRaceDescription();
    updateBackgroundDescription();

    // Update class-specific powers
    updateClassSpecificPowers();

    // Update equipment descriptions
    updateEquipmentDescription('primary-weapon');
    updateEquipmentDescription('secondary-weapon');
    updateEquipmentDescription('armor');
    updateEquipmentDescription('omni-tool');
    updateEquipmentDescription('biotic-amp');
}

function updateTabNames() {
    for (let i = 1; i <= 4; i++) {
        const tabName = document.getElementById(`tab-name-${i}`);
        const characterData = squadData[i];
        if (tabName) {
            if (characterData && characterData.name) {
                tabName.textContent = characterData.name;
            } else {
                tabName.textContent = `Character ${i}`;
            }
        }
    }
}

function autoSaveCharacter() {
    saveCurrentCharacterToMemory();
    // Auto-save the squad data to localStorage
    localStorage.setItem('scifiRpgSquad', JSON.stringify(squadData));
}

function clearAllCharacterData() {
    // Confirm with user before clearing
    if (!confirm('Are you sure you want to clear all character data? This action cannot be undone.')) {
        return;
    }

    // Clear all form fields
    const allFields = [
        'character-name', 'character-class', 'character-race', 'character-background',
        'health', 'combat', 'evasion', 'speed', 'charisma', 'tech', 'biotics', 'credits',
        'primary-weapon', 'secondary-weapon', 'armor', 'omni-tool', 'biotic-amp',
        'hp-current', 'hp-max', 'biotic-energy-current', 'biotic-energy-max',
        'tech-points-current', 'tech-points-max', 'kb-current', 'kb-max',
        'bb-current', 'bb-max', 'armor-value'
    ];

    allFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            if (element.type === 'number') {
                element.value = '0';
            } else {
                element.value = '';
            }
        }
    });

    // Clear base attributes
    baseAttributes = {
        health: 0, combat: 0, evasion: 0, speed: 0,
        charisma: 0, tech: 0, biotics: 0
    };

    // Clear powers
    activeBioticPowers = [];
    activeTechPowers = [];
    powerUpgrades = {};
    updateBioticPowersDisplay();
    updateTechPowersDisplay();

    // Clear status effects
    activeStatusEffects = [];
    updateStatusEffectsDisplay();

    // Clear equipment descriptions
    document.getElementById('equipment-description').innerHTML = '';

    // Clear class/race/background descriptions
    document.getElementById('class-description').innerHTML = '';
    document.getElementById('race-description').innerHTML = '';
    document.getElementById('background-description').innerHTML = '';

    // Save the cleared state
    autoSaveCharacter();

    console.log('All character data cleared');
}

function loadSquadData() {
    const saved = localStorage.getItem('scifiRpgSquad');
    if (saved) {
        try {
            squadData = JSON.parse(saved);
        } catch (error) {
            console.error('Error loading squad data:', error);
            squadData = { 1: {}, 2: {}, 3: {}, 4: {} };
        }
    }
}

// Squad Control Functions
function saveSquad() {
    saveCurrentCharacterToMemory();
    const squadJson = JSON.stringify(squadData, null, 2);
    const blob = new Blob([squadJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'squad_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show confirmation
    alert('Squad data exported successfully!');
}

function loadSquad() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    squadData = importedData;
                    loadCharacterFromMemory(currentCharacterIndex);
                    updateTabNames();
                    localStorage.setItem('scifiRpgSquad', JSON.stringify(squadData));
                    alert('Squad imported successfully!');
                } catch (error) {
                    alert('Error importing squad file. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function clearSquad() {
    if (confirm('Are you sure you want to clear all character data? This cannot be undone.')) {
        squadData = { 1: {}, 2: {}, 3: {}, 4: {} };
        loadCharacterFromMemory(currentCharacterIndex);
        updateTabNames();
        localStorage.setItem('scifiRpgSquad', JSON.stringify(squadData));
        alert('Squad data cleared!');
    }
}

function exportSquad() {
    saveSquad(); // Use the same function
}

function importSquad(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                squadData = importedData;
                loadCharacterFromMemory(currentCharacterIndex);
                updateTabNames();
                localStorage.setItem('scifiRpgSquad', JSON.stringify(squadData));
                alert('Squad imported successfully!');
            } catch (error) {
                alert('Error importing squad file. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
}

// Pool adjustment functions
function adjustPool(poolType, delta) {
    const currentElement = document.getElementById(`${poolType}-current`);
    const maxElement = document.getElementById(`${poolType}-max`);

    if (currentElement && maxElement) {
        const current = parseInt(currentElement.value) || 0;
        const max = parseInt(maxElement.value) || 0;
        const newValue = Math.max(0, Math.min(max, current + delta));

        currentElement.value = newValue;
        autoSaveCharacter();
    }
}

// Stat update functions based on class and race selections
function updateClassStats() {
    recalculateAllAttributes();
    autoSaveCharacter();
}

function updateClassSpecificPowers() {
    const classElement = document.getElementById('character-class');
    if (!classElement || !classElement.value) return;

    const selectedClass = classElement.value;
    const classPowers = classSpecificPowers[selectedClass] || [];

    // Remove existing class powers
    activeBioticPowers = activeBioticPowers.filter(power => power.type !== 'class');
    activeTechPowers = activeTechPowers.filter(power => power.type !== 'class');

    // Add new class powers
    classPowers.forEach(power => {
        const powerCopy = {
            id: bioticPowerIdCounter++, // Use biotic counter for ID generation
            name: power.name,
            type: power.type,
            description: power.description,
            effects: power.effects
        };

        // Add to tech powers list (class powers are displayed in tech section)
        activeTechPowers.push(powerCopy);
    });

    // Update displays
    updateBioticPowersDisplay();
    updateTechPowersDisplay();
}

function updateRaceStats() {
    recalculateAllAttributes();
    autoSaveCharacter();
}

function recalculateAllAttributes() {
    const classSelect = document.getElementById('character-class');
    const raceSelect = document.getElementById('character-race');

    // Calculate total bonuses from class and race
    let totalBonuses = {
        health: 0, combat: 0, evasion: 0, speed: 0,
        charisma: 0, tech: 0, biotics: 0
    };

    // Add class bonuses
    if (classSelect && classSelect.value) {
        const classBonuses = getClassBonuses(classSelect.value);
        Object.keys(classBonuses).forEach(attr => {
            totalBonuses[attr] += classBonuses[attr];
        });
    }

    // Add race bonuses
    if (raceSelect && raceSelect.value) {
        const raceBonuses = getRaceBonuses(raceSelect.value);
        Object.keys(raceBonuses).forEach(attr => {
            totalBonuses[attr] += raceBonuses[attr];
        });
    }

    // Update the form fields with calculated values
    Object.keys(totalBonuses).forEach(attr => {
        const element = document.getElementById(attr);
        if (element) {
            element.value = totalBonuses[attr];
        }
    });

    // Calculate derived stats based on attributes
    updateDerivedStats();
}

function updateDerivedStats() {
    // Get current attribute values
    const health = parseInt(document.getElementById('health').value) || 0;
    const tech = parseInt(document.getElementById('tech').value) || 0;
    const biotics = parseInt(document.getElementById('biotics').value) || 0;

    // Calculate derived values (each attribute point = 5 points in derived stat)
    const hpMax = health * 5;
    const techPointsMax = tech * 5;
    const bioticEnergyMax = biotics * 5;

    // Update max values
    setValue('hp-max', hpMax);
    setValue('tech-points-max', techPointsMax);
    setValue('biotic-energy-max', bioticEnergyMax);

    // Update current values only if they're 0 or greater than max (to prevent losing current values)
    const hpCurrent = parseInt(document.getElementById('hp-current').value) || 0;
    const techCurrent = parseInt(document.getElementById('tech-points-current').value) || 0;
    const bioticCurrent = parseInt(document.getElementById('biotic-energy-current').value) || 0;

    if (hpCurrent === 0 || hpCurrent > hpMax) {
        setValue('hp-current', hpMax);
    }
    if (techCurrent === 0 || techCurrent > techPointsMax) {
        setValue('tech-points-current', techPointsMax);
    }
    if (bioticCurrent === 0 || bioticCurrent > bioticEnergyMax) {
        setValue('biotic-energy-current', bioticEnergyMax);
    }
}

function getClassBonuses(className) {
    const bonuses = {};

    switch(className) {
        case 'Soldier':
            bonuses.combat = 2;
            break;
        case 'Engineer':
            bonuses.tech = 2;
            break;
        case 'Adept':
            bonuses.biotics = 2;
            break;
        case 'Vanguard':
            bonuses.combat = 1;
            bonuses.biotics = 1;
            break;
        case 'Sentinel':
            bonuses.tech = 1;
            bonuses.biotics = 1;
            break;
        case 'Infiltrator':
            bonuses.combat = 1;
            bonuses.tech = 1;
            break;
    }

    return bonuses;
}

function getRaceBonuses(raceName) {
    const bonuses = {};

    switch(raceName) {
        case 'Human':
            bonuses.health = 5;
            bonuses.combat = 0;
            bonuses.evasion = 4;
            bonuses.speed = 4;
            bonuses.charisma = 0;
            bonuses.tech = 0;
            bonuses.biotics = 0;
            // Note: +1 to stat of choice is handled separately
            break;
        case 'Asari':
            bonuses.health = 5;
            bonuses.combat = 0;
            bonuses.evasion = 4;
            bonuses.speed = 4;
            bonuses.charisma = 0;
            bonuses.tech = 0;
            bonuses.biotics = 1;
            break;
        case 'Turian':
            bonuses.health = 5;
            bonuses.combat = 1;
            bonuses.evasion = 4;
            bonuses.speed = 4;
            bonuses.charisma = 0;
            bonuses.tech = 0;
            bonuses.biotics = 0;
            break;
        case 'Krogan':
            bonuses.health = 7;
            bonuses.combat = 1;
            bonuses.evasion = 4;
            bonuses.speed = 4;
            bonuses.charisma = -1;
            bonuses.tech = 0;
            bonuses.biotics = 0;
            break;
        case 'Salarian':
            bonuses.health = 4;
            bonuses.combat = 0;
            bonuses.evasion = 5;
            bonuses.speed = 5;
            bonuses.charisma = 0;
            bonuses.tech = 1;
            bonuses.biotics = 0;
            break;
        case 'Quarian':
            bonuses.health = 4;
            bonuses.combat = 0;
            bonuses.evasion = 4;
            bonuses.speed = 4;
            bonuses.charisma = 0;
            bonuses.tech = 2;
            bonuses.biotics = 0;
            break;
        case 'Drell':
            bonuses.health = 5;
            bonuses.combat = 1;
            bonuses.evasion = 5;
            bonuses.speed = 5;
            bonuses.charisma = 0;
            bonuses.tech = 0;
            bonuses.biotics = 0;
            break;
        case 'Batarian':
            bonuses.health = 5;
            bonuses.combat = 1;
            bonuses.evasion = 4;
            bonuses.speed = 4;
            bonuses.charisma = -1;
            bonuses.tech = 0;
            bonuses.biotics = 0;
            break;
        case 'Vorcha':
            bonuses.health = 6;
            bonuses.combat = 1;
            bonuses.evasion = 4;
            bonuses.speed = 4;
            bonuses.charisma = -2;
            bonuses.tech = 0;
            bonuses.biotics = 0;
            break;
        case 'Volus':
            bonuses.health = 3;
            bonuses.combat = 0;
            bonuses.evasion = 4;
            bonuses.speed = 3;
            bonuses.charisma = 2;
            bonuses.tech = 0;
            bonuses.biotics = 0;
            break;
    }

    return bonuses;
}

function updateClassDescription() {
    const classSelect = document.getElementById('character-class');
    const descField = document.getElementById('class-description');
    const effectsField = document.getElementById('class-effects');
    const descFieldContainer = document.getElementById('class-description-field');
    const effectsFieldContainer = document.getElementById('class-effects-field');

    if (!classSelect || !descField || !effectsField) return;

    const selectedClass = classSelect.value;

    if (selectedClass && classData[selectedClass]) {
        const data = classData[selectedClass];
        descField.value = data.description;
        effectsField.value = data.effects;
        descFieldContainer.style.display = 'block';
        effectsFieldContainer.style.display = 'block';

        // Auto-resize textareas
        autoResizeTextarea(effectsField);
    } else {
        descFieldContainer.style.display = 'none';
        effectsFieldContainer.style.display = 'none';
    }
}

function updateRaceDescription() {
    const raceSelect = document.getElementById('character-race');
    const descField = document.getElementById('race-description');
    const effectsField = document.getElementById('race-effects');
    const descFieldContainer = document.getElementById('race-description-field');
    const effectsFieldContainer = document.getElementById('race-effects-field');

    if (!raceSelect || !descField || !effectsField) return;

    const selectedRace = raceSelect.value;

    if (selectedRace && raceData[selectedRace]) {
        const data = raceData[selectedRace];
        descField.value = data.description;
        effectsField.value = data.effects;
        descFieldContainer.style.display = 'block';
        effectsFieldContainer.style.display = 'block';

        // Auto-resize textareas
        autoResizeTextarea(effectsField);
    } else {
        descFieldContainer.style.display = 'none';
        effectsFieldContainer.style.display = 'none';
    }
}

function updateBackgroundDescription() {
    const backgroundSelect = document.getElementById('character-background');
    const effectsField = document.getElementById('background-effects');
    const effectsFieldContainer = document.getElementById('background-effects-field');

    if (!backgroundSelect || !effectsField) return;

    const selectedBackground = backgroundSelect.value;

    if (selectedBackground && backgroundData[selectedBackground]) {
        const data = backgroundData[selectedBackground];
        effectsField.value = data.effects;
        effectsFieldContainer.style.display = 'block';
    } else {
        effectsFieldContainer.style.display = 'none';
    }
}

function updateEquipmentDescription(equipmentType) {
    const selectElement = document.getElementById(equipmentType);
    const descField = document.getElementById(`${equipmentType}-description`);
    const effectsField = document.getElementById(`${equipmentType}-effects`);
    const descFieldContainer = document.getElementById(`${equipmentType}-description-field`);
    const effectsFieldContainer = document.getElementById(`${equipmentType}-effects-field`);

    if (!selectElement || !effectsField) return;

    const selectedItem = selectElement.value;
    let data = null;

    // Determine which data source to use based on equipment type
    if (equipmentType.includes('weapon')) {
        data = weaponData[selectedItem];
    } else if (equipmentType === 'armor') {
        data = armorData[selectedItem];
    } else if (equipmentType === 'omni-tool') {
        data = omniToolData[selectedItem];
    } else if (equipmentType === 'biotic-amp') {
        data = bioticAmpData[selectedItem];
    }

    if (selectedItem && data) {
        // Only show description for weapons and armor
        if (descField && (equipmentType.includes('weapon') || equipmentType === 'armor')) {
            descField.value = data.description;
            descFieldContainer.style.display = 'block';
        }

        // Always show effects for all equipment types
        let effectsText = data.effects;

        // Add traits section for weapons
        if (equipmentType.includes('weapon') && data.traits) {
            effectsText += '\n\nWEAPON TRAITS:';
            Object.entries(data.traits).forEach(([traitName, traitEffect]) => {
                effectsText += `\n• ${traitName}: ${traitEffect}`;
            });
        }

        effectsField.value = effectsText;
        effectsFieldContainer.style.display = 'block';

        // Auto-resize the textarea after updating content
        autoResizeTextarea(effectsField);

        // Special handling for armor to update armor-value and barrier fields
        if (equipmentType === 'armor') {
            const armorValueField = document.getElementById('armor-value');
            if (armorValueField && data.effects) {
                // Extract armor rating from effects text
                const armorRatingMatch = data.effects.match(/Armor Rating:\s*(\d+)/);
                if (armorRatingMatch) {
                    armorValueField.value = armorRatingMatch[1];
                }

                // Extract barriers value and update appropriate barrier type based on class
                const barriersMatch = data.effects.match(/Barriers:\s*(\d+)/);
                if (barriersMatch) {
                    updateBarriers(parseInt(barriersMatch[1]));
                } else {
                    // No barriers mentioned in this armor, set to 0
                    updateBarriers(0);
                }
            }
        }
    } else {
        // Hide both fields when nothing is selected
        if (descFieldContainer) descFieldContainer.style.display = 'none';
        effectsFieldContainer.style.display = 'none';

        // Clear armor value and barriers when no armor is selected
        if (equipmentType === 'armor') {
            const armorValueField = document.getElementById('armor-value');
            if (armorValueField) {
                armorValueField.value = '0';
            }
            // Clear barriers when no armor is equipped
            updateBarriers(0);
        }
    }
}

// Update barriers based on character class and armor
function updateBarriers(barriersValue) {
    const classElement = document.getElementById('character-class');
    if (!classElement || !classElement.value) return;

    const characterClass = classElement.value;

    // Define which classes use which barrier types
    const kineticClasses = ['soldier', 'engineer', 'infiltrator'];
    const bioticClasses = ['adept', 'vanguard', 'sentinel'];

    let targetBarrierType = null;

    if (kineticClasses.includes(characterClass.toLowerCase())) {
        targetBarrierType = 'kinetic';
    } else if (bioticClasses.includes(characterClass.toLowerCase())) {
        targetBarrierType = 'biotic';
    }

    if (targetBarrierType) {
        // Update both current and max values for the appropriate barrier type
        const currentField = document.getElementById(`${targetBarrierType === 'kinetic' ? 'kb' : 'bb'}-current`);
        const maxField = document.getElementById(`${targetBarrierType === 'kinetic' ? 'kb' : 'bb'}-max`);

        if (currentField && maxField) {
            maxField.value = barriersValue;
            // Set current to max value when armor changes (full barriers)
            currentField.value = barriersValue;
        }

        // Clear the other barrier type when armor is equipped
        const otherBarrierType = targetBarrierType === 'kinetic' ? 'biotic' : 'kinetic';
        const otherCurrentField = document.getElementById(`${otherBarrierType === 'kinetic' ? 'kb' : 'bb'}-current`);
        const otherMaxField = document.getElementById(`${otherBarrierType === 'kinetic' ? 'kb' : 'bb'}-max`);

        if (otherCurrentField && otherMaxField) {
            otherCurrentField.value = '0';
            otherMaxField.value = '0';
        }
    }
}

// Random character generation (simplified version)
function generateRandomCharacter() {
    if (!confirm(`This will overwrite Character ${currentCharacterIndex} with a randomly generated one. Continue?`)) {
        return;
    }

    // Simple random character generation
    const names = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn'];
    const classes = ['Soldier', 'Engineer', 'Adept', 'Vanguard', 'Sentinel', 'Infiltrator'];
    const races = ['Human', 'Asari', 'Turian', 'Krogan', 'Salarian', 'Quarian'];

    setValue('character-name', getRandomItem(names));
    setValue('character-class', getRandomItem(classes));
    setValue('character-race', getRandomItem(races));
    setValue('health', Math.floor(Math.random() * 5) + 1);
    setValue('combat', Math.floor(Math.random() * 5) + 1);
    setValue('evasion', Math.floor(Math.random() * 5) + 1);
    setValue('charisma', Math.floor(Math.random() * 5) + 1);
    setValue('tech', Math.floor(Math.random() * 5) + 1);
    setValue('biotics', Math.floor(Math.random() * 5) + 1);

    autoSaveCharacter();
    updateTabNames();

    alert(`Generated random character for Character ${currentCharacterIndex}!`);
}

// Helper functions
function getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
}

function setValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value;
    }
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// =========================
// STATUS EFFECTS SYSTEM
// =========================

function getEffectType(effectName) {
    const debuffs = ['Stunned', 'Dazed', 'Knocked Prone', 'Lifted', 'Frozen', 'Burning', 'Poisoned', 'Bleeding', 'Blinded', 'Deafened', 'Slowed', 'Weakened', 'Dominated', 'Immobilized'];
    const buffs = ['Biotic Barrier', 'Shield Boost', 'Adrenaline Rush', 'Enhanced Reflexes', 'Combat Stimulant', 'Tactical Advantage'];
    const conditions = ['Heavy Injury', 'Critical Injury', 'Exhausted', 'Overheated', 'System Malfunction'];
    const environmental = ['In Cover', 'Exposed', 'Zero Gravity', 'Toxic Atmosphere', 'Extreme Heat', 'Extreme Cold'];

    if (debuffs.includes(effectName)) return 'debuff';
    if (buffs.includes(effectName)) return 'buff';
    if (conditions.includes(effectName)) return 'condition';
    if (environmental.includes(effectName)) return 'environmental';
    return 'other';
}

function extractTurnCount(duration) {
    // Extract numeric value from duration strings like "3 turns", "2 rounds"
    const match = duration.match(/^(\d+)\s+(turn|round)s?$/);
    if (match) {
        return parseInt(match[1]);
    }

    // For non-numeric durations, return null (no turn counter)
    return null;
}

function updateAddButtonState() {
    const addBtn = document.getElementById('add-effect-btn');
    const effectSelect = document.getElementById('effect-select');
    const durationSelect = document.getElementById('duration-select');

    if (addBtn && effectSelect && durationSelect) {
        const effectSelected = effectSelect.value !== '';
        const durationSelected = durationSelect.value !== '';

        addBtn.disabled = !(effectSelected && durationSelected);
    }
}

function addStatusEffect() {
    const effectSelect = document.getElementById('effect-select');
    const durationSelect = document.getElementById('duration-select');

    if (!effectSelect || !durationSelect) return;

    const effectName = effectSelect.value;
    const duration = durationSelect.value;

    if (!effectName || !duration) {
        alert('Please select both an effect and duration.');
        return;
    }

    // Check if effect already exists
    const existingEffect = activeStatusEffects.find(effect => effect.name === effectName);
    if (existingEffect) {
        if (confirm(`${effectName} is already active. Replace with new duration?`)) {
            removeStatusEffect(existingEffect.id);
        } else {
            return;
        }
    }

    // Create new effect
    const newEffect = {
        id: generateId(),
        name: effectName,
        duration: duration,
        type: getEffectType(effectName),
        timestamp: Date.now(),
        turnsRemaining: extractTurnCount(duration)
    };

    activeStatusEffects.push(newEffect);

    // Reset dropdowns
    effectSelect.value = '';
    durationSelect.value = '';
    updateAddButtonState();

    // Update display and save
    updateStatusEffectsDisplay();
    autoSaveCharacter();
}

function removeStatusEffect(effectId) {
    activeStatusEffects = activeStatusEffects.filter(effect => effect.id !== effectId);
    updateStatusEffectsDisplay();
    autoSaveCharacter();
}

function updateStatusEffectsDisplay() {
    const container = document.getElementById('active-effects');
    if (!container) return;

    if (activeStatusEffects.length === 0) {
        container.innerHTML = '<div class="no-effects-message">No active status effects</div>';
        return;
    }

    container.innerHTML = activeStatusEffects.map(effect => {
        const hasTurnCounter = effect.turnsRemaining !== null && effect.turnsRemaining !== undefined;

        return `
            <div class="effect-item effect-type-${effect.type}" data-effect-id="${effect.id}">
                <div class="effect-info">
                    <div class="effect-name">${effect.name}</div>
                    <div class="effect-duration">${effect.duration}</div>
                </div>
                ${hasTurnCounter ? `
                    <div class="turn-counter">
                        <label class="counter-label">Turns:</label>
                        <div class="counter-controls">
                            <button class="counter-btn minus" onclick="adjustTurnCount('${effect.id}', -1)" title="Decrease turns">-</button>
                            <span class="turn-count ${effect.turnsRemaining <= 0 ? 'expired' : ''}">${effect.turnsRemaining}</span>
                            <button class="counter-btn plus" onclick="adjustTurnCount('${effect.id}', 1)" title="Increase turns">+</button>
                        </div>
                    </div>
                ` : ''}
                <button class="remove-effect-btn" onclick="removeStatusEffect('${effect.id}')" title="Remove effect">
                    ×
                </button>
            </div>
        `;
    }).join('');
}

function adjustTurnCount(effectId, delta) {
    const effect = activeStatusEffects.find(e => e.id === effectId);
    if (!effect || effect.turnsRemaining === null) return;

    effect.turnsRemaining = Math.max(0, effect.turnsRemaining + delta);

    // Auto-remove effect if turns reach 0 and user confirms
    if (effect.turnsRemaining === 0) {
        const shouldRemove = confirm(`${effect.name} has expired (0 turns remaining). Remove it?`);
        if (shouldRemove) {
            removeStatusEffect(effectId);
            return;
        }
    }

    updateStatusEffectsDisplay();
    autoSaveCharacter();
}

function clearAllStatusEffects() {
    if (activeStatusEffects.length === 0) return;

    if (confirm('Remove all status effects?')) {
        activeStatusEffects = [];
        updateStatusEffectsDisplay();
        autoSaveCharacter();
    }
}

// Utility function to advance all turn-based effects by 1 turn
function advanceAllTurnCounters() {
    let expiredEffects = [];

    activeStatusEffects.forEach(effect => {
        if (effect.turnsRemaining !== null && effect.turnsRemaining > 0) {
            effect.turnsRemaining -= 1;
            if (effect.turnsRemaining === 0) {
                expiredEffects.push(effect);
            }
        }
    });

    if (expiredEffects.length > 0) {
        const expiredNames = expiredEffects.map(e => e.name).join(', ');
        const shouldRemove = confirm(`The following effects have expired: ${expiredNames}\n\nRemove them?`);

        if (shouldRemove) {
            expiredEffects.forEach(effect => {
                removeStatusEffect(effect.id);
            });
        }
    }

    updateStatusEffectsDisplay();
    autoSaveCharacter();
}

// =========================
// POWERS MANAGEMENT SYSTEM
// =========================

function setupPowersListeners() {
    // Biotic Powers
    const bioticPowerSelect = document.getElementById('biotic-power-select');
    const addBioticPowerBtn = document.getElementById('add-biotic-power-btn');

    if (bioticPowerSelect && addBioticPowerBtn) {
        bioticPowerSelect.addEventListener('change', () => {
            addBioticPowerBtn.disabled = !bioticPowerSelect.value;
        });

        addBioticPowerBtn.addEventListener('click', () => {
            addBioticPower();
        });
    }

    // Tech Powers
    const techPowerSelect = document.getElementById('tech-power-select');
    const addTechPowerBtn = document.getElementById('add-tech-power-btn');

    if (techPowerSelect && addTechPowerBtn) {
        techPowerSelect.addEventListener('change', () => {
            addTechPowerBtn.disabled = !techPowerSelect.value;
        });

        addTechPowerBtn.addEventListener('click', () => {
            addTechPower();
        });
    }
}

function addBioticPower() {
    const select = document.getElementById('biotic-power-select');
    const powerName = select.value;

    if (!powerName || activeBioticPowers.find(p => p.name === powerName)) {
        return; // Already has this power
    }

    // Use upgrade data if available, otherwise fall back to legacy data
    const upgradeData = bioticPowersUpgradeData[powerName];
    const legacyData = bioticPowersData[powerName];

    const power = {
        id: bioticPowerIdCounter++,
        name: powerName,
        type: 'biotic',
        hasUpgrades: !!upgradeData,
        description: upgradeData?.base.description || legacyData?.description || '',
        effects: upgradeData?.base.effects || legacyData?.effects || ''
    };

    activeBioticPowers.push(power);

    // Initialize upgrade tracking for this power
    if (upgradeData) {
        powerUpgrades[power.id] = {};
    }

    updateBioticPowersDisplay();
    autoSaveCharacter();

    // Reset selection
    select.value = '';
    document.getElementById('add-biotic-power-btn').disabled = true;
}

function addTechPower() {
    const select = document.getElementById('tech-power-select');
    const powerName = select.value;

    if (!powerName || activeTechPowers.find(p => p.name === powerName)) {
        return; // Already has this power
    }

    // Use upgrade data if available, otherwise fall back to legacy data
    const upgradeData = techPowersUpgradeData[powerName];
    const legacyData = techPowersData[powerName];

    const power = {
        id: techPowerIdCounter++,
        name: powerName,
        type: 'tech',
        hasUpgrades: !!upgradeData,
        description: upgradeData?.base.description || legacyData?.description || '',
        effects: upgradeData?.base.effects || legacyData?.effects || ''
    };

    activeTechPowers.push(power);

    // Initialize upgrade tracking for this power
    if (upgradeData) {
        powerUpgrades[power.id] = {};
    }

    updateTechPowersDisplay();
    autoSaveCharacter();

    // Reset selection
    select.value = '';
    document.getElementById('add-tech-power-btn').disabled = true;
}

function removeBioticPower(powerId) {
    activeBioticPowers = activeBioticPowers.filter(power => power.id !== powerId);
    updateBioticPowersDisplay();
    autoSaveCharacter();
}

function removeTechPower(powerId) {
    // Find the power to check if it's a class power
    const power = activeTechPowers.find(p => p.id === powerId);
    if (power && power.type === 'class') {
        return; // Cannot remove class powers
    }

    activeTechPowers = activeTechPowers.filter(power => power.id !== powerId);
    updateTechPowersDisplay();
    autoSaveCharacter();
}

function updateBioticPowersDisplay() {
    const container = document.getElementById('active-biotic-powers');
    const noMessage = document.getElementById('no-biotic-powers-message');

    if (!container) return;

    if (activeBioticPowers.length === 0) {
        if (noMessage) noMessage.style.display = 'block';
        container.innerHTML = container.innerHTML.includes('no-powers-message') ?
            container.innerHTML : '<div class="no-powers-message">No biotic powers selected. Choose from the dropdown above to add powers.</div>';
        return;
    }

    if (noMessage) noMessage.style.display = 'none';

    container.innerHTML = activeBioticPowers.map(power => `
        <div class="power-item ${power.type === 'class' ? 'class-power' : ''}" data-power-id="${power.id}">
            <div class="power-header">
                <h4 class="power-name">${power.name}${power.type === 'class' ? ' <span class="class-power-badge">(Class Power)</span>' : ''}</h4>
                ${power.type !== 'class' ? `<button class="remove-power-btn" onclick="removeBioticPower(${power.id})" title="Remove Power">×</button>` : ''}
            </div>
            <div class="power-content">
                <div class="power-description">
                    <strong>Description:</strong>
                    <p>${power.description}</p>
                </div>
                <div class="power-effects">
                    <strong>Effects:</strong>
                    <p>${power.effects.replace(/\n/g, '<br>')}</p>
                </div>
                ${power.hasUpgrades ? `
                    <div class="power-upgrades">
                        <strong>Upgrades Available:</strong>
                        <div class="upgrade-controls">
                            ${getUpgradeButtons(power.id, power.name, 'biotic')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function getUpgradeButtons(powerId, powerName, powerType) {
    const upgradeData = powerType === 'biotic' ? bioticPowersUpgradeData[powerName] : techPowersUpgradeData[powerName];
    if (!upgradeData) return '';

    const currentUpgrades = powerUpgrades[powerId] || {};
    let html = '';

    // Level 5 upgrades
    if (currentUpgrades.level5 === undefined && upgradeData.level5) {
        html += `<div class="upgrade-tier">
            <h6>Level 5 Upgrades (Choose 1):</h6>
            <div class="upgrade-options">`;
        upgradeData.level5.forEach((upgrade, index) => {
            html += `<button class="upgrade-btn" onclick="selectUpgrade(${powerId}, 'level5', ${index}, '${powerType}')">
                <strong>${upgrade.name}</strong><br>
                <small>${upgrade.description}</small><br>
                <em>Cost: ${upgrade.cost} ${powerType === 'biotic' ? 'BE' : 'TP'}, XP: ${upgrade.xpCost}</em>
            </button>`;
        });
        html += `</div></div>`;
    }

    // Level 10 upgrades (only if level 5 is selected)
    if (currentUpgrades.level5 !== undefined && currentUpgrades.level10 === undefined && upgradeData.level10) {
        html += `<div class="upgrade-tier">
            <h6>Level 10 Upgrades (Choose 1):</h6>
            <div class="upgrade-options">`;
        upgradeData.level10.forEach((upgrade, index) => {
            html += `<button class="upgrade-btn" onclick="selectUpgrade(${powerId}, 'level10', ${index}, '${powerType}')">
                <strong>${upgrade.name}</strong><br>
                <small>${upgrade.description}</small><br>
                <em>Cost: ${upgrade.cost} ${powerType === 'biotic' ? 'BE' : 'TP'}, XP: ${upgrade.xpCost}</em>
            </button>`;
        });
        html += `</div></div>`;
    }

    // Level 15 upgrade (only if level 10 is selected)
    if (currentUpgrades.level10 !== undefined && !currentUpgrades.level15 && upgradeData.level15) {
        html += `<div class="upgrade-tier">
            <h6>Level 15 Specialty Upgrade:</h6>
            <div class="upgrade-options">
                <button class="upgrade-btn specialty" onclick="selectUpgrade(${powerId}, 'level15', 0, '${powerType}')">
                    <strong>${upgradeData.level15.name}</strong><br>
                    <small>${upgradeData.level15.description}</small><br>
                    <em>Cost: ${upgradeData.level15.cost} ${powerType === 'biotic' ? 'BE' : 'TP'}, XP: ${upgradeData.level15.xpCost}</em>
                </button>
            </div>
        </div>`;
    }

    // Show current upgrades
    if (Object.keys(currentUpgrades).length > 0) {
        html += `<div class="current-upgrades">
            <h6>Current Upgrades:</h6>`;
        if (currentUpgrades.level5 !== undefined) {
            const upgrade = upgradeData.level5[currentUpgrades.level5];
            html += `<div class="upgrade-active">${upgrade.name}</div>`;
        }
        if (currentUpgrades.level10 !== undefined) {
            const upgrade = upgradeData.level10[currentUpgrades.level10];
            html += `<div class="upgrade-active">${upgrade.name}</div>`;
        }
        if (currentUpgrades.level15) {
            html += `<div class="upgrade-active">${upgradeData.level15.name} (Specialty)</div>`;
        }
        html += `</div>`;
    }

    return html;
}

function selectUpgrade(powerId, tier, upgradeIndex, powerType) {
    const power = powerType === 'biotic'
        ? activeBioticPowers.find(p => p.id === powerId)
        : activeTechPowers.find(p => p.id === powerId);

    if (!power) return;

    const upgradeData = powerType === 'biotic' ? bioticPowersUpgradeData[power.name] : techPowersUpgradeData[power.name];
    if (!upgradeData) return;

    // Update the upgrade tracking
    if (!powerUpgrades[powerId]) {
        powerUpgrades[powerId] = {};
    }

    if (tier === 'level15') {
        powerUpgrades[powerId].level15 = true;
        // Update power effects to include level 15 upgrade
        const level10Upgrade = upgradeData.level10[powerUpgrades[powerId].level10];
        power.effects = level10Upgrade.effects + '\n\nLevel 15 Specialty:\n' + upgradeData.level15.effects;
    } else {
        powerUpgrades[powerId][tier] = upgradeIndex;
        // Update power effects to show selected upgrade
        const selectedUpgrade = upgradeData[tier][upgradeIndex];
        power.effects = selectedUpgrade.effects;
    }

    // Update display
    if (powerType === 'biotic') {
        updateBioticPowersDisplay();
    } else {
        updateTechPowersDisplay();
    }

    autoSaveCharacter();
}

function updateTechPowersDisplay() {
    const container = document.getElementById('active-tech-powers');
    const noMessage = document.getElementById('no-tech-powers-message');

    if (!container) return;

    if (activeTechPowers.length === 0) {
        if (noMessage) noMessage.style.display = 'block';
        container.innerHTML = container.innerHTML.includes('no-powers-message') ?
            container.innerHTML : '<div class="no-powers-message">No tech powers selected. Choose from the dropdown above to add powers.</div>';
        return;
    }

    if (noMessage) noMessage.style.display = 'none';

    container.innerHTML = activeTechPowers.map(power => `
        <div class="power-item ${power.type === 'class' ? 'class-power' : ''}" data-power-id="${power.id}">
            <div class="power-header">
                <h4 class="power-name">${power.name}${power.type === 'class' ? ' <span class="class-power-badge">(Class Power)</span>' : ''}</h4>
                ${power.type !== 'class' ? `<button class="remove-power-btn" onclick="removeTechPower(${power.id})" title="Remove Power">×</button>` : ''}
            </div>
            <div class="power-content">
                <div class="power-description">
                    <strong>Description:</strong>
                    <p>${power.description}</p>
                </div>
                <div class="power-effects">
                    <strong>Effects:</strong>
                    <p>${power.effects.replace(/\n/g, '<br>')}</p>
                </div>
                ${power.hasUpgrades && power.type !== 'class' ? `
                    <div class="power-upgrades">
                        <strong>Upgrades Available:</strong>
                        <div class="upgrade-controls">
                            ${getUpgradeButtons(power.id, power.name, 'tech')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Auto-resize textarea functionality
function autoResizeTextarea(textarea) {
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';

    // Calculate the new height based on content
    const newHeight = Math.max(40, textarea.scrollHeight);

    // Set the new height
    textarea.style.height = newHeight + 'px';
}

function setupAutoResizeTextareas() {
    // Find all textareas in description fields
    const textareas = document.querySelectorAll('.description-field textarea');

    textareas.forEach(textarea => {
        // Auto-resize on content change
        const resizeHandler = () => autoResizeTextarea(textarea);

        // Set up event listeners
        textarea.addEventListener('input', resizeHandler);
        textarea.addEventListener('change', resizeHandler);

        // Initial resize
        autoResizeTextarea(textarea);

        // Resize after a short delay to handle dynamic content
        setTimeout(() => autoResizeTextarea(textarea), 100);
    });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showView,
        rollDice,
        parseDiceFormula,
        switchCharacter,
        generateRandomCharacter,
        APP_CONFIG
    };
}