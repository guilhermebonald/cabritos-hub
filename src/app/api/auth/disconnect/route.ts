import { NextRequest, NextResponse } from "next/server";
import { deleteAthleteFromStore } from "@/lib/club-store";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const host = req.headers.get("host") || "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  let athleteIdToDelete: string | null = null;

  // Tenta ler do body JSON ou form data
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (body && body.athleteId) {
        athleteIdToDelete = String(body.athleteId);
      }
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const idFromForm = formData.get("athleteId");
      if (idFromForm) {
        athleteIdToDelete = String(idFromForm);
      }
    }
  } catch (parseErr) {
    // Continua para tentar ler do cookie
  }

  // Fallback: lê do cookie da sessão se não veio explícito
  if (!athleteIdToDelete) {
    const cookieVal = req.cookies.get("cabritos_athlete")?.value;
    if (cookieVal) {
      try {
        const session = JSON.parse(cookieVal);
        if (session && session.id) {
          athleteIdToDelete = String(session.id);
        }
      } catch (cookieErr) {
        // Formato de cookie inválido
      }
    }
  }

  // Remove atleta específico ou limpa o store se nenhum ID específico foi provido
  deleteAthleteFromStore(athleteIdToDelete || undefined);

  // Invalida cache de todas as rotas
  revalidatePath("/", "layout");
  revalidatePath("/perfil");
  revalidatePath("/mapa");
  revalidatePath("/giro");

  const response = NextResponse.redirect(`${baseUrl}/perfil?disconnected=true`, { status: 303 });

  // Limpa o cookie de autenticação/sessão
  response.cookies.delete("cabritos_athlete");

  return response;
}
