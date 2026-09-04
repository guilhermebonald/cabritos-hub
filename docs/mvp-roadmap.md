# Roteiro de Implementação do MVP (Cabritos Hub)

Plano de fases para entrega incremental.

## Fase 1: Fundação do Projeto
- Inicializar repositório Git.
- Scaffolding Next.js (TypeScript, Tailwind CSS, App Router, Lucide Icons).
- Configuração do Drizzle ORM + migrações PostgreSQL.
- Setup de variáveis de ambiente (`STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `DATABASE_URL`, `NEXTAUTH_SECRET`).

## Fase 2: Autenticação Strava e Ingestão Inicial
- NextAuth configurado com Strava OAuth (`activity:read`).
- Verificação de filiação ao clube "Cabritos".
- Job de Backfill da Temporada (importação de atividades de 01/01/2026 até hoje).
- Motor de cálculo de XP por atividade (distância + altimetria + bônus).

## Fase 3: Dashboard Principal e Corrida Virtual
- **Página Inicial**:
  - Feed da semana corrente com progresso do clube.
  - Corrida virtual visual (pista horizontal/vertical com avatares dos ciclistas avançando por km acumulados).
  - Tabela de Rankings múltiplos (Distância, Montanha, Consistência).
- **Perfil do Ciclista**:
  - Nível atual, barra de progresso para o próximo nível, total de XP vitalício.
  - Grade de conquistas (bloqueadas, desbloqueadas e secretas).

## Fase 4: Desafios e Prêmios Engraçados
- Rotação de desafios semanais (3 individuais + 1 do clube).
- Avaliação automática de elegibilidade para prêmios descontraídos (Vampiro, Trator, Café, Foguete).
- Painel administrativo simples para revisão e publicação do "Giro da Semana".

## Fase 5: Compartilhamento Social & Mapa Coletivo
- Endpoint `@vercel/og` gerando cards visuais dos pódios para Stories e WhatsApp.
- Mapa coletivo agregando polylines das atividades da semana.
- Endpoint de Webhook Strava para ingestão instantânea de novos pedais.
