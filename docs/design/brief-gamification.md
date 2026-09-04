# Brief de Design & UX: Cabritos Hub (Game/Duolingo Style)

## 1. Visão & Propósito
Transformar a experiência dos ciclistas do **Cabritos Race Team** em um jogo casual, competitivo e recompensador ("Duolingo do Ciclismo"). Substituir qualquer aparência de dashboard corporativo ou analítica pesada por uma interface tátil, vibrante e cheia de personalidade com o mascote **Bode Billy**.

## 2. Princípios de Experiência (Duolingo-inspired)
- **Geometria Tátil & 3D Flat:** Botões e cards com relevo físico (`border-b-4`, estados ativos de clique com translação `active:translate-y-1 active:border-b-0`).
- **Cores Vivas & Semânticas:**
  - Base: Fundo claro/creme suave (`#F8FAFC` / `#FFFDF9`), cards brancos com bordas espessas coloridas.
  - XP & Energia: Dourado / Âmbar solar (`#F59E0B` / `#D97706`).
  - Altimetria & Conquistas: Verde Montanha (`#10B981` / `#059669`).
  - Velocidade & Corrida: Laranja Turbo (`#F97316`) e Roxo Desafio (`#8B5CF6`).
- **Feedback Constante:** Microinterações a cada avanço (XP flutuante, animações de comemoração, barras elásticas com cantos `rounded-full`).
- **Zero Fricção Numérica:** Em vez de gráficos e tabelas densas, barras de progresso gamificadas, medalhas grandes, pódios em blocos e cards de missão.

## 3. Mascote: "Bode Billy"
- **Visual:** Cabrito ciclista com capacete aero, óculos escuros esportivos espelhados, jersey do Cabritos Race Team.
- **Estados Visuais no App:**
  - *Sprint:* Comemorando pedal e distribuindo XP.
  - *Subida:* Escalando montanha de língua de fora nos desafios de altimetria.
  - *Pódio:* Levantando troféu de 1º lugar.
  - *Vampiro:* Pedal noturno com capa cômica de vampiro.
  - *Descanso:* Café na mão esperando o próximo treino.

## 4. Estrutura de Navegação (5 Abas Principais)
- **1. Início (Home):**
  - Card Hero do Ciclista com Nível, XP acumulado e barra de progresso viva.
  - Pista da Corrida Virtual Semanal (avatares se movendo proporcionalmente aos km).
  - Desafio Ativo da Semana (com botão de ação/status da missão).
  - Destaque do Pelotão (resumo rápido da semana com o Bode Billy).
- **2. Desafios:**
  - Trilhas de missões: Missões Semanais e Missões da Temporada.
  - Cards com barras de progresso (ex: "Acumule 2.000m de subida", "Pedale 5 dias").
  - Recompensas instantâneas visíveis (+500 XP, Badge Exclusiva).
- **3. Corrida Virtual:**
  - Pista com faixas estilizadas simulando uma estrada de montanha.
  - Ciclistas com mini-avatares e velocímetros lúdicos disputando posições metro a metro.
- **4. Ranking & Pódio:**
  - Pódio dos 3 primeiros colocados em blocos de alturas diferentes (1º Dourado, 2º Prateado, 3º Bronze).
  - Abas rápidas para alternar: Distância, Montanha, Consistência e Prêmios Engraçados (Cabra da Montanha, Trator, Vampiro, Lesma).
- **5. Perfil & Conquistas:**
  - Visão de personagem de RPG: Tier de Nível, XP total, Badges desbloqueadas em grid colorido e Badges secretas bloqueadas com cadeado.
  - Mini-jornal "Giro da Semana" integrado com destaques das maiores façanhas.

## 5. Próximos Passos
1. Substituir a casca visual e tipografia atual para o tema vibrante e tátil.
2. Construir os componentes modulares de Gamificação (Cards 3D, Barra XP Duolingo, Pódio Escalonado, Pista da Corrida, Mascote SVG).
3. Conectar com o motor existente de dados reais do Strava.
