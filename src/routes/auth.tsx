import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import "@lovable.dev/cloud-auth-js/styles.css";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { authErrorMessage } from "@/lib/auth-errors";

type Search = { redirect?: string | undefined };

function safePath(p: string | undefined) {
  return p && p.startsWith("/") && !p.startsWith("//") && !p.includes("\\") && !p.startsWith("/auth") && !p.startsWith("/reset-password") ? p : "/sermons";
}

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s["redirect"] === "string" ? s["redirect"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Entrar — Kerigma" },
      { name: "description", content: "Entre para acessar seus sermões e a projeção do Holyrics." },
      { property: "og:title", content: "Entrar — Kerigma" },
      { property: "og:description", content: "Entre para acessar seus sermões e a projeção do Holyrics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const target = safePath(redirect);
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) void navigate({ to: target, replace: true });
  }, [navigate, target, user, isLoading]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setNotice("");
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name.trim() } },
        });
        if (error) throw error;
        if (data.user?.identities?.length === 0) {
          setNotice("Se este e-mail já estiver cadastrado, entre ou redefina a senha. Caso contrário, confira o e-mail de confirmação.");
        } else if (!data.session) {
          setNotice("Confira seu e-mail para confirmar a conta antes de entrar.");
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setNotice("Se houver uma conta com este e-mail, você receberá um link para criar uma nova senha.");
      }
    } catch (err) {
      setErrorMessage(authErrorMessage(err instanceof Error ? err : {}));
    } finally {
      setBusy(false);
    }
  }

  async function oauth(provider: "google" | "lovable") {
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin + "/auth" });
    if (result.error) toast.error(String(result.error.message ?? result.error));
  }

  return (
    <main className="atmosphere flex min-h-dvh items-center justify-center bg-background px-6 text-foreground">
      <div className="w-full max-w-sm space-y-6 py-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <Sparkles className="size-6 text-primary" aria-hidden="true" />
          <h1 className="font-display text-3xl font-semibold text-gradient-gold">Kerigma</h1>
          <p className="text-sm text-muted-foreground">
            {mode === "signup"
              ? "Crie sua conta para preparar sermões."
              : mode === "forgot"
                ? "Informe seu e-mail para redefinir a senha."
                : "Entre para acessar seus sermões e a projeção do Holyrics."}
          </p>
        </div>
        {mode !== "forgot" && <div className="grid grid-cols-2 gap-1 rounded-md border border-border bg-secondary p-1">
          <Button variant={mode === "signin" ? "default" : "ghost"} disabled={busy} aria-pressed={mode === "signin"} onClick={() => { setMode("signin"); setErrorMessage(""); setNotice(""); }}>Entrar</Button>
          <Button variant={mode === "signup" ? "default" : "ghost"} disabled={busy} aria-pressed={mode === "signup"} onClick={() => { setMode("signup"); setErrorMessage(""); setNotice(""); }}>Criar Conta</Button>
        </div>}
        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "signup" && <div className="space-y-2"><Label htmlFor="name">Nome</Label><Input id="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} maxLength={120} /></div>}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {mode !== "forgot" && (
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          )}
          {errorMessage && <p role="alert" className="text-sm text-destructive">{errorMessage}</p>}
          {notice && <p role="status" className="text-sm text-success">{notice}</p>}
          <Button type="submit" className="w-full shadow-gold-glow" disabled={busy}>
            {busy ? "Aguarde…" : mode === "signin" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar link"}
          </Button>
        </form>
        {mode !== "forgot" && (
          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={() => void oauth("google")}>
              Continuar com Google
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => void oauth("lovable")}>
              Continue with Lovable
            </Button>
          </div>
        )}
        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
          {mode === "signin" && (
            <>
              <Button variant="link" disabled={busy} onClick={() => { setMode("forgot"); setErrorMessage(""); setNotice(""); }}>Esqueci minha senha</Button>
            </>
          )}
          {mode !== "signin" && (
            <Button variant="link" disabled={busy} onClick={() => { setMode("signin"); setErrorMessage(""); setNotice(""); }}>Já tenho conta — entrar</Button>
          )}
        </div>
      </div>
    </main>
  );
}
