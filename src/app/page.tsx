import {
  getRealProfile,
  getRealWeeklyRankings,
  getRealGiroBulletin,
  getActiveCompetitionWeek,
} from "@/lib/real-data-provider";
import { cookies } from "next/headers";
import { Zap, Mountain, Flame, ArrowRight, Sparkles, Trophy, ChevronRight } from "lucide-react";
import Link from "next/link";
import { BillyMascot } from "@/components/billy-mascot";
import { GameCard, GameButton } from "@/components/game-ui";
import { AuthStatusBanner } from "@/components/auth-status-banner";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cabritos_athlete")?.value;
  let loggedAthleteId: string | undefined;

  if (sessionCookie) {
    try {
      const parsed = JSON.parse(sessionCookie);
      if (parsed && parsed.id) {
        loggedAthleteId = String(parsed.id);
      }
    } catch {
      // Ignora erro
    }
  }

  const profile = loggedAthleteId ? await getRealProfile(loggedAthleteId) : null;
  const rankings = await getRealWeeklyRankings();
  const realGiroBulletin = await getRealGiroBulletin();
  const activeCompetitionWeek = await getActiveCompetitionWeek();

  const participants =
    rankings.distancePodium.length > 0
      ? rankings.distancePodium.map((p) => ({
          athleteId: p.athleteId,
          athleteName: p.athleteName,
          distanceKm: p.totalDistanceKm,
        }))
      : profile
      ? [
          {
            athleteId: profile.athleteId,
            athleteName: profile.fullName,
            distanceKm: profile.seasonStats.totalDistanceKm,
          },
        ]
      : [];

  const maxDistance = participants.length > 0 ? Math.max(...participants.map((p) => p.distanceKm)) : 0;

  return (
    <div className="space-y-8">
      {/* Feedback de Autenticação / Erro de Login Strava */}
      <Suspense fallback={null}>
        <AuthStatusBanner />
      </Suspense>

      {/* Hero / Nível & Progresso do Usuário (estilo Duolingo) */}
      {profile ? (
        <GameCard color="amber" className="relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-20 h-20 rounded-3xl border-4 border-white shadow-md object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-3xl bg-amber-400 border-4 border-white flex items-center justify-center text-4xl shadow-md">
                    🚴
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-black px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                  Lvl {profile.levelInfo.level}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900">{profile.fullName}</h1>
                  <span className="bg-amber-200 text-amber-900 border border-amber-400/60 text-2xs font-extrabold px-2 py-0.5 rounded-xl uppercase tracking-wider">
                    {profile.levelInfo.tierName}
                  </span>
                </div>
                <p className="text-xs font-bold text-amber-800/80 mt-1">
                  {profile.clubName} • Temporada 2026
                </p>
              </div>
            </div>

            {/* Barra de Progresso XP estilo Duolingo */}
            <div className="w-full sm:w-80 bg-white/90 p-4 rounded-2xl border-2 border-amber-200 shadow-sm">
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-slate-600 uppercase tracking-wider text-[10px]">Energia de XP</span>
                <span className="text-amber-600 font-mono font-extrabold tabular-nums">{profile.levelInfo.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 p-0.5 border border-slate-200 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-700 shadow-inner"
                  style={{ width: `${profile.levelInfo.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 mt-1.5 font-mono tabular-nums">
                <span>{profile.totalXp.toLocaleString("pt-BR")} XP</span>
                <span>{profile.levelInfo.nextLevelXp.toLocaleString("pt-BR")} XP</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium text-center mt-2 pt-1.5 border-t border-slate-100">
                1 km = 10 XP • 100m D+ = 25 XP
              </div>
            </div>
          </div>
        </GameCard>
      ) : (
        /* Onboarding Divertido com Bode Billy */
        <GameCard color="amber" className="relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <BillyMascot mood="cheering" size="lg" />
              <div className="space-y-1 max-w-lg">
                <div className="inline-flex items-center gap-1 text-2xs font-black uppercase tracking-widest text-amber-700 bg-amber-200/80 px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Temporada Ativa
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Bode Billy convoca o Pelotão!
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-600">
                  Conecte seu Strava para ganhar XP, disputar a corrida semanal e colecionar medalhas no clube.
                </p>
              </div>
            </div>
            <GameButton href="/api/auth/strava" variant="primary" size="lg">
              Começar o Jogo
            </GameButton>
          </div>
        </GameCard>
      )}

      {/* Grid Principal: Desafio da Semana & Mini-Giro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Desafio Ativo da Semana (Duolingo Quest Card) */}
        <GameCard color="emerald" className="md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <h2 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                  Desafio da Semana
                </h2>
              </div>
              <span className="text-2xs font-extrabold bg-emerald-200 text-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-300 tabular-nums">
                +300 XP
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1">
              Desafio Escalador das Cabras
            </h3>
            <p className="text-xs font-medium text-emerald-950/80 mb-4 leading-relaxed">
              Acumule pelo menos 1.000 metros de altimetria nos seus pedais até domingo às 23:59.
            </p>

            <div className="space-y-1.5 mb-2">
              <div className="flex justify-between text-xs font-bold text-emerald-950">
                <span>Progresso Coletivo</span>
                <span className="font-mono tabular-nums font-extrabold text-emerald-900">
                  {Math.round(rankings.mountainPodium.reduce((acc, p) => acc + p.totalElevationMeters, 0))}m / 5.000m
                </span>
              </div>
              <div className="w-full bg-emerald-100 rounded-full h-3.5 p-0.5 border border-emerald-300 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (rankings.mountainPodium.reduce((acc, p) => acc + p.totalElevationMeters, 0) / 5000) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-200/60 flex items-center justify-between">
            <span className="text-2xs font-bold text-emerald-900/70 uppercase tracking-wider">
              Ciclo #{activeCompetitionWeek.weekNumber}
            </span>
            <Link
              href="/desafios"
              className="inline-flex items-center gap-1 text-xs font-black text-emerald-950 hover:text-emerald-800"
            >
              Ver Todas as Missões <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </GameCard>

        {/* Card Mascote Billy / Dica do Dia */}
        <GameCard color="orange" className="flex flex-col items-center justify-center text-center p-6 space-y-3">
          <BillyMascot mood="trophy" size="md" />
          <h3 className="text-xs font-black text-orange-950 uppercase tracking-wider">
            Recado do Billy
          </h3>
          <p className="text-xs font-medium text-orange-950/85 leading-relaxed">
            &ldquo;Pedal leve ou montanha dura: cada km conta pro ranking do pelotão!&rdquo;
          </p>
          <Link href="/ranking">
            <GameButton variant="secondary" size="sm" className="mt-2">
              Ver Pódios
            </GameButton>
          </Link>
        </GameCard>
      </div>

      {/* Pista da Corrida Virtual Semanal */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏁</span>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Corrida da Semana
            </h2>
          </div>
          <Link
            href="/corrida"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 uppercase tracking-wider"
          >
            Pista Completa <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <GameCard color="white" className="space-y-4">
          {participants.length > 0 ? (
            participants.slice(0, 4).map((cyclist, idx) => {
              const progress = maxDistance > 0 ? (cyclist.distanceKm / maxDistance) * 100 : 0;
              return (
                <div key={cyclist.athleteId} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-2xs font-bold ${
                        idx === 0
                          ? "bg-amber-100 text-amber-900 border border-amber-300 font-extrabold"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800">{cyclist.athleteName}</span>
                    </div>
                    <span className="font-mono tabular-nums text-slate-900 font-bold">
                      {cyclist.distanceKm} <span className="text-slate-400 font-sans text-2xs">km</span>
                    </span>
                  </div>
                  <div className="relative w-full bg-slate-100 h-5 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-700 flex items-center justify-end pr-1 ${
                        idx === 0
                          ? "bg-gradient-to-r from-amber-400 to-orange-500 shadow-sm"
                          : "bg-gradient-to-r from-slate-400 to-slate-500"
                      }`}
                      style={{ width: `${Math.max(8, progress)}%` }}
                    >
                      <span className="text-xs select-none">🚴</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 space-y-2">
              <p className="text-xs font-medium text-slate-400">
                Nenhum ciclista na estrada esta semana.
              </p>
              <GameButton href="/api/auth/strava" variant="primary" size="sm">
                Entrar na Corrida
              </GameButton>
            </div>
          )}
        </GameCard>
      </section>

      {/* Pódios Rápidos */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Pódios da Semana
            </h2>
          </div>
          <Link
            href="/ranking"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 uppercase tracking-wider"
          >
            Ver Todos os Rankings <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GameCard color="amber" className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-600 fill-amber-400" />
                Rei da Distância
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md">
                Geral
              </span>
            </div>
            {rankings.distancePodium[0] ? (
              <div>
                <div className="text-base font-bold text-slate-900">
                  {rankings.distancePodium[0].athleteName}
                </div>
                <div className="text-xs font-semibold text-amber-900/80 mt-1 flex items-center justify-between">
                  <span>Km Acumulado</span>
                  <span className="font-mono tabular-nums font-extrabold text-amber-700 text-sm">
                    {rankings.distancePodium[0].totalDistanceKm} km
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-medium">Aguardando pedais...</div>
            )}
          </GameCard>

          <GameCard color="emerald" className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs uppercase tracking-wider">
                <Mountain className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                Rei da Montanha
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-200/80 text-emerald-950 px-2 py-0.5 rounded-md">
                D+
              </span>
            </div>
            {rankings.mountainPodium[0] ? (
              <div>
                <div className="text-base font-bold text-slate-900">
                  {rankings.mountainPodium[0].athleteName}
                </div>
                <div className="text-xs font-semibold text-emerald-900/80 mt-1 flex items-center justify-between">
                  <span>Desnível</span>
                  <span className="font-mono tabular-nums font-extrabold text-emerald-800 text-sm">
                    {rankings.mountainPodium[0].totalElevationMeters} m
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-medium">Aguardando pedais...</div>
            )}
          </GameCard>

          <GameCard color="orange" className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-orange-950 font-bold text-xs uppercase tracking-wider">
                <Flame className="w-4 h-4 text-orange-600 fill-orange-200" />
                Mais Consistente
              </div>
              <span className="text-[10px] font-mono font-bold bg-orange-200/80 text-orange-950 px-2 py-0.5 rounded-md">
                Dias
              </span>
            </div>
            {rankings.consistencyPodium[0] ? (
              <div>
                <div className="text-base font-bold text-slate-900">
                  {rankings.consistencyPodium[0].athleteName}
                </div>
                <div className="text-xs font-semibold text-orange-900/80 mt-1 flex items-center justify-between">
                  <span>Frequência</span>
                  <span className="font-mono tabular-nums font-extrabold text-orange-800 text-sm">
                    {rankings.consistencyPodium[0].distinctDays} dias
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-medium">Aguardando pedais...</div>
            )}
          </GameCard>
        </div>
      </section>

      {/* Boletim Semanal Giro */}
      <GameCard color="blue" className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-2xs font-black uppercase tracking-wider text-blue-700 bg-blue-200 px-2 py-0.5 rounded-full">
            Jornal do Pelotão • Edição #{realGiroBulletin.weekNumber}
          </span>
          <h3 className="text-base font-black text-slate-900 mt-1">
            {realGiroBulletin.summaryHeadline}
          </h3>
          <p className="text-xs font-bold text-blue-900/80 mt-0.5">
            {realGiroBulletin.totalDistanceKm} km percorridos coletivamente pelo time!
          </p>
        </div>
        <Link href="/giro">
          <GameButton variant="secondary" size="sm">
            Ler Giro
          </GameButton>
        </Link>
      </GameCard>
    </div>
  );
}
