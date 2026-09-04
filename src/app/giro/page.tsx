import { realGiroBulletin } from "@/lib/real-data-provider";
import {
  Trophy,
  Mountain,
  Zap,
  Flame,
  TrendingUp,
  Calendar,
  Moon,
  Coffee,
  Share2,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

export default function GiroPage() {
  const bulletin = realGiroBulletin;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar ao Hub
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={`/api/og?type=podium&athlete=${encodeURIComponent(
              bulletin.reiDistancia.first?.athleteName || "Guilherme Bonald"
            )}&title=Rei%20da%20Dist%C3%A2ncia&metric=${bulletin.totalDistanceKm}%20km&format=stories&tier=Lenda`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-950" />
            Gerar Card Stories
          </a>
          <a
            href={`/api/og?type=podium&athlete=${encodeURIComponent(
              bulletin.reiDistancia.first?.athleteName || "Guilherme Bonald"
            )}&title=Rei%20da%20Dist%C3%A2ncia&metric=${bulletin.totalDistanceKm}%20km&format=feed&tier=Lenda`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Card Feed / Zap
          </a>
        </div>
      </div>

      {/* Headline & Edition Banner */}
      <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/20 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            <Calendar className="w-3.5 h-3.5" />
            Giro da Semana • Edição #{bulletin.weekNumber} / {bulletin.year}
          </div>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
            ✓ Publicado
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight max-w-3xl leading-snug">
          {bulletin.summaryHeadline}
        </h1>

        {bulletin.editorialNotes && (
          <p className="mt-4 text-base text-slate-300 max-w-2xl leading-relaxed border-l-2 border-amber-500 pl-4 py-1 italic bg-slate-900/40 rounded-r-lg">
            &ldquo;{bulletin.editorialNotes}&rdquo;
          </p>
        )}

        {/* Total Club Metrics */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div>
            <div className="text-xs text-slate-400 font-medium">Distância Total</div>
            <div className="text-2xl font-black text-amber-400 mt-0.5">
              {bulletin.totalDistanceKm} <span className="text-sm font-normal text-slate-400">km</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Altimetria Coletiva</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">
              {bulletin.totalElevationMeters.toLocaleString("pt-BR")}{" "}
              <span className="text-sm font-normal text-slate-400">m</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Pedais Realizados</div>
            <div className="text-2xl font-black text-blue-400 mt-0.5">
              {bulletin.totalActivities}
            </div>
          </div>
        </div>
      </div>

      {/* Pódios da Semana */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Pódios da Semana
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rei da Distância */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 text-amber-400">
              <Zap className="w-5 h-5" />
              <h3 className="font-bold text-white">Rei da Distância</h3>
            </div>
            <div className="space-y-3">
              {bulletin.reiDistancia.podium.map((athlete, i) => (
                <div key={athlete.athleteId} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 w-5">{i + 1}º</span>
                    <span className="text-slate-200 font-medium">{athlete.athleteName}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-100">{athlete.totalDistanceKm} km</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rei da Montanha */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Mountain className="w-5 h-5" />
              <h3 className="font-bold text-white">Rei da Montanha</h3>
            </div>
            <div className="space-y-3">
              {bulletin.reiMontanha.podium.map((athlete, i) => (
                <div key={athlete.athleteId} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 w-5">{i + 1}º</span>
                    <span className="text-slate-200 font-medium">{athlete.athleteName}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-100">{athlete.totalElevationMeters} m</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mais Consistente */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 text-orange-400">
              <Flame className="w-5 h-5" />
              <h3 className="font-bold text-white">Mais Consistente</h3>
            </div>
            <div className="space-y-3">
              {bulletin.maisConsistente.podium.map((athlete, i) => (
                <div key={athlete.athleteId} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-orange-400 w-5">{i + 1}º</span>
                    <span className="text-slate-200 font-medium">{athlete.athleteName}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-100">{athlete.distinctDays} dias</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Maior Evolução & Prêmios Descontraídos */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🎭 Zoeira & Destaques de Honra
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Maior Evolução */}
          {bulletin.maiorEvolucao && (
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-500/30 p-5 rounded-2xl flex flex-col justify-between shadow-lg shadow-rose-500/5">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">📈</span>
                  <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                    +{bulletin.maiorEvolucao.growthPercentage}%
                  </span>
                </div>
                <div className="text-xs text-slate-400">Maior Evolução</div>
                <h3 className="font-bold text-white text-lg mt-0.5">
                  {bulletin.maiorEvolucao.athleteName}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800">
                Saltou de {bulletin.maiorEvolucao.previousKm} km para {bulletin.maiorEvolucao.currentKm} km na semana!
              </p>
            </div>
          )}

          {/* Vampiro */}
          {bulletin.humorousAwards.vampiro && (
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-500/30 p-5 rounded-2xl flex flex-col justify-between shadow-lg shadow-purple-500/5">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{bulletin.humorousAwards.vampiro.icon}</span>
                  <Moon className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xs text-slate-400">{bulletin.humorousAwards.vampiro.title}</div>
                <h3 className="font-bold text-white text-lg mt-0.5">
                  {bulletin.humorousAwards.vampiro.athleteName}
                </h3>
              </div>
              <p className="text-xs text-purple-300 mt-3 pt-3 border-t border-slate-800">
                {bulletin.humorousAwards.vampiro.metricDescription}
              </p>
            </div>
          )}

          {/* Trator */}
          {bulletin.humorousAwards.trator && (
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 p-5 rounded-2xl flex flex-col justify-between shadow-lg shadow-amber-500/5">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{bulletin.humorousAwards.trator.icon}</span>
                  <Mountain className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xs text-slate-400">{bulletin.humorousAwards.trator.title}</div>
                <h3 className="font-bold text-white text-lg mt-0.5">
                  {bulletin.humorousAwards.trator.athleteName}
                </h3>
              </div>
              <p className="text-xs text-amber-300 mt-3 pt-3 border-t border-slate-800">
                {bulletin.humorousAwards.trator.metricDescription}
              </p>
            </div>
          )}

          {/* Foguete ou Café */}
          {bulletin.humorousAwards.foguete ? (
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 p-5 rounded-2xl flex flex-col justify-between shadow-lg shadow-cyan-500/5">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{bulletin.humorousAwards.foguete.icon}</span>
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xs text-slate-400">{bulletin.humorousAwards.foguete.title}</div>
                <h3 className="font-bold text-white text-lg mt-0.5">
                  {bulletin.humorousAwards.foguete.athleteName}
                </h3>
              </div>
              <p className="text-xs text-cyan-300 mt-3 pt-3 border-t border-slate-800">
                {bulletin.humorousAwards.foguete.metricDescription}
              </p>
            </div>
          ) : bulletin.humorousAwards.cafe ? (
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-yellow-500/30 p-5 rounded-2xl flex flex-col justify-between shadow-lg shadow-yellow-500/5">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{bulletin.humorousAwards.cafe.icon}</span>
                  <Coffee className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-xs text-slate-400">{bulletin.humorousAwards.cafe.title}</div>
                <h3 className="font-bold text-white text-lg mt-0.5">
                  {bulletin.humorousAwards.cafe.athleteName}
                </h3>
              </div>
              <p className="text-xs text-yellow-300 mt-3 pt-3 border-t border-slate-800">
                {bulletin.humorousAwards.cafe.metricDescription}
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
