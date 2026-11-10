import { BibleDictionaryPanel } from "@/components/exegesis/BibleDictionaryPanel";
import { DictionaryPanel } from "@/components/exegesis/DictionaryPanel";
import { StrongPanel } from "@/components/exegesis/StrongPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dicionario")({
  head: () => ({
    meta: [
      { title: "Dicionário Bíblico — Kerigma" },
      { name: "description", content: "Dicionário bíblico de domínio público e dicionário teológico com termos gregos e hebraicos." },
      { property: "og:title", content: "Dicionário Bíblico — Kerigma" },
      { property: "og:description", content: "Nomes, lugares e termos bíblicos sem direitos autorais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DictionaryPage,
});

function DictionaryPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Dicionário</h1>
        <p className="text-muted-foreground">Nomes, lugares e termos bíblicos, e conceitos teológicos.</p>
      </div>
      <Tabs defaultValue="biblico">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="biblico">Dicionário bíblico</TabsTrigger>
          <TabsTrigger value="teologico">Dicionário teológico</TabsTrigger>
          <TabsTrigger value="strong">Léxico Strong</TabsTrigger>
        </TabsList>
        <TabsContent value="biblico" className="mt-4"><BibleDictionaryPanel /></TabsContent>
        <TabsContent value="teologico" className="mt-4"><DictionaryPanel /></TabsContent>
        <TabsContent value="strong" className="mt-4"><StrongPanel /></TabsContent>
      </Tabs>
    </div>
  );
}
