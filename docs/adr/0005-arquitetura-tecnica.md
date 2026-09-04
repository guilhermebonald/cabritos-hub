# 5. Stack Técnica e Infraestrutura

Data: 2026-09-04
Status: Aceito

## Contexto
Definir tecnologias para o desenvolvimento do Cabritos Hub, atendendo aos requisitos de processamento de webhooks do Strava, renderização de rotas GPS, geração de cards sociais e persistência de dados.

## Decisões

1. **Framework e Runtime**:
   - Next.js (App Router, TypeScript, React 19).
   - Hospedagem: Vercel (Fluid Compute, Node.js 24 LTS).
   - Estilização: Tailwind CSS + Radix/shadcn para componentes rápidos e acessíveis.

2. **Banco de Dados e ORM**:
   - Banco relacional PostgreSQL (Neon Serverless ou Supabase).
   - ORM: Drizzle ORM (type-safe, leve, sem overhead de client pesado).

3. **Autenticação & Tokens Strava**:
   - Auth.js / NextAuth com provedor Strava OAuth 2.0.
   - Escopos: `read,activity:read`.
   - Rotação automática de refresh token armazenada de forma segura no banco.

4. **Ingestão e Webhooks**:
   - Endpoint `/api/webhooks/strava` para eventos `activity.create` e `activity.update`.
   - Processamento idempotente com verificação de `aspect_type` e `object_id`.

5. **Geração de Imagens Sociais (Cards)**:
   - `@vercel/og` (Satori / HTML/CSS to PNG) para renderizar dinamicamente pódios e badges em resoluções otimizadas para WhatsApp (1:1) e Stories (9:16).

6. **Visualização de Mapas**:
   - Leaflet ou MapLibre GL com decodificação de polylines nativas do Strava (`polyline.decode()`).

## Consequências
- Zero servidores dedicados para gerenciar (serverless puro).
- Compartilhamento visual ultrarrápido sem dependência de browser headless pesado (Puppeteer).
- Tipagem fim-a-fim de esquema de banco a componentes de tela.
