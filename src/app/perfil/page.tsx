import { getRealProfile } from "@/lib/real-data-provider";
import { cookies } from "next/headers";
import { GameCard, GameButton } from "@/components/game-ui";
import { BillyMascot } from "@/components/billy-mascot";
import { Trophy, Award, Zap, Mountain, Clock, Lock, LogOut, CheckCircle2, RotateCw } from "lucide-react";
import Link from "next/link";
import { AuthStatusBanner } from "@/components/auth-status-banner";
import { Suspense } from "react";

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
      // Ignora erro
    }
  }

  const profile = loggedAthleteId ? getRealProfile(loggedAthleteId) : null;

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto py-12 space-y-6">
        <Suspense fallback={null}>
          <AuthStatusBanner />
        </Suspense>
        <GameCard color="amber" className="text-center space-y-6">
          <BillyMascot mood="cheering" size="lg" className="mx-auto" />
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900">
              Nenhum Ciclista Conectado
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-900/80 max-w-sm mx-auto">
              Conecte sua conta do Strava para carregar seu nível, pontuação de XP e coleção de badges!
            </p>
          </div>
          <GameButton href="/api/auth/strava" variant="primary" size="lg">
            Conectar com Strava
          </GameButton>
        </GameCard>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Suspense fallback={null}>
        <AuthStatusBanner />
      </Suspense>

      {/* Hero Card de Personagem RPG */}
      <GameCard color="amber" className="relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-24 h-24 rounded-3xl border-4 border-white shadow-md object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-amber-400 border-4 border-white flex items-center justify-center text-4xl shadow-md">
                🐐
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {profile.fullName}
                </h1>
                <span className="bg-amber-200 text-amber-900 border border-amber-400 text-xs font-black px-2.5 py-0.5 rounded-xl uppercase tracking-wider">
                  {profile.levelInfo.tierName}
                </span>
              </div>
              <p className="text-xs font-bold text-amber-800/80 mt-1">
                {profile.clubName} • Atleta Verificado Strava
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/90 p-4 rounded-2xl border-2 border-amber-200 shrink-0">
            <div>
              <div className="text-2xs font-black text-slate-400 uppercase">Nível Atual</div>
              <div className="text-3xl font-black text-amber-600 font-mono">
                Lvl {profile.levelInfo.level}
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <div className="text-2xs font-black text-slate-400 uppercase">XP Acumulado</div>
              <div className="text-xl font-black text-slate-900 font-mono">
                {profile.totalXp.toLocaleString("pt-BR")} XP
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Progresso XP estilo Duolingo */}
        <div className="mt-6 pt-6 border-t border-amber-200/80 space-y-1.5">
          <div className="flex justify-between text-xs font-black text-amber-950">
            <span>Progresso para Nível {profile.levelInfo.level + 1}</span>
            <span className="font-mono">{profile.levelInfo.progressPercent}%</span>
          </div>
          <div className="w-full bg-white rounded-full h-4 p-0.5 border border-amber-300 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-700 shadow-inner"
              style={{ width: `${profile.levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </GameCard>

      {/* Estatísticas do Personagem */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GameCard color="white" className="p-4 text-center">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-2xs font-black text-slate-400 uppercase">Distância Total</div>
          <div className="text-xl font-black text-slate-900 font-mono">
            {profile.seasonStats.totalDistanceKm} km
          </div>
        </GameCard>
        <GameCard color="white" className="p-4 text-center">
          <div className="text-2xl mb-1">⛰️</div>
          <div className="text-2xs font-black text-slate-400 uppercase">Altimetria</div>
          <div className="text-xl font-black text-slate-900 font-mono">
            {profile.seasonStats.totalElevationMeters} m
          </div>
        </GameCard>
        <GameCard color="white" className="p-4 text-center">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-2xs font-black text-slate-400 uppercase">Maior Pedal</div>
          <div className="text-xl font-black text-slate-900 font-mono">
            {profile.seasonStats.longestRideKm} km
          </div>
        </GameCard>
        <GameCard color="white" className="p-4 text-center">
          <div className="text-2xl mb-1">⏱️</div>
          <div className="text-2xs font-black text-slate-400 uppercase">Tempo em Giro</div>
          <div className="text-xl font-black text-slate-900 font-mono">
            {Math.round(profile.seasonStats.totalMovingTimeSeconds / 3600)} h
          </div>
        </GameCard>
      </div>

      {/* Coleção de Badges e Conquistas */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
          <span>🏅</span> Conquistas Desbloqueadas ({profile.badges.unlocked.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile.badges.unlocked.map((b) => (
            <GameCard key={b.code} color="emerald" className="p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white border-2 border-emerald-300 flex items-center justify-center text-3xl shadow-sm shrink-0">
                {b.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 text-sm truncate">{b.title}</h3>
                  <span className="text-2xs font-black text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full font-mono">
                    +{b.xpBonus} XP
                  </span>
                </div>
                <p className="text-xs font-semibold text-emerald-900/80 mt-0.5 leading-tight">
                  {b.description}
                </p>
              </div>
            </GameCard>
          ))}

          {profile.badges.locked.map((b) => (
            <GameCard key={b.code} color="white" className="p-4 flex items-center gap-4 opacity-60">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-2xl text-slate-400 shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-500 text-sm truncate">{b.title}</h3>
                  <span className="text-2xs font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                    +{b.xpBonus} XP
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-400 mt-0.5 leading-tight">
                  {b.isSecret ? "Conquista secreta! Pedale para descobrir." : b.description}
                </p>
              </div>
            </GameCard>
          ))}
        </div>
      </div>

      {/* Opções de Conta & Desconexão */}
      <GameCard color="white" className="border-rose-200 bg-rose-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">
            Gerenciamento da Conta
          </h3>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Desconecte sua conta do Strava e remova suas informações quando desejar.
          </p>
        </div>
        <form action="/api/auth/disconnect" method="POST">
          <input type="hidden" name="athleteId" value={profile.athleteId} />
          <GameButton variant="danger" size="sm" type="submit">
            <LogOut className="w-4 h-4" />
            Desconectar
          </GameButton>
        </form>
      </GameCard>
    </div>
  );
}
