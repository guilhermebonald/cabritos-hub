# 2. Mecânicas de Gamificação, Temporada e Classificação de Atividades

Data: 2026-09-04
Status: Aceito

## Contexto
Definir a persistência da progressão dos atletas, o formato da corrida virtual, regras esportivas de inclusão de tipos de atividades (rolo e e-bike), ciclo de desafios e apuração dos prêmios descontraídos do clube.

## Decisões

1. **Progressão RPG Permanente + Rankings Periódicos**:
   - Nível e XP acumulado são vitalícios (não resetam).
   - Rankings (Distância, Montanha, Consistência, etc.) rodam por Ciclo Semanal (Seg-Dom) e por Temporada Anual.
2. **Corrida Virtual em Estrada Contínua Aberta**:
   - Pista infinita durante o ciclo semanal. A posição do avatar de cada ciclista reflete os quilômetros acumulados na semana até domingo às 23:59.
3. **Classificação e Inclusão de Atividades**:
   - **Outdoor (Speed, MTB, Gravel, Urbano)**: Pontuação integral de XP e elegível a todos os rankings.
   - **Indoor / Rolo Virtual (Zwift, Rouvy, etc.)**: Pontuação de XP e contagem para consistência/distância geral.
   - **E-Bikes**: Pontuam para XP e perfil pessoal, mas são filtradas/segregadas dos rankings competitivos de velocidade, montanha e segmentos.
4. **Pool Rotativo Automático de Desafios**:
   - No início do ciclo semanal, o sistema seleciona automaticamente 3 desafios individuais (fácil, médio, difícil) e 1 desafio cooperativo do clube.
   - O administrador tem permissão para substituir ou customizar os desafios da semana.
5. **Prêmios Descontraídos Híbridos (Heurística + Curadoria)**:
   - O sistema calcula os candidatos ideais com base em critérios objetivos (Vampiro: pedais noturnos; Trator: maior ratio altimetria/km; Café: pedal relaxado < 20 km; Foguete: maior velocidade média em > 30 km).
   - O administrador valida ou altera os agraciados no fechamento do Giro da Semana antes da divulgação.

## Consequências
- Atletas retêm o valor histórico do seu esforço ao longo dos anos.
- Ninguém fica de fora (indoor e e-bike suportados com justiça esportiva).
- Carga operacional baixa para os organizadores do clube.
