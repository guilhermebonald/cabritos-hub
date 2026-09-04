# 4. Backfill Histórico e Visibilidade de Membros

Data: 2026-09-04
Status: Aceito

## Contexto
Definição do escopo de importação de atividades passadas no primeiro acesso do ciclista e da apresentação de integrantes do clube Strava que ainda não autorizaram a plataforma.

## Decisões

1. **Backfill da Temporada Vigente (1º de Janeiro)**:
   - No primeiro login OAuth, o sistema importa retroativamente todas as atividades realizadas a partir de 01/01 do ano corrente.
   - Preserva justiça nos rankings da temporada e respeita as cotas de taxa (rate limits) da API do Strava.
2. **Exibição de Membros Pendentes de Conexão**:
   - O clube exibe a lista de membros do Strava Club que ainda não conectaram a conta, com call-to-action para convite e engajamento comunitário.

## Consequências
- Entrada imediata do ciclista com pontuação relevante na temporada vigente.
- Mecanismo orgânico de viralização dentro do grupo de WhatsApp do clube.
