import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DICT_SOURCES, searchDictionary, type DictCategory } from "@/lib/bible-dictionary";
import { useState } from "react";

const CATS: { v: DictCategory | "todos"; l: string }[] = [
  { v: "todos", l: "Todos" }, { v: "nome", l: "Nomes" }, { v: "lugar", l: "Lugares" }, { v: "termo", l: "Termos" }, { v: "objeto", l: "Objetos" },
];
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function BibleDictionaryPanel() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<DictCategory | "todos">("todos");
  const [letter, setLetter] = useState<string>();
  const list = searchDictionary(q, cat, letter);
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Verbetes baseados em obras de domínio público (sem direitos autorais): Easton (1897), Hitchcock (1869) e Strong (1890).</p>
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar nome, lugar ou termo…" aria-label="Buscar no dicionário bíblico" />
      <div className="flex flex-wrap gap-2">
        {CATS.map((c) => (
          <Button key={c.v} size="sm" variant={cat === c.v ? "default" : "outline"} onClick={() => setCat(c.v)}>{c.l}</Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        <Button size="sm" variant={!letter ? "secondary" : "ghost"} onClick={() => setLetter(undefined)}>A–Z</Button>
        {LETTERS.map((l) => (
          <Button key={l} size="sm" className="w-8 px-0" variant={letter === l ? "secondary" : "ghost"} onClick={() => setLetter(l)}>{l}</Button>
        ))}
      </div>
      {list.length === 0 && <p className="text-sm text-muted-foreground">Nenhum verbete encontrado.</p>}
      <div className="space-y-3">
        {list.map((e) => (
          <article key={e.term} className="rounded-xl border border-border bg-card p-4">
            <header className="flex flex-wrap items-baseline gap-2">
              <h3 className="font-display text-xl font-semibold">{e.term}</h3>
              {e.meaning && <span className="text-sm italic text-muted-foreground">“{e.meaning}”</span>}
              <Badge variant="secondary">{e.category}</Badge>
            </header>
            <p className="mt-2 text-sm leading-relaxed">{e.definition}</p>
            <p className="mt-2 text-xs text-primary">{e.verses.join(" · ")}</p>
            <p className="mt-1 text-xs text-muted-foreground">Fonte: {DICT_SOURCES[e.source]}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
