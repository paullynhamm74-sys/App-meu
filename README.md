# Meu Prato da Semana

Planner pessoal de alimentação saudável para quem está amamentando e quer emagrecer com segurança.

Abra o `index.html` no navegador do celular (ou publique com GitHub Pages) e use:

- **Cardápio**: 7 dias, 6 refeições por dia com horário e quantidade em medidas caseiras (~1.900 kcal/dia). Mostra a próxima refeição e deixa marcar o que já comeu.
- **Fome!**: lanches rápidos de até 200 kcal, com sorteio para quando não quiser pensar.
- **Nutri**: agente de calorias em formato de chat. Recebe foto, texto ou voz, calcula as calorias, vê o plano do dia, registra o que você comeu e passa exercício calculado pelo seu peso (usa o Claude quando aberto pelo link do Claude).
- **Água**: meta de 3 litros (12 copos de 250 ml), horários e contador.
- **Compras**: lista da semana e passo a passo do preparo de domingo.
- **Meu plano**: avaliação (70 kg, 1,50 m, IMC 31,1), cálculo de calorias, metas de peso, registro semanal do peso e dicas para não passar fome.

Sem chia, quiabo, carne vermelha ou café. As marcações ficam salvas só no aparelho.

> Plano geral. Mostre para sua nutricionista ou médica.

## Meus Treinos (`treinos.html`)

Treinos em casa para emagrecer e definir, sem equipamento. Abre pelo botão **Treino de hoje** na tela Hoje ou em **Mais → Meus Treinos**.

- **19 exercícios com bonequinho animado** mostrando o movimento, mais as imagens de começo e movimento, passo a passo, dica, erro comum e versão mais fácil.
- **4 treinos**: Queima Total (cardio + pernas), Bumbum e Pernas, Barriga e Braços (abdômen seguro depois da gravidez, sem abdominal tradicional) e Caminhada com intervalos.
- **Aba Semana**: escolha o dia (Seg a Dom) e veja todos os exercícios daquele dia com o bonequinho, na ordem e com o tempo de cada um, e comece dali. As bolinhas da semana na tela Hoje abrem o dia direto.
- **Semana pronta**: Seg Queima Total, Ter Bumbum e Pernas, Qua Caminhada, Qui Barriga e Braços, Sex Queima Total, Sáb Bumbum e Pernas, Dom descanso.
- **3 níveis** que sobem sozinhos (semanas 1–2, 3–6, 7+): 30/30s × 2 voltas, 40/20s × 3, 45/15s × 4.
- **Treino guiado**: cronômetro, bonequinho do exercício, bipe, vibração e voz em português avisando a troca; tela fica acesa.
- **Meta 71 → 58 kg até 31 de março**: conta quanto precisa perder por semana e quanto vem do cardápio, dos treinos e dos passos. Peso compartilhado com o Meu Prato.
- **Progresso**: gráfico do peso com a linha da meta, treinos feitos, minutos e calorias (estimadas pelo seu peso).

## Pode ou Não Pode (`calorias.html`)

Agente separado e simples: tire foto do que vai comer e ele mostra só as calorias e um semáforo:

- **Bom**: pode comer (comida saudável dentro do limite: refeição até ~550 kcal, lanche até ~250, bebida até ~150).
- **Médio**: com moderação.
- **Ruim**: não pode (passa 40% do limite, ou besteira acima de 200 kcal), com uma troca mais leve.

Guarda as fotos do dia com o total de calorias.

## Instalar no celular (app)

O app é um PWA: instala pelo navegador, ganha ícone na tela inicial, abre em tela cheia e o cardápio funciona sem internet.

1. Ative o GitHub Pages uma vez: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `claude/healthy-meal-planner-nursing-uopqym` / `(root)` → Save**.
2. Abra no celular: `https://paullynhamm74-sys.github.io/App-meu/`
3. **Android (Chrome):** toque em **Instalar** no aviso, ou menu ⋮ → **Instalar app**.
   **iPhone (Safari):** botão **Compartilhar** → **Adicionar à Tela de Início**.

A Nutri e o Pode ou Não Pode usam o Claude: no app instalado, os botões abrem essas telas no Claude (precisa de internet e estar logada).

## Lembretes (refeições e água)

Botão **Lembretes** no topo do app:

- **Calendário do celular** (`lembretes.ics`, `lembretes-refeicoes.ics`, `lembretes-agua.ics`): avisa mesmo com o app fechado. 42 lembretes semanais de refeição (cada um com o cardápio daquele dia) + 11 lembretes diários de água.
- **Avisos do app**: notificações na hora certa enquanto o app está aberto ou minimizado.

Para regerar os `.ics` depois de mudar o cardápio, rode `window.__buildICS({meals: true, water: true})` no console do app.

## Foto direto no app instalado (chave da API)

Fora do Claude, a Nutri e o Pode ou Não Pode podem usar o Claude direto pela API (`ai.js` + SDK oficial empacotado em `vendor/anthropic-sdk.js`, `@anthropic-ai/sdk@1.6.0`). A usuária cola a própria chave (console.anthropic.com → API Keys), que fica salva só no celular. Modelo `claude-opus-5-5`, esforço `low`, com fallback automático do servidor em caso de recusa.

## Horários pela hora que acordou

No Cardápio, o cartão **"Que horas você acordou hoje?"** (botão **Acordei agora** ou hora manual) move todos os horários do dia (6 refeições e 11 copos de água) a partir da hora que ela acordou, mantendo os mesmos intervalos do plano (base 06:30). Se o dia ficar curto até a hora de dormir (padrão 22:30, ajustável em Lembretes → Meu horário), os intervalos encolhem até 40%, sem perder nenhuma refeição nem copo. Os avisos do app seguem esses horários; o botão "Pôr os horários de hoje no calendário" baixa um `.ics` só do dia.

## Organização das telas

Barra de baixo com 5 abas: **Hoje** (acordei, próxima refeição, progresso do dia em anéis, +1 copo e atalhos), **Cardápio** (semana), **Foto** (Nutri, botão central), **Água** e **Mais** (Lanches de fome, Compras e preparo, Meu plano e peso, Lembretes, Dicas — cada uma com "Voltar"). Endereços diretos: `#hoje`, `#cardapio`, `#nutri`, `#agua`, `#mais`, `#fome`, `#compras`, `#plano`, `#dicas`, `#lembretes`.

## Receitas

19 receitas do cardápio (dados em `RECEITAS` dentro do `index.html`): tela **Mais → Receitas da semana** com filtro por dia, cartões "Receitas de hoje" na tela Hoje, botão **Ver receita** em cada refeição do Cardápio, e tela da receita com tempo, porções, kcal por porção, ingredientes para marcar, passo a passo e dica.

## Meu treino (avaliação por foto)

**Mais → Meu treino**: perguntas rápidas (tempo de pós-parto, tipo de parto, liberação médica, minutos por dia, queixas) e até 2 fotos opcionais do corpo. O Claude monta um plano de 7 dias seguro para pós-parto e amamentação (regras para menos de 6 semanas, cesárea, diástase, escape de xixi, dor no joelho e nas costas), olhando só postura e alinhamento, sem comentar aparência. As fotos não são salvas; só o plano fica no aparelho. A tela Hoje mostra o "Treino de hoje" com os exercícios marcados.
