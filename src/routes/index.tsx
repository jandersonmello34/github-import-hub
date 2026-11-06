import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kerigma — Gestor de sermões com IA" },
      { name: "description", content: "Prepare sermões com apoio de IA e controle a projeção do Holyrics." },
      { property: "og:title", content: "Kerigma — Gestor de sermões com IA" },
      { property: "og:description", content: "Prepare sermões com apoio de IA e controle a projeção do Holyrics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/sermoes" });
  },
});
