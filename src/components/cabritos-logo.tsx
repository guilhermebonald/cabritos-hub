"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

interface CabritosLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  interactive?: boolean;
}

export function CabritosLogo({
  size = "md",
  className = "",
  interactive = true,
}: CabritosLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ rx: 0, ry: 0, px: 50, py: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const sizeStyles = {
    sm: "w-11 h-11",
    md: "w-16 h-16",
    lg: "w-28 h-28",
    xl: "w-40 h-40",
  }[size];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    // 3D Tilt calculation (±16 degrees)
    const rx = (0.5 - py) * 32;
    const ry = (px - 0.5) * 32;

    setCoords({
      rx: Number(rx.toFixed(2)),
      ry: Number(ry.toFixed(2)),
      px: Math.round(px * 100),
      py: Math.round(py * 100),
    });
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    setCoords({ rx: 0, ry: 0, px: 50, py: 50 });
  };

  const handleMouseDown = () => {
    if (!interactive) return;
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer [perspective:700px] ${sizeStyles} ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Sombra 3D no chão estilo Duolingo */}
      <div
        className="absolute -bottom-1.5 inset-x-2 h-3 bg-amber-950/20 rounded-full blur-[3px] transition-all duration-200 pointer-events-none"
        style={{
          transform: isPressed
            ? "scale(0.85) translateY(-2px)"
            : isHovered
            ? "scale(1.1) translateY(4px) opacity(0.35)"
            : "scale(0.95) translateY(0px) opacity(0.2)",
        }}
      />

      {/* Camada Extrudada 3D Duolingo (Bevel Inferior) */}
      <div
        className="relative w-full h-full transition-transform duration-150 ease-out will-change-transform"
        style={{
          transform: isPressed
            ? "translateY(4px) scale(0.95)"
            : isHovered
            ? `rotateX(${coords.rx}deg) rotateY(${coords.ry}deg) translateY(-4px) scale(1.05)`
            : "rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Camada de extrusão 3D espessa (Duolingo thick bevel drop shadow) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            transform: "translateY(5px) translateZ(-4px)",
            filter: "brightness(0.3) saturate(2) drop-shadow(0 4px 0 #78350f)",
            opacity: isPressed ? 0.3 : 0.85,
          }}
        >
          <Image
            src="/logo.png"
            alt=""
            width={200}
            height={200}
            priority
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>

        {/* Camada Principal da Logo (Frente translúcida/opaca em PNG com canal Alpha) */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-all duration-200"
          style={{
            transform: "translateZ(10px)",
            filter: isHovered
              ? "drop-shadow(0 8px 12px rgba(245, 158, 11, 0.45)) drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
              : "drop-shadow(0 4px 6px rgba(0,0,0,0.12))",
          }}
        >
          <Image
            src="/logo.png"
            alt="Cabritos Race Team"
            width={200}
            height={200}
            priority
            className="w-full h-full object-contain pointer-events-none transition-transform duration-200"
          />

          {/* Brilho Especular Superior 3D Duolingo */}
          <div
            className={`absolute inset-0 pointer-events-none rounded-full transition-opacity duration-300 ${
              isHovered ? "opacity-90" : "opacity-0"
            }`}
            style={{
              background: `radial-gradient(circle at ${coords.px}% ${coords.py}%, rgba(255,255,255,0.7) 0%, rgba(251,191,36,0.3) 40%, transparent 65%)`,
              mixBlendMode: "screen",
            }}
          />
        </div>
      </div>
    </div>
  );
}
