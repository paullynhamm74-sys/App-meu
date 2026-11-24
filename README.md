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

## BabyLi Papinha (`babyli/`)

App separado de receitas para bebês e crianças, de 6 meses a 6 anos. Abra `babyli/index.html` (no GitHub Pages: `https://paullynhamm74-sys.github.io/App-meu/babyli/`) e instale na tela inicial como o Meu Prato.

- **Contador e parabéns**: com a data de nascimento, conta cada dia da introdução alimentar desde os 6 meses (ou os dias que faltam), mostra quanto falta para o próximo mês e uma trilha de conquistas (6 a 11 meses, 1 ano, 1 ano e meio, 2 a 6 anos). A cada conquista abre uma tela de parabéns com confete, como ela come agora, alimentos e receitas novas liberadas.
- **Amassado, picado ou inteiro?** (aba Fases): escolha o mês e veja como servir 16 alimentos (banana, frutas, maçã, uva, legumes, folhas, batata, arroz, feijão, carne, frango, peixe, ovo, macarrão, pão, pipoca e castanhas), com o que mudou marcado como novo.
- **Início**: fase atual da bebê (textura, refeições, quantidade, leite, água), o que muda agora, rotina de exemplo e regras de ouro (sal, açúcar, mel, leite de vaca, suco, ultraprocessados).
- **Semana**: cardápio de segunda a domingo montado para a idade da bebê (lanches, almoço, jantar e, depois de 1 ano, café da manhã e bebida do dia). Cada refeição abre o passo a passo; dá para trocar uma refeição, montar outra semana e ver a lista de compras. Modo **Tabela da semana** com caixinhas para marcar cada refeição cumprida (as marcações recomeçam toda segunda-feira).
- **Passo a passo**: dentro de cada receita, modo de cozinhar com um passo por tela, letra grande e a tela acesa.
- **Receitas**: 80 receitas com ingredientes e modo de preparo, separadas por idade (6, 7, 8, 9, 10 e 11 meses, 1 ano, 1 ano e meio, 2, 3, 4 e 5 a 6 anos) e por tipo: almoço e jantar, café da manhã, lanche, fruta, bebida e sobremesa. Busca por ingrediente e favoritas.
- **Pode?**: 89 alimentos e bebidas com semáforo para a idade escolhida (Pode / Com cuidado / Ainda não ou evitar), como oferecer, aviso de risco de engasgo e "já provou".
- **Fases**: guia completo de cada fase.
- **Notas**: blocos de anotações (Não gostou, Gostou, Reação ou alergia, Observação) com data, para editar e apagar. O que ela não gostou aparece como aviso no cardápio, nas receitas e no Pode?. Também guarda as receitas favoritas e os alimentos já provados.

Nome e data de nascimento ficam salvos só no aparelho; com a data, a fase muda sozinha a cada mês. Baseado no Guia Alimentar para Crianças Brasileiras Menores de 2 Anos (Ministério da Saúde) e na SBP. Confirme sempre com o pediatra.
