# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Ciclistas membros do clube **Cabritos Race Team**. Atletas amadores e entusiastas que pedalam regularmente em estrada, montanha e treinos virtuais, buscando motivação, acompanhamento de evolução individual e engajamento coletivo.

## Product Purpose

Transformar cada pedal registrado no Strava em uma experiência gamificada dentro do clube. O objetivo não é ser uma planilha de análise corporativa ou duplicar o Strava, mas transformar esforço em jogo: pedalou, acumulou XP, evoluiu de nível, desbloqueou badges, avançou na corrida virtual coletiva e concorreu a pódios e destaques no boletim Giro da Semana.

## Positioning

Uma plataforma própria de gamificação esportiva e social com identidade de clube de corrida de rua/estrada ("Cabritos"), combinando regras proprietárias de progressão (XP ponderado por distância e altimetria, badges contextuais com regras do pelotão, corrida virtual contínua na semana e publicação editorial semanal dos feitos do grupo) diretamente conectada à API do Strava.

## Operating Context

- Web responsiva (desktop para consulta detalhada e mobile para conferência rápida pós-treino).
- Sincronização via Strava OAuth (`read,activity:read`).
- Atualização semanal (ciclo de segunda-feira a domingo às 23:59).
- Visualização pública ou autenticada para membros com privacidade por cookie de sessão.

## Capabilities and Constraints

- **Capacidades:**
  - Ingestão e agregação de atividades do Strava.
  - Motor de gamificação com cálculo de XP (distância, elevação, tempo).
  - Sistema de níveis (Novato a Lenda) com cálculo de progresso percentual.
  - Catálogo de badges desbloqueáveis (secretas e públicas com bonificação em XP).
  - Corrida virtual com avatares dinâmicos por km acumulado na semana ativa.
  - Pódios da semana: Rei da Distância, Rei da Montanha, Mais Consistente.
  - Boletim semanal consolidado ("Giro da Semana").
  - Painel de controle de privacidade com exclusão completa de dados conforme exigência do Strava.
- **Restrições:**
  - Limite de até 10 atletas no Standard Tier inicial da API Strava (com expansão via formulário para até 9.999).
  - Dados estritamente privados do clube: sem compartilhamento ou envio de dados para IAs externas.
  - Conformidade obrigatória com diretrizes de marca do Strava ("Powered by Strava").

## Brand Commitments

- **Nome:** Cabritos Hub / Cabritos Race Team.
- **Tom de voz:** Competitivo, fraterno, motivador e bem-humorado ("pelotão", "cabritos", "Giro da Semana").
- **Identidade visual existente:** Tema escuro (Dark mode em tons de Slate/Zinc profundo) com acentos vívidos em âmbar/laranja (`amber-500` / `orange-500`), esmeralda para altimetria/montanhas e azul para ritmo. Tipografia robusta com contrastes nítidos.

## Evidence on Hand

- Conjunto de dados reais de atividades em `src/lib/real-strava-data.json`.
- Motor de cálculo de gamificação funcional em `src/lib/gamification.ts` e `src/lib/backfill.ts`.
- Esquema relacional Supabase com Drizzle ORM em `src/db/schema.ts`.
- Aplicação ativa em produção: `https://cabritos-hub.vercel.app`.

## Product Principles

1. **Cada pedal conta:** Toda atividade deve repercutir em múltiplos sistemas (XP, nível, corrida, pódio e boletim).
2. **Reconhecimento multifacetado:** Evitar que apenas os mais rápidos vençam; premiar consistência, altimetria, evolução pessoal e participação.
3. **Clareza imediata:** Ao abrir o app, o ciclista deve saber instantaneamente sua posição, seu progresso para o próximo nível e o desafio da semana.
4. **Respeito absoluto à privacidade:** Controle direto pelo atleta dos seus dados sincronizados.
