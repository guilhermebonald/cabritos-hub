import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  formatSocialCardProps,
  getCardDimensions,
  SocialCardParams,
} from "./social-cards";

describe("Social Cards Generator & Metadata Engine", () => {
  it("returns standard dimensions for Stories (1080x1920) and Feed/WhatsApp (1200x630)", () => {
    const storiesDim = getCardDimensions("stories");
    assert.equal(storiesDim.width, 1080);
    assert.equal(storiesDim.height, 1920);

    const feedDim = getCardDimensions("feed");
    assert.equal(feedDim.width, 1200);
    assert.equal(feedDim.height, 630);
  });

  it("formats podium card parameters with correct titles and highlights", () => {
    const params: SocialCardParams = {
      type: "podium",
      title: "Rei da Distância",
      athleteName: "João Silva",
      metricValue: "327 km",
      subtitle: "Giro da Semana #36",
      tier: "Lenda",
    };

    const formatted = formatSocialCardProps(params);

    assert.equal(formatted.headline, "Rei da Distância");
    assert.equal(formatted.athlete, "João Silva");
    assert.equal(formatted.metric, "327 km");
    assert.equal(formatted.tag, "Giro da Semana #36");
    assert.equal(formatted.accentColor, "#f59e0b"); // Amber
  });

  it("formats badge unlock card parameters correctly", () => {
    const params: SocialCardParams = {
      type: "badge",
      title: "Centurião dos Cabritos",
      athleteName: "Guilherme Bonald",
      metricValue: "105 km em uma única atividade",
      badgeIcon: "🏅",
    };

    const formatted = formatSocialCardProps(params);

    assert.equal(formatted.headline, "Nova Conquista Desbloqueada!");
    assert.equal(formatted.title, "Centurião dos Cabritos");
    assert.equal(formatted.icon, "🏅");
    assert.equal(formatted.accentColor, "#8b5cf6"); // Purple
  });

  it("formats level up card with tier badge and XP gained", () => {
    const params: SocialCardParams = {
      type: "level_up",
      title: "Novo Nível Alcançado!",
      athleteName: "Mariana Veloz",
      metricValue: "Nível 16 • Explorador",
      xpGained: 18450,
      tier: "Explorador",
    };

    const formatted = formatSocialCardProps(params);

    assert.equal(formatted.headline, "Subiu de Nível!");
    assert.equal(formatted.tier, "Explorador");
    assert.ok(formatted.formattedXp.includes("18.450 XP"));
    assert.equal(formatted.accentColor, "#10b981"); // Emerald
  });
});
