import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cabritos Hub - Gamificação do Clube de Ciclismo",
  description: "Transformando os pedais do clube Cabritos em um jogo de progressão, rankings e diversão.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🐐</span>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Cabritos Hub
              </span>
            </div>
            <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
              <a href="#corrida" className="hover:text-amber-400 transition">Corrida</a>
              <a href="#rankings" className="hover:text-amber-400 transition">Rankings</a>
              <a href="#desafios" className="hover:text-amber-400 transition">Desafios</a>
              <a href="#giro" className="hover:text-amber-400 transition">Giro da Semana</a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
