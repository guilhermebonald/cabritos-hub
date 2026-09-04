import { getRealProfile } from "@/lib/real-data-provider";
import { cookies } from "next/headers";
import {
  Trophy,
  Award,
  Zap,
  Mountain,
  Clock,
  RotateCw,
  Share2,
  Calendar,
  ChevronLeft,
  Lock,
  Trash2,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
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

  // Se não houver sessão ativa por cookie, o usuário não está logado
  const profile = loggedAthleteId ? getRealProfile(loggedAthleteId) : null;

  if (!profile) {
    return (
      <div className="space-y-8 max-w-3xl mx-auto pb-12 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar ao Hub
        </Link>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Conta Desconectada & Dados Apagados
            </h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Você não possui nenhum perfil ou dado ativo no Cabritos Hub. Todas as suas atividades e pontuações foram removidas com sucesso.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/api/auth/strava"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 px-6 py-3 rounded-xl text-sm font-bold transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              Conectar com o Strava
            </a>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 px-6 py-3 rounded-xl text-sm font-semibold transition"
            >
              Ir para a Página Inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar ao Hub
        </Link>
        <div className="flex items-center gap-3">
          <a
            href="/api/auth/strava"
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-400" />
            Sincronizar Strava
          </a>
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
            Compartilhar Nível
          </a>
        </div>
      </div>

      {/* Hero Card do Atleta */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-20 h-20 rounded-2xl border-2 border-amber-500 object-cover shadow-xl shadow-amber-500/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-1 flex items-center justify-center text-slate-950 font-black text-3xl shadow-xl shadow-amber-500/20">
                {profile.fullName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {profile.fullName}
                </h1>
                <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  {profile.levelInfo.tierName}
                </span>
                <span className="text-2xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Strava Conectado
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
          Estatísticas da Temporada 2026 (Strava Real)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              Distância Total
            </div>
            <div className="text-2xl font-black text-white">
              {profile.seasonStats.totalDistanceKm.toLocaleString("pt-BR")}{" "}
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
          Atividades Reais ({profile.recentActivities.length} mais recentes)
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
                    {(act.distanceMeters / 1000).toFixed(1)} km
                  </div>
                </div>
                <div>
                  <div className="text-2xs text-slate-500 uppercase">Altimetria</div>
                  <div className="font-mono font-bold text-slate-200">
                    {Math.round(act.elevationGainMeters)} m
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

      {/* Zona de Privacidade & Desconexão */}
      <section className="bg-red-950/20 border border-red-900/40 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 text-red-400">
          <Trash2 className="w-5 h-5" />
          <h3 className="font-bold text-white text-base">Gerenciamento de Dados & Privacidade</h3>
        </div>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Ao desconectar sua conta do Strava e apagar seus dados, todas as suas atividades sincronizadas,
          pontos de XP e participação nos rankings do Cabritos Hub serão removidos permanentemente.
        </p>
        <form action="/api/auth/disconnect" method="POST" className="pt-2">
          <input type="hidden" name="athleteId" value={profile.athleteId} />
          <button
            type="submit"
            className="flex items-center gap-2 bg-red-600/90 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-red-900/30 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Desconectar e Apagar Todos os Meus Dados
          </button>
        </form>
      </section>
    </div>
  );
}
