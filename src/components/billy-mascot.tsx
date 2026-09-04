import React from "react";

export type BillyMood = "cheering" | "climbing" | "trophy" | "vampire" | "resting" | "sprinting";

interface BillyProps {
  mood?: BillyMood;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function BillyMascot({ mood = "cheering", size = "md", className = "" }: BillyProps) {
  const sizeMap = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
    xl: "w-44 h-44",
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md transition-transform hover:scale-105"
      >
        {/* Sombra base */}
        <ellipse cx="60" cy="112" rx="42" ry="7" fill="#E2E8F0" />

        {/* Chifres curvados estilizados */}
        <path
          d="M38 42C32 24 40 10 50 14C45 22 44 32 46 42"
          fill="#D97706"
          stroke="#78350F"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M82 42C88 24 80 10 70 14C75 22 76 32 74 42"
          fill="#D97706"
          stroke="#78350F"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Orelhas */}
        <path
          d="M26 50C16 52 14 62 26 64C30 60 32 54 36 52"
          fill="#FDE68A"
          stroke="#78350F"
          strokeWidth="3"
        />
        <path
          d="M94 50C104 52 106 62 94 64C90 60 88 54 84 52"
          fill="#FDE68A"
          stroke="#78350F"
          strokeWidth="3"
        />

        {/* Cabeça do Cabrito */}
        <ellipse
          cx="60"
          cy="66"
          rx="32"
          ry="30"
          fill="#FEF3C7"
          stroke="#78350F"
          strokeWidth="4"
        />

        {/* Focinho */}
        <ellipse
          cx="60"
          cy="78"
          rx="18"
          ry="14"
          fill="#FDE68A"
          stroke="#78350F"
          strokeWidth="3"
        />
        {/* Narinas */}
        <ellipse cx="54" cy="76" rx="2.5" ry="3" fill="#78350F" />
        <ellipse cx="66" cy="76" rx="2.5" ry="3" fill="#78350F" />
        {/* Boca / Sorriso */}
        <path
          d="M52 83C56 87 64 87 68 83"
          stroke="#78350F"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Cavanhaque de Cabrito */}
        <path
          d="M57 92L60 99L63 92Z"
          fill="#F59E0B"
          stroke="#78350F"
          strokeWidth="2"
        />

        {/* Capacete de Ciclismo Aero (Laranja Cabritos) */}
        <path
          d="M32 46C32 28 44 22 60 22C76 22 88 28 88 46C76 43 44 43 32 46Z"
          fill="#EA580C"
          stroke="#7C2D12"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Entradas de Ar do Capacete */}
        <path d="M46 29C49 34 51 38 52 41" stroke="#FED7AA" strokeWidth="3" strokeLinecap="round" />
        <path d="M60 27C60 33 60 37 60 41" stroke="#FED7AA" strokeWidth="3" strokeLinecap="round" />
        <path d="M74 29C71 34 69 38 68 41" stroke="#FED7AA" strokeWidth="3" strokeLinecap="round" />

        {/* Óculos de Ciclismo Esportivos Espelhados */}
        <path
          d="M36 52C48 50 56 50 60 54C64 50 72 50 84 52C86 63 76 66 62 65C58 65 48 66 36 52Z"
          fill="url(#lens-gradient)"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Reflexo dos óculos */}
        <path
          d="M42 54L54 54"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />
        <path
          d="M66 54L78 54"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        {/* Detalhe de Expressão / Humor por Mood */}
        {mood === "trophy" && (
          <g transform="translate(76, 70) rotate(15)">
            <rect x="0" y="8" width="24" height="18" rx="4" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />
            <path d="M-4 12C-8 12 -8 18 -4 20" stroke="#F59E0B" strokeWidth="3" fill="none" />
            <path d="M28 12C32 12 32 18 28 20" stroke="#F59E0B" strokeWidth="3" fill="none" />
            <polygon points="12,0 15,6 22,7 17,12 18,18 12,15 6,18 7,12 2,7 9,6" fill="#FDE047" />
          </g>
        )}

        {mood === "vampire" && (
          <path
            d="M30 75C20 90 20 105 32 110C42 100 40 85 36 78"
            fill="#7F1D1D"
            stroke="#450A0A"
            strokeWidth="2"
          />
        )}

        <defs>
          <linearGradient id="lens-gradient" x1="36" y1="52" x2="84" y2="65" gradientUnits="userSpaceOnUse">
            <stop stopColor="#06B6D4" />
            <stop offset="0.5" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
