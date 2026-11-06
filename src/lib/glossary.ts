/** Curated, reviewed entries shown before any AI answer — the trusted base of the dictionary. */
export type GlossaryEntry = {
  term: string;
  original?: string;
  language: "grego" | "hebraico" | "aramaico" | "português";
  transliteration?: string;
  strong?: string;
  category: "termo original" | "conceito" | "nome" | "lugar";
  definition: string;
  verses: string[];
};

export const GLOSSARY: GlossaryEntry[] = [
  { term: "Logos", original: "λόγος", language: "grego", transliteration: "lógos", strong: "G3056", category: "termo original",
    definition: "Palavra, razão, mensagem. Em João 1 designa o Filho eterno, que estava com Deus, era Deus e se fez carne.", verses: ["João 1:1", "João 1:14", "1 João 1:1"] },
  { term: "Koinonia", original: "κοινωνία", language: "grego", transliteration: "koinōnía", strong: "G2842", category: "termo original",
    definition: "Comunhão, participação, partilha. Descreve a vida comum da igreja e a participação no Cristo e no Espírito.", verses: ["Atos 2:42", "1 Coríntios 10:16", "2 Coríntios 13:13"] },
  { term: "Hesed", original: "חֶסֶד", language: "hebraico", transliteration: "ḥesed", strong: "H2617", category: "termo original",
    definition: "Amor leal, misericórdia fiel à aliança. A bondade constante de Deus para com seu povo.", verses: ["Êxodo 34:6", "Salmos 136:1", "Lamentações 3:22"] },
  { term: "Ágape", original: "ἀγάπη", language: "grego", transliteration: "agápē", strong: "G26", category: "termo original",
    definition: "Amor que se doa, revelado supremamente em Deus enviando seu Filho; o amor que os crentes devem ter uns pelos outros.", verses: ["João 3:16", "1 Coríntios 13:4", "1 João 4:8"] },
  { term: "Charis", original: "χάρις", language: "grego", transliteration: "cháris", strong: "G5485", category: "termo original",
    definition: "Graça, favor imerecido. O favor de Deus que salva e capacita.", verses: ["Efésios 2:8", "Romanos 3:24", "Tito 2:11"] },
  { term: "Pistis", original: "πίστις", language: "grego", transliteration: "pístis", strong: "G4102", category: "termo original",
    definition: "Fé, confiança, fidelidade. Confiança pessoal em Deus e em Cristo.", verses: ["Hebreus 11:1", "Romanos 5:1", "Gálatas 2:20"] },
  { term: "Metanoia", original: "μετάνοια", language: "grego", transliteration: "metánoia", strong: "G3341", category: "termo original",
    definition: "Arrependimento: mudança de mente que leva a uma mudança de direção de vida.", verses: ["Mateus 3:2", "Atos 2:38", "2 Coríntios 7:10"] },
  { term: "Ekklesia", original: "ἐκκλησία", language: "grego", transliteration: "ekklēsía", strong: "G1577", category: "termo original",
    definition: "Assembleia convocada; a igreja, povo reunido por Deus em Cristo.", verses: ["Mateus 16:18", "Efésios 1:22", "Atos 20:28"] },
  { term: "Shalom", original: "שָׁלוֹם", language: "hebraico", transliteration: "šālôm", strong: "H7965", category: "termo original",
    definition: "Paz, inteireza, bem-estar completo que vem de Deus.", verses: ["Números 6:26", "Isaías 9:6", "Isaías 26:3"] },
  { term: "Torá", original: "תּוֹרָה", language: "hebraico", transliteration: "tôrâ", strong: "H8451", category: "termo original",
    definition: "Instrução, lei. Os ensinos de Deus, em especial os cinco livros de Moisés.", verses: ["Salmos 1:2", "Salmos 19:7", "Josué 1:8"] },
  { term: "Kavod", original: "כָּבוֹד", language: "hebraico", transliteration: "kāḇôḏ", strong: "H3519", category: "termo original",
    definition: "Glória, peso, honra. A presença majestosa de Deus manifestada.", verses: ["Êxodo 33:18", "Isaías 6:3", "Salmos 19:1"] },
  { term: "Ruach", original: "רוּחַ", language: "hebraico", transliteration: "rûaḥ", strong: "H7307", category: "termo original",
    definition: "Vento, fôlego, espírito. Também o Espírito de Deus.", verses: ["Gênesis 1:2", "Ezequiel 37:9", "Joel 2:28"] },
  { term: "Justificação", language: "português", category: "conceito",
    definition: "Ato de Deus que declara justo o pecador, pela graça mediante a fé em Cristo, não por obras.", verses: ["Romanos 3:28", "Romanos 5:1", "Gálatas 2:16"] },
  { term: "Santificação", language: "português", category: "conceito",
    definition: "Obra de Deus que separa o crente para si e o transforma progressivamente à imagem de Cristo.", verses: ["1 Tessalonicenses 4:3", "2 Coríntios 3:18", "Hebreus 12:14"] },
  { term: "Trindade", language: "português", category: "conceito",
    definition: "Um só Deus em três pessoas — Pai, Filho e Espírito Santo — iguais em essência. O termo não aparece na Bíblia; resume seu ensino.", verses: ["Mateus 28:19", "2 Coríntios 13:13", "João 1:1"] },
  { term: "Propiciação", original: "ἱλασμός", language: "grego", transliteration: "hilasmós", strong: "G2434", category: "conceito",
    definition: "Sacrifício que satisfaz a justiça de Deus e remove a ira contra o pecado, realizado por Cristo na cruz.", verses: ["Romanos 3:25", "1 João 2:2", "1 João 4:10"] },
  { term: "Encarnação", language: "português", category: "conceito",
    definition: "O Filho eterno assumiu natureza humana verdadeira sem deixar de ser Deus.", verses: ["João 1:14", "Filipenses 2:6-7", "Colossenses 2:9"] },
  { term: "Moisés", language: "hebraico", category: "nome",
    definition: "Líder de Israel no êxodo do Egito, mediador da aliança no Sinai.", verses: ["Êxodo 3:10", "Deuteronômio 34:10"] },
  { term: "Paulo", language: "grego", category: "nome",
    definition: "Apóstolo aos gentios, antes Saulo de Tarso, fariseu; autor de 13 cartas do Novo Testamento.", verses: ["Atos 9:15", "Gálatas 1:15-16"] },
];

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export function searchGlossary(q: string): GlossaryEntry[] {
  const n = norm(q);
  if (!n) return GLOSSARY;
  return GLOSSARY.filter((e) =>
    [e.term, e.original ?? "", e.transliteration ?? "", e.strong ?? ""].some((f) => norm(f).includes(n)),
  );
}
