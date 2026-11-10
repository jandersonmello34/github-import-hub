<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->
## Kerigma (migrated from Caffeine/ICP)
- Signed-in pages live under `src/routes/_authenticated/`; page bodies are in `src/components/views/` so routes stay thin.
- Sermons and collections are read/written from the browser client with owner-scoped RLS; AI and Holyrics calls go through `createServerFn` with `requireSupabaseAuth` because they need server keys or per-user stored credentials.
- Holyrics credentials are stored per user in `holyrics_configs` (original app stored one global config).
- AI calls share `src/lib/ai-gateway.server.ts` (`runChat`/`runJson` with strict json_schema); wizard and import live in `src/lib/ai-wizard.functions.ts` — one gateway client, structured replies.
- Bible text is fetched in the browser and cached forever by React Query — no server storage or key needed. NVI/ACF/AA come as whole-Bible JSON from thiagobodruk/biblia; NAA/NVT/NTLH/OL/KJA are fetched per chapter from the public bolls.life API (see src/lib/bible.ts).
- Strong lookups use exact local lexical matches first, then authenticated SDK-backed lookupStrongTerm; React Query caches validated entries and aliases for the current session to avoid duplicate AI calls, and generated answers remain labeled unverified.

