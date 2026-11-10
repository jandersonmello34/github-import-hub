import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { lookupStrongTerm } from "@/lib/strong.functions";
import { findLocalStrongTerm, normalizeStrongQuery, resolveStrongTerm } from "@/lib/strong";

export function StrongPanel() {
  const [query, setQuery] = useState("");
  const client = useQueryClient();
  const lookup = useServerFn(lookupStrongTerm);
  const search = useMutation({ mutationFn: async (term: string) => ({ query: normalizeStrongQuery(term), result: await resolveStrongTerm(client, term, async (q) => {
    const response = await lookup({ data: { term: q } });
    if (!response.entry) throw new Error(response.error ?? "Verbete não encontrado.");
    return response.entry;
  }) }) });
  const local = findLocalStrongTerm(query);
  const result = search.data?.query === normalizeStrongQuery(query) ? search.data.result : undefined;
  const entry = local ?? result?.entry;
  return <div className="space-y-4">
    <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (query.trim()) search.mutate(query); }}>
      <Input className="min-w-0" aria-label="Palavra ou código Strong" placeholder="G26, H7225, amor, ἀγάπη…" value={query} onChange={(e) => { setQuery(e.target.value); search.reset(); }} />
      <Button type="submit" disabled={!query.trim() || search.isPending}><Search className="size-4" /><span className="hidden sm:inline">Pesquisar</span></Button>
    </form>
    {search.isPending && <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin motion-reduce:animate-none" />Consultando léxico…</p>}
    {search.isError && <p role="alert" className="text-sm text-destructive">{search.error.message}</p>}
    {entry && <article className="space-y-4 rounded-lg border border-border bg-card p-4 sm:p-6" aria-label="Verbete Strong">
      <header className="flex flex-wrap items-center gap-2">
        <h3 className="break-words text-3xl font-semibold" dir="auto">{entry.originalWord}</h3>
        <Badge variant="outline">{entry.id}</Badge><Badge variant="secondary">{entry.language === "greek" ? "Grego" : "Hebraico"}</Badge>
        <Badge variant="outline">{local ? "Base local" : <><Sparkles className="mr-1 size-3" />IA · não verificado</>}</Badge>
      </header>
      <p className="break-words text-lg italic">{entry.transliteration}</p>
      {entry.pronunciation && <p className="text-sm text-muted-foreground">Pronúncia: {entry.pronunciation}</p>}
      <section><h4 className="font-semibold">Definição exegética</h4><p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed">{entry.definition}</p></section>
      {entry.kjvOccurrences && <section><h4 className="font-semibold">Ocorrências e traduções na KJV</h4><p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed">{entry.kjvOccurrences}</p></section>}
      {entry.theologicalNotes && <section><h4 className="font-semibold">Notas teológicas</h4><p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed">{entry.theologicalNotes}</p></section>}
      {!local && <p className="text-xs text-muted-foreground">Síntese gerada por IA; confira grafia, código e ocorrências em uma concordância antes de citar.</p>}
    </article>}
  </div>;
}