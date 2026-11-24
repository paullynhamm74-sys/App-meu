# Gera babyli/receitas.js: completa 50 receitas por fase (6 meses a 5 anos).
# Rode: python3 babyli/tools/gerar_receitas.py
# Regras seguidas: sem sal até 1 ano, sem açúcar e mel até 2 anos, sem leite de vaca
# como bebida antes de 1 ano, sem suco antes de 1 ano, cortes seguros contra engasgo.
import json, os, itertools, random, re

AQUI = os.path.dirname(os.path.abspath(__file__))
EXIST = json.load(open(os.path.join(AQUI, "existentes.json")))
USADOS = set(r["n"].lower() for r in EXIST)

FASES = [6, 7, 8, 9, 10, 11, 12, 24, 36, 48]  # 1 a 2, 2 a 3, 3 a 4 e 4 a 5 anos
BEBE = [6, 7, 8, 9, 10, 11]
ALVO = {
    6: dict(almoco=30, fruta=16, cafe=3, bebida=1),
    7: dict(almoco=30, fruta=14, cafe=4, lanche=2),
    8: dict(almoco=28, fruta=10, cafe=5, lanche=7),
    9: dict(almoco=26, fruta=8, cafe=6, lanche=10),
    10: dict(almoco=25, fruta=7, cafe=6, lanche=9, sobremesa=3),
    11: dict(almoco=25, fruta=6, cafe=7, lanche=9, sobremesa=3),
    12: dict(almoco=20, cafe=8, lanche=8, fruta=3, bebida=7, sobremesa=4),
    24: dict(almoco=20, cafe=7, lanche=9, fruta=2, bebida=6, sobremesa=6),
    36: dict(almoco=20, cafe=7, lanche=9, fruta=2, bebida=6, sobremesa=6),
    48: dict(almoco=20, cafe=7, lanche=9, fruta=2, bebida=6, sobremesa=6),
}
for f, alvo in ALVO.items():
    assert sum(alvo.values()) == 50, f

def fase_de(f):
    return [x for x in FASES if f >= x][-1]

existentes = {}
for r in EXIST:
    k = (fase_de(r["f"]), r["t"])
    existentes[k] = existentes.get(k, 0) + 1

def R(n, f, t, tp, r, i, p, d):
    return dict(n=n, f=f, t=t, tp=tp, r=r, i=i, p=p, d=d)

def cap(s):
    return s[0].upper() + s[1:]

# ------------------------------------------------------------------ textura
def corte(f, a, b=None):
    alvo = a + (" e " + b if b else "")
    return {
        6: "Amasse " + alvo + " com garfo, cada um separado. Não use liquidificador nem peneira.",
        7: "Amasse " + alvo + " com garfo, deixando pequenos pedacinhos macios.",
        8: "Amasse " + alvo + " grosseiramente e deixe alguns pedaços em palitos macios para ela pegar.",
        9: "Pique " + alvo + " em cubinhos pequenos e macios.",
        10: "Pique " + alvo + " em cubinhos e deixe alguns pedaços maiores para ela pegar com a mão.",
        11: "Corte " + alvo + " em pedaços macios do tamanho de uma uva grande.",
    }[f]

def tempero(f):
    return "Cebola, alho e cheiro-verde (sem sal)" if f < 12 else "Cebola, alho, cheiro-verde e sal (pouco)"

# ------------------------------------------------------------------ bebês: componentes
CARBS = [
    ("mandioquinha", "1 mandioquinha média", "Descasque a mandioquinha, corte em cubos e cozinhe em água por 15 minutos, até ficar bem macia.", 6),
    ("batata", "1 batata pequena", "Descasque a batata, corte em cubos e cozinhe em água até ficar bem macia.", 6),
    ("batata-doce", "1 batata-doce pequena", "Descasque a batata-doce, corte em cubos e cozinhe no vapor por 15 minutos.", 6),
    ("inhame", "1 inhame médio", "Descasque o inhame (use luvas, ele pode coçar), corte e cozinhe em água por 15 a 20 minutos.", 6),
    ("mandioca", "1 pedaço de mandioca (100 g)", "Cozinhe a mandioca descascada em água até começar a desmanchar e retire o fio do meio.", 6),
    ("arroz", "3 colheres (sopa) de arroz", "Cozinhe o arroz com o triplo de água até ficar bem molinho.", 6),
    ("cará", "1 cará pequeno", "Descasque o cará, corte em cubos e cozinhe em água por 15 minutos.", 6),
    ("quinoa", "2 colheres (sopa) de quinoa", "Lave bem a quinoa numa peneira e cozinhe com o dobro de água por 15 minutos.", 6),
    ("polenta", "3 colheres (sopa) de fubá", "Dissolva o fubá em 1 xícara de água fria e cozinhe mexendo por 15 minutos, até virar um creme.", 6),
    ("macarrãozinho", "3 colheres (sopa) de macarrão pequeno", "Cozinhe o macarrão em bastante água até ficar bem macio.", 7),
    ("cuscuz de milho", "3 colheres (sopa) de flocão de milho", "Hidrate o flocão com água por 10 minutos e cozinhe no vapor (cuscuzeira) por 10 minutos.", 9),
]
PROTS = [
    ("frango", "2 colheres (sopa) de peito de frango picado",
     "Refogue a cebola no azeite, junte o frango e meia xícara de água e cozinhe por 15 minutos, até ficar bem macio.",
     {6: "Desfie o frango bem fininho.", 8: "Desfie o frango em fios.", 9: "Pique o frango bem pequeno.", 11: "Corte o frango em pedacinhos macios."}, "Frango é proteína leve e fácil de mastigar."),
    ("carne moída", "2 colheres (sopa) de carne moída (patinho)",
     "Refogue o alho e a carne no azeite, junte meia xícara de água e cozinhe até a carne ficar macia.",
     {6: "Mexa a carne com garfo até ficar bem soltinha, sem bolinhas.", 9: "Sirva a carne moída soltinha e úmida."}, "Carne vermelha é a melhor fonte de ferro para o bebê."),
    ("carne desfiada", "60 g de músculo ou acém em cubos",
     "Cozinhe a carne na pressão com cebola, alho e água por 25 minutos, até desmanchar.",
     {6: "Desfie a carne bem fininho.", 8: "Desfie em fios ou ofereça uma tira grande e macia para ela chupar.", 9: "Pique a carne bem pequena."}, "Cozinhe mais carne e congele em porções para a semana."),
    ("peixe", "1 filé pequeno de tilápia ou pescada (80 g)",
     "Cozinhe o peixe em meia xícara de água com cebola por 8 minutos.",
     {6: "Desfie o peixe conferindo cada lasca com os dedos para tirar as espinhas.", 9: "Separe em lascas, conferindo as espinhas com os dedos."}, "Peixe 1 a 2 vezes por semana. Evite cação e peixe-espada."),
    ("ovo", "1 ovo",
     "Cozinhe o ovo por 10 a 12 minutos, até a gema ficar bem firme.",
     {6: "Amasse o ovo inteiro (gema e clara) com garfo.", 8: "Corte o ovo em quartos para ela pegar.", 9: "Pique o ovo."}, "O ovo inteiro pode desde os 6 meses, sempre bem cozido."),
    ("lombo", "60 g de lombo de porco em cubos",
     "Refogue o lombo no azeite com alho, junte água e cozinhe até ficar bem macio (10 minutos na pressão).",
     {6: "Desfie o lombo bem fininho.", 9: "Pique o lombo bem pequeno."}, "Carne de porco sempre bem cozida, nunca rosada por dentro."),
    ("salmão", "1 pedaço pequeno de salmão sem pele (70 g)",
     "Asse o salmão em papel-manteiga a 200 °C por 12 minutos.",
     {6: "Desfie o salmão conferindo as espinhas com os dedos.", 9: "Separe em lascas, conferindo as espinhas."}, "Salmão tem ômega-3, bom para o cérebro."),
    ("sobrecoxa", "1 sobrecoxa de frango sem pele",
     "Cozinhe a sobrecoxa com água, cebola e cheiro-verde por 25 minutos, até a carne soltar do osso.",
     {6: "Retire o osso e desfie bem fininho, conferindo se não sobrou nenhum ossinho.", 9: "Retire o osso e pique a carne, conferindo os ossinhos."}, "A carne da coxa é mais macia e tem mais ferro que o peito."),
    ("fígado", "50 g de fígado bovino",
     "Refogue o fígado em tiras com cebola no azeite por 8 a 10 minutos, até ficar bem cozido por dentro.",
     {6: "Amasse o fígado com garfo até virar uma pastinha.", 9: "Pique o fígado bem miudinho."}, "Fígado 1 vez por semana ajuda a prevenir anemia."),
]
LEGS = [
    ("feijão", "2 colheres (sopa) de feijão cozido com caldo"),
    ("feijão-preto", "2 colheres (sopa) de feijão-preto cozido com caldo"),
    ("lentilha", "2 colheres (sopa) de lentilha cozida"),
    ("grão-de-bico", "2 colheres (sopa) de grão-de-bico cozido e sem pele"),
    ("ervilha", "2 colheres (sopa) de ervilha cozida"),
]
VEGS = [
    ("cenoura", "1/2 cenoura", "vapor"), ("abóbora", "1 fatia de abóbora cabotiá", "vapor"),
    ("abobrinha", "1/2 abobrinha", "vapor"), ("chuchu", "1/2 chuchu", "vapor"),
    ("brócolis", "3 floretes de brócolis", "vapor"), ("couve-flor", "3 floretes de couve-flor", "vapor"),
    ("beterraba", "1/2 beterraba pequena", "vapor"), ("espinafre", "1 punhado de folhas de espinafre", "folha"),
    ("couve", "1 folha de couve", "folha"), ("vagem", "5 vagens sem fio", "vapor"),
    ("tomate", "1 tomate sem pele e sem sementes", "tomate"),
]

def passo_veg(v):
    if v[2] == "folha":
        return "Lave bem " + ("as folhas de " if v[0] == "espinafre" else "a ") + v[0] + ", pique e refogue em um fio de azeite por 2 minutos."
    if v[2] == "tomate":
        return "Pique o tomate e refogue com um pouco de água até virar um molhinho."
    return "Cozinhe " + ("a " if v[0] in ("cenoura", "abóbora", "abobrinha", "beterraba", "couve-flor", "vagem") else "o ") + v[0] + " no vapor por 10 a 15 minutos, até amaciar bem."

def passo_leg(f, l):
    if f < 9 or l[0] in ("grão-de-bico", "ervilha") and f < 12:
        return "Amasse " + ("o " if l[0] != "lentilha" and l[0] != "ervilha" else "a ") + l[0] + " com garfo, junto com um pouco do caldo."
    return "Amasse levemente " + ("o " if l[0] != "lentilha" else "a ") + l[0] + ", deixando alguns grãos inteiros."

def tex(p, f):
    t = p[3]; best = None
    for k in sorted(t):
        if f >= k: best = t[k]
    return best

def papinha(f, c, p, v, l):
    if f <= 8:
        nome = "Papinha de %s, %s e %s" % (c[0], p[0], v[0])
    else:
        nome = "Pratinho de %s com %s e %s" % (p[0], c[0], v[0])
    i = [c[1], p[1], v[1], l[1], "1 fio de azeite", tempero(f)]
    passos = [p[2] if p[0] in ("ovo", "salmão", "carne desfiada", "sobrecoxa") else "Pique a cebola e o alho. " + p[2], c[2], passo_veg(v),
              corte(f, "o " + c[0] if c[0] not in ("mandioquinha", "batata", "batata-doce", "mandioca", "quinoa", "polenta") else "a " + c[0], "o legume" if v[0] != "espinafre" and v[0] != "couve" else None) if c[0] != "polenta" else "Deixe a polenta cremosa e sirva com garfo.",
              tex(p, f), passo_leg(f, l),
              "Monte o prato com cada alimento separado, para ela conhecer cada sabor, e finalize com um fio de azeite."]
    passos = [x for x in passos if x]
    return R(nome, f, "almoco", "35 min", "2 porções", i, passos, p[4])

def bolinho(f, c, p, v):
    nome = "Bolinho assado de %s com %s" % (c[0], p[0])
    i = ["1 xícara de %s cozido(a) e amassado(a)" % c[0], "3 colheres (sopa) de %s cozido" % p[0], "2 colheres (sopa) de %s ralado(a) ou picado(a)" % v[0], "1 ovo", "2 colheres (sopa) de aveia", tempero(f)]
    passos = ["Cozinhe e amasse o(a) %s; cozinhe e desfie ou pique o %s." % (c[0], p[0]),
              "Misture tudo com o ovo, a aveia e o cheiro-verde até dar liga.",
              "Modele bolinhos alongados, do tamanho de um dedo.",
              "Asse em forma untada a 200 °C por 20 a 25 minutos, virando na metade.",
              "Espere amornar e ofereça para ela pegar com a mão."]
    return R(nome, f, "almoco", "40 min", "10 bolinhos", i, passos, "Congela bem já assado por até 1 mês.")

def omelete(f, v):
    nome = "Omelete macia de %s" % v[0]
    i = ["2 ovos", v[1] + " picado(a) bem miudinho", "1 colher (chá) de azeite", tempero(f)]
    passos = [passo_veg(v), "Bata os ovos com garfo e misture o legume e o cheiro-verde.",
              "Aqueça a frigideira antiaderente com o azeite em fogo baixo, despeje e tampe.",
              "Cozinhe 4 minutos de cada lado, até ficar firme por dentro, sem parte mole.",
              "Corte em tiras do tamanho de um dedo." if f < 9 else "Corte em quadradinhos ou tiras."]
    return R(nome, f, "almoco", "15 min", "2 porções", i, passos, "Omelete com arroz e feijão vira um almoço completo.")

def risoto(f, p, v):
    nome = "Risotinho de %s com %s" % (p[0], v[0])
    i = ["1/2 xícara de arroz", p[1].replace("2 colheres (sopa)", "4 colheres (sopa)"), v[1], "2 xícaras de água quente", "1 fio de azeite", tempero(f)]
    if f >= 9: i.insert(4, "1 colher (sopa) de ricota (opcional)")
    passos = ["Refogue a cebola e o alho no azeite e junte o %s picado até dourar." % p[0] if p[0] not in ("ovo", "peixe", "salmão") else "Refogue a cebola e o alho no azeite.",
              "Junte o arroz e mexa por 1 minuto.",
              "Acrescente a água quente aos poucos, mexendo, por cerca de 20 minutos.",
              "Nos últimos 8 minutos, junte o(a) %s picadinho(a)%s." % (v[0], " e o peixe em lascas sem espinhas" if p[0] in ("peixe", "salmão") else ""),
              "Desligue quando o arroz estiver bem macio e cremoso" + (" e misture a ricota." if f >= 9 else "."),
              "Confira a temperatura antes de servir."]
    return R(nome, f, "almoco", "35 min", "3 porções", i, passos, "Separe a porção dela antes de temperar a dos adultos com sal.")

def macarrao(f, p, v):
    nome = "Macarrãozinho com %s e %s" % (p[0], v[0])
    i = ["1/2 xícara de macarrão pequeno ou parafuso", p[1], v[1], "1 tomate maduro sem pele", "1 fio de azeite", tempero(f)]
    passos = ["Cozinhe o macarrão em bastante água até ficar bem macio.",
              p[2], "Junte o tomate picado e o(a) %s ralado(a) ou picadinho(a) e cozinhe por 8 minutos, até formar um molho." % v[0],
              tex(p, f), "Misture o macarrão ao molho" + (" e amasse levemente com garfo." if f < 9 else " e corte os pedaços maiores ao meio.")]
    return R(nome, f, "almoco", "30 min", "3 porções", i, passos, "Massa pode desde os 6 meses. O glúten não precisa ser adiado.")

def almondega(f, p, v):
    nome = "Almôndegas de %s com %s" % (p[0], v[0])
    i = ["250 g de %s moído(a)" % ("carne (patinho)" if p[0] == "carne" else p[0]), v[1] + " ralado(a) fininho", "1 ovo", "2 colheres (sopa) de aveia", tempero(f), "Molho de tomate caseiro (opcional)"]
    passos = ["Misture todos os ingredientes com as mãos.", "Faça bolinhas do tamanho de uma uva grande.",
              "Asse em forma untada a 200 °C por 20 minutos, até cozinhar por dentro.",
              "Sirva partidas ao meio ou amassadas, com molho de tomate caseiro se quiser."]
    return R(nome, f, "almoco", "35 min", "15 almôndegas", i, passos, "Congela muito bem já assadas por até 2 meses.")

def escondidinho(f, c, p):
    nome = "Escondidinho de %s com %s" % (c[0], p[0])
    i = ["300 g de %s" % c[0], p[1].replace("2 colheres (sopa)", "5 colheres (sopa)"), "1 tomate", "2 colheres (sopa) de água do cozimento", "Azeite", tempero(f)]
    passos = [c[2], "Amasse com a água do cozimento e um fio de azeite até virar um purê.",
              p[2] + " Junte o tomate picado.", "Em um refratário, coloque metade do purê, o recheio e cubra com o resto do purê.",
              "Leve ao forno a 200 °C por 15 minutos e espere amornar."]
    return R(nome, f, "almoco", "45 min", "4 porções", i, passos, "Porções individuais congelam bem.")

def sopa_grossa(f, p, v, c):
    nome = "Sopa grossa de %s com %s e %s" % (v[0], p[0], c[0])
    i = [p[1].replace("2 colheres (sopa)", "4 colheres (sopa)"), v[1], c[1], "2 xícaras de água", "1 fio de azeite", tempero(f)]
    passos = ["Refogue a cebola e o alho no azeite.", p[2], "Junte o(a) %s e o(a) %s em pedacinhos e cubra com a água." % (c[0], v[0]),
              "Cozinhe até tudo ficar bem macio e o caldo engrossar.", "Amasse parte dos legumes na própria panela para engrossar mais e sirva com pedaços."]
    return R(nome, f, "almoco", "35 min", "3 porções", i, passos, "Sopa rala enche a barriga e alimenta pouco. Prefira grossa.")

def panqueca_salg(f, v):
    nome = "Panqueca de %s sem leite" % v[0]
    i = ["1 ovo", "1/2 xícara de farinha de trigo ou aveia", "1/2 xícara de água", v[1], "1 fio de azeite"]
    passos = [passo_veg(v), "Bata o ovo, a farinha, a água e o legume no liquidificador.",
              "Faça discos finos em frigideira antiaderente untada, 2 minutos de cada lado.",
              "Recheie com frango desfiado ou carne moída e enrole.", "Corte em rodelas grossas para ela pegar."]
    return R(nome, f, "almoco", "25 min", "4 panquecas", i, passos, "Massa sem leite e sem sal, ideal antes de 1 ano.")

# ------------------------------------------------------------------ frutas
FRUTAS = [
    ("banana", "1 banana madura", "Descasque a banana."),
    ("mamão", "1 fatia de mamão", "Corte o mamão e retire as sementes."),
    ("manga", "1/4 de manga madura", "Descasque a manga e corte a polpa."),
    ("abacate", "1/4 de abacate", "Retire a polpa do abacate com uma colher."),
    ("pera", "1/2 pera bem madura", "Descasque a pera e retire as sementes. Se estiver firme, cozinhe por 5 minutos."),
    ("maçã", "1/2 maçã", "Descasque a maçã, retire as sementes e cozinhe em pouca água por 8 minutos até amolecer."),
    ("melão", "1 fatia de melão", "Retire a casca e as sementes do melão."),
    ("melancia", "1 fatia de melancia", "Retire a casca e todas as sementes da melancia."),
    ("kiwi", "1 kiwi maduro", "Descasque o kiwi."),
    ("caqui", "1/2 caqui maduro", "Lave o caqui e retire a casca e as sementes."),
    ("goiaba", "1/2 goiaba madura", "Descasque a goiaba e retire o miolo com as sementes."),
    ("pêssego", "1 pêssego maduro", "Descasque o pêssego e retire o caroço."),
    ("ameixa", "2 ameixas frescas maduras", "Descasque as ameixas e retire os caroços."),
    ("morango", "4 morangos", "Lave bem os morangos e retire as folhinhas."),
    ("laranja", "1 laranja-lima", "Retire a casca, a pele dos gomos e as sementes da laranja."),
    ("tangerina", "1 tangerina", "Retire a casca, a pele dos gomos e as sementes da tangerina."),
    ("uva", "6 uvas sem sementes", "Lave as uvas e corte cada uma em 4 no comprimento."),
    ("abacaxi", "1 fatia de abacaxi bem maduro", "Retire a casca e o miolo duro do abacaxi."),
    ("pitaya", "1/2 pitaya", "Corte a pitaya ao meio e retire a polpa com uma colher."),
    ("figo", "2 figos maduros", "Lave os figos e retire o cabinho."),
]
FR = {x[0]: x for x in FRUTAS}

def fruta_bebe(f, a, b=None, c=None):
    fs = [FR[x] for x in (a, b, c) if x]
    nomes = [x[0] for x in fs]
    lista = ", ".join(nomes[:-1]) + " e " + nomes[-1] if len(nomes) > 1 else nomes[0]
    if f <= 6: nome = "Creminho de " + (nomes[0] + " com " + nomes[1] if len(nomes) > 1 else nomes[0])
    elif f == 7: nome = "Amassadinho de " + lista
    elif f == 8: nome = "Tirinhas de " + lista
    else: nome = "Frutinhas picadas: " + lista
    passos = [x[2] for x in fs]
    passos.append({6: "Amasse com garfo até virar um creme com pedacinhos bem macios.", 7: "Amasse com garfo, deixando pedacinhos macios.",
                   8: "Corte em tiras do tamanho de um dedo, bem macias, para ela pegar.", 9: "Pique em cubinhos pequenos.",
                   10: "Pique em cubinhos e deixe alguns pedaços maiores para ela pegar.", 11: "Corte em pedaços macios."}[f])
    passos.append("Ofereça logo depois de preparar, sem açúcar.")
    return R(nome, f, "fruta", "5 min", "1 porção", [x[1] for x in fs], passos, "Fruta é o lanche ideal. Varie as cores ao longo da semana.")

def fruta_assada(f, a):
    x = FR[a]
    nome = cap(a) + (" assada com canela" if a in ("banana", "pera", "maçã", "manga", "goiaba", "ameixa") else " assado com canela")
    passos = [x[2].replace(" Se estiver firme, cozinhe por 5 minutos.", "").replace(" e cozinhe em pouca água por 8 minutos até amolecer", ""), "Coloque em uma forma pequena e polvilhe canela.",
              "Asse a 180 °C por 15 a 20 minutos, até ficar bem macio.",
              "Amasse com garfo." if f < 8 else "Sirva em pedaços mornos."]
    return R(nome, f, "fruta" if f < 12 else "sobremesa", "25 min", "1 porção", [x[1], "1 pitada de canela"], passos, "Assada, a fruta fica mais doce, sem precisar de açúcar.")

# ------------------------------------------------------------------ café e lanche (bebês)
def papinha_cereal(f, cereal, fr):
    x = FR[fr]
    ci = {"aveia": ("2 colheres (sopa) de aveia em flocos finos", "Cozinhe a aveia em 1/2 xícara de água por 3 minutos, mexendo."),
          "quinoa": ("2 colheres (sopa) de quinoa em flocos", "Cozinhe a quinoa em flocos em 1/2 xícara de água por 3 minutos, mexendo."),
          "arroz": ("2 colheres (sopa) de farinha de arroz", "Dissolva a farinha de arroz em 1/2 xícara de água fria e cozinhe mexendo por 4 minutos."),
          "milho": ("2 colheres (sopa) de fubá", "Dissolva o fubá em 1/2 xícara de água fria e cozinhe mexendo por 8 minutos.")}[cereal]
    nome = "Papinha de %s com %s" % (cereal if cereal != "milho" else "fubá", fr)
    passos = [ci[1], x[2], "Desligue o fogo e misture a fruta amassada.",
              "Se quiser, junte um pouco de leite materno (ou fórmula) com o fogo já desligado.", "Espere amornar e ofereça na colher."]
    return R(nome, f, "cafe", "8 min", "1 porção", [ci[0], x[1], "1/2 xícara de água"], passos, "Ofereça na colher, nunca na mamadeira.")

def iogurte(f, fr):
    x = FR[fr]
    nome = "Iogurte natural com %s" % fr
    return R(nome, f, "lanche", "3 min", "1 porção", ["3 colheres (sopa) de iogurte natural integral sem açúcar", x[1]],
             [x[2], "Amasse ou pique a fruta bem pequena.", "Misture ao iogurte e sirva."], "Iogurte com sabor tem açúcar: fica para depois dos 2 anos.")

def panqueca_fruta(f, fr):
    x = FR[fr]
    nome = "Panquequinha de %s e aveia" % fr
    return R(nome, f, "cafe", "12 min", "4 panquecas", [x[1], "1 ovo", "3 colheres (sopa) de aveia", "1 pitada de canela"],
             [x[2], "Amasse a fruta e misture o ovo, a aveia e a canela.", "Aqueça uma frigideira antiaderente em fogo baixo.",
              "Despeje colheradas da massa e doure 2 minutos de cada lado, até firmar por dentro.", "Corte em tiras para ela pegar."], "Já é doce pela fruta: não precisa de açúcar nem mel.")

def palitos(f, v1, v2):
    a, b = [x for x in VEGS if x[0] == v1][0], [x for x in VEGS if x[0] == v2][0]
    nome = "Palitos de %s e %s no vapor" % (v1, v2)
    return R(nome, f, "lanche", "15 min", "2 porções", [a[1], b[1]],
             ["Corte os legumes em palitos do tamanho de um dedo adulto (floretes, no caso do brócolis e da couve-flor).",
              "Cozinhe no vapor por 10 a 12 minutos.", "Teste: o pedaço deve amassar fácil entre seus dedos.", "Sirva morno para ela pegar com a mão, sempre sentada."], "Comer com as mãos treina a mastigação.")

def bolinho_doce(f, fr):
    x = FR[fr]
    nome = "Bolinho de %s e aveia" % fr
    return R(nome, f, "lanche", "30 min", "10 bolinhos", [x[1].replace("1/2 ", "1 ").replace("1/4", "1/2"), "1 ovo", "1/2 xícara de aveia", "1 colher (chá) de fermento", "Canela"],
             [x[2], "Amasse a fruta e misture o ovo e a canela.", "Junte a aveia e, por último, o fermento.",
              "Distribua em forminhas de silicone pequenas.", "Asse a 180 °C por 18 a 20 minutos e espere esfriar."], "Sem açúcar: a fruta madura adoça.")

def biscoito(f, fr):
    x = FR[fr]
    nome = "Biscoitinho de aveia com %s" % fr
    return R(nome, f, "lanche", "25 min", "15 biscoitos", [x[1].replace("1/2 ", "1 "), "1 xícara de aveia", "1 colher (sopa) de óleo", "Canela"],
             [x[2], "Amasse a fruta e misture a aveia, o óleo e a canela.", "Faça bolinhas e achate na assadeira com papel-manteiga.",
              "Asse a 180 °C por 15 minutos, até dourar por baixo.", "Espere esfriar: eles ficam firmes por fora e macios por dentro."], "Guarde em pote fechado por até 3 dias.")

def muffin_salg(f, v):
    nome = "Muffin de %s com ricota" % v[0]
    return R(nome, f, "lanche", "30 min", "8 muffins", ["2 ovos", "3 colheres (sopa) de aveia", v[1] + " ralado(a) ou picado(a)", "2 colheres (sopa) de ricota", "1 colher (sopa) de azeite", "1 colher (chá) de fermento"],
             [passo_veg(v) if v[2] != "vapor" else "Rale ou pique bem fininho o(a) %s." % v[0], "Misture os ovos, a ricota e o azeite.", "Junte a aveia, o legume e, por último, o fermento.",
              "Distribua em forminhas untadas.", "Asse a 180 °C por 20 minutos e corte em pedaços."], "Congela por até 1 mês.")

def ovo_mexido(f, v):
    nome = "Ovo mexido com %s" % v[0]
    return R(nome, f, "cafe", "10 min", "1 porção", ["1 ovo", v[1] + " picado(a) bem miudinho", "1 fio de azeite"],
             [passo_veg(v), "Bata o ovo e junte o legume.", "Mexa na frigideira em fogo baixo até ficar totalmente firme, sem parte mole.", "Sirva em pedacinhos."], "Ovo é ótimo café da manhã a partir dos 9 meses.")

def picole(f, a, b):
    x, y = FR[a], FR[b]
    nome = "Picolé de %s com %s" % (a, b)
    return R(nome, f, "sobremesa", "10 min + congelar", "6 picolés", [x[1].replace("1/2 ", "1 ").replace("1/4", "1/2"), y[1].replace("1/2 ", "1 ").replace("1/4", "1/2")],
             [x[2], y[2], "Bata as frutas no liquidificador, sem água e sem açúcar.", "Distribua em forminhas de picolé pequenas e congele por 4 horas.",
              "Ofereça com ela sentada. Alivia a gengiva quando os dentes estão nascendo." if f < 24 else "Ótimo para dias quentes."], "Troca saudável para o sorvete industrializado.")

def nice_cream(f, fr):
    x = FR[fr]
    nome = "Sorvete de banana com %s" % fr
    return R(nome, f, "sobremesa", "10 min + congelar", "2 porções", ["2 bananas maduras congeladas em rodelas", x[1]],
             [x[2] + " Congele a fruta em pedaços junto com as bananas.", "Bata tudo no processador até virar um creme.", "Sirva na hora ou congele por mais 1 hora."], "Sorvete só de fruta, sem açúcar e sem leite.")

# ------------------------------------------------------------------ 1 ano em diante
KPROT = [
    ("frango grelhado", ["150 g de filé de frango", "Limão, alho e sal (pouco)"], ["Tempere o frango com limão, alho e pouco sal.", "Grelhe com um fio de azeite, 5 minutos de cada lado, até cozinhar por dentro.", "Corte em tirinhas."]),
    ("carne moída refogada", ["200 g de carne moída", "1 tomate", "Cebola e alho"], ["Refogue cebola e alho, junte a carne e cozinhe até dourar.", "Junte o tomate picado e um pouco de água e cozinhe por 10 minutos."]),
    ("peixe assado", ["1 filé de tilápia ou merluza", "Limão, azeite e salsinha"], ["Tempere o peixe com limão, azeite e salsinha.", "Asse em papel-manteiga a 200 °C por 15 minutos.", "Desfie conferindo as espinhas."]),
    ("omelete de queijo", ["2 ovos", "2 colheres (sopa) de muçarela ralada"], ["Bata os ovos e misture o queijo.", "Cozinhe em frigideira tampada em fogo baixo até ficar firme."]),
    ("bife de patinho macio", ["2 bifes finos de patinho", "Alho e sal (pouco)"], ["Bata os bifes com o martelo para amaciar e tempere.", "Grelhe até ficarem bem passados.", "Corte em tirinhas finas."]),
    ("frango ensopado", ["300 g de frango em cubos", "1 tomate", "Cebola, alho e cheiro-verde"], ["Doure o frango com cebola e alho.", "Junte o tomate e água até a metade e cozinhe por 20 minutos."]),
    ("ovo cozido", ["1 ovo"], ["Cozinhe o ovo por 10 a 12 minutos e pique."]),
    ("carne de panela desfiada", ["300 g de músculo", "Cebola, alho, louro"], ["Cozinhe a carne na pressão com temperos e água por 30 minutos.", "Desfie com dois garfos."]),
    ("lombo assado", ["300 g de lombo", "Alho, limão e ervas"], ["Tempere o lombo e deixe descansar 30 minutos.", "Asse coberto com papel-alumínio a 200 °C por 40 minutos e descubra para dourar.", "Fatie fino."]),
    ("sobrecoxa assada", ["4 sobrecoxas sem pele", "Alho, páprica doce e limão"], ["Tempere as sobrecoxas.", "Asse a 200 °C por 40 minutos, até soltar do osso.", "Desfie, retirando os ossos."]),
    ("fígado acebolado", ["150 g de fígado", "1 cebola"], ["Corte o fígado em tiras e refogue com a cebola por 10 minutos, até ficar bem cozido.", "Pique pequeno."]),
    ("almôndegas ao sugo", ["250 g de carne moída", "1 ovo", "2 colheres (sopa) de aveia", "Molho de tomate caseiro"], ["Misture carne, ovo e aveia e faça bolinhas.", "Cozinhe no molho de tomate por 20 minutos."]),
]
KVEG = [
    ("cenoura refogada", "1 cenoura", "Corte a cenoura em cubinhos e refogue com um pouco de água até amaciar."),
    ("abobrinha refogada", "1 abobrinha", "Corte a abobrinha em cubos e refogue no azeite por 5 minutos."),
    ("couve refogada", "3 folhas de couve", "Corte a couve em tiras finas e refogue com alho por 2 minutos."),
    ("brócolis no vapor", "1 xícara de brócolis", "Cozinhe o brócolis no vapor por 8 minutos."),
    ("chuchu refogado", "1 chuchu", "Corte o chuchu em cubos e refogue com tomate até ficar macio."),
    ("abóbora cozida", "1 fatia de abóbora", "Cozinhe a abóbora em cubos no vapor por 15 minutos."),
    ("beterraba cozida", "1 beterraba", "Cozinhe a beterraba e corte em cubinhos."),
    ("vagem refogada", "1 xícara de vagem", "Corte a vagem em pedaços e refogue até ficar macia."),
    ("espinafre refogado", "1 maço pequeno de espinafre", "Refogue as folhas de espinafre com alho por 2 minutos."),
    ("purê de batata", "2 batatas", "Cozinhe as batatas e amasse com um pouco de leite e azeite."),
    ("salada de tomate e pepino", "1 tomate e 1/2 pepino", "Corte o tomate e o pepino em cubinhos e tempere com azeite e limão."),
    ("couve-flor gratinada", "1 xícara de couve-flor e queijo ralado", "Cozinhe a couve-flor, cubra com queijo e leve ao forno até derreter."),
]

def prato_br(f, p, v):
    nome = "Arroz, feijão, %s e %s" % (p[0], v[0])
    i = ["Arroz cozido", "Feijão cozido com caldo"] + p[1] + [v[1]]
    passos = ["Prepare o arroz e o feijão da família com pouco sal."] + p[2] + [v[2]]
    passos.append("Sirva tudo em pedaços pequenos." if f < 24 else "Monte o prato: metade legumes, um quarto arroz e um quarto feijão com a proteína.")
    return R(nome, f, "almoco", "40 min", "1 família", i, passos, "O prato brasileiro já é completo para a criança.")

RISOTOS = ["abóbora", "beterraba", "brócolis", "espinafre", "cenoura e ervilha", "tomate e manjericão", "milho e abobrinha", "alho-poró", "cogumelos", "abobrinha e queijo"]
def risoto_k(f, prot, veg):
    nome = "Risoto de %s com %s" % (prot, veg)
    i = ["1 xícara de arroz", "250 g de %s" % ("frango em cubos" if prot == "frango" else "carne moída" if prot == "carne moída" else "lombo em cubos"), "1 xícara de " + veg + " em pedacinhos",
         "4 xícaras de água quente", "2 colheres (sopa) de queijo ralado", "Cebola, alho e sal (pouco)"]
    passos = ["Refogue cebola, alho e a %s até dourar." % prot, "Junte o arroz e mexa por 1 minuto.",
              "Acrescente a água quente aos poucos, mexendo, por 20 minutos.", "Na metade do tempo, junte %s." % veg,
              "Desligue com o arroz cremoso e misture o queijo ralado."]
    return R(nome, f, "almoco", "40 min", "4 porções", i, passos, "Risoto é um jeito fácil de colocar legumes no prato.")

MOLHOS = [
    ("ao molho de abóbora com frango", ["1 xícara de abóbora cozida", "150 g de frango desfiado", "1/2 xícara de leite"], ["Bata a abóbora cozida com o leite até virar creme.", "Aqueça com o frango desfiado e um pouco de sal."]),
    ("à bolonhesa de lentilha", ["1 xícara de lentilha cozida", "2 tomates", "1 cenoura ralada"], ["Refogue cebola, alho e cenoura.", "Junte os tomates picados e a lentilha e cozinhe por 15 minutos."]),
    ("com brócolis ao alho e óleo", ["1 xícara de brócolis", "2 dentes de alho", "3 colheres (sopa) de azeite"], ["Doure o alho fatiado no azeite em fogo baixo.", "Junte o brócolis cozido picado."]),
    ("ao molho branco com frango", ["1 xícara de leite", "1 colher (sopa) de farinha de trigo", "1 colher (sopa) de manteiga", "150 g de frango desfiado"], ["Derreta a manteiga, junte a farinha e mexa.", "Acrescente o leite aos poucos, mexendo até engrossar.", "Junte o frango."]),
    ("ao molho de espinafre e ricota", ["1 maço de espinafre", "1/2 xícara de ricota", "1/2 xícara de leite"], ["Refogue o espinafre e bata com a ricota e o leite."]),
    ("ao sugo com carne moída", ["200 g de carne moída", "3 tomates maduros", "Manjericão"], ["Refogue a carne com cebola e alho.", "Junte os tomates picados e cozinhe por 15 minutos.", "Finalize com manjericão."]),
    ("com atum e tomate", ["1 lata de atum em água", "2 tomates"], ["Refogue cebola e tomate até formar molho.", "Junte o atum escorrido."]),
    ("ao pesto de manjericão", ["1 maço de manjericão", "2 colheres (sopa) de queijo ralado", "4 colheres (sopa) de azeite"], ["Bata manjericão, queijo, azeite e um pouco de água no liquidificador."]),
]
FORMATOS = ["parafuso", "penne", "gravatinha", "conchinha", "espaguete", "talharim", "argolinha", "ave-maria"]
def macarrao_k(f, fmt, m):
    nome = "Macarrão %s %s" % (fmt, m[0])
    i = ["250 g de macarrão " + fmt] + m[1] + ["Sal (pouco)"]
    passos = ["Cozinhe o macarrão em água com pouco sal até ficar al dente."] + m[2] + ["Misture o macarrão ao molho.",
              "Corte em pedaços pequenos para ela." if f < 24 else "Sirva com uma salada colorida."]
    return R(nome, f, "almoco", "30 min", "4 porções", i, passos, "Atum até 1 vez por semana." if "atum" in m[0] else "Molho caseiro tem menos sal e nenhum açúcar escondido.")

PRATOS = [  # (nome, min, tempo, rende, ingredientes, passos, dica)
    ("Galinhada", 12, "45 min", "5 porções", ["400 g de frango em cubos", "2 xícaras de arroz", "1 colher (chá) de açafrão-da-terra", "Milho e ervilha", "Cebola, alho, cheiro-verde e sal (pouco)"], ["Doure o frango com cebola e alho.", "Junte o arroz, o açafrão e mexa.", "Cubra com 4 xícaras de água quente e cozinhe por 20 minutos.", "Junte milho e ervilha no final e finalize com cheiro-verde."], "Milho e ervilha amassados ou cortados até os 2 anos."),
    ("Tutu de feijão com ovo", 12, "20 min", "3 porções", ["2 xícaras de feijão cozido com caldo", "3 colheres (sopa) de farinha de mandioca", "1 ovo cozido", "Couve refogada", "Cebola e alho"], ["Refogue cebola e alho e junte o feijão.", "Amasse bem e vá colocando a farinha, mexendo, até engrossar.", "Sirva com o ovo picado e a couve."], "Prato mineiro rico em ferro."),
    ("Canja de galinha", 12, "40 min", "4 porções", ["300 g de peito de frango", "1/2 xícara de arroz", "1 cenoura", "1 batata", "Cebola, alho e salsinha"], ["Cozinhe o frango em 1 litro de água com cebola e alho por 20 minutos e desfie.", "Volte o frango para o caldo, junte arroz, cenoura e batata picados.", "Cozinhe até o arroz ficar bem macio e o caldo engrossar.", "Finalize com salsinha."], "Boa para dias de resfriado ou pouca fome."),
    ("Creme de abóbora com frango desfiado", 12, "35 min", "4 porções", ["500 g de abóbora", "200 g de frango desfiado", "1 cebola", "Azeite e sal (pouco)"], ["Refogue a cebola, junte a abóbora em cubos e água para cobrir.", "Cozinhe até desmanchar e bata no liquidificador.", "Volte à panela com o frango desfiado e aqueça."], "Sirva com arroz ou pão para ficar mais completo."),
    ("Sopa de lentilha com legumes", 12, "35 min", "4 porções", ["1 xícara de lentilha", "1 cenoura", "1 batata", "1 tomate", "Cebola, alho e louro"], ["Refogue cebola e alho.", "Junte lentilha, legumes em cubos, louro e 1 litro de água.", "Cozinhe por 25 minutos, até tudo ficar macio.", "Amasse parte da sopa na panela para engrossar."], "Lentilha tem ferro: sirva com uma fruta cítrica depois."),
    ("Nhoque de mandioquinha ao sugo", 12, "50 min", "4 porções", ["500 g de mandioquinha", "1 xícara de farinha de trigo", "1 ovo", "Molho de tomate caseiro"], ["Cozinhe e amasse a mandioquinha.", "Misture o ovo e a farinha até a massa soltar das mãos.", "Faça rolinhos e corte em pedacinhos.", "Cozinhe em água fervente até subirem e sirva com o molho."], "Congele os nhoques crus espalhados em uma bandeja."),
    ("Polenta cremosa com ragu de carne", 12, "45 min", "4 porções", ["1 xícara de fubá", "4 xícaras de água", "300 g de carne de panela desfiada", "2 tomates"], ["Cozinhe o fubá na água mexendo por 20 minutos.", "Aqueça a carne desfiada com os tomates picados até formar molho.", "Sirva a polenta com o ragu por cima."], "Polenta firme e fria vira palitos assados para o lanche."),
    ("Abobrinha recheada com carne", 12, "40 min", "4 porções", ["2 abobrinhas", "200 g de carne moída", "1 tomate", "Queijo ralado"], ["Corte as abobrinhas ao meio no comprimento e retire o miolo.", "Refogue a carne com o miolo picado e o tomate.", "Recheie, polvilhe queijo e asse a 200 °C por 25 minutos."], "Corte em rodelas para ela comer."),
    ("Frango assado com batata e cenoura", 12, "60 min", "5 porções", ["600 g de coxa e sobrecoxa sem pele", "3 batatas", "2 cenouras", "Alho, limão, alecrim e sal (pouco)"], ["Tempere o frango e deixe descansar 30 minutos.", "Coloque em assadeira com batatas e cenouras em pedaços.", "Cubra com papel-alumínio e asse a 200 °C por 40 minutos.", "Descubra e deixe dourar por mais 15 minutos.", "Desfie a carne dela retirando os ossos."], "Almoço de domingo para a família toda."),
    ("Peixe ensopado com legumes", 12, "30 min", "4 porções", ["500 g de filé de pescada", "1 tomate", "1 pimentão", "1 cebola", "Coentro ou salsinha, azeite e sal (pouco)"], ["Faça camadas de cebola, tomate e pimentão na panela.", "Coloque o peixe por cima, regue com azeite e um pouco de água.", "Tampe e cozinhe por 15 minutos.", "Desfie conferindo as espinhas."], "Sirva com arroz branco e pirão leve."),
    ("Purê de batata com carne moída", 12, "30 min", "4 porções", ["4 batatas", "1/2 xícara de leite", "250 g de carne moída", "1 tomate"], ["Cozinhe as batatas e amasse com o leite.", "Refogue a carne com cebola, alho e tomate.", "Sirva o purê com a carne ao lado."], "Clássico que quase toda criança aceita."),
    ("Bolinho de arroz assado", 12, "35 min", "15 bolinhos", ["2 xícaras de arroz cozido", "1 ovo", "3 colheres (sopa) de queijo ralado", "Cenoura ralada e salsinha", "3 colheres (sopa) de farinha"], ["Misture tudo até dar liga.", "Faça bolinhas e coloque em assadeira untada.", "Asse a 200 °C por 25 minutos, virando na metade."], "Ótimo para aproveitar o arroz de ontem."),
    ("Arroz de forno com frango", 18, "40 min", "5 porções", ["3 xícaras de arroz cozido", "200 g de frango desfiado", "Cenoura, ervilha e milho", "1 xícara de molho de tomate caseiro", "Muçarela ralada"], ["Misture o arroz, o frango, os legumes e o molho.", "Coloque em refratário e cubra com queijo.", "Asse a 200 °C por 20 minutos."], "Muçarela e outros queijos têm sal: use pouco."),
    ("Lasanha de abobrinha com carne", 18, "50 min", "6 porções", ["2 abobrinhas em fatias finas no comprimento", "300 g de carne moída", "Molho de tomate caseiro", "Ricota e muçarela"], ["Grelhe as fatias de abobrinha rapidamente.", "Prepare a carne no molho de tomate.", "Monte camadas de abobrinha, carne, ricota e muçarela.", "Asse a 200 °C por 25 minutos."], "Sem massa, leve e cheia de legumes."),
    ("Estrogonofe de carne com iogurte", 18, "35 min", "4 porções", ["400 g de patinho em tirinhas", "2 tomates", "1 pote de iogurte natural", "Cogumelos (opcional)"], ["Doure a carne com cebola.", "Junte os tomates e cozinhe até desmanchar.", "Desligue o fogo e misture o iogurte."], "Sem creme de leite de caixinha e sem catchup."),
    ("Hambúrguer de grão-de-bico", 18, "35 min", "8 hambúrgueres", ["2 xícaras de grão-de-bico cozido", "1 cenoura ralada", "1 ovo", "3 colheres (sopa) de aveia", "Cebola, salsinha e cominho"], ["Amasse o grão-de-bico.", "Misture os demais ingredientes e modele.", "Asse a 200 °C por 25 minutos, virando na metade."], "Opção vegetariana com bastante proteína."),
    ("Panqueca de carne com molho", 18, "40 min", "8 panquecas", ["1 xícara de leite", "1 ovo", "1 xícara de farinha de trigo", "250 g de carne moída refogada", "Molho de tomate caseiro"], ["Bata leite, ovo e farinha.", "Faça discos finos em frigideira untada.", "Recheie com a carne, enrole e cubra com molho.", "Leve ao forno por 10 minutos."], "Congele as panquecas já recheadas."),
    ("Sopa de mandioquinha com frango", 18, "35 min", "4 porções", ["4 mandioquinhas", "200 g de frango em cubos", "Cebola, alho e salsinha"], ["Doure o frango com cebola e alho.", "Junte a mandioquinha em cubos e água para cobrir.", "Cozinhe por 20 minutos e amasse parte da mandioquinha na panela."], "Cremosa sem precisar de creme de leite."),
    ("Escondidinho de abóbora com frango", 18, "45 min", "5 porções", ["700 g de abóbora", "300 g de frango desfiado", "1 tomate", "Queijo ralado"], ["Cozinhe e amasse a abóbora.", "Refogue o frango com tomate.", "Monte frango embaixo e purê por cima, polvilhe queijo e gratine."], "Doce natural da abóbora agrada muito."),
    ("Moqueca leve de peixe", 24, "35 min", "4 porções", ["500 g de peixe firme em postas", "1 tomate", "1 pimentão", "1 cebola", "1/2 xícara de leite de coco", "Coentro e limão"], ["Tempere o peixe com limão e pouco sal.", "Faça camadas de cebola, tomate, pimentão e peixe.", "Regue com o leite de coco e cozinhe tampado por 20 minutos.", "Desfie a porção dela conferindo espinhas."], "Sem dendê fica mais leve para crianças."),
    ("Baião de dois", 24, "40 min", "5 porções", ["2 xícaras de arroz", "2 xícaras de feijão-de-corda cozido", "100 g de queijo coalho em cubinhos", "Cebola, alho, coentro e sal (pouco)"], ["Refogue cebola e alho e junte o arroz.", "Junte o feijão e água quente e cozinhe por 20 minutos.", "Misture o queijo e o coentro no final."], "Queijo coalho é salgado: use pouco."),
    ("Pizza de frigideira de frango", 24, "20 min", "1 pizza", ["1 ovo", "3 colheres (sopa) de iogurte natural", "4 colheres (sopa) de farinha integral", "1 colher (chá) de fermento", "Frango desfiado, molho de tomate e muçarela"], ["Misture ovo, iogurte, farinha e fermento.", "Espalhe na frigideira untada e cozinhe tampado por 5 minutos.", "Vire, cubra com molho, frango e queijo e tampe até derreter."], "Deixe ela montar a cobertura."),
    ("Frango xadrez caseiro", 36, "30 min", "4 porções", ["400 g de frango em cubos", "1 pimentão vermelho", "1 cenoura", "1 cebola", "2 colheres (sopa) de shoyu com menos sódio", "1 colher (chá) de amido de milho"], ["Doure o frango.", "Junte os legumes em cubos e refogue por 5 minutos.", "Dissolva o amido no shoyu com 1/2 xícara de água e junte até engrossar."], "Amendoim só triturado, se quiser usar, até os 5 anos."),
    ("Empadão de frango", 36, "60 min", "8 pedaços", ["2 xícaras de farinha de trigo", "100 g de manteiga", "1 ovo", "Recheio: frango desfiado, milho, ervilha e tomate"], ["Misture farinha, manteiga e ovo até a massa ficar lisa.", "Forre uma forma com metade da massa.", "Coloque o recheio e cubra com o restante.", "Asse a 200 °C por 35 minutos."], "Lanche ou almoço para festinhas."),
    ("Tomate recheado com arroz e carne", 36, "40 min", "4 porções", ["4 tomates firmes", "1 xícara de arroz cozido", "150 g de carne moída refogada", "Queijo ralado"], ["Corte a tampa dos tomates e retire o miolo.", "Misture arroz, carne e o miolo picado.", "Recheie, polvilhe queijo e asse a 180 °C por 20 minutos."], "Divertido de comer: cada um ganha o seu."),
    ("Cuscuz paulista", 36, "40 min", "6 porções", ["2 xícaras de farinha de milho flocada", "1 lata de sardinha em água ou 200 g de frango desfiado", "2 tomates", "Ervilha, milho e ovo cozido"], ["Refogue cebola, tomate, ervilha, milho e a proteína com 2 xícaras de água.", "Junte a farinha aos poucos, mexendo até soltar da panela.", "Coloque em forma decorada com ovo e tomate, aperte e desenforme."], "Sardinha tem ômega-3 e cálcio."),
    ("Kafta assada no palito", 48, "35 min", "8 kaftas", ["400 g de carne moída", "1 cebola ralada", "Hortelã e salsinha", "Sal (pouco) e pimenta-síria suave"], ["Misture a carne com os temperos.", "Modele em palitos de churrasco (sem ponta).", "Asse a 200 °C por 20 minutos, virando na metade."], "Retire do palito para servir crianças menores."),
    ("Falafel assado com molho de iogurte", 48, "40 min", "15 bolinhos", ["2 xícaras de grão-de-bico demolhado (cru)", "1 cebola", "Salsinha, coentro e cominho", "Iogurte natural e limão para o molho"], ["Bata o grão-de-bico com cebola e ervas no processador.", "Faça bolinhas achatadas.", "Asse a 200 °C por 25 minutos.", "Sirva com iogurte temperado com limão."], "Bom no pão sírio com salada."),
    ("Arroz frito com legumes e ovo", 48, "20 min", "4 porções", ["3 xícaras de arroz cozido frio", "2 ovos", "Cenoura, ervilha e cebolinha", "1 colher (sopa) de shoyu com menos sódio"], ["Mexa os ovos na frigideira e reserve.", "Refogue os legumes.", "Junte o arroz, o ovo e o shoyu e misture bem."], "Shoyu tem muito sal: use só um pouquinho."),
    ("Frango ao curry suave com arroz", 48, "35 min", "4 porções", ["400 g de frango em cubos", "1 colher (chá) de curry suave", "1/2 xícara de leite de coco", "1 maçã ralada", "Cebola"], ["Doure o frango com a cebola.", "Junte o curry, a maçã e o leite de coco.", "Cozinhe por 15 minutos e sirva com arroz."], "Tempero novo amplia o paladar."),
    ("Burrito de feijão e frango", 60, "25 min", "4 burritos", ["4 tortilhas", "1 xícara de feijão amassado", "200 g de frango desfiado", "Alface, tomate e queijo"], ["Aqueça o feijão amassado e o frango.", "Espalhe nas tortilhas e junte salada e queijo.", "Enrole fechando as pontas e doure na frigideira."], "Corte ao meio para ficar mais fácil de segurar."),
    ("Salmão com purê de abóbora", 60, "30 min", "3 porções", ["300 g de salmão", "500 g de abóbora", "Limão, azeite e ervas"], ["Tempere e asse o salmão a 200 °C por 15 minutos.", "Cozinhe e amasse a abóbora com azeite.", "Sirva com legumes no vapor."], "Ômega-3 para o cérebro."),
    ("Hot dog de frango desfiado", 60, "20 min", "4 lanches", ["4 pães de cachorro-quente integrais", "300 g de frango desfiado ao molho de tomate", "Cenoura ralada e milho", "Batata palha caseira assada (opcional)"], ["Prepare o frango desfiado no molho.", "Recheie os pães com frango, cenoura e milho."], "Versão sem salsicha, que é ultraprocessada."),
    ("Panqueca de espinafre gratinada", 60, "40 min", "6 panquecas", ["1 xícara de leite", "1 ovo", "1 xícara de farinha", "1 maço de espinafre", "Ricota e molho de tomate"], ["Bata leite, ovo, farinha e espinafre.", "Faça as panquecas, recheie com ricota temperada e enrole.", "Cubra com molho e queijo e gratine."], "Verde que até quem não gosta de folha come."),
    ("Escondidinho de batata com atum", 48, "40 min", "4 porções", ["4 batatas", "1 lata de atum em água", "1 tomate", "Queijo ralado"], ["Cozinhe e amasse as batatas com um pouco de leite.", "Refogue o atum com tomate e cebola.", "Monte em camadas e gratine."], "Atum até 1 vez por semana."),
]

CAFES_K = [
    ("Tapioca com ovo mexido", 12, ["3 colheres (sopa) de goma de tapioca", "1 ovo"], ["Espalhe a goma na frigideira quente sem óleo.", "Quando grudar, vire.", "Recheie com o ovo mexido bem firme e dobre."], "Tapioca macia e com recheio úmido para não grudar na boca."),
    ("Tapioca com banana e canela", 12, ["3 colheres (sopa) de goma de tapioca", "1/2 banana", "Canela"], ["Faça o disco de tapioca na frigideira.", "Recheie com banana amassada e canela e dobre."], "Doce sem açúcar."),
    ("Crepioca de queijo", 12, ["1 ovo", "2 colheres (sopa) de goma de tapioca", "1 fatia de queijo branco"], ["Bata o ovo com a goma.", "Despeje na frigideira untada e tampe.", "Vire, coloque o queijo e dobre."], "Rápida e com proteína."),
    ("Cuscuz nordestino com ovo", 12, ["1/2 xícara de flocão de milho", "1 ovo", "Água e sal (pouco)"], ["Hidrate o flocão com água e um pouquinho de sal.", "Cozinhe na cuscuzeira por 10 minutos.", "Sirva com ovo mexido ou cozido."], "Pode servir com leite morno por cima."),
    ("Queijo quente no pão integral", 12, ["2 fatias de pão integral", "1 fatia de muçarela"], ["Monte o sanduíche.", "Doure dos dois lados em frigideira até o queijo derreter.", "Corte em tiras."], "Uma fatia fina de queijo basta."),
    ("Rabanada assada sem açúcar", 12, ["2 fatias de pão amanhecido", "1 ovo", "1/2 xícara de leite", "Canela"], ["Bata o ovo com o leite e a canela.", "Passe o pão na mistura.", "Asse em forma untada a 200 °C por 15 minutos, virando na metade."], "Sirva com frutas picadas."),
    ("Pão com pasta de grão-de-bico", 12, ["1 fatia de pão", "1/2 xícara de grão-de-bico cozido", "1 colher (sopa) de azeite", "Gotas de limão"], ["Amasse o grão-de-bico com azeite, limão e um pouco de água até virar pasta.", "Espalhe no pão e corte em tiras."], "A pasta dura 3 dias na geladeira."),
    ("Mingau de milho verde", 12, ["1 espiga de milho verde", "1 xícara de leite", "Canela"], ["Bata os grãos com o leite e coe.", "Leve ao fogo mexendo até engrossar.", "Polvilhe canela."], "Adoçado pelo próprio milho."),
    ("Overnight oats de banana", 24, ["4 colheres (sopa) de aveia", "1/2 xícara de leite", "2 colheres (sopa) de iogurte", "1/2 banana"], ["Misture aveia, leite e iogurte em um pote.", "Deixe na geladeira durante a noite.", "De manhã, cubra com banana picada."], "Pronto antes de acordar."),
    ("Torrada com abacate e ovo", 24, ["1 fatia de pão integral", "1/4 de abacate", "1 ovo cozido", "Limão e sal (pouco)"], ["Toste o pão.", "Amasse o abacate com limão e espalhe.", "Cubra com ovo picado."], "Gordura boa e proteína logo cedo."),
    ("Waffle de banana e aveia", 24, ["1 banana", "1 ovo", "4 colheres (sopa) de aveia", "2 colheres (sopa) de leite"], ["Bata tudo no liquidificador.", "Asse na máquina de waffle untada até dourar."], "Sem máquina, faça como panqueca."),
    ("Granola caseira sem açúcar com iogurte", 24, ["1 xícara de aveia em flocos", "2 colheres (sopa) de castanhas trituradas", "1 banana amassada", "Canela", "Iogurte natural"], ["Misture aveia, castanhas trituradas, banana e canela.", "Espalhe na assadeira e asse a 160 °C por 25 minutos, mexendo na metade.", "Sirva sobre o iogurte com fruta."], "Castanhas sempre trituradas até os 5 anos."),
    ("Pão de queijo de frigideira", 24, ["1 ovo", "2 colheres (sopa) de goma de tapioca", "2 colheres (sopa) de queijo ralado", "1 colher (sopa) de iogurte"], ["Misture tudo.", "Coloque na frigideira untada e tampe.", "Doure dos dois lados."], "Fica pronto em 5 minutos."),
    ("Bolo de caneca de cacau e banana", 36, ["1 banana", "1 ovo", "2 colheres (sopa) de aveia", "1 colher (chá) de cacau 100%", "1 pitada de fermento"], ["Amasse a banana e misture tudo em uma caneca grande.", "Leve ao micro-ondas por 2 minutos.", "Espere amornar antes de servir."], "Feito na hora, sem açúcar."),
    ("Sanduíche de pasta de amendoim e banana", 36, ["2 fatias de pão integral", "1 colher (sopa) de pasta de amendoim pura", "1/2 banana"], ["Espalhe uma camada fina de pasta de amendoim.", "Cubra com rodelas finas de banana e feche.", "Corte em tiras."], "Camada fina para não grudar no céu da boca."),
    ("Omelete de forno em muffins", 36, ["4 ovos", "Tomate, espinafre e queijo picados"], ["Bata os ovos e misture os recheios.", "Distribua em forminhas untadas.", "Asse a 180 °C por 18 minutos."], "Congele e aqueça de manhã."),
    ("Iogurte com frutas e granola", 48, ["1 pote de iogurte natural", "Frutas picadas", "2 colheres (sopa) de granola caseira"], ["Monte em camadas num copo: iogurte, frutas e granola.", "Sirva na hora para a granola ficar crocante."], "Ela pode montar o próprio copo."),
    ("Pão de batata-doce", 48, ["1 xícara de batata-doce cozida e amassada", "1 ovo", "1 xícara de polvilho doce", "2 colheres (sopa) de azeite", "Sal (pouco)"], ["Misture tudo até a massa soltar das mãos.", "Faça bolinhas.", "Asse a 200 °C por 25 minutos."], "Sem glúten e macio."),
    ("Cuscuz com queijo e tomate", 48, ["1/2 xícara de flocão de milho", "1 fatia de queijo coalho ou muçarela", "1/2 tomate"], ["Prepare o cuscuz na cuscuzeira.", "Ainda quente, misture o queijo picado e o tomate."], "Café da manhã nordestino completo."),
    ("Panqueca de aveia com morango", 60, ["1 ovo", "4 colheres (sopa) de aveia", "3 colheres (sopa) de leite", "Morangos picados"], ["Bata ovo, aveia e leite.", "Doure colheradas na frigideira.", "Sirva com morangos por cima."], "Ela pode ajudar a misturar a massa."),
    ("Wrap de ovo com queijo", 60, ["1 tortilha integral", "1 ovo", "1 fatia de queijo", "Tomate picado"], ["Mexa o ovo até firmar.", "Coloque na tortilha com queijo e tomate.", "Enrole e aqueça na frigideira."], "Bom para comer no caminho da escola."),
]

LANCHES_K = [
    ("Palitos de legumes com pasta de grão-de-bico", 12, ["1 cenoura", "1 abobrinha", "1/2 xícara de grão-de-bico cozido", "Azeite e limão"], ["Cozinhe os legumes em palitos no vapor até ficarem macios.", "Amasse o grão-de-bico com azeite, limão e água até virar pasta.", "Sirva os palitos para molhar na pasta."], "Legume cru e duro só depois dos 4 anos."),
    ("Bolo de maçã e aveia sem açúcar", 12, ["2 maçãs raladas", "2 ovos", "1 xícara de aveia", "1/4 xícara de óleo", "1 colher (sopa) de fermento", "Canela"], ["Bata ovos e óleo, junte as maçãs.", "Misture aveia, canela e, por último, o fermento.", "Asse a 180 °C por 30 minutos."], "A maçã deixa o bolo úmido e docinho."),
    ("Muffin de cenoura e banana", 12, ["1 cenoura ralada", "2 bananas", "2 ovos", "1 xícara de farinha integral", "1 colher (sopa) de fermento"], ["Amasse as bananas e misture ovos e cenoura.", "Junte a farinha e o fermento.", "Asse em forminhas a 180 °C por 20 minutos."], "Sem açúcar: a banana adoça."),
    ("Panquequinha de abóbora", 12, ["1/2 xícara de abóbora cozida", "1 ovo", "3 colheres (sopa) de aveia", "Canela"], ["Amasse a abóbora e misture com o ovo, a aveia e a canela.", "Doure colheradas na frigideira, 2 minutos de cada lado."], "Pode servir com iogurte natural."),
    ("Queijo branco com frutas", 12, ["2 fatias finas de queijo branco", "Frutas da estação"], ["Corte o queijo em palitos.", "Sirva com frutas picadas."], "Lanche prático para passeios."),
    ("Pão de queijo de mandioquinha", 18, ["1 xícara de mandioquinha cozida", "1 xícara de polvilho", "1/2 xícara de queijo ralado", "1 ovo"], ["Amasse a mandioquinha e misture tudo.", "Faça bolinhas.", "Asse a 200 °C por 25 minutos."], "Congela cru."),
    ("Chips de batata-doce assados", 24, ["1 batata-doce", "1 colher (sopa) de azeite", "Orégano e sal (pouco)"], ["Corte a batata-doce em rodelas bem finas.", "Tempere e espalhe na assadeira.", "Asse a 200 °C por 25 minutos, virando na metade."], "Bem mais saudável que salgadinho de pacote."),
    ("Mini pizza de pão sírio", 24, ["1 pão sírio pequeno", "Molho de tomate caseiro", "Muçarela e orégano", "Tomate em rodelas"], ["Espalhe o molho no pão.", "Cubra com queijo e tomate.", "Asse a 200 °C por 8 minutos."], "Ela pode montar a sua."),
    ("Barrinha de aveia e banana", 24, ["2 bananas", "1 xícara de aveia", "2 colheres (sopa) de pasta de amendoim", "2 colheres (sopa) de uva-passa picada"], ["Amasse as bananas e misture tudo.", "Espalhe em forma forrada.", "Asse a 180 °C por 20 minutos e corte em barrinhas."], "Uva-passa sempre picada."),
    ("Dadinho de tapioca assado", 24, ["1 xícara de tapioca granulada", "1 xícara de leite quente", "1/2 xícara de muçarela ralada"], ["Misture a tapioca com o leite quente e o queijo.", "Espalhe em forma e leve à geladeira por 2 horas.", "Corte em cubos e asse a 200 °C por 20 minutos."], "Crocante por fora, macio por dentro."),
    ("Sanduíche natural de frango", 24, ["2 fatias de pão integral", "Frango desfiado", "Cenoura ralada", "Iogurte natural"], ["Misture o frango, a cenoura e o iogurte.", "Recheie o pão e corte em triângulos."], "Leve na lancheira com gelo."),
    ("Esfiha aberta de carne", 36, ["Massa: 2 xícaras de farinha, 1/2 xícara de água morna, 1 colher (sopa) de fermento biológico, 2 colheres (sopa) de azeite", "250 g de carne moída", "1 tomate e cebola"], ["Misture a massa e deixe crescer por 40 minutos.", "Refogue a carne com tomate e cebola.", "Abra discos, cubra com a carne e asse a 200 °C por 15 minutos."], "Congele assadas."),
    ("Pastel assado de queijo", 36, ["Massa de pastel ou de torta", "Muçarela e orégano", "1 gema"], ["Recheie a massa com queijo e feche apertando com um garfo.", "Pincele gema.", "Asse a 200 °C por 15 minutos."], "Sem fritura."),
    ("Cookie salgado de queijo", 36, ["1 xícara de farinha", "1/2 xícara de queijo ralado", "3 colheres (sopa) de manteiga", "1 ovo"], ["Misture tudo até formar massa.", "Faça bolinhas achatadas.", "Asse a 180 °C por 15 minutos."], "Bom para a lancheira."),
    ("Ovo cozido com palitos de pepino", 36, ["1 ovo", "1/2 pepino", "Tomate-cereja cortado em 4"], ["Cozinhe o ovo por 10 minutos e corte em quartos.", "Corte o pepino em palitos finos.", "Sirva com os tomatinhos cortados."], "Tomate-cereja cortado até os 4 anos."),
    ("Bolinho de chuva assado de banana", 48, ["2 bananas", "1 ovo", "1 xícara de farinha", "1 colher (chá) de fermento", "Canela"], ["Amasse as bananas e misture tudo.", "Faça bolinhas e asse em forma untada a 200 °C por 20 minutos.", "Passe na canela."], "Versão sem fritura e sem açúcar."),
    ("Empadinha de frango", 48, ["Massa: 2 xícaras de farinha, 100 g de manteiga, 1 ovo", "Frango desfiado com tomate"], ["Forre forminhas com a massa.", "Recheie e cubra com massa.", "Asse a 200 °C por 25 minutos."], "Lanche de festa feito em casa."),
    ("Sanduíche de pão sírio com homus", 48, ["1 pão sírio", "Pasta de grão-de-bico", "Cenoura ralada e alface"], ["Abra o pão e espalhe a pasta.", "Recheie com cenoura e alface.", "Corte em triângulos."], "Proteína vegetal na lancheira."),
    ("Pipoca com canela", 48, ["3 colheres (sopa) de milho de pipoca", "1 colher (sopa) de óleo", "Canela"], ["Estoure a pipoca na panela tampada.", "Polvilhe canela.", "Sirva com ela sentada."], "Pipoca só a partir dos 4 anos."),
    ("Pão caseiro de cenoura", 60, ["2 cenouras", "1/2 xícara de óleo", "2 ovos", "3 xícaras de farinha", "1 colher (sopa) de fermento biológico", "Sal (pouco)"], ["Bata cenoura, óleo e ovos.", "Misture com a farinha e o fermento e sove.", "Deixe crescer 1 hora, modele e asse a 180 °C por 35 minutos."], "Faça com ela: amassar pão é diversão."),
    ("Mix de castanhas e frutas secas", 60, ["Castanha-do-pará, castanha de caju e amêndoas", "Uva-passa e damasco picados"], ["Misture as castanhas inteiras com as frutas secas picadas.", "Sirva uma pequena porção com ela sentada, sempre com supervisão."], "Castanhas inteiras só depois dos 5 anos."),
    ("Tortinha de legumes de liquidificador", 60, ["2 ovos", "1 xícara de leite", "1 xícara de farinha", "Legumes picados e queijo"], ["Bata ovos, leite e farinha.", "Misture os legumes.", "Asse em forminhas a 200 °C por 25 minutos."], "Use os legumes que sobraram da semana."),
]

FRUTAS_ANO = ["banana", "mamão", "manga", "morango", "kiwi", "melão", "melancia", "pera", "maçã", "abacaxi", "uva", "pêssego", "goiaba", "caqui", "tangerina"]

def vitamina(f, fr):
    x = FR[fr]
    nome = "Vitamina de %s" % fr
    return R(nome, f, "bebida", "4 min", "1 copo", ["150 ml de leite integral", x[1], "1 colher (sopa) de aveia"],
             [x[2], "Bata tudo no liquidificador.", "Coe se a fruta tiver sementes." if fr in ("goiaba", "morango", "kiwi") else "Sirva na hora.", "Sem açúcar: a fruta adoça."], "Conta como uma porção de leite do dia.")

SUCOS = [("laranja e cenoura", ["2 laranjas", "1/2 cenoura"]), ("melão com hortelã", ["2 fatias de melão", "Folhas de hortelã"]), ("acerola com laranja", ["10 acerolas", "1 laranja"]),
         ("manga com maracujá", ["1/2 manga", "Polpa de 1/2 maracujá"]), ("morango com laranja", ["5 morangos", "1 laranja"]), ("mamão com laranja", ["1 fatia de mamão", "1 laranja"]),
         ("caju", ["2 cajus maduros"]), ("tangerina", ["3 tangerinas"]), ("goiaba", ["1 goiaba"]), ("pera com gengibre suave", ["1 pera", "1 lasquinha de gengibre"]),
         ("melancia com morango", ["2 fatias de melancia", "3 morangos"]), ("abacaxi com couve", ["2 fatias de abacaxi", "1 folha de couve"])]
def suco(f, s):
    nome = "Suco de %s" % s[0]
    return R(nome, f, "bebida", "5 min", "2 copos pequenos", s[1] + ["Água filtrada"],
             ["Lave bem as frutas e retire cascas e sementes.", "Bata com um pouco de água.", "Coe se tiver sementes ou fiapos.",
              "Sirva na hora, sem açúcar. Limite de %s por dia." % ("120 ml" if f < 48 else "120 a 180 ml")], "Fruta inteira é melhor que suco: ofereça os dois em dias diferentes.")

AGUAS = [("limão e hortelã", ["1/2 limão em rodelas", "Folhas de hortelã"]), ("maçã e canela", ["1/2 maçã em fatias", "1 pau de canela"]), ("morango e manjericão", ["4 morangos fatiados", "Folhas de manjericão"]),
         ("pepino e limão", ["1/2 pepino em rodelas", "1/2 limão"]), ("abacaxi e hortelã", ["2 fatias de abacaxi em cubos", "Hortelã"]), ("melancia e limão", ["1 fatia de melancia em cubos", "1/2 limão"]),
         ("laranja e cravo", ["1 laranja em rodelas", "2 cravos"]), ("kiwi e limão", ["1 kiwi em rodelas", "1/2 limão"])]
def agua(f, a):
    nome = "Água saborizada de %s" % a[0]
    return R(nome, f, "bebida", "5 min + 1 h", "1 litro", ["1 litro de água filtrada"] + a[1],
             ["Coloque as frutas e ervas na jarra com a água.", "Deixe na geladeira por pelo menos 1 hora.", "Retire os pedaços antes de servir para a criança."], "Ajuda quem não gosta de beber água pura. Sem açúcar.")

SMOOTHIES = [("manga e iogurte", ["1/2 manga", "1 pote de iogurte natural"]), ("frutas vermelhas", ["1 xícara de frutas vermelhas", "1 pote de iogurte", "1/2 banana"]),
             ("banana e mamão", ["1/2 banana", "1 fatia de mamão", "1/2 copo de leite"]), ("abacaxi e hortelã com iogurte", ["2 fatias de abacaxi", "Hortelã", "1 pote de iogurte"]),
             ("pêssego e aveia", ["1 pêssego", "1 colher (sopa) de aveia", "1 pote de iogurte"]), ("kiwi e banana", ["1 kiwi", "1 banana congelada", "1/2 copo de leite"]),
             ("abacate e cacau", ["1/4 de abacate", "1 colher (chá) de cacau 100%", "1 banana", "1 copo de leite"])]
def smoothie(f, s):
    nome = "Smoothie de %s" % s[0]
    return R(nome, f, "bebida", "4 min", "1 copo", s[1], ["Lave e corte as frutas.", "Bata tudo no liquidificador até ficar cremoso.", "Sirva na hora, sem açúcar."], "Use fruta congelada para ficar geladinho.")

def limonada(f, s):
    nome = "Limonada de %s" % s
    extra = {"morango": "5 morangos", "melancia": "2 fatias de melancia", "hortelã": "Folhas de hortelã", "pera": "1 pera madura", "abacaxi": "1 fatia de abacaxi"}[s]
    return R(nome, f, "bebida", "5 min", "3 copos", ["1 limão", extra, "500 ml de água gelada"],
             ["Bata a fruta (ou a hortelã) com a água.", "Junte o suco do limão espremido (não bata o limão com casca).", "Coe e sirva sem açúcar."], "A fruta tira a acidez do limão.")

GELATINAS = ["uva integral", "laranja", "maracujá", "morango"]
def gelatina(f, s):
    nome = "Gelatina natural de %s" % s
    return R(nome, f, "sobremesa", "15 min + 3 h", "4 porções", ["1 envelope de gelatina incolor sem sabor", "2 xícaras de suco natural de " + s + " sem açúcar"],
             ["Hidrate a gelatina conforme a embalagem.", "Dissolva em 1/2 xícara do suco quente.", "Misture com o restante do suco.", "Distribua em potinhos e leve à geladeira por 3 horas."], "Sem corantes e sem açúcar, diferente da gelatina de pacote.")

DOCES24 = [
    ("Brigadeiro de banana com cacau", 24, ["2 bananas maduras", "1 colher (sopa) de cacau 100%", "1 colher (sopa) de manteiga", "Aveia em flocos para enrolar"], ["Amasse as bananas e leve ao fogo com cacau e manteiga, mexendo até desgrudar.", "Espere esfriar, enrole e passe na aveia."], "Doce de festa sem leite condensado."),
    ("Mousse de abacate com cacau", 24, ["1/2 abacate", "1 banana", "1 colher (sopa) de cacau 100%"], ["Bata tudo até ficar liso.", "Leve à geladeira por 1 hora."], "Ninguém percebe que é abacate."),
    ("Bolo de chocolate com beterraba", 24, ["1 beterraba crua", "3 ovos", "1/2 xícara de óleo", "1/2 xícara de açúcar mascavo", "2 xícaras de farinha", "4 colheres (sopa) de cacau", "1 colher (sopa) de fermento"], ["Bata beterraba, ovos, óleo e açúcar.", "Misture farinha, cacau e fermento.", "Asse a 180 °C por 35 minutos."], "Pouco açúcar e de vez em quando."),
    ("Paçoca caseira de banana", 36, ["1 xícara de amendoim torrado sem sal", "1 banana madura", "2 colheres (sopa) de farinha de mandioca"], ["Triture o amendoim até virar farofa.", "Misture a banana e a farinha até dar liga.", "Aperte em forminhas e leve à geladeira."], "Amendoim sempre triturado até os 5 anos."),
    ("Arroz-doce de banana sem açúcar", 12, ["1/2 xícara de arroz", "2 xícaras de leite", "1 banana madura", "Canela"], ["Cozinhe o arroz em água até amolecer.", "Junte o leite e cozinhe mexendo até engrossar.", "Desligue e misture a banana amassada e canela."], "Adoçado só pela banana."),
    ("Doce de abóbora sem açúcar", 12, ["500 g de abóbora", "2 cravos", "1 pau de canela", "1 maçã ralada"], ["Cozinhe a abóbora com cravo, canela e maçã em pouca água.", "Amasse até virar um creme e retire o cravo e a canela."], "Retire os cravos antes de servir."),
    ("Pudim de chia com manga", 36, ["3 colheres (sopa) de chia", "1 xícara de leite", "1/2 manga"], ["Misture a chia com o leite e deixe na geladeira por 4 horas.", "Cubra com manga batida."], "Chia sempre hidratada."),
    ("Bolo de cenoura com cobertura de banana e cacau", 36, ["3 cenouras", "3 ovos", "1/2 xícara de óleo", "1/2 xícara de açúcar mascavo", "2 xícaras de farinha", "1 colher (sopa) de fermento", "Cobertura: 2 bananas e 2 colheres (sopa) de cacau"], ["Bata cenoura, ovos, óleo e açúcar.", "Misture farinha e fermento.", "Asse a 180 °C por 35 minutos.", "Cubra com banana amassada com cacau."], "Doce de fim de semana."),
    ("Cocada cremosa de forno", 48, ["1 xícara de coco ralado sem açúcar", "1 xícara de leite", "2 ovos", "2 bananas"], ["Bata leite, ovos e bananas.", "Misture o coco.", "Asse em potinhos a 180 °C por 25 minutos."], "Sem leite condensado."),
    ("Torta de maçã de liquidificador", 48, ["3 maçãs", "2 ovos", "1 xícara de leite", "1 xícara de farinha", "3 colheres (sopa) de açúcar mascavo", "Canela", "1 colher (sopa) de fermento"], ["Bata ovos, leite, farinha, açúcar e fermento.", "Arrume as maçãs fatiadas na forma e cubra com a massa.", "Polvilhe canela e asse a 180 °C por 35 minutos."], "Pouco açúcar e de vez em quando."),
    ("Mousse de maracujá com iogurte", 48, ["2 potes de iogurte natural", "Polpa de 2 maracujás coada", "1 colher (sopa) de mel"], ["Bata o iogurte com a polpa e o mel.", "Leve à geladeira por 2 horas."], "Mel só depois de 1 ano, e com moderação."),
    ("Biscoito de nata de forno", 60, ["2 xícaras de farinha", "1/2 xícara de manteiga", "3 colheres (sopa) de açúcar", "1 ovo"], ["Misture tudo até formar massa.", "Modele biscoitinhos.", "Asse a 180 °C por 15 minutos."], "Doce caseiro para dias especiais."),
    ("Sorvete de iogurte com morango", 60, ["2 potes de iogurte natural", "1 xícara de morangos congelados", "1 banana congelada"], ["Bata tudo no processador.", "Congele por 2 horas e sirva."], "Cremoso e sem açúcar."),
]

SALADAS = [("banana, maçã e laranja"), ("manga, kiwi e morango"), ("melão, melancia e uva cortada"), ("mamão, banana e abacaxi"), ("pera, uva cortada e kiwi"), ("morango, banana e manga"), ("pêssego, maçã e goiaba")]
def salada(f, s):
    nome = "Salada de frutas: %s" % s
    return R(nome, f, "fruta", "10 min", "2 porções", ["Frutas: " + s, "Suco de 1 laranja"] + (["1 colher (sopa) de aveia"] if f >= 12 else []),
             ["Lave e descasque as frutas.", "Corte em cubinhos" + (" e as uvas em 4 partes." if "uva" in s and f < 48 else "."), "Regue com o suco de laranja e sirva fresquinha."], "Cada cor é um nutriente diferente.")

def fruta_amendoim(f, fr):
    x = FR[fr]
    return R("%s com pasta de amendoim" % cap(fr), f, "fruta", "3 min", "1 porção", [x[1], "1 colher (chá) de pasta de amendoim pura"],
             [x[2], "Corte em fatias.", "Espalhe uma camada bem fina de pasta de amendoim."], "Camada fina: pasta grossa gruda no céu da boca.")

def espetinho(f, s):
    return R("Espetinho de %s" % s, f, "fruta", "10 min", "4 espetinhos", ["Frutas: " + s, "Palitos de churrasco sem ponta"],
             ["Corte as frutas em cubos.", "Monte os espetinhos (corte a ponta do palito).", "Sirva com ela sentada."], "Montar é uma ótima brincadeira na cozinha.")

def bolo_fruta(f, fr):
    x = FR[fr]
    acucar = f >= 24
    nome = "Bolo de %s%s" % (fr, "" if acucar else " sem açúcar")
    i = [x[1].replace("1/2 ", "2 ").replace("1 fatia", "2 fatias").replace("1/4", "1"), "2 ovos", "1 xícara de aveia ou farinha integral", "1/4 xícara de óleo", "1 colher (sopa) de fermento"]
    if acucar: i.insert(4, "3 colheres (sopa) de açúcar mascavo (opcional)")
    return R(nome, f, "lanche", "45 min", "10 fatias", i, [x[2], "Bata a fruta, os ovos e o óleo" + (" e o açúcar." if acucar else "."), "Misture a farinha e, por último, o fermento.", "Asse em forma untada a 180 °C por 30 a 35 minutos."],
             "Quanto mais madura a fruta, mais doce o bolo." if not acucar else "Pouco açúcar: a fruta já adoça.")

def mingau_k(f, fr):
    x = FR[fr]
    return R("Mingau de aveia com %s" % fr, f, "cafe", "8 min", "1 porção", ["1 xícara de leite", "3 colheres (sopa) de aveia", x[1], "Canela"],
             ["Cozinhe o leite com a aveia, mexendo, por 4 minutos.", x[2], "Desligue e misture a fruta picada ou amassada.", "Polvilhe canela e sirva morno."], "Sem açúcar: a fruta adoça.")

def iogurte_k(f, fr):
    x = FR[fr]
    return R("Iogurte com %s e aveia" % fr, f, "cafe", "3 min", "1 porção", ["1 pote de iogurte natural integral", x[1], "1 colher (sopa) de aveia"],
             [x[2], "Pique a fruta.", "Misture com o iogurte e a aveia."], "Iogurte natural é a melhor escolha: sem açúcar e sem corantes.")

def crepioca_k(f, rech):
    return R("Crepioca com %s" % rech, f, "cafe", "8 min", "1 porção", ["1 ovo", "2 colheres (sopa) de goma de tapioca", rech.capitalize()],
             ["Bata o ovo com a goma.", "Despeje na frigideira untada e tampe por 2 minutos.", "Vire, coloque o recheio e dobre."], "Rápida e com proteína.")

RECHEIOS = ["frango com cenoura", "ovo com tomate", "ricota com espinafre", "atum com milho", "queijo branco com pepino", "carne desfiada com tomate", "grão-de-bico com cenoura", "peito de peru caseiro de frango assado", "abacate com ovo", "frango com abacaxi"]
def sanduiche_k(f, r, pao):
    nome = "Sanduíche de %s no %s" % (r, pao)
    return R(nome, f, "lanche", "10 min", "2 sanduíches", ["4 fatias de " + pao if pao != "pão sírio" else "2 pães sírios", "Recheio: " + r, "1 colher (sopa) de iogurte natural ou azeite"],
             ["Prepare o recheio picando ou desfiando tudo bem pequeno.", "Misture com o iogurte ou o azeite.", "Recheie o pão e corte em quadradinhos ou triângulos."], "Leve na lancheira com gelo reutilizável." if "atum" not in r else "Atum até 1 vez por semana.")
PASTAS = [("pasta de grão-de-bico", "1/2 xícara de grão-de-bico cozido, azeite e limão"), ("pasta de ricota com ervas", "1/2 xícara de ricota, azeite e salsinha"), ("guacamole sem pimenta", "1/2 abacate, tomate picado e limão"), ("pasta de iogurte com pepino", "1 pote de iogurte natural e pepino ralado"), ("pasta de feijão branco", "1/2 xícara de feijão-branco cozido e azeite")]
PALITOS_K = ["cenoura e abobrinha", "batata-doce e brócolis", "pepino e cenoura", "chuchu e vagem", "mandioquinha e couve-flor", "pão sírio e pepino"]
def palitos_k(f, pal, pasta):
    nome = "Palitos de %s com %s" % (pal, pasta[0])
    cru = f >= 48
    return R(nome, f, "lanche", "15 min", "2 porções", ["Palitos de " + pal, pasta[1]],
             ["Corte em palitos do tamanho de um dedo." + ("" if cru else " Cozinhe os legumes no vapor até ficarem macios."), "Amasse ou bata os ingredientes da pasta até ficar cremosa.", "Sirva os palitos para ela molhar na pasta."],
             "Legume cru e duro só depois dos 4 anos." if not cru else "Crus e crocantes, sempre com ela sentada.")

# ------------------------------------------------------------------ montagem
saida = []
def add(r):
    k = r["n"].lower()
    if k in USADOS: return False
    USADOS.add(k); saida.append(r); return True

def fill(f, t, geradores):
    precisa = ALVO[f].get(t, 0) - existentes.get((f, t), 0)
    feitos = 0
    for g in geradores:
        if feitos >= precisa: break
        r = g()
        if r and add(r): feitos += 1
    if feitos < precisa:
        raise SystemExit("faltou %s/%s: %d de %d" % (f, t, feitos, precisa))

def ciclo(seq, n):
    out = []
    for x in itertools.islice(itertools.cycle(seq), n): out.append(x)
    return out

# --- bebês
for idx, f in enumerate(BEBE):
    carbs = [c for c in CARBS if c[3] <= f]
    gens = []
    combos = []
    k = idx * 7
    for j in range(200):
        c = carbs[(j + k) % len(carbs)]
        p = PROTS[(j * 2 + k) % len(PROTS)]
        v = VEGS[(j * 3 + k + j // len(VEGS)) % len(VEGS)]
        l = LEGS[(j + k // 2) % len(LEGS)]
        combos.append((c, p, v, l))
    fig = [0]
    def mk_pap(c, p, v, l, f=f):
        if p[0] == "fígado":
            if fig[0] >= 2: return None
            fig[0] += 1
        return papinha(f, c, p, v, l)
    familias = []
    if f >= 7: familias += [lambda j, f=f: macarrao(f, PROTS[j % 6], VEGS[(j * 2) % len(VEGS)])]
    if f >= 8: familias += [lambda j, f=f: bolinho(f, carbs[j % 6], PROTS[(j + 1) % 4], VEGS[(j * 3) % 7]), lambda j, f=f: omelete(f, VEGS[(j + idx) % len(VEGS)])]
    if f >= 9: familias += [lambda j, f=f: risoto(f, PROTS[(j + idx) % 7], VEGS[(j * 2 + 1) % len(VEGS)]), lambda j, f=f: almondega(f, ("carne",) if j % 2 == 0 else ("frango",), VEGS[(j + idx) % 7])]
    if f >= 10: familias += [lambda j, f=f: escondidinho(f, [c for c in carbs if c[0] in ("mandioca", "batata", "batata-doce", "mandioquinha", "inhame")][j % 5], PROTS[(j + 2) % 5]), lambda j, f=f: panqueca_salg(f, VEGS[(j + 4) % len(VEGS)])]
    if f >= 11: familias += [lambda j, f=f: sopa_grossa(f, PROTS[(j + 3) % 6], VEGS[(j * 2) % len(VEGS)], carbs[(j + 2) % len(carbs)])]
    nfam = {6: 0, 7: 4, 8: 8, 9: 10, 10: 12, 11: 12}[f]
    for j in range(nfam):
        fam = familias[j % len(familias)] if familias else None
        if fam: gens.append(lambda fam=fam, j=j: fam(j // max(1, len(familias)) + idx))
    for cb in combos: gens.append(lambda cb=cb: mk_pap(*cb))
    fill(f, "almoco", gens)

    nomes = [x[0] for x in FRUTAS]
    fg = []
    for j in range(len(nomes)): fg.append(lambda j=j: fruta_bebe(f, nomes[(j + idx * 3) % len(nomes)]) if f < 9 else None)
    for j in range(5): fg.append(lambda j=j: fruta_assada(f, ["banana", "pera", "maçã", "goiaba", "ameixa", "manga"][(j + idx) % 6]))
    for j in range(300): fg.append(lambda j=j: fruta_bebe(f, nomes[(j + idx) % len(nomes)], nomes[(j * 3 + 1 + idx) % len(nomes)], nomes[(j * 7 + 5) % len(nomes)] if f >= 9 else None))
    fill(f, "fruta", [g for g in fg])

    cg = []
    for j in range(40):
        fr = ["banana", "maçã", "pera", "mamão", "manga", "ameixa", "pêssego", "caqui"][(j + idx) % 8]
        cer = ["aveia", "quinoa", "arroz", "milho"][(j + j // 8 + idx) % 4]
        if f >= 9 and j % 3 == 1: cg.append(lambda fr=fr: panqueca_fruta(f, fr))
        elif f >= 9 and j % 3 == 2: cg.append(lambda j=j: ovo_mexido(f, VEGS[(j + idx) % len(VEGS)]))
        else: cg.append(lambda fr=fr, cer=cer: papinha_cereal(f, cer, fr))
    fill(f, "cafe", cg)

    lg = []
    for j in range(60):
        if f == 7: lg.append(lambda j=j: papinha_cereal(f, ["quinoa", "milho"][j % 2], ["mamão", "manga", "banana", "kiwi"][j % 4]) and dict(papinha_cereal(f, ["quinoa", "milho"][j % 2], ["mamão", "manga", "banana", "kiwi"][j % 4]), t="lanche"))
        else:
            ops = [lambda j=j: palitos(f, VEGS[j % 7][0], VEGS[(j + 3) % 7][0])]
            if f >= 9: ops += [lambda j=j: iogurte(f, nomes[(j + idx) % len(nomes)]), lambda j=j: bolinho_doce(f, ["banana", "maçã", "pera", "mamão", "manga"][j % 5])]
            if f >= 10: ops += [lambda j=j: biscoito(f, ["banana", "maçã", "pera", "manga", "mamão"][(j + 2) % 5]), lambda j=j: muffin_salg(f, VEGS[(j + idx) % len(VEGS)])]
            lg.append(ops[j % len(ops)])
    fill(f, "lanche", lg)

    sg = []
    for j in range(40):
        a, b = nomes[(j + idx) % len(nomes)], nomes[(j * 3 + 2) % len(nomes)]
        if a != b: sg.append(lambda a=a, b=b: picole(f, a, b) if j % 2 == 0 else nice_cream(f, a))
    fill(f, "sobremesa", sg)

# --- 1 ano em diante
ANO = [12, 24, 36, 48]
for idx, f in enumerate(ANO):
    # almoço: pratos prontos da fase, depois famílias
    gens = [lambda d=d: R(d[0], max(d[1], f), "almoco", d[2], d[3], d[4], d[5], d[6]) for d in PRATOS if d[1] <= f and (fase_de(d[1]) == f)]
    gens += [lambda d=d: R(d[0], max(d[1], f), "almoco", d[2], d[3], d[4], d[5], d[6]) for d in PRATOS if d[1] < f]
    rnd = random.Random(f)
    vegs_ok = [v for v in KVEG if f >= 24 or v[0] != "salada de tomate e pepino"]
    ris_ok = [r for r in RISOTOS if f >= 24 or r != "cogumelos"]
    mol_ok = [m for m in MOLHOS if f >= 48 or "atum" not in m[0]]
    a = [(0, p, v) for p in KPROT for v in vegs_ok]
    b = [(1, p, v) for p in ["frango", "carne moída", "lombo"] for v in ris_ok]
    c = [(2, p, v) for p in FORMATOS for v in mol_ok]
    for lst in (a, b, c): rnd.shuffle(lst)
    mix = []
    for trio in itertools.zip_longest(a, b, c, a[len(a)//2:]):
        mix += [x for x in trio if x]
    for k, p, v in mix:
        if k == 0: gens.append(lambda p=p, v=v: prato_br(f, p, v))
        elif k == 1: gens.append(lambda p=p, v=v: risoto_k(f, p, v))
        else: gens.append(lambda p=p, v=v: macarrao_k(f, p, v))
    fill(f, "almoco", gens)

    cg = [lambda d=d: R(d[0], max(d[1], f), "cafe", "10 min", "1 porção", d[2], d[3], d[4]) for d in CAFES_K if fase_de(d[1]) == f]
    cg += [lambda d=d: R(d[0], max(d[1], f), "cafe", "10 min", "1 porção", d[2], d[3], d[4]) for d in CAFES_K if d[1] < f]
    for j in range(60):
        fr = FRUTAS_ANO[(j + idx * 2) % len(FRUTAS_ANO)]
        cg.append([lambda fr=fr: mingau_k(f, fr), lambda fr=fr: iogurte_k(f, fr), lambda j=j: crepioca_k(f, ["frango desfiado", "queijo e tomate", "espinafre", "ricota e orégano", "banana e canela", "atum" if f >= 48 else "ovo e cenoura"][(j + idx) % 6])][j % 3])
    fill(f, "cafe", cg)

    lg = [lambda d=d: R(d[0], max(d[1], f), "lanche", "30 min", "porções para a família", d[2], d[3], d[4]) for d in LANCHES_K if fase_de(d[1]) == f]
    lg += [lambda d=d: R(d[0], max(d[1], f), "lanche", "30 min", "porções para a família", d[2], d[3], d[4]) for d in LANCHES_K if d[1] < f]
    rl = random.Random(f * 3)
    opts = [("bolo", x) for x in FRUTAS_ANO] + [("bisc", x) for x in ["banana", "maçã", "pera", "manga", "mamão", "caqui", "pêssego", "goiaba"]] + [("muf", v) for v in VEGS] + \
           [("pal", (a, b)) for a in PALITOS_K for b in PASTAS] + ([("san", (r, pz)) for r in RECHEIOS for pz in ["pão integral", "pão sírio", "pão de forma"] if f >= 48 or "atum" not in r] if f >= 24 else [])
    rl.shuffle(opts)
    for k, x in opts:
        if k == "bolo": lg.append(lambda x=x: bolo_fruta(f, x))
        elif k == "bisc": lg.append(lambda x=x: biscoito(f, x))
        elif k == "muf": lg.append(lambda x=x: dict(muffin_salg(f, x), f=f))
        elif k == "pal": lg.append(lambda x=x: palitos_k(f, x[0], x[1]))
        else: lg.append(lambda x=x: sanduiche_k(f, x[0], x[1]))
    fill(f, "lanche", lg)

    fg = []
    for j in range(20):
        s = SALADAS[(j + idx) % len(SALADAS)]
        fg.append([lambda s=s: salada(f, s), lambda j=j: fruta_amendoim(f, ["banana", "maçã", "pera"][(j + idx) % 3]) if f < 48 else espetinho(f, SALADAS[(j + idx + 3) % len(SALADAS)]), lambda j=j: dict(fruta_assada(f, ["maçã", "pera", "banana", "goiaba"][(j + idx) % 4]), t="fruta")][j % 3])
    fill(f, "fruta", fg)

    bg = []
    for j in range(80):
        ops = [lambda j=j: vitamina(f, FRUTAS_ANO[(j + idx * 2) % 10]), lambda j=j: suco(f, SUCOS[(j + idx * 2) % len(SUCOS)]), lambda j=j: agua(f, AGUAS[(j + idx) % len(AGUAS)])]
        ops.append(lambda j=j: smoothie(max(f, 18), SMOOTHIES[(j + idx) % len(SMOOTHIES)]))
        if f >= 24: ops.append(lambda j=j: limonada(f, ["morango", "melancia", "hortelã", "pera", "abacaxi"][(j + idx) % 5]))
        bg.append(ops[j % len(ops)])
    fill(f, "bebida", bg)

    sg = [lambda d=d: R(d[0], max(d[1], f), "sobremesa", "40 min", "porções para a família", d[2], d[3], d[4]) for d in DOCES24 if fase_de(d[1]) == f]
    sg += [lambda d=d: R(d[0], max(d[1], f), "sobremesa", "40 min", "porções para a família", d[2], d[3], d[4]) for d in DOCES24 if d[1] < f]
    for j in range(60):
        a, b = FRUTAS_ANO[(j + idx) % len(FRUTAS_ANO)], FRUTAS_ANO[(j * 4 + 3) % len(FRUTAS_ANO)]
        sg.append([lambda a=a, b=b: picole(f, a, b) if a != b else None, lambda a=a: nice_cream(f, a) if a != "banana" else None, lambda j=j: gelatina(f, GELATINAS[(j + idx) % 4]), lambda a=a: fruta_assada(f, ["maçã", "pera", "banana", "goiaba", "pêssego"][(j + idx) % 5])][j % 4])
    fill(f, "sobremesa", sg)

# conferências de segurança
for r in saida:
    txt = (" ".join(r["i"] + r["p"])).lower()
    if r["f"] < 12:
        assert "sal (pouco)" not in txt and "leite integral" not in txt and "pão" not in txt.replace("pão-", ""), r["n"]
        assert r["t"] != "bebida", r["n"]
    if r["f"] < 24:
        assert "açúcar" not in txt.replace("sem açúcar", "").replace("nem açúcar", "") and not re.search(r"\bmel\b", txt), r["n"]
    if r["f"] < 48:
        assert "pipoca" not in txt and "castanhas inteiras" not in txt, r["n"]

total = {}
for r in EXIST + saida:
    total[fase_de(r["f"])] = total.get(fase_de(r["f"]), 0) + 1
assert all(v == 50 for v in total.values()), total
print(total, len(saida))
dest = os.path.join(AQUI, "..", "receitas.js")
with open(dest, "w") as fh:
    fh.write("// Livro de receitas BabyLi: gerado por tools/gerar_receitas.py (50 receitas por fase, 6 meses a 5 anos)\n")
    fh.write("var LIVRO = [\n" + ",\n".join(json.dumps(r, ensure_ascii=False) for r in saida) + "\n];\n")
