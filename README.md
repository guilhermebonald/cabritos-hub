# 🐐 Cabritos Hub

Plataforma web de gamificação para o clube de ciclismo **Cabritos**, integrando atividades do **Strava** em um sistema RPG com progressão de níveis, rankings semanais, corrida virtual coletiva, desafios dinâmicos, conquistas secretas e o boletim humorístico **Giro da Semana**.

---

## 🚀 Funcionalidades Principais

- **Sistema de XP e Níveis Vitalícios**:
  - Fórmula matemática balanceada com retornos decrescentes para distâncias extremas (10 XP/km até 80km, 5 XP/km até 150km, 2.5 XP/km além).
  - Altimetria bonificada (1 XP a cada 10m de elevação) e multiplicador semanal de consistência.
  - Tiers de progressão: *Novato*, *Pedaleiro*, *Explorador*, *Escalador*, *Monstro* e *Lenda*.

- **Corrida Virtual Coletiva**:
  - Pista contínua de fim de semana com avatares dos integrantes posicionados pela quilometragem acumulada.

- **Rankings Semanais com Justiça Esportiva**:
  - *Rei da Distância*, *Rei da Montanha*, *Mais Consistente*, *Maior Pedal*, *Foguete do Asfalto*.
  - Segregação de E-Bikes (`EBikeRide`, `EMountainBikeRide`) de pódios competitivos sem anular XP pessoal.

- **Desafios Semanais**:
  - 3 individuais (Fácil, Médio, Difícil) e 1 desafio coletivo colaborativo do clube.

- **Conquistas Públicas e Secretas**:
  - Desbloqueio automático de badges (*Centurião 100k*, *Vampiro da Madrugada*, *Cabrito Montanhês*, etc.).

- **Giro da Semana**:
  - Resumo editorial semanal com destaques, métricas coletivas e prêmios cômicos (*Trator*, *Vampiro*, *Foguete*, *Ciclista Café*, *Maior Evolução*).

- **Cards Sociais Dinâmicos (`@vercel/og`)**:
  - Geração de imagens serverless em alta resolução para **Stories (9:16)** e **Feed/WhatsApp (1200x630)** via `/api/og`.

- **Mapa Coletivo de Rotas**:
  - Decodificação de polylines comprimidas do Google e projeção vetorial SVG das rotas exploradas pelo grupo.

- **Ingestão em Tempo Real (Webhooks Strava)**:
  - Endpoint `/api/webhooks/strava` com handshake de validação e processamento de eventos.

---

## 🛠️ Tecnologias

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Estilização**: Tailwind CSS v4 + Lucide Icons
- **Banco de Dados**: PostgreSQL + Drizzle ORM + Drizzle Kit
- **Imagens Dinâmicas**: `@vercel/og` (`ImageResponse`)
- **Testes**: Node Native Test Runner com `tsx`

---

## 📦 Instalação e Execução

### 1. Clonar repositório e instalar dependências
```bash
git clone https://github.com/guilhermebonald/cabritos-hub.git
cd cabritos-hub
npm install
```

### 2. Configurar variáveis de ambiente
Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

### 3. Migrações do Banco de Dados
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 4. Executar Testes
```bash
npm test
```

### 5. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3000`.

---

## 🧪 Estrutura de Testes

Testes 100% determinísticos usando `tsx --test`:
- `src/lib/gamification.test.ts` (XP e Níveis)
- `src/lib/rankings.test.ts` (Rankings e Segregação)
- `src/lib/challenges.test.ts` (Desafios)
- `src/lib/badges.test.ts` (Badges e Conquistas)
- `src/lib/backfill.test.ts` (Backfill de Temporada)
- `src/lib/club-members.test.ts` (Membros Pendentes)
- `src/lib/giro.test.ts` (Giro da Semana e Prêmios)
- `src/lib/routes-map.test.ts` (Decodificação de Polylines e Mapa)
- `src/lib/social-cards.test.ts` (Geração de Cards Sociais)
- `src/lib/strava-webhook.test.ts` (Webhooks Strava)
- `src/lib/athlete-profile.test.ts` (Perfil e Vitrine de Atleta)
- `src/lib/strava-auth.test.ts` (Autenticação e Gate do Clube)
