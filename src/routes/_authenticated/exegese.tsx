import ExegesisPage from "@/components/views/ExegesisPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/exegese")({
  head: () => ({
    meta: [
      { title: "Exegese e Dicionário Bíblico — Kerigma" },
      { name: "description", content: "Dicionário teológico com termos gregos e hebraicos e análise de contexto histórico-cultural." },
      { property: "og:title", content: "Exegese e Dicionário Bíblico — Kerigma" },
      { property: "og:description", content: "Termos originais, conceitos e contexto histórico dos textos bíblicos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ExegesisPage,
});
