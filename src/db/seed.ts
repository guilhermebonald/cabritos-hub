import { SYSTEM_BADGES } from "../lib/badges";
import { badges } from "./schema";
import { db } from "./index";

/**
 * Seed inicial das conquistas do sistema Cabritos Hub no banco relacional.
 */
export async function seedBadges() {
  console.log("Seeding badges...");
  for (const badge of SYSTEM_BADGES) {
    await db
      .insert(badges)
      .values({
        code: badge.code,
        title: badge.title,
        description: badge.description,
        icon: badge.icon,
        isSecret: badge.isSecret,
        xpBonus: badge.xpBonus,
      })
      .onConflictDoUpdate({
        target: badges.code,
        set: {
          title: badge.code,
          description: badge.description,
          icon: badge.icon,
          isSecret: badge.isSecret,
          xpBonus: badge.xpBonus,
        },
      });
  }
  console.log(`Seeded ${SYSTEM_BADGES.length} badges.`);
}

if (require.main === module) {
  seedBadges()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seed error:", err);
      process.exit(1);
    });
}
