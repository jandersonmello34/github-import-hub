import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { runJson } from "@/lib/ai-gateway.server";

const str = { type: "string" } as const;
const obj = (props: Record<string, unknown>) => ({ type: "object", additionalProperties: false, required: Object.keys(props), properties: props });
const arr = (items: unknown) => ({ type: "array", items });

const GUARD =
  "Você é um assistente de exegese bíblica em português do Brasil, rigoroso e acadêmico. " +
  "Responda apenas com informação consolidada em léxicos (BDAG, HALOT, Strong) e comentários reconhecidos. " +
  "Nunca invente números de Strong, datas, versículos ou etimologias: se não tiver certeza, deixe o campo vazio e explique em 'cautions'. " +
  "Quando houver debate acadêmico, apresente as posições principais sem tomar partido como se fosse fato.\n";

export type TermResult = {
  term: string; original: string; language: string; transliteration: string; strong: string; category: string;
  definition: string; theologicalUse: string; verses: string[]; cautions: string; confidence: "alta" | "media" | "baixa";
};

export const lookupTerm = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { term: string }) => {
    const term = String(i?.term ?? "").trim().slice(0, 120);
    if (!term) throw new Error("Digite um termo");
    return { term };
  })
  .handler(async ({ data }) =>
    runJson<TermResult>(
      GUARD +
        `Explique o termo, nome ou conceito bíblico/teológico: "${data.term}".\n` +
        "Campos: term (forma usual em português), original (escrita original grega/hebraica/aramaica, vazio se for conceito em português), " +
        "language, transliteration, strong (ex.: G26, vazio se incerto), category (termo original | conceito | nome | lugar), " +
        "definition (2-4 frases), theologicalUse (como é usado nas Escrituras e na teologia), verses (3-6 referências reais no formato 'Livro c:v'), " +
        "cautions (erros comuns de interpretação, falácias etimológicas, ou incertezas), confidence (alta|media|baixa). " +
        "Se o termo não existir ou não for bíblico/teológico, diga isso em definition e use confidence baixa.",
      "term_lookup",
      obj({ term: str, original: str, language: str, transliteration: str, strong: str, category: str, definition: str,
        theologicalUse: str, verses: arr(str), cautions: str, confidence: { type: "string", enum: ["alta", "media", "baixa"] } }),
    ),
  );

export type ContextResult = {
  passage: string; author: string; audience: string; date: string; empire: string; place: string;
  situation: string; purpose: string; culturalNotes: string[]; debates: string;
};

export const historicalContext = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { passage: string }) => {
    const passage = String(i?.passage ?? "").trim().slice(0, 200);
    if (!passage) throw new Error("Informe um livro ou passagem");
    return { passage };
  })
  .handler(async ({ data }) =>
    runJson<ContextResult>(
      GUARD +
        `Faça a análise de contexto histórico-cultural de: "${data.passage}".\n` +
        "Campos: passage (nome normalizado), author (quem escreveu e grau de consenso sobre a autoria), audience (para quem escreveu), " +
        "date (data aproximada, com faixa se houver debate), empire (qual império/poder dominava a região e o governante, se conhecido), " +
        "place (onde foi escrito e onde estavam os destinatários), situation (situação política, religiosa e social da época, 1-2 parágrafos), " +
        "purpose (propósito do texto), culturalNotes (3-6 costumes ou fatos culturais que iluminam o texto), " +
        "debates (principais divergências acadêmicas; vazio se não houver).",
      "historical_context",
      obj({ passage: str, author: str, audience: str, date: str, empire: str, place: str, situation: str, purpose: str,
        culturalNotes: arr(str), debates: str }),
    ),
  );
