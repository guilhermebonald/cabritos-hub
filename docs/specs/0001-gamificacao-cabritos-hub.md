# Especificação Funcional: Cabritos Hub — Gamificação para Clube de Ciclismo

## Problem Statement

Membros de clubes de ciclismo registram diariamente seus treinos no Strava, mas a experiência pós-pedal é estática e focada exclusivamente em rankings brutos de volume (quem tem mais tempo para rodar centenas de quilômetros lidera eternamente). Ciclistas com perfis variados — como escaladores, praticantes consistentes de tiros curtos, ciclistas que pedalam no rolo virtual ou quem simplesmente busca evolução pessoal semanal — ficam sem reconhecimento. Falta uma dinâmica social e lúdica que una o grupo, transforme cada pedal individual em avanço coletivo e gere engajamento, competição saudável e brincadeiras no dia a dia do clube.

## Solution

O **Cabritos Hub** é uma plataforma web exclusiva para o clube de ciclismo Cabritos que se integra via OAuth e Webhooks ao Strava, convertendo dados brutos de atividades em uma experiência completa de jogo. Cada pedal registrado concede pontos de experiência (XP) balanceados com retornos decrescentes e bônus de consistência, permitindo progressão vitalícia de níveis (Novato a Lenda). 

A plataforma oferece múltiplos rankings semanais para valorizar diversos perfis de ciclistas, uma Corrida Virtual em estrada contínua com avatares em tempo real, desafios semanais rotativos, conquistas públicas e secretas, vitrine de membros pendentes para incentivo e o "Giro da Semana" — um jornal semi-automático com destaques estatísticos, pódios e prêmios descontraídos (Vampiro, Trator, Café, Foguete), acompanhado de gerador de cards visuais otimizados para compartilhamento no WhatsApp e Stories.

## User Stories

1. As a **ciclista do clube**, I want to connect my Strava account via OAuth, so that my cycling activities are automatically imported and gamified without manual data entry.
2. As a **ciclista do clube**, I want the system to automatically verify if I am an official member of the Cabritos Strava Club, so that access remains exclusive to our community.
3. As a **novo ciclista**, I want my cycling activities from the current season (since January 1st) to be imported on my first login, so that I enter the platform with fair progression and historical achievements immediately recognized.
4. As a **ciclista**, I want to earn XP for each recorded ride based on distance, elevation gain, and frequency, so that my effort translates into tangible progression.
5. As a **ciclista casual**, I want XP to feature diminishing daily returns on extreme mileage alongside consistency bonuses for riding on multiple days, so that my regular dedication is not overshadowed by a single ultra-endurance ride.
6. As a **ciclista**, I want to advance through lifetime Levels (Novato, Pedaleiro, Explorador, Escalador, Monstro, Lenda), so that my long-term commitment to the sport is permanently visible.
7. As a **ciclista**, I want to see my current level and a progress bar indicating how much XP is needed for the next level, so that I know how close I am to leveling up.
8. As a **ciclista**, I want to view my position on a weekly continuous Virtual Race track alongside my peers' avatars, so that accumulated mileage becomes an engaging visual contest.
9. As a **ciclista**, I want the Virtual Race to remain open until Sunday 23:59 without a static finish line, so that the visual contest stays active and exciting throughout the entire weekend.
10. As a **ciclista escalador**, I want a dedicated "Rei da Montanha" weekly ranking, so that my elevation gain is recognized independently of pure flat distance.
11. As a **ciclista de longa distância**, I want a dedicated "Rei da Distância" weekly ranking, so that high-volume efforts are celebrated.
12. As a **ciclista consistente**, I want a "Mais Consistente" ranking that tracks distinct days ridden in the cycle, so that daily discipline is rewarded over sporadic spikes.
13. As a **ciclista em evolução**, I want an "Evolução da Semana" ranking comparing my performance against my previous week, so that I can compete against my own personal baseline.
14. As a **ciclista veloz**, I want a "Foguete" ranking highlighting the best average speed in rides above a minimum qualifying distance, so that intensity and speed are acknowledged.
15. As a **ciclista**, I want "Maior Pedal" and "Mais Ativo" weekly rankings, so that peak single rides and total activity counts receive spotlight.
16. As a **ciclista indoor**, I want my virtual trainer sessions (Zwift, Rouvy) to earn XP and count toward consistency and general distance, so that bad weather does not halt my game progression.
17. As a **ciclista de e-bike**, I want my assisted rides to contribute to my personal profile and XP progress, so that I remain part of the club community.
18. As a **ciclista tradicional**, I want e-bike activities to be automatically segregated from competitive mountain, speed, and distance rankings, so that leaderboards remain sports-fair.
19. As a **ciclista**, I want to tackle 3 weekly individual challenges (easy, medium, hard) and 1 cooperative club challenge, so that every week provides fresh and varied goals.
20. As a **membro do clube**, I want our collective mileage to advance the cooperative club challenge, so that we feel a shared sense of teamwork.
21. As a **ciclista**, I want to unlock permanent badges for milestones (e.g., first 100km, 10,000m elevation, 7 consecutive days), so that I can collect trophies for major feats.
22. As a **ciclista curioso**, I want some badges to be secret until unlocked, so that discovering unexpected achievements adds mystery and surprise.
23. As a **ciclista**, I want to receive humorous weekly badges when eligible (e.g., "Vampiro" for night rides, "Trator" for steep climbs, "Ciclista Café" for relaxed short spins), so that the group can share laughs and internal jokes.
24. As a **membro do clube**, I want to view an interactive collective route map displaying simplified aggregated polylines of our rides, so that we can visualize where our club has explored.
25. As a **ciclista preocupado com privacidade**, I want my residential privacy zones configured on Strava to be strictly preserved on the collective map, so that my home location is never exposed.
26. As a **membro do clube**, I want to read the weekly "Giro da Semana" bulletin summarizing winners, collective stats, and humorous awards, so that I stay informed about the club's life.
27. As an **administrador do clube**, I want the weekly "Giro da Semana" to be automatically pre-calculated on Sunday midnight with the ability to review, edit jokes, and approve before publication, so that editorial quality and club banter are maintained with minimal friction.
28. As an **administrador do clube**, I want to override or swap weekly challenges if desired, so that special club events or holidays can be reflected in the game.
29. As a **membro do clube**, I want to export downloadable, high-fidelity visual cards (Stories 9:16 and WhatsApp 1:1) from the Giro da Semana and unlocked badges, so that we can instantly share achievements in our WhatsApp group and on social media.
30. As a **membro do clube**, I want to see a list of Strava club members who have not yet joined Cabritos Hub with an invitation prompt, so that we can encourage all teammates to get on board.
31. As a **ciclista**, I want my stats and game status to update automatically within seconds of finishing a ride via Strava webhooks, so that I get immediate dopamine feedback.
32. As a **ciclista**, I want a manual "Sync Strava" button on my profile, so that I can refresh my activities immediately if a webhook delivery is ever delayed.
33. As a **ciclista**, I want to view detailed profiles of other club members, including their level, badges, and recent rides, so that I can follow my friends' progress.

## Implementation Decisions

### 1. Ingestion Pipeline & Webhook Handling
- **Strava OAuth 2.0 Provider**: Requests `read,activity:read` scopes. Tokens (access, refresh, expires_at) are stored encrypted or secured at rest. Refresh rotation occurs automatically upon expiry.
- **Club Membership Gate**: During authentication, the user's club list is queried against the Cabritos Strava Club ID. Non-members are rejected with an explicit onboarding message directing them to join the Strava club first.
- **Webhook Endpoint**: Subscribed to Strava push events. Receives `activity.create`, `activity.update`, and `activity.delete`. Dispatches asynchronous processing idempotently using `object_id` (Strava activity ID).
- **Backfill Worker**: Triggered once upon first login. Fetches all activities from `2026-01-01T00:00:00Z` to current date in batches of 200, strictly respecting Strava rate-limit headers (100 req/15min, 1000 req/day).

### 2. Gamification Engine & Math Formulation
- **XP Calculation Formulation**:
  $$\text{XP}_{\text{base}} = (\text{km} \times 10) + \left(\frac{\text{altimetria em metros}}{10}\right)$$
  - *Diminishing returns*: Mileage above 80 km on a single calendar day yields 50% base XP per additional km; mileage above 150 km yields 25%.
  - *Consistency multiplier*: Riding on $N$ distinct days within the weekly cycle applies a multiplier of $(1 + 0.05 \times (N - 1))$ to the week's total activity XP.
- **Level Tier Curve**:
  - Progressive threshold: $\text{XP}_{\text{req}}(L) = 1000 \times L^{1.5}$
  - Named tiers mapped to level brackets (Novato: 1-5, Pedaleiro: 6-15, Explorador: 16-30, Escalador: 31-50, Monstro: 51-75, Lenda: 76+).
- **Activity Categorization Rules**:
  - `Outdoor` (Ride, GravelRide, MountainBikeRide without trainer flag).
  - `Virtual` (VirtualRide or trainer = true). Counts 100% for XP and consistency.
  - `EBike` (EBikeRide). Generates XP; flag `is_eligible_for_ranking = false` excludes from speed, mountain, and competitive distance leaderboards.

### 3. Weekly Cycle & Giro da Semana Lifecycle
- **Cycle Boundaries**: Monday 00:00:00 local time to Sunday 23:59:59 local time.
- **State Machine**:
  - `Active`: Week in progress; rankings and virtual race update live on every ride.
  - `Drafting`: Triggered automatically on Monday 00:01:00. Compiles podiums, resolves challenges, drafts awards, generates headline.
  - `Published`: Admin approves editorial text; marks edition public; triggers generation of social card assets.
- **Humorous Award Heuristics**:
  - *Vampiro*: Highest mileage with start time between 21:00 and 05:00.
  - *Trator*: Highest ratio of elevation gain to distance ($\text{meters} / \text{km}$) with minimum 25 km distance.
  - *Ciclista Café*: Highest count of casual rides under 20 km with moving time under 1 hour.
  - *Foguete*: Highest average speed in an outdoor ride exceeding 30 km.

### 4. Visual Assets & Social Sharing Engine
- Uses `@vercel/og` (Satori) serverless edge routes to dynamically render HTML/CSS into SVG/PNG images.
- Preset aspect ratios:
  - `Story (9:16 - 1080x1920)`: Vertical podium with top 3 of King of Mountain, King of Distance, Consistency, and Giro highlights.
  - `Feed / WhatsApp (1:1 - 1080x1080)`: Focused badge achievement cards and weekly award winner showcases.

### 5. Collective Route Map Architecture
- Strava `summary_polyline` strings are decoded server-side or on-client into geographic coordinates.
- Segments intersecting with user-defined privacy zones (handled upstream by Strava) remain redacted.
- Polylines are aggregated and rendered as semi-transparent heat lines on an interactive vector map (MapLibre / Leaflet).

## Testing Decisions

### What Makes a Good Test
- Tests must assert observable external system behavior and business outcomes, never private internal implementation states or mock internal methods.
- Testing should prove that given an input activity or event, the user-facing rankings, XP, levels, and badges reflect the exact game rules.

### Seams to Test

#### 1. Ingestion & API Seam (End-to-End Functional Test)
- **Mechanism**: Send simulated Strava activity payloads to the ingestion pipeline.
- **Assertions**:
  - Verify athlete's lifetime XP increases by the exact calculated formula including diminishing returns.
  - Verify level-up events occur when thresholds are crossed.
  - Verify weekly leaderboards reflect updated distances and positions.
  - Verify Virtual Race track coordinates advance.
  - Verify badge unlocks occur when conditions are met (e.g., first 100km ride).
  - Verify e-bike activities update XP but do not affect competitive mountain/distance rankings.

#### 2. Gamification & Rules Seam (Pure Domain Unit Tests)
- **Modules Tested**:
  - XP formula with diminishing returns and consistency multipliers.
  - Level progression curve calculation.
  - Challenge completion logic across edge dates.
  - Humorous award detection algorithms (Vampiro night ride window, Trator ratio, Foguete threshold).
- **Edge cases covered**:
  - Rides crossing midnight between Sunday and Monday.
  - Exactly 0 elevation or negative sensor glitches.
  - Duplicate webhook delivery idempotency (same activity sent twice must not duplicate XP).

## Out of Scope

- Multi-tenant support or multi-club registration (strictly single-club Cabritos).
- Direct GPS device syncing (Garmin, Wahoo, Polar direct SDKs) — all syncing routes through Strava.
- Custom raster map tile generation infrastructure (summary polylines on third-party vector basemaps are used instead).
- Native iOS/Android mobile apps (platform is an optimized responsive Progressive Web App).
- Real-money entry fees, gambling, or physical store e-commerce.

## Further Notes

- The Strava API rate limit (100 requests per 15 minutes, 1000 per day) dictates asynchronous queueing for backfill operations.
- The project follows single-context domain documentation established in `CONTEXT.md` and ADRs 0001 through 0005.
