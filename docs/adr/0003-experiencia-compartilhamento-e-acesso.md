# 3. Experiência de Usuário, Compartilhamento e Acesso

Data: 2026-09-04
Status: Aceito

## Contexto
Definição do formato de compartilhamento social do Giro da Semana, controle de admissão no sistema, estratégia de sincronização de dados e política de visibilidade entre membros.

## Decisões

1. **Compartilhamento Social por Cards Visuais (Stories / WhatsApp)**:
   - Geração automática de imagens/cards em formato PNG prontos para Stories (9:16) e WhatsApp (1:1 / 4:5), além da página web do boletim.
2. **Admissão por Verificação Automática do Clube Strava**:
   - Ao autenticar via Strava OAuth, o sistema verifica se o atleta pertence ao clube "Cabritos" oficial. Aprovado automaticamente se pertencer; bloqueado se não for membro.
3. **Sincronização em Tempo Real (Webhooks)**:
   - Utilização de Strava Event Webhooks para processamento imediato pós-pedal, com botão de sincronização manual de contingência no perfil.
4. **Visibilidade Interna Transparente**:
   - Dados de atividades, rankings e trajetos são visíveis entre todos os membros autenticados do clube. Áreas residenciais mascaradas nativamente pelo Strava são respeitadas.

## Consequências
- Alto engajamento no grupo de WhatsApp com cards visuais prontos.
- Gestão zero de convites/senhas manuais (baseada no clube Strava existente).
- Atualização instantânea na tela pós-pedal.
