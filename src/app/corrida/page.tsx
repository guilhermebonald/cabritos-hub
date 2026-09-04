import { getRealWeeklyRankings, getRealCollectiveData } from "@/lib/real-data-provider";
import { GameCard } from "@/components/game-ui";
import { BillyMascot } from "@/components/billy-mascot";
import { Flag, Trophy, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CorridaPage() {
  const { weeklyRankings, activeWeek } = await getRealCollectiveData();
  const podium = weeklyRankings.distancePodium;

  const maxDistance = podium.length > 0 ? Math.max(...podium.map((p) => p.totalDistanceKm)) : 100;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Banner Principal da Corrida */}
      <GameCard color="orange" className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <BillyMascot mood="sprinting" size="lg" />
          <div className="space-y-1">
            <span className="text-2xs font-black uppercase tracking-wider text-orange-800 bg-orange-200 px-2.5 py-0.5 rounded-full">
              Pista Semanal • Ciclo #{activeWeek.weekNumber}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Circuito dos Cabritos
            </h1>
            <p className="text-xs sm:text-sm font-bold text-orange-900/80 max-w-md">
              A cada quilômetro pedalado no Strava, seu ciclista avança na estrada em direção à linha de chegada!
            </p>
          </div>
        </div>

        <div className="bg-white/80 p-4 rounded-2xl border-2 border-orange-200 text-center shrink-0 w-full sm:w-auto">
          <div className="text-2xs font-black text-slate-400 uppercase">Líder Atual</div>
          <div className="text-xl font-black text-slate-900 font-mono">
            {podium[0] ? `${podium[0].totalDistanceKm} km` : "0 km"}
          </div>
        </div>
      </GameCard>

      {/* Pista de Corrida Estilo Jogo */}
      <GameCard color="white" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <span>🏁</span> Pelotão na Pista
          </h2>
          <span className="text-xs font-black text-slate-400 uppercase font-mono">
            {podium.length} Corredores Ativos
          </span>
        </div>

        <div className="space-y-5">
          {podium.length > 0 ? (
            podium.map((runner, idx) => {
              const progress = (runner.totalDistanceKm / maxDistance) * 100;
              const isLeader = idx === 0;

              return (
                <div key={runner.athleteId} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-black">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black border-b-2 ${
                          isLeader
                            ? "bg-amber-400 border-amber-600 text-slate-950"
                            : idx === 1
                            ? "bg-slate-200 border-slate-400 text-slate-800"
                            : idx === 2
                            ? "bg-orange-200 border-orange-400 text-orange-900"
                            : "bg-slate-100 border-slate-300 text-slate-600"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-sm text-slate-900 font-bold">{runner.athleteName}</span>
                      {isLeader && (
                        <span className="bg-amber-100 text-amber-800 border border-amber-300 text-2xs px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Líder
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-slate-900 font-extrabold text-sm">
                      {runner.totalDistanceKm} km
                    </span>
                  </div>

                  {/* Faixa da pista com demarcações e avatar */}
                  <div className="relative w-full bg-slate-100 h-9 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner flex items-center">
                    {/* Linhas de asfalto tracejadas no centro */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b-2 border-dashed border-slate-200 pointer-events-none" />

                    {/* Barra de progresso vibrante com ciclista animado */}
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-2xl transition-all duration-700 flex items-center justify-end pr-2 shadow-md relative"
                      style={{ width: `${Math.max(6, progress)}%` }}
                    >
                      <div className="w-7 h-7 bg-white rounded-full border-2 border-amber-600 flex items-center justify-center text-sm shadow-sm select-none">
                        🚴
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 space-y-3">
              <div className="text-4xl">🚵‍♂️</div>
              <p className="text-xs font-bold text-slate-400">
                Nenhum membro pedalou nesta semana ainda. Seja o primeiro a acelerar!
              </p>
            </div>
          )}
        </div>
      </GameCard>
    </div>
  );
}
