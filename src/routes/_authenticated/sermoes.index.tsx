import SermonsPage from "@/components/views/SermonsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/sermoes/")({
  head: () => ({
    meta: [
      { title: "Sermões — Kerigma" },
      { name: "description", content: "Organize, pesquise e prepare seus sermões." },
      { property: "og:title", content: "Sermões — Kerigma" },
      { property: "og:description", content: "Organize, pesquise e prepare seus sermões." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SermonsPage,
});
