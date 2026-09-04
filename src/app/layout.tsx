import type { Metadata } from "next";
import "./globals.css";
import { DesktopHeader, BottomNav } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Cabritos Hub - O Jogo de Ciclismo do Pelotão",
  description: "Transformando os pedais do clube Cabritos em um jogo de progressão, desafios, rankings e conquistas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#FFFDF9] text-slate-800 antialiased selection:bg-amber-300 selection:text-slate-900 pb-20 sm:pb-8">
        <DesktopHeader />
        <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
