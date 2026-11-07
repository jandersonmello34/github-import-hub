import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VersionSelect } from "@/components/bible/ChapterReader";
import { type BibleVersion, useBibleChapter } from "@/lib/bible";
import { DICT_SOURCES, findEntry, searchDictionary, type DictCategory, type DictEntry } from "@/lib/bible-dictionary";
import { findReferences } from "@/lib/sermon-pages";
import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CATS: { v: DictCategory | "todos"; l: string }[] = [
  { v: "todos", l: "Todos" }, { v: "nome", l: "Nomes" }, { v: "lugar", l: "Lugares" }, { v: "termo", l: "Termos" }, { v: "objeto", l: "Objetos" },
];
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function VerseRef({ label, version }: { label: string; version: BibleVersion }) {
  const [open, setOpen] = useState(false);
  const r = findReferences(label)[0];
  return (
    <span className="block">
      <button type="button" onClick={() => setOpen((o) => !o)} className="text-xs text-primary underline-offset-2 hover:underline" aria-expanded={open}>
        {open ? "▾" : "▸"} {label}
      </button>
      {open && r && <VerseBody r={r} version={version} />}
    </span>
  );
}
function VerseBody({ r, version }: { r: NonNullable<ReturnType<typeof findReferences>[0]>; version: BibleVersion }) {
  const { data, isLoading, isError } = useBibleChapter(version, r.book, r.chapter);
  const text = data?.slice(r.from - 1, r.to).map((v, i) => `${r.from + i} ${v}`).join(" ");
  return <span className="mt-1 block rounded-md border border-border bg-background/60 p-2 text-sm leading-relaxed">{isLoading ? "Carregando…" : isError || !text ? "Não foi possível carregar o texto." : text}</span>;
}

function citation(e: DictEntry) {
  const orig = e.original ? ` (${e.original}, ${e.transliteration}${e.strong ? `, Strong ${e.strong}` : ""})` : "";
  return `${e.term}${orig}${e.meaning ? ` — “${e.meaning}”` : ""}\n${e.definition}${e.typology ? `\nTipologia: ${e.typology}` : ""}\nReferências: ${e.verses.join("; ")}\nFonte: ${DICT_SOURCES[e.source]}`;
}

export function BibleDictionaryPanel() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<DictCategory | "todos">("todos");
  const [letter, setLetter] = useState<string>();
  const [testament, setTestament] = useState<"AT" | "NT">();
  const [version, setVersion] = useState<BibleVersion>("nvi");
  const list = searchDictionary(q, cat, letter, testament);
  const goTo = (term: string) => { setQ(term); setCat("todos"); setLetter(undefined); setTestament(undefined); };
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Verbetes baseados em obras de domínio público (sem direitos autorais): Easton (1897), Hitchcock (1869) e Strong (1890). Busque também por número Strong (ex.: G3056) ou transliteração.</p>
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar nome, lugar, termo ou Strong…" aria-label="Buscar no dicionário bíblico" />
      <div className="flex flex-wrap items-center gap-2">
        {CATS.map((c) => (
          <Button key={c.v} size="sm" variant={cat === c.v ? "default" : "outline"} onClick={() => setCat(c.v)}>{c.l}</Button>
        ))}
        <span className="mx-1 h-5 w-px bg-border" />
        <Button size="sm" variant={!testament ? "secondary" : "ghost"} onClick={() => setTestament(undefined)}>AT + NT</Button>
        <Button size="sm" variant={testament === "AT" ? "secondary" : "ghost"} onClick={() => setTestament("AT")}>Antigo Test.</Button>
        <Button size="sm" variant={testament === "NT" ? "secondary" : "ghost"} onClick={() => setTestament("NT")}>Novo Test.</Button>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">Versão <VersionSelect value={version} onChange={setVersion} /></div>
      </div>
      <div className="flex flex-wrap gap-1">
        <Button size="sm" variant={!letter ? "secondary" : "ghost"} onClick={() => setLetter(undefined)}>A–Z</Button>
        {LETTERS.map((l) => (
          <Button key={l} size="sm" className="w-8 px-0" variant={letter === l ? "secondary" : "ghost"} onClick={() => setLetter(l)}>{l}</Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{list.length} verbete(s)</p>
      {list.length === 0 && <p className="text-sm text-muted-foreground">Nenhum verbete encontrado.</p>}
      <div className="space-y-3">
        {list.map((e) => (
          <article key={e.term} className="rounded-xl border border-border bg-card p-4">
            <header className="flex flex-wrap items-baseline gap-2">
              <h3 className="font-display text-xl font-semibold">{e.term}</h3>
              {e.original && <span className="text-lg" lang={e.strong?.startsWith("H") ? "he" : "el"}>{e.original}</span>}
              {e.transliteration && <span className="text-sm italic text-muted-foreground">{e.transliteration}</span>}
              {e.meaning && <span className="text-sm italic text-muted-foreground">“{e.meaning}”</span>}
              <Badge variant="secondary">{e.category}</Badge>
              {e.testament && <Badge variant="outline">{e.testament}</Badge>}
              {e.strong && <Badge variant="outline">Strong {e.strong}</Badge>}
              <Button size="sm" variant="ghost" className="ml-auto" aria-label={`Copiar verbete ${e.term}`}
                onClick={() => navigator.clipboard.writeText(citation(e)).then(() => toast.success("Verbete copiado para o esboço"))}>
                <Copy className="h-4 w-4" /> Copiar
              </Button>
            </header>
            <p className="mt-2 text-sm leading-relaxed">{e.definition}</p>
            {e.typology && <p className="mt-2 text-sm leading-relaxed"><strong>Tipologia / Cristo:</strong> {e.typology}</p>}
            <div className="mt-2 space-y-1">{e.verses.map((v) => <VerseRef key={v} label={v} version={version} />)}</div>
            {e.related && e.related.length > 0 && (
              <p className="mt-2 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">Ver também:
                {e.related.filter(findEntry).map((r) => <Button key={r} size="sm" variant="link" className="h-auto p-0 text-xs" onClick={() => goTo(r)}>{r}</Button>)}
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">Fonte: {DICT_SOURCES[e.source]}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
