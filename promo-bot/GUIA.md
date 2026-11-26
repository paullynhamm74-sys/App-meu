# Robô de Ofertas para Grupo do WhatsApp

Busca ofertas na **Shopee** e no **Mercado Livre** sozinho, pega as da **Amazon** de uma lista sua, coloca **o seu link de afiliado** e posta com foto no seu grupo, no horário que você escolher.

```
🚨 *PROMOÇÃO RELÂMPAGO* 🚨

📦 *Fone Bluetooth XYZ*

❌ De: ~R$ 199,90~
✅ *Por: R$ 89,90*  (55% OFF)
⭐ 4.8  •  10mil+ vendidos

🛒 🧡 Shopee
👉 https://s.shopee.com.br/xxxx
```

---

## ⚠️ Antes de tudo: use um chip separado

O robô entra no WhatsApp como se fosse o WhatsApp Web. **Isso não é oficial** e o WhatsApp pode **banir o número**. Por isso:

- Use **um chip só para o robô** (não o seu número pessoal).
- Deixe o número "aquecer" alguns dias antes (converse normal, entre em grupos).
- Não poste demais: **a cada 30 min ou mais** é mais seguro.
- Coloque o robô como **admin** do grupo e deixe o grupo em "só admins enviam mensagens".

---

## Passo 1: cadastrar-se como afiliado (grátis)

| Loja | Onde | O que você ganha |
|---|---|---|
| Shopee | [affiliate.shopee.com.br](https://affiliate.shopee.com.br) | Depois de aprovado, vá em **Open API** e peça acesso. Vem um **App ID** e uma **Secret** (a aprovação pode levar alguns dias). |
| Mercado Livre | [mercadolivre.com.br/afiliados](https://www.mercadolivre.com.br/afiliados) | No painel, gere um link de qualquer produto e copie a parte depois do `?` (os parâmetros de afiliado). |
| Amazon | [associados.amazon.com.br](https://associados.amazon.com.br) | Sua **tag** (ex.: `seunome-20`). Você tem 180 dias para fazer 3 vendas, senão a conta é encerrada. |

> Dica: no cadastro, quando pedirem o site/canal, informe o link do seu grupo do WhatsApp ou um Instagram de ofertas.

## Passo 2: instalar no computador

1. Instale o **Node.js** (versão 20 ou mais nova): [nodejs.org](https://nodejs.org) → botão "LTS".
2. Baixe esta pasta `promo-bot` para o computador.
3. Abra o **Prompt de Comando** (Windows) ou **Terminal** (Mac) dentro da pasta e rode:

```
npm install
```

4. Faça uma cópia do arquivo `.env.example` e renomeie para `.env`. Abra no Bloco de Notas e preencha o que já tiver.

## Passo 3: conectar o WhatsApp e escolher o grupo

1. Crie o grupo no WhatsApp com o chip do robô.
2. Rode:

```
npm run grupos
```

3. Vai aparecer um **QR code**. No celular do robô: **WhatsApp → Aparelhos conectados → Conectar aparelho** e leia o QR.
4. Aparece a lista dos seus grupos com o **ID** (termina com `@g.us`). Copie para o `.env`:

```
GRUPOS=120363000000000000@g.us
```

O login fica salvo na pasta `dados/`. Não precisa ler o QR de novo.

## Passo 4: configurar cada loja

### Shopee
No `.env`: `SHOPEE_APP_ID=` e `SHOPEE_SECRET=`. O link que vem da Shopee já é o seu link de afiliado.

### Mercado Livre
1. Entre em [developers.mercadolivre.com.br](https://developers.mercadolivre.com.br) → **Criar aplicação**. Em "URI de redirect" coloque `https://www.google.com`.
2. Copie o **Client ID** e o **Client Secret** para o `.env` (`ML_CLIENT_ID` e `ML_CLIENT_SECRET`).
3. Rode `npm run ml-token`, abra o link que aparece, autorize, copie o código `TG-...` do endereço e rode `npm run ml-token TG-...`. Ele mostra o `ML_REFRESH_TOKEN` para colar no `.env`.
4. Em `ML_AFILIADO_PARAMS=` cole a parte depois do `?` de um link gerado no painel de afiliados.

> Confira um link postado clicando nele e vendo se aparece no seu painel de afiliados. Se o Mercado Livre mudar o formato do link de afiliado, é só atualizar `ML_AFILIADO_PARAMS`.

### Amazon
1. No `.env`: `AMAZON_TAG=seunome-20`.
2. Abra `ofertas-amazon.txt` e coloque as ofertas, uma por linha:

```
https://www.amazon.com.br/dp/B0XXXXXXXX | Nome do produto | 89,90 | 149,90 | link-da-foto
```

A Amazon só libera a busca automática de produtos (Creators API) depois que a conta tem vendas. Quando liberar, me peça e eu troco a lista por busca automática.

## Passo 5: testar e ligar

```
npm run teste    # mostra aqui como a oferta vai ficar (não manda nada)
npm run agora    # manda UMA oferta no grupo agora, para conferir
npm start        # liga o robô: posta sozinho no horário do .env
```

Deixe a janela aberta e o computador ligado (sem entrar em suspensão). Se fechar, é só rodar `npm start` de novo.

## Ajustes no `.env`

| Opção | O que faz | Padrão |
|---|---|---|
| `INTERVALO_MINUTOS` | De quanto em quanto tempo posta | 30 |
| `HORA_INICIO` / `HORA_FIM` | Horário em que posta | 8 às 22 |
| `DESCONTO_MINIMO` | Só posta oferta com esse desconto (%) ou mais | 20 |
| `PALAVRAS_CHAVE` | O que o robô pesquisa (separado por vírgula) | fone, air fryer... |
| `LOJAS` | Lojas do rodízio | shopee,mercadolivre,amazon |

O robô não repete o mesmo produto por 3 dias.

## Problemas comuns

- **"fetch failed"**: sem internet ou o site da loja está bloqueado na sua rede.
- **Shopee 401/assinatura inválida**: confira App ID e Secret e se o relógio do computador está certo.
- **Mercado Livre 400 "invalid_grant"**: o token venceu. Rode `npm run ml-token` de novo.
- **WhatsApp desconectou**: apague a pasta `dados/sessao-whatsapp` e rode `npm run grupos` para ler o QR de novo.
