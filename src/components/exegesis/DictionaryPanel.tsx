import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lookupTerm, type TermResult } from "@/lib/exegesis.functions";
import { searchGlossary, type GlossaryEntry } from "@/lib/glossary";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, BadgeCheck, Loader2, Search, Sparkles } from "lucide-react";
import { useState } from "react";

function EntryCard({ e, verified, extra }: { e: GlossaryEntry; verified: boolean; extra?: TermResult }) {
  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <header className="flex flex-wrap items-baseline gap-2">
        <h3 className="font-display text-xl font-semibold">{e.term}</h3>
        {e.original && <span className="text-lg text-primary">{e.original}</span>}
        {e.transliteration && <span className="text-sm italic text-muted-foreground">{e.transliteration}</span>}
        {e.strong && <Badge variant="outline" className="font-mono">{e.strong}</Badge>}
        <Badge variant="secondary">{e.category}</Badge>
        {verified ? (
          <Badge className="gap-1"><BadgeCheck className="size-3" />Verificado</Badge>
        ) : (
          <Badge variant="outline" className="gap-1"><Sparkles className="size-3" />IA · confiança {extra?.confidence}</Badge>
        )}
      </header>
      <p className="mt-2 text-sm leading-relaxed">{e.definition}</p>
      {extra?.theologicalUse && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{extra.theologicalUse}</p>}
      {e.verses.length > 0 && <p className="mt-2 text-xs text-primary">{e.verses.join(" · ")}</p>}
      {extra?.cautions && (
        <p className="mt-2 flex gap-1.5 text-xs text-muted-foreground"><AlertTriangle className="size-3.5 shrink-0" />{extra.cautions}</p>
      )}
    </article>
  );
}

export function DictionaryPanel() {
  const [q, setQ] = useState("");
  const lookup = useServerFn(lookupTerm);
  const ai = useMutation({ mutationFn: (term: string) => lookup({ data: { term } }) });
  const local = searchGlossary(q);
  const r = ai.data;
  return (
    <div className="space-y-4">
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (q.trim()) ai.mutate(q.trim()); }}>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ex.: logos, hesed, justificação, Paulo…" aria-label="Termo" />
        <Button type="submit" disabled={!q.trim() || ai.isPending}>
          {ai.isPending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}Pesquisar
        </Button>
      </form>
      {ai.isError && <p className="text-sm text-destructive">{ai.error.message}</p>}
      {r && (
        <EntryCard verified={false} extra={r} e={{
          term: r.term, original: r.original, transliteration: r.transliteration, strong: r.strong,
          language: "português", category: r.category as GlossaryEntry["category"], definition: r.definition, verses: r.verses,
        }} />
      )}
      <p className="text-xs text-muted-foreground">
        {q.trim() ? `Verbetes verificados (${local.length})` : "Verbetes verificados"} — pressione Pesquisar para uma explicação aprofundada.
      </p>
      <div className="grid gap-3">{local.map((e) => <EntryCard key={e.term} e={e} verified />)}</div>
    </div>
  );
}
