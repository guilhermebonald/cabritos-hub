import {
  getRealProfile,
  getRealWeeklyRankings,
  getRealGiroBulletin,
  getActiveCompetitionWeek,
} from "@/lib/real-data-provider";
import { cookies } from "next/headers";
import { Trophy, Flame, Mountain, Zap, Award, Users, RotateCw, CheckCircle2 } from "lucide-react";
import Link from "next/link";

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
      // Ignora erro de parse
    }
  }

  const profile = loggedAthleteId ? getRealProfile(loggedAthleteId) : null;
  const rankings = getRealWeeklyRankings();
  const realGiroBulletin = getRealGiroBulletin();
  const activeCompetitionWeek = getActiveCompetitionWeek();

  // Participantes da corrida baseados no ranking real semanal
  const participants = rankings.distancePodium.length > 0
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
    <div className="space-y-10">
      {/* Athlete Header / Level Progression ou Estado Desconectado */}
      {profile ? (
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-16 h-16 rounded-full border-2 border-amber-500/80 object-cover shadow-lg shadow-orange-500/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20">
                  🚴‍♂️
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white">{profile.fullName}</h1>
                  <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    {profile.levelInfo.tierName}
                  </span>
                  <span className="text-2xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    Strava Conectado
                  </span>
                </div>
                <p className="text-sm text-slate-400">
                  Nível {profile.levelInfo.level} • {profile.clubName}
                </p>
              </div>
            </div>
            <div className="w-full sm:w-72 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-400">Progresso do Nível</span>
                <span className="text-amber-400 font-mono font-bold">{profile.levelInfo.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${profile.levelInfo.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
                <span>{profile.levelInfo.currentLevelXp.toLocaleString("pt-BR")} XP</span>
                <span>{profile.levelInfo.nextLevelXp.toLocaleString("pt-BR")} XP</span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <Users className="w-3.5 h-3.5" />
              Cabritos Race Team Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Conecte seu Strava para Entrar no Pelotão
            </h1>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Sincronize seus pedais, suba de nível com XP, desbloqueie badges exclusivas e dispute o pódio semanal da equipe.
            </p>
          </div>
          <a
            href="/api/auth/strava"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-sm transition shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
            Conectar Strava
          </a>
        </section>
      )}

      {/* Corrida Virtual da Semana */}
      <section id="corrida" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🏁 Corrida da Semana
            </h2>
            <p className="text-sm text-slate-400">
              Estrada contínua aberta até domingo 23:59. Cada km pedalado move seu avatar!
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400">
            Ciclo #{activeCompetitionWeek.weekNumber} • Temporada {activeCompetitionWeek.year}
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          {participants.length > 0 ? (
            participants.map((cyclist, idx) => {
              const distKm = cyclist.distanceKm;
              const progress = maxDistance > 0 ? (distKm / maxDistance) * 100 : 0;
              return (
                <div key={cyclist.athleteId} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="flex items-center gap-2">
                      <span className="text-slate-500 font-mono w-4">{idx + 1}º</span>
                      <span className="text-slate-200">{cyclist.athleteName}</span>
                    </span>
                    <span className="font-mono text-amber-400 font-semibold">{distKm} km</span>
                  </div>
                  <div className="relative w-full bg-slate-950 h-5 rounded-full overflow-hidden border border-slate-800/80">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 via-amber-500 to-orange-500 rounded-full transition-all duration-500 flex items-center justify-end pr-1"
                      style={{ width: `${progress}%` }}
                    >
                      <span className="text-xs select-none">🚴</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">
              Nenhum ciclista ativo na corrida desta semana. Conecte sua conta do Strava para começar!
            </p>
          )}
        </div>
      </section>

      {/* Rankings do Clube */}
      <section id="rankings" className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🏆 Rankings do Clube
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rei da Distância */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 text-amber-400">
              <Zap className="w-5 h-5" />
              <h3 className="font-bold text-white">Rei da Distância</h3>
            </div>
            <div className="space-y-3">
              {rankings.distancePodium.length > 0 ? (
                rankings.distancePodium.slice(0, 3).map((podium, i) => (
                  <div key={podium.athleteId} className="flex justify-between text-sm">
                    <span className="text-slate-300">
                      {i + 1}º {podium.athleteName}
                    </span>
                    <span className="font-mono font-semibold text-slate-100">{podium.totalDistanceKm} km</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Sem atividades registradas na semana.</p>
              )}
            </div>
          </div>

          {/* Rei da Montanha */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Mountain className="w-5 h-5" />
              <h3 className="font-bold text-white">Rei da Montanha</h3>
            </div>
            <div className="space-y-3">
              {rankings.mountainPodium.length > 0 ? (
                rankings.mountainPodium.slice(0, 3).map((podium, i) => (
                  <div key={podium.athleteId} className="flex justify-between text-sm">
                    <span className="text-slate-300">
                      {i + 1}º {podium.athleteName}
                    </span>
                    <span className="font-mono font-semibold text-slate-100">{podium.totalElevationMeters} m</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Sem altimetria registrada na semana.</p>
              )}
            </div>
          </div>

          {/* Mais Consistente */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 text-orange-400">
              <Flame className="w-5 h-5" />
              <h3 className="font-bold text-white">Mais Consistente</h3>
            </div>
            <div className="space-y-3">
              {rankings.consistencyPodium.length > 0 ? (
                rankings.consistencyPodium.slice(0, 3).map((podium, i) => (
                  <div key={podium.athleteId} className="flex justify-between text-sm">
                    <span className="text-slate-300">
                      {i + 1}º {podium.athleteName}
                    </span>
                    <span className="font-mono font-semibold text-slate-100">{podium.distinctDays} dias</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Sem dias pedalados registrados.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Destaque do Giro da Semana */}
      <section className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase text-amber-400 tracking-wider">
            Giro da Semana • Edição #{realGiroBulletin.weekNumber}
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            {realGiroBulletin.summaryHeadline}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {realGiroBulletin.totalDistanceKm} km pedalados coletivamente e {realGiroBulletin.totalElevationMeters} m de altimetria!
          </p>
        </div>
        <Link
          href="/giro"
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
        >
          Ler Edição Completa
        </Link>
      </section>
    </div>
  );
}
