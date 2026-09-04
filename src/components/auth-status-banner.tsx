"use client";

import { useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, XCircle, ExternalLink, X } from "lucide-react";
import { useState } from "react";

export function AuthStatusBanner() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("auth_error");
  const sync = searchParams.get("sync");
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || (!authError && !sync)) {
    return null;
  }

  if (sync === "success") {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-300 border-b-4 border-b-emerald-400 text-emerald-950 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm animate-in fade-in duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-wide text-emerald-950">
              Conta Conectada com Sucesso!
            </h4>
            <p className="text-xs font-semibold text-emerald-900/85 mt-0.5">
              Suas atividades foram sincronizadas. O pelotão Cabritos te dá as boas-vindas!
            </p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-emerald-800 hover:text-emerald-950 p-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  const isNotMember = authError === "not_a_club_member";

  return (
    <div className="bg-rose-50 border-2 border-rose-300 border-b-4 border-b-rose-400 text-rose-950 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-wide text-rose-950">
            {isNotMember ? "Você ainda não faz parte do Clube Cabritos" : "Erro ao Conectar Strava"}
          </h4>
          <p className="text-xs font-semibold text-rose-900/85 mt-0.5">
            {isNotMember ? (
              <>
                Acesso exclusivo para atletas do <strong>CABRITOS RACE TEAM</strong> no Strava. Entre no clube oficial para sincronizar seus pedais.
              </>
            ) : (
              "Não foi possível autorizar a conta. Tente novamente em instantes."
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {isNotMember && (
          <a
            href="https://www.strava.com/clubs/1182567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black px-3.5 py-2 rounded-xl uppercase tracking-wider transition-all shadow-sm"
          >
            <span>Entrar no Clube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="text-rose-800 hover:text-rose-950 p-1.5 rounded-lg hover:bg-rose-100 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
