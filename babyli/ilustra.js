/* BabyLi: ilustrações desenhadas em SVG (receitas e guia de cortes para bebês) */
var IL = (function () {
  function sh(hex, k) { // escurece (k<0) ou clareia (k>0)
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function f(x) { return Math.max(0, Math.min(255, Math.round(k < 0 ? x * (1 + k) : x + (255 - x) * k))); }
    return "#" + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  }
  function rnd(seed) { var s = seed % 2147483647; if (s <= 0) s += 2147483646; return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; }; }
  function hash(t) { var h = 7; for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0; return Math.abs(h) + 1; }
  function n1(x) { return Math.round(x * 10) / 10; }
  var L = 'stroke-linecap="round" stroke-linejoin="round"';
  /* escala dos desenhos de corte: 1 cm = 11 unidades (a régua embaixo mostra) */
  var CM = 11;

  /* ---------- peças básicas ---------- */
  // pedaço com sombra embaixo e brilho em cima (parece ter volume)
  function peca(x, y, w, h, rx, c, rot) {
    var cx = n1(x + w / 2), cy = n1(y + h / 2);
    return '<g transform="rotate(' + n1(rot || 0) + ' ' + cx + ' ' + cy + ')">' +
      '<rect x="' + n1(x) + '" y="' + n1(y + 1.6) + '" width="' + n1(w) + '" height="' + n1(h) + '" rx="' + rx + '" fill="' + sh(c, -.32) + '"/>' +
      '<rect x="' + n1(x) + '" y="' + n1(y) + '" width="' + n1(w) + '" height="' + n1(h) + '" rx="' + rx + '" fill="' + c + '" stroke="' + sh(c, -.28) + '" stroke-width=".8"/>' +
      '<rect x="' + n1(x + w * .14) + '" y="' + n1(y + h * .16) + '" width="' + n1(w * .5) + '" height="' + n1(Math.max(1.2, h * .2)) + '" rx="' + n1(Math.min(rx, h * .1)) + '" fill="#fff" opacity=".35"/></g>';
  }
  // montinho de comida (purê) que fica dentro da tigela: base em y=40
  var MONTE = "M26 40 Q28 24 46 21 Q60 17 74 21 Q92 24 94 40 Q60 47 26 40 Z";
  function monte(c, textura) {
    return '<path d="' + MONTE + '" fill="' + c + '" stroke="' + sh(c, -.2) + '" stroke-width="1"/>' +
      '<path d="M28 38 Q60 45 92 38 Q93 40 94 40 Q60 47 26 40 Z" fill="' + sh(c, -.16) + '"/>' +
      (textura || '') +
      '<path d="M40 25 Q48 21 56 22" stroke="#fff" stroke-width="2.4" opacity=".45" fill="none" ' + L + '/>';
  }
  function espiral(c) { return '<path d="M44 33 q8 -5 16 0 q7 4 14 -1 M52 27 q7 -4 14 0" stroke="' + sh(c, -.22) + '" stroke-width="1.8" fill="none" ' + L + '/>'; }
  function pontos(R, n, x, y, w, h, f) { var o = ""; for (var i = 0; i < n; i++) o += f(x + R() * w, y + R() * h, i); return o; }
  function arv(x, y, s, c) {
    var cab = sh(c, .5);
    return '<g transform="translate(' + n1(x) + ' ' + n1(y) + ') scale(' + s + ')">' +
      '<path d="M-4 8 Q-5 24 -4 34 Q0 37 4 34 Q5 24 4 8 Z" fill="' + cab + '" stroke="' + sh(cab, -.18) + '" stroke-width="1"/>' +
      '<path d="M-2 14 L-8 6 M2 16 L8 7" stroke="' + cab + '" stroke-width="3.2" ' + L + '/>' +
      '<circle cx="-9" cy="6" r="8.5" fill="' + sh(c, -.12) + '"/><circle cx="9" cy="6" r="8.5" fill="' + sh(c, -.12) + '"/>' +
      '<circle cx="-4" cy="-3" r="9" fill="' + c + '"/><circle cx="6" cy="-4" r="8.5" fill="' + c + '"/>' +
      '<circle cx="-6" cy="-6" r="2.2" fill="' + sh(c, .3) + '"/><circle cx="4" cy="-8" r="2" fill="' + sh(c, .3) + '"/><circle cx="10" cy="2" r="1.8" fill="' + sh(c, .25) + '"/><circle cx="-11" cy="4" r="1.8" fill="' + sh(c, .25) + '"/></g>';
  }

  /* ---------- formas ----------
     "m": vai na tigela (purês e misturas), desenhada num montinho entre x 26-94 e y 18-46
     "t": vai na tábua (pedaços), entre x 16-104 e y 20-68, em tamanho real pela régua */
  var F = {
    pure: { v: "m", d: function (c) { return monte(c, espiral(c)); } },
    grumos: { v: "m", d: function (c, R) { return monte(c, espiral(c) + pontos(R, 9, 34, 25, 50, 13, function (x, y) { return peca(x, y, 5, 4.5, 1.6, sh(c, -.1), R() * 40 - 20); })); } },
    palito: { v: "t", t: "≈ 6 cm, um dedo", d: function (c) { // 6 cm x 1,2 cm
      return peca(27, 24, 6 * CM, 13, 6, c, -4) + peca(25, 41, 6 * CM, 13, 6, c, 2) + peca(29, 57, 6 * CM, 12, 6, c, -1);
    } },
    tira: { v: "t", t: "tira grande para chupar", d: function (c) {
      return '<path d="M18 46 Q40 32 62 38 Q84 44 102 34 L104 47 Q84 58 62 51 Q40 45 20 60 Z" fill="' + sh(c, -.3) + '" transform="translate(0 1.6)"/>' +
        '<path d="M18 46 Q40 32 62 38 Q84 44 102 34 L104 47 Q84 58 62 51 Q40 45 20 60 Z" fill="' + c + '"/>' +
        '<path d="M26 47 Q44 38 62 44 Q80 50 96 42" stroke="' + sh(c, .3) + '" stroke-width="1.6" fill="none" ' + L + '/>' +
        '<path d="M30 52 Q46 45 60 48" stroke="' + sh(c, -.2) + '" stroke-width="1.2" fill="none" ' + L + '/>';
    } },
    cubinho: { v: "t", t: "≈ 1 cm, uma ervilha", d: function (c, R) { // cubos de 1 cm
      var o = ""; for (var i = 0; i < 15; i++) { var x = 24 + (i % 5) * 15 + R() * 3, y = 25 + Math.floor(i / 5) * 14 + R() * 3; o += peca(x, y, CM, CM, 2.5, c, R() * 30 - 15); } return o;
    } },
    pedaco: { v: "t", t: "≈ 2 cm, uma uva grande", d: function (c, R) { // pedaços de 2 cm
      var o = ""; for (var i = 0; i < 6; i++) { var x = 23 + (i % 3) * 27 + R() * 3, y = 23 + Math.floor(i / 3) * 23 + R() * 2; o += peca(x, y, 2 * CM, 2 * CM - 2, 5, c, R() * 20 - 10); } return o;
    } },
    florete: { v: "t", t: "com cabinho para segurar", d: function (c) { return arv(42, 32, 1, c) + arv(80, 34, .92, sh(c, .06)); } },
    florete_peq: { v: "t", t: "floretes picadinhos", d: function (c) { var o = ""; for (var i = 0; i < 8; i++) o += arv(28 + (i % 4) * 21 + (i > 3 ? 8 : 0), 32 + Math.floor(i / 4) * 21, .36, c); return o; } },
    folha_picada: { v: "m", d: function (c, R) { return monte(sh(c, .78), pontos(R, 30, 33, 24, 54, 15, function (x, y) { return '<path d="M' + n1(x) + ' ' + n1(y) + ' l3.6 -1.8 l1.8 3.4 l-3.6 1.8 z" fill="' + (R() > .5 ? c : sh(c, .2)) + '"/>'; })); } },
    folha_tira: { v: "t", d: function (c, R) {
      var o = ""; for (var i = 0; i < 7; i++) { var x = 24 + i * 11; o += '<path d="M' + x + ' 26 q' + n1(5 + R() * 3) + ' 18 -1 38" stroke="' + sh(c, -.2) + '" stroke-width="5.4" fill="none" ' + L + '/><path d="M' + x + ' 26 q' + n1(5 + R() * 3) + ' 18 -1 38" stroke="' + (i % 2 ? c : sh(c, .15)) + '" stroke-width="3.6" fill="none" ' + L + '/>'; } return o;
    } },
    metade_casca: { v: "t", t: "metade com casca para segurar", d: function () {
      return '<path d="M20 52 Q34 30 64 30 L66 46 Q40 46 24 58 Z" fill="#f7eab5" stroke="#e1c97a" stroke-width="1.2"/>' +
        '<path d="M26 50 Q40 38 60 37" stroke="#ead48a" stroke-width="1.4" fill="none" ' + L + '/>' +
        '<path d="M62 28 Q86 28 100 40 Q104 46 101 52 Q84 52 66 48 Q60 40 62 28 Z" fill="#f2c53d" stroke="#c99a1f" stroke-width="1.4"/>' +
        '<path d="M68 33 Q84 34 96 44" stroke="#f8dc77" stroke-width="2" fill="none" ' + L + '/>' +
        '<path d="M99 41 Q104 44 104 50 L101 52 Z" fill="#6b4a1f"/>';
    } },
    rodela: { v: "t", t: "rodelas grossas, ≈ 1,5 cm", d: function (c) {
      var o = ""; for (var i = 0; i < 6; i++) { var x = 32 + (i % 3) * 28, y = 34 + Math.floor(i / 3) * 24;
        o += '<ellipse cx="' + x + '" cy="' + (y + 3) + '" rx="12" ry="11" fill="' + sh(c, -.25) + '"/><ellipse cx="' + x + '" cy="' + y + '" rx="12" ry="11" fill="' + sh(c, .55) + '" stroke="' + sh(c, -.05) + '" stroke-width="1.6"/>' +
          '<circle cx="' + x + '" cy="' + y + '" r="4" fill="' + sh(c, .3) + '"/><circle cx="' + (x - 1.5) + '" cy="' + (y - 1) + '" r=".9" fill="' + sh(c, -.5) + '"/><circle cx="' + (x + 1.6) + '" cy="' + (y + .4) + '" r=".9" fill="' + sh(c, -.5) + '"/><circle cx="' + x + '" cy="' + (y + 2) + '" r=".9" fill="' + sh(c, -.5) + '"/>'; }
      return o;
    } },
    tira_grande: { v: "t", t: "tiras grandes e bem maduras", d: function (c) {
      function t(y, k) { var p = 'M18 ' + (y + 6) + ' Q40 ' + (y - 4) + ' 70 ' + (y - 2) + ' Q92 ' + y + ' 102 ' + (y + 4) + ' Q100 ' + (y + 12) + ' 90 ' + (y + 13) + ' Q62 ' + (y + 10) + ' 22 ' + (y + 16) + ' Q16 ' + (y + 12) + ' 18 ' + (y + 6) + ' Z';
        return '<path d="' + p + '" fill="' + sh(c, -.25) + '" transform="translate(0 1.6)"/><path d="' + p + '" fill="' + (k ? sh(c, .06) : c) + '"/><path d="M28 ' + (y + 6) + ' Q52 ' + y + ' 86 ' + (y + 3) + '" stroke="#fff" stroke-width="2" opacity=".4" fill="none" ' + L + '/>'; }
      return t(26, 0) + t(46, 1);
    } },
    raspada: { v: "m", d: function (c) {
      return monte(sh(c, .1), espiral(c)) + '<g transform="rotate(-28 92 26)"><ellipse cx="92" cy="22" rx="8" ry="6" fill="var(--il-metal)" stroke="var(--il-metal-edge)" stroke-width="1.2"/><rect x="99" y="20" width="22" height="4" rx="2" fill="var(--il-metal)" stroke="var(--il-metal-edge)" stroke-width="1"/><ellipse cx="91" cy="21" rx="4.5" ry="3" fill="' + sh(c, .2) + '"/></g>';
    } },
    ralado: { v: "t", t: "ralado fininho", d: function (c, R) {
      return pontos(R, 46, 24, 26, 66, 36, function (x, y) { var dx = n1(6 + R() * 4), dy = n1(R() * 4 - 2); return '<path d="M' + n1(x) + ' ' + n1(y + 1) + ' l' + dx + ' ' + dy + '" stroke="' + sh(c, -.25) + '" stroke-width="2.6" ' + L + '/><path d="M' + n1(x) + ' ' + n1(y) + ' l' + dx + ' ' + dy + '" stroke="' + c + '" stroke-width="2.2" ' + L + '/>'; });
    } },
    quartos: { v: "t", t: "sempre em 4 no comprimento", d: function (c) { // uva de ~2 cm
      var o = '<ellipse cx="25" cy="36" rx="8.5" ry="11" fill="' + c + '"/><ellipse cx="22" cy="31" rx="2.4" ry="4" fill="#fff" opacity=".35"/>' +
        '<path d="M25 23 V49" stroke="#fff" stroke-width="1.6" stroke-dasharray="2.4 2.2"/><path d="M25 25 q1 -3 3 -4" stroke="#7a8a3a" stroke-width="1.6" fill="none" ' + L + '/>' +
        '<circle cx="25" cy="59" r="7" fill="' + c + '"/><circle cx="25" cy="59" r="5" fill="' + sh(c, .5) + '"/><path d="M25 52 V66 M18 59 H32" stroke="#fff" stroke-width="1.6"/>' +
        '<path d="M37 46 H48 M44 42 L48 46 L44 50" stroke="var(--il-ink)" stroke-width="1.8" fill="none" ' + L + '/>';
      [[60, -8], [73, -3], [86, 3], [99, 8]].forEach(function (p) {
        o += '<g transform="rotate(' + p[1] + ' ' + p[0] + ' 46)"><path d="M' + (p[0] - 4.5) + ' 46 Q' + (p[0] - 4.5) + ' 35 ' + p[0] + ' 35 Q' + (p[0] + 4.5) + ' 35 ' + (p[0] + 4.5) + ' 46 Q' + (p[0] + 4.5) + ' 57 ' + p[0] + ' 57 Q' + (p[0] - 4.5) + ' 57 ' + (p[0] - 4.5) + ' 46 Z" fill="' + c + '"/>' +
          '<path d="M' + (p[0] - 1) + ' 37 Q' + (p[0] - 3.4) + ' 46 ' + (p[0] - 1) + ' 55 L' + (p[0] + 2.6) + ' 55 Q' + (p[0] + 3) + ' 46 ' + (p[0] + 2.6) + ' 37 Z" fill="' + sh(c, .55) + '"/></g>';
      });
      return o;
    } },
    moida: { v: "m", t: "moída bem soltinha", d: function (c, R) { return monte(sh(c, .12), pontos(R, 44, 32, 24, 56, 16, function (x, y) { return '<circle cx="' + n1(x) + '" cy="' + n1(y) + '" r="' + n1(1.6 + R()) + '" fill="' + sh(c, R() > .5 ? -.2 : .05) + '"/>'; })); } },
    desfiado: { v: "t", t: "desfiado em fios finos", d: function (c, R) {
      return pontos(R, 20, 22, 28, 56, 32, function (x, y) { var p = 'M' + n1(x) + ' ' + n1(y) + ' q' + n1(8 + R() * 8) + ' ' + n1(R() * 8 - 4) + ' ' + n1(18 + R() * 10) + ' ' + n1(R() * 6 - 3); return '<path d="' + p + '" stroke="' + sh(c, -.22) + '" stroke-width="3.6" fill="none" ' + L + ' transform="translate(0 1)"/><path d="' + p + '" stroke="' + c + '" stroke-width="2.8" fill="none" ' + L + '/>'; });
    } },
    lascas: { v: "t", t: "lascas sem espinha", d: function (c, R) {
      var o = ""; for (var i = 0; i < 10; i++) { var x = 28 + (i % 5) * 16 + R() * 3, y = 36 + Math.floor(i / 5) * 18 + R() * 3, a = n1(R() * 50 - 25);
        o += '<g transform="rotate(' + a + ' ' + n1(x) + ' ' + n1(y) + ')"><ellipse cx="' + n1(x) + '" cy="' + n1(y + 1.4) + '" rx="8" ry="5" fill="' + sh(c, -.25) + '"/><ellipse cx="' + n1(x) + '" cy="' + n1(y) + '" rx="8" ry="5" fill="' + c + '" stroke="' + sh(c, -.3) + '" stroke-width=".8"/><path d="M' + n1(x - 4) + ' ' + n1(y - 2) + ' q2 3 0 5 M' + n1(x) + ' ' + n1(y - 3) + ' q2 3 0 6 M' + n1(x + 4) + ' ' + n1(y - 2) + ' q2 3 0 5" stroke="' + sh(c, -.12) + '" stroke-width="1" fill="none"/></g>'; }
      return o;
    } },
    ovo_amassado: { v: "m", d: function (c, R) { return monte("#f7cf3d", pontos(R, 12, 34, 25, 50, 14, function (x, y) { return '<rect x="' + n1(x) + '" y="' + n1(y) + '" width="5.5" height="4.5" rx="2" fill="#fffaf0"/>'; })); } },
    ovo_quartos: { v: "t", t: "ovo cozido em quartos", d: function () {
      var o = ""; [[30, 44, -14], [52, 42, 6], [74, 44, -6], [96, 42, 14]].forEach(function (p) { var x = p[0], y = p[1];
        var cunha = 'M' + (x - 9) + ' ' + (y + 20) + ' Q' + (x - 9) + ' ' + (y - 22) + ' ' + x + ' ' + (y - 22) + ' Q' + (x + 9) + ' ' + (y - 22) + ' ' + (x + 9) + ' ' + (y + 20) + ' Z';
        o += '<g transform="rotate(' + p[2] + ' ' + x + ' ' + y + ')"><path d="' + cunha + '" fill="#d8cfbd" transform="translate(0 1.6)"/>' +
          '<path d="' + cunha + '" fill="#fffaf0" stroke="#e3dccb" stroke-width="1.2"/>' +
          '<path d="M' + (x - 6) + ' ' + (y + 12) + ' Q' + (x - 6) + ' ' + (y - 8) + ' ' + x + ' ' + (y - 8) + ' Q' + (x + 6) + ' ' + (y - 8) + ' ' + (x + 6) + ' ' + (y + 12) + ' Z" fill="#f7c331"/><ellipse cx="' + (x - 2) + '" cy="' + (y - 2) + '" rx="1.6" ry="4" fill="#fff" opacity=".4"/></g>'; });
      return o;
    } },
    ovo_picado: { v: "t", t: "picadinho", d: function (c, R) { var o = ""; for (var i = 0; i < 15; i++) { var x = 24 + (i % 5) * 15 + R() * 3, y = 25 + Math.floor(i / 5) * 14 + R() * 3; o += peca(x, y, CM, CM - 1, 2.5, i % 3 ? "#fff6e4" : "#f7c331", R() * 30 - 15); } return o; } },
    graos_amassados: { v: "m", t: "amassados com caldo", d: function (c, R) { return monte(sh(c, .2), pontos(R, 9, 34, 26, 50, 12, function (x, y) { return '<ellipse cx="' + n1(x) + '" cy="' + n1(y) + '" rx="4" ry="2.6" fill="' + sh(c, -.2) + '"/>'; })); } },
    graos: { v: "m", t: "grãos levemente amassados", d: function (c, R) { return monte(sh(c, .38), pontos(R, 30, 32, 24, 56, 16, function (x, y) { var a = n1(R() * 180); return '<g transform="rotate(' + a + ' ' + n1(x) + ' ' + n1(y) + ')"><ellipse cx="' + n1(x) + '" cy="' + n1(y) + '" rx="4.4" ry="2.9" fill="' + c + '"/><ellipse cx="' + n1(x - 1.4) + '" cy="' + n1(y - 1) + '" rx="1.6" ry=".8" fill="#fff" opacity=".35"/></g>'; })); } },
    macarrao_peq: { v: "m", t: "pequeno e bem cozido", d: function (c, R) { return monte(sh(c, .55), pontos(R, 24, 32, 24, 56, 16, function (x, y) { return '<circle cx="' + n1(x) + '" cy="' + n1(y) + '" r="3" fill="none" stroke="' + sh(c, -.12) + '" stroke-width="2.2"/>'; })); } },
    parafuso: { v: "t", t: "cortado ao meio", d: function (c, R) {
      var o = ""; for (var i = 0; i < 7; i++) { var x = 22 + (i % 4) * 21 + (i > 3 ? 10 : 0) + R() * 3, y = 28 + Math.floor(i / 4) * 20, a = n1(R() * 40 - 20);
        o += '<g transform="rotate(' + a + ' ' + n1(x + 10) + ' ' + y + ')">' + peca(x, y - 4.5, 20, 9, 4.5, c, 0) + '<path d="M' + n1(x + 4) + ' ' + (y - 4) + ' l3 8 M' + n1(x + 9) + ' ' + (y - 4) + ' l3 8 M' + n1(x + 14) + ' ' + (y - 4) + ' l3 8" stroke="' + sh(c, -.25) + '" stroke-width="1.4" ' + L + '/></g>'; }
      return o;
    } },
    arroz_papa: { v: "m", d: function () { return monte("#f6f1e4", '<path d="M44 33 q8 -5 16 0 q7 4 14 -1 M52 27 q7 -4 14 0" stroke="#ddd3bd" stroke-width="1.8" fill="none" ' + L + '/>'); } },
    arroz: { v: "m", d: function (c, R) { return monte("#f6f1e4", pontos(R, 50, 32, 23, 56, 18, function (x, y) { return '<ellipse cx="' + n1(x) + '" cy="' + n1(y) + '" rx="2.6" ry="1.3" fill="' + (R() > .4 ? "#e2d8bf" : "#fffdf6") + '" transform="rotate(' + n1(R() * 180) + ' ' + n1(x) + ' ' + n1(y) + ')"/>'; })); } }
  };
  var CAIXA = { m: [26, 18, 68, 30], t: [16, 20, 88, 48] };

  /* ---------- tábua, tigelinha, etiqueta e régua do guia de cortes ---------- */
  function tabua() {
    return '<rect x="7" y="20" width="106" height="54" rx="10" fill="var(--il-board-edge)"/>' +
      '<rect x="7" y="17" width="106" height="54" rx="10" fill="var(--il-board)"/>' +
      '<path d="M16 30 Q50 27 86 31 M22 50 Q60 47 104 51 M14 62 Q40 60 70 63" stroke="var(--il-board-edge)" stroke-width="1" fill="none" opacity=".7" ' + L + '/>';
  }
  function tigelinha(fundo) {
    return { atras: '<ellipse cx="60" cy="77" rx="34" ry="4" fill="var(--il-shadow)"/>' +
      '<path d="M20 38 H100 Q98 72 60 75 Q22 72 20 38 Z" fill="var(--il-plate)" stroke="var(--il-rim)" stroke-width="1.4"/>' +
      '<path d="M24 50 Q60 60 96 50" stroke="var(--il-accent)" stroke-width="3" fill="none" opacity=".7" ' + L + '/>' +
      '<ellipse cx="60" cy="38" rx="40" ry="8" fill="' + (fundo || "var(--il-plate-in)") + '" stroke="var(--il-rim)" stroke-width="1.4"/>',
      frente: '<path d="M20.5 38.6 Q60 52 99.5 38.6" stroke="var(--il-plate)" stroke-width="2.4" fill="none"/><path d="M20 39 Q60 53 100 39" stroke="var(--il-rim)" stroke-width="1" fill="none"/>' };
  }
  function etiqueta(t) {
    var w = n1(t.length * 3.55 + 10);
    return '<rect x="7" y="4" width="' + w + '" height="11" rx="5.5" fill="var(--il-tag)"/><text x="12" y="11.9" font-size="6.6" font-family="Nunito, sans-serif" font-weight="800" fill="var(--il-tag-ink)">' + t + '</text>';
  }
  function regua() {
    var o = '<rect x="15" y="78" width="' + (8 * CM + 2) + '" height="8" rx="2" fill="var(--il-ruler)"/>';
    for (var i = 0; i <= 8; i++) o += '<path d="M' + (16 + i * CM) + ' 78 v' + (i % 2 ? 2.6 : 4) + '" stroke="var(--il-ink)" stroke-width=".7"/>';
    return o + '<text x="' + (17 + 8 * CM + 3) + '" y="85.2" font-size="5.6" font-family="Nunito, sans-serif" font-weight="800" fill="var(--il-ink)">cm</text>';
  }

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
    var e = etapa(c, m), R = rnd(hash(c.k + e[1])), f = F[e[1]], o = '<rect width="120" height="90" fill="var(--il-bg)"/>';
    if (f.v === "t") o += tabua() + f.d(c.cor, R) + regua();
    else { var tg = tigelinha(); o += tg.atras + f.d(c.cor, R) + tg.frente; }
    if (f.t) o += etiqueta(f.t);
    return '<svg viewBox="0 0 120 90" class="' + (cls || "") + '" role="img" aria-label="' + c.nome + ': ' + e[2] + '">' + o + '</svg>';
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
  // uma porção do alimento, centrada em (cx, cy) com largura w
  function porcao(item, m, cx, cy, w, R) {
    var forma = etapa(item.c, Math.min(m, 12))[1];
    if (m >= 12) forma = { cenoura: "pedaco", abobora: "pedaco", batata: "pedaco", brocolis: "florete", folhas: "folha_tira", banana: "rodela", mamao: "pedaco", maca: "pedaco", uva: "quartos", carne: "pedaco", frango: "desfiado", peixe: "lascas", ovo: "ovo_picado", feijao: "graos", arroz: "arroz", macarrao: "parafuso" }[item.c.k];
    var f = F[forma], b = CAIXA[f.v], s = w / b[2];
    return '<g transform="translate(' + n1(cx - (b[0] + b[2] / 2) * s) + ' ' + n1(cy - (b[1] + b[3] / 2) * s) + ') scale(' + n1(s * 1000) / 1000 + ')">' + f.d(item.cor, R) + '</g>';
  }

  /* ---------- louça ---------- */
  function prato() {
    return '<ellipse cx="61" cy="56" rx="55" ry="32" fill="var(--il-shadow)"/>' +
      '<ellipse cx="60" cy="50" rx="55" ry="33" fill="var(--il-plate)" stroke="var(--il-rim)" stroke-width="1.4"/>' +
      '<ellipse cx="60" cy="51" rx="43" ry="24" fill="var(--il-plate-in)"/>' +
      '<path d="M22 38 Q34 22 60 20" stroke="#fff" stroke-width="2.4" opacity=".55" fill="none" ' + L + '/>';
  }
  function travessa(cy) { // pratinho raso para bolinhos, pães e lanches
    cy = cy || 64;
    return '<ellipse cx="61" cy="' + (cy + 4) + '" rx="50" ry="14" fill="var(--il-shadow)"/><ellipse cx="60" cy="' + cy + '" rx="50" ry="16" fill="var(--il-plate)" stroke="var(--il-rim)" stroke-width="1.4"/><ellipse cx="60" cy="' + (cy + 1) + '" rx="38" ry="10" fill="var(--il-plate-in)"/>';
  }
  function toalha(R) { // bolinhas suaves da toalha de mesa
    var o = ""; for (var i = 0; i < 9; i++) o += '<circle cx="' + n1(6 + (i % 5) * 27 + R() * 6) + '" cy="' + n1(8 + Math.floor(i / 5) * 72 + R() * 6) + '" r="2" fill="var(--il-dot)"/>';
    return o;
  }

  /* ---------- ilustração da receita ---------- */
  var FUNDO = { almoco: "var(--pumpkin-soft)", cafe: "var(--warn-soft)", lanche: "var(--ok-soft)", fruta: "var(--beet-soft)", bebida: "var(--ok-soft)", sobremesa: "var(--beet-soft)" };
  function receita(r) {
    var R = rnd(hash(r.n)), itens = achar(r), m = r.f, nm = r.n.toLowerCase(), o = "";
    var cor1 = (itens[0] && itens[0].cor) || "#f2c94c", cor2 = (itens[1] && itens[1].cor) || sh(cor1, -.15);
    o += '<rect width="120" height="90" fill="' + FUNDO[r.t] + '"/>' + toalha(R);
    if (r.t === "bebida") {
      var liq = /vitamina|leite|shake|chocolate|smoothie|iogurte/.test(nm) ? sh(cor1, .55) : /agua|água/.test(nm) ? "#d9eef7" : cor1;
      if (/chocolate|cacau/.test(nm)) liq = "#8a5a3c";
      o += '<ellipse cx="61" cy="81" rx="22" ry="4" fill="var(--il-shadow)"/>' +
        '<path d="M66 6 L58 52" stroke="#e86f9d" stroke-width="4" ' + L + '/><path d="M65.3 10 L64 17.5 M63.8 24 L62.5 31.5 M62.3 38 L61 45.5" stroke="#fff" stroke-width="4" opacity=".75"/>' +
        '<path d="M44 18 H76 L72 78 Q60 82 48 78 Z" fill="var(--il-glass)" stroke="var(--il-rim)" stroke-width="1.6"/>' +
        '<path d="M45.4 32 H74.6 L71.4 76.4 Q60 79.6 48.6 76.4 Z" fill="' + liq + '"/>' +
        '<ellipse cx="60" cy="32" rx="14.6" ry="2.2" fill="' + sh(liq, .25) + '"/>' +
        '<path d="M49 36 L51 72" stroke="#fff" stroke-width="2.4" opacity=".5" ' + L + '/>' +
        '<circle cx="79" cy="21" r="10" fill="' + cor2 + '" stroke="' + sh(cor2, -.25) + '" stroke-width="1.5"/><circle cx="79" cy="21" r="7" fill="' + sh(cor2, .3) + '"/><path d="M79 14 V28 M72 21 H86 M74 16 L84 26 M84 16 L74 26" stroke="' + sh(cor2, -.05) + '" stroke-width=".9"/>';
      if (/agua|água/.test(nm)) for (var i = 0; i < 3; i++) o += '<circle cx="' + (53 + i * 7) + '" cy="' + (50 + i * 8) + '" r="4" fill="' + (itens[i] ? itens[i].cor : cor1) + '" opacity=".85"/>';
      return wrap(o, r);
    }
    if (r.t === "sobremesa" && /picol/.test(nm)) {
      o += '<ellipse cx="60" cy="82" rx="40" ry="4" fill="var(--il-shadow)"/>' + pic(34, cor1, -6) + pic(70, cor2, 6);
      return wrap(o, r);
    }
    if (/bolo|muffin|bolinho de|cookie|biscoit|brigadeiro|pa[cç]oca|p[aã]o de queijo|barrinha|empad|coxinha|esfiha|pastel/.test(nm)) {
      o += travessa();
      var tipoMassa = /bolo|muffin|bolinho/.test(nm) ? (/chocolate|cacau|beterraba/.test(nm) ? "#7a4a2e" : "#e8b866") : /brigadeiro/.test(nm) ? "#6b4128" : "#e3b36c";
      if (/bolo/.test(nm) && !/muffin|bolinho/.test(nm)) {
        // duas fatias de bolo
        [[34, 62], [62, 58]].forEach(function (p) { var x = p[0], y = p[1];
          o += '<path d="M' + x + ' ' + y + ' l30 -6 l0 -16 l-30 6 z" fill="' + tipoMassa + '"/>' +
            '<path d="M' + x + ' ' + y + ' l0 -16 l-8 -9 l0 16 z" fill="' + sh(tipoMassa, -.18) + '"/>' +
            '<path d="M' + x + ' ' + (y - 16) + ' l30 -6 l-8 -9 l-30 6 z" fill="' + sh(tipoMassa, .3) + '"/>' +
            '<path d="M' + x + ' ' + (y - 8) + ' l30 -6" stroke="' + sh(cor1, .2) + '" stroke-width="2"/>' +
            pontos(R, 6, x + 3, y - 14, 24, 10, function (a, b) { return '<circle cx="' + n1(a) + '" cy="' + n1(b - (a - x) * .2) + '" r=".9" fill="' + sh(tipoMassa, -.3) + '"/>'; }); });
        return wrap(o, r);
      }
      for (var j = 0; j < 4; j++) {
        var x = 27 + j * 22, y = 58 - (j % 2) * 4;
        if (/muffin|bolinho/.test(nm)) {
          o += '<path d="M' + (x - 9) + ' ' + y + ' L' + (x - 7) + ' ' + (y + 11) + ' H' + (x + 7) + ' L' + (x + 9) + ' ' + y + ' Z" fill="' + sh(cor1, .45) + '" stroke="' + sh(cor1, .1) + '" stroke-width=".8"/>' +
            '<path d="M' + (x - 5) + ' ' + (y + 1) + ' l.8 9.5 M' + x + ' ' + (y + 1) + ' v9.5 M' + (x + 5) + ' ' + (y + 1) + ' l-.8 9.5" stroke="' + sh(cor1, .1) + '" stroke-width=".8"/>' +
            '<path d="M' + (x - 10) + ' ' + (y + .5) + ' Q' + (x - 10) + ' ' + (y - 11) + ' ' + x + ' ' + (y - 11) + ' Q' + (x + 10) + ' ' + (y - 11) + ' ' + (x + 10) + ' ' + (y + .5) + ' Z" fill="' + tipoMassa + '"/>' +
            '<path d="M' + (x - 6) + ' ' + (y - 6) + ' q3 -3 6 -3" stroke="#fff" stroke-width="1.6" opacity=".45" fill="none" ' + L + '/>' +
            '<circle cx="' + (x + 3) + '" cy="' + (y - 5) + '" r="2" fill="' + cor1 + '"/><circle cx="' + (x - 3) + '" cy="' + (y - 2) + '" r="1.6" fill="' + sh(cor1, -.15) + '"/>';
        } else {
          o += '<circle cx="' + x + '" cy="' + (y + 1.6) + '" r="9" fill="' + sh(tipoMassa, -.3) + '"/><circle cx="' + x + '" cy="' + y + '" r="9" fill="' + tipoMassa + '"/>' +
            '<path d="M' + (x - 5) + ' ' + (y - 4) + ' q3 -2.6 6 -2.6" stroke="#fff" stroke-width="1.6" opacity=".4" fill="none" ' + L + '/>' +
            '<circle cx="' + (x - 2) + '" cy="' + (y + 1) + '" r="1.5" fill="' + sh(tipoMassa, -.4) + '"/><circle cx="' + (x + 3) + '" cy="' + (y + 3) + '" r="1.3" fill="' + sh(tipoMassa, -.4) + '"/><circle cx="' + (x + 2) + '" cy="' + (y - 3) + '" r="1.1" fill="' + sh(tipoMassa, -.35) + '"/>';
        }
      }
      return wrap(o, r);
    }
    if (/panqueca|panquequinha|waffle/.test(nm)) {
      o += travessa(66);
      for (var p = 0; p < 4; p++) o += '<ellipse cx="60" cy="' + (62 - p * 6) + '" rx="30" ry="9" fill="#c98d39"/><ellipse cx="60" cy="' + (60.5 - p * 6) + '" rx="30" ry="8.4" fill="#e7b25e"/>';
      o += '<path d="M44 40 Q60 34 76 40 Q74 46 66 44 Q64 50 60 46 Q54 48 52 44 Q44 46 44 40 Z" fill="' + sh(cor1, .1) + '" opacity=".9"/>' +
        '<circle cx="54" cy="38" r="4.6" fill="' + cor1 + '"/><circle cx="66" cy="37" r="4" fill="' + cor2 + '"/><circle cx="52.6" cy="36.6" r="1.2" fill="#fff" opacity=".5"/>';
      return wrap(o, r);
    }
    if (/sandu[ií]che|wrap|torrada|p[aã]o |p[aã]o$|queijo quente|hot dog|burrito|tacos|pizza/.test(nm)) {
      o += travessa();
      if (/pizza/.test(nm)) o += '<circle cx="60" cy="55" r="30" fill="#c99447"/><circle cx="60" cy="54" r="30" fill="#e9b863"/><circle cx="60" cy="54" r="25" fill="#d9453b"/><path d="M40 52 Q46 40 60 38 Q76 38 80 54 Q78 68 62 70 Q42 68 40 52 Z" fill="#f7e3a1"/>' +
        '<circle cx="50" cy="48" r="4" fill="#d9453b"/><circle cx="68" cy="60" r="4" fill="#d9453b"/><circle cx="64" cy="45" r="3" fill="' + cor1 + '"/><circle cx="52" cy="61" r="2.6" fill="' + cor2 + '"/><path d="M60 24 V84 M30 54 H90" stroke="#c99447" stroke-width="1" opacity=".6"/>';
      else o += '<path d="M28 68 L60 32 L92 68 Z" fill="#c9a061"/><path d="M28 66 L60 30 L92 66 Z" fill="#ecd09a" stroke="#c9a061" stroke-width="2.4" stroke-linejoin="round"/>' +
        '<path d="M36 62 L60 36 L84 62" stroke="' + cor1 + '" stroke-width="5" fill="none" ' + L + '/><path d="M40 58 L60 40 L80 58" stroke="' + cor2 + '" stroke-width="3" fill="none" ' + L + '/>' +
        '<path d="M44 58 L60 42 L76 58 Z" fill="#f5e2b8"/>';
      return wrap(o, r);
    }
    if (/palitos|chips/.test(nm)) {
      o += travessa();
      for (var q = 0; q < 6; q++) o += /chips/.test(nm) ? '<circle cx="' + (30 + q * 11) + '" cy="' + (58.6 + (q % 2) * 5) + '" r="8" fill="' + sh(cor1, -.3) + '"/><circle cx="' + (30 + q * 11) + '" cy="' + (57 + (q % 2) * 5) + '" r="8" fill="' + cor1 + '"/><circle cx="' + (28 + q * 11) + '" cy="' + (55 + (q % 2) * 5) + '" r="2.4" fill="#fff" opacity=".35"/>' : peca(20 + q * 9, 38 + (q % 2) * 4, 7, 30, 3.5, q % 2 ? cor2 : cor1, q * 6 - 15);
      if (/pasta|homus|guacamole|iogurte/.test(nm + r.i.join(" "))) o += '<ellipse cx="92" cy="58" rx="14" ry="8" fill="var(--il-plate)" stroke="var(--il-rim)" stroke-width="1.4"/><ellipse cx="92" cy="57" rx="11" ry="5" fill="' + (/guacamole/.test(nm) ? "#9bc45a" : "#efe3c4") + '"/>';
      return wrap(o, r);
    }
    if (/pipoca/.test(nm)) { var tp = tigela(); o += tp.atras; for (var w = 0; w < 18; w++) { var px = 32 + R() * 56, py = 30 + R() * 14; o += '<circle cx="' + n1(px) + '" cy="' + n1(py) + '" r="5" fill="#fff8e6" stroke="#e8d7a8"/><circle cx="' + n1(px + 2) + '" cy="' + n1(py - 2) + '" r="2.4" fill="#fffdf6"/>'; } return wrap(o + tp.frente, r); }
    // tigela (fruta, papinha de cereal, mingau, iogurte, sopa, sorvete, gelatina, café de colher)
    var tigelaTipo = r.t === "fruta" || /mingau|papinha de (aveia|quinoa|arroz|fub)|iogurte|sopa|creme|canja|sorvete|gelatina|mousse|pudim|overnight|granola|salada de frutas|doce de|arroz-doce|caldo/.test(nm);
    if (tigelaTipo && r.t !== "almoco" || /sopa|canja|creme de/.test(nm)) {
      var base = /iogurte|mingau|overnight|arroz-doce|pudim/.test(nm) ? "#f8f3e6" : /sopa|canja|caldo|creme de/.test(nm) ? sh(cor1, .35) : /gelatina/.test(nm) ? cor1 : null;
      var tg = tigela(base);
      o += tg.atras;
      var its = itens.length ? itens : [{ c: CORTE[6], cor: cor1 }];
      if (/sorvete/.test(nm)) { o += '<circle cx="48" cy="34" r="13" fill="#f6e27a"/><circle cx="72" cy="32" r="13" fill="' + (its[1] ? its[1].cor : cor1) + '"/><circle cx="44" cy="29" r="3.4" fill="#fff" opacity=".4"/><circle cx="68" cy="27" r="3.4" fill="#fff" opacity=".4"/>' + tg.frente; return wrap(o, r); }
      var n3 = Math.min(3, its.length), cx3 = n3 === 1 ? [60] : n3 === 2 ? [46, 74] : [38, 60, 82], w3 = n3 === 1 ? 46 : n3 === 2 ? 34 : 26;
      its.slice(0, 3).forEach(function (it, k) { o += porcao(it, m, cx3[k], 34 + (k % 2) * 2, w3, R); });
      return wrap(o + tg.frente, r);
    }
    // prato com porções (almoço e o resto)
    o += prato();
    var lst = itens.slice(0, 4);
    if (!lst.length) lst = [{ c: CORTE[14], cor: "#f6f1e4" }];
    var cs = lst.length === 1 ? [[60, 50, 64]] : lst.length === 2 ? [[39, 50, 40], [81, 50, 40]] : lst.length === 3 ? [[39, 40, 34], [81, 40, 34], [60, 63, 34]] : [[40, 39, 32], [80, 39, 32], [40, 62, 32], [80, 62, 32]];
    lst.forEach(function (it, k) { o += porcao(it, m, cs[k][0], cs[k][1], cs[k][2], R); });
    return wrap(o, r);
  }
  function tigela(base) {
    return { atras: '<ellipse cx="61" cy="82" rx="40" ry="5" fill="var(--il-shadow)"/>' +
      '<path d="M16 40 H104 Q102 80 60 82 Q18 80 16 40 Z" fill="var(--il-plate)" stroke="var(--il-rim)" stroke-width="1.4"/>' +
      '<path d="M20 56 Q60 68 100 56" stroke="var(--il-accent)" stroke-width="3.4" fill="none" opacity=".75" ' + L + '/>' +
      '<path d="M24 66 Q60 76 96 66" stroke="var(--il-accent)" stroke-width="1.6" fill="none" opacity=".45" ' + L + '/>' +
      '<ellipse cx="60" cy="40" rx="44" ry="10" fill="' + (base || "var(--il-plate-in)") + '" stroke="var(--il-rim)" stroke-width="1.4"/>',
      frente: '<path d="M16.5 40.6 Q60 56 103.5 40.6" stroke="var(--il-plate)" stroke-width="2.6" fill="none"/><path d="M16 41 Q60 57 104 41" stroke="var(--il-rim)" stroke-width="1" fill="none"/>' };
  }
  function pic(x, c, rot) {
    return '<g transform="rotate(' + rot + ' ' + (x + 10) + ' 60)"><rect x="' + (x + 7) + '" y="58" width="6" height="22" rx="3" fill="#d9b483"/><rect x="' + (x - 4) + '" y="14" width="28" height="48" rx="13" fill="' + c + '"/><rect x="' + (x - 4) + '" y="40" width="28" height="22" rx="4" fill="' + sh(c, -.12) + '"/>' +
      '<path d="M' + (x - 4) + ' 40 q7 4 14 0 t14 0" stroke="' + sh(c, .25) + '" stroke-width="2" fill="none"/><path d="M' + (x + 2) + ' 22 v14" stroke="#fff" stroke-width="3" opacity=".5" ' + L + '/></g>';
  }
  function wrap(o, r) { return '<svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustração: ' + r.n.replace(/"/g, "") + '">' + o + '</svg>'; }

  return { receita: receita, CORTE: CORTE, corteSVG: corteSVG, etapa: etapa, achar: achar };
})();
