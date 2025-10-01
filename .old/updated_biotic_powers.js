    // Biotic Powers - Updated from v12/v13 files
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
    'Biotic Slash': {
        cost: '3 BE',
        range: '10 hexes',
        targeting: 'Line effect to target point',
        damageType: 'Biotic',
        xpCost: '30 XP',
        tier: 'Tier 1',
        effect: 'Biotic wave travels in straight line',
        details: 'Charge sword with biotic energy and unleash devastating wave in straight line. All enemies in line make Evasion Check vs. Biotic DC - on failure take 1d6+Biotics damage vs. All Enemy Types and +1d6 barrier damage vs. Biotic Barriers.',
        special: 'Damage reduced by Armor. Requires sword weapon. Wave affects all enemies along straight line path.',
        quickCast: 'Yes (Cost becomes 4 BE, both powers suffer -2 to hit)',
        upgrades: {
            level5: {
                cost: '5 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Improved Wave',
                        effect: 'Enhanced damage and range. Targets take 1d8+Biotics damage and +1d8 barrier damage. Extended range to 14 hexes.'
                    },
                    {
                        name: 'Staggering Slash',
                        effect: 'Enhanced status effects. Targets take 1d6+Biotics damage, +1d6 barrier damage, and are Staggered for 1 turn on failure.'
                    }
                ]
            },
            level10: {
                cost: '8 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Devastating Wave',
                        effect: 'Maximum damage with area explosion. Line targets take 1d10+Biotics damage and +1d10 barrier damage. Area explosion at target point affects enemies within 2 hexes for 1d6+Biotics damage and +1d6 barrier damage.'
                    },
                    {
                        name: 'Armor Rending',
                        effect: 'Armor destruction capabilities. Targets take 1d8+Biotics damage, +1d8 barrier damage, Staggered for 1 turn, and 2 Armor Degradation.'
                    }
                ]
            },
            level15: {
                cost: '12 BE',
                xpCost: '124 XP',
                options: [
                    {
                        name: 'Master Slayer',
                        effect: 'Ultimate wave control. Devastating Wave: line becomes 3 hexes wide, 16 hex range, explosion 3-hex radius. Armor Rending: line becomes 2 hexes wide, additional -1 Armor Degradation (total -3).'
                    }
                ]
            }
        }
    },
    'Charge': {
        cost: '5 BE',
        range: '12 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'Biotic',
        xpCost: '65 XP',
        tier: 'Tier 2',
        effect: 'Instant teleport to enemy with impact',
        details: 'Instantly teleport to enemy using biotic energy, appearing in adjacent hex. Target makes Evasion Check vs. Biotic DC - on failure takes 1d8+Biotics damage, is Staggered for 1 turn, and you restore 5 Kinetic Barrier points.',
        special: 'Cannot affect enemies with active barriers (barriers absorb all effects). Must teleport to adjacent hex. Requires line of sight.',
        quickCast: 'Yes (Cost becomes 6 BE, both powers suffer -2 to hit, teleportation may affect range)',
        upgrades: {
            level5: {
                cost: '8 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Heavy Charge',
                        effect: 'Enhanced impact force. Target takes 1d10+Biotics damage, is Staggered for 1 turn, and you restore 5 Kinetic Barrier points.'
                    },
                    {
                        name: 'Explosive Charge',
                        effect: 'Area disruption upon arrival. Target takes 1d8+Biotics damage and is Staggered. All enemies within 1 hex of arrival point make Evasion Check or be Staggered for 1 turn.'
                    }
                ]
            },
            level10: {
                cost: '12 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Devastating Charge',
                        effect: 'Maximum impact force. Target takes 2d6+Biotics damage, is Staggered for 1 turn, and you restore 7 Kinetic Barrier points.'
                    },
                    {
                        name: 'Kinetic Burst',
                        effect: 'Damaging area effect. Target takes 1d8+Biotics damage and is Staggered. All enemies within 2 hexes take 1d6+Biotics damage and make Evasion Check or be Staggered.'
                    }
                ]
            },
            level15: {
                cost: '20 BE',
                xpCost: '124 XP',
                options: [
                    {
                        name: 'Charge Mastery',
                        effect: 'Ultimate biotic force enhancement. Primary damage increases by +1d6. Restore full Kinetic Barriers regardless of result. Choose enhancement: Nova on kill or chain Charge to second enemy within 8 hexes.'
                    }
                ]
            }
        }
    },
    'Dark Channel': {
        cost: '10 BE',
        range: '14 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'Biotic',
        xpCost: '120 XP',
        tier: 'Tier 3',
        effect: 'Persistent biotic plague that spreads',
        details: 'Infect target with persistent biotic plague. Make Biotics vs. Evasion attack - on hit target gains Dark Channel affliction for 3 turns, taking 1d8+Biotics damage at start of each turn. If target dies while afflicted, spreads to nearest enemy within 4 hexes.',
        special: 'Cannot affect enemies with active barriers. Only one Dark Channel active per caster. Afflicted enemies cannot regenerate barriers. No initial damage on cast.',
        quickCast: 'No (Tier 3 restriction)',
        upgrades: {
            level5: {
                cost: '13 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Virulent Plague',
                        effect: 'Enhanced damage and duration. Target gains affliction for 4 turns, taking 1d10+Biotics damage at start of each turn.'
                    },
                    {
                        name: 'Spreading Contagion',
                        effect: 'Enhanced spreading range. Spreads to nearest enemy within 8 hexes when target dies.'
                    }
                ]
            },
            level10: {
                cost: '19 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Corrupting Channel',
                        effect: 'Debuffing enhancement. Affliction lasts 4 turns, deals 2d6+Biotics damage, target suffers -2 to all attack rolls while afflicted.'
                    },
                    {
                        name: 'Epidemic Outbreak',
                        effect: 'Multi-target spreading. When target dies, spreads to all enemies within 6 hexes with remaining duration.'
                    }
                ]
            },
            level15: {
                cost: '29 BE',
                xpCost: '124 XP',
                options: [
                    {
                        name: 'Dark Channel Mastery',
                        effect: 'Ultimate plague enhancement. Heal 2 HP each time Dark Channel deals damage. Duration increases by 1 turn. When spreads, new target immediately takes damage.'
                    }
                ]
            }
        }
    },
    'Dominate': {
        cost: '6 BE',
        range: '12 hexes',
        targeting: 'Single organic enemy within line of sight',
        damageType: 'Biotic',
        xpCost: '70 XP',
        tier: 'Tier 2',
        effect: 'Override organic enemy will',
        details: 'Override organic enemy will through biotic neural manipulation. Make Biotics vs. Evasion attack - on hit target is Dominated for 1 turn (acts as ally). You control one full action of choice.',
        special: 'Cannot affect synthetic enemies. Cannot affect enemies with active barriers. Only one target Dominated at a time. Cannot force self-harm.',
        quickCast: 'Yes (Cost becomes 7 BE, both powers suffer -2 to hit)',
        upgrades: {
            level5: {
                cost: '8 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Tactical Override',
                        effect: 'Enhanced control capabilities. Control both Move and Action during controlled turn.'
                    },
                    {
                        name: 'Psychic Backlash',
                        effect: 'Debuffing aftermath. Control one action, target suffers -2 to all rolls during next turn after control ends.'
                    }
                ]
            },
            level10: {
                cost: '11 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Forceful Submission',
                        effect: 'Enhanced combat ability. Control Move and Action, target gains +1d4 to all damage rolls while controlled.'
                    },
                    {
                        name: 'Residual Control',
                        effect: 'Extended debuffing. Control one action, target suffers -2 to all rolls and becomes Dazed for 1 turn after returning.'
                    }
                ]
            },
            level15: {
                cost: '16 BE',
                xpCost: '124 XP',
                options: [
                    {
                        name: 'Domination Mastery',
                        effect: 'Chaining and extended control. If Dominated target defeats enemy, cast Dominate on new target for free. Option to extend control to 2 turns instead of 1.'
                    }
                ]
            }
        }
    },
    'Lash': {
        cost: '4 BE',
        range: '10 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'Biotic',
        xpCost: '60 XP',
        tier: 'Tier 2',
        effect: 'Seize and whip enemy through air',
        details: 'Seize enemy with biotic force and whip violently through air. Make Biotics vs. Evasion attack - on hit target takes 2d4+Biotics damage, moved up to 6 hexes, takes 1d6+Biotics collision damage if hitting terrain/figures, and is Knocked Prone.',
        special: 'Cannot affect enemies with active barriers. Full control over movement path within 6-hex limit. Both target and collision victim take damage.',
        quickCast: 'Yes (Cost becomes 5 BE, both powers suffer -2 to hit)',
        upgrades: {
            level5: {
                cost: '6 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Violent Lash',
                        effect: 'Enhanced damage output. Target takes 1d8+Biotics damage and 1d8+Biotics collision damage.'
                    },
                    {
                        name: 'Extended Reach',
                        effect: 'Increased range and movement. Range increases to 14 hexes, movement up to 8 hexes.'
                    }
                ]
            },
            level10: {
                cost: '10 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Whirlwind Lash',
                        effect: 'Multiple collision capability. Target takes 1d10+Biotics damage, moved through maximum 3 collision points, takes 1d8+Biotics damage for each collision.'
                    },
                    {
                        name: 'Stunning Lash',
                        effect: 'Guaranteed stunning and extended range. Target takes 1d10+Biotics damage, moved up to 8 hexes, Stunned for 1 turn after being moved, Knocked Prone. Range 14 hexes.'
                    }
                ]
            },
            level15: {
                cost: '16 BE',
                xpCost: '124 XP',
                options: [
                    {
                        name: 'Lash Mastery',
                        effect: 'Ultimate biotic whip control. After successful hit, immediately Lash second enemy within 10 hexes as free action. If whip second into first, both take 1d8+Biotics collision damage and are Stunned. Alternatively, circular pattern deals 2d6+Biotics damage with area knockdown effects.'
                    }
                ]
            }
        }
    },
    'Lift': {
        cost: '2 BE',
        range: '14 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'Biotic',
        xpCost: '25 XP',
        tier: 'Tier 1',
        effect: 'Seize enemy and lift helplessly',
        details: 'Seize enemy with biotic force and lift helplessly into air. Make Biotics vs. Evasion attack - on hit target is Lifted for 1 turn (cannot move, attack, use abilities, or take cover).',
        special: 'Cannot affect enemies with active barriers. Only one casting active per caster. Recasting releases previous targets.',
        quickCast: 'Yes (Cost becomes 3 BE, both powers suffer -2 to hit)',
        upgrades: {
            level5: {
                cost: '5 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Mass Lift',
                        effect: 'Multiple enemy suspension. Affects up to 3 enemies within 4 hexes of original target. Each requires separate attack roll.'
                    },
                    {
                        name: 'Lingering Pressure',
                        effect: 'Extended duration. Target is Lifted for 2 turns.'
                    }
                ]
            },
            level10: {
                cost: '8 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Exposing Suspension',
                        effect: 'Enhanced vulnerability. Affects up to 3 enemies, Lifted targets take +1d6 additional damage from all incoming attacks.'
                    },
                    {
                        name: 'Psychic Aftershock',
                        effect: 'Debuffing aftermath. Target Lifted for 2 turns, suffers -2 to all rolls during next turn after Lift ends.'
                    }
                ]
            },
            level15: {
                cost: '12 BE',
                xpCost: '124 XP',
                options: [
                    {
                        name: 'Gravitic Mastery',
                        effect: 'Damage over time and implosion. Lifted targets take 1d6+Biotics damage at start of each turn. When Lift ends, take 1d8+Biotics implosive damage. Any damage while lifted ends Lift immediately.'
                    }
                ]
            }
        }
    },
    'Nova': {
        cost: 'All remaining Barriers + 5 BE',
        range: 'Self (1-hex radius AoE)',
        targeting: 'All enemies within 1 hex of caster',
        damageType: 'Biotic',
        xpCost: '130 XP',
        tier: 'Tier 3',
        effect: 'Discharge entire biotic barrier in shockwave',
        details: 'Discharge entire biotic barrier in violent shockwave. All enemies within 1 hex make Evasion Check vs. Biotic DC - on failure take 2d6+Biotics damage and are Knocked Prone.',
        special: 'Damage reduced by Armor. Cannot use if 0 Barriers. After using, Barriers reduced to 0.',
        quickCast: 'No (Tier 3 restriction)',
        upgrades: {
            level5: {
                cost: 'All Barriers + 8 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Expanding Blast',
                        effect: 'Increased area. All enemies within 2 hexes make Evasion Check - on failure take 2d6+Biotics damage and are Knocked Prone.'
                    },
                    {
                        name: 'Overloaded Nova',
                        effect: 'Enhanced damage. All enemies within 1 hex make Evasion Check - on failure take 2d8+Biotics damage and are Knocked Prone.'
                    }
                ]
            },
            level10: {
                cost: 'All Barriers + 13 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Shock Nova',
                        effect: 'Extreme area coverage. All enemies within 3 hexes make Evasion Check - on failure take 2d6+Biotics damage and are Knocked Prone.'
                    },
                    {
                        name: 'Ruinous Core',
                        effect: 'Regenerative destruction. All enemies within 1 hex take 3d6+Biotics damage and are Knocked Prone on failure. If any target killed, regain 1d6 Barriers.'
                    }
                ]
            },
            level15: {
                cost: 'All Barriers + 21 BE',
                xpCost: '124 XP',
                options: [
                    {
                        name: 'Nova Mastery',
                        effect: 'Ultimate devastating power. If any target reduced to 0 HP, regain half maximum Barriers. If defeat 2+ enemies, cast Charge or Slam as free action. Shock Nova: enemies Pulled 2 hexes with collision damage. Ruinous Core: damage increases to 4d6+Biotics.'
                    }
                ]
            }
        }
    },
    'Reave': {
        cost: '8 BE',
        range: '14 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'Biotic',
        xpCost: '75 XP',
        tier: 'Tier 2',
        effect: 'Assault biology with destabilizing energy',
        details: 'Assault target biology with destabilizing biotic energy. Target makes Evasion Check vs. Biotic DC - on failure takes Reave affliction for 2 turns, 1d6+Biotics damage at start of each turn, permanently disables healing/regeneration.',
        special: 'Damage reduced by Armor. Works on organic and synthetic targets. Reapplying resets duration but does not stack.',
        quickCast: 'Yes (Cost becomes 9 BE, both powers suffer -2 to hit)',
        upgrades: {
            level5: {
                cost: '11 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Lingering Reave',
                        effect: 'Extended affliction. Reave affliction lasts 3 turns instead of 2.'
                    },
                    {
                        name: 'Corrosive Drain',
                        effect: 'Enhanced armor reduction. Deals 1d8+Biotics damage and treats target Armor as 1 lower (temporary).'
                    }
                ]
            },
            level10: {
                cost: '16 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Siphon Surge',
                        effect: 'Enhanced healing for caster. Affliction lasts 3 turns, deals 1d8+Biotics damage, you restore 2 HP each time Reave deals damage.'
                    },
                    {
                        name: 'Chain Reave',
                        effect: 'Spreading effect. Deals 1d8+Biotics damage, Armor treated as 1 lower, Reave arcs to second enemy within 3 hexes.'
                    }
                ]
            },
            level15: {
                cost: '24 BE',
                xpCost: '124 XP',
                options: [
                    {
                        name: 'Reave Mastery',
                        effect: 'Ultimate power. Cast on up to 3 enemies, restore 3 HP per tick per target. If Reave reduces target to 0 HP, they detonate in 2-hex biotic shockwave dealing 1d8+Biotics damage and Dazing enemies, you regain 10 HP.'
                    }
                ]
            }
        }
    },
    'Shockwave': {
        cost: '4 BE',
        range: '8-hex line',
        targeting: 'All enemies in a straight line',
        damageType: 'Biotic',
        xpCost: '35 XP',
        tier: 'Tier 1',
        effect: 'Powerful biotic shockwave in line',
        details: 'Unleash powerful biotic shockwave in straight line. All enemies within line make Evasion Check vs. Biotic DC - on failure take 1d6+Biotics damage vs. All Enemy Types.',
        special: 'Damage reduced by Armor. Line originates from your hex and extends 8 hexes forward.',
        quickCast: 'Yes (Cost becomes 5 BE, both powers suffer -2 to hit, area effect may interfere)',
        upgrades: {
            level5: {
                cost: '6 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Improved Shockwave',
                        effect: 'Enhanced damage and range. 12-hex line, targets take 1d8+Biotics damage on failure.'
                    },
                    {
                        name: 'Concussive Wave',
                        effect: 'Stunning capability. 8-hex line, targets take 1d6+Biotics damage and are Stunned for 1 turn on failure.'
                    }
                ]
            },
            level10: {
                cost: '9 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Devastating Shockwave',
                        effect: 'Maximum damage. 12-hex line, targets take 2d4+Biotics damage on failure.'
                    },
                    {
                        name: 'Knockback Wave',
                        effect: 'Forced movement. 8-hex line, targets take 1d6+Biotics damage, are Stunned for 1 turn, and Pushed 3 hexes with collision damage on failure.'
                    }
                ]
            },
            level15: {
                cost: '14 BE',
                xpCost: '124 XP',
                options: [
                    {
                        name: 'Shockwave Mastery',
                        effect: 'Ultimate power. Devastating Shockwave: 16-hex line, 2d6+Biotics damage, 2-turn Stun. Knockback Wave: 4-hex radius centered on you, launches enemies 3 hexes with 1d8+Biotics damage and collision effects.'
                    }
                ]
            }
        }
    },
    'Singularity': {
        cost: '8 BE',
        range: '12 hexes',
        targeting: '2-hex radius area',
        damageType: 'Biotic',
        xpCost: '125 XP',
        tier: 'Tier 3',
        effect: 'Concentrated mass effect gravity field',
        details: 'Create concentrated mass effect field that distorts gravity. Place Singularity within 12 hexes, active for 2 rounds. Enemies starting turn inside or entering field make Evasion Check vs. Biotic DC - on failure are Lifted (Singularity variant) while inside field, lose all cover. Can remake check at end of turn.',
        special: 'Lifted targets cannot move, attack, cast abilities, or take cover. Damage from Singularity does not end Lift. Only one Singularity active per caster.',
        quickCast: 'No (Tier 3 restriction)',
        upgrades: {
            level5: {
                cost: '11 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Gravitational Hold',
                        effect: 'Extended field duration. Singularity active for 3 rounds, failure causes Staggered for 2 rounds on success instead of 1.'
                    },
                    {
                        name: 'Event Horizon',
                        effect: 'Damage on entry. Same 2-round duration, but targets take 1d6+Biotics damage when entering field on failure.'
                    }
                ]
            },
            level10: {
                cost: '16 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Gravitic Sink',
                        effect: 'Enhanced effects. 3-round duration with enhanced control over gravity field effects.'
                    },
                    {
                        name: 'Singularity Crush',
                        effect: 'Ongoing damage. 2-round duration, targets take 1d8+Biotics damage when entering and 1d8+Biotics damage at start of each turn while Lifted.'
                    }
                ]
            },
            level15: {
                cost: '24 BE',
                xpCost: '124 XP',
                options: [
                    {
                        name: 'Singularity Mastery',
                        effect: 'Ultimate gravitational control. When cast, Pull all enemies within 3 hexes toward center. Gravitic Sink: Lifted enemies take 2d6+Biotics damage per turn, field implodes on final round. Singularity Crush: damage increases to 2d4+Biotics, cascading gravity Pulls new enemies within 4 hexes each round.'
                    }
                ]
            }
        }
    },
    'Slam': {
        cost: '5 BE',
        range: '14 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'Biotic',
        xpCost: '65 XP',
        tier: 'Tier 2',
        effect: 'Lift target and slam with crushing force',
        details: 'Lift target and slam them down with crushing force. Target makes Evasion Check vs. Biotic DC - on failure takes 2d4+Biotics damage vs. All Enemy Types and is Knocked Prone.',
        special: 'Damage reduced by Armor.',
        quickCast: 'Yes (Cost becomes 6 BE, both powers suffer -2 to hit)',
        upgrades: {
            level5: {
                cost: '8 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Shockwave Slam',
                        effect: 'Stunning impact. Target takes 2d4+Biotics damage, is Knocked Prone, and Stunned for 1 turn on failure.'
                    },
                    {
                        name: 'Empowered Slam',
                        effect: 'Enhanced damage. Target takes 2d6+Biotics damage and is Knocked Prone on failure.'
                    }
                ]
            },
            level10: {
                cost: '13 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Crater Impact',
                        effect: 'Enhanced damage with maximum stunning. Target takes 3d4+Biotics damage, is Knocked Prone, and Stunned for 1 turn on failure.'
                    },
                    {
                        name: 'Efficient Strike',
                        effect: 'Enhanced damage with improved efficiency. Target takes 2d6+Biotics damage and is Knocked Prone. Reduces total BE cost to 11 BE.'
                    }
                ]
            },
            level15: {
                cost: '21 BE',
                xpCost: '124 XP',
                options: [
                    {
                        name: 'Slam Mastery',
                        effect: 'Ultimate power. Choose enhancement: Seismic Slam (primary target takes 4d4+Biotics damage, Stunned for 2 turns) or Mass Slam (choose up to 3 enemies, each makes separate Evasion Check, each takes 2d6+Biotics damage with full effects on failure).'
                    }
                ]
            }
        }
    },
    'Stasis': {
        cost: '3 BE',
        range: '12 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'Biotic',
        xpCost: '35 XP',
        tier: 'Tier 1',
        effect: 'Freeze enemy in temporal stasis field',
        details: 'Freeze single enemy in temporal stasis field, completely immobilizing them. Make Biotics vs. Evasion attack - on hit target affected by Stasis for 1 turn (cannot move, attack, use abilities; immune to damage). First attack breaks Stasis immediately, deals no damage.',
        special: 'Target immune to all damage while in Stasis. Any attack breaks Stasis immediately. Breaking attack deals no damage. Target cannot take actions.',
        quickCast: 'Yes (Cost becomes 4 BE, both powers suffer -2 to hit, may waste secondary power if broken)',
        upgrades: {
            level5: {
                cost: '5 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Deep Stasis',
                        effect: 'Increased duration. Target affected by Stasis for 3 turns instead of 1.'
                    },
                    {
                        name: 'Lingering Stasis',
                        effect: 'Debuffing aftermath. Target affected by Stasis for 1 turn, then Staggered for 2 turns after Stasis ends (movement reduced by half).'
                    }
                ]
            },
            level10: {
                cost: '8 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Bastion Stasis',
                        effect: 'Enhanced damage capability. Target affected by Stasis for 1 turn. Squad members can damage target while in Stasis - attacks deal half damage instead of breaking Stasis.'
                    },
                    {
                        name: 'Bubble Stasis',
                        effect: 'Area denial capability. Create 2-hex radius stasis field for 3 rounds. Enemies entering make Evasion Check - failure causes Stasis for 2 turns, success causes Staggered for 2 turns.'
                    }
                ]
            },
            level15: {
                cost: '13 BE',
                xpCost: '124 XP',
                options: [
                    {
                        name: 'Temporal Mastery',
                        effect: 'Enhanced temporal manipulation. Bastion Stasis: affects all enemies within 2 hexes of primary target, squad damage becomes full instead of half. Bubble Stasis: field duration 5 rounds, 3-hex radius, Staggered enemies become Stunned for 1 turn.'
                    }
                ]
            }
        }
    },
    'Throw': {
        cost: '3 BE',
        range: '10 hexes',
        targeting: 'Single enemy within line of sight',
        damageType: 'Biotic',
        xpCost: '30 XP',
        tier: 'Tier 1',
        effect: 'Seize enemy and hurl through air',
        details: 'Seize enemy with biotic force and hurl through air. Make Biotics vs. Evasion attack - on hit target hurled up to 3 hexes (5 if Lifted), Knocked Prone, takes 1d6+Biotics collision damage if hitting terrain/objects/figures.',
        special: 'Both target and collision victim take collision damage. Collision damage reduced by Armor. You choose throw direction.',
        quickCast: 'Yes (Cost becomes 4 BE, both powers suffer -2 to hit)',
        upgrades: {
            level5: {
                cost: '5 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Powerful Throw',
                        effect: 'Enhanced collision force. Target hurled up to 3 hexes (5 if Lifted), takes 1d8+Biotics collision damage if hitting objects.'
                    },
                    {
                        name: 'Extended Throw',
                        effect: 'Increased throwing range. Target hurled up to 5 hexes (7 if Lifted), takes 1d6+Biotics collision damage. Range increases to 14 hexes.'
                    }
                ]
            },
            level10: {
                cost: '8 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Explosive Throw',
                        effect: 'Chain collision effects. Target hurled up to 3 hexes (5 if Lifted), takes 2d4+Biotics collision damage. If hits another figure, that figure also Knocked Prone and pushed 1 hex away.'
                    },
                    {
                        name: 'Long Throw',
                        effect: 'Debuffing collision effects. Target hurled up to 7 hexes (9 if Lifted), takes 1d6+Biotics collision damage, Staggered for 1 turn if collision occurs. Range 14 hexes.'
                    }
                ]
            },
            level15: {
                cost: '13 BE',
                xpCost: '124 XP',
                options: [
                    {
                        name: 'Kinetic Mastery',
                        effect: 'Explosive area effects. After successful hit, if target collides with another figure, 1-hex radius biotic detonation deals 2d4+Biotics damage to all enemies in area. Enemies in blast make Evasion Check vs. Biotic DC or be Knocked Prone.'
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
        effect: 'Dense biotic projectile destabilizes molecular structure',
        details: 'Hurl dense biotic projectile that destabilizes molecular structure. Make Biotics vs. Evasion attack - on hit target takes 2d4+Biotics damage vs. All Enemy Types, +1d6 barrier damage vs. Biotic Barriers, and 2 Armor Degradation (permanent).',
        special: 'Damage reduced by Armor. Biotic Barriers block Armor Degradation but take all damage. Armor Degradation permanent for mission, stacks with multiple hits. Cannot reduce armor below 0.',
        quickCast: 'Yes (Cost becomes 9 BE, both powers suffer -2 to hit)',
        upgrades: {
            level5: {
                cost: '11 BE',
                xpCost: '48 XP',
                options: [
                    {
                        name: 'Precision Collapse',
                        effect: 'Enhanced armor destruction. Target takes 2d6+Biotics damage, +1d8 barrier damage, and 3 Armor Degradation (permanent).'
                    },
                    {
                        name: 'Mass Tearing',
                        effect: 'Biotic vulnerability. Target takes 2d4+Biotics damage, +1d6 barrier damage, 2 Armor Degradation, and -1 to Evasion checks against Biotic abilities until end of your next turn.'
                    }
                ]
            },
            level10: {
                cost: '16 BE',
                xpCost: '77 XP',
                options: [
                    {
                        name: 'Annihilation Field',
                        effect: 'Maximum damage. Target takes 3d4+Biotics damage, +2d4 barrier damage, and 3 Armor Degradation (permanent).'
                    },
                    {
                        name: 'Biotic Unraveling',
                        effect: 'Extended vulnerability. Target takes 2d4+Biotics damage, +1d6 barrier damage, 2 Armor Degradation, and -2 to all Evasion checks vs. Biotic abilities for 2 full rounds.'
                    }
                ]
            },
            level15: {
                cost: '24 BE',
                xpCost: '124 XP',
                options: [
                    {
                        name: 'Warp Mastery',
                        effect: 'Ultimate destructive power. Damage increases to 4d4+Biotics, armor reduction increases to 4 Armor Degradation. Choose enhancement: if target reduced to 0 HP, adjacent enemies take 1d8+Biotics Armor-bypassing damage, or target suffers -2 to Biotic Evasion for 3 rounds while enemies within 3 hexes suffer -1 to Biotic Evasion for 2 rounds and are Slowed for 1 round.'
                    }
                ]
            }
        }
    },