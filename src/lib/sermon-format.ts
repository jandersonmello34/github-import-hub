import type { SermonFormat } from "@/lib/types";

/**
 * The format actually used for the draft: while "Automático" is on it follows the
 * AI's suggestion, otherwise the preacher's own pick wins.
 */
export function resolveFormat(o: {
  auto: boolean;
  manual: SermonFormat;
  suggested: SermonFormat;
}): SermonFormat {
  return o.auto ? o.suggested : o.manual;
}
