import { pgTable, text, integer, numeric, boolean, timestamp, uuid, bigint, pgEnum } from "drizzle-orm/pg-core";

export const activityTypeEnum = pgEnum("activity_type", ["Outdoor", "Virtual", "EBike"]);
export const challengeScopeEnum = pgEnum("challenge_scope", ["individual", "collective"]);
export const challengeDifficultyEnum = pgEnum("challenge_difficulty", ["easy", "medium", "hard"]);
export const challengeMetricEnum = pgEnum("challenge_metric", ["distance", "elevation", "days_active", "single_ride_distance"]);
export const weeklyEditionStatusEnum = pgEnum("weekly_edition_status", ["draft", "published"]);

export const athletes = pgTable("athletes", {
  id: uuid("id").defaultRandom().primaryKey(),
  stravaId: bigint("strava_id", { mode: "number" }).notNull().unique(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  profilePictureUrl: text("profile_picture_url"),
  isClubMember: boolean("is_club_member").default(false).notNull(),
  stravaAccessToken: text("strava_access_token"),
  stravaRefreshToken: text("strava_refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  totalXp: integer("total_xp").default(0).notNull(),
  currentLevel: integer("current_level").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  athleteId: uuid("athlete_id").references(() => athletes.id, { onDelete: "cascade" }).notNull(),
  stravaActivityId: bigint("strava_activity_id", { mode: "number" }).notNull().unique(),
  name: text("name").notNull(),
  type: activityTypeEnum("type").notNull(),
  startDateLocal: timestamp("start_date_local").notNull(),
  distanceMeters: numeric("distance_meters").notNull(),
  movingTimeSeconds: integer("moving_time_seconds").notNull(),
  elevationGainMeters: numeric("elevation_gain_meters").notNull(),
  averageSpeedKph: numeric("average_speed_kph").notNull(),
  maxSpeedKph: numeric("max_speed_kph").notNull(),
  summaryPolyline: text("summary_polyline"),
  isEligibleForRanking: boolean("is_eligible_for_ranking").default(true).notNull(),
  xpAwarded: integer("xp_awarded").default(0).notNull(),
  processedAt: timestamp("processed_at").defaultNow().notNull(),
});

export const weeklyEditions = pgTable("weekly_editions", {
  id: uuid("id").defaultRandom().primaryKey(),
  weekNumber: integer("week_number").notNull(),
  year: integer("year").notNull(),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),
  status: weeklyEditionStatusEnum("status").default("draft").notNull(),
  summaryHeadline: text("summary_headline"),
  editorialNotes: text("editorial_notes"),
  publishedAt: timestamp("published_at"),
});

export const challenges = pgTable("challenges", {
  id: uuid("id").defaultRandom().primaryKey(),
  weeklyEditionId: uuid("weekly_edition_id").references(() => weeklyEditions.id, { onDelete: "cascade" }),
  scope: challengeScopeEnum("scope").notNull(),
  difficulty: challengeDifficultyEnum("difficulty").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  metric: challengeMetricEnum("metric").notNull(),
  targetValue: numeric("target_value").notNull(),
  xpReward: integer("xp_reward").notNull(),
});

export const athleteChallenges = pgTable("athlete_challenges", {
  id: uuid("id").defaultRandom().primaryKey(),
  athleteId: uuid("athlete_id").references(() => athletes.id, { onDelete: "cascade" }).notNull(),
  challengeId: uuid("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
  currentValue: numeric("current_value").default("0").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
});

export const badges = pgTable("badges", {
  code: text("code").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  isSecret: boolean("is_secret").default(false).notNull(),
  xpBonus: integer("xp_bonus").default(0).notNull(),
});

export const athleteBadges = pgTable("athlete_badges", {
  id: uuid("id").defaultRandom().primaryKey(),
  athleteId: uuid("athlete_id").references(() => athletes.id, { onDelete: "cascade" }).notNull(),
  badgeCode: text("badge_code").references(() => badges.code, { onDelete: "cascade" }).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
  triggerActivityId: uuid("trigger_activity_id").references(() => activities.id, { onDelete: "set null" }),
});
