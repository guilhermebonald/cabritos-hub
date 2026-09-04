# Modelo de Dados: Cabritos Hub

Base de dados relacional PostgreSQL (Drizzle ORM).

## Diagrama de Entidades

```
+------------------+       +-------------------+       +--------------------+
|     Athletes     | 1   n |    Activities     | n   1 |     Challenges     |
| (Ciclistas)      |-------| (Pedais Strava)   |       | (Desafios Semana)  |
+------------------+       +-------------------+       +--------------------+
        | 1                         | 1
        | n                         | n
+------------------+       +-------------------+       +--------------------+
|  AthleteBadges   |       |   ActivityStats   |       |    WeeklyEditions  |
| (Conquistas)     |       |   (Cálculo XP)    |       |  (Giro da Semana)  |
+------------------+       +-------------------+       +--------------------+
```

## Tabelas Principais

### 1. `athletes` (Ciclistas)
- `id` (UUID, PK)
- `strava_id` (BigInt, Unique)
- `firstname`, `lastname`, `profile_picture_url`
- `is_club_member` (Boolean) - Validação no clube oficial Cabritos
- `strava_access_token`, `strava_refresh_token`, `token_expires_at`
- `total_xp` (Integer, default 0) - Vitalício
- `current_level` (Integer, default 1)
- `created_at`, `updated_at`

### 2. `activities` (Pedais importados)
- `id` (UUID, PK)
- `athlete_id` (UUID, FK -> athletes.id)
- `strava_activity_id` (BigInt, Unique)
- `name` (Text)
- `type` (Enum: `Outdoor`, `Virtual`, `EBike`)
- `start_date_local` (Timestamp)
- `distance_meters` (Numeric)
- `moving_time_seconds` (Integer)
- `elevation_gain_meters` (Numeric)
- `average_speed_kph` (Numeric)
- `max_speed_kph` (Numeric)
- `summary_polyline` (Text, nullable) - Mapa comprimido
- `is_eligible_for_ranking` (Boolean) - False para e-bike em rankings competitivos
- `xp_awarded` (Integer) - XP calculado desta atividade
- `processed_at` (Timestamp)

### 3. `weekly_editions` (Giro da Semana)
- `id` (UUID, PK)
- `week_number` (Integer), `year` (Integer) - Ex: 36, 2026
- `starts_at` (Timestamp, Segunda 00:00)
- `ends_at` (Timestamp, Domingo 23:59)
- `status` (Enum: `draft`, `published`)
- `summary_headline` (Text)
- `editorial_notes` (Text, nullable) - Piadas/comentários do admin
- `highlights` (JSONB) - Pódios calculados (Rei Distância, Montanha, Consistência, etc.)
- `awards` (JSONB) - Vampiro, Trator, Café, Lesma, Foguete
- `published_at` (Timestamp, nullable)

### 4. `challenges` (Desafios)
- `id` (UUID, PK)
- `weekly_edition_id` (UUID, FK -> weekly_editions.id)
- `scope` (Enum: `individual`, `collective`)
- `difficulty` (Enum: `easy`, `medium`, `hard`)
- `title`, `description`
- `metric` (Enum: `distance`, `elevation`, `days_active`, `single_ride_distance`)
- `target_value` (Numeric)
- `xp_reward` (Integer)

### 5. `athlete_challenges` (Progresso nos Desafios)
- `athlete_id` (UUID, FK)
- `challenge_id` (UUID, FK)
- `current_value` (Numeric)
- `is_completed` (Boolean)
- `completed_at` (Timestamp, nullable)

### 6. `badges` (Conquistas do Sistema)
- `code` (Text, PK) - Ex: `century_100k`, `everesting_half`, `night_rider`
- `title`, `description`, `icon_slug`
- `is_secret` (Boolean)
- `xp_bonus` (Integer)

### 7. `athlete_badges` (Conquistas desbloqueadas)
- `athlete_id` (UUID, FK)
- `badge_code` (Text, FK -> badges.code)
- `unlocked_at` (Timestamp)
- `trigger_activity_id` (UUID, FK, nullable)
