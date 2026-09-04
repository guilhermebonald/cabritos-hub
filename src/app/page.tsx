import { calculateActivityXp, getLevelFromXp } from "@/lib/gamification";
import { aggregateWeeklyRankings, ActivityRecord } from "@/lib/rankings";
import { Trophy, Flame, Mountain, Zap, Moon, Coffee, Award, Users } from "lucide-react";

export default function HomePage() {
  // Mock live state for dashboard presentation
  const currentAthlete = {
    name: "Guilherme Bonald",
    avatar: "🚴‍♂️",
    totalXp: 18450,
    clubName: "Cabritos Cycling Club",
  };

  const levelInfo = getLevelFromXp(currentAthlete.totalXp);

  const mockActivities: ActivityRecord[] = [
    {
      athleteId: "1",
      athleteName: "Guilherme",
      distanceMeters: 176000,
      elevationGainMeters: 4820,
      movingTimeSeconds: 21600,
      startDateLocal: "2026-09-02T06:30:00Z",
      isEligibleForRanking: true,
      activityType: "Outdoor",
    },
    {
      athleteId: "2",
      athleteName: "João",
      distanceMeters: 327000,
      elevationGainMeters: 1850,
      movingTimeSeconds: 36000,
      startDateLocal: "2026-09-01T07:00:00Z",
      isEligibleForRanking: true,
      activityType: "Outdoor",
    },
    {
      athleteId: "3",
      athleteName: "Carlos",
      distanceMeters: 143000,
      elevationGainMeters: 2100,
      movingTimeSeconds: 18000,
      startDateLocal: "2026-09-03T08:00:00Z",
      isEligibleForRanking: true,
      activityType: "Outdoor",
    },
    {
      athleteId: "4",
      athleteName: "Pedro",
      distanceMeters: 87000,
      elevationGainMeters: 920,
      movingTimeSeconds: 11000,
      startDateLocal: "2026-09-04T07:15:00Z",
      isEligibleForRanking: true,
      activityType: "Outdoor",
    },
  ];

  const rankings = aggregateWeeklyRankings(mockActivities);
  const maxDistance = Math.max(...mockActivities.map((a) => a.distanceMeters / 1000));

  return (
    <div className="space-y-10">
      {/* Athlete Header / Level Progression */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20">
              {currentAthlete.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{currentAthlete.name}</h1>
                <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {levelInfo.tierName}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Nível {levelInfo.level} • {currentAthlete.clubName}
              </p>
            </div>
          </div>
          <div className="w-full sm:w-72 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-400">Progresso do Nível</span>
              <span className="text-amber-400">{levelInfo.progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 mt-2">
              <span>{levelInfo.currentLevelXp} XP</span>
              <span>{levelInfo.nextLevelXp} XP</span>
            </div>
          </div>
        </div>
      </section>

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
            Ciclo #36
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          {mockActivities.map((cyclist, idx) => {
            const distKm = cyclist.distanceMeters / 1000;
            const progress = (distKm / maxDistance) * 100;
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
          })}
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
              {rankings.distancePodium.slice(0, 3).map((podium, i) => (
                <div key={podium.athleteId} className="flex justify-between text-sm">
                  <span className="text-slate-300">
                    {i + 1}º {podium.athleteName}
                  </span>
                  <span className="font-mono font-semibold text-slate-100">{podium.totalDistanceKm} km</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rei da Montanha */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Mountain className="w-5 h-5" />
              <h3 className="font-bold text-white">Rei da Montanha</h3>
            </div>
            <div className="space-y-3">
              {rankings.mountainPodium.slice(0, 3).map((podium, i) => (
                <div key={podium.athleteId} className="flex justify-between text-sm">
                  <span className="text-slate-300">
                    {i + 1}º {podium.athleteName}
                  </span>
                  <span className="font-mono font-semibold text-slate-100">{podium.totalElevationMeters} m</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mais Consistente */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 text-orange-400">
              <Flame className="w-5 h-5" />
              <h3 className="font-bold text-white">Mais Consistente</h3>
            </div>
            <div className="space-y-3">
              {rankings.consistencyPodium.slice(0, 3).map((podium, i) => (
                <div key={podium.athleteId} className="flex justify-between text-sm">
                  <span className="text-slate-300">
                    {i + 1}º {podium.athleteName}
                  </span>
                  <span className="font-mono font-semibold text-slate-100">{podium.distinctDays} dias</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Desafios da Semana */}
      <section id="desafios" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🎯 Desafios da Semana
            </h2>
            <p className="text-sm text-slate-400">
              Complete missões para acelerar seu ganho de XP e fortalecer o clube.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            4 Ativos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Fácil • Individual
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">+250 XP</span>
              </div>
              <h3 className="font-bold text-slate-100 text-base">Giro de Aquecimento</h3>
              <p className="text-xs text-slate-400 mt-1">Pedale pelo menos 60 km durante a semana.</p>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-400">45 / 60 km</span>
                <span className="text-emerald-400">75%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  Médio • Individual
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">+500 XP</span>
              </div>
              <h3 className="font-bold text-slate-100 text-base">Consistência de Ferro</h3>
              <p className="text-xs text-slate-400 mt-1">Pedale em pelo menos 4 dias diferentes.</p>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-400">3 / 4 dias</span>
                <span className="text-amber-400">75%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                  Difícil • Individual
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">+800 XP</span>
              </div>
              <h3 className="font-bold text-slate-100 text-base">Desafio das Alturas</h3>
              <p className="text-xs text-slate-400 mt-1">Acumule 2.500m de altimetria na semana.</p>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-400">1.820 / 2.500 m</span>
                <span className="text-rose-400">72%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: "72%" }} />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-blue-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-lg shadow-blue-500/5">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Cooperativo • Clube
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">+300 XP Geral</span>
              </div>
              <h3 className="font-bold text-slate-100 text-base">Missão Cabritos 2.000k</h3>
              <p className="text-xs text-slate-400 mt-1">O clube todo deve somar 2.000 km juntos.</p>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-400">1.480 / 2.000 km</span>
                <span className="text-blue-400">74%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full" style={{ width: "74%" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conquistas / Badges */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🎖️ Conquistas Desbloqueadas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
            <span className="text-3xl">🏅</span>
            <div>
              <div className="font-bold text-sm text-slate-100">Centurião</div>
              <div className="text-[11px] text-slate-400">Pedal de 100 km concluído</div>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
            <span className="text-3xl">⛰️</span>
            <div>
              <div className="font-bold text-sm text-slate-100">Montanhês</div>
              <div className="text-[11px] text-slate-400">10.000m na temporada</div>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-purple-500/30 rounded-xl p-4 flex items-center gap-3">
            <span className="text-3xl">🧛</span>
            <div>
              <div className="font-bold text-sm text-purple-300">Vampiro (Secreta)</div>
              <div className="text-[11px] text-slate-400">Desbravador da noite</div>
            </div>
          </div>
          <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-xl p-4 flex items-center gap-3 opacity-60">
            <span className="text-3xl filter grayscale">🚀</span>
            <div>
              <div className="font-bold text-sm text-slate-300">Foguete</div>
              <div className="text-[11px] text-slate-500">Bloqueada (+35 km/h)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Prêmios da Semana & Zoeira */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          🎭 Destaques & Prêmios Descontraídos
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Giro da Semana apurado automaticamente com as brincadeiras e conquistas da turma.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-xl text-center">
            <Moon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-xs text-slate-400">Vampiro da Semana</div>
            <div className="font-bold text-white mt-1">Guilherme</div>
            <div className="text-[11px] text-slate-500">42km noturnos</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-xl text-center">
            <Mountain className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <div className="text-xs text-slate-400">Trator das Serras</div>
            <div className="font-bold text-white mt-1">Carlos</div>
            <div className="text-[11px] text-slate-500">27m elevação/km</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-xl text-center">
            <Coffee className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-xs text-slate-400">Ciclista Café</div>
            <div className="font-bold text-white mt-1">Pedro</div>
            <div className="text-[11px] text-slate-500">Giro suave 18km</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-xl text-center">
            <Award className="w-6 h-6 text-rose-500 mx-auto mb-2" />
            <div className="text-xs text-slate-400">Maior Evolução</div>
            <div className="font-bold text-white mt-1">João</div>
            <div className="text-[11px] text-slate-500">+42% de volume</div>
          </div>
        </div>
      </section>

      {/* Membros Pendentes - Convite Comunitário */}
      <section className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white">Chame a galera do clube!</h3>
            <p className="text-sm text-slate-400">
              Ainda há 14 ciclistas no clube Strava que não ativaram o Cabritos Hub.
            </p>
          </div>
        </div>
        <button
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-amber-500/10 cursor-pointer"
        >
          Copiar Link de Convite
        </button>
      </section>
    </div>
  );
}
