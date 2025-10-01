// Character Sheet JavaScript Functionality

// Squad Management Variables
let currentCharacterIndex = 1;
let squadData = {
    1: {},
    2: {},
    3: {},
    4: {}
};

// Initialize the character sheet when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupDropdownHandlers(); // Set blank defaults first
    loadSquadFromStorage(); // Load entire squad if available
    setupAutoSave();
    updateTabNames(); // Update tab names with character names

    // Trigger equipment and power info updates for initial load
    setTimeout(() => {
        const currentData = squadData[currentCharacterIndex] || {};
        if (Object.keys(currentData).length > 0) {
            loadCharacterFromMemory(currentCharacterIndex);
        }
    }, 200);
});

// Adjust pool values (BE, TP, HP, KB) with +/- buttons
function adjustPool(poolName, change) {
    const currentInput = document.getElementById(poolName + '-current');
    const maxInput = document.getElementById(poolName + '-max');

    if (!currentInput || !maxInput) return;

    const current = parseInt(currentInput.value) || 0;
    const max = parseInt(maxInput.value) || 0;
    const newValue = Math.max(0, Math.min(max, current + change));

    currentInput.value = newValue;
    autoSaveCharacter();
}

// Legacy functions removed - using squad system instead

// Helper function to load character data into form fields
function loadCharacterData(data) {
    // Character Basics
    setValueIfExists('character-name', data.name);
    setValueIfExists('character-class', data.characterClass);
    setValueIfExists('character-race', data.race);
    setValueIfExists('character-background', data.background);

    // Core Attributes
    setValueIfExists('health', data.health);
    setValueIfExists('combat', data.combat);
    setValueIfExists('evasion', data.evasion);
    setValueIfExists('charisma', data.charisma);
    setValueIfExists('tech', data.tech);
    setValueIfExists('biotics', data.biotics);

    // Equipment
    setValueIfExists('primary-weapon', data.primaryWeapon);
    setValueIfExists('secondary-weapon', data.secondaryWeapon);
    setValueIfExists('armor', data.armor);
    setValueIfExists('omni-biotic', data.omniBiotic);

    // Power Tracking
    setValueIfExists('biotic-energy-current', data.bioticEnergyCurrent);
    setValueIfExists('biotic-energy-max', data.bioticEnergyMax);
    setValueIfExists('tech-points-current', data.techPointsCurrent);
    setValueIfExists('tech-points-max', data.techPointsMax);

    // Combat Tracking
    setValueIfExists('hp-current', data.hpCurrent);
    setValueIfExists('hp-max', data.hpMax);
    setValueIfExists('kb-current', data.kbCurrent);
    setValueIfExists('kb-max', data.kbMax);
    setValueIfExists('bb-current', data.bbCurrent);
    setValueIfExists('bb-max', data.bbMax);
    setValueIfExists('armor-value', data.armorValue);
    setValueIfExists('status-effects', data.statusEffects);

    // Powers
    setValueIfExists('biotic-power-1', data.bioticPower1);
    setValueIfExists('biotic-power-2', data.bioticPower2);
    setValueIfExists('biotic-power-3', data.bioticPower3);
    setValueIfExists('tech-power-1', data.techPower1);
    setValueIfExists('tech-power-2', data.techPower2);
    setValueIfExists('tech-power-3', data.techPower3);

    // Load power upgrades
    setValueIfExists('biotic-power-1-level', data.bioticPower1Level);
    setValueIfExists('biotic-power-2-level', data.bioticPower2Level);
    setValueIfExists('biotic-power-3-level', data.bioticPower3Level);
    setValueIfExists('tech-power-1-level', data.techPower1Level);
    setValueIfExists('tech-power-2-level', data.techPower2Level);
    setValueIfExists('tech-power-3-level', data.techPower3Level);

    setValueIfExists('biotic-power-1-upgrade', data.bioticPower1Upgrade);
    setValueIfExists('biotic-power-2-upgrade', data.bioticPower2Upgrade);
    setValueIfExists('biotic-power-3-upgrade', data.bioticPower3Upgrade);
    setValueIfExists('tech-power-1-upgrade', data.techPower1Upgrade);
    setValueIfExists('tech-power-2-upgrade', data.techPower2Upgrade);
    setValueIfExists('tech-power-3-upgrade', data.techPower3Upgrade);

    // Credits
    setValueIfExists('credits', data.credits);
}

// Helper function to safely set form field values
function setValueIfExists(elementId, value) {
    const element = document.getElementById(elementId);
    if (element && value !== undefined && value !== null) {
        element.value = value;
    }
}

// Legacy clearCharacter function removed - using squad system instead

// Auto-save functionality
function setupAutoSave() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', autoSaveCharacter);
        input.addEventListener('change', autoSaveCharacter);
    });
}

// Old auto-save function removed - using squad version instead

// Keyboard shortcuts for quick adjustments
document.addEventListener('keydown', function(e) {
    // Only activate shortcuts if not typing in a text input or select
    if (e.target.tagName === 'INPUT' && e.target.type === 'text') return;
    if (e.target.tagName === 'TEXTAREA') return;
    if (e.target.tagName === 'SELECT') return;

    // HP shortcuts: H + number keys
    if (e.key === 'h' || e.key === 'H') {
        document.getElementById('hp-current').focus();
    }

    // BE shortcuts: B + number keys
    if (e.key === 'b' || e.key === 'B') {
        document.getElementById('biotic-energy-current').focus();
    }

    // TP shortcuts: T + number keys
    if (e.key === 't' || e.key === 'T') {
        document.getElementById('tech-points-current').focus();
    }

    // KB shortcuts: K + number keys
    if (e.key === 'k' || e.key === 'K') {
        document.getElementById('kb-current').focus();
    }
});

// Setup dropdown change handlers
function setupDropdownHandlers() {
    // Ensure dropdowns start with empty selections
    document.getElementById('character-class').value = '';
    document.getElementById('character-race').value = '';
    document.getElementById('character-background').value = '';
    document.getElementById('armor').value = '';

    // Add change event listeners
    document.getElementById('character-class').addEventListener('change', updateClassStats);
    document.getElementById('character-race').addEventListener('change', updateRaceStats);
    document.getElementById('character-background').addEventListener('change', updateBackgroundStats);
    document.getElementById('armor').addEventListener('change', updateArmorStats);

    // Add listener for Health attribute changes to update HP max
    document.getElementById('health').addEventListener('input', updateHPFromHealth);
    document.getElementById('health').addEventListener('change', updateHPFromHealth);

    // Add equipment info display listeners
    document.getElementById('primary-weapon').addEventListener('change', updateWeaponInfo);
    document.getElementById('secondary-weapon').addEventListener('change', updateWeaponInfo);
    document.getElementById('armor').addEventListener('change', updateArmorInfo);

    // Add power info display listeners
    document.getElementById('biotic-power-1').addEventListener('change', updatePowerInfo);
    document.getElementById('biotic-power-2').addEventListener('change', updatePowerInfo);
    document.getElementById('biotic-power-3').addEventListener('change', updatePowerInfo);
    document.getElementById('tech-power-1').addEventListener('change', updatePowerInfo);
    document.getElementById('tech-power-2').addEventListener('change', updatePowerInfo);
    document.getElementById('tech-power-3').addEventListener('change', updatePowerInfo);

    // Add upgrade level and selection listeners for all power slots
    const powerSlots = ['biotic-power-1', 'biotic-power-2', 'biotic-power-3', 'tech-power-1', 'tech-power-2', 'tech-power-3'];
    console.log('Setting up upgrade event listeners for slots:', powerSlots);

    powerSlots.forEach(slot => {
        // Level change listeners
        const levelSelect = document.getElementById(slot + '-level');
        if (levelSelect) {
            console.log(`Adding level listener for ${slot}`);
            levelSelect.addEventListener('change', function() {
                console.log(`Level changed for ${slot} to ${this.value}`);
                const powerSelect = document.getElementById(slot);
                const powerName = powerSelect ? powerSelect.value : '';
                if (powerName) {
                    updatePowerUpgradeDropdown(slot, powerName);
                    // Create a synthetic event that indicates this is a level change
                    updatePowerInfo({ target: { value: powerName, id: slot + '-level' } });
                }
            });
        } else {
            console.warn(`Level select not found for ${slot}`);
        }

        // Upgrade selection listeners
        const upgradeSelect = document.getElementById(slot + '-upgrade');
        if (upgradeSelect) {
            console.log(`Adding upgrade listener for ${slot}`);
            upgradeSelect.addEventListener('change', function() {
                console.log(`*** UPGRADE CHANGED for ${slot} to "${this.value}" ***`);
                const powerSelect = document.getElementById(slot);
                const powerName = powerSelect ? powerSelect.value : '';
                if (powerName) {
                    console.log(`Calling updatePowerInfo for ${slot} with power ${powerName}`);
                    // Create a synthetic event that indicates this is an upgrade change
                    updatePowerInfo({ target: { value: powerName, id: slot + '-upgrade' } });
                } else {
                    console.warn(`No power selected for ${slot}`);
                }
            });
        } else {
            console.warn(`Upgrade select not found for ${slot}`);
        }
    });

    // Add special listener for character name changes to update tabs immediately
    document.getElementById('character-name').addEventListener('input', function() {
        clearTimeout(window.nameUpdateTimeout);
        window.nameUpdateTimeout = setTimeout(() => {
            saveCurrentCharacterToMemory();
            updateTabNames();
        }, 200); // Faster update for name changes
    });
}

// Class stat bonuses and starting values
const CLASS_DATA = {
    'Soldier': {
        health: 2,
        combat: 1,
        evasion: 0,
        charisma: 0,
        tech: 0,
        biotics: 0,
        credits: 5000,
        bioticEnergyMax: 0,
        techPointsMax: 0
    },
    'Adept': {
        health: 1,
        combat: 0,
        evasion: 0,
        charisma: 0,
        tech: 0,
        biotics: 2,
        credits: 4000,
        bioticEnergyMax: 10,
        techPointsMax: 0
    },
    'Engineer': {
        health: 1,
        combat: 0,
        evasion: 0,
        charisma: 0,
        tech: 2,
        biotics: 0,
        credits: 4000,
        bioticEnergyMax: 0,
        techPointsMax: 10
    },
    'Vanguard': {
        health: 1,
        combat: 1,
        evasion: 0,
        charisma: 0,
        tech: 0,
        biotics: 1,
        credits: 4500,
        bioticEnergyMax: 5,
        techPointsMax: 0
    },
    'Sentinel': {
        health: 1,
        combat: 0,
        evasion: 0,
        charisma: 0,
        tech: 1,
        biotics: 1,
        credits: 4500,
        bioticEnergyMax: 5,
        techPointsMax: 5
    },
    'Infiltrator': {
        health: 1,
        combat: 1,
        evasion: 0,
        charisma: 0,
        tech: 1,
        biotics: 0,
        credits: 4500,
        bioticEnergyMax: 0,
        techPointsMax: 5
    }
};

// Background credit modifiers
const BACKGROUND_CREDITS = {
    'Military': 500,
    'Alliance Military': 500,
    'Corporate Executive': 1000,
    'Frontier Colonist': 0,
    'Criminal Underground': 0,
    'Academic Researcher': 0,
    'Military Intelligence': 300,
    'Mercenary Veteran': 750,
    'Religious Order': 0,
    'Pirate/Raider': 500,
    'Exile/Refugee': -300,
    'Diplomat/Envoy': 600,
    'Freelance Investigator': 400,
    'Colonial Security': 300,
    'Smuggler': 600,
    'Arena Fighter': 400,
    'Information Broker': 500,
    'Ship\'s Crew': 200,
    'Asari Commandos': 400,
    'Turian Service Record': 400,
    'Quarian Pilgrimage': -200,
    'Krogan Clan Exile': 200,
    'Drell Compact Servitor': 100,
    'Batarian Hegemony Defector': 0,
    'Volus Trade Consortium': 800,
    'Salarian Science Caste': 300,
    'Vorcha Pack Survivor': 0
};

// Race stat bonuses and starting values
const RACE_DATA = {
    'Human': {
        evasion: 4,
        health: 5,
        combat: 0,
        charisma: 0,
        tech: 0,
        biotics: 0,
        bonusChoice: true // +1 to stat of choice
    },
    'Asari': {
        evasion: 4,
        health: 5,
        combat: 0,
        charisma: 0,
        tech: 0,
        biotics: 1
    },
    'Turian': {
        evasion: 4,
        health: 5,
        combat: 1,
        charisma: 0,
        tech: 0,
        biotics: 0
    },
    'Krogan': {
        evasion: 4,
        health: 7,
        combat: 1,
        charisma: -1,
        tech: 0,
        biotics: 0
    },
    'Salarian': {
        evasion: 5,
        health: 4,
        combat: 0,
        charisma: 0,
        tech: 1,
        biotics: 0
    },
    'Quarian': {
        evasion: 4,
        health: 4,
        combat: 0,
        charisma: 0,
        tech: 2,
        biotics: 0
    },
    'Drell': {
        evasion: 5,
        health: 5,
        combat: 1,
        charisma: 0,
        tech: 0,
        biotics: 0
    },
    'Batarian': {
        evasion: 4,
        health: 5,
        combat: 1,
        charisma: -1,
        tech: 0,
        biotics: 0
    },
    'Vorcha': {
        evasion: 4,
        health: 6,
        combat: 1,
        charisma: -2,
        tech: 0,
        biotics: 0
    },
    'Volus': {
        evasion: 4,
        health: 3,
        combat: 0,
        charisma: 2,
        tech: 0,
        biotics: 0
    }
};

// Comprehensive armor data
const ARMOR_DATA = {
    'Sirta Phoenix Armor': { armor: 1, barriers: 5 },
    'Serrice Phantom Armor': { armor: 2, barriers: 6 },
    'Aldrin Hydra Armor': { armor: 2, barriers: 6 },
    'Aldrin Labs Agent Armor': { armor: 2, barriers: 6 },
    'Aldrin Onyx Armor': { armor: 3, barriers: 7 },
    'Ariake Mercenary Armor': { armor: 2, barriers: 6 },
    'Armax Predator Armor': { armor: 3, barriers: 7 },
    'Armax Predator X Armor': { armor: 4, barriers: 8 },
    'Devlon Explorer Armor': { armor: 2, barriers: 6 },
    'Devlon Liberator Armor': { armor: 3, barriers: 7 },
    'Elkoss Assassin Armor': { armor: 2, barriers: 6 },
    'Elkoss Gladiator Armor': { armor: 3, barriers: 7 },
    'ERCS Duelist Armor': { armor: 3, barriers: 7 },
    'ERCS Guardian Armor': { armor: 4, barriers: 8 },
    'ERCS Warlord Armor': { armor: 5, barriers: 10 },
    'Geth Battlemaster Armor': { armor: 5, barriers: 10 },
    'Geth Berserker Armor': { armor: 4, barriers: 8 },
    'Geth Rage Armor': { armor: 3, barriers: 7 },
    'Hahne-Kedar Mantis Armor': { armor: 2, barriers: 6 },
    'Hahne-Kedar Scorpion Armor': { armor: 3, barriers: 7 },
    'Hahne-Kedar Silverback Armor': { armor: 4, barriers: 8 },
    'Kassa Fabrication Colossus Armor': { armor: 5, barriers: 10 },
    'Rosenkov Thermal Armor': { armor: 3, barriers: 7 },
    'Rosenkov Titan Armor': { armor: 4, barriers: 8 },
    'Rosenkov Ursa Armor': { armor: 5, barriers: 10 }
};

// Weapon trait effects database
const WEAPON_TRAITS = {
    'Reliable': 'Can re-roll one failed attack roll per combat',
    'Self-Cooling': 'Never runs out of ammunition, no reload required',
    'Burst Fire': 'Fires multiple rounds per trigger pull, higher accuracy',
    'Marksman': '+2 bonus to attack rolls at long range',
    'Devastating': 'Critical hits deal maximum damage',
    'Area Effect': 'Damages all targets within blast radius',
    'Slow Reload': 'Takes extra time to reload between shots',
    'High Rate of Fire': 'Can fire additional shots per turn',
    'Inaccurate': '-1 penalty to attack rolls due to recoil',
    'Close Range': 'Bonus damage at short range, penalty at long range',
    'High Damage': 'Increased base damage output',
    'Heavy': 'Requires two hands, movement penalties when equipped',
    'Chargeable': 'Can charge shots for increased damage',
    'Electrical': 'Extra damage vs. synthetic enemies and shields',
    'Accurate': '+1 bonus to all attack rolls',
    'Rapid Fire': 'Can make additional attacks per turn',
    'Anti-Synthetic': 'Double damage against synthetic enemies',
    'Shield Piercing': 'Ignores energy shields and barriers',
    'Ricochet': 'Shots can bounce off surfaces to hit multiple targets',
    'Precision': 'Increased critical hit chance',
    'High Capacity': 'Extended ammunition before needing to reload',
    'Particle Beam': 'Continuous damage, can penetrate multiple targets',
    'Exotic': 'Rare technology with unique properties',
    'Military Grade': 'Superior construction, enhanced reliability',
    'Continuous Beam': 'Sustained fire mode, builds heat over time',
    'Overheating': 'Can overheat with sustained use, causing cooldown',
    'Military': 'Enhanced stats for military personnel',
    'Heavy Machine Gun': 'Extreme rate of fire, requires setup time',
    'Suppressive': 'Forces enemies to take cover, reduces their accuracy',
    'Fast Reload': 'Reduced reload time between shots',
    'Spike Rounds': 'Ammunition penetrates armor more effectively',
    'Penetrating': 'Can hit multiple enemies in a line',
    'Precision Shotgun': 'Maintains accuracy at longer ranges',
    'Long Range': 'Effective at distances typical shotguns cannot reach',
    'Flamethrower-like': 'Cone-shaped area of effect damage',
    'Arc Projector': 'Electricity arcs between nearby enemies',
    'Explosive Rounds': 'Ammunition explodes on impact',
    'Full Auto Shotgun': 'Fully automatic fire mode',
    'High Rate': 'Exceptional rate of fire',
    'Singularity Effect': 'Creates gravitational anomalies',
    'Rare': 'Extremely limited availability'
};

// Comprehensive weapon information
const WEAPON_DATA = {
    // Assault Rifles
    'M-8 Avenger': { range: '14 hexes', damage: '1d6 + Combat', type: 'Kinetic', shots: '2 (Soldier: 3)', traits: 'Reliable' },
    'M-7 Lancer': { range: '14 hexes', damage: '1d6 + Combat', type: 'Kinetic', shots: '1 (Soldier: 2)', traits: 'Self-Cooling' },
    'M-15 Vindicator': { range: '15 hexes', damage: '1d6 + Combat', type: 'Kinetic', shots: '3 (Soldier: 4)', traits: 'Burst Fire, Accurate' },
    'M-96 Mattock': { range: '16 hexes', damage: '1d8 + Combat', type: 'Kinetic', shots: '1 (Soldier: 2)', traits: 'Marksman, Devastating' },
    'M-37 Falcon': { range: '12 hexes', damage: '1d8 + Combat', type: 'Explosive', shots: '1 (Soldier: 2)', traits: 'Area Effect, Slow Reload' },
    'M-76 Revenant': { range: '12 hexes', damage: '1d8 + Combat', type: 'Kinetic', shots: '4 (Soldier: 5)', traits: 'High Rate of Fire, Inaccurate' },
    'M-55 Argus': { range: '15 hexes', damage: '1d6 + Combat', type: 'Kinetic', shots: '2 (Soldier: 3)', traits: 'Burst Fire, Reliable' },
    'M-99 Saber': { range: '18 hexes', damage: '1d10 + Combat', type: 'Kinetic', shots: '1 (Soldier: 2)', traits: 'Marksman, High Damage' },
    'Geth Pulse Rifle': { range: '16 hexes', damage: '2d4 + Combat', type: 'Electrical', shots: '1 (+1 Rapid Fire)', traits: 'Accurate, Electrical, Rapid Fire' },
    'Adas Anti-Synthetic Rifle': { range: '14 hexes', damage: '1d8 + Combat', type: 'Electrical', shots: '1 (Soldier: 2)', traits: 'Anti-Synthetic, Shield Piercing' },
    'Chakram Launcher': { range: '16 hexes', damage: '1d10 + Combat', type: 'Kinetic', shots: '1', traits: 'Ricochet, Precision' },
    'Phaeston': { range: '15 hexes', damage: '1d6 + Combat', type: 'Kinetic', shots: '3 (Soldier: 4)', traits: 'High Capacity, Reliable' },
    'Collector Assault Rifle': { range: '14 hexes', damage: '1d8 + Combat', type: 'Particle Beam', shots: '2 (Soldier: 3)', traits: 'Particle Beam, Exotic' },
    'N7 Valkyrie': { range: '16 hexes', damage: '1d8 + Combat', type: 'Kinetic', shots: '2 (Soldier: 3)', traits: 'Burst Fire, Military Grade' },
    'Particle Rifle': { range: '18 hexes', damage: '2d6 + Combat', type: 'Particle Beam', shots: '1', traits: 'Continuous Beam, Overheating' },
    'Cerberus Harrier': { range: '14 hexes', damage: '1d8 + Combat', type: 'Kinetic', shots: '3 (Soldier: 4)', traits: 'High Rate of Fire, Military' },
    'N7 Typhoon': { range: '12 hexes', damage: '1d6 + Combat', type: 'Kinetic', shots: '5 (Soldier: 6)', traits: 'Heavy Machine Gun, Suppressive' },

    // Shotguns
    'M-23 Katana': { range: '6 hexes', damage: '1d8 + Combat', type: 'Kinetic', shots: '1 (Soldier: 2)', traits: 'Close Range, Reliable' },
    'M-11 Wraith': { range: '8 hexes', damage: '1d10 + Combat', type: 'Kinetic', shots: '1 (Soldier: 2)', traits: 'Close Range, High Damage' },
    'M-300 Claymore': { range: '6 hexes', damage: '2d8 + Combat', type: 'Kinetic', shots: '1', traits: 'Devastating, Heavy' },
    'Geth Plasma Shotgun': { range: '10 hexes', damage: '1d8 + Combat', type: 'Electrical', shots: '1 (Soldier: 2)', traits: 'Chargeable, Electrical' },
    'Disciple': { range: '8 hexes', damage: '1d6 + Combat', type: 'Kinetic', shots: '2 (Soldier: 3)', traits: 'Close Range, Rapid Fire' },
    'Graal Spike Thrower': { range: '10 hexes', damage: '1d10 + Combat', type: 'Kinetic', shots: '1 (Soldier: 2)', traits: 'Spike Rounds, Penetrating' },
    'N7 Crusader': { range: '12 hexes', damage: '1d10 + Combat', type: 'Kinetic', shots: '1 (Soldier: 2)', traits: 'Precision Shotgun, Long Range' },
    'AT-12 Raider': { range: '6 hexes', damage: '1d8 + Combat', type: 'Kinetic', shots: '2 (Soldier: 3)', traits: 'Close Range, Fast Reload' },
    'Reegar Carbine': { range: '4 hexes', damage: '2d4 + Combat', type: 'Electrical', shots: '1 (Soldier: 2)', traits: 'Flamethrower-like, Arc Projector' },
    'Venom Shotgun': { range: '8 hexes', damage: '1d8 + Combat', type: 'Explosive', shots: '1 (Soldier: 2)', traits: 'Explosive Rounds, Area Effect' },
    'N7 Piranha': { range: '6 hexes', damage: '1d6 + Combat', type: 'Kinetic', shots: '4 (Soldier: 5)', traits: 'Full Auto Shotgun, High Rate' },

    // Pistols
    'M-3 Predator': { range: '10 hexes', damage: '1d6 + Combat', type: 'Kinetic', shots: '2 (Soldier: 3)', traits: 'Reliable' },
    'M-5 Phalanx': { range: '12 hexes', damage: '1d8 + Combat', type: 'Kinetic', shots: '1 (Soldier: 2)', traits: 'Accurate, Reliable' },
    'M-6 Carnifex': { range: '12 hexes', damage: '1d10 + Combat', type: 'Kinetic', shots: '1 (Soldier: 2)', traits: 'Devastating, Accurate' },

    // Heavy Weapons
    'M-100 Grenade Launcher': { range: '16 hexes', damage: '2d6 + Combat', type: 'Explosive', shots: '1', traits: 'Area Effect, Heavy, Slow Reload' },
    'M-490 Blackstorm': { range: '20 hexes', damage: '3d6 + Combat', type: 'Gravitational', shots: '1', traits: 'Singularity Effect, Heavy, Rare' },

    // Submachine Guns
    'M-4 Shuriken': { range: '8 hexes', damage: '1d4 + Combat', type: 'Kinetic', shots: '3 (Soldier: 4)', traits: 'Rapid Fire, Close Range' },
    'M-9 Tempest': { range: '10 hexes', damage: '1d6 + Combat', type: 'Kinetic', shots: '2 (Soldier: 3)', traits: 'Rapid Fire, Accurate' },
    'M-12 Locust': { range: '12 hexes', damage: '1d6 + Combat', type: 'Kinetic', shots: '2 (Soldier: 3)', traits: 'Accurate, Reliable' }
};

// Comprehensive power information from game files
const POWER_DATA = {
    // Biotic Powers
    'Barrier': {
        cost: '2 BE',
        range: 'Self',
        targeting: 'Self',
        damageType: 'Biotic',
        xpCost: '30 XP',
        tier: 'Tier 1',
        effect: 'Gain 1d4+Biotics Biotic Barrier points',
        details: 'Surrounds the user with a high-gravity mass effect field that creates a protective barrier. The user gains a Biotic Barrier with 1d4+Biotics points that are added to their existing barrier pool (or creates a Biotic Barrier pool if they have none).',
        special: 'Multiple Barrier power castings do not stack - recasting refreshes duration and pool to maximum. Can be voluntarily dismissed as a Free Action.',
        quickCast: 'Yes (Cost becomes 3 BE, both powers suffer -2 to hit)',
        upgrades: {
            level5: {
                cost: '4 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Reinforced Barrier',
                        effect: 'Surrounds the user with enhanced mass effect field providing superior protection. Gains 1d6+Biotics Biotic Barrier points.'
                    },
                    {
                        name: 'Reactive Barrier',
                        effect: 'Gains 1d4+Biotics Biotic Barrier points. When barrier pool is completely depleted, all enemies within 1 hex must make Evasion Check vs. Biotic DC or be Lifted until end of their next turn.'
                    }
                ]
            },
            level10: {
                cost: '7 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Hardened Barrier',
                        effect: 'Gains 1d8+Biotics Biotic Barrier points with maximum protection.'
                    },
                    {
                        name: 'Explosive Barrier',
                        effect: 'Gains 1d6+Biotics Biotic Barrier points. When depleted, enemies within 1 hex make Evasion Check vs. Biotic DC or be Lifted and take 1d6+Biotics damage.'
                    }
                ]
            },
            level15: {
                cost: '11 BE',
                xpCost: '124 XP',
                options: [
                    {
                        name: 'Aegis Protocol',
                        effect: 'Adds continuous barrier regeneration to Level 10 effect. While any Biotic Barrier points remain active, regain 1d4 barrier points at the start of your turn.'
                    }
                ]
            }
        }
    },
    'Biotic Hammer': {
        cost: '4 BE',
        range: 'Adjacent hex (melee)',
        targeting: 'Single enemy within melee range',
        damageType: 'Biotic',
        xpCost: '40 XP',
        tier: 'Tier 1',
        effect: 'Crushing biotic blow with blunt weapon',
        details: 'Channel biotic force into a devastating crushing blow. Make Biotics vs. Evasion attack - on hit target takes 1d8+Biotics damage vs. All Enemy Types. All enemies within 1 hex of target must make Evasion Check vs. Biotic DC or be Knocked Prone.',
        special: 'Damage reduced by Armor. Requires blunt melee weapon (hammer, mace, club, etc.). Area knockdown effect on all nearby enemies.',
        quickCast: 'Yes (Cost becomes 5 BE, both powers suffer -2 to hit)',
        upgrades: {
            level5: {
                cost: '6 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Crushing Impact',
                        effect: 'Focused biotic force for maximum single-target damage. Target takes 1d10+Biotics damage vs. All Enemy Types.'
                    },
                    {
                        name: 'Seismic Strike',
                        effect: 'Creates shockwaves. Target takes 1d8+Biotics damage. All enemies within 2 hexes make Evasion Check or be Knocked Prone and take 1d6+Biotics damage.'
                    }
                ]
            },
            level10: {
                cost: '9 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Devastating Hammer',
                        effect: 'Ultimate single-target devastation. Target takes 2d6+Biotics damage vs. All Enemy Types.'
                    },
                    {
                        name: 'Tremor Strike',
                        effect: 'Massive tremors. Target takes 1d8+Biotics damage and is Knocked Prone. All enemies within 3 hexes make Evasion Check or be Knocked Prone and take 1d8+Biotics damage.'
                    }
                ]
            },
            level15: {
                cost: '14 BE',
                xpCost: '124 XP',
                options: [
                    {
                        name: 'Hammer Mastery',
                        effect: 'Ultimate biotic power enhancement. Devastating Hammer: damage increases to 2d8+Biotics. Tremor Strike: area extends to 4 hexes, pushes enemies 1 hex away, plus primary target gains Stunned for 1 turn.'
                    }
                ]
            }
        }
    },
    'Barrier': {
        cost: '2 BE',
        range: 'Self',
        targeting: 'Self',
        damageType: 'None',
        xpCost: '30 XP',
        tier: 'Tier 1',
        effect: 'Surrounds user with high-gravity mass effect field',
        details: 'Gain 6 Biotic Barrier points added to existing barrier pool. Multiple castings refresh to maximum rather than stacking.',
        special: 'Can be voluntarily dismissed as Free Action. Excellent for defensive combinations with offensive powers.',
        quickCast: 'Yes (3 BE cost, -2 to hit)',
        upgrades: {
            level5: {
                cost: '5 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Enhanced Barrier',
                        effect: 'Gain 10 Biotic Barrier points instead of 6'
                    },
                    {
                        name: 'Reactive Barrier',
                        effect: 'Gain 6 Biotic Barriers. When barriers are depleted, gain +2 to next Evasion Check'
                    }
                ]
            },
            level10: {
                cost: '7 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Fortress Barrier',
                        effect: 'Gain 15 Biotic Barrier points. Reduce incoming damage by 1 while barriers are active'
                    },
                    {
                        name: 'Aegis Protocol',
                        effect: 'Gain 12 Biotic Barriers. Regain 1d4+1 barrier points at start of turn while any barriers remain',
                        mastery: true
                    }
                ]
            }
        }
    },
    'Warp': {
        cost: '8 BE',
        range: '14 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'Biotic',
        xpCost: '70 XP',
        tier: 'Tier 2',
        effect: 'Hurl dense biotic projectile that destabilizes molecular structure',
        details: '1d6+6+Biotics damage vs All Enemy Types, +1d6 barrier damage vs Biotic Barriers, 2 Armor Degradation (permanent).',
        special: 'Biotic Barriers block Armor Degradation but take damage. Perfect for stripping armor before weapon attacks.',
        quickCast: 'Yes (9 BE cost, -2 to hit)'
    },
    'Singularity': {
        cost: '8 BE',
        range: '12 hexes',
        targeting: '2-hex radius area',
        damageType: 'Biotic',
        xpCost: '125 XP',
        tier: 'Tier 3',
        effect: 'Create concentrated mass effect field that distorts gravity',
        details: 'Singularity remains active for 2 rounds. Enemies entering or starting turn inside must make Evasion Check vs Biotic DC or be Lifted.',
        special: 'Lifted targets cannot break free from damage. Only one Singularity per caster. Cannot be Quick Cast.',
        quickCast: 'No (Tier 3 restriction)'
    },
    'Charge': {
        cost: '5 BE',
        range: '12 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'Biotic',
        xpCost: '65 XP',
        tier: 'Tier 2',
        effect: 'Instantly teleport to enemy using biotic energy',
        details: '1d8+4+Biotics damage and Staggered status on failure. Restore 5 Kinetic Barrier points on hit.',
        special: 'Must teleport to adjacent hex. Biotic Barriers block Staggered effect but not damage.',
        quickCast: 'Yes (6 BE cost, -2 to hit, teleportation may affect range)'
    },
    'Dominate': {
        cost: '6 BE',
        range: '12 hexes',
        targeting: 'Single organic enemy within line of sight',
        damageType: 'None',
        xpCost: '70 XP',
        tier: 'Tier 2',
        effect: 'Choose organic enemy and control for 1 turn',
        details: 'Target acts as your ally on their next turn. May take one full action of your choice. Cannot affect synthetics.',
        special: 'Only one target may be Dominated at a time. Cannot force self-harm or area attacks including themselves.',
        quickCast: 'Yes (7 BE cost, -2 to hit)'
    },
    'Stasis': {
        cost: '3 BE',
        range: '12 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'None',
        xpCost: '35 XP',
        tier: 'Tier 1',
        effect: 'Freeze single enemy in temporal stasis field',
        details: 'Target affected by Stasis for 1 turn (cannot move, attack, or use abilities; immune to damage). First attack breaks Stasis.',
        special: 'Target immune to all damage while in Stasis. Breaking attack deals no damage. Any attack breaks Stasis immediately.',
        quickCast: 'Yes (4 BE cost, -2 to hit, may waste secondary power)'
    },
    'Slam': {
        cost: '5 BE',
        range: '14 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'Biotic',
        xpCost: '65 XP',
        tier: 'Tier 2',
        effect: 'Lift target and slam them down with crushing force',
        details: '1d6+6+Biotics damage vs All Enemy Types and Knocked Prone on failed Evasion Check.',
        special: 'Damage reduced by Armor. Good for setting up targets for follow-up attacks.',
        quickCast: 'Yes (6 BE cost, -2 to hit)'
    },
    'Shockwave': {
        cost: '4 BE',
        range: '8-hex line',
        targeting: 'All enemies in straight line',
        damageType: 'Biotic',
        xpCost: '35 XP',
        tier: 'Tier 1',
        effect: 'Unleash powerful biotic shockwave in straight line',
        details: 'All enemies in line make Evasion Check vs Biotic DC. Failure: 1d6+2+Biotics damage. Success: half damage.',
        special: 'Line originates from your hex and extends 8 hexes forward. Area effect may interfere with precise targeting.',
        quickCast: 'Yes (5 BE cost, -2 to hit)'
    },
    'Lash': {
        cost: '4 BE',
        range: '10 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'Biotic',
        xpCost: '60 XP',
        tier: 'Tier 2',
        effect: 'Seize enemy with biotic force and whip violently through air',
        details: '1d6+6+Biotics damage vs All Enemy Types. Move target up to 6 hexes in any direction. 1d6+2 collision damage if they hit terrain. Target knocked prone.',
        special: 'Full control over movement path. Collision damage affects both target and obstacles hit.',
        quickCast: 'Yes (5 BE cost, -2 to hit)',
        upgrades: {
            level5: {
                cost: '6 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Violent Lash',
                        effect: '1d8+8+Biotics damage vs All Enemy Types. Move up to 6 hexes. 1d8+3 collision damage. Knocked prone.'
                    },
                    {
                        name: 'Extended Reach',
                        effect: 'Range increases to 14 hexes. Move target up to 8 hexes. 1d6+6+Biotics damage. 1d6+2 collision damage. Knocked prone.'
                    }
                ]
            },
            level10: {
                cost: '9 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Devastating Lash',
                        effect: '1d10+10+Biotics damage vs All Enemy Types. Move up to 6 hexes. 1d10+4 collision damage. Knocked prone and Stunned 1 turn.'
                    },
                    {
                        name: 'Chain Lash',
                        effect: '14 hex range. Move primary target up to 8 hexes. 1d6+8+Biotics damage. Can chain to second enemy within 4 hexes for 1d6+4+Biotics damage.'
                    }
                ]
            }
        }
    },
    'Nova': {
        cost: '10 BE',
        range: 'Self (4-hex radius)',
        targeting: '4-hex radius around caster',
        damageType: 'Biotic',
        xpCost: '120 XP',
        tier: 'Tier 3',
        effect: 'Release devastating biotic explosion centered on yourself',
        details: 'All enemies within 4 hexes make Evasion Check vs Biotic DC. Failure: 2d6+8+Biotics damage. Success: half damage. You take 1d6 biotic damage.',
        special: 'Cannot be Quick Cast. Self-damage cannot be reduced. High-risk, high-reward area power.',
        quickCast: 'No (Tier 3 restriction)',
        upgrades: {
            level5: {
                cost: '12 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Controlled Nova',
                        effect: 'Failure: 2d6+10+Biotics damage. Success: half damage. You take only 1d4 biotic damage. Radius remains 4 hexes.'
                    },
                    {
                        name: 'Expanding Nova',
                        effect: 'Radius increases to 6 hexes. Failure: 2d6+8+Biotics damage. Success: half damage. You take 1d6 biotic damage.'
                    }
                ]
            },
            level10: {
                cost: '16 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Perfect Control',
                        effect: 'Failure: 2d6+12+Biotics damage. Success: half damage. You take no self-damage. Can exclude allies from effect.'
                    },
                    {
                        name: 'Cataclysmic Nova',
                        effect: 'Radius increases to 8 hexes. Failure: 3d6+8+Biotics damage. Success: half damage. You take 1d6 biotic damage.'
                    }
                ]
            }
        }
    },
    'Reave': {
        cost: '6 BE',
        range: '12 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'Biotic',
        xpCost: '75 XP',
        tier: 'Tier 2',
        effect: 'Drain enemy life force to restore your own vitality',
        details: '1d6+4+Biotics damage vs All Enemy Types. Restore Health equal to damage dealt. Target suffers -2 to all rolls for 2 turns from vitality drain.',
        special: 'Health restoration limited to your maximum HP. Cannot affect synthetic enemies. Debuff represents life force weakness.',
        quickCast: 'Yes (7 BE cost, -2 to hit)',
        upgrades: {
            level5: {
                cost: '8 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Enhanced Drain',
                        effect: '1d6+6+Biotics damage vs All Enemy Types. Restore Health equal to damage dealt plus 3. Debuff lasts 2 turns.'
                    },
                    {
                        name: 'Spreading Reave',
                        effect: '1d6+4+Biotics damage to primary target. If target dies, effect spreads to nearest enemy within 4 hexes for 1d6+2+Biotics damage.'
                    }
                ]
            },
            level10: {
                cost: '12 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Life Mastery',
                        effect: '1d6+8+Biotics damage vs All Enemy Types. Restore Health equal to damage dealt plus 5. Target suffers -3 to all rolls for 3 turns.'
                    },
                    {
                        name: 'Vampiric Chain',
                        effect: '1d6+4+Biotics to primary target. If target dies, chains to up to 2 additional enemies within 6 hexes for 1d6+2+Biotics each. Restore health equal to total damage.'
                    }
                ]
            }
        }
    },
    'Biotic Hammer': {
        cost: '3 BE',
        range: 'Adjacent hex (melee)',
        targeting: 'Single enemy within melee range',
        damageType: 'Biotic',
        xpCost: '40 XP',
        tier: 'Tier 1',
        effect: 'Charge melee weapon with biotic energy for devastating blow',
        details: '1d10+2+Biotics damage vs All Enemy Types. Requires heavy melee weapon (hammer, mace, etc.). Target knocked back 2 hexes and knocked prone.',
        special: 'Must be wielding appropriate heavy melee weapon. Knockback affects positioning and can cause collision damage.',
        quickCast: 'Yes (4 BE cost, -2 to hit)',
        upgrades: {
            level5: {
                cost: '5 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Improved Biotic Hammer',
                        effect: '1d12+4+Biotics damage vs All Enemy Types. Knockback 3 hexes and knocked prone. Target Stunned 1 turn.'
                    },
                    {
                        name: 'Shockwave Hammer',
                        effect: '1d10+2+Biotics to primary target plus shockwave. All enemies within 2 hexes of target take 1d6+Biotics damage and are knocked prone.'
                    }
                ]
            },
            level10: {
                cost: '8 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Devastating Hammer',
                        effect: '2d6+6+Biotics damage vs All Enemy Types. Knockback 4 hexes, knocked prone, and Stunned 2 turns.'
                    },
                    {
                        name: 'Seismic Hammer',
                        effect: '1d10+4+Biotics to primary target. Shockwave affects all enemies within 3 hexes for 1d8+Biotics damage, knocked prone, and Slowed 1 turn.'
                    }
                ]
            }
        }
    },
    'Biotic Slash': {
        cost: '3 BE',
        range: 'Adjacent hex (melee)',
        targeting: 'Single enemy within melee range',
        damageType: 'Biotic',
        xpCost: '35 XP',
        tier: 'Tier 1',
        effect: 'Charge blade with biotic energy for precise cutting strike',
        details: '1d6+4+Biotics damage vs All Enemy Types. Requires bladed melee weapon. Target suffers Bleeding (1d4 damage per turn for 2 turns, bypasses armor).',
        special: 'Must be wielding appropriate bladed weapon (sword, knife, omni-blade). Bleeding effect stacks with other sources.',
        quickCast: 'Yes (4 BE cost, -2 to hit)',
        upgrades: {
            level5: {
                cost: '5 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Enhanced Slash',
                        effect: '1d6+6+Biotics damage vs All Enemy Types. Bleeding lasts 3 turns (1d4+1 damage per turn).'
                    },
                    {
                        name: 'Precision Cut',
                        effect: '1d6+4+Biotics damage vs All Enemy Types. Ignores 3 points of armor. Bleeding lasts 2 turns.'
                    }
                ]
            },
            level10: {
                cost: '8 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Master Slash',
                        effect: '1d8+8+Biotics damage vs All Enemy Types. Bleeding lasts 4 turns (1d6 damage per turn). Critical hits extend bleeding by 1 turn.'
                    },
                    {
                        name: 'Arterial Strike',
                        effect: '1d6+6+Biotics damage vs All Enemy Types. Ignores armor completely. Bleeding lasts 3 turns (1d4+2 per turn). Organic enemies cannot regenerate health.'
                    }
                ]
            }
        }
    },
    'Dark Channel': {
        cost: '12 BE',
        range: '14 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'Biotic',
        xpCost: '130 XP',
        tier: 'Tier 3',
        effect: 'Channel dark energy to create spreading corruption',
        details: '1d6+6+Biotics damage initially. Target becomes Corrupted: takes 1d6+2 biotic damage at start of each turn for 3 turns. If target dies while Corrupted, effect spreads to nearest enemy within 4 hexes.',
        special: 'Cannot be Quick Cast. Corruption can potentially affect entire enemy groups through chain reactions.',
        quickCast: 'No (Tier 3 restriction)',
        upgrades: {
            level5: {
                cost: '15 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Enhanced Channel',
                        effect: '1d6+8+Biotics initial damage. Corruption lasts 4 turns (1d6+3 per turn). Spread range increases to 6 hexes.'
                    },
                    {
                        name: 'Explosive Channel',
                        effect: '1d6+6+Biotics initial damage. When Corrupted target dies, explodes for 2d6+Biotics damage in 2-hex radius before spreading corruption.'
                    }
                ]
            },
            level10: {
                cost: '20 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Master Channel',
                        effect: '1d6+10+Biotics initial damage. Corruption lasts 5 turns (1d6+4 per turn). Can spread to up to 2 enemies within 8 hexes when target dies.'
                    },
                    {
                        name: 'Viral Channel',
                        effect: '1d6+8+Biotics initial damage. Corruption lasts 4 turns. When target dies, spreads to all enemies within 6 hexes. Each new target can spread again if they die.'
                    }
                ]
            }
        }
    },

    // Tech Powers
    'Overload': {
        cost: '3 TP',
        range: '14 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'Electrical',
        xpCost: '30 XP',
        tier: 'Tier 1',
        effect: 'Discharge concentrated electromagnetic pulse',
        details: '1d4+4+Tech electrical damage vs All Enemy Types, +2d4 vs Kinetic Barriers. Synthetics Stunned 1 turn if reduced to 0 KB.',
        special: 'Enhanced effectiveness against technological shields. Excellent setup power - strip barriers then follow with abilities.',
        quickCast: 'Yes (4 TP cost, -2 to hit)',
        upgrades: {
            level5: {
                cost: '5 TP',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Neural Shock',
                        effect: '1d4+6+Tech electrical damage vs All Enemy Types, +2d4 vs KB. All enemies Stunned 1 turn if reduced to 0 KB. Organics with cybernetics take +1d4 damage.'
                    },
                    {
                        name: 'Improved Overload',
                        effect: '1d4+4+Tech electrical damage vs All Enemy Types, +3d4 vs KB. Synthetics Stunned 2 turns if reduced to 0 KB.'
                    }
                ]
            },
            level10: {
                cost: '8 TP',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Advanced Neural Shock',
                        effect: '1d4+8+Tech electrical damage vs All Enemy Types, +3d4 vs KB. All enemies Stunned 2 turns if reduced to 0 KB. Organics with cybernetics take +2d4 damage.'
                    },
                    {
                        name: 'Perfect Overload',
                        effect: '1d4+4+Tech electrical damage vs All Enemy Types, +4d4 vs KB. Synthetics Stunned 3 turns if reduced to 0 KB. Auto-destroys KB with 15 or fewer points.'
                    }
                ]
            }
        }
    },
    'Incinerate': {
        cost: '4 TP',
        range: '12 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'Fire',
        xpCost: '35 XP',
        tier: 'Tier 1',
        effect: 'Launch explosive plasma blast that ignites materials',
        details: '1d4+3+Tech fire damage and Burning for 2 turns (1d4 fire damage per turn, bypasses Armor).',
        special: 'Cannot affect enemies with active barriers. Organic enemies with Burning cannot regenerate health.',
        quickCast: 'Yes (5 TP cost, -2 to hit)',
        upgrades: {
            level5: {
                cost: '6 TP',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Heavy Incinerate',
                        effect: '1d4+5+Tech fire damage and Burning for 3 turns (1d4+2 fire damage per turn, bypasses Armor).'
                    },
                    {
                        name: 'Incineration Blast',
                        effect: 'Area effect - 2-hex radius. Targets make Evasion Check vs Tech DC. Failure: 1d4+3+Tech fire damage and Burning for 2 turns. Success: Half damage, no Burning.'
                    }
                ]
            },
            level10: {
                cost: '9 TP',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Improved Heavy Incinerate',
                        effect: '1d4+7+Tech fire damage and Burning for 4 turns (1d4+3 fire damage per turn, bypasses Armor).'
                    },
                    {
                        name: 'Flashfire',
                        effect: 'Area effect - 3-hex radius. Targets make Evasion Check vs Tech DC. Failure: 1d4+5+Tech fire damage and Burning for 2 turns. Success: Half damage, no Burning.'
                    }
                ]
            }
        }
    },
    'Combat Drone': {
        cost: '3 TP',
        range: '3 hexes (deployment)',
        targeting: 'Deploy within 3 hexes',
        damageType: 'Electrical',
        xpCost: '40 XP',
        tier: 'Tier 1',
        effect: 'Deploy holographic combat drone that fights independently',
        details: 'Drone: 15 HP, 6 Evasion, 4 hex range, 2d4+1+Tech damage, acts after your turn. Engineers get bonus HP/Evasion.',
        special: 'Only one drone at a time. Drone draws enemy fire. Acts immediately after your turn each round.',
        quickCast: 'No (Deployable powers require full attention)',
        upgrades: {
            level5: {
                cost: '5 TP',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Improved Drone',
                        effect: '25 HP, 8 Evasion, 7 hex movement. Attacks with 2d6+Tech vs Evasion, 3d4+1+Tech electrical damage, 4 hex range.'
                    },
                    {
                        name: 'Shock Drone',
                        effect: '15 HP, 6 Evasion, 6 hex movement. Attacks with 2d6+Tech vs Evasion, 2d4+1+Tech electrical damage. Target makes Evasion Check vs Tech DC or Stunned 1 turn, 3 hex range.'
                    }
                ]
            },
            level10: {
                cost: '8 TP',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Attack Drone',
                        effect: '25 HP, 8 Evasion, 8 hex movement. Two attacks per turn with 2d6+1+Tech vs Evasion, 4d4+2+Tech electrical damage, 5 hex range. Prioritizes high-value targets.'
                    },
                    {
                        name: 'Electrified Drone',
                        effect: '15 HP, 6 Evasion, 6 hex movement. Attacks with 2d6+Tech vs Evasion, 2d4+1+Tech electrical damage (+2d4 vs KB). Target makes Evasion Check vs Tech DC or Stunned 1 turn, 3 hex range.'
                    }
                ]
            }
        }
    },
    'Cryo Blast': {
        cost: '4 TP',
        range: '12 hexes',
        targeting: '1-hex radius area',
        damageType: 'Cold',
        xpCost: '35 XP',
        tier: 'Tier 1',
        effect: 'Launch supercooled projectile that flash-freezes tissue',
        details: 'Enemies in radius make Evasion Check. Failure: 1d6+2+Tech cold damage and Immobilized 1 turn. Success: half damage, Slowed 1 turn.',
        special: 'Cannot affect enemies with active barriers. Quick Cast gives enemies +2 to Evasion Check.',
        quickCast: 'Yes (5 TP cost, -2 to hit, enemies get +2 Evasion)'
    },
    'AI Hacking': {
        cost: '7 TP',
        range: '12 hexes',
        targeting: 'Single synthetic enemy within line of sight',
        damageType: 'None',
        xpCost: '75 XP',
        tier: 'Tier 2',
        effect: 'Inject malicious code to override synthetic programming',
        details: 'Dominated for 2 turns (unprotected), Dazed 1 turn (protected), Immobilized 2 turns (drones). Only one dominated at a time.',
        special: 'Synthetics only. Cannot affect enemies with active barriers. Level restriction based on Tech attribute.',
        quickCast: 'Yes (8 TP cost, -2 to hit)',
        upgrades: {
            level5: {
                cost: '9 TP',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Improved Hacking',
                        effect: 'Dominated for 3 turns (unprotected), Dazed 2 turns (protected), Immobilized 3 turns (drones). Can target synthetics up to 1 level higher than Tech.'
                    },
                    {
                        name: 'Viral Upload',
                        effect: 'Dominated for 2 turns (unprotected), Dazed 1 turn (protected), Immobilized 1 turn (drones). When target dies under viral effects, virus spreads to nearest eligible synthetic within 4 hexes for 1 turn.'
                    }
                ]
            },
            level10: {
                cost: '13 TP',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Advanced Hacking',
                        effect: 'Dominated for 4 turns with +1d4 damage bonus (unprotected), Dazed 2 turns (protected), Immobilized 4 turns (drones). Can target synthetics up to 2 levels higher than Tech.'
                    },
                    {
                        name: 'Cascading Virus',
                        effect: 'Dominated for 2 turns (unprotected), Dazed 1 turn (protected), Immobilized 1 turn (drones). When target dies, virus spreads to nearest synthetic within 6 hexes for 2 turns, then to a third within 4 hexes for 1 turn.'
                    }
                ]
            }
        }
    },
    'Energy Drain': {
        cost: '4 TP',
        range: '14 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'Electrical',
        xpCost: '35 XP',
        tier: 'Tier 1',
        effect: 'Hack technological systems to siphon energy',
        details: '1d4+2+Tech electrical damage, +2d4 vs Kinetic Barriers. Restore Kinetic Barriers equal to half damage dealt.',
        special: 'Cannot affect purely organic enemies. Barrier restoration limited to your maximum. Excellent sustain ability.',
        quickCast: 'Yes (5 TP cost, -2 to hit)',
        upgrades: {
            level5: {
                cost: '6 TP',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Improved Drain',
                        effect: '1d4+4+Tech electrical damage, +2d4 vs Kinetic Barriers. Restore Kinetic Barriers equal to half damage dealt.'
                    },
                    {
                        name: 'Cascade Drain',
                        effect: '1d4+2+Tech electrical damage to primary target, +2d4 vs KB. Chains to 1 additional enemy within 3 hexes for 1d4+Tech damage, +1d4 vs KB. Restore KB equal to half total damage dealt.'
                    }
                ]
            },
            level10: {
                cost: '9 TP',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Advanced Siphon',
                        effect: '1d4+6+Tech electrical damage, +3d4 vs Kinetic Barriers. Restore Kinetic Barriers equal to total damage dealt.'
                    },
                    {
                        name: 'System Infiltration',
                        effect: '1d4+2+Tech electrical damage to primary target, +2d4 vs KB. Chains to up to 2 additional enemies within 4 hexes for 1d4+Tech damage, +1d4 vs KB each. Restore KB equal to half total damage dealt.'
                    }
                ]
            }
        }
    },
    'Sabotage': {
        cost: '5 TP',
        range: '12 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'None',
        xpCost: '70 XP',
        tier: 'Tier 2',
        effect: 'Inject malicious code to disable enemy equipment',
        details: 'Target suffers Weapon Jammed for 2 turns (cannot use equipped weapon, must switch to backup or melee).',
        special: 'Multiple Sabotage effects do not stack. Does not affect natural weapons. Cannot affect enemies with active barriers.',
        quickCast: 'Yes (6 TP cost, -2 to hit)'
    },
    'Tactical Scan': {
        cost: '3 TP',
        range: '16 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'None',
        xpCost: '25 XP',
        tier: 'Tier 1',
        effect: 'Perform comprehensive analysis of target vulnerabilities',
        details: 'Target becomes Analyzed for 3 turns. Your attacks gain +2 to hit and +1d4 damage. Analyzed targets take +1 damage from all sources.',
        special: 'Only one enemy Analyzed at a time. Bonuses only apply to your attacks. Cannot benefit from cover while Analyzed.',
        quickCast: 'Yes (4 TP cost, -2 to hit)'
    },
    'Shield Boost': {
        cost: '4 TP',
        range: '8 hexes',
        targeting: 'Single ally within line of sight',
        damageType: 'None',
        xpCost: '65 XP',
        tier: 'Tier 2',
        effect: 'Enhance kinetic barrier systems through remote optimization',
        details: 'Target restores 1d4+2+Tech Kinetic Barriers. Auto-success (no roll required). Can target self.',
        special: 'Does not work on characters without barrier systems. Excellent for Quick Cast combinations.',
        quickCast: 'Yes (5 TP cost, other power gets -2 to hit)'
    },
    'Sentry Turret': {
        cost: '6 TP',
        range: '4 hexes (deployment)',
        targeting: 'Deploy autonomous weapons platform',
        damageType: 'Kinetic',
        xpCost: '75 XP',
        tier: 'Tier 2',
        effect: 'Deploy automated weapons platform lasting 2 rounds',
        details: 'Turret: 25 HP, 7 Evasion, 8-hex range, 3d4+2+Tech damage. Acts end of each round. Engineers get bonus HP/Evasion.',
        special: 'Cannot move once deployed. Only one turret at a time. High-priority target for enemies.',
        quickCast: 'No (Deployable powers require full attention)'
    }
};

// Update stats when class is selected
function updateClassStats() {
    updateAllStats();
}

// Update stats when race is selected
function updateRaceStats() {
    updateAllStats();
}

// Comprehensive function to update all stats based on race and class
function updateAllStats() {
    const selectedClass = document.getElementById('character-class').value;
    const selectedRace = document.getElementById('character-race').value;

    // Start with base stats
    let finalStats = {
        health: 0,
        combat: 0,
        evasion: 0,
        charisma: 0,
        tech: 0,
        biotics: 0
    };

    // Add race bonuses
    if (selectedRace && RACE_DATA[selectedRace]) {
        const raceData = RACE_DATA[selectedRace];
        finalStats.health += raceData.health;
        finalStats.combat += raceData.combat;
        finalStats.evasion += raceData.evasion;
        finalStats.charisma += raceData.charisma;
        finalStats.tech += raceData.tech;
        finalStats.biotics += raceData.biotics;
    }

    // Add class bonuses
    if (selectedClass && CLASS_DATA[selectedClass]) {
        const classData = CLASS_DATA[selectedClass];
        finalStats.health += classData.health;
        finalStats.combat += classData.combat;
        finalStats.evasion += classData.evasion;
        finalStats.charisma += classData.charisma;
        finalStats.tech += classData.tech;
        finalStats.biotics += classData.biotics;
    }

    // Update the form fields
    document.getElementById('health').value = finalStats.health;
    document.getElementById('combat').value = finalStats.combat;
    document.getElementById('evasion').value = finalStats.evasion;
    document.getElementById('charisma').value = finalStats.charisma;
    document.getElementById('tech').value = finalStats.tech;
    document.getElementById('biotics').value = finalStats.biotics;

    // Update power pools based on class
    if (selectedClass && CLASS_DATA[selectedClass]) {
        const classData = CLASS_DATA[selectedClass];
        document.getElementById('biotic-energy-max').value = classData.bioticEnergyMax;
        document.getElementById('biotic-energy-current').value = classData.bioticEnergyMax;
        document.getElementById('tech-points-max').value = classData.techPointsMax;
        document.getElementById('tech-points-current').value = classData.techPointsMax;
    }

    // Update HP based on final Health value
    updateHPFromHealth();

    // Update credits
    updateCredits();

    // Auto-save after changes
    autoSaveCharacter();
}

// Update credits when background is selected
function updateBackgroundStats() {
    updateCredits();
    autoSaveCharacter();
}

// Update armor and barriers when armor is selected
function updateArmorStats() {
    const selectedArmor = document.getElementById('armor').value;
    const selectedClass = document.getElementById('character-class').value;

    if (!selectedArmor || !ARMOR_DATA[selectedArmor]) {
        // Reset armor values if no armor selected
        document.getElementById('armor-value').value = 0;
        document.getElementById('kb-max').value = 0;
        document.getElementById('kb-current').value = 0;
        document.getElementById('bb-max').value = 0;
        document.getElementById('bb-current').value = 0;
        autoSaveCharacter();
        return;
    }

    const armorData = ARMOR_DATA[selectedArmor];

    // Set armor value
    document.getElementById('armor-value').value = armorData.armor;

    // Set barrier values based on class type
    if (selectedClass === 'Adept' || selectedClass === 'Vanguard') {
        // Biotic classes use Biotic Barriers
        document.getElementById('bb-max').value = armorData.barriers;
        document.getElementById('bb-current').value = armorData.barriers;
        document.getElementById('kb-max').value = 0;
        document.getElementById('kb-current').value = 0;
    } else if (selectedClass === 'Sentinel') {
        // Sentinels can use either - default to Kinetic for simplicity
        document.getElementById('kb-max').value = armorData.barriers;
        document.getElementById('kb-current').value = armorData.barriers;
        document.getElementById('bb-max').value = 0;
        document.getElementById('bb-current').value = 0;
    } else {
        // Tech classes (Soldier, Engineer, Infiltrator) use Kinetic Barriers
        document.getElementById('kb-max').value = armorData.barriers;
        document.getElementById('kb-current').value = armorData.barriers;
        document.getElementById('bb-max').value = 0;
        document.getElementById('bb-current').value = 0;
    }

    autoSaveCharacter();
}

// Update HP max when Health attribute changes
function updateHPFromHealth() {
    const healthValue = parseInt(document.getElementById('health').value) || 0;
    // Each point in Health gives the character 5HP according to the rules
    const hpMax = healthValue * 5;

    document.getElementById('hp-max').value = hpMax;

    // Set current HP to max HP when creating/updating character
    document.getElementById('hp-current').value = hpMax;

    autoSaveCharacter();
}

// Update total credits based on class and background
function updateCredits() {
    const selectedClass = document.getElementById('character-class').value;
    const selectedBackground = document.getElementById('character-background').value;

    let totalCredits = 0;

    // Add base class credits
    if (selectedClass && CLASS_DATA[selectedClass]) {
        totalCredits += CLASS_DATA[selectedClass].credits;
    }

    // Add background modifier
    if (selectedBackground && BACKGROUND_CREDITS[selectedBackground] !== undefined) {
        totalCredits += BACKGROUND_CREDITS[selectedBackground];
    }

    document.getElementById('credits').value = Math.max(0, totalCredits);
}

// Reset all stats to base values
function resetStatsToBase() {
    // If no race or class selected, reset everything to 0
    const selectedRace = document.getElementById('character-race').value;
    const selectedClass = document.getElementById('character-class').value;

    if (!selectedRace && !selectedClass) {
        document.getElementById('health').value = 0;
        document.getElementById('combat').value = 0;
        document.getElementById('evasion').value = 0;
        document.getElementById('charisma').value = 0;
        document.getElementById('tech').value = 0;
        document.getElementById('biotics').value = 0;
        document.getElementById('biotic-energy-max').value = 0;
        document.getElementById('biotic-energy-current').value = 0;
        document.getElementById('tech-points-max').value = 0;
        document.getElementById('tech-points-current').value = 0;
        document.getElementById('hp-max').value = 0;
        document.getElementById('hp-current').value = 0;
        document.getElementById('bb-max').value = 0;
        document.getElementById('bb-current').value = 0;
        document.getElementById('kb-max').value = 0;
        document.getElementById('kb-current').value = 0;
        document.getElementById('credits').value = 0;
    } else {
        // If there are selections, recalculate from them
        updateAllStats();
    }
}

// Update weapon information display
function updateWeaponInfo(event) {
    const weaponName = event.target.value;
    const weaponType = event.target.id.includes('primary') ? 'primary' : 'secondary';
    const infoElementId = weaponType + '-weapon-info';
    const infoElement = document.getElementById(infoElementId);

    if (!weaponName || !WEAPON_DATA[weaponName]) {
        if (infoElement) {
            infoElement.innerHTML = `Select a ${weaponType} weapon to see its stats and traits.`;
        }
        return;
    }

    const weapon = WEAPON_DATA[weaponName];

    // Parse traits and get their effects
    const traits = weapon.traits.split(', ');
    let traitEffects = '';

    traits.forEach((trait, index) => {
        const effect = WEAPON_TRAITS[trait];
        if (effect) {
            traitEffects += `<div class="trait-effect"><strong>${trait}:</strong> ${effect}</div>`;
        } else {
            traitEffects += `<div class="trait-effect"><strong>${trait}</strong></div>`;
        }
    });

    if (infoElement) {
        infoElement.innerHTML = `
            <div class="weapon-details">
                <div class="weapon-header">
                    <strong>${weaponName}</strong>
                </div>
                <div class="weapon-stats">
                    <div><strong>Range:</strong> ${weapon.range}</div>
                    <div><strong>Damage:</strong> ${weapon.damage}</div>
                    <div><strong>Type:</strong> ${weapon.type}</div>
                    <div><strong>Shots:</strong> ${weapon.shots}</div>
                </div>
                <div class="weapon-traits">
                    <strong>Weapon Traits:</strong>
                    ${traitEffects}
                </div>
            </div>
        `;
    }
}

// Update armor information display
function updateArmorInfo(event) {
    const armorName = event.target.value;
    const infoElement = document.getElementById('armor-info');

    if (!armorName || !ARMOR_DATA[armorName]) {
        if (infoElement) {
            infoElement.innerHTML = 'Select armor to see its protection values and special traits.';
        }
        return;
    }

    const armor = ARMOR_DATA[armorName];
    if (infoElement) {
        infoElement.innerHTML = `
            <strong>${armorName}</strong><br>
            <strong>Armor Value:</strong> ${armor.armor}<br>
            <strong>Barriers:</strong> ${armor.barriers}<br>
            <em>Provides damage reduction and energy shields.</em>
        `;
    }
}

// Update power information display with comprehensive details and upgrade options
function updatePowerInfo(event) {
    const powerName = event.target.value;
    let powerSlot = event.target.id;

    // Handle synthetic events from level/upgrade changes
    if (powerSlot.includes('-level') || powerSlot.includes('-upgrade')) {
        // Extract the base power slot from level/upgrade IDs
        powerSlot = powerSlot.replace('-level', '').replace('-upgrade', '');
    }

    console.log(`updatePowerInfo: powerName="${powerName}", powerSlot="${powerSlot}", eventSource="${event.target.id}"`);

    const infoElementId = powerSlot + '-info';
    const infoElement = document.getElementById(infoElementId);

    // Only update upgrade options when the power dropdown changes, not when upgrade/level changes
    const eventSourceId = event.target.id;
    const isPowerDropdownChange = eventSourceId === powerSlot; // True only if the power dropdown itself changed

    if (isPowerDropdownChange) {
        console.log('Power dropdown changed, updating upgrade options');
        updatePowerUpgradeOptions(powerSlot, powerName);
    } else {
        console.log('Level or upgrade changed, skipping upgrade options update');
    }

    if (!powerName || !POWER_DATA[powerName]) {
        infoElement.innerHTML = '<em>Select a power to see its details.</em>';
        return;
    }

    const power = POWER_DATA[powerName];
    const levelSelect = document.getElementById(powerSlot + '-level');
    const upgradeSelect = document.getElementById(powerSlot + '-upgrade');
    const currentLevel = levelSelect ? levelSelect.value : 'base';
    const currentUpgrade = upgradeSelect ? upgradeSelect.value : '';

    console.log(`updatePowerInfo details:`);
    console.log(`  powerSlot: ${powerSlot}`);
    console.log(`  powerName: ${powerName}`);
    console.log(`  currentLevel: ${currentLevel}`);
    console.log(`  currentUpgrade: "${currentUpgrade}"`);
    console.log(`  power exists: ${!!power}`);
    console.log(`  levelSelect exists: ${!!levelSelect}`);
    console.log(`  upgradeSelect exists: ${!!upgradeSelect}`);

    // Get current power stats based on selected level and upgrade
    const powerStats = getPowerStats(power, currentLevel, currentUpgrade);
    console.log(`  powerStats cost: ${powerStats.cost}`);
    console.log(`  powerStats details: ${powerStats.details.substring(0, 50)}...`);

    let upgradeInfo = '';
    if (power.upgrades && currentLevel !== 'base') {
        const upgradeData = power.upgrades[currentLevel];
        if (upgradeData && currentUpgrade) {
            const selectedUpgrade = upgradeData.options.find(opt => opt.name === currentUpgrade);
            if (selectedUpgrade) {
                upgradeInfo = `
                    <div class="power-upgrade-info">
                        <strong>Upgrade:</strong> ${selectedUpgrade.name}${selectedUpgrade.mastery ? ' (Mastery)' : ''}<br>
                        <strong>Enhanced Effect:</strong> ${selectedUpgrade.effect}
                    </div>
                `;
            }
        }
    }

    console.log(`About to display power info:`);
    console.log(`  powerName: ${powerName}`);
    console.log(`  currentLevel: ${currentLevel}`);
    console.log(`  currentUpgrade: "${currentUpgrade}"`);
    console.log(`  powerStats.cost: ${powerStats.cost}`);
    console.log(`  powerStats.effect: ${powerStats.effect}`);
    console.log(`  powerStats.details: ${powerStats.details.substring(0, 100)}...`);

    infoElement.innerHTML = `
        <div class="power-details">
            <div class="power-header">
                <strong>${powerName}</strong>
                <span class="power-tier">(${power.tier})</span>
                ${currentLevel !== 'base' ? `<span class="power-level-indicator">[${currentLevel.replace('level', 'Lvl ')}]</span>` : ''}
            </div>
            <div class="power-stats">
                <div class="stat-row">
                    <strong>Cost:</strong> ${powerStats.cost} |
                    <strong>Range:</strong> ${powerStats.range} |
                    <strong>XP:</strong> ${powerStats.xpCost}
                </div>
                <div class="stat-row">
                    <strong>Type:</strong> ${powerStats.damageType} |
                    <strong>Quick Cast:</strong> ${powerStats.quickCast}
                </div>
            </div>
            <div class="power-effect">
                <strong>Effect:</strong> ${powerStats.effect}
            </div>
            <div class="power-description">
                ${powerStats.details}
            </div>
            ${upgradeInfo}
            <div class="power-special">
                <strong>Special:</strong> ${powerStats.special}
            </div>
        </div>
    `;
}

// Update power upgrade dropdown options when power is selected
function updatePowerUpgradeOptions(powerSlot, powerName) {
    const levelSelect = document.getElementById(powerSlot + '-level');
    const upgradeSelect = document.getElementById(powerSlot + '-upgrade');

    if (!levelSelect || !upgradeSelect) {
        return;
    }

    // Reset upgrade dropdown
    upgradeSelect.innerHTML = '<option value="">Select Upgrade...</option>';
    upgradeSelect.style.display = 'none';

    if (!powerName || !POWER_DATA[powerName] || !POWER_DATA[powerName].upgrades) {
        return;
    }

    // Event listeners are now set up globally during initialization
    // No need to add them dynamically here anymore

    updatePowerUpgradeDropdown(powerSlot, powerName);
}

// Update upgrade dropdown based on selected level
function updatePowerUpgradeDropdown(powerSlot, powerName) {
    console.log(`*** updatePowerUpgradeDropdown called for ${powerSlot} with power ${powerName} ***`);

    const levelSelect = document.getElementById(powerSlot + '-level');
    const upgradeSelect = document.getElementById(powerSlot + '-upgrade');

    if (!levelSelect || !upgradeSelect || !powerName || !POWER_DATA[powerName]) {
        console.log(`Missing requirements for updatePowerUpgradeDropdown`);
        return;
    }

    const selectedLevel = levelSelect.value;
    const power = POWER_DATA[powerName];

    // Preserve current selection if any
    const currentSelection = upgradeSelect.value;
    console.log(`Current selection before update: "${currentSelection}"`);

    upgradeSelect.innerHTML = '<option value="">Select Upgrade...</option>';

    if (selectedLevel === 'base' || !power.upgrades || !power.upgrades[selectedLevel]) {
        upgradeSelect.style.display = 'none';
        return;
    }

    const upgradeData = power.upgrades[selectedLevel];
    let hasCurrentSelection = false;

    upgradeData.options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.name;
        optionElement.textContent = option.name + (option.mastery ? ' (Mastery)' : '');
        upgradeSelect.appendChild(optionElement);

        // Check if this matches the previously selected option
        if (option.name === currentSelection) {
            hasCurrentSelection = true;
        }
    });

    // Restore previous selection if it's still valid
    if (hasCurrentSelection) {
        upgradeSelect.value = currentSelection;
        console.log(`Restored selection to: "${upgradeSelect.value}"`);
    } else {
        console.log(`Could not restore selection "${currentSelection}" - not found in options`);
    }

    console.log(`Final upgrade dropdown value: "${upgradeSelect.value}"`);
    upgradeSelect.style.display = 'block';
}

// Get power stats based on current level and upgrade selection
function getPowerStats(power, level, upgrade) {
    console.log(`getPowerStats called with: level="${level}", upgrade="${upgrade}"`);

    let stats = {
        cost: power.cost,
        range: power.range,
        xpCost: power.xpCost,
        damageType: power.damageType,
        quickCast: power.quickCast,
        effect: power.effect,
        details: power.details,
        special: power.special
    };

    console.log(`  Initial stats: cost=${stats.cost}, details=${stats.details.substring(0, 30)}...`);

    if (level !== 'base' && power.upgrades && power.upgrades[level]) {
        console.log(`  Power has upgrades for level ${level}`);
        const upgradeData = power.upgrades[level];

        // Update cost and XP for upgrade level
        stats.cost = upgradeData.cost;
        stats.xpCost = power.xpCost + ' + ' + upgradeData.xpCost;
        console.log(`  Updated cost to: ${stats.cost}`);

        // If specific upgrade is selected, modify effects
        if (upgrade) {
            console.log(`  Looking for upgrade: "${upgrade}"`);
            const selectedUpgrade = upgradeData.options.find(opt => opt.name === upgrade);
            if (selectedUpgrade) {
                console.log(`  Found upgrade: ${selectedUpgrade.name}`);
                // Update effect and details with upgrade-specific information
                stats.effect = power.effect + ' (' + selectedUpgrade.name + ')';
                stats.details = selectedUpgrade.effect;
                console.log(`  Updated effect: ${stats.effect}`);
                console.log(`  Updated details: ${stats.details.substring(0, 50)}...`);
            } else {
                console.log(`  Upgrade "${upgrade}" not found in options:`, upgradeData.options.map(opt => opt.name));
            }
        } else {
            console.log(`  No specific upgrade selected`);
        }
    } else {
        console.log(`  Using base stats (level=${level}, has upgrades=${!!power.upgrades})`);
    }

    console.log(`  Final stats: cost=${stats.cost}, details=${stats.details.substring(0, 30)}...`);
    return stats;
}

// ==================== TESTING FUNCTIONS ====================

// Test function to manually trigger equipment info updates
function testEquipmentInfo() {
    console.log('=== Testing Equipment Info ===');

    // Test primary weapon
    const primaryWeapon = document.getElementById('primary-weapon');
    if (primaryWeapon) {
        console.log('Primary weapon value:', primaryWeapon.value);
        updateWeaponInfo({ target: primaryWeapon });
    }

    // Test secondary weapon
    const secondaryWeapon = document.getElementById('secondary-weapon');
    if (secondaryWeapon) {
        console.log('Secondary weapon value:', secondaryWeapon.value);
        updateWeaponInfo({ target: secondaryWeapon });
    }

    // Test armor
    const armor = document.getElementById('armor');
    if (armor) {
        console.log('Armor value:', armor.value);
        updateArmorInfo({ target: armor });
    }
}

// Make it available globally for testing
window.testEquipmentInfo = testEquipmentInfo;

// ==================== SQUAD MANAGEMENT FUNCTIONS ====================

// Switch between characters
function switchCharacter(characterIndex) {
    // Save current character data before switching
    saveCurrentCharacterToMemory();

    // Update current character index
    currentCharacterIndex = characterIndex;

    // Update tab visual states
    document.querySelectorAll('.tab-button').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`tab-${characterIndex}`).classList.add('active');

    // Load the selected character data
    loadCharacterFromMemory(characterIndex);

    // Update tab name in case character name changed
    updateTabNames();
}

// Save current character data to memory (squadData)
function saveCurrentCharacterToMemory() {
    squadData[currentCharacterIndex] = {
        // Character Basics
        name: document.getElementById('character-name').value,
        characterClass: document.getElementById('character-class').value,
        race: document.getElementById('character-race').value,
        background: document.getElementById('character-background').value,

        // Core Attributes
        health: document.getElementById('health').value,
        combat: document.getElementById('combat').value,
        evasion: document.getElementById('evasion').value,
        charisma: document.getElementById('charisma').value,
        tech: document.getElementById('tech').value,
        biotics: document.getElementById('biotics').value,

        // Equipment
        primaryWeapon: document.getElementById('primary-weapon').value,
        secondaryWeapon: document.getElementById('secondary-weapon').value,
        armor: document.getElementById('armor').value,
        omniBiotic: document.getElementById('omni-biotic').value,

        // Power Tracking
        bioticEnergyCurrent: document.getElementById('biotic-energy-current').value,
        bioticEnergyMax: document.getElementById('biotic-energy-max').value,
        techPointsCurrent: document.getElementById('tech-points-current').value,
        techPointsMax: document.getElementById('tech-points-max').value,

        // Combat Tracking
        hpCurrent: document.getElementById('hp-current').value,
        hpMax: document.getElementById('hp-max').value,
        kbCurrent: document.getElementById('kb-current').value,
        kbMax: document.getElementById('kb-max').value,
        bbCurrent: document.getElementById('bb-current').value,
        bbMax: document.getElementById('bb-max').value,
        armorValue: document.getElementById('armor-value').value,
        statusEffects: document.getElementById('status-effects').value,

        // Powers
        bioticPower1: document.getElementById('biotic-power-1').value,
        bioticPower2: document.getElementById('biotic-power-2').value,
        bioticPower3: document.getElementById('biotic-power-3').value,
        techPower1: document.getElementById('tech-power-1').value,
        techPower2: document.getElementById('tech-power-2').value,
        techPower3: document.getElementById('tech-power-3').value,

        // Power upgrades
        bioticPower1Level: document.getElementById('biotic-power-1-level').value,
        bioticPower2Level: document.getElementById('biotic-power-2-level').value,
        bioticPower3Level: document.getElementById('biotic-power-3-level').value,
        techPower1Level: document.getElementById('tech-power-1-level').value,
        techPower2Level: document.getElementById('tech-power-2-level').value,
        techPower3Level: document.getElementById('tech-power-3-level').value,

        bioticPower1Upgrade: document.getElementById('biotic-power-1-upgrade').value,
        bioticPower2Upgrade: document.getElementById('biotic-power-2-upgrade').value,
        bioticPower3Upgrade: document.getElementById('biotic-power-3-upgrade').value,
        techPower1Upgrade: document.getElementById('tech-power-1-upgrade').value,
        techPower2Upgrade: document.getElementById('tech-power-2-upgrade').value,
        techPower3Upgrade: document.getElementById('tech-power-3-upgrade').value,

        // Credits
        credits: document.getElementById('credits').value
    };
}

// Load character data from memory to the form
function loadCharacterFromMemory(characterIndex) {
    const data = squadData[characterIndex] || {};
    loadCharacterData(data);

    // Trigger equipment info updates after loading
    setTimeout(() => {
        // Update weapon info displays
        if (data.primaryWeapon) {
            const event = { target: document.getElementById('primary-weapon') };
            updateWeaponInfo(event);
        }
        if (data.secondaryWeapon) {
            const event = { target: document.getElementById('secondary-weapon') };
            updateWeaponInfo(event);
        }
        // Update armor info display
        if (data.armor) {
            const event = { target: document.getElementById('armor') };
            updateArmorInfo(event);
        }
        // Update power info displays and upgrade dropdowns
        const powerIds = ['biotic-power-1', 'biotic-power-2', 'biotic-power-3', 'tech-power-1', 'tech-power-2', 'tech-power-3'];
        powerIds.forEach(id => {
            const element = document.getElementById(id);
            if (element && element.value) {
                // First set up upgrade options
                updatePowerUpgradeOptions(id, element.value);

                // Then update the upgrade dropdown based on the loaded level (this populates the options)
                const levelSelect = document.getElementById(id + '-level');
                if (levelSelect && levelSelect.value !== 'base') {
                    updatePowerUpgradeDropdown(id, element.value);
                }

                // Finally update power info display AFTER upgrade dropdowns are properly populated
                const event = { target: element };
                updatePowerInfo(event);
            }
        });
    }, 100); // Small delay to ensure form is populated
}

// Update tab names with character names
function updateTabNames() {
    for (let i = 1; i <= 4; i++) {
        const character = squadData[i];
        const tabName = document.getElementById(`tab-name-${i}`);
        if (character && character.name && character.name.trim() !== '') {
            tabName.textContent = character.name;
        } else {
            tabName.textContent = `Character ${i}`;
        }
    }
}

// Save entire squad to localStorage
function saveSquad() {
    // Save current character data first
    saveCurrentCharacterToMemory();

    localStorage.setItem('beyondTheRelaySquad', JSON.stringify(squadData));

    // Show confirmation
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Squad Saved!';
    button.style.background = '#28a745';
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '#666';
    }, 1000);
}

// Load entire squad from localStorage
function loadSquad() {
    const saved = localStorage.getItem('beyondTheRelaySquad');
    if (!saved) {
        alert('No saved squad found.');
        return;
    }

    squadData = JSON.parse(saved);
    loadCharacterFromMemory(currentCharacterIndex);
    updateTabNames();

    // Show confirmation
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Squad Loaded!';
    button.style.background = '#28a745';
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '#666';
    }, 1000);
}

// Load squad from storage on page load
function loadSquadFromStorage() {
    const saved = localStorage.getItem('beyondTheRelaySquad');
    if (saved) {
        squadData = JSON.parse(saved);
        loadCharacterFromMemory(currentCharacterIndex);
    }
}

// Clear entire squad
function clearSquad() {
    if (confirm('Are you sure you want to clear the entire squad? This will delete all 4 characters and cannot be undone.')) {
        squadData = {
            1: {},
            2: {},
            3: {},
            4: {}
        };

        // Clear current form
        clearCurrentCharacterForm();

        // Clear localStorage
        localStorage.removeItem('beyondTheRelaySquad');

        // Update tab names
        updateTabNames();

        // Show confirmation
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Squad Cleared!';
        button.style.background = '#dc3545';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#666';
        }, 1000);
    }
}

// Export squad as JSON file
function exportSquad() {
    saveCurrentCharacterToMemory();

    const dataStr = JSON.stringify(squadData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'beyond-the-relay-squad.json';
    link.click();
}

// Import squad from JSON file
function importSquad(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            squadData = importedData;
            loadCharacterFromMemory(currentCharacterIndex);
            updateTabNames();

            alert('Squad imported successfully!');
        } catch (error) {
            alert('Error importing squad file. Please check the file format.');
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
}

// Save only the current character
function saveCurrentCharacter() {
    saveCurrentCharacterToMemory();
    saveSquad(); // Save entire squad to persist changes
}

// Clear only the current character
function clearCurrentCharacter() {
    if (confirm(`Are you sure you want to clear Character ${currentCharacterIndex}? This cannot be undone.`)) {
        squadData[currentCharacterIndex] = {};
        clearCurrentCharacterForm();
        updateTabNames();
        saveSquad(); // Save to persist the change
    }
}

// Duplicate current character to another slot
function duplicateCharacter() {
    const targetSlot = prompt('Which character slot should this be copied to? (1, 2, 3, or 4)');
    const targetIndex = parseInt(targetSlot);

    if (targetIndex >= 1 && targetIndex <= 4 && targetIndex !== currentCharacterIndex) {
        if (squadData[targetIndex] && Object.keys(squadData[targetIndex]).length > 0) {
            if (!confirm(`Character ${targetIndex} already has data. Overwrite it?`)) {
                return;
            }
        }

        saveCurrentCharacterToMemory();
        squadData[targetIndex] = {...squadData[currentCharacterIndex]};
        updateTabNames();
        saveSquad();

        alert(`Character duplicated to slot ${targetIndex}!`);
    } else {
        alert('Invalid slot number or same as current character.');
    }
}

// Helper function to clear the current form
function clearCurrentCharacterForm() {
    // Clear all form fields
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.type === 'number') {
            input.value = 0;
        } else {
            input.value = '';
        }
    });

    // Clear dropdowns specifically
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.value = '';
    });
}

// Modified auto-save to work with squad system
let autoSaveTimeout;
function autoSaveCharacter() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        saveCurrentCharacterToMemory();
        // Auto-save the squad data to localStorage
        localStorage.setItem('beyondTheRelaySquad', JSON.stringify(squadData));
        updateTabNames(); // Update in case character name changed
    }, 500); // 500ms delay to debounce
}