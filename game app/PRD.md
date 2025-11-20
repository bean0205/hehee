# Product Requirement Document (PRD)
## TERRARUN / URBAN LEGENDS
**Version:** 1.0  
**Date:** November 2025  
**Status:** Draft  
**Product Type:** Real-world Strategy MMO & Health Gamification Platform

---

## 1. EXECUTIVE SUMMARY

### 1.1 Product Vision
TerraRun transforms urban environments into massive multiplayer strategic battlegrounds where physical exercise becomes the primary game mechanic. By merging real-world movement with MMO strategy elements, we create a sustainable ecosystem that addresses both corporate wellness (B2B) and individual health gamification (B2C).

### 1.2 Business Objectives
- **Primary:** Capture 15% of the corporate wellness market in Southeast Asia within 24 months
- **Secondary:** Build a 500,000+ MAU consumer community within 18 months
- **Long-term:** Become the leading O2O (Online-to-Offline) health platform connecting physical activity with real economic value

### 1.3 Success Metrics
- 100,000 DAU by Month 12
- 40% Month-2 Retention Rate
- 3.5 average runs per user per week
- $2M ARR from B2B contracts by Month 18

---

## 2. USER PERSONAS

### 2.1 Primary Personas

#### Persona A: "Corporate Warrior" (B2B)
**Demographics:**
- Age: 25-40
- Location: Urban centers (Hanoi, HCMC, Bangkok, Singapore)
- Income: $800-3000/month
- Tech Savvy: High
- Activity Level: Sedentary to Moderate

**Pain Points:**
- Long working hours (9-12h/day)
- Health declining due to sedentary lifestyle
- Lack of motivation for solo exercise
- Team bonding limited to drinking/eating events

**Goals:**
- Improve health without disrupting work schedule
- Connect with colleagues beyond work topics
- Achieve visible fitness progress
- Balance work-life integration

**App Usage Context:**
- Morning runs (5:30-7:00 AM)
- Lunch break walks
- Weekend long runs with team
- Post-work stress relief sessions

#### Persona B: "Casual Gamer Runner" (B2C)
**Demographics:**
- Age: 20-35
- Location: Urban/Suburban
- Income: Variable
- Gaming Experience: Mobile/Casual games
- Running Experience: Beginner to Intermediate

**Pain Points:**
- Running is boring/monotonous
- Lack of social connection in fitness
- No tangible rewards for exercise
- Difficulty maintaining consistency

**Goals:**
- Make exercise entertaining
- Connect with local community
- Earn rewards/recognition
- Build sustainable habits

**App Usage Context:**
- Evening runs in neighborhood
- Weekend exploration runs
- Social group runs
- Event participation

#### Persona C: "Health-Conscious Professional" (B2C Premium)
**Demographics:**
- Age: 30-45
- Location: Urban centers
- Income: $2000-5000/month
- Activity Level: Moderate to High
- Device Ownership: Premium wearables (Garmin, Apple Watch)

**Pain Points:**
- Existing fitness apps lack depth
- Want data-driven insights
- Seeking competitive challenges
- Need flexible training integration

**Goals:**
- Optimize performance
- Lead community initiatives
- Track comprehensive health metrics
- Achieve elite status/recognition

### 2.2 Secondary Personas

#### Persona D: "HR Manager" (B2B Decision Maker)
**Demographics:**
- Age: 35-50
- Department: Human Resources/Operations
- Company Size: 50-5000 employees
- Budget Authority: Yes

**Pain Points:**
- Low employee engagement scores
- Rising health insurance costs
- Difficulty measuring wellness ROI
- Generic wellness programs fail

**Goals:**
- Improve employee retention
- Reduce sick days
- Build company culture
- Demonstrate measurable impact

---

## 3. USER JOURNEY MAPS

### 3.1 First-Time User Journey (B2C)

#### Discovery Phase
1. **Trigger:** Friend shares achievement/Social media ad/App store feature
2. **Research:** Read reviews, check social proof
3. **Decision:** Download app (Free)

#### Onboarding Phase (Day 1)
1. **Account Creation:** Social login (Google/Facebook) - 30 seconds
2. **Permission Grants:** Location, Motion & Fitness, Notifications
3. **Profile Setup:** 
   - Select home district (auto-detected)
   - Choose avatar
   - Set fitness level (Beginner/Intermediate/Advanced)
4. **Tutorial Run:** 
   - 500m guided first run
   - Learn basic mechanics (claiming hexagons)
   - Receive first reward
5. **Team Assignment:** Auto-join district team or create/join clan

#### Activation Phase (Day 1-7)
1. **Daily Login:** Check district leaderboard
2. **First Real Run:** 
   - Plan route on hex map
   - Start tracking
   - Claim 5-10 hexagons
   - Sync with wearable (optional)
3. **Social Discovery:**
   - See nearby runners
   - Join first group run event
   - Send/receive kudos
4. **First Purchase Decision:** 
   - Unlock premium skin
   - Buy Battle Pass
   - Join premium clan

#### Retention Phase (Day 8-30)
1. **Habit Formation:**
   - Morning notification: "Your territory needs defending!"
   - Streak tracking (consecutive days)
   - Weekly challenges unlocked
2. **Social Bonds:**
   - Regular squad runs established
   - Clan chat active participation
   - Local event attendance
3. **Progression Milestones:**
   - Level 10 reached
   - First skill tree unlock
   - Territory expansion achieved

### 3.2 B2B Corporate User Journey

#### Implementation Phase (Month 1)
1. **Week 1: Kickoff**
   - Company-wide announcement
   - Department team formation
   - Leadership endorsement
2. **Week 2-3: Onboarding**
   - Lunch & learn sessions
   - IT integration (SSO setup)
   - Initial challenges launched
3. **Week 4: First Competition**
   - Inter-department battle
   - Boss raid event
   - Winners recognition

#### Engagement Phase (Month 2-6)
1. **Regular Cadence:**
   - Weekly team challenges
   - Monthly boss raids
   - Quarterly championships
2. **Reward Integration:**
   - Points to perks redemption
   - Performance reviews inclusion
   - Health insurance discounts activated

#### Sustainability Phase (Month 7+)
1. **Culture Integration:**
   - Part of onboarding process
   - Annual fitness goals
   - Company traditions established

---

## 4. USE CASES

### 4.1 Core Use Cases

#### UC001: Solo Territory Conquest
**Actor:** Individual Runner  
**Precondition:** User logged in, GPS enabled  
**Flow:**
1. User opens map view
2. Identifies unclaimed/enemy hexagons
3. Plans route through target hexagons
4. Starts run tracking
5. Physical movement captures hexagons
6. Run ends, points calculated
7. Territory updated on global map
**Postcondition:** Hexagons change ownership, user gains XP/points

#### UC002: Corporate Boss Raid
**Actor:** Corporate Team Members  
**Precondition:** Company campaign active  
**Flow:**
1. HR announces boss raid via dashboard
2. Employees receive push notification
3. Team members coordinate attack windows
4. Runners deal damage based on distance
5. Cyclists scout and break armor
6. Walkers provide support buffs
7. Boss health depletes over time period
8. Victory rewards distributed to participants
**Postcondition:** Team cohesion increased, rewards unlocked

#### UC003: O2O Merchant Checkpoint
**Actor:** Consumer User  
**Precondition:** Partner merchant configured  
**Flow:**
1. User receives notification of nearby reward
2. Routes run to include merchant location
3. Arrives at physical store location
4. AR camera activated for check-in
5. Virtual reward claimed
6. Real voucher/discount received
7. Optional: Purchase with discount
**Postcondition:** Merchant traffic increased, user rewarded

#### UC004: District War Participation
**Actor:** District Residents  
**Precondition:** Monthly season active  
**Flow:**
1. User auto-assigned to home district
2. Daily runs contribute to district score
3. Strategic coordination via district chat
4. Special events boost multipliers
5. Real-time leaderboard updates
6. End-of-season winners announced
7. District color changes on city map
**Postcondition:** Local pride enhanced, community bonds formed

### 4.2 Edge Cases

#### EC001: GPS Signal Loss
- Cache movement data locally
- Estimate distance via accelerometer
- Sync when connection restored
- Flag for anti-cheat review if anomalies detected

#### EC002: Multiple Devices/Accounts
- One active session per account
- Device switching allowed with 2FA
- Historical data merged
- Prevent double-counting same activity

#### EC003: Privacy Zone Breach
- Auto-blur home/work locations
- Ghost mode activation
- Selective sharing controls
- GDPR/Privacy compliance

---

## 5. FEATURE SCOPE & ROADMAP

### 5.1 Version 0.1 - Prototype (Month 1-2)
**Target:** 100 Beta Users (Internal + Friends & Family)

#### Core Features
- [ ] Basic hex grid overlay on real map
- [ ] GPS tracking with simple distance/pace
- [ ] Manual activity logging
- [ ] Basic user profiles
- [ ] Simple point system
- [ ] Local leaderboard (no teams yet)

#### Technical Foundation
- [ ] Backend API structure
- [ ] Database schema v1
- [ ] Basic anti-cheat detection
- [ ] Manual QA testing framework

#### Success Criteria
- 50% of users complete 3+ runs
- Average session length > 20 minutes
- Core loop validated
- No critical bugs

### 5.2 Version 1.0 - Market Launch (Month 3-6)
**Target:** 10,000 Users (Soft launch in 1 city)

#### Gameplay Features
- [ ] **Territory System:**
  - Hexagon claiming mechanics
  - Decay system (7-day timer)
  - Visual territory representation
- [ ] **Team/Clan System:**
  - District auto-assignment
  - Clan creation/joining
  - Basic clan chat
- [ ] **Progression System:**
  - XP and Levels (1-50)
  - Basic achievements (25 types)
  - Weekly challenges
- [ ] **Social Features:**
  - Friend system
  - Activity feed
  - Kudos/Reactions
  - Basic notifications

#### B2B Features
- [ ] Company onboarding flow
- [ ] HR Dashboard v1 (Web)
- [ ] Employee leaderboards
- [ ] Basic reporting (CSV export)

#### Integrations
- [ ] Strava sync
- [ ] Google Fit sync
- [ ] Apple Health sync

#### Monetization
- [ ] Premium skins store
- [ ] Basic Battle Pass ($4.99/month)
- [ ] B2B pricing tiers

#### Success Criteria
- 2,000 MAU
- 30% Day-7 retention
- $10,000 MRR
- 4.0+ App Store rating

### 5.3 Version 2.0 - Growth Phase (Month 7-12)
**Target:** 100,000 Users (Regional expansion)

#### Advanced Gameplay
- [ ] **Class System:**
  - Runner/Cyclist/Walker specializations
  - Unique abilities per class
  - Class-specific challenges
- [ ] **RPG Elements:**
  - Skill trees (3 branches, 30 skills)
  - Avatar evolution system
  - Equipment/Gear system
- [ ] **AR Features:**
  - Treasure hunting
  - Monster battles
  - Photo mode
- [ ] **Dynamic Events:**
  - Weather-based bonuses
  - Flash mob runs
  - Seasonal campaigns
- [ ] **Advanced Territory:**
  - Stronghold building
  - Resource management
  - Alliance warfare

#### B2B Expansion
- [ ] **Boss Raid System:**
  - Custom boss creation
  - Company-wide campaigns
  - Department competitions
- [ ] **Advanced Analytics:**
  - Burnout prevention alerts
  - Predictive health insights
  - ROI calculator
- [ ] **Reward Marketplace:**
  - Points to perks conversion
  - Integrated benefit platform
  - Charity donation options

#### Platform Features
- [ ] **Live Operations:**
  - Real-time event management
  - A/B testing framework
  - Dynamic difficulty adjustment
- [ ] **Advanced Anti-Cheat:**
  - ML-based detection
  - Community reporting
  - Automated sanctions
- [ ] **API Ecosystem:**
  - Third-party integrations
  - Wearable partnerships
  - Insurance company APIs

#### Monetization Evolution
- [ ] Dynamic pricing for Battle Pass
- [ ] Corporate enterprise tiers
- [ ] O2O merchant platform (Self-serve)
- [ ] NFT/Blockchain experiments (Digital land ownership)

#### Success Criteria
- 50,000 MAU
- 35% Day-30 retention  
- $100,000 MRR
- 2 major corporate contracts
- 50+ O2O merchant partners

### 5.4 Version 3.0 - Ecosystem (Month 13-18)
**Vision:** Platform transformation

#### Features Pipeline
- [ ] Coach marketplace
- [ ] Virtual races/Marathons
- [ ] Health insurance integration
- [ ] Fitness equipment store
- [ ] User-generated challenges
- [ ] City government partnerships
- [ ] E-sports tournaments
- [ ] Health data marketplace (Anonymous)

---

## 6. KEY PERFORMANCE INDICATORS (KPIs)

### 6.1 User Acquisition & Activation

| Metric | Definition | Target (Month 6) | Target (Month 12) |
|--------|-----------|------------------|-------------------|
| Downloads | Total app installs | 50,000 | 200,000 |
| Registration Rate | Downloads → Account created | 70% | 75% |
| First Run Rate | Registered → Completed first run | 60% | 65% |
| Tutorial Completion | Finished onboarding flow | 80% | 85% |
| D1 Retention | Return Day 1 | 50% | 55% |
| D7 Retention | Return Day 7 | 30% | 35% |
| D30 Retention | Return Day 30 | 20% | 25% |

### 6.2 Engagement Metrics

| Metric | Definition | Target (Month 6) | Target (Month 12) |
|--------|-----------|------------------|-------------------|
| DAU | Daily Active Users | 5,000 | 30,000 |
| MAU | Monthly Active Users | 15,000 | 100,000 |
| DAU/MAU Ratio | Stickiness indicator | 33% | 30% |
| Avg Session Length | Time per run | 25 min | 30 min |
| Weekly Frequency | Runs per user per week | 2.5 | 3.5 |
| Hexagons per User | Monthly territory claimed | 50 | 100 |
| Social Actions | Kudos/Comments per MAU | 5 | 10 |

### 6.3 B2B Metrics

| Metric | Definition | Target (Month 6) | Target (Month 12) |
|--------|-----------|------------------|-------------------|
| Companies Onboarded | Active B2B accounts | 10 | 50 |
| Corporate Users | Employees using platform | 2,000 | 15,000 |
| Employee Participation Rate | Active/Total employees | 40% | 50% |
| Corporate NPS | Promoter score | 30 | 50 |
| Contract Renewal Rate | Annual renewal % | N/A | 80% |
| Avg Contract Value | Revenue per company/year | $5,000 | $8,000 |

### 6.4 Monetization Metrics

| Metric | Definition | Target (Month 6) | Target (Month 12) |
|--------|-----------|------------------|-------------------|
| MRR | Monthly Recurring Revenue | $20,000 | $100,000 |
| ARPU | Avg Revenue per User | $1.33 | $1.00 |
| Conversion Rate | Free → Paid | 5% | 8% |
| Battle Pass Adoption | % of MAU subscribed | 8% | 12% |
| LTV | Lifetime Value | $10 | $20 |
| CAC | Customer Acquisition Cost | $3 | $2 |
| LTV/CAC Ratio | Unit economics health | 3.3x | 10x |

### 6.5 Health Impact Metrics

| Metric | Definition | Target (Month 6) | Target (Month 12) |
|--------|-----------|------------------|-------------------|
| Total KM Run | Platform-wide distance | 500,000 km | 3,000,000 km |
| Avg User Improvement | Pace improvement % | 10% | 15% |
| Consistency Score | % users running 3+x/week | 30% | 40% |
| Health Incidents Prevented | Estimated via algorithm | 50 | 500 |
| CO2 Saved | Via walking vs driving | 10 tons | 100 tons |

---

## 7. TECHNICAL REQUIREMENTS

### 7.1 Platform Architecture

#### Mobile Apps
- **iOS:** Swift, iOS 14+, ARKit integration
- **Android:** Kotlin, Android 8+, ARCore support
- **Framework:** React Native for shared components
- **Offline Mode:** SQLite for local caching

#### Backend Infrastructure
- **API:** Node.js/Express or Python/FastAPI
- **Database:** PostgreSQL (Primary) + Redis (Cache)
- **Real-time:** WebSocket for live events
- **Queue:** RabbitMQ for async processing
- **Storage:** AWS S3 for media assets

#### Web Platforms
- **HR Dashboard:** React.js SPA
- **Landing Page:** Next.js for SEO
- **Admin Panel:** Django Admin or Custom React

### 7.2 Third-Party Integrations

#### Fitness Platforms
- Strava API (OAuth 2.0)
- Garmin Connect IQ
- Apple HealthKit
- Google Fit API
- Fitbit Web API

#### Maps & Location
- Mapbox/Google Maps for visualization
- Uber H3 for hexagon grid system
- GPS/GLONASS for tracking

#### Analytics & Monitoring
- Mixpanel/Amplitude for product analytics
- Sentry for error tracking
- DataDog for infrastructure monitoring
- Firebase for crash reporting

#### Payment & Commerce
- Stripe/PayPal for global payments
- Local payment gateways (Momo, GrabPay, etc.)
- RevenueCat for subscription management

### 7.3 Performance Requirements

- **Response Time:** API < 200ms (p95)
- **Uptime:** 99.9% availability SLA
- **Concurrent Users:** Support 10,000 simultaneous
- **Data Accuracy:** GPS precision ± 5 meters
- **Battery Usage:** < 5% per 30-minute session
- **Offline Capability:** 48-hour local storage

---

## 8. RISK ANALYSIS & MITIGATION

### 8.1 Product Risks

#### Risk: Low User Retention
**Probability:** High  
**Impact:** Critical  
**Mitigation:**
- Implement progressive onboarding
- Daily login rewards
- Social pressure via team mechanics
- Personalized challenge difficulty
- Regular content updates

#### Risk: GPS Spoofing/Cheating
**Probability:** High  
**Impact:** High  
**Mitigation:**
- Multi-factor validation (GPS + Accelerometer + Heart Rate)
- ML anomaly detection
- Community reporting system
- Shadow banning for suspects
- Separate leagues for verified devices

#### Risk: Weather Dependency
**Probability:** Medium  
**Impact:** Medium  
**Mitigation:**
- Indoor activity options (Treadmill mode)
- Weather-bonus events (Rain = 2x points)
- Seasonal adjustments to goals
- Alternative activities (Walking, Stairs)

### 8.2 Business Risks

#### Risk: B2B Sales Cycle Too Long
**Probability:** High  
**Impact:** High  
**Mitigation:**
- Freemium pilot programs
- Bottom-up adoption (Employee-led)
- Quick ROI demonstrations
- Modular pricing options
- Partner with insurance companies

#### Risk: Competitor with Bigger Budget
**Probability:** Medium  
**Impact:** High  
**Mitigation:**
- Focus on local market first
- Build strong community moat
- Unique features (Hexagon territory)
- Fast iteration cycle
- Strategic partnerships

### 8.3 Technical Risks

#### Risk: Server Overload During Events
**Probability:** Medium  
**Impact:** High  
**Mitigation:**
- Auto-scaling infrastructure
- Event queuing system
- Gradual rollout for big features
- Load testing before events
- CDN for static assets

#### Risk: Privacy/Data Breach
**Probability:** Low  
**Impact:** Critical  
**Mitigation:**
- Privacy-by-design architecture
- Regular security audits
- GDPR/CCPA compliance
- Encrypted data transmission
- Privacy zones feature
- Clear data retention policies

### 8.4 Market Risks

#### Risk: Fitness Trend Decline
**Probability:** Low  
**Impact:** Medium  
**Mitigation:**
- Pivot to general wellness
- Add mental health features
- Integrate with healthcare
- Corporate wellness focus
- Gamification of other activities

#### Risk: Platform Dependencies (Apple/Google)
**Probability:** Medium  
**Impact:** High  
**Mitigation:**
- Progressive Web App backup
- Multiple app stores presence
- Direct B2B distribution
- Web-based dashboard options
- API-first architecture

---

## 9. SUCCESS CRITERIA & EXIT SCENARIOS

### 9.1 Success Indicators (12-Month Horizon)

#### Quantitative
- ✅ 100,000 registered users
- ✅ 30,000 MAU
- ✅ $1M ARR run rate
- ✅ 50+ corporate clients
- ✅ 35% Month-2 retention
- ✅ Break-even unit economics

#### Qualitative
- ✅ Featured in App Store/Play Store
- ✅ Media coverage in 3+ major outlets
- ✅ User testimonials of health improvement
- ✅ Corporate case studies published
- ✅ Community events self-organizing

### 9.2 Pivot Scenarios

#### Scenario A: B2B Dominance
If B2B grows 3x faster than B2C:
- Double down on enterprise features
- Sunset consumer freemium
- White-label options
- Healthcare integrations

#### Scenario B: Consumer Viral Growth
If B2C explodes beyond projections:
- Focus on community features
- E-sports/Competitive leagues
- Influencer partnerships
- Global expansion

#### Scenario C: O2O Platform Success
If merchant network becomes primary value:
- Pivot to location-based marketing platform
- Merchant dashboard prioritization
- Transaction fee model
- Delivery/Service integration

### 9.3 Exit Opportunities

#### Strategic Acquisition Targets
- **Fitness Platforms:** Strava, Nike, Adidas
- **Health Tech:** Fitbit (Google), Apple Health
- **Gaming Companies:** Niantic, Supercell
- **Insurance/Healthcare:** Prudential, AIA
- **Super Apps:** Grab, Gojek, Sea Group

#### IPO Readiness Markers
- $50M+ ARR
- 1M+ MAU
- 3+ market presence
- Positive EBITDA
- Strong brand recognition

---

## 10. APPENDICES

### A. Competitive Analysis Matrix
[Detailed comparison with Strava, Zombies Run, Pokemon Go, Nike Run Club]

### B. Technical Architecture Diagram
[System design flowchart]

### C. Wireframe Mockups
[UI/UX preliminary designs]

### D. Financial Model
[5-year projection spreadsheet]

### E. Legal Considerations
[Terms of Service, Privacy Policy, Data Protection]

### F. Go-to-Market Strategy
[Detailed marketing and launch plan]

---

## DOCUMENT CONTROL

**Author:** Product Team  
**Reviewers:** CEO, CTO, Head of Product  
**Approval:** Pending  
**Next Review:** Month 3 Post-Launch  

**Change Log:**
- v1.0 - Initial draft (Nov 2025)
- v1.1 - [Pending stakeholder feedback]

---

*End of PRD - TerraRun/Urban Legends v1.0*