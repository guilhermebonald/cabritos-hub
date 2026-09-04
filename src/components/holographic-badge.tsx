"use client";

import React, { useRef, useState, useEffect } from "react";
import { Lock, Sparkles } from "lucide-react";

interface HolographicBadgeProps {
  icon: string;
  title: string;
  description: string;
  xpBonus: number;
  unlocked: boolean;
  isSecret?: boolean;
}

export function HolographicBadge({
  icon,
  title,
  description,
  xpBonus,
  unlocked,
  isSecret,
}: HolographicBadgeProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 50, y: 50, rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [sparkleActive, setSparkleActive] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!unlocked || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    // Rotação máxima 3D: ±14 graus
    const rx = (0.5 - py) * 28;
    const ry = (px - 0.5) * 28;

    setCoords({
      x: Math.round(px * 100),
      y: Math.round(py * 100),
      rx: Number(rx.toFixed(2)),
      ry: Number(ry.toFixed(2)),
    });
  };

  const handleMouseEnter = () => {
    if (!unlocked) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 50, y: 50, rx: 0, ry: 0 });
  };

  const triggerSparkle = () => {
    if (!unlocked) return;
    setSparkleActive(true);
    setTimeout(() => setSparkleActive(false), 800);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={triggerSparkle}
      style={{
        perspective: "800px",
      }}
      className="relative group cursor-pointer select-none"
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${coords.rx}deg) rotateY(${coords.ry}deg) translateZ(8px)`
            : "rotateX(0deg) rotateY(0deg) translateZ(0px)",
          transition: isHovered ? "transform 0.08s ease-out" : "transform 0.5s ease-out",
        }}
        className={`relative overflow-hidden rounded-3xl p-5 border-2 transition-all duration-300 ${
          unlocked
            ? "bg-gradient-to-br from-emerald-50 via-white to-amber-50/50 border-emerald-300 shadow-md hover:shadow-xl hover:shadow-emerald-500/15"
            : "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed"
        }`}
      >
        {/* Camada Holográfica de Luz Prismática Dinâmica */}
        {unlocked && (
          <div
            style={{
              background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(255,255,255,0.85) 0%, rgba(250,204,21,0.25) 25%, rgba(16,185,129,0.3) 50%, rgba(56,189,248,0.2) 75%, transparent 100%)`,
              opacity: isHovered ? 0.95 : 0,
              mixBlendMode: "overlay",
              transition: "opacity 0.25s ease-out",
            }}
            className="absolute inset-0 pointer-events-none z-10"
          />
        )}

        {/* Efeito Foil Metálico de Linhas Reflexivas */}
        {unlocked && isHovered && (
          <div
            style={{
              backgroundPosition: `${coords.x * 2}% ${coords.y * 2}%`,
            }}
            className="absolute inset-0 pointer-events-none opacity-35 mix-blend-color-dodge bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-300 via-emerald-300 to-sky-400 z-10"
          />
        )}

        {/* Efeito Explosão de Partículas/Faíscas ao Clicar */}
        {sparkleActive && (
          <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center motion-safe:animate-ping">
            <span className="text-3xl">✨</span>
          </div>
        )}

        <div className="relative z-20 flex items-center gap-4">
          {/* Medalhão 3D */}
          <div
            style={{
              transform: isHovered ? "translateZ(18px) scale(1.08)" : "translateZ(0px) scale(1)",
              transition: "transform 0.2s ease-out",
            }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-md border-2 ${
              unlocked
                ? "bg-gradient-to-tr from-amber-400 via-emerald-400 to-amber-200 border-white text-slate-950 ring-2 ring-emerald-300/60"
                : "bg-slate-100 border-slate-300 text-slate-400"
            }`}
          >
            {unlocked ? (
              <span className="drop-shadow-sm filter">{icon}</span>
            ) : (
              <Lock className="w-6 h-6 text-slate-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3
                className={`font-black text-sm truncate ${
                  unlocked ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {title}
              </h3>
              <span
                className={`text-2xs font-mono font-black px-2.5 py-0.5 rounded-full shrink-0 ${
                  unlocked
                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                +{xpBonus} XP
              </span>
            </div>

            <p
              className={`text-xs mt-1 leading-snug font-medium ${
                unlocked ? "text-emerald-950/80" : "text-slate-400"
              }`}
            >
              {unlocked
                ? description
                : isSecret
                ? "Conquista secreta! Pedale com o clube para desvendar."
                : description}
            </p>

            {unlocked && (
              <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Medalha Desbloqueada</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
