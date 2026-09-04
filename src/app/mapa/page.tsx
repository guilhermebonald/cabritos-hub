import { getRealClubRoutes } from "@/lib/real-data-provider";
import { MapPin, Mountain, Zap, Users, Compass, ChevronLeft, Share2, Layers } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function MapaPage() {
  const mapData = getRealClubRoutes();

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
        <button
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          Compartilhar Mapa
        </button>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 border border-emerald-500/20 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            <Compass className="w-3.5 h-3.5" />
            Mapa Coletivo de Rotas • Temporada 2026
          </div>
          <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {mapData.totalGpsRoutes} rotas mapeadas
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight max-w-3xl leading-snug">
          Onde o Cabritos Cycling Club pedalou junto.
        </h1>
        <p className="mt-3 text-sm text-slate-400 max-w-2xl">
          Trajetos GPS agregados e decodificados em tempo real. Cada pedal outdoor adiciona uma nova linha à história visual do clube.
        </p>

        {/* Collective Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div>
            <div className="text-xs text-slate-400 font-medium">Distância Mapeada</div>
            <div className="text-2xl font-black text-amber-400 mt-0.5">
              {mapData.totalDistanceKm} <span className="text-sm font-normal text-slate-400">km</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Altimetria Escalada</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">
              {mapData.totalElevationMeters.toLocaleString("pt-BR")}{" "}
              <span className="text-sm font-normal text-slate-400">m</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Rotas Outdoor</div>
            <div className="text-2xl font-black text-blue-400 mt-0.5">
              {mapData.totalGpsRoutes}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Pontos GPS</div>
            <div className="text-2xl font-black text-purple-400 mt-0.5">
              {mapData.allPoints.length}
            </div>
          </div>
        </div>
      </div>

      {/* Collective Map Graphic Viewport */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Visualização de Rotas e Heatmap
          </h2>
          {mapData.bounds && (
            <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
              Centro: {mapData.bounds.centerLat}°, {mapData.bounds.centerLng}°
            </span>
          )}
        </div>

        {/* Map Simulation Container */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl min-h-[420px] flex flex-col justify-between">
          {/* Background grid simulation */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:2rem_2rem]" />

          {/* Graphical SVG representation of aggregate routes */}
          <div className="relative z-10 w-full h-64 flex items-center justify-center">
            <svg
              className="w-full h-full max-w-xl text-emerald-500 filter drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              viewBox="0 0 400 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 20,150 Q 80,40 140,110 T 260,70 T 380,130"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="opacity-90"
              />
              <path
                d="M 30,160 Q 90,70 150,130 T 270,90 T 370,120"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="opacity-75"
              />
              <path
                d="M 50,140 Q 110,20 180,90 T 300,50 T 350,150"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeLinecap="round"
                className="opacity-80"
              />
              {/* Waypoints */}
              <circle cx="140" cy="110" r="5" fill="#10b981" />
              <circle cx="260" cy="70" r="5" fill="#f59e0b" />
              <circle cx="380" cy="130" r="5" fill="#38bdf8" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900">
            <div className="flex items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-3 h-1 rounded-full bg-emerald-500" />
                Iúna / ES
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-1 rounded-full bg-amber-500" />
                Serra do Caparaó
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-1 rounded-full bg-sky-400" />
                Pico da Bandeira & Região
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Projeção WGS84 • Rotas Reais de Guilherme Bonald (Strava)
            </div>
          </div>
        </div>
      </section>

      {/* Feed de Rotas do Clube */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-400" />
          Rotas Recentes Mapeadas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mapData.routes.map((route) => (
            <div
              key={route.activityId}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    Outdoor GPS
                  </span>
                  <span className="text-xs text-slate-400">{route.athleteName}</span>
                </div>
                <h3 className="font-bold text-white text-base">{route.activityName}</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500">Distância:</span>
                  <div className="font-mono font-bold text-amber-400 text-sm mt-0.5">
                    {route.distanceKm} km
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Altimetria:</span>
                  <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                    {route.elevationMeters} m
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
