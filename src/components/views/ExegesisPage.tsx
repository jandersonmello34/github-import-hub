import { ContextPanel } from "@/components/exegesis/ContextPanel";
import { DictionaryPanel } from "@/components/exegesis/DictionaryPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ExegesisPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Exegese</h1>
        <p className="text-muted-foreground">Dicionário teológico e contexto histórico-cultural dos textos.</p>
      </div>
      <Tabs defaultValue="dicionario">
        <TabsList>
          <TabsTrigger value="dicionario">Dicionário teológico</TabsTrigger>
          <TabsTrigger value="contexto">Contexto histórico-cultural</TabsTrigger>
        </TabsList>
        <TabsContent value="dicionario" className="mt-4"><DictionaryPanel /></TabsContent>
        <TabsContent value="contexto" className="mt-4"><ContextPanel /></TabsContent>
      </Tabs>
    </div>
  );
}
