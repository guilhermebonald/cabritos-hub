"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Flag, Trophy, User } from "lucide-react";
import { CabritosLogo } from "@/components/cabritos-logo";

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Início", icon: Home },
    { href: "/desafios", label: "Desafios", icon: Compass },
    { href: "/corrida", label: "Corrida", icon: Flag },
    { href: "/ranking", label: "Ranking", icon: Trophy },
    { href: "/perfil", label: "Perfil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t-2 border-slate-200 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] px-4 sm:hidden">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-transform active:scale-95 ${
                isActive
                  ? "text-amber-600 font-black scale-105"
                  : "text-slate-400 hover:text-slate-600 font-bold"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? "bg-amber-100 text-amber-600" : "bg-transparent"
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function DesktopHeader() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Início", icon: Home },
    { href: "/desafios", label: "Desafios", icon: Compass },
    { href: "/corrida", label: "Corrida", icon: Flag },
    { href: "/ranking", label: "Ranking", icon: Trophy },
    { href: "/perfil", label: "Perfil", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <CabritosLogo size="md" className="group-hover:scale-105 transition-transform" />
          <div>
            <div className="font-black text-xl tracking-tight text-slate-900 leading-none">
              CABRITOS
            </div>
            <div className="text-2xs font-extrabold text-amber-600 tracking-widest uppercase mt-0.5">
              Race Team Hub
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-amber-100 text-amber-900 border-2 border-amber-300 border-b-4 border-b-amber-400 translate-y-0.5"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-2 border-transparent"
                }`}
              >
                <Icon className="w-4 h-4 stroke-[2.5]" />
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <a
          href="/api/auth/strava"
          className="bg-orange-500 hover:bg-orange-400 text-white font-black text-xs px-5 py-3 rounded-2xl border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          <span>Conectar Strava</span>
        </a>
      </div>
    </header>
  );
}
