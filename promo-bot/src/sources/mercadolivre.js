// Mercado Livre - busca pela API oficial e coloca seus parâmetros de afiliado no link.
import { config } from '../config.js';
import { lerExtra, gravarExtra } from '../store.js';

const API = 'https://api.mercadolibre.com';
let token = null;
let tokenExpira = 0;

async function pegarToken() {
  if (token && Date.now() < tokenExpira) return token;
  const { clientId, clientSecret } = config.mercadolivre;
  // O Mercado Livre troca o refresh token a cada renovação: guardamos o mais novo.
  const refresh = lerExtra('ml_refresh_token') || config.mercadolivre.refreshToken;
  if (!clientId || !clientSecret || !refresh) {
    throw new Error('Mercado Livre: preencha ML_CLIENT_ID, ML_CLIENT_SECRET e ML_REFRESH_TOKEN no .env');
  }

  const resp = await fetch(`${API}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refresh,
    }),
  });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(`Mercado Livre (token) ${resp.status}: ${JSON.stringify(json).slice(0, 300)}`);

  token = json.access_token;
  tokenExpira = Date.now() + (json.expires_in - 300) * 1000;
  if (json.refresh_token) gravarExtra('ml_refresh_token', json.refresh_token);
  return token;
}

function linkAfiliado(permalink) {
  const params = config.mercadolivre.afiliadoParams;
  if (!params) return permalink;
  return permalink + (permalink.includes('?') ? '&' : '?') + params;
}

export async function buscarMercadoLivre(palavra) {
  const t = await pegarToken();
  const url = `${API}/sites/MLB/search?q=${encodeURIComponent(palavra)}&limit=30`;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${t}` } });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(`Mercado Livre (busca) ${resp.status}: ${JSON.stringify(json).slice(0, 300)}`);

  return (json.results || []).map((p) => {
    const extras = [];
    if (p.shipping?.free_shipping) extras.push('🚚 Frete grátis');
    if (p.installments?.quantity > 1 && p.installments?.rate === 0) {
      extras.push(`💳 ${p.installments.quantity}x sem juros`);
    }
    return {
      id: `ml:${p.id}`,
      loja: 'mercadolivre',
      titulo: p.title,
      preco: Number(p.price),
      precoAntigo: p.original_price ? Number(p.original_price) : undefined,
      link: linkAfiliado(p.permalink),
      // troca a miniatura pela versão maior
      imagem: (p.thumbnail || '').replace(/-I\.(jpg|webp)$/, '-O.$1').replace(/^http:/, 'https:'),
      extra: extras.length ? extras.join('  •  ') : undefined,
    };
  });
}
