// Monta o texto da oferta que vai para o grupo.

const NOME_LOJA = {
  shopee: '🧡 Shopee',
  mercadolivre: '💛 Mercado Livre',
  amazon: '🖤 Amazon',
};

export const reais = (v) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/**
 * oferta = { loja, titulo, preco, precoAntigo?, desconto?, link, imagem?, extra? }
 */
export function montarMensagem(o) {
  const desconto =
    o.desconto ?? (o.precoAntigo > o.preco ? Math.round((1 - o.preco / o.precoAntigo) * 100) : 0);

  const linhas = [];
  linhas.push(desconto >= 40 ? '🚨 *PROMOÇÃO RELÂMPAGO* 🚨' : '🔥 *OFERTA DO DIA* 🔥');
  linhas.push('');
  linhas.push(`📦 *${o.titulo.slice(0, 120).trim()}*`);
  linhas.push('');
  if (o.precoAntigo && o.precoAntigo > o.preco) linhas.push(`❌ De: ~${reais(o.precoAntigo)}~`);
  linhas.push(`✅ *Por: ${reais(o.preco)}*${desconto ? `  (${desconto}% OFF)` : ''}`);
  if (o.extra) linhas.push(o.extra);
  linhas.push('');
  linhas.push(`🛒 ${NOME_LOJA[o.loja] || o.loja}`);
  linhas.push(`👉 ${o.link}`);
  linhas.push('');
  linhas.push('_Preço sujeito a alteração. Corre que acaba!_');
  return linhas.join('\n');
}
