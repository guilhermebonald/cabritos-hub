import { getRealWeeklyRankings } from "@/lib/real-data-provider";
import { GameCard } from "@/components/game-ui";
import { BillyMascot } from "@/components/billy-mascot";
import { Zap, Mountain, Flame, Trophy, Award, Crown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RankingPage() {
  const rankings = await getRealWeeklyRankings();
  const distance = rankings.distancePodium;
  const mountain = rankings.mountainPodium;
  const consistency = rankings.consistencyPodium;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Banner Ranking */}
      <GameCard color="amber" className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <BillyMascot mood="trophy" size="lg" />
          <div className="space-y-1">
            <span className="text-2xs font-black uppercase tracking-wider text-amber-800 bg-amber-200 px-2.5 py-0.5 rounded-full">
              Pódios Oficiais
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Rankings do Pelotão
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-900/80 max-w-md">
              Destaque para os atletas que mais acumularam quilômetros, dominaram as montanhas e mantiveram a consistência!
            </p>
          </div>
        </div>
      </GameCard>

      {/* Pódio Escalonado 3D Visual (Rei da Distância) */}
      <GameCard color="white" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-amber-600">
            <Zap className="w-5 h-5 fill-amber-500" />
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              Rei da Distância (Quilometragem)
            </h2>
          </div>
        </div>

        {/* Pódio 3D dos Top 3 */}
        {distance.length > 0 ? (
          <div className="pt-8 pb-4">
            <div className="flex items-end justify-center gap-2 sm:gap-4 max-w-md mx-auto">
              {/* 2º Lugar */}
              {distance[1] && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-xl mb-2 shadow-sm font-black text-slate-700">
                    🥈
                  </div>
                  <span className="text-xs font-black text-slate-800 text-center truncate w-full">
                    {distance[1].athleteName}
                  </span>
                  <span className="text-2xs font-bold text-slate-500 font-mono">
                    {distance[1].totalDistanceKm} km
                  </span>
                  <div className="w-full bg-slate-200 border-2 border-slate-300 border-b-4 border-b-slate-400 rounded-t-2xl h-24 flex items-center justify-center font-black text-xl text-slate-600 mt-2">
                    2
                  </div>
                </div>
              )}

              {/* 1º Lugar */}
              {distance[0] && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-400 border-2 border-amber-500 flex items-center justify-center text-2xl mb-2 shadow-md font-black text-slate-900 animate-bounce">
                    🥇
                  </div>
                  <span className="text-xs font-black text-slate-900 text-center truncate w-full">
                    {distance[0].athleteName}
                  </span>
                  <span className="text-2xs font-extrabold text-amber-600 font-mono">
                    {distance[0].totalDistanceKm} km
                  </span>
                  <div className="w-full bg-amber-300 border-2 border-amber-400 border-b-4 border-b-amber-500 rounded-t-2xl h-36 flex items-center justify-center font-black text-3xl text-amber-900 mt-2 shadow-sm">
                    1
                  </div>
                </div>
              )}

              {/* 3º Lugar */}
              {distance[2] && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-orange-200 border-2 border-orange-300 flex items-center justify-center text-xl mb-2 shadow-sm font-black text-orange-800">
                    🥉
                  </div>
                  <span className="text-xs font-black text-slate-800 text-center truncate w-full">
                    {distance[2].athleteName}
                  </span>
                  <span className="text-2xs font-bold text-slate-500 font-mono">
                    {distance[2].totalDistanceKm} km
                  </span>
                  <div className="w-full bg-orange-200 border-2 border-orange-300 border-b-4 border-b-orange-400 rounded-t-2xl h-16 flex items-center justify-center font-black text-xl text-orange-800 mt-2">
                    3
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs font-bold text-slate-400 text-center py-6">
            Nenhum pedal registrado nesta semana.
          </p>
        )}
      </GameCard>

      {/* Grid: Rei da Montanha & Mais Consistente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Rei da Montanha */}
        <GameCard color="emerald" className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-sm uppercase">
            <Mountain className="w-5 h-5" />
            Rei da Montanha (Altimetria)
          </div>
          <div className="space-y-2">
            {mountain.length > 0 ? (
              mountain.slice(0, 5).map((pod, i) => (
                <div
                  key={pod.athleteId}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white border border-emerald-200"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                      {i + 1}º
                    </span>
                    <span className="text-xs font-bold text-slate-900">{pod.athleteName}</span>
                  </div>
                  <span className="font-mono font-black text-xs text-emerald-700">
                    {pod.totalElevationMeters} m
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 font-bold">Sem dados na semana.</p>
            )}
          </div>
        </GameCard>

        {/* Mais Consistente */}
        <GameCard color="orange" className="space-y-4">
          <div className="flex items-center gap-2 text-orange-800 font-black text-sm uppercase">
            <Flame className="w-5 h-5" />
            Mais Consistente (Dias Ativos)
          </div>
          <div className="space-y-2">
            {consistency.length > 0 ? (
              consistency.slice(0, 5).map((pod, i) => (
                <div
                  key={pod.athleteId}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white border border-orange-200"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-xs font-black">
                      {i + 1}º
                    </span>
                    <span className="text-xs font-bold text-slate-900">{pod.athleteName}</span>
                  </div>
                  <span className="font-mono font-black text-xs text-orange-700">
                    {pod.distinctDays} dias
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 font-bold">Sem dados na semana.</p>
            )}
          </div>
        </GameCard>
      </div>

      {/* Prêmios Divertidos da Galera */}
      <GameCard color="blue" className="space-y-4">
        <h3 className="text-sm font-black text-blue-950 uppercase tracking-wide flex items-center gap-2">
          <span>🎭</span> Prêmios & Brincadeiras da Semana
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-2xl border border-blue-200 text-center space-y-1">
            <div className="text-2xl">🚜</div>
            <div className="text-xs font-black text-slate-900">Trator do Asfalto</div>
            <div className="text-2xs font-bold text-blue-700">Maior Média de Potência</div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-blue-200 text-center space-y-1">
            <div className="text-2xl">🚀</div>
            <div className="text-xs font-black text-slate-900">Foguete da Reta</div>
            <div className="text-2xs font-bold text-blue-700">Maior Velocidade Máxima</div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-blue-200 text-center space-y-1">
            <div className="text-2xl">🦇</div>
            <div className="text-xs font-black text-slate-900">Vampiro Noturno</div>
            <div className="text-2xs font-bold text-blue-700">Pedal Mais Tarde</div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-blue-200 text-center space-y-1">
            <div className="text-2xl">☕</div>
            <div className="text-xs font-black text-slate-900">Ciclista Café</div>
            <div className="text-2xs font-bold text-blue-700">Mais Paradas Registradas</div>
          </div>
        </div>
      </GameCard>
    </div>
  );
}
