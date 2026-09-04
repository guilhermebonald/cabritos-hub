# 1. Arquitetura Base, Ingestão e Ciclo de Gamificação

Data: 2026-09-04
Status: Aceito

## Contexto
O projeto Cabritos Hub visa gamificar os pedais do clube de ciclismo "Cabritos", utilizando dados de atividades registradas no Strava. Era necessário definir a abordagem de multi-tenancy, o modelo de ingestão de dados, o balanceamento de pontuação (XP), o fluxo de publicação do Giro da Semana e o mapa coletivo.

## Decisões

1. **Mono-tenant exclusivo**: A plataforma é desenvolvida e operada com foco estrito no clube Cabritos. Sem overhead de abstração multi-tenant prematura.
2. **OAuth individual do Strava**: Ingestão de dados de atividades via autorização OAuth individual de cada ciclista (`read,activity:read`), garantindo acesso legítimo a streams, altimetria e coordenadas.
3. **Progressão equilibrada (XP com retornos decrescentes e consistência)**: O cálculo de XP recompensa distância e ganho de elevação com teto/curva de desaceleração diária para evitar monopólio de ultra-distâncias, e aplica multiplicadores para frequência/dias pedalados no ciclo.
4. **Fechamento do Giro da Semana semi-automático**: Na virada do ciclo semanal (domingo para segunda-feira), o sistema pré-computa os vencedores das categorias, estatísticas e rascunha o boletim. Um administrador pode revisar, ajustar notas de humor/piadas internas e publicar.
5. **Mapa Coletivo com Polylines Agregadas**: Rotas são exibidas agregando polylines simplificadas respeitando a privacidade já configurada pelo ciclista no Strava (zonas de privacidade residenciais nativas).

## Consequências
- Acesso completo e seguro aos dados de cada membro.
- Flexibilidade editorial para a diretoria do clube manter o tom descontraído.
- Performance de mapa viável sem necessidade imediata de servidor de tiles customizados.
