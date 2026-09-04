# Contexto do Domínio: Cabritos Hub

Plataforma de gamificação para clubes de ciclismo que transforma atividades registradas no Strava em competição, progressão contínua, desafios, conquistas e engajamento comunitário.

## Glossário Ubíquo

### Ciclista / Integrante
Membro do clube cadastrado na plataforma. Possui perfil com histórico, nível de progressão, XP acumulado, conquistas desbloqueadas e estatísticas pessoais.

### Atividade / Pedal
Registro esportivo importado do Strava (distância, altimetria, tempo em movimento, velocidade média, trajeto GPS). É a unidade geradora de eventos no sistema (gatilho de XP, ranking, corrida, desafios).

### XP (Pontos de Experiência)
Métrica numérica contínua acumulada pelo ciclista através de atividades, cumprimento de desafios, desbloqueio de conquistas e consistência de treinos.

### Nível (Level / Tier)
Patamar de progressão do ciclista derivado do total de XP acumulado (ex: Novato, Pedaleiro, Explorador, Escalador, Monstro, Lenda).

### Ciclo Semanal (Semana de Competição)
Período padrão de renovação das competições (Segunda-feira 00:00 a Domingo 23:59). Determina a apuração do ranking semanal, desafios ativos e fechamento do Giro da Semana.

### Ranking do Clube
Classificação dos ciclistas no ciclo corrente segmentada por múltiplas categorias de mérito:
- **Rei da Distância**: Maior quilometragem acumulada.
- **Rei da Montanha**: Maior ganho de elevação acumulado.
- **Mais Consistente**: Mais dias distintos com pedal no ciclo.
- **Evolução da Semana**: Maior crescimento percentual em relação ao ciclo anterior.
- **Maior Pedal**: Maior distância em atividade única.
- **Mais Ativo**: Maior número total de atividades registradas.
- **Foguete**: Melhor desempenho de velocidade média em distância mínima qualificada.

### Corrida Virtual
Visualização em formato de pista/estrada onde os avatares dos ciclistas progridem visualmente de acordo com a distância percorrida no período.

### Desafio
Objetivo de curto prazo com critérios pré-definidos (distância, altimetria, dias, velocidade) que concede bônus de XP ao ser concluído. Pode ser individual ou cooperativo (meta do clube).

### Conquista (Badge)
Marco histórico permanente concedido ao ciclista ao atingir um feito específico (público ou secreto).

### Prêmio Semanal Descontraído
Destaques lúdicos atribuídos automaticamente ao final da semana com base em padrões das atividades (ex: Vampiro para pedais noturnos, Trator para esforço bruto, Ciclista Café para pedais curtos e leves).

### Giro da Semana
Boletim resumo gerado ao final de cada ciclo semanal consolidando vencedores de categorias, evolução do grupo e destaques.

### Mapa Coletivo
Visualização geográfica agregada dos trajetos percorridos pelos integrantes do clube em um determinado intervalo de tempo.

### Temporada Anual
Janela de competição de longo prazo (ano civil) que acumula e premia os rankings consolidados além dos ciclos semanais.

### Tipo de Atividade
Classificação da atividade esportiva importada do Strava:
- `Outdoor`: Pedal ao ar livre (Speed, MTB, Gravel, Urbano). Elegível a 100% das regras e rankings.
- `Virtual / Rolo`: Pedal indoor em simulador (Zwift, etc.). Pontua XP e consistência/distância geral.
- `E-Bike`: Pedal com assistência elétrica. Gera XP e progresso pessoal, mas é segregado de rankings competitivos de montanha/velocidade.

### Backfill de Temporada
Importação retroativa automática realizada no primeiro login do membro, abrangendo todas as atividades desde 1º de Janeiro da temporada corrente.

### Membro Conectado vs Pendente
- `Conectado`: Integrante que autorizou o OAuth Strava e tem dados sincronizados em tempo real via Webhook.
- `Pendente`: Integrante listado no clube oficial do Strava que ainda não autorizou o Cabritos Hub. Exibido na seção de convites para incentivo comunitário.
