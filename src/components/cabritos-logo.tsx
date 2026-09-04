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

  const sizeStyles = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-24 h-24",
    xl: "w-36 h-36",
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
    setCoords({ rx: 0, ry: 0, px: 50, py: 50 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block select-none cursor-pointer [perspective:600px] ${sizeStyles} ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="w-full h-full relative rounded-2xl transition-transform duration-150 ease-out flex items-center justify-center p-1"
        style={{
          transform: isHovered
            ? `rotateX(${coords.rx}deg) rotateY(${coords.ry}deg) translateZ(12px) scale(1.06)`
            : "rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)",
          transformStyle: "preserve-3d",
          filter: isHovered
            ? "drop-shadow(0 14px 18px rgba(245, 158, 11, 0.35)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
            : "drop-shadow(0 6px 10px rgba(0, 0, 0, 0.12))",
        }}
      >
        <Image
          src="/logo.png"
          alt="Cabritos Race Team"
          width={160}
          height={160}
          priority
          className="w-full h-full object-contain pointer-events-none transition-transform duration-200"
          style={{
            transform: isHovered ? "translateZ(20px)" : "translateZ(0px)",
          }}
        />

        {/* Efeito 3D Prismatic Flare / Brilho Holográfico no Hover */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none mix-blend-overlay transition-opacity duration-300 opacity-90"
            style={{
              background: `radial-gradient(circle at ${coords.px}% ${coords.py}%, rgba(255,255,255,0.85) 0%, rgba(251,191,36,0.35) 45%, transparent 70%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
