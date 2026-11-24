/* BabyLi: ilustrações desenhadas em SVG (receitas e guia de cortes para bebês) */
var IL = (function () {
  function sh(hex, k) { // escurece (k<0) ou clareia (k>0)
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function f(x) { return Math.max(0, Math.min(255, Math.round(k < 0 ? x * (1 + k) : x + (255 - x) * k))); }
    return "#" + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  }
  function rnd(seed) { var s = seed % 2147483647; if (s <= 0) s += 2147483646; return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; }; }
  function hash(t) { var h = 7; for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0; return Math.abs(h) + 1; }
  var L = 'stroke-linecap="round" stroke-linejoin="round"';

  /* ---------- formas (cada uma desenhada numa caixa 120 x 90) ---------- */
  var F = {
    pure: function (c) { return '<path d="M18 66 Q24 30 60 28 Q96 30 102 66 Z" fill="' + c + '"/><path d="M40 48 q10 -6 20 0 M58 40 q10 -6 18 0 M48 58 q12 -6 24 0" stroke="' + sh(c, -.25) + '" stroke-width="2.4" fill="none" ' + L + '/>'; },
    grumos: function (c, R) { var o = F.pure(c); for (var i = 0; i < 9; i++) o += '<rect x="' + (34 + R() * 48) + '" y="' + (38 + R() * 20) + '" width="6" height="6" rx="2" fill="' + sh(c, -.18) + '"/>'; return o; },
    palito: function (c) {
      return '<g><rect x="16" y="22" width="78" height="12" rx="6" fill="' + c + '" stroke="' + sh(c, -.3) + '" stroke-width="1.5" transform="rotate(-6 55 28)"/><rect x="22" y="40" width="78" height="12" rx="6" fill="' + c + '" stroke="' + sh(c, -.3) + '" stroke-width="1.5"/><rect x="18" y="57" width="78" height="12" rx="6" fill="' + c + '" stroke="' + sh(c, -.3) + '" stroke-width="1.5" transform="rotate(5 57 63)"/></g>' + regua("≈ 6 cm, um dedo");
    },
    tira: function (c) { return '<path d="M14 40 Q60 24 104 38 L102 52 Q60 40 16 56 Z" fill="' + c + '" stroke="' + sh(c, -.3) + '" stroke-width="1.5"/><path d="M28 44 Q60 34 92 42" stroke="' + sh(c, -.2) + '" stroke-width="1.5" fill="none"/>' + regua("tira grande para chupar"); },
    cubinho: function (c, R) { var o = ""; for (var i = 0; i < 16; i++) { var x = 22 + (i % 6) * 13 + R() * 4, y = 30 + Math.floor(i / 6) * 13 + R() * 4; o += '<rect x="' + x + '" y="' + y + '" width="8" height="8" rx="2" fill="' + c + '" stroke="' + sh(c, -.3) + '" stroke-width="1" transform="rotate(' + (R() * 30 - 15) + ' ' + (x + 4) + ' ' + (y + 4) + ')"/>'; } return o + regua("≈ 1 cm, uma ervilha"); },
    pedaco: function (c, R) { var o = ""; for (var i = 0; i < 6; i++) { var x = 24 + (i % 3) * 26 + R() * 4, y = 26 + Math.floor(i / 3) * 22 + R() * 3; o += '<rect x="' + x + '" y="' + y + '" width="16" height="15" rx="4" fill="' + c + '" stroke="' + sh(c, -.3) + '" stroke-width="1.2" transform="rotate(' + (R() * 24 - 12) + ' ' + (x + 8) + ' ' + (y + 8) + ')"/>'; } return o + regua("≈ 2 cm, uma uva grande"); },
    florete: function (c) { return arv(40, 26, 1, c) + arv(78, 30, .9, c) + regua("com cabinho para segurar"); },
    florete_peq: function (c, R) { var o = ""; for (var i = 0; i < 8; i++) o += arv(26 + (i % 4) * 22, 32 + Math.floor(i / 4) * 22, .38, c); return o + regua("floretes picadinhos"); },
    folha_picada: function (c, R) { var o = '<path d="M22 64 Q26 38 60 36 Q94 38 98 64 Z" fill="' + sh(c, .75) + '"/>'; for (var i = 0; i < 26; i++) o += '<path d="M' + (32 + R() * 56) + ' ' + (44 + R() * 18) + ' l4 -2 l2 4 l-4 2 z" fill="' + c + '"/>'; return o; },
    folha_tira: function (c) { var o = ""; for (var i = 0; i < 7; i++) o += '<path d="M' + (22 + i * 11) + ' 30 q6 18 -2 36" stroke="' + c + '" stroke-width="5" fill="none" ' + L + '/>'; return o; },
    metade_casca: function () { return '<path d="M20 56 Q60 18 102 40 Q98 52 86 52 Q58 44 30 64 Z" fill="#f7e28b" stroke="#d9b84a" stroke-width="1.5"/><path d="M62 47 Q78 46 92 50 Q100 58 104 66 Q84 64 70 58 Z" fill="#f2c53d" stroke="#c99a1f" stroke-width="1.5"/>' + regua("metade com casca para segurar"); },
    rodela: function (c, R) { var o = ""; for (var i = 0; i < 6; i++) { var x = 30 + (i % 3) * 30, y = 36 + Math.floor(i / 3) * 24; o += '<circle cx="' + x + '" cy="' + y + '" r="11" fill="' + c + '" stroke="' + sh(c, -.25) + '" stroke-width="1.5"/><circle cx="' + x + '" cy="' + y + '" r="2.5" fill="' + sh(c, -.35) + '"/>'; } return o + regua("rodelas grossas, ≈ 1,5 cm"); },
    tira_grande: function (c) { return '<path d="M14 34 Q56 20 100 30 Q104 36 98 40 Q56 34 16 46 Z" fill="' + c + '" stroke="' + sh(c, -.25) + '" stroke-width="1.5"/><path d="M18 56 Q60 44 104 52 Q106 58 100 62 Q58 58 20 68 Z" fill="' + c + '" stroke="' + sh(c, -.25) + '" stroke-width="1.5"/>' + regua("tiras grandes e bem maduras"); },
    raspada: function (c) { return F.pure(c) + '<ellipse cx="96" cy="28" rx="12" ry="8" fill="none" stroke="#9aa0a6" stroke-width="3"/><path d="M86 34 L64 50" stroke="#9aa0a6" stroke-width="4" ' + L + '/>'; },
    ralado: function (c, R) { var o = ""; for (var i = 0; i < 40; i++) { var x = 26 + R() * 68, y = 32 + R() * 32; o += '<path d="M' + x + ' ' + y + ' l' + (6 + R() * 4) + ' ' + (R() * 4 - 2) + '" stroke="' + c + '" stroke-width="2.4" ' + L + '/>'; } return o + regua("ralado fininho"); },
    quartos: function (c) {
      var o = '<ellipse cx="30" cy="44" rx="13" ry="17" fill="' + c + '"/><path d="M30 27 V61 M17 44 H43" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/>';
      [[64, -8], [78, -3], [92, 3], [106, 8]].forEach(function (p) { o += '<ellipse cx="' + p[0] + '" cy="44" rx="5" ry="16" fill="' + c + '" transform="rotate(' + p[1] + ' ' + p[0] + ' 44)"/><ellipse cx="' + (p[0] - 1) + '" cy="44" rx="2" ry="11" fill="' + sh(c, .45) + '" transform="rotate(' + p[1] + ' ' + p[0] + ' 44)"/>'; });
      return o + regua("sempre em 4 no comprimento");
    },
    moida: function (c, R) { var o = '<path d="M22 64 Q28 38 60 36 Q92 38 98 64 Z" fill="' + sh(c, .1) + '"/>'; for (var i = 0; i < 40; i++) o += '<circle cx="' + (30 + R() * 60) + '" cy="' + (44 + R() * 18) + '" r="2.2" fill="' + sh(c, -.25) + '"/>'; return o + regua("moída bem soltinha"); },
    desfiado: function (c, R) { var o = ""; for (var i = 0; i < 18; i++) { var x = 24 + R() * 60, y = 30 + R() * 34; o += '<path d="M' + x + ' ' + y + ' q' + (8 + R() * 8) + ' ' + (R() * 8 - 4) + ' ' + (18 + R() * 10) + ' ' + (R() * 6 - 3) + '" stroke="' + c + '" stroke-width="3" fill="none" ' + L + '/>'; } return o + regua("desfiado em fios finos"); },
    lascas: function (c, R) { var o = ""; for (var i = 0; i < 10; i++) { var x = 28 + (i % 5) * 16 + R() * 4, y = 36 + Math.floor(i / 5) * 18 + R() * 4; o += '<ellipse cx="' + x + '" cy="' + y + '" rx="8" ry="5" fill="' + c + '" stroke="' + sh(c, -.2) + '" stroke-width="1.2" transform="rotate(' + (R() * 50 - 25) + ' ' + x + ' ' + y + ')"/>'; } return o + regua("lascas sem espinha"); },
    ovo_amassado: function (c, R) { var o = '<path d="M22 64 Q28 36 60 34 Q92 36 98 64 Z" fill="#f7cf3d"/>'; for (var i = 0; i < 12; i++) o += '<rect x="' + (32 + R() * 54) + '" y="' + (42 + R() * 18) + '" width="6" height="5" rx="2" fill="#fffaf0"/>'; return o; },
    ovo_quartos: function () { var o = ""; [[30, 46, -20], [52, 40, 10], [76, 46, -10], [96, 40, 20]].forEach(function (p) { o += '<g transform="rotate(' + p[2] + ' ' + p[0] + ' ' + p[1] + ')"><path d="M' + (p[0] - 9) + ' ' + p[1] + ' Q' + p[0] + ' ' + (p[1] - 26) + ' ' + (p[0] + 9) + ' ' + p[1] + ' Z" fill="#fffaf0" stroke="#e3dccb" stroke-width="1.2"/><path d="M' + (p[0] - 5) + ' ' + p[1] + ' Q' + p[0] + ' ' + (p[1] - 12) + ' ' + (p[0] + 5) + ' ' + p[1] + ' Z" fill="#f7cf3d"/></g>'; }); return o + regua("ovo cozido em quartos"); },
    ovo_picado: function (c, R) { var o = ""; for (var i = 0; i < 16; i++) { var x = 24 + (i % 6) * 13 + R() * 4, y = 32 + Math.floor(i / 6) * 12 + R() * 3; o += '<rect x="' + x + '" y="' + y + '" width="8" height="7" rx="2" fill="' + (i % 3 ? "#fffaf0" : "#f7cf3d") + '" stroke="#e3dccb"/>'; } return o + regua("picadinho"); },
    graos_amassados: function (c, R) { var o = '<path d="M22 64 Q28 38 60 36 Q92 38 98 64 Z" fill="' + sh(c, .15) + '"/>'; for (var i = 0; i < 8; i++) o += '<ellipse cx="' + (34 + R() * 52) + '" cy="' + (46 + R() * 14) + '" rx="4" ry="2.6" fill="' + sh(c, -.25) + '"/>'; return o + regua("amassados com caldo"); },
    graos: function (c, R) { var o = '<path d="M22 64 Q28 42 60 40 Q92 42 98 64 Z" fill="' + sh(c, .35) + '"/>'; for (var i = 0; i < 30; i++) { var x = 30 + R() * 60, y = 42 + R() * 18; o += '<ellipse cx="' + x + '" cy="' + y + '" rx="4.5" ry="3" fill="' + c + '" transform="rotate(' + (R() * 180) + ' ' + x + ' ' + y + ')"/>'; } return o + regua("grãos levemente amassados"); },
    macarrao_peq: function (c, R) { var o = ""; for (var i = 0; i < 26; i++) o += '<circle cx="' + (28 + R() * 64) + '" cy="' + (34 + R() * 30) + '" r="3.2" fill="none" stroke="' + c + '" stroke-width="2.4"/>'; return o + regua("pequeno e bem cozido"); },
    parafuso: function (c, R) { var o = ""; for (var i = 0; i < 7; i++) { var x = 22 + (i % 4) * 22 + R() * 4, y = 32 + Math.floor(i / 4) * 22; o += '<path d="M' + x + ' ' + y + ' l4 -4 l4 8 l4 -8 l4 8 l4 -4" stroke="' + c + '" stroke-width="4" fill="none" ' + L + '/>'; } return o + regua("cortado ao meio"); },
    arroz_papa: function () { var o = F.pure("#f6f1e4"); return o.replace(/stroke="[^"]+"/, 'stroke="#ddd3bd"'); },
    arroz: function (c, R) { var o = '<path d="M22 64 Q28 38 60 36 Q92 38 98 64 Z" fill="#f6f1e4"/>'; for (var i = 0; i < 46; i++) { var x = 30 + R() * 60, y = 42 + R() * 18; o += '<ellipse cx="' + x + '" cy="' + y + '" rx="2.6" ry="1.3" fill="#e2d8bf" transform="rotate(' + (R() * 180) + ' ' + x + ' ' + y + ')"/>'; } return o; }
  };
  function arv(x, y, s, c) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="-4" y="10" width="8" height="26" rx="4" fill="' + sh(c, .45) + '"/><circle cx="-9" cy="8" r="9" fill="' + c + '"/><circle cx="9" cy="8" r="9" fill="' + c + '"/><circle cx="0" cy="-2" r="10" fill="' + sh(c, .08) + '"/><circle cx="0" cy="12" r="7" fill="' + sh(c, -.1) + '"/></g>'; }
  function regua(t) { return '<path d="M16 82 H104" stroke="var(--muted)" stroke-width="1" stroke-dasharray="2 3"/><text x="60" y="79" text-anchor="middle" font-size="7" font-family="Nunito, sans-serif" font-weight="700" fill="var(--muted)">' + t + '</text>'; }

  /* ---------- como cortar para bebês (6 a 12 meses) ---------- */
  var CORTE = [
    { k: "cenoura", nome: "Cenoura, beterraba e vagem", cor: "#f28c28", e: [[6, "pure", "Cozida e amassada com garfo"], [7, "grumos", "Amassada com pedacinhos macios"], [8, "palito", "Cozida, em palitos do tamanho do seu dedo"], [9, "cubinho", "Cozida, em cubinhos do tamanho de uma ervilha"], [11, "pedaco", "Cozida, em pedaços do tamanho de uma uva grande"]] },
    { k: "abobora", nome: "Abóbora, abobrinha e chuchu", cor: "#f5a623", e: [[6, "pure", "Cozida e amassada"], [7, "grumos", "Amassada com pedacinhos"], [8, "palito", "Em palitos macios para pegar"], [9, "cubinho", "Em cubinhos macios"], [11, "pedaco", "Em pedaços macios"]] },
    { k: "batata", nome: "Batata, mandioquinha e inhame", cor: "#f0cf7a", e: [[6, "pure", "Amassada com garfo, sem liquidificar"], [7, "grumos", "Amassada com pedacinhos"], [8, "palito", "Amassado grosso ou palitos macios"], [9, "cubinho", "Em cubinhos macios"], [11, "pedaco", "Em pedaços macios"]] },
    { k: "brocolis", nome: "Brócolis e couve-flor", cor: "#4f9a2f", e: [[6, "florete", "Floretes grandes bem cozidos, com o cabinho para segurar (ou amassados)"], [9, "florete_peq", "Floretes pequenos, picadinhos"], [11, "florete", "Floretes inteiros macios"]] },
    { k: "folhas", nome: "Couve e espinafre", cor: "#2f6b2f", e: [[6, "folha_picada", "Refogadas, bem picadinhas e misturadas na papinha"], [12, "folha_tira", "Refogadas em tiras finas"]] },
    { k: "banana", nome: "Banana", cor: "#f2c94c", e: [[6, "metade_casca", "Metade com um pedaço da casca para segurar, ou amassada"], [9, "rodela", "Em rodelas grossas ou tiras"]] },
    { k: "mamao", nome: "Mamão, manga e abacate", cor: "#f39a3a", e: [[6, "tira_grande", "Amassado, ou em tiras grandes e bem maduras"], [9, "cubinho", "Em cubinhos macios"], [11, "pedaco", "Em pedaços"]] },
    { k: "maca", nome: "Maçã e pera", cor: "#efe2a2", e: [[6, "raspada", "Cozida e amassada, ou crua raspada com colher"], [9, "ralado", "Crua só ralada, ou cozida em pedaços"]] },
    { k: "uva", nome: "Uva e tomate-cereja", cor: "#7b3fa0", e: [[6, "quartos", "Sempre cortada em 4 no comprimento, sem sementes"]] },
    { k: "carne", nome: "Carne vermelha", cor: "#8b4a2b", e: [[6, "moida", "Moída bem soltinha ou desfiada fininha"], [8, "tira", "Tira grande e macia para chupar, ou desfiada"], [9, "cubinho", "Picadinha ou moída"], [11, "pedaco", "Em pedaços pequenos e macios"]] },
    { k: "frango", nome: "Frango", cor: "#e2c08d", e: [[6, "desfiado", "Desfiado bem fino"], [9, "cubinho", "Picadinho"], [11, "pedaco", "Em pedaços pequenos"]] },
    { k: "peixe", nome: "Peixe", cor: "#efe6d2", e: [[6, "lascas", "Desfiado, conferindo cada lasca com os dedos para tirar as espinhas"]] },
    { k: "ovo", nome: "Ovo (gema e clara)", cor: "#f7cf3d", e: [[6, "ovo_amassado", "Bem cozido e amassado"], [8, "ovo_quartos", "Cozido em quartos para pegar"], [9, "ovo_picado", "Mexido bem firme ou picado"]] },
    { k: "feijao", nome: "Feijão e lentilha", cor: "#6b3e26", e: [[6, "graos_amassados", "Grãos amassados com o caldo (nunca só o caldo)"], [9, "graos", "Grãos levemente amassados"]] },
    { k: "arroz", nome: "Arroz", cor: "#f6f1e4", e: [[6, "arroz_papa", "Bem cozido e molinho"], [8, "arroz", "Soltinho e úmido"]] },
    { k: "macarrao", nome: "Macarrão", cor: "#f2c75c", e: [[6, "macarrao_peq", "Pequeno, bem cozido e amassado"], [10, "parafuso", "Parafuso ou penne macio, cortado ao meio"]] }
  ];
  function etapa(c, m) { var e = c.e[0]; c.e.forEach(function (x) { if (m >= x[0]) e = x; }); return e; }
  function corteSVG(c, m, cls) {
    var e = etapa(c, m), R = rnd(hash(c.k + e[1]));
    return '<svg viewBox="0 0 120 90" class="' + (cls || "") + '" role="img" aria-label="' + c.nome + ': ' + e[2] + '">' + F[e[1]](c.cor, R) + '</svg>';
  }

  /* ---------- alimentos encontrados numa receita ---------- */
  var KW = [
    [/beterraba/, "cenoura", "#a3245a"], [/cenoura/, "cenoura", "#f28c28"], [/vagem/, "cenoura", "#6aa84f"], [/ab[oó]bora/, "abobora", "#f5a623"],
    [/abobrinha|chuchu|pepino/, "abobora", "#a9cf6b"], [/batata-doce/, "batata", "#e98a4a"], [/batata|mandioquinha|inhame|car[aá]\b|mandioca/, "batata", "#f0cf7a"],
    [/br[oó]colis/, "brocolis", "#4f9a2f"], [/couve-flor/, "brocolis", "#efe8d0"], [/couve|espinafre|folhas/, "folhas", "#2f6b2f"],
    [/banana/, "banana", "#f2c94c"], [/mam[aã]o|papaia/, "mamao", "#f39a3a"], [/manga/, "mamao", "#f6a53a"], [/abacate/, "mamao", "#9bc45a"],
    [/caqui|p[eê]ssego|ameixa/, "mamao", "#f08a4b"], [/mel[aã]o/, "mamao", "#f5d98a"], [/melancia/, "mamao", "#ef5b5b"], [/kiwi/, "mamao", "#8db63c"],
    [/morango|acerola|frutas vermelhas/, "mamao", "#e0413f"], [/laranja|tangerina/, "mamao", "#f7a12b"], [/abacaxi/, "mamao", "#f5d33d"], [/goiaba|pitaya/, "mamao", "#f07a8a"], [/figo/, "mamao", "#9c4f78"],
    [/ma[cç][aã]|pera/, "maca", "#efe2a2"], [/uva|tomate-cereja/, "uva", "#7b3fa0"], [/tomate/, "abobora", "#e5483f"],
    [/f[ií]gado/, "carne", "#6b2a22"], [/carne|patinho|m[uú]sculo|ac[eé]m|bife|almônd|kafta|hamb[uú]rguer|lombo/, "carne", "#8b4a2b"],
    [/frango|sobrecoxa|galinha/, "frango", "#e2c08d"], [/salm[aã]o/, "peixe", "#f29b7b"], [/peixe|til[aá]pia|pescada|merluza|atum|sardinha/, "peixe", "#efe6d2"],
    [/ovo|omelete|crepioca/, "ovo", "#f7cf3d"], [/feij[aã]o-preto/, "feijao", "#2e2320"], [/feij[aã]o|lentilha|gr[aã]o-de-bico|ervilha/, "feijao", "#6b3e26"],
    [/arroz|risot|galinhada|canja/, "arroz", "#f6f1e4"], [/macarr|espaguete|talharim|penne|parafuso|nhoque|lasanha/, "macarrao", "#f2c75c"],
    [/polenta|fub[aá]|cuscuz|milho/, "batata", "#f5d24a"], [/quinoa|aveia/, "arroz", "#e8d9b5"]
  ];
  function achar(r) {
    var txt = (r.n + " | " + r.i.join(" | ")).toLowerCase(), out = [], vistos = {};
    KW.forEach(function (k) { var mt = txt.search(k[0]); if (mt >= 0 && !vistos[k[1] + k[2]]) { vistos[k[1] + k[2]] = 1; out.push({ pos: mt, c: CORTE.filter(function (x) { return x.k === k[1]; })[0], cor: k[2] }); } });
    out.sort(function (a, b) { return a.pos - b.pos; });
    return out;
  }
  function porcao(item, m, x, y, s, R) {
    var e = etapa(item.c, Math.min(m, 12));
    var forma = e[1];
    if (m >= 12) forma = { cenoura: "pedaco", abobora: "pedaco", batata: "pedaco", brocolis: "florete", folhas: "folha_tira", banana: "rodela", mamao: "pedaco", maca: "pedaco", uva: "quartos", carne: "pedaco", frango: "desfiado", peixe: "lascas", ovo: "ovo_picado", feijao: "graos", arroz: "arroz", macarrao: "parafuso" }[item.c.k];
    var g = F[forma](item.cor, R).replace(/<path d="M16 82 H104"[^>]*\/><text[\s\S]*?<\/text>/, "");
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + g + '</g>';
  }

  /* ---------- ilustração da receita ---------- */
  var FUNDO = { almoco: "var(--pumpkin-soft)", cafe: "var(--warn-soft)", lanche: "var(--ok-soft)", fruta: "var(--beet-soft)", bebida: "var(--ok-soft)", sobremesa: "var(--beet-soft)" };
  function receita(r) {
    var R = rnd(hash(r.n)), itens = achar(r), m = r.f, nm = r.n.toLowerCase(), o = "";
    var cor1 = (itens[0] && itens[0].cor) || "#f2c94c", cor2 = (itens[1] && itens[1].cor) || sh(cor1, -.15);
    o += '<rect width="120" height="90" fill="' + FUNDO[r.t] + '"/>';
    if (r.t === "bebida") {
      var liq = /vitamina|leite|shake|chocolate|smoothie|iogurte/.test(nm) ? sh(cor1, .55) : /agua|água/.test(nm) ? "#d9eef7" : cor1;
      if (/chocolate|cacau/.test(nm)) liq = "#8a5a3c";
      o += '<path d="M44 18 H76 L72 78 Q60 82 48 78 Z" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/><path d="M45.5 32 H74.5 L71.4 76 Q60 79 48.6 76 Z" fill="' + liq + '"/>' +
        '<path d="M66 8 L60 50" stroke="#e86f9d" stroke-width="3.5" ' + L + '/>' +
        '<circle cx="78" cy="22" r="10" fill="' + cor2 + '" stroke="' + sh(cor2, -.25) + '" stroke-width="1.5"/><path d="M78 13 V31 M70 22 H86" stroke="' + sh(cor2, .45) + '" stroke-width="1.2"/>';
      if (/agua|água/.test(nm)) for (var i = 0; i < 3; i++) o += '<circle cx="' + (52 + i * 8) + '" cy="' + (50 + i * 8) + '" r="4" fill="' + (itens[i] ? itens[i].cor : cor1) + '" opacity=".85"/>';
      return wrap(o, r);
    }
    if (r.t === "sobremesa" && /picol/.test(nm)) {
      o += pic(34, cor1) + pic(70, cor2);
      return wrap(o, r);
    }
    if (/bolo|muffin|bolinho de|cookie|biscoit|brigadeiro|pa[cç]oca|p[aã]o de queijo|barrinha|empad|coxinha|esfiha|pastel/.test(nm)) {
      o += '<ellipse cx="60" cy="64" rx="50" ry="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/>';
      var tipoMassa = /bolo|muffin|bolinho/.test(nm) ? (/chocolate|cacau|beterraba/.test(nm) ? "#7a4a2e" : "#e8b866") : /brigadeiro/.test(nm) ? "#6b4128" : "#e3b36c";
      for (var j = 0; j < 4; j++) {
        var x = 26 + j * 22, y = 56 - (j % 2) * 4;
        if (/muffin|bolinho/.test(nm)) o += '<path d="M' + (x - 9) + ' ' + y + ' L' + (x - 7) + ' ' + (y + 12) + ' H' + (x + 7) + ' L' + (x + 9) + ' ' + y + ' Z" fill="' + sh(cor1, .3) + '"/><circle cx="' + x + '" cy="' + (y - 2) + '" r="10" fill="' + tipoMassa + '"/><circle cx="' + (x - 3) + '" cy="' + (y - 5) + '" r="2.4" fill="' + cor1 + '"/>';
        else if (/bolo/.test(nm)) { if (j < 2) o += '<path d="M' + (x + j * 14 - 4) + ' ' + (y + 8) + ' l30 -6 l0 -16 l-30 6 z" fill="' + tipoMassa + '" stroke="' + sh(tipoMassa, -.25) + '"/><path d="M' + (x + j * 14 - 4) + ' ' + (y - 8) + ' l30 -6 l-14 -8 z" fill="' + sh(tipoMassa, .25) + '"/>'; }
        else o += '<circle cx="' + x + '" cy="' + y + '" r="9" fill="' + tipoMassa + '" stroke="' + sh(tipoMassa, -.25) + '"/><circle cx="' + (x - 2) + '" cy="' + (y - 2) + '" r="1.8" fill="' + sh(tipoMassa, -.4) + '"/><circle cx="' + (x + 3) + '" cy="' + (y + 2) + '" r="1.5" fill="' + sh(tipoMassa, -.4) + '"/>';
      }
      return wrap(o, r);
    }
    if (/panqueca|panquequinha|waffle/.test(nm)) {
      o += '<ellipse cx="60" cy="66" rx="48" ry="15" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/>';
      for (var p = 0; p < 4; p++) o += '<ellipse cx="60" cy="' + (60 - p * 6) + '" rx="30" ry="9" fill="#e7b25e" stroke="#c98d39"/>';
      o += '<circle cx="54" cy="38" r="5" fill="' + cor1 + '"/><circle cx="66" cy="37" r="4" fill="' + cor2 + '"/>';
      return wrap(o, r);
    }
    if (/sandu[ií]che|wrap|torrada|p[aã]o |p[aã]o$|queijo quente|hot dog|burrito|tacos|pizza/.test(nm)) {
      o += '<ellipse cx="60" cy="64" rx="50" ry="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/>';
      if (/pizza/.test(nm)) o += '<circle cx="60" cy="54" r="30" fill="#e9b863"/><circle cx="60" cy="54" r="25" fill="#d9453b"/><circle cx="60" cy="54" r="22" fill="#f7e3a1" opacity=".9"/><circle cx="50" cy="48" r="4" fill="#d9453b"/><circle cx="68" cy="60" r="4" fill="#d9453b"/><circle cx="64" cy="44" r="3" fill="' + cor1 + '"/>';
      else o += '<path d="M28 66 L60 30 L92 66 Z" fill="#e7c48a" stroke="#c9a061" stroke-width="2"/><path d="M36 62 L60 36 L84 62" stroke="' + cor1 + '" stroke-width="5" fill="none"/><path d="M40 58 L60 40 L80 58" stroke="' + cor2 + '" stroke-width="3" fill="none"/>';
      return wrap(o, r);
    }
    if (/palitos|chips/.test(nm)) {
      o += '<ellipse cx="60" cy="64" rx="50" ry="16" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/>';
      for (var q = 0; q < 6; q++) o += /chips/.test(nm) ? '<circle cx="' + (30 + q * 11) + '" cy="' + (56 + (q % 2) * 5) + '" r="8" fill="' + cor1 + '" stroke="' + sh(cor1, -.25) + '"/>' : '<rect x="' + (20 + q * 9) + '" y="' + (40 + (q % 2) * 4) + '" width="7" height="30" rx="3.5" fill="' + (q % 2 ? cor2 : cor1) + '" transform="rotate(' + (q * 6 - 15) + ' ' + (24 + q * 9) + ' 55)"/>';
      if (/pasta|homus|guacamole|iogurte/.test(nm + r.i.join(" "))) o += '<ellipse cx="92" cy="56" rx="14" ry="8" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/><ellipse cx="92" cy="55" rx="11" ry="5" fill="' + (/guacamole/.test(nm) ? "#9bc45a" : "#efe3c4") + '"/>';
      return wrap(o, r);
    }
    if (/pipoca/.test(nm)) { o += tigela(); for (var w = 0; w < 18; w++) o += '<circle cx="' + (34 + R() * 52) + '" cy="' + (32 + R() * 16) + '" r="5" fill="#fff8e6" stroke="#e8d7a8"/>'; return wrap(o, r); }
    // tigela (fruta, papinha de cereal, mingau, iogurte, sopa, sorvete, gelatina, café de colher)
    var tigelaTipo = r.t === "fruta" || /mingau|papinha de (aveia|quinoa|arroz|fub)|iogurte|sopa|creme|canja|sorvete|gelatina|mousse|pudim|overnight|granola|salada de frutas|doce de|arroz-doce|caldo/.test(nm);
    if (tigelaTipo && r.t !== "almoco" || /sopa|canja|creme de/.test(nm)) {
      var base = /iogurte|mingau|overnight|arroz-doce|pudim/.test(nm) ? "#f8f3e6" : /sopa|canja|caldo|creme de/.test(nm) ? sh(cor1, .35) : /gelatina/.test(nm) ? cor1 : null;
      o += tigela(base);
      var its = itens.length ? itens : [{ c: CORTE[6], cor: cor1 }];
      if (/sorvete/.test(nm)) { o += '<circle cx="48" cy="36" r="13" fill="#f6e27a"/><circle cx="70" cy="34" r="13" fill="' + (its[1] ? its[1].cor : cor1) + '"/>'; return wrap(o, r); }
      var n3 = Math.min(3, its.length), cx3 = n3 === 1 ? [60] : n3 === 2 ? [46, 74] : [38, 60, 82];
      its.slice(0, 3).forEach(function (it, k) { o += porcao(it, m, cx3[k] - 60 * .42, 36 - 48 * .42 + (k % 2) * 3, .42, R); });
      return wrap(o, r);
    }
    // prato com porções (almoço e o resto)
    o += '<ellipse cx="60" cy="50" rx="56" ry="36" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/><ellipse cx="60" cy="50" rx="44" ry="27" fill="none" stroke="var(--line)" stroke-width="1"/>';
    var lst = itens.slice(0, 4);
    if (!lst.length) lst = [{ c: CORTE[14], cor: "#f6f1e4" }];
    var cs = lst.length === 1 ? [[60, 50]] : lst.length === 2 ? [[38, 50], [82, 50]] : lst.length === 3 ? [[36, 40], [84, 40], [60, 64]] : [[38, 37], [82, 37], [38, 63], [82, 63]];
    var sc = [0, .72, .52, .44, .4][lst.length];
    lst.forEach(function (it, k) { o += porcao(it, m, cs[k][0] - 60 * sc, cs[k][1] - 48 * sc, sc, R); });
    return wrap(o, r);
  }
  function tigela(base) { return '<path d="M18 40 H102 Q100 78 60 80 Q20 78 18 40 Z" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/><ellipse cx="60" cy="40" rx="42" ry="9" fill="' + (base || "var(--surface)") + '" stroke="var(--line)" stroke-width="2"/>'; }
  function pic(x, c) { return '<rect x="' + (x + 7) + '" y="58" width="6" height="22" rx="3" fill="#d9b483"/><rect x="' + (x - 4) + '" y="14" width="28" height="48" rx="13" fill="' + c + '"/><rect x="' + (x - 4) + '" y="40" width="28" height="22" rx="4" fill="' + sh(c, -.12) + '"/><path d="M' + (x + 2) + ' 22 v14" stroke="#fff" stroke-width="3" opacity=".5" ' + L + '/>'; }
  function wrap(o, r) { return '<svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustração: ' + r.n.replace(/"/g, "") + '">' + o + '</svg>'; }

  return { receita: receita, CORTE: CORTE, corteSVG: corteSVG, etapa: etapa, achar: achar };
})();
