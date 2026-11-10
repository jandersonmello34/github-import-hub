import { Button } from "@/components/ui/button";
import { useSermon } from "@/hooks/useSermons";
import { alertLevel, formatClock, type TimerAlert } from "@/lib/pulpit-timer";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, ChevronDown, ChevronLeft, ChevronRight, Loader2, Maximize, Minus, Pause, Play, Plus, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { type BibleVersion, useBibleChapter } from "@/lib/bible";
import { VersionSelect } from "@/components/bible/ChapterReader";
import { findReferences, splitTopics, type VerseRef } from "@/lib/sermon-pages";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function VerseText({ r, version }: { r: VerseRef; version: BibleVersion }) {
  const [open, setOpen] = useState(true);
  const { data, isLoading, isError } = useBibleChapter(version, r.book, r.chapter);
  const text = data?.slice(r.from - 1, r.to).map((v, i) => `${r.from + i} ${v}`).join(" ");
  return (
    <div className="rounded-md border border-border bg-background/60">
      <Button type="button" variant="ghost" aria-expanded={open} onClick={() => setOpen((o) => !o)}
        className="h-auto w-full justify-start gap-2 whitespace-normal px-3 py-1.5 text-left text-sm font-semibold text-primary">
        <ChevronDown className={cn("size-4 transition-transform", !open && "-rotate-90")} />
        {r.label}
      </Button>
      {open && (
        <p className="px-3 pb-2 text-sm leading-relaxed">
          {isLoading ? "Carregando…" : isError ? "Não foi possível carregar esta versão." : text || "Versículo não encontrado."}
        </p>
      )}
    </div>
  );
}

const borderClass: Record<TimerAlert, string> = {
  normal: "",
  warning: "pulpit-glow-warning",
  critical: "pulpit-glow-critical",
  over: "pulpit-glow-over",
};

const clockClass: Record<TimerAlert, string> = {
  normal: "text-foreground",
  warning: "text-pulpit-warning",
  critical: "text-pulpit-critical",
  over: "text-pulpit-critical",
};

export default function PulpitPage() {
  const { sermonId } = useParams({ strict: false }) as { sermonId: string };
  const navigate = useNavigate();
  const { data: sermon, isLoading } = useSermon(sermonId);

  const [total, setTotal] = useState(40 * 60);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [fontSize, setFontSize] = useState(22);
  const lastTick = useRef<number | null>(null);
  const [page, setPage] = useState(0);
  const [showVerses, setShowVerses] = useState(false);
  const [version, setVersion] = useState<BibleVersion>("nvi");
  const pages = useMemo(() => splitTopics(sermon?.body ?? ""), [sermon?.body]);
  const pageCount = Math.max(pages.length, 1);
  const current = pages[Math.min(page, pageCount - 1)];
  const refs = useMemo(() => findReferences(`${current?.heading ?? ""}\n${current?.content ?? ""}`), [current]);
  const go = (d: number) => setPage((p) => Math.min(pageCount - 1, Math.max(0, p + d)));

  // Swipe navigation: slide left advances, slide right goes back.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    go(dx < 0 ? 1 : -1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") go(1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (sermon) setTotal(sermon.durationMinutes * 60);
  }, [sermon]);

  useEffect(() => {
    if (!running) { lastTick.current = null; return; }
    lastTick.current = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      setElapsed((e) => e + (now - (lastTick.current ?? now)) / 1000);
      lastTick.current = now;
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  // Keep the screen awake while the sermon is running.
  useEffect(() => {
    if (!running || !("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    navigator.wakeLock.request("screen").then((l) => { lock = l; }).catch(() => {});
    return () => { void lock?.release(); };
  }, [running]);

  const remaining = total - elapsed;
  const level: TimerAlert = alertLevel(remaining);
  const progress = Math.min(100, (elapsed / total) * 100);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }
  if (!sermon) {
    return <div className="p-10 text-center text-muted-foreground">Sermão não encontrado.</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div aria-hidden className={cn("pointer-events-none fixed inset-0 z-[60] transition-all duration-700", borderClass[level])} />

      <header className="border-b border-border bg-card/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3">
          <Button variant="ghost" size="icon" aria-label="Sair do modo púlpito"
            onClick={() => void navigate({ to: "/sermoes/$sermonId", params: { sermonId } })}>
            <ArrowLeft className="size-5" />
          </Button>
          <div className={cn("font-mono text-4xl font-bold tabular-nums sm:text-5xl", clockClass[level])}
            role="timer" aria-live="off">
            {formatClock(remaining)}
          </div>
          <div className="flex items-center gap-1">
            <Button size="icon" onClick={() => setRunning((r) => !r)} aria-label={running ? "Pausar" : "Iniciar"}>
              {running ? <Pause className="size-5" /> : <Play className="size-5" />}
            </Button>
            <Button size="icon" variant="outline" aria-label="Zerar" onClick={() => { setRunning(false); setElapsed(0); }}>
              <RotateCcw className="size-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setTotal((t) => Math.max(60, t - 60))}>−1 min</Button>
            <Button size="sm" variant="outline" onClick={() => setTotal((t) => t + 60)}>+1 min</Button>
            <Button size="sm" variant="outline" onClick={() => setTotal((t) => t + 300)}>+5 min</Button>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button size="icon" variant="ghost" aria-label="Diminuir texto" onClick={() => setFontSize((f) => Math.max(14, f - 2))}><Minus className="size-4" /></Button>
            <span className="text-sm text-muted-foreground">A</span>
            <Button size="icon" variant="ghost" aria-label="Aumentar texto" onClick={() => setFontSize((f) => Math.min(48, f + 2))}><Plus className="size-4" /></Button>
            <Button size="icon" variant="ghost" aria-label="Tela cheia"
              onClick={() => void (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen())}>
              <Maximize className="size-4" />
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-2 h-1.5 max-w-5xl overflow-hidden rounded-full bg-muted">
          <div className={cn("h-full transition-all", level === "normal" ? "bg-primary" : level === "warning" ? "bg-pulpit-warning" : "bg-pulpit-critical")}
            style={{ width: `${progress}%` }} />
        </div>
        <p className="mx-auto mt-1 max-w-5xl text-xs text-muted-foreground">
          {level === "over" ? "Tempo esgotado" : level === "critical" ? "5 minutos ou menos — conclua" : level === "warning" ? "10 minutos ou menos" : `Tempo previsto: ${Math.round(total / 60)} min`}
        </p>
      </header>

      <main className="relative flex-1 overflow-y-auto px-3 py-6 sm:px-6">
        <article className="mx-auto w-full max-w-4xl">
          {page === 0 && <h1 className="font-display text-3xl font-semibold">{sermon.title}</h1>}
          {page === 0 && sermon.bibleReference && <p className="mt-1 text-primary">{sermon.bibleReference}</p>}
          {current?.heading && <h2 className="mt-4 font-display text-2xl font-semibold text-primary">{current.heading}</h2>}
          <div className="pulpit-prose mt-6 break-words leading-relaxed" style={{ fontSize }}>
            {current?.overview && current.overview.length > 0 ? (
              <ol className="pulpit-overview" aria-label="Visão geral da mensagem">
                {current.overview.map((title, index) => <li key={`${index}-${title}`}><ReactMarkdown>{title}</ReactMarkdown></li>)}
              </ol>
            ) : <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>{current?.content || "Este sermão ainda não tem conteúdo."}</ReactMarkdown>}
          </div>
        </article>
      </main>
      <footer className="border-t border-border bg-card/90 px-4 py-2 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 sm:gap-3">
          <Button size="sm" variant="outline" disabled={refs.length === 0} onClick={() => setShowVerses((v) => !v)}>
            <BookOpen className="size-4" />
            {showVerses ? "Esconder versículos" : `Mostrar versículos (${refs.length})`}
          </Button>
          {showVerses && <VersionSelect value={version} onChange={setVersion} label="Versão da Bíblia" />}
          <div className="ml-auto flex items-center gap-1.5">
            <Button size="icon" variant="outline" aria-label="Tópico anterior" disabled={page === 0} onClick={() => go(-1)}>
              <ChevronLeft className="size-5" />
            </Button>
            <span className="min-w-16 text-center text-sm text-muted-foreground">
              Tópico {Math.min(page, pageCount - 1) + 1} de {pageCount}
            </span>
            <Button size="icon" variant="outline" aria-label="Próximo tópico" disabled={page >= pageCount - 1} onClick={() => go(1)}>
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>
        {showVerses && refs.length > 0 && (
          <div className="mx-auto mt-2 max-h-64 max-w-5xl space-y-2 overflow-y-auto">
            {refs.map((r) => <VerseText key={r.label} r={r} version={version} />)}
          </div>
        )}
      </footer>
    </div>
  );
}
