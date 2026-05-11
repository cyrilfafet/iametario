import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `Tu es l'assistant d'E-Tario, créateur audio professionnel. Tu poses 3 questions au client pour estimer son projet. Après les 3 réponses, tu conclus avec le forfait recommandé et le prix estimé. Forfaits : Edit Simple 50€ (mashup simple, montage court), Création Avancée 80€ (intro personnalisée, medley 3-5 titres), Pack Performance sur mesure (production originale complexe). Options : voix +40€, délai urgent moins de 4 jours +30€. Conclus en 2 lignes max, ton direct et clair. Exemple de conclusion : "Votre projet correspond à une Création Avancée avec voix. Estimation : 120€. Remplissez le formulaire ci-dessous pour démarrer."`;

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages,
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  return Response.json({ message: text });
}
