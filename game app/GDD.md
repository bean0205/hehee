# Game Design Document (GDD)
## TERRARUN / URBAN LEGENDS
**Version:** 1.0  
**Date:** November 2025  
**Document Type:** Game Design Specification  
**Target Audience:** Game Designers, UI/UX Designers, Client Developers

---

## 1. GAME OVERVIEW

### 1.1 Core Concept
TerraRun is a location-based MMO strategy game where players convert physical movement into territorial conquest. The real world becomes a hexagonal battlefield where every step matters, every run is a strategic decision, and every player contributes to their faction's dominance.

### 1.2 Core Pillars
1. **Movement is Power:** Physical activity directly translates to game progress
2. **Territory Matters:** Control of real-world locations provides persistent benefits
3. **Social Strategy:** Solo efforts contribute to collective goals
4. **Fair Competition:** Effort-based scoring ensures all fitness levels can compete
5. **Real Rewards:** Virtual achievements unlock tangible benefits

### 1.3 Target Emotions
- **Pride:** "I own this neighborhood"
- **Competition:** "We must defend our territory"
- **Progress:** "I'm getting stronger every day"
- **Community:** "My team needs me"
- **Discovery:** "What's hidden in that hex?"

---

## 2. CORE GAMEPLAY LOOPS

### 2.1 Core Loop (Single Session: 20-45 minutes)

```
[START RUN] → [MOVE IN REAL WORLD] → [CAPTURE HEXAGONS] → [GAIN RESOURCES] → [END RUN] → [RECEIVE REWARDS]
     ↑                                                                                              ↓
     ←───────────────────────── [CHECK PROGRESS / PLAN NEXT ROUTE] ←──────────────────────────────
```

**Detailed Breakdown:**

1. **Pre-Run Planning (2-3 min)**
   - Open map view
   - Identify target hexagons (unclaimed/enemy/decaying)
   - Plan optimal route
   - Check active buffs/events
   - Select run mode (Solo/Squad/Event)

2. **Active Running (15-40 min)**
   - Start GPS tracking
   - Physical movement captures hexagons
   - Real-time feedback on territory gained
   - Dynamic events trigger (treasure spawns, ghosts)
   - Energy depletes based on effort

3. **Post-Run Processing (2-3 min)**
   - Review captured territory
   - Calculate points earned
   - Distribute rewards (XP, Currency, Items)
   - Update leaderboards
   - Share achievement (optional)

### 2.2 Meta Loop (Daily/Weekly Progression)

```
[DAILY LOGIN] → [CLAIM TERRITORY] → [DEFEND TERRITORY] → [LEVEL UP] → [UNLOCK ABILITIES]
       ↓                                    ↑                               ↓
[JOIN EVENTS] ← [UPGRADE GEAR] ← [PARTICIPATE IN WARS] ← [JOIN CLAN ACTIVITIES]
```

**Weekly Cycle:**
- **Monday-Tuesday:** Territory expansion focus
- **Wednesday-Thursday:** Defense and maintenance
- **Friday:** Clan raid preparation
- **Weekend:** Major events, District Wars, Boss Raids

### 2.3 Progression Loop (Long-term: Months)

```
[NEWBIE] → [LEARN MECHANICS] → [JOIN COMMUNITY] → [SPECIALIZE CLASS] → [LEAD INITIATIVES]
    ↓                                                                            ↓
[CASUAL PLAYER] → [REGULAR PARTICIPANT] → [CLAN MEMBER] → [CLAN OFFICER] → [LEGEND STATUS]
```

---

## 3. SCORING & ECONOMY SYSTEM

### 3.1 Experience Points (XP) Calculation

#### Base XP Formula
```
Base_XP = (Distance_km × 100) × Pace_Multiplier × Heart_Rate_Multiplier × Territory_Bonus
```

#### Component Breakdown

**Distance XP:**
- Walking: 50 XP per km
- Running: 100 XP per km  
- Cycling: 30 XP per km
- Stairs: 200 XP per 100 floors

**Pace Multiplier:**
```
Walking (> 12 min/km): 1.0x
Easy Run (8-12 min/km): 1.2x
Moderate Run (6-8 min/km): 1.5x
Fast Run (4-6 min/km): 2.0x
Sprint (< 4 min/km): 2.5x
```

**Heart Rate Zone Multiplier (Relative Effort):**
```
Zone 1 (50-60% max HR): 0.8x - Recovery
Zone 2 (60-70% max HR): 1.0x - Easy
Zone 3 (70-80% max HR): 1.5x - Moderate  
Zone 4 (80-90% max HR): 2.0x - Hard
Zone 5 (90-100% max HR): 2.5x - Maximum
```

**Territory Bonus:**
- Neutral hex: +0%
- Enemy hex: +50%
- Contested hex: +100%
- Boss zone: +200%

### 3.2 Point System (Competitive Score)

#### Territory Control Points (TCP)
```
TCP = Hexagons_Captured × Hex_Value × Duration_Held × Defense_Multiplier
```

**Hex Values:**
- Standard hex: 10 points
- Park/Green hex: 15 points
- Commercial hex: 20 points
- Landmark hex: 50 points
- Stronghold hex: 100 points

**Duration Multiplier:**
- Hour 1-24: 1.0x
- Day 2-7: 1.5x
- Week 2-4: 2.0x
- Month 2+: 3.0x

### 3.3 Energy System

#### Energy Pool
```
Max_Energy = 100 + (Level × 2) + Equipment_Bonus
Energy_Regen = 10 points/hour (offline) | 5 points/hour (online)
```

#### Energy Consumption
- Claiming neutral hex: 1 energy
- Attacking enemy hex: 3 energy
- Defending own hex: 2 energy
- Using special ability: 5-20 energy
- Boss raid participation: 10 energy/attack

#### Energy Recovery Methods
1. **Natural Regen:** 240 points/day
2. **Food Items:** +20-50 instant
3. **Rest at Stronghold:** 2x regen rate
4. **Walker Support:** Receive energy from Walker class

### 3.4 Currency System

#### Primary Currencies

**1. Sweat Coins (Soft Currency)**
- Earned: 1 coin per 100m moved
- Daily cap: 500 coins (50km)
- Uses: Basic upgrades, consumables

**2. Legend Tokens (Hard Currency)**
- Earned: Achievements, Events, Top rankings
- Purchase: $0.99 = 100 tokens
- Uses: Premium skins, instant upgrades, Battle Pass

**3. Team Honor (Social Currency)**
- Earned: Helping teammates, clan activities
- Cannot be purchased
- Uses: Clan upgrades, special team skins

---

## 4. CLASS SYSTEM DETAILED

### 4.1 Runner Class - "The Infantry"

#### Base Stats
- Movement Speed: 100%
- Energy Efficiency: 100%
- Territory Capture: 100%
- Special Resource: Momentum

#### Unique Abilities

**Active Skills:**
1. **Sprint Burst** (Cooldown: 5 min)
   - Next 500m grants 3x territory points
   - Energy cost: 10

2. **Marathon Mode** (Cooldown: 24 hours)
   - 20% less energy consumption for 1 hour
   - Requires: 5km warmup

3. **Blitz Attack** (Cooldown: 10 min)
   - Instantly capture 3 adjacent hexes
   - Energy cost: 20

**Passive Skills:**
- **Endurance:** +10% max energy per level
- **Swift Feet:** +5% movement speed bonus to XP
- **Territorial:** Captured hexes last 20% longer

#### Progression Path
```
Level 1-10: Basic Runner
Level 11-25: Experienced Runner
Level 26-40: Elite Runner
Level 41-50: Marathon Master
Level 51+: Legendary Sprinter
```

### 4.2 Cyclist Class - "The Cavalry"

#### Base Stats
- Movement Speed: 300%
- Energy Efficiency: 150%
- Territory Capture: 50%
- Special Resource: Velocity

#### Unique Abilities

**Active Skills:**
1. **Reconnaissance** (Cooldown: 10 min)
   - Reveal all treasures in 2km radius
   - Duration: 5 minutes

2. **Supply Run** (Cooldown: 30 min)
   - Transfer resources between strongholds
   - Capacity: 100 + (Level × 10) items

3. **Armor Break** (Boss Raids only)
   - Deal 2x damage to boss shields
   - Stacks with team damage

**Passive Skills:**
- **Pathfinder:** Unlock shortcuts on map
- **Efficient Routing:** -20% energy cost for long distances
- **Scout Network:** See enemy movements in 1km radius

#### Progression Path
```
Level 1-10: Casual Cyclist
Level 11-25: Route Master
Level 26-40: Speed Demon
Level 41-50: Tour Champion
Level 51+: Wind Rider
```

### 4.3 Walker Class - "The Support"

#### Base Stats
- Movement Speed: 30%
- Energy Efficiency: 200%
- Territory Capture: 150%
- Special Resource: Persistence

#### Unique Abilities

**Active Skills:**
1. **Energy Harvest** (Passive accumulation)
   - Every 2000 steps = 1 Energy Pack
   - Can gift to any team member

2. **Meditation Zone** (Cooldown: 1 hour)
   - Create healing area (100m radius)
   - Team members gain 2x energy regen for 30 min

3. **Steady Advance** (Always active)
   - Captured hexes gain +50% defense
   - Immune to sprint-theft for 1 hour

**Passive Skills:**
- **Iron Will:** Cannot lose hexes while actively walking
- **Team Player:** Nearby allies gain +20% XP
- **Resource Master:** Double item drop rate

#### Progression Path
```
Level 1-10: Casual Walker
Level 11-25: Dedicated Walker
Level 26-40: Zen Master
Level 41-50: Mountain Sage
Level 51+: Eternal Wanderer
```

### 4.4 Multi-Class System
- Players can switch class once per week
- Maintain separate progression for each class
- Unlock hybrid abilities at max level (Level 50+)

---

## 5. SKILL TREE SYSTEM

### 5.1 Tree Structure

Each class has 3 specialization branches with 10 skills each:

```
                    [CLASS MASTERY]
                          |
        ┌─────────────────┼─────────────────┐
    [OFFENSE]         [DEFENSE]         [UTILITY]
        |                 |                  |
   [10 Skills]       [10 Skills]        [10 Skills]
```

### 5.2 Skill Points
- Earn 1 point per level (Max 50 points)
- Reset available for 100 Legend Tokens
- Can save multiple builds

### 5.3 Runner Skill Trees

#### Offense Branch - "Speed Demon"
1. **Quick Start:** First 100m of run = 2x points
2. **Pace Master:** Maintain pace for bonus XP
3. **Sprint Chains:** Consecutive sprints build multiplier
4. **Territory Crusher:** Capture 2 hexes at once
5. **Adrenaline Rush:** Convert HP to speed boost
6. **Momentum Builder:** Speed increases over distance
7. **Blitz Tactics:** Surprise capture behind enemy lines
8. **Speed Steal:** Take speed from passed enemies
9. **Turbo Mode:** 1 min of 5x speed (daily)
10. **Lightning Strike:** Instant capture of entire row

#### Defense Branch - "Iron Legs"
1. **Steady Pace:** Immune to speed debuffs
2. **Recovery Master:** +50% energy regen
3. **Fortified Hexes:** Captured hexes +30% defense
4. **Endurance Shield:** Reduce energy costs by 20%
5. **Second Wind:** Auto-revive when energy hits 0
6. **Territory Guard:** Alert when hexes attacked
7. **Defensive Position:** Can't lose hexes for 10 min
8. **Iron Will:** Immune to fatigue effects
9. **Stronghold Builder:** Create mini-bases
10. **Unbreakable:** 1 hour of invincible hexes (weekly)

#### Utility Branch - "Pathfinder"
1. **GPS Boost:** +10% accuracy on tracking
2. **Weather Runner:** Bonuses in bad weather
3. **Night Owl:** 2x XP from 10PM-5AM
4. **Social Butterfly:** +XP when running with friends
5. **Treasure Hunter:** +50% item find rate
6. **Shortcut Master:** Unlock secret paths
7. **Event Magnet:** Attract dynamic events
8. **Photographer:** Bonus for AR photos
9. **Ambassador:** Convert enemy hexes peacefully
10. **Legend Status:** Permanent trail on map

### 5.4 Cyclist Skill Trees

#### Offense Branch - "Speed Blitz"
1. **Turbo Start:** First 1km at 3x points
2. **Slipstream:** Draft behind others for speed
3. **Hill Crusher:** Uphill = bonus damage to bosses
4. **Route Optimizer:** AI suggests best paths
5. **Velocity Strike:** Speed converts to attack power
6. **Chain Lightning:** Capture connected hexes
7. **Pursuit Mode:** Chase down enemies
8. **Breakaway:** Escape from battles
9. **Time Trial:** Race against ghost records
10. **Tour de Force:** 100km ride = legendary reward

#### Defense Branch - "Armor Rider"
1. **Carbon Frame:** -30% damage taken
2. **Emergency Brake:** Instant stop without penalty
3. **Shield Generator:** Protect nearby allies
4. **Repair Kit:** Fix team's equipment
5. **Escort Formation:** Guard runners
6. **Supply Cache:** Store extra resources
7. **Mobile Base:** Stronghold on wheels
8. **Signal Jammer:** Hide from enemy radar
9. **Reinforced Wheels:** Immune to slows
10. **Fortress Bike:** Unbeatable for 1 hour

#### Utility Branch - "Explorer"
1. **Map Reveal:** See 2x further
2. **Terrain Master:** All terrain = equal speed
3. **Delivery Service:** Transport items to team
4. **Weather Radar:** Predict weather bonuses
5. **Sponsor Deals:** Earn extra currency
6. **Photography Mode:** Cinematic screenshots
7. **Trail Blazer:** Create new paths for team
8. **Resource Scanner:** Find hidden items
9. **Ambassador:** Negotiate with enemy teams
10. **World Tour:** Unlock global challenges

### 5.5 Walker Skill Trees

#### Offense Branch - "Slow & Steady"
1. **Every Step Counts:** 2x points per step
2. **Persistent Pressure:** Gradual damage to enemies
3. **Zone Control:** Expand influence slowly
4. **Siege Mode:** Break enemy defenses over time
5. **Attrition Warfare:** Drain enemy resources
6. **Territorial Expansion:** Claim larger areas
7. **March Formation:** Team walks = 3x power
8. **Relentless Advance:** Cannot be stopped
9. **Strategic Position:** Control key points
10. **Continental Drift:** Move entire territories

#### Defense Branch - "Immovable Object"
1. **Turtle Shell:** 90% damage reduction while walking
2. **Healing Aura:** Regen for nearby allies
3. **Safe Zone:** Create peaceful areas
4. **Resource Protection:** Items cannot be stolen
5. **Meditation Shield:** Immune while stationary
6. **Team Fortress:** Protect entire clan
7. **Supply Master:** Infinite resource storage
8. **Peace Treaty:** Temporary ceasefire
9. **Monument Builder:** Create permanent landmarks
10. **Eternal Guardian:** Hexes never decay

#### Utility Branch - "Wise Wanderer"
1. **Step Counter:** Bonus at milestones
2. **Weather Walker:** All weather = bonus
3. **Zen Mode:** Walking meditation = 2x XP
4. **Social Walker:** Group walks = multipliers
5. **Item Crafter:** Combine resources
6. **Peaceful Resolution:** Convert without conflict
7. **Walking Tour:** Create guided routes
8. **Wisdom Share:** Teach skills to others
9. **Elder Status:** Respect from all factions
10. **Living Legend:** Permanent statue on map

---

## 6. HEXAGON TERRITORY SYSTEM

### 6.1 Hexagon Properties

#### Size & Scale
- **Hex Radius:** 250 meters (optimal for urban density)
- **Area per Hex:** ~0.16 km²
- **Hexes per City:** 5,000-50,000 depending on size
- **Visibility Range:** 1km radius from player position

#### Hex States
1. **Fog (Unexplored)**
   - Color: Gray mist effect
   - Status: No owner, no points
   - First Discovery Bonus: 2x XP

2. **Neutral (Explored)**
   - Color: Light gray
   - Status: Available for capture
   - Capture Cost: 1 energy

3. **Owned (Captured)**
   - Color: Team/Player color
   - Status: Generating points
   - Defense Value: 100 HP

4. **Contested (Battle)**
   - Color: Flashing multi-color
   - Status: Multiple claims active
   - Resolution: Most activity in 1 hour wins

5. **Fortified (Stronghold)**
   - Color: Bright team color + icon
   - Status: 5x defense, resource generation
   - Requirement: Hold for 7 days + upgrade

### 6.2 Capture Mechanics

#### Basic Capture Process
1. **Enter Hex:** Physical presence required
2. **Claim Initiation:** 
   - Minimum speed: 3 km/h
   - Duration in hex: 10+ seconds
3. **Ownership Transfer:**
   - Instant if neutral
   - Requires "siege" if enemy-owned
4. **Confirmation:** Visual + haptic feedback

#### Siege Mechanics (Capturing Enemy Hexes)
```
Siege_Success = (Attacker_Power - Defender_Power) > Defense_Threshold

Where:
Attacker_Power = Base_Attack × Class_Bonus × Speed_Multiplier × Squad_Bonus
Defender_Power = Base_Defense × Time_Held × Fortification_Level × Active_Defense
Defense_Threshold = 100 × Hex_Level
```

#### Multi-Capture Rules
- **Line Capture:** Running through connected hexes
- **Area Capture:** Special abilities affect radius
- **Chain Reaction:** Surrounded hexes auto-flip

### 6.3 Decay & Renewal System

#### Decay Formula
```
Daily_Decay = Base_Decay_Rate × (1 - Activity_Modifier) × Weather_Factor

Where:
Base_Decay_Rate = 15 HP/day
Activity_Modifier = min(1, Team_Activity / Required_Activity)
Weather_Factor = 0.5 (good weather) to 2.0 (extreme weather)
```

#### Decay Timeline
- Day 1-3: No decay (Grace period)
- Day 4-7: -15 HP/day
- Day 8-14: -25 HP/day
- Day 15+: -50 HP/day
- Day 30: Auto-neutral

#### Renewal Methods
1. **Active Patrol:** Run through = full restore
2. **Remote Maintenance:** Spend 5 energy = +50 HP
3. **Team Support:** Allies can maintain
4. **Auto-Renewal:** Strongholds maintain 1km radius

### 6.4 Special Hex Types

#### Terrain Bonuses
1. **Parks/Green Spaces**
   - +50% XP gain
   - 2x energy regeneration
   - Peaceful zone (no PvP)

2. **Hills/Elevation**
   - +100% effort points
   - Visibility bonus
   - Weather immunity

3. **Water Adjacent**
   - Cooling effect (+20% performance)
   - Cannot be fortified
   - Special events spawn

4. **Commercial Districts**
   - O2O merchant bonuses
   - High traffic = faster capture
   - Resource trading posts

5. **Residential Areas**
   - Privacy mode auto-enabled
   - Reduced decay rate
   - Community bonus

#### Landmark Hexes
- **Monuments:** Permanent ownership recognition
- **Stadiums:** Mass event hosting
- **Transport Hubs:** Fast travel points
- **Schools:** Tutorial zones for new players
- **Hospitals:** Full healing + revival

---

## 7. BALANCE FORMULAS

### 7.1 Effort-Based Scoring (Fair Play System)

#### Relative Effort Score (RES)
```
RES = Base_Score × Personal_Effort_Index × Fitness_Equalizer

Where:
Personal_Effort_Index = (Current_HR / Resting_HR) × (Current_Pace / Best_Pace)
Fitness_Equalizer = 1 / (VO2_Max / Average_VO2_Max)
```

This ensures:
- Beginners competing fairly with athletes
- Effort matters more than absolute performance
- Personal improvement is rewarded

### 7.2 Matchmaking Rating (MMR)

```
MMR = (Win_Rate × 1000) + (Avg_Distance × 10) + (Consistency × 100) + (Team_Contribution × 50)

Brackets:
Bronze: 0-999
Silver: 1000-1999
Gold: 2000-2999
Platinum: 3000-3999
Diamond: 4000-4999
Legend: 5000+
```

### 7.3 Dynamic Difficulty Adjustment

```
Difficulty_Modifier = Base_Difficulty × (1 + Player_Skill - Average_Skill) × Engagement_Factor

Where:
Engagement_Factor = Recent_Activity / Expected_Activity
```

Applied to:
- Enemy hex defense values
- Event spawn rates
- Reward multipliers
- Boss HP in raids

### 7.4 Economy Balance

#### Earn Rates (per hour active)
- Beginner: 100-200 Sweat Coins
- Intermediate: 200-400 Sweat Coins
- Advanced: 400-800 Sweat Coins
- Elite: 800-1600 Sweat Coins

#### Spend Rates
- Basic upgrade: 500 coins
- Rare item: 2,000 coins
- Epic unlock: 10,000 coins
- Legendary status: 50,000 coins

#### Time to Meaningful Reward
- First unlock: 2-3 runs
- Major upgrade: 1 week
- Prestige item: 1 month
- End game content: 3-6 months

---

## 8. EVENT SYSTEM

### 8.1 Dynamic Events

#### Rain of Gold (Cơn mưa vàng)
**Trigger:** Random or weather-based
**Duration:** 1-2 hours
**Effect:** 
- Specific area gains 3x point multiplier
- Visible golden particle effects on map
- Push notification to nearby players
**Frequency:** 2-3 times per week per district
**Rewards:** 500-2000 bonus coins

#### Ghost Hunt (Bóng ma)
**Trigger:** Night time (8PM - 12AM)
**Mechanics:**
- Ghost NPC appears on map
- Moves at 6-8 km/h
- Players must match pace to "catch"
- Collaborative (multiple players can chase)
**Rewards:** 
- Rare skins
- Legend tokens
- Speed boost items

#### Flash Mob Run
**Trigger:** Community manager initiated
**Alert:** 30-minute warning
**Goal:** Gather 50+ players at location
**Rewards scale with participants:**
- 10-25 players: 2x XP
- 26-50 players: 3x XP
- 51-100 players: 5x XP
- 100+: Legendary rewards for all

#### Territory War
**Schedule:** Every Saturday 8-10 PM
**Rules:**
- All hexes worth 2x points
- No decay during event
- Special "War Paint" skins available
- Winning district gets week-long buffs

### 8.2 Seasonal Events

#### Spring Marathon (March-May)
- Cherry blossom themed rewards
- Focus on distance challenges
- Unlocks: Sakura trail effects

#### Summer Sprint Series (June-August)  
- Heat resistance challenges
- Beach/Water hexes give bonuses
- Unlocks: Cooling gear, water effects

#### Autumn Harvest (September-November)
- Collection events
- Double resource drops
- Unlocks: Harvest themed items

#### Winter Warrior (December-February)
- Cold weather bonuses
- Indoor activity support
- Unlocks: Winter gear, snow effects

### 8.3 Boss Raid Events

#### Boss Properties
```
Boss_HP = Base_HP × Number_of_Participants × Difficulty_Level
Boss_Defense = Base_Defense × (1 - Armor_Break_Stacks)
Boss_Attack = Periodic_Damage_to_Territory
```

#### Raid Mechanics
1. **Discovery Phase:** Scout reveals boss location
2. **Preparation:** 24-hour warning
3. **Battle Window:** 2-4 hours active
4. **Damage Calculation:**
   - Runners: 10 damage per km
   - Cyclists: 5 damage per km + armor break
   - Walkers: Healing/buffs for team
5. **Victory Condition:** Reduce HP to 0
6. **Rewards:** Distributed based on contribution

#### Boss Types
- **Deadline Dragon:** Appears end of month
- **Burnout Beast:** Triggered by overwork detection  
- **Lazy Leviathan:** Spawns after team inactivity
- **Stress Storm:** Random weekday appearance

---

## 9. AR MECHANICS

### 9.1 AR Treasure Hunt

#### Implementation
- **Technology:** ARCore (Android) / ARKit (iOS)
- **Triggers:** GPS coordinates + time windows
- **Visual Elements:** 3D chest models, particle effects

#### Treasure Types
1. **Common Chests**
   - Spawn rate: Every 500m
   - Contents: 50-100 coins
   - AR Interaction: Simple tap

2. **Rare Chests**
   - Spawn rate: Every 5km
   - Contents: 200-500 coins + items
   - AR Interaction: Solve mini-puzzle

3. **Legendary Chests**
   - Spawn rate: Weekly per district
   - Contents: Premium rewards
   - AR Interaction: Multi-player unlock

#### AR Mini-Games
- **Lock Picking:** Swipe patterns to unlock
- **Crystal Matching:** Memory game
- **Rune Tracing:** Draw symbols
- **Photo Challenge:** Specific pose/location

### 9.2 AR Monsters/NPCs

#### Monster Encounters
```
Encounter_Rate = Base_Rate × Activity_Level × Time_Factor × Location_Bonus
Battle_Success = Player_Stats vs Monster_Stats (automated)
```

#### Monster Types
1. **Sloth Demon:** Appears when idle
2. **Speed Phantom:** Challenges pace
3. **Guardian Golem:** Protects landmarks
4. **Energy Vampire:** Steals resources

#### Battle System
- Auto-battle based on stats
- Real running affects outcome
- Can flee by running away
- Team battles for bosses

### 9.3 AR Photography Mode

#### Features
- Custom poses for avatar
- Environmental effects (weather, time)
- Filters themed to achievements
- Social sharing integration
- NFT minting (future)

#### Photo Challenges
- Daily: Specific location/pose
- Weekly: Themed collections
- Special: Event related
- User Generated: Community votes

---

## 10. UI FLOW & WIREFRAMES

### 10.1 Information Architecture

```
[MAIN APP]
    ├── [MAP VIEW] (Default Home)
    │   ├── Hex Grid Overlay
    │   ├── Player Position
    │   ├── Territory Colors
    │   └── Event Markers
    ├── [PROFILE]
    │   ├── Stats Dashboard
    │   ├── Achievement Gallery
    │   ├── Inventory
    │   └── Settings
    ├── [SOCIAL]
    │   ├── Clan/Team View
    │   ├── Leaderboards
    │   ├── Friends List
    │   └── Chat/Messages
    ├── [ACTIVITIES]
    │   ├── Start Run
    │   ├── Join Event
    │   ├── Training Plans
    │   └── History
    └── [SHOP]
        ├── Cosmetics
        ├── Upgrades
        ├── Battle Pass
        └── Special Offers
```

### 10.2 Core Screen Flows

#### New User Flow
```
[Splash] → [Login/Register] → [Permissions] → [Tutorial] → [First Run] → [Main Map]
```

#### Start Run Flow
```
[Map] → [Run Planning] → [Select Mode] → [3-2-1 Start] → [Live Tracking] → [Summary] → [Share]
```

#### Event Join Flow
```
[Event Notification] → [Event Details] → [Join/Register] → [Waiting Room] → [Event Active] → [Results]
```

### 10.3 Key Screen Designs

#### Map View (Main Screen)
```
┌─────────────────────────────┐
│ [Status Bar]                │
├─────────────────────────────┤
│ ┌───┐  [District Name]  ⚡99│
│ │You│    Daily: 5.2km       │
│ └───┘  Streak: 7 days  🔥  │
├─────────────────────────────┤
│                             │
│      [HEXAGON MAP]          │
│   ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡        │
│  ⬡ ⬢ ⬢ ⬡ ⬡ ⬢ ⬡        │
│   ⬡ ⬢ 📍 ⬢ ⬡ ⬡ ⬡       │
│  ⬡ ⬡ ⬢ ⬢ ⬢ ⬡ ⬡        │
│   ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡        │
│                             │
│ [Event Banner: Ghost Hunt!] │
├─────────────────────────────┤
│ ┌────────────────────────┐  │
│ │    🏃 START RUN        │  │
│ └────────────────────────┘  │
├─────────────────────────────┤
│ Map │ Social │ You │ Shop  │
└─────────────────────────────┘
```

#### Active Run Screen
```
┌─────────────────────────────┐
│ [Minimal Status]            │
├─────────────────────────────┤
│         ⏱ 15:42            │
│                             │
│       📍 LIVE MAP           │
│     [Your trail in red]     │
│                             │
│   Hexes Captured: 12        │
│   Points Earned: 420        │
│                             │
├─────────────────────────────┤
│  PACE: 5:45  | ♡ BPM: 145  │
│  DISTANCE: 2.8 km           │
│  ENERGY: ⚡ 75/100          │
├─────────────────────────────┤
│ [⏸ PAUSE]    [📷]    [🏁 END] │
└─────────────────────────────┘
```

#### Post-Run Summary
```
┌─────────────────────────────┐
│      🎉 RUN COMPLETE        │
├─────────────────────────────┤
│   [TERRITORY MAP CHANGES]   │
│     +8 Hexes Captured       │
│     +3 Hexes Defended       │
│                             │
│   Distance: 5.2 km          │
│   Time: 28:15               │
│   Avg Pace: 5:26/km         │
│   Calories: 420             │
│                             │
│   XP EARNED: +520           │
│   COINS: +156               │
│   TEAM CONTRIBUTION: +80    │
│                             │
│   [Achievement Unlocked!]    │
│   "Morning Warrior"         │
├─────────────────────────────┤
│ [SHARE]  [DETAILS]  [DONE] │
└─────────────────────────────┘
```

### 10.4 UI Design Principles

#### Visual Hierarchy
1. **Primary:** Current action/status
2. **Secondary:** Progress indicators
3. **Tertiary:** Social/competitive elements

#### Color System
- **Team Colors:** User customizable
- **Enemy:** Red spectrum
- **Neutral:** Gray spectrum  
- **Rewards:** Gold/Yellow
- **Energy:** Blue/Cyan
- **Health:** Green spectrum

#### Typography
- Headers: Bold, sans-serif
- Body: Regular, high readability
- Numbers: Monospace for timers
- Emphasis: Color + weight

#### Interaction Patterns
- **Swipe:** Navigate between tabs
- **Tap:** Select/Activate
- **Long Press:** Detailed info
- **Pinch:** Zoom map
- **Shake:** Report bug

### 10.5 Responsive Considerations

#### Device Adaptations
- **Small Phones:** Compact UI, essential info
- **Large Phones:** More map visible
- **Tablets:** Split-screen support
- **Wearables:** Companion app sync

#### Accessibility
- High contrast mode
- Large text option
- Voice commands
- Haptic feedback
- Screen reader support

---

## 11. TECHNICAL SPECIFICATIONS

### 11.1 Performance Requirements

#### Mobile App Performance
- Launch time: < 3 seconds
- Map load: < 1 second
- GPS accuracy: ± 5 meters
- Battery usage: < 10% per hour
- Offline cache: 48 hours data
- Frame rate: 60 FPS (map), 30 FPS (AR)

#### Network Requirements
- Bandwidth: < 100 KB/minute active
- Sync frequency: Every 30 seconds
- Offline mode: Full feature set
- Recovery: Auto-reconnect
- Compression: GZIP for all API calls

### 11.2 Data Structures

#### Hex Data Model
```json
{
  "hex_id": "H3_8928308280fffff",
  "coordinates": {
    "lat": 21.0285,
    "lng": 105.8542
  },
  "owner": {
    "type": "player|team|neutral",
    "id": "user_123",
    "captured_at": "2025-11-20T10:30:00Z"
  },
  "status": {
    "health": 85,
    "defense": 100,
    "decay_rate": 15,
    "last_maintenance": "2025-11-20T08:00:00Z"
  },
  "properties": {
    "terrain": "park",
    "elevation": 25,
    "special": ["landmark", "water_adjacent"]
  }
}
```

#### Activity Data Model
```json
{
  "activity_id": "run_abc123",
  "user_id": "user_456",
  "timestamps": {
    "start": "2025-11-20T06:00:00Z",
    "end": "2025-11-20T06:30:00Z"
  },
  "metrics": {
    "distance_m": 5240,
    "duration_s": 1800,
    "avg_pace_s_per_km": 343,
    "avg_hr": 145,
    "calories": 420
  },
  "territory": {
    "hexes_captured": 12,
    "hexes_defended": 5,
    "points_earned": 520
  },
  "rewards": {
    "xp": 520,
    "coins": 156,
    "items": ["energy_drink", "speed_boost"],
    "achievements": ["morning_warrior"]
  }
}
```

### 11.3 Anti-Cheat Measures

#### Detection Methods
1. **Speed Analysis**
   - Max human running: 44 km/h
   - Max cycling: 80 km/h  
   - Sustained speed checks

2. **Pattern Recognition**
   - Unrealistic pace consistency
   - Impossible route changes
   - Device sensor validation

3. **Multi-Factor Validation**
   - GPS + Accelerometer + Gyroscope
   - Heart rate correlation
   - Altitude changes

4. **Behavioral Analysis**
   - Activity time patterns
   - Social graph validation
   - Historical performance

#### Response Actions
- Warning (First offense)
- Shadow ban (Repeated)
- Temporary suspension
- Permanent ban (Severe)

---

## 12. MONETIZATION MECHANICS

### 12.1 Battle Pass System

#### Season Structure (30 days)
- **Free Track:** 30 rewards
- **Premium Track:** 100 rewards
- **Price:** $4.99/month
- **XP Required:** 100 XP per tier

#### Reward Examples
- Tier 1-10: Coins, basic items
- Tier 11-30: Rare skins, XP boosts
- Tier 31-60: Epic items, energy refills
- Tier 61-99: Legendary skins, titles
- Tier 100: Exclusive avatar, permanent trail

### 12.2 Cosmetic Shop

#### Categories
1. **Avatar Skins**
   - Common: $0.99
   - Rare: $2.99
   - Epic: $4.99
   - Legendary: $9.99

2. **Trail Effects**
   - Basic colors: $1.99
   - Animated: $3.99
   - Seasonal: $4.99

3. **Hex Markers**
   - Custom flags: $0.99
   - Animated: $2.99
   - Team bundles: $9.99

### 12.3 Gameplay Accelerators

#### Energy Refills
- Small (25): $0.99
- Medium (50): $1.99
- Large (100): $3.99
- Unlimited (24h): $9.99

#### XP Boosters
- 2x for 1 hour: $1.99
- 2x for 1 day: $4.99
- 2x for 1 week: $14.99

#### Territory Protection
- 24h shield: $2.99
- 3-day shield: $6.99
- 7-day shield: $12.99

### 12.4 B2B Pricing Tiers

#### Starter (10-50 employees)
- $99/month
- Basic features
- Email support

#### Professional (51-200 employees)
- $499/month
- Full features
- Priority support
- Custom branding

#### Enterprise (201+ employees)
- Custom pricing
- White label option
- Dedicated success manager
- API access

---

## 13. SOCIAL & COMMUNITY FEATURES

### 13.1 Clan/Guild System

#### Structure
- Max members: 50
- Ranks: Leader, Officer, Member
- Level system: 1-20
- Shared resources/goals

#### Clan Activities
- Territory wars
- Raid bosses together
- Shared strongholds
- Clan-only events
- Resource sharing

#### Clan Progression
- XP from member activities
- Unlock perks at levels
- Clan achievements
- Leaderboard ranking

### 13.2 Communication Systems

#### In-Game Chat
- Global (District level)
- Clan chat
- Direct messages
- Voice notes (Premium)

#### Social Features
- Friend system
- Follow runners
- Activity feed
- Kudos/reactions
- Achievement sharing

### 13.3 Community Events

#### User-Generated Content
- Create custom routes
- Design challenges
- Host meetups
- Share training plans

#### Recognition Systems
- Leaderboards (Daily/Weekly/All-time)
- Hall of Fame
- Monthly MVP
- Community ambassador program

---

## 14. ONBOARDING & TUTORIAL

### 14.1 First-Time User Experience (FTUE)

#### Step 1: Welcome & Permissions (30 seconds)
```
"Welcome, Runner! Let's conquer your city!"
[Allow Location Access]
[Allow Fitness Tracking]  
[Enable Notifications]
```

#### Step 2: Avatar Creation (1 minute)
- Choose base model
- Select starting colors
- Pick runner name
- Join home district

#### Step 3: Tutorial Run (5 minutes)
- Guide to nearby hex
- Explain capture mechanics
- Show energy system
- Demonstrate rewards

#### Step 4: First Goal Setting
- Daily distance goal
- Weekly frequency
- Preferred run times
- Social preferences

### 14.2 Progressive Disclosure

#### Level 1-5: Basics
- Running and capturing
- Energy management
- Basic rewards

#### Level 6-10: Social
- Join clan
- Friend system
- Team events

#### Level 11-15: Advanced
- Class specialization
- Skill trees
- Strategic planning

#### Level 16+: Mastery
- Leadership roles
- Community events
- Competitive leagues

### 14.3 Help & Support

#### In-Game Resources
- Interactive tutorials
- Hint system
- FAQ section
- Video guides

#### Community Support
- Mentor program
- Discord/Telegram
- Forums
- Local meetups

---

## 15. APPENDICES

### A. Glossary of Terms
- **Hex:** Basic territory unit
- **Decay:** Territory degradation over time  
- **RES:** Relative Effort Score
- **TCP:** Territory Control Points
- **Stronghold:** Fortified hex base
- **Ghost:** AI opponent to chase
- **Boss Raid:** Cooperative PvE event
- **Battle Pass:** Season subscription

### B. Complete Formula Reference
[All mathematical formulas consolidated]

### C. Asset Requirements List
- 3D Models needed
- Animation requirements
- Sound effects list
- Music track needs

### D. Localization Notes
- Text string database
- Cultural adaptations needed
- Regional event calendar

### E. Platform-Specific Considerations
- iOS specific features
- Android specific features
- Wearable integrations

---

## DOCUMENT CONTROL

**Version:** 1.0  
**Last Updated:** November 2025  
**Next Review:** Post-Beta Feedback  
**Approval Status:** Ready for Development  

**Change Log:**
- v1.0: Complete GDD initial version
- v1.1: [Pending after prototype testing]

---

*End of Game Design Document - TerraRun/Urban Legends*