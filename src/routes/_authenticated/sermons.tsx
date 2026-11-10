import SermonsPage from '@/components/views/SermonsPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/sermons')({
  head: () => ({ meta: [
    { title: 'Meus sermões — Kerigma' },
    { name: 'description', content: 'Sua biblioteca pessoal de mensagens e estudos bíblicos no Kerigma.' },
    { property: 'og:title', content: 'Meus sermões — Kerigma' },
    { property: 'og:description', content: 'Sua biblioteca pessoal de mensagens e estudos bíblicos no Kerigma.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
  ] }),
  component: SermonsPage,
});