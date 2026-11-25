// Receitas do cardápio "Meu Prato da Semana".
// Cada receita rende as porções indicadas; "kcal" é por porção, igual à porção do cardápio.
// Sem chia, quiabo, carne vermelha ou café. Proteína: frango, ovos, leite, queijo, feijão.
window.RECEITAS = [
  {
    id: "frango-base", nome: "Frango cozido e desfiado da semana", dias: [6], refeicao: "Preparo de domingo",
    tempo: 50, porcoes: 10, kcal: 160, tags: ["Base da semana", "Congela bem"],
    resumo: "Faça no domingo e use a semana toda: sanduíche, tapioca, wrap, escondidinho e sopa.",
    ingredientes: ["1,2 kg de peito de frango", "1 cebola grande cortada em 4", "4 dentes de alho amassados", "2 folhas de louro", "1 col. chá de sal", "Água para cobrir"],
    passos: [
      "Coloque o frango, a cebola, o alho, o louro e o sal na panela de pressão.",
      "Cubra com água e cozinhe por 20 minutos depois que pegar pressão.",
      "Espere a pressão sair, tire o frango e guarde o caldo (serve para a sopa de quinta).",
      "Separe 3 filés inteiros para grelhar na semana. Desfie o resto com dois garfos ainda morno.",
      "Guarde em potes: 4 dias na geladeira ou 3 meses no congelador."
    ],
    dica: "Porção do cardápio: 4 colheres de sopa de frango desfiado = cerca de 100 g."
  },
  {
    id: "frango-grelhado", nome: "Filé de frango grelhado", dias: [0], refeicao: "Almoço",
    tempo: 15, porcoes: 1, kcal: 200, tags: ["Rápido"],
    resumo: "O filé que mais aparece no cardápio. Suculento e pronto em 15 minutos.",
    ingredientes: ["1 filé de peito de frango (120 g, do tamanho da palma da mão)", "1/2 limão", "1 dente de alho amassado", "1 pitada de sal e de páprica", "1 col. chá de azeite"],
    passos: [
      "Tempere o filé com limão, alho, sal e páprica. Se der, deixe 10 minutos no tempero.",
      "Aqueça bem uma frigideira antiaderente com o azeite.",
      "Grelhe 4 a 5 minutos de cada lado sem mexer, até dourar.",
      "Corte no meio: por dentro não pode ficar rosado."
    ],
    dica: "Bata o filé com um copo para deixar fino por igual. Assim cozinha mais rápido e não resseca."
  },
  {
    id: "omelete-tomate", nome: "Omelete de tomate e cebola", dias: [0], refeicao: "Jantar",
    tempo: 10, porcoes: 1, kcal: 210, tags: ["Rápido", "Jantar leve"],
    resumo: "Jantar de 10 minutos, com proteína para segurar a fome da noite.",
    ingredientes: ["2 ovos", "1/2 tomate picado sem sementes", "1 col. sopa de cebola picada", "Cheiro-verde a gosto", "1 pitada de sal", "1 fio de azeite"],
    passos: [
      "Bata os ovos com o sal até espumar.",
      "Misture o tomate, a cebola e o cheiro-verde.",
      "Aqueça a frigideira com o azeite em fogo baixo e despeje a mistura.",
      "Tampe e deixe 3 minutos. Vire com a ajuda de um prato e deixe mais 1 minuto."
    ],
    dica: "Sirva com 3 colheres de sopa de arroz e salada à vontade, como no cardápio."
  },
  {
    id: "tapioca-ovo-queijo", nome: "Tapioca com ovo e queijo", dias: [1, 6], refeicao: "Café da manhã",
    tempo: 10, porcoes: 1, kcal: 300, tags: ["Café da manhã", "Sem glúten"],
    resumo: "Café da manhã quentinho que fica pronto enquanto o leite esquenta.",
    ingredientes: ["3 col. sopa de goma de tapioca", "1 ovo", "1 fatia de queijo branco (30 g)", "1 pitada de sal", "Tomate em rodelas (domingo)"],
    passos: [
      "Faça o ovo mexido com uma pitada de sal e reserve.",
      "Peneire a goma na frigideira fria, espalhando como um disco.",
      "Ligue o fogo médio. Quando a goma grudar e soltar das bordas (uns 2 minutos), vire.",
      "Recheie metade com o ovo e o queijo (e o tomate, no domingo), dobre e deixe 1 minuto."
    ],
    dica: "Peneirar a goma é o segredo para a tapioca não ficar dura."
  },
  {
    id: "frango-desfiado-tomate", nome: "Frango desfiado refogado com tomate", dias: [1], refeicao: "Almoço",
    tempo: 15, porcoes: 3, kcal: 170, tags: ["Usa o frango de domingo"],
    resumo: "O frango da semana ganha molho e vira almoço em 15 minutos.",
    ingredientes: ["12 col. sopa de frango desfiado (300 g)", "2 tomates maduros picados", "1/2 cebola picada", "1 dente de alho", "1 col. chá de azeite", "Cheiro-verde e sal a gosto"],
    passos: [
      "Refogue a cebola e o alho no azeite até murchar.",
      "Junte o tomate e cozinhe 5 minutos, amassando com a colher.",
      "Acrescente o frango, misture e deixe mais 3 minutos.",
      "Finalize com cheiro-verde. Porção: 4 colheres de sopa."
    ],
    dica: "Rende 3 porções: almoço de terça e recheio do sanduíche e do wrap."
  },
  {
    id: "sanduiche-frango", nome: "Sanduíche natural de frango", dias: [1], refeicao: "Jantar",
    tempo: 5, porcoes: 1, kcal: 420, tags: ["5 minutos", "Sem fogão"],
    resumo: "Jantar sem fogão para os dias mais cansativos.",
    ingredientes: ["2 fatias de pão integral", "3 col. sopa de frango desfiado", "1 col. sopa de requeijão light", "Alface, tomate e cenoura ralada à vontade"],
    passos: [
      "Misture o frango com o requeijão.",
      "Espalhe sobre uma fatia de pão.",
      "Cubra com alface, tomate e cenoura ralada e feche com a outra fatia."
    ],
    dica: "Leve ao fogo numa frigideira, 1 minuto de cada lado, se quiser quentinho."
  },
  {
    id: "panqueca-banana", nome: "Panqueca de banana e aveia", dias: [2], refeicao: "Café da manhã",
    tempo: 10, porcoes: 1, kcal: 330, tags: ["Doce sem açúcar", "Café da manhã"],
    resumo: "Doce, sem açúcar e cheia de proteína. Ótima para os dias de vontade de doce.",
    ingredientes: ["1 banana madura", "2 ovos", "2 col. sopa de aveia em flocos", "1 pitada de canela"],
    passos: [
      "Amasse bem a banana com um garfo.",
      "Misture os ovos, a aveia e a canela até ficar uma massa.",
      "Despeje pequenas porções na frigideira antiaderente em fogo baixo.",
      "Vire quando aparecerem bolhinhas (uns 2 minutos) e deixe mais 1 minuto."
    ],
    dica: "Quanto mais madura a banana, mais doce fica a panqueca."
  },
  {
    id: "coxa-assada-brocolis", nome: "Coxa de frango assada com brócolis", dias: [2], refeicao: "Almoço",
    tempo: 45, porcoes: 4, kcal: 230, tags: ["Forno", "Faça a mais"],
    resumo: "Asse 4 coxas de uma vez: uma para hoje, as outras para sábado e domingo.",
    ingredientes: ["4 coxas ou sobrecoxas de frango sem pele", "Suco de 1 limão", "2 dentes de alho", "1 col. chá de páprica", "1 col. chá de sal", "1 maço de brócolis em ramos"],
    passos: [
      "Tempere as coxas com limão, alho, páprica e sal.",
      "Asse em forno a 200 °C por 35 minutos, numa assadeira untada com um fio de azeite.",
      "Nos últimos 10 minutos, coloque os ramos de brócolis ao redor do frango.",
      "Porção: 1 coxa + 4 ramos de brócolis."
    ],
    dica: "Tirar a pele corta quase metade da gordura do frango."
  },
  {
    id: "macarrao-frango", nome: "Macarrão integral com frango ao molho de tomate", dias: [2], refeicao: "Jantar",
    tempo: 20, porcoes: 2, kcal: 450, tags: ["Conforto"],
    resumo: "Prato de conforto, na medida certa para o plano.",
    ingredientes: ["160 g de macarrão integral (2 xícaras cozido)", "6 col. sopa de frango desfiado", "1 caixinha de molho de tomate (ou 3 tomates batidos)", "1/2 cebola e 1 dente de alho picados", "Manjericão ou orégano"],
    passos: [
      "Cozinhe o macarrão em água com sal pelo tempo da embalagem.",
      "Refogue a cebola e o alho com um fio de azeite.",
      "Junte o molho de tomate e o frango e cozinhe 5 minutos.",
      "Misture ao macarrão. Porção: 1 prato raso (1 xícara de macarrão + molho)."
    ],
    dica: "Guarde a segunda porção para o almoço do dia seguinte."
  },
  {
    id: "strogonoff-light", nome: "Strogonoff de frango light", dias: [3], refeicao: "Almoço",
    tempo: 25, porcoes: 3, kcal: 230, tags: ["Favorito da família"],
    resumo: "O sabor do strogonoff, trocando o creme de leite por iogurte natural.",
    ingredientes: ["400 g de peito de frango em cubos", "1/2 cebola picada", "2 dentes de alho", "1 caixinha de molho de tomate", "1 col. sopa de mostarda", "6 col. sopa de iogurte natural", "Sal a gosto"],
    passos: [
      "Doure o frango em cubos com a cebola e o alho numa panela com um fio de azeite.",
      "Junte o molho de tomate e a mostarda e cozinhe 10 minutos em fogo baixo.",
      "Desligue o fogo e espere 2 minutos.",
      "Só então misture o iogurte, para não talhar. Porção: 4 colheres de sopa."
    ],
    dica: "Acompanhe com 4 colheres de arroz e salada, e deixe a batata palha de fora."
  },
  {
    id: "sopa-legumes-frango", nome: "Sopa de legumes com frango", dias: [3], refeicao: "Jantar",
    tempo: 30, porcoes: 4, kcal: 330, tags: ["Congela bem", "Noite fria"],
    resumo: "Faça o dobro e congele: é o jantar dos dias em que não der tempo de nada.",
    ingredientes: ["2 batatas médias em cubos", "2 cenouras em rodelas", "1 chuchu em cubos", "1 abobrinha em cubos", "8 col. sopa de frango desfiado", "1 litro do caldo do frango (ou água)", "Cebola, alho, sal e cheiro-verde"],
    passos: [
      "Refogue a cebola e o alho com um fio de azeite.",
      "Junte a batata, a cenoura e o chuchu, cubra com o caldo e cozinhe 15 minutos.",
      "Acrescente a abobrinha e o frango e cozinhe mais 5 minutos.",
      "Acerte o sal e finalize com cheiro-verde. Porção: 1 prato fundo."
    ],
    dica: "Congele em potes de 1 porção. Dura 3 meses."
  },
  {
    id: "cuscuz-ovos", nome: "Cuscuz de milho com ovos mexidos", dias: [4], refeicao: "Café da manhã",
    tempo: 15, porcoes: 1, kcal: 400, tags: ["Segura a fome", "Café da manhã"],
    resumo: "O café da manhã que segura a fome até o almoço.",
    ingredientes: ["4 col. sopa de flocão de milho", "4 col. sopa de água", "1 pitada de sal", "2 ovos", "1 fio de azeite"],
    passos: [
      "Misture o flocão, a água e o sal e deixe hidratar 5 minutos.",
      "Coloque na cuscuzeira (ou num pote coberto no micro-ondas por 2 minutos).",
      "Cozinhe no vapor por 8 minutos.",
      "Enquanto isso, faça os ovos mexidos com o azeite e sirva junto."
    ],
    dica: "Sem cuscuzeira: use uma peneira de metal sobre uma panela com água fervendo, tampada."
  },
  {
    id: "frango-acebolado-abobora", nome: "Frango acebolado com purê de abóbora", dias: [4], refeicao: "Almoço",
    tempo: 25, porcoes: 1, kcal: 300, tags: ["Colorido"],
    resumo: "Purê cremoso e docinho sem manteiga, com o filé acebolado.",
    ingredientes: ["1 filé de frango (120 g)", "1 cebola em rodelas", "1 fatia grande de abóbora (200 g)", "2 col. sopa de leite", "Sal, alho e noz-moscada"],
    passos: [
      "Cozinhe a abóbora em cubos no vapor ou na água até ficar macia (12 minutos).",
      "Amasse com o leite, uma pitada de sal e de noz-moscada.",
      "Grelhe o filé temperado com sal e alho, 4 minutos de cada lado.",
      "Na mesma frigideira, doure a cebola por 3 minutos e coloque por cima do frango. Porção do purê: 3 colheres de sopa."
    ],
    dica: "Abóbora cabotiá fica mais doce e cremosa."
  },
  {
    id: "wrap-frango", nome: "Wrap de frango", dias: [4], refeicao: "Jantar",
    tempo: 5, porcoes: 1, kcal: 430, tags: ["5 minutos", "Sem fogão"],
    resumo: "Sexta-feira com cara de lanche, sem sair do plano.",
    ingredientes: ["1 pão sírio integral", "3 col. sopa de frango desfiado", "1 col. sopa de requeijão light", "Alface, tomate e cenoura ralada"],
    passos: [
      "Abra o pão sírio e espalhe o requeijão.",
      "Coloque o frango e as verduras no centro.",
      "Enrole bem apertado e corte ao meio."
    ],
    dica: "Esquente o pão 30 segundos na frigideira para enrolar sem rasgar."
  },
  {
    id: "escondidinho", nome: "Escondidinho de batata com frango", dias: [5], refeicao: "Almoço",
    tempo: 35, porcoes: 3, kcal: 400, tags: ["Fim de semana", "Forno"],
    resumo: "Almoço de sábado gostoso e na medida do plano.",
    ingredientes: ["4 batatas médias", "1/2 xícara de leite", "12 col. sopa de frango desfiado", "1 tomate e 1/2 cebola picados", "3 col. sopa de queijo ralado", "Sal e noz-moscada"],
    passos: [
      "Cozinhe as batatas e amasse com o leite, o sal e a noz-moscada.",
      "Refogue o frango com o tomate e a cebola por 5 minutos.",
      "Num refratário, faça uma camada de frango e cubra com o purê.",
      "Polvilhe o queijo e leve ao forno a 200 °C por 15 minutos, até gratinar. Porção: 4 cs de purê + 4 cs de frango."
    ],
    dica: "Monte na sexta à noite e só leve ao forno no sábado."
  },
  {
    id: "pizza-frigideira", nome: "Pizza de frigideira", dias: [5], refeicao: "Jantar",
    tempo: 15, porcoes: 1, kcal: 430, tags: ["Vontade de pizza", "Rápido"],
    resumo: "Mata a vontade de pizza com massa de ovo e aveia.",
    ingredientes: ["2 ovos", "2 col. sopa de aveia", "1 pitada de sal", "2 col. sopa de molho de tomate", "2 col. sopa de frango desfiado", "1 fatia de queijo (mussarela ou branco)", "Orégano e rodelas de tomate"],
    passos: [
      "Bata os ovos com a aveia e o sal.",
      "Despeje numa frigideira antiaderente untada, tampe e deixe em fogo baixo 4 minutos.",
      "Vire a massa e espalhe o molho, o frango, o queijo e o tomate.",
      "Tampe de novo até o queijo derreter (3 minutos). Finalize com orégano."
    ],
    dica: "Fogo baixo e frigideira tampada: assim a massa cozinha sem queimar."
  },
  {
    id: "coxa-batatas", nome: "Coxa de frango assada com batatas", dias: [6], refeicao: "Almoço",
    tempo: 50, porcoes: 4, kcal: 380, tags: ["Almoço de família", "Forno"],
    resumo: "Almoço de domingo de uma assadeira só.",
    ingredientes: ["4 coxas de frango sem pele", "8 batatas pequenas cortadas ao meio", "1 cebola em gomos", "Suco de 1 limão", "3 dentes de alho", "Alecrim, páprica e sal", "1 col. sopa de azeite"],
    passos: [
      "Tempere as coxas com limão, alho, páprica e sal.",
      "Misture as batatas e a cebola com o azeite, o alecrim e uma pitada de sal.",
      "Coloque tudo na assadeira, cubra com papel-alumínio e asse a 200 °C por 25 minutos.",
      "Tire o papel e asse mais 20 minutos para dourar. Porção: 1 coxa + 2 batatas pequenas."
    ],
    dica: "Enquanto o forno trabalha, faça o preparo da semana."
  },
  {
    id: "risoto-frango", nome: "Arroz com legumes e frango (estilo risoto)", dias: [6], refeicao: "Jantar",
    tempo: 25, porcoes: 2, kcal: 400, tags: ["Uma panela só"],
    resumo: "Usa o arroz e o frango prontos. Uma panela só para lavar.",
    ingredientes: ["2 xícaras de arroz cozido", "6 col. sopa de frango desfiado", "1 cenoura ralada", "1/2 abobrinha em cubinhos", "1/2 xícara de ervilha (opcional)", "1/2 xícara do caldo do frango", "1 col. sopa de queijo ralado"],
    passos: [
      "Refogue a cenoura e a abobrinha com um fio de azeite por 3 minutos.",
      "Junte o frango, o arroz e o caldo e mexa por 5 minutos até ficar cremoso.",
      "Desligue e misture o queijo ralado.",
      "Porção: 1 prato raso."
    ],
    dica: "Um ótimo jeito de usar o arroz que sobrou da semana."
  },
  {
    id: "vitamina-mamao", nome: "Vitamina de mamão com aveia", dias: [3, 6], refeicao: "Lanche da tarde",
    tempo: 3, porcoes: 1, kcal: 210, tags: ["Bebida", "Intestino"],
    resumo: "Lanche de 3 minutos que ajuda o intestino.",
    ingredientes: ["200 ml de leite", "1/2 mamão papaia (ou 1 banana, no domingo)", "1 col. sopa de aveia", "Canela a gosto"],
    passos: ["Bata tudo no liquidificador por 1 minuto.", "Beba na hora."],
    dica: "Sem açúcar: a fruta madura já adoça."
  }
];
