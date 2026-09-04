import React from "react";

interface GameCardProps {
  children: React.ReactNode;
  className?: string;
  color?: "white" | "amber" | "emerald" | "blue" | "orange";
}

export function GameCard({ children, className = "", color = "white" }: GameCardProps) {
  const colorStyles = {
    white: "bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 text-slate-800",
    amber: "bg-amber-50 border-2 border-amber-300 border-b-4 border-b-amber-400 text-amber-950",
    emerald: "bg-emerald-50 border-2 border-emerald-300 border-b-4 border-b-emerald-400 text-emerald-950",
    blue: "bg-blue-50 border-2 border-blue-300 border-b-4 border-b-blue-400 text-blue-950",
    orange: "bg-orange-50 border-2 border-orange-300 border-b-4 border-b-orange-400 text-orange-950",
  };

  return (
    <div className={`rounded-3xl p-6 transition-all ${colorStyles[color]} ${className}`}>
      {children}
    </div>
  );
}

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "sm" | "md" | "lg";
}

export function GameButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: GameButtonProps) {
  const variants = {
    primary:
      "bg-amber-400 hover:bg-amber-300 text-slate-950 border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 shadow-amber-500/20",
    secondary:
      "bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 border-b-4 border-b-slate-300 active:border-b-2 active:translate-y-0.5",
    success:
      "bg-emerald-500 hover:bg-emerald-400 text-white border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 shadow-emerald-500/20",
    danger:
      "bg-rose-500 hover:bg-rose-400 text-white border-b-4 border-rose-700 active:border-b-0 active:translate-y-1 shadow-rose-500/20",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs font-black rounded-xl",
    md: "px-5 py-2.5 text-sm font-black rounded-2xl",
    lg: "px-7 py-3.5 text-base font-black rounded-2xl",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 cursor-pointer font-black transition-all uppercase tracking-wide select-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
