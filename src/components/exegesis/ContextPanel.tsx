import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { historicalContext } from "@/lib/exegesis.functions";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Landmark, Loader2 } from "lucide-react";
import { useState } from "react";

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-primary">{label}</h4>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{value}</p>
    </div>
  );
}

export function ContextPanel({ initial = "" }: { initial?: string }) {
  const [q, setQ] = useState(initial);
  const fn = useServerFn(historicalContext);
  const m = useMutation({ mutationFn: (passage: string) => fn({ data: { passage } }) });
  const r = m.data;
  return (
    <div className="space-y-4">
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (q.trim()) m.mutate(q.trim()); }}>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ex.: Romanos, Filipenses 2, Amós 5:21-24" aria-label="Livro ou passagem" />
        <Button type="submit" disabled={!q.trim() || m.isPending}>
          {m.isPending ? <Loader2 className="size-4 animate-spin" /> : <Landmark className="size-4" />}Analisar
        </Button>
      </form>
      {m.isError && <p className="text-sm text-destructive">{m.error.message}</p>}
      {r && (
        <div className="space-y-3">
          <h3 className="font-display text-2xl font-semibold">{r.passage}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Quem escreveu" value={r.author} />
            <Field label="Para quem escreveu" value={r.audience} />
            <Field label="Época" value={r.date} />
            <Field label="Império / poder dominante" value={r.empire} />
            <Field label="Lugar" value={r.place} />
            <Field label="Propósito" value={r.purpose} />
          </div>
          <Field label="Situação da época" value={r.situation} />
          {r.culturalNotes.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-primary">Notas culturais</h4>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{r.culturalNotes.map((n) => <li key={n}>{n}</li>)}</ul>
            </div>
          )}
          <Field label="Debates acadêmicos" value={r.debates} />
          <p className="text-xs text-muted-foreground">Gerado por IA a partir de fontes acadêmicas consolidadas — confira em um comentário antes de pregar.</p>
        </div>
      )}
    </div>
  );
}
