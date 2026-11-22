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
