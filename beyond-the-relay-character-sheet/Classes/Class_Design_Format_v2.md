# Beyond the Relay - Class Design Template & Standards

*Reference document for maintaining consistent class design across the system*

---

## Class Structure Template

### Class Header Format
```markdown
# Beyond the Relay - [Class Name] Class

## [Class Name]
*[One-line class identity/archetype]*

**Attribute Distribution:**
- [Primary Attribute]: +2 (OR +1 for hybrids)
- [Secondary Attribute]: +1 (hybrids only)
- Health: +1 (unless Soldier gets +2)

**Armor Access:** All armor types (see Armor & Power Interaction Rules for heavy armor penalties)

**Weapon Access:** [Specific weapon types - no class gets "all weapons" except Soldier]

**Role:** [Brief tactical role description]
```

---

## Class Powers Section

### Signature Powers (Hybrids Only)
```markdown
### [Signature Power Name]
- **Cost:** None
- **[Other mechanics]:** [Details]
- **Effect:** [Description]
- **Special:** [Special rules]

**Uses per Mission:**
| [Primary Attribute] Attribute | Uses |
|-------------------------------|------|
| 0-4 | 3 |
| 5-9 | 4 |
| 10-14 | 5 |
| 15-19 | 6 |
| 20+ | 7 |
```

### Power Selection (Power Classes)
```markdown
### Starting Powers
- **Choose X Tier 1 [power type] powers**
- **Choose Y Tier 2 [power type] powers** (pure specialists only)
- **Choose Z additional Tier 1 [power type] powers** (from [Feature] feature)

### [Power Type] Focus
- **Cost:** None (3 uses per mission)
- **Duration:** Instant
- **Effect:** Immediately regain 1d6+2 [BE/TP]. Cannot be used if at maximum [BE/TP].
- **Special:** [Lore explanation]
```

### Non-Power Abilities (Soldier)
```markdown
### [Ability Name]
- **Cost:** None (X uses per mission)
- **[Other mechanics]:** [Details]
- **Effect:** [Description]
```

---

## Class Features Section

### Soldier Scaling Abilities
```markdown
**[Ability Name]** - [Brief description of what it does].

**Uses per Mission:**
| Combat Attribute | Uses |
|------------------|------|
| 0-4 | [Starting Value] |
| 5-9 | [+1] |
| 10-14 | [+2] |
| 15-19 | [+3] |
| 20+ | [+4] |

*[Special rules about usage or limitations]*
```

### Thermal Clip Class Features
```markdown
**[Feature Name]** - [Description of thermal clip manipulation ability]. [Mechanical effect and usage rules].
```

### Class Feature Guidelines
- **No Power Duplication:** Class features should not replicate the effects of tech or biotic powers
- **Utility Focus:** Class features enhance non-combat capabilities or provide unique tactical options
- **Resource Enhancement:** Features can modify resource costs, availability, or efficiency
- **System Integration:** Features should work within existing mechanical frameworks

### Power Cost Reduction (Every 5 Levels)
```markdown
| [Attribute] Attribute | Cost Reduction |
|-----------------------|----------------|
| 0-4 | 0 |
| 5-9 | -1 |
| 10-14 | -2 |
| 15-19 | -3 |
| 20+ | -4 |

*Minimum power cost remains 1 [BE/TP] regardless of reductions.*
```

### Deployable Bonuses (Every 3 Levels)
```markdown
| [Attribute] Attribute | Bonus HP | Bonus Evasion |
|-----------------------|----------|---------------|
| 0-2 | +0 | +0 |
| 3-5 | +5 | +1 |
| 6-8 | +10 | +2 |
| 9-11 | +15 | +3 |
| 12-14 | +20 | +4 |
| 15+ | +25 | +5 |
```

### Non-Scaling Features
```markdown
**[Feature Name]** - [Complete description]. [Mechanical effect].
```

### Starting Equipment Format
```markdown
**Starting Equipment:**
- **Credits:** X,XXX to spend on gear
- **Free Class Bonus:** [Item name] (worth XXX credits) [+ additional items]
- **Mandatory Gear:** 1 Medigel (no cost)

**Suggested Equipment Purchases:**
- [Armor Type]: [Specific suggestions with costs]
- [Weapon Type]: [Specific suggestions with costs]
- Thermal Clips: Standard clips for mission preparation
- Remaining credits for [relevant gear types], consumables, or save for upgrades
```

---

## Class Identity Sections

### Tactical Identity (5 bullet points)
```markdown
## Tactical Identity

- **[Primary Role]:** [How they fulfill this role]
- **[Secondary Role]:** [How they fulfill this role]
- **[Unique Advantage]:** [What makes them special]
- **[Resource Management]:** [How they handle limited resources]
- **[Specialization]:** [What they're uniquely good at]
```

### Combat Flow (5 steps)
```markdown
## Combat Flow

1. **[Step 1]:** [What they do first]
2. **[Step 2]:** [Follow-up action]
3. **[Step 3]:** [Main combat action]
4. **[Step 4]:** [Sustained combat]
5. **[Step 5]:** [End game/positioning]
```

### Strengths (6-7 bullet points)
```markdown
## Why Choose [Class Name]?

- **[Unique Advantage]:** [Specific mechanical benefit]
- **[Core Strength]:** [What they excel at]
- **[Tactical Benefit]:** [How they help the team]
- **[Flexibility/Reliability]:** [Consistency advantages]
- **[Identity Fulfillment]:** [Thematic satisfaction]
- **[Mechanical Advantage]:** [System mastery]
- **[Class Fantasy]:** [Emotional/narrative appeal]
```

### Weaknesses (5-6 bullet points)
```markdown
## Weaknesses

- **[Limitation 1]:** [Specific tactical weakness]
- **[Limitation 2]:** [Resource or capability limit]
- **Heavy Armor Trade-offs:** [Power class penalty reference] (see Armor & Power Interaction Rules)
- **[Limitation 3]:** [Dependency or vulnerability]
- **[Limitation 4]:** [Complexity or management issue]
- **[Limitation 5]:** [Strategic limitation]
```

---

## Design Principles

### Class Types & Resource Management
**Pure Specialists:** Get resource regeneration abilities (Focus powers)
- **Adept:** Biotic Focus + Biotic Mastery cost reduction
- **Engineer:** Tech Focus + Tech Mastery cost reduction + Field Fabrication (2 TP → 1 Standard thermal clip)
- **Soldier:** Unlimited abilities (no resource management) + Ammo Discipline (reduce squad thermal clip needs by 1)

**Hybrid Classes:** Get signature powers + efficiency bonuses, no resource regen
- **Vanguard:** Scaling Biotic Charge + weapon specialization
- **Infiltrator:** Scaling Tactical Cloak + precision bonuses

### Attribute Distribution Patterns
- **Pure Specialists:** Primary +2, Health +1
- **Hybrids:** Primary +1, Secondary +1, Health +1  
- **Soldier Exception:** Health +2, Combat +1

### Armor Access Standard
**All classes:** "All armor types (see Armor & Power Interaction Rules for heavy armor penalties)"
**Soldier note:** "(see Armor & Power Interaction Rules - no penalties for Soldiers)"

### Cross-Reference Standards
- **Armor access:** Always reference Armor & Power Interaction Rules
- **Power classes:** Include penalty warning in Weaknesses section
- **Soldier:** Highlight immunity advantage in Strengths section

---

## Scaling Chart Standards

### Signature Power Uses (Base 3 Formula)
```markdown
| [Attribute] Attribute | Uses |
|-----------------------|------|
| 0-4 | 3 |
| 5-9 | 4 |
| 10-14 | 5 |
| 15-19 | 6 |
| 20+ | 7 |
```

---

## Balance Guidelines

### Power vs. Combat Classes
- **Power classes:** Broad utility, resource management, battlefield control
- **Combat classes:** Sustained damage, unlimited abilities, weapon mastery
- **Hybrids:** Tactical flexibility, signature powers, specialization bonuses

### Resource Pool Standards
- **Pure Specialists:** Starting attribute × 5 (e.g., Biotics 3 = 15 BE)
- **Hybrids:** Starting attribute × 5 (e.g., Tech 3 = 15 TP)

### Class Uniqueness Requirements
- Each class must have at least one completely unique mechanical element
- No class should obsolete another class's primary role
- Weapon access should create distinct tactical niches
- **Class features must not duplicate power effects** - avoid giving free versions of tech/biotic abilities
- **Thermal clip integration** - classes may have features that interact with the thermal clip economy

### Thermal Clip Feature Examples
**Ammo Discipline (Soldiers):** Reduce squad's total thermal clip requirements by 1 per mission through superior military logistics

**Field Fabrication (Engineers):** Spend 2 TP to create 1 emergency Standard thermal clip during mission prep through omni-tool fabrication

---

*"Every class should feel mechanically distinct, thematically appropriate, and tactically essential."*