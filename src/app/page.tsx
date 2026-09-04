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

  const profile = loggedAthleteId ? getRealProfile(loggedAthleteId) : null;
  const rankings = getRealWeeklyRankings();
  const realGiroBulletin = getRealGiroBulletin();
  const activeCompetitionWeek = getActiveCompetitionWeek();

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
              <div className="flex justify-between items-center text-xs font-black mb-1.5">
                <span className="text-slate-600 uppercase tracking-wider">Energia de XP</span>
                <span className="text-amber-600 font-mono">{profile.levelInfo.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 p-0.5 border border-slate-200 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-700 shadow-inner"
                  style={{ width: `${profile.levelInfo.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-1.5 font-mono">
                <span>{profile.totalXp.toLocaleString("pt-BR")} XP</span>
                <span>{profile.levelInfo.nextLevelXp.toLocaleString("pt-BR")} XP</span>
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
            <a href="/api/auth/strava">
              <GameButton variant="primary" size="lg">
                Começar o Jogo
              </GameButton>
            </a>
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
                <h2 className="text-base font-black text-emerald-950 uppercase tracking-wide">
                  Desafio da Semana
                </h2>
              </div>
              <span className="text-xs font-black bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300">
                +300 XP
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1">
              Desafio Escalador das Cabras
            </h3>
            <p className="text-xs font-semibold text-emerald-800 mb-4 leading-relaxed">
              Acumule pelo menos 1.000 metros de altimetria nos seus pedais até domingo às 23:59.
            </p>

            <div className="space-y-1.5 mb-2">
              <div className="flex justify-between text-xs font-black text-emerald-900">
                <span>Progresso Coletivo</span>
                <span>{Math.round(rankings.mountainPodium.reduce((acc, p) => acc + p.totalElevationMeters, 0))}m / 5.000m</span>
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
            <span className="text-2xs font-extrabold text-emerald-700 uppercase">
              Ciclo #{activeCompetitionWeek.weekNumber}
            </span>
            <Link
              href="/desafios"
              className="inline-flex items-center gap-1 text-xs font-black text-emerald-900 hover:text-emerald-700"
            >
              Ver Todas as Missões <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </GameCard>

        {/* Card Mascote Billy / Dica do Dia */}
        <GameCard color="orange" className="flex flex-col items-center justify-center text-center p-6 space-y-3">
          <BillyMascot mood="trophy" size="md" />
          <h3 className="text-sm font-black text-orange-950 uppercase tracking-wide">
            Recado do Billy
          </h3>
          <p className="text-xs font-bold text-orange-800 leading-relaxed">
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
            <span className="text-2xl">🏁</span>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              Corrida da Semana
            </h2>
          </div>
          <Link
            href="/corrida"
            className="text-xs font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 uppercase tracking-wider"
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
                  <div className="flex justify-between items-center text-xs font-black">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-2xs text-slate-700">
                        {idx + 1}
                      </span>
                      <span className="text-slate-900">{cyclist.athleteName}</span>
                    </div>
                    <span className="font-mono text-amber-600 font-extrabold">
                      {cyclist.distanceKm} km
                    </span>
                  </div>
                  <div className="relative w-full bg-slate-100 h-6 rounded-full overflow-hidden border-2 border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700 flex items-center justify-end pr-1.5"
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
              <p className="text-xs font-bold text-slate-400">
                Nenhum ciclista na estrada esta semana.
              </p>
              <a href="/api/auth/strava">
                <GameButton variant="primary" size="sm">
                  Entrar na Corrida
                </GameButton>
              </a>
            </div>
          )}
        </GameCard>
      </section>

      {/* Pódios Rápidos */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              Pódios da Semana
            </h2>
          </div>
          <Link
            href="/ranking"
            className="text-xs font-black text-amber-600 hover:text-amber-700 flex items-center gap-1 uppercase tracking-wider"
          >
            Ver Todos os Rankings <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GameCard color="amber" className="p-5">
            <div className="flex items-center gap-2 mb-3 text-amber-700 font-black text-xs uppercase">
              <Zap className="w-4 h-4" />
              Rei da Distância
            </div>
            {rankings.distancePodium[0] ? (
              <div>
                <div className="text-base font-black text-slate-900">
                  {rankings.distancePodium[0].athleteName}
                </div>
                <div className="text-xs font-black text-amber-600 mt-0.5 font-mono">
                  {rankings.distancePodium[0].totalDistanceKm} km
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-bold">Aguardando pedais...</div>
            )}
          </GameCard>

          <GameCard color="emerald" className="p-5">
            <div className="flex items-center gap-2 mb-3 text-emerald-700 font-black text-xs uppercase">
              <Mountain className="w-4 h-4" />
              Rei da Montanha
            </div>
            {rankings.mountainPodium[0] ? (
              <div>
                <div className="text-base font-black text-slate-900">
                  {rankings.mountainPodium[0].athleteName}
                </div>
                <div className="text-xs font-black text-emerald-600 mt-0.5 font-mono">
                  {rankings.mountainPodium[0].totalElevationMeters} m
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-bold">Aguardando pedais...</div>
            )}
          </GameCard>

          <GameCard color="orange" className="p-5">
            <div className="flex items-center gap-2 mb-3 text-orange-700 font-black text-xs uppercase">
              <Flame className="w-4 h-4" />
              Mais Consistente
            </div>
            {rankings.consistencyPodium[0] ? (
              <div>
                <div className="text-base font-black text-slate-900">
                  {rankings.consistencyPodium[0].athleteName}
                </div>
                <div className="text-xs font-black text-orange-600 mt-0.5 font-mono">
                  {rankings.consistencyPodium[0].distinctDays} dias
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-bold">Aguardando pedais...</div>
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
