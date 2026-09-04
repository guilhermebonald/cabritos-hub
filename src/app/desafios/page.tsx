import { GameCard, GameButton } from "@/components/game-ui";
import { BillyMascot } from "@/components/billy-mascot";
import { Compass, CheckCircle, Clock, Award, Mountain, Zap } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function DesafiosPage() {
  const weeklyQuests = [
    {
      id: "q1",
      title: "Escalador das Cabras",
      description: "Acumule pelo menos 1.000 metros de altimetria nos treinos da semana.",
      xpReward: 450,
      difficulty: "Médio",
      progressText: "820m / 1.000m",
      progressPercent: 82,
      category: "Montanha",
      icon: "⛰️",
      color: "emerald" as const,
    },
    {
      id: "q2",
      title: "Centurião da Estrada",
      description: "Complete um único pedal com distância superior a 100 km.",
      xpReward: 600,
      difficulty: "Difícil",
      progressText: "0 / 1 pedal de 100km",
      progressPercent: 0,
      category: "Distância",
      icon: "⚡",
      color: "amber" as const,
    },
    {
      id: "q3",
      title: "Fidelidade ao Pelotão",
      description: "Pedale em pelo menos 4 dias diferentes durante esta semana.",
      xpReward: 350,
      difficulty: "Fácil",
      progressText: "3 / 4 dias",
      progressPercent: 75,
      category: "Consistência",
      icon: "🔥",
      color: "orange" as const,
    },
    {
      id: "q4",
      title: "Vampiro do Asfalto",
      description: "Registre uma atividade com início após as 19:00 ou antes das 06:00.",
      xpReward: 250,
      difficulty: "Especial",
      progressText: "1 / 1 concluído!",
      progressPercent: 100,
      category: "Especial",
      icon: "🦇",
      color: "blue" as const,
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header com Mascote Billy */}
      <GameCard color="amber" className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <BillyMascot mood="climbing" size="lg" />
          <div className="space-y-1">
            <span className="text-2xs font-black uppercase tracking-wider text-amber-800 bg-amber-200 px-2.5 py-0.5 rounded-full">
              Missões da Semana
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Quests do Pelotão
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-900/80 max-w-md">
              Complete missões para acumular XP bônus e subir de nível mais rápido que seus amigos!
            </p>
          </div>
        </div>

        <div className="bg-white/80 p-4 rounded-2xl border-2 border-amber-200 text-center shrink-0 w-full sm:w-auto">
          <div className="text-2xs font-black text-slate-400 uppercase">Tempo Restante</div>
          <div className="text-xl font-black text-slate-900 font-mono">3 dias 08h</div>
        </div>
      </GameCard>

      {/* Lista de Missões Estilo Game */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
          <span>⚔️</span> Missões Ativas
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {weeklyQuests.map((quest) => (
            <GameCard key={quest.id} color={quest.color} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-3xl shadow-sm shrink-0">
                    {quest.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-900 text-base">{quest.title}</h3>
                      <span className="text-2xs font-black bg-white/80 border border-slate-200 px-2 py-0.5 rounded-full text-slate-700 uppercase">
                        {quest.difficulty}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      {quest.description}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200/60">
                  <div className="text-xs font-black font-mono text-amber-600 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-xl">
                    +{quest.xpReward} XP
                  </div>
                  <span className="text-2xs font-black text-slate-400 uppercase">
                    {quest.progressPercent === 100 ? "Concluído" : "Em andamento"}
                  </span>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="mt-4 pt-4 border-t border-slate-200/60 space-y-1.5">
                <div className="flex justify-between text-xs font-black text-slate-700">
                  <span>Progresso</span>
                  <span className="font-mono">{quest.progressText} ({quest.progressPercent}%)</span>
                </div>
                <div className="w-full bg-white rounded-full h-3.5 p-0.5 border border-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      quest.progressPercent === 100
                        ? "bg-emerald-500"
                        : "bg-gradient-to-r from-amber-400 to-orange-500"
                    }`}
                    style={{ width: `${quest.progressPercent}%` }}
                  />
                </div>
              </div>
            </GameCard>
          ))}
        </div>
      </div>
    </div>
  );
}
