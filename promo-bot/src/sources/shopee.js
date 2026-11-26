// Shopee Afiliados - Open API (GraphQL). O "offerLink" já vem como seu link de afiliado.
import crypto from 'node:crypto';
import { config } from '../config.js';

const URL_API = 'https://open-api.affiliate.shopee.com.br/graphql';

async function chamar(query) {
  const { appId, secret } = config.shopee;
  if (!appId || !secret) throw new Error('Shopee: preencha SHOPEE_APP_ID e SHOPEE_SECRET no .env');

  const corpo = JSON.stringify({ query });
  const ts = Math.floor(Date.now() / 1000);
  const assinatura = crypto
    .createHash('sha256')
    .update(`${appId}${ts}${corpo}${secret}`)
    .digest('hex');

  const resp = await fetch(URL_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `SHA256 Credential=${appId}, Timestamp=${ts}, Signature=${assinatura}`,
    },
    body: corpo,
  });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok || json.errors) {
    throw new Error(`Shopee respondeu ${resp.status}: ${JSON.stringify(json.errors || json).slice(0, 300)}`);
  }
  return json.data;
}

export async function buscarShopee(palavra) {
  // sortType 2 = mais vendidos
  const query = `query {
    productOfferV2(keyword: ${JSON.stringify(palavra)}, sortType: 2, page: 1, limit: 30) {
      nodes {
        itemId productName priceMin priceMax priceDiscountRate
        imageUrl offerLink sales ratingStar shopName
      }
    }
  }`;
  const data = await chamar(query);
  const itens = data?.productOfferV2?.nodes || [];

  return itens.map((p) => {
    const preco = Number(p.priceMin);
    const desconto = Math.round(Number(p.priceDiscountRate) || 0);
    const precoAntigo = desconto > 0 && desconto < 100 ? preco / (1 - desconto / 100) : undefined;
    const extras = [];
    if (p.ratingStar) extras.push(`⭐ ${Number(p.ratingStar).toFixed(1)}`);
    if (p.sales) extras.push(`${p.sales}+ vendidos`);
    return {
      id: `shopee:${p.itemId}`,
      loja: 'shopee',
      titulo: p.productName,
      preco,
      precoAntigo,
      desconto,
      link: p.offerLink,
      imagem: p.imageUrl,
      extra: extras.length ? extras.join('  •  ') : undefined,
    };
  });
}
