import { computeAthleteProfile, AthleteActivityRecord } from "@/lib/athlete-profile";
import {
  Trophy,
  Award,
  Zap,
  Mountain,
  Clock,
  Share2,
  Calendar,
  ChevronLeft,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock database de atletas da comunidade
const COMMUNITY_ATHLETES: Record<
  string,
  {
    firstname: string;
    lastname: string;
    totalXp: number;
    unlockedBadgeCodes: Set<string>;
    activities: AthleteActivityRecord[];
  }
> = {
  "1": {
    firstname: "João",
    lastname: "Silva",
    totalXp: 38400,
    unlockedBadgeCodes: new Set(["century_100k", "rocket_speed_40kph"]),
    activities: [
      {
        id: "act-j1",
        name: "Longão do Fim de Semana",
        distanceMeters: 145000,
        elevationGainMeters: 1850,
        movingTimeSeconds: 16200,
        startDateLocal: "2026-09-03T06:00:00Z",
        averageSpeedKph: 32.2,
        activityType: "Outdoor",
        xpAwarded: 1685,
      },
      {
        id: "act-j2",
        name: "Sprint da Orla",
        distanceMeters: 45000,
        elevationGainMeters: 120,
        movingTimeSeconds: 4050,
        startDateLocal: "2026-09-01T17:30:00Z",
        averageSpeedKph: 40.0,
        activityType: "Outdoor",
        xpAwarded: 462,
      },
    ],
  },
  "2": {
    firstname: "Carlos",
    lastname: "Alpinista",
    totalXp: 29150,
    unlockedBadgeCodes: new Set(["elevation_10k"]),
    activities: [
      {
        id: "act-c1",
        name: "Escalada Pico Agulhas Negras",
        distanceMeters: 85000,
        elevationGainMeters: 3100,
        movingTimeSeconds: 14400,
        startDateLocal: "2026-09-02T07:00:00Z",
        averageSpeedKph: 21.2,
        activityType: "Outdoor",
        xpAwarded: 1160,
      },
    ],
  },
  "3": {
    firstname: "Mariana",
    lastname: "Veloz",
    totalXp: 21200,
    unlockedBadgeCodes: new Set(["rocket_speed_40kph"]),
    activities: [
      {
        id: "act-m1",
        name: "Contra-relógio Noturno",
        distanceMeters: 40000,
        elevationGainMeters: 180,
        movingTimeSeconds: 3600,
        startDateLocal: "2026-09-04T19:30:00Z",
        averageSpeedKph: 40.0,
        activityType: "Outdoor",
        xpAwarded: 418,
      },
    ],
  },
};

interface AtletaPageProps {
  params: Promise<{ id: string }>;
}

export default async function AtletaProfilePage({ params }: AtletaPageProps) {
  const { id } = await params;
  const rawAthlete = COMMUNITY_ATHLETES[id];

  if (!rawAthlete) {
    notFound();
  }

  const profile = computeAthleteProfile({
    athleteId: id,
    firstname: rawAthlete.firstname,
    lastname: rawAthlete.lastname,
    totalXp: rawAthlete.totalXp,
    clubName: "Cabritos Cycling Club",
    unlockedBadgeCodes: rawAthlete.unlockedBadgeCodes,
    activities: rawAthlete.activities,
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/#rankings"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar aos Rankings
        </Link>
        <div className="flex items-center gap-3">
          <a
            href={`/api/og?type=level_up&athlete=${encodeURIComponent(
              profile.fullName
            )}&level=${profile.levelInfo.level}&tier=${encodeURIComponent(
              profile.levelInfo.tierName
            )}&format=stories`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-950" />
            Card Social
          </a>
        </div>
      </div>

      {/* Hero Card do Atleta */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-1 flex items-center justify-center text-slate-950 font-black text-3xl shadow-xl shadow-amber-500/20">
              {profile.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {profile.fullName}
                </h1>
                <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  {profile.levelInfo.tierName}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">{profile.clubName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800/80 px-6 py-4 rounded-2xl">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Nível Vitalício
              </div>
              <div className="text-3xl font-black text-amber-400">
                Lvl {profile.levelInfo.level}
              </div>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                XP Acumulado
              </div>
              <div className="text-2xl font-black text-white">
                {profile.totalXp.toLocaleString("pt-BR")}{" "}
                <span className="text-xs text-amber-400 font-normal">XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Progresso de Nível */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs font-medium mb-2">
            <span className="text-slate-300">
              Progresso para Nível {profile.levelInfo.level + 1}
            </span>
            <span className="text-amber-400 font-mono font-bold">
              {profile.levelInfo.progressPercent}% ({profile.totalXp.toLocaleString("pt-BR")} /{" "}
              {profile.levelInfo.nextLevelXp.toLocaleString("pt-BR")} XP)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${profile.levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Estatísticas da Temporada */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Estatísticas da Temporada
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              Distância Total
            </div>
            <div className="text-2xl font-black text-white">
              {profile.seasonStats.totalDistanceKm}{" "}
              <span className="text-xs font-normal text-slate-400">km</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Mountain className="w-4 h-4 text-emerald-400" />
              Altimetria Total
            </div>
            <div className="text-2xl font-black text-white">
              {profile.seasonStats.totalElevationMeters.toLocaleString("pt-BR")}{" "}
              <span className="text-xs font-normal text-slate-400">m</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Trophy className="w-4 h-4 text-orange-400" />
              Maior Pedal
            </div>
            <div className="text-2xl font-black text-white">
              {profile.seasonStats.longestRideKm}{" "}
              <span className="text-xs font-normal text-slate-400">km</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Clock className="w-4 h-4 text-blue-400" />
              Tempo em Movimento
            </div>
            <div className="text-2xl font-black text-white">
              {Math.round(profile.seasonStats.totalMovingTimeSeconds / 3600)}{" "}
              <span className="text-xs font-normal text-slate-400">horas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Conquistas e Badges */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Conquistas Desbloqueadas ({profile.badges.unlocked.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.badges.unlocked.map((b) => (
            <div
              key={b.code}
              className="bg-slate-900/80 border border-amber-500/30 p-5 rounded-2xl flex items-start gap-4 shadow-lg shadow-amber-500/5 relative overflow-hidden"
            >
              <div className="text-3xl p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                {b.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-white text-sm truncate">{b.title}</h3>
                  <span className="text-2xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    +{b.xpBonus} XP
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{b.description}</p>
              </div>
            </div>
          ))}

          {profile.badges.locked.map((b) => (
            <div
              key={b.code}
              className="bg-slate-950/40 border border-slate-800/80 p-5 rounded-2xl flex items-start gap-4 opacity-60"
            >
              <div className="text-2xl p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-600">
                {b.isSecret ? <Lock className="w-5 h-5 text-slate-500 m-1" /> : b.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-400 text-sm truncate">{b.title}</h3>
                  <span className="text-2xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                    +{b.xpBonus} XP
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Histórico Recente de Atividades */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          Atividades Recentes
        </h2>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl divide-y divide-slate-800/60 overflow-hidden">
          {profile.recentActivities.map((act) => (
            <div
              key={act.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/80 transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {act.activityType}
                  </span>
                  <h3 className="font-bold text-white text-sm">{act.name}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(act.startDateLocal).toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div>
                  <div className="text-2xs text-slate-500 uppercase">Distância</div>
                  <div className="font-mono font-bold text-slate-200">
                    {Math.round(act.distanceMeters / 1000)} km
                  </div>
                </div>
                <div>
                  <div className="text-2xs text-slate-500 uppercase">Altimetria</div>
                  <div className="font-mono font-bold text-slate-200">
                    {act.elevationGainMeters} m
                  </div>
                </div>
                <div>
                  <div className="text-2xs text-slate-500 uppercase">XP Ganho</div>
                  <div className="font-mono font-bold text-amber-400">
                    +{act.xpAwarded} XP
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
