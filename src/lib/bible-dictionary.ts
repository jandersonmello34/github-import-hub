/**
 * Dicionário bíblico livre de direitos autorais.
 * Baseado em obras em domínio público: Easton's Bible Dictionary (1897),
 * Hitchcock's Bible Names (1869) e Strong's Concordance (1890).
 * Textos resumidos e traduzidos livremente para o português.
 */
export type DictCategory = "nome" | "lugar" | "termo" | "objeto";
export type DictEntry = { term: string; category: DictCategory; meaning?: string; definition: string; verses: string[]; source: "Easton" | "Hitchcock" | "Strong" };

export const DICT_SOURCES: Record<DictEntry["source"], string> = {
  Easton: "Easton's Bible Dictionary (1897) — domínio público",
  Hitchcock: "Hitchcock's Bible Names (1869) — domínio público",
  Strong: "Strong's Concordance (1890) — domínio público",
};

export const BIBLE_DICTIONARY: DictEntry[] = [
  { term: "Abraão", category: "nome", meaning: "pai de uma multidão", source: "Hitchcock", definition: "Patriarca chamado por Deus de Ur dos Caldeus; recebeu a promessa de uma descendência numerosa e de que nele seriam benditas todas as famílias da terra. Chamado 'amigo de Deus'.", verses: ["Gênesis 12:1-3", "Gênesis 17:5", "Romanos 4:3", "Tiago 2:23"] },
  { term: "Adão", category: "nome", meaning: "terra vermelha; homem", source: "Hitchcock", definition: "O primeiro homem, formado do pó da terra e colocado no Éden. Paulo o apresenta como figura daquele que havia de vir, Cristo.", verses: ["Gênesis 2:7", "Romanos 5:14", "1 Coríntios 15:45"] },
  { term: "Altar", category: "objeto", source: "Easton", definition: "Estrutura de terra, pedra ou metal onde se ofereciam sacrifícios. No tabernáculo havia o altar do holocausto (bronze) e o altar do incenso (ouro).", verses: ["Gênesis 8:20", "Êxodo 27:1", "Hebreus 13:10"] },
  { term: "Antioquia", category: "lugar", source: "Easton", definition: "Capital da Síria romana, junto ao rio Orontes. Ali os discípulos foram chamados cristãos pela primeira vez, e dali partiram as viagens missionárias de Paulo.", verses: ["Atos 11:26", "Atos 13:1-3"] },
  { term: "Arca da Aliança", category: "objeto", source: "Easton", definition: "Cofre de madeira de acácia revestido de ouro, contendo as tábuas da lei. Sobre ela ficava o propiciatório com dois querubins. Símbolo da presença de Deus.", verses: ["Êxodo 25:10-22", "Hebreus 9:4"] },
  { term: "Babilônia", category: "lugar", meaning: "confusão", source: "Easton", definition: "Grande cidade junto ao Eufrates, capital do império de Nabucodonosor, que levou Judá ao exílio. No Apocalipse, símbolo do sistema mundano oposto a Deus.", verses: ["2 Reis 25:1-11", "Daniel 4:30", "Apocalipse 18:2"] },
  { term: "Belém", category: "lugar", meaning: "casa do pão", source: "Hitchcock", definition: "Cidade de Judá, cerca de 9 km ao sul de Jerusalém. Cidade de Davi e lugar do nascimento de Jesus, conforme Miquéias.", verses: ["Rute 1:19", "Miquéias 5:2", "Lucas 2:4-7"] },
  { term: "Betel", category: "lugar", meaning: "casa de Deus", source: "Hitchcock", definition: "Cidade onde Jacó viu a escada que chegava ao céu. Mais tarde, centro de culto idólatra no reino do norte.", verses: ["Gênesis 28:19", "1 Reis 12:29"] },
  { term: "Circuncisão", category: "termo", source: "Easton", definition: "Rito instituído como sinal da aliança com Abraão. No Novo Testamento, Paulo ensina a circuncisão do coração, pelo Espírito.", verses: ["Gênesis 17:10-11", "Romanos 2:29", "Colossenses 2:11"] },
  { term: "Davi", category: "nome", meaning: "amado", source: "Hitchcock", definition: "Segundo rei de Israel, pastor de Belém, salmista. Deus lhe prometeu um trono eterno, cumprido em Cristo, o Filho de Davi.", verses: ["1 Samuel 16:13", "2 Samuel 7:16", "Mateus 1:1"] },
  { term: "Efraim", category: "nome", meaning: "frutífero", source: "Hitchcock", definition: "Segundo filho de José, abençoado por Jacó acima do primogênito. Sua tribo tornou-se tão destacada que o nome designa às vezes todo o reino do norte.", verses: ["Gênesis 41:52", "Gênesis 48:19", "Oséias 11:8"] },
  { term: "Elias", category: "nome", meaning: "meu Deus é o Senhor", source: "Hitchcock", definition: "Profeta do reino do norte no tempo de Acabe; enfrentou os profetas de Baal no Carmelo e foi levado ao céu num redemoinho.", verses: ["1 Reis 18:36-39", "2 Reis 2:11", "Malaquias 4:5"] },
  { term: "Emanuel", category: "nome", meaning: "Deus conosco", source: "Hitchcock", definition: "Nome dado ao filho anunciado por Isaías, aplicado por Mateus a Jesus.", verses: ["Isaías 7:14", "Mateus 1:23"] },
  { term: "Éfeso", category: "lugar", source: "Easton", definition: "Principal cidade da Ásia romana, famosa pelo templo de Diana. Paulo ali ministrou cerca de três anos; uma das sete igrejas do Apocalipse.", verses: ["Atos 19:1-10", "Efésios 1:1", "Apocalipse 2:1"] },
  { term: "Getsêmani", category: "lugar", meaning: "lagar de azeite", source: "Hitchcock", definition: "Jardim junto ao monte das Oliveiras onde Jesus orou em agonia antes de ser preso.", verses: ["Mateus 26:36", "Marcos 14:32"] },
  { term: "Gólgota", category: "lugar", meaning: "lugar da caveira", source: "Hitchcock", definition: "Lugar fora dos muros de Jerusalém onde Jesus foi crucificado; em latim, Calvário.", verses: ["Mateus 27:33", "João 19:17"] },
  { term: "Isaque", category: "nome", meaning: "riso", source: "Hitchcock", definition: "Filho da promessa, nascido de Abraão e Sara na velhice. Foi oferecido no monte Moriá e poupado por Deus.", verses: ["Gênesis 21:3-6", "Gênesis 22:1-14", "Hebreus 11:17"] },
  { term: "Israel", category: "nome", meaning: "aquele que luta com Deus", source: "Hitchcock", definition: "Nome dado a Jacó após lutar em Peniel; depois, o povo descendente de suas doze tribos.", verses: ["Gênesis 32:28", "Êxodo 19:5-6"] },
  { term: "Jerusalém", category: "lugar", meaning: "habitação de paz", source: "Hitchcock", definition: "Cidade conquistada por Davi e escolhida como lugar do templo. Cenário da morte e ressurreição de Jesus; a nova Jerusalém é a cidade celestial.", verses: ["2 Samuel 5:6-7", "Salmos 122:6", "Apocalipse 21:2"] },
  { term: "Jesus", category: "nome", meaning: "o Senhor salva", source: "Hitchcock", definition: "Forma grega de Josué (Yehoshua). Nome dado ao Filho de Maria porque salvaria o seu povo dos seus pecados.", verses: ["Mateus 1:21", "Filipenses 2:9-11"] },
  { term: "Jordão", category: "lugar", meaning: "o que desce", source: "Hitchcock", definition: "Principal rio da Palestina, do monte Hermom ao mar Morto. Israel o atravessou a seco sob Josué; Jesus ali foi batizado.", verses: ["Josué 3:17", "Mateus 3:13"] },
  { term: "Maná", category: "objeto", meaning: "que é isto?", source: "Easton", definition: "Alimento enviado por Deus a Israel no deserto durante quarenta anos. Jesus se apresenta como o verdadeiro pão do céu.", verses: ["Êxodo 16:15", "João 6:31-35"] },
  { term: "Messias", category: "termo", meaning: "ungido", source: "Strong", definition: "Do hebraico mashiach (H4899); em grego, Christos (G5547). O rei ungido prometido, da linhagem de Davi, identificado com Jesus.", verses: ["Daniel 9:25", "João 1:41", "João 4:25"] },
  { term: "Moriá", category: "lugar", source: "Easton", definition: "Região onde Abraão foi oferecer Isaque; mais tarde, o monte onde Salomão edificou o templo.", verses: ["Gênesis 22:2", "2 Crônicas 3:1"] },
  { term: "Nazaré", category: "lugar", source: "Easton", definition: "Pequena cidade da Galileia onde Jesus cresceu, por isso chamado Nazareno.", verses: ["Lucas 2:39", "Mateus 2:23", "João 1:46"] },
  { term: "Noé", category: "nome", meaning: "descanso", source: "Hitchcock", definition: "Homem justo que construiu a arca e foi preservado com sua família no dilúvio; Deus fez com ele a aliança do arco-íris.", verses: ["Gênesis 6:8-9", "Gênesis 9:12-13", "Hebreus 11:7"] },
  { term: "Páscoa", category: "termo", meaning: "passagem", source: "Easton", definition: "Festa que celebra a libertação do Egito, quando o anjo passou sobre as casas marcadas com sangue do cordeiro. Cristo é a nossa Páscoa.", verses: ["Êxodo 12:11-13", "1 Coríntios 5:7"] },
  { term: "Pedro", category: "nome", meaning: "pedra", source: "Hitchcock", definition: "Simão, pescador da Galileia, apóstolo; Jesus lhe deu o nome Cefas (aramaico) ou Pedro (grego). Pregou no Pentecostes.", verses: ["João 1:42", "Mateus 16:18", "Atos 2:14"] },
  { term: "Pentecostes", category: "termo", meaning: "quinquagésimo", source: "Easton", definition: "Festa das semanas, cinquenta dias após a Páscoa. Nela o Espírito Santo foi derramado sobre a igreja.", verses: ["Levítico 23:15-16", "Atos 2:1-4"] },
  { term: "Sábado", category: "termo", meaning: "descanso", source: "Easton", definition: "Sétimo dia, separado para descanso e culto em memória da criação e da libertação do Egito.", verses: ["Gênesis 2:2-3", "Êxodo 20:8-11", "Marcos 2:27"] },
  { term: "Samaria", category: "lugar", meaning: "guarda", source: "Hitchcock", definition: "Capital do reino do norte fundada por Onri; depois, a região central da Palestina, habitada pelos samaritanos.", verses: ["1 Reis 16:24", "João 4:4-9", "Atos 8:5"] },
  { term: "Sinai", category: "lugar", source: "Easton", definition: "Monte no deserto onde Deus deu a lei a Moisés e firmou a aliança com Israel; também chamado Horebe.", verses: ["Êxodo 19:20", "Êxodo 3:1"] },
  { term: "Sumo sacerdote", category: "termo", source: "Easton", definition: "Chefe do sacerdócio levítico, o único que entrava no Santo dos Santos, uma vez por ano, no Dia da Expiação. Cristo é o grande Sumo Sacerdote.", verses: ["Levítico 16:2", "Hebreus 4:14", "Hebreus 9:7"] },
  { term: "Tabernáculo", category: "objeto", meaning: "habitação", source: "Easton", definition: "Santuário portátil construído no deserto segundo o modelo dado a Moisés, onde Deus habitava no meio do povo.", verses: ["Êxodo 25:8-9", "João 1:14", "Hebreus 8:5"] },
  { term: "Sião", category: "lugar", meaning: "monumento; lugar seco", source: "Hitchcock", definition: "Colina de Jerusalém, fortaleza conquistada por Davi; por extensão, a cidade de Deus e o seu povo.", verses: ["2 Samuel 5:7", "Salmos 48:2", "Hebreus 12:22"] },
];

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function searchDictionary(q: string, cat?: DictCategory | "todos", letter?: string): DictEntry[] {
  const n = norm(q.trim());
  return BIBLE_DICTIONARY.filter((e) =>
    (!cat || cat === "todos" || e.category === cat) &&
    (!letter || norm(e.term).startsWith(norm(letter))) &&
    (!n || norm(e.term).includes(n) || norm(e.meaning ?? "").includes(n) || norm(e.definition).includes(n)),
  ).sort((a, b) => a.term.localeCompare(b.term, "pt"));
}
