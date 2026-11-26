// Amazon - lê as ofertas do arquivo ofertas-amazon.txt e coloca sua tag de associado no link.
//
// Por que não é busca automática? A API de produtos da Amazon (Creators API) só é liberada
// depois que a conta de associado tem vendas qualificadas. Quando liberar, dá para trocar
// este arquivo por uma busca automática.
//
// Formato de cada linha do ofertas-amazon.txt:
//   link | título | preço | preço antigo (opcional) | link da imagem (opcional)
import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config.js';

const ARQ = path.resolve('ofertas-amazon.txt');

const preco = (s) => Number(String(s || '').replace(/[^\d,.]/g, '').replace(/\.(?=\d{3})/g, '').replace(',', '.'));

export function linkAmazon(link) {
  const tag = config.amazon.tag;
  if (!tag) return link;
  const u = new URL(link);
  u.searchParams.set('tag', tag);
  return u.toString();
}

export async function buscarAmazon(palavra) {
  if (!fs.existsSync(ARQ)) return [];
  const linhas = fs
    .readFileSync(ARQ, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));

  const ofertas = linhas.map((l) => {
    const [link, titulo, p, pAntigo, imagem] = l.split('|').map((s) => s.trim());
    const asin = link.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i)?.[1] || link;
    return {
      id: `amazon:${asin}`,
      loja: 'amazon',
      titulo: titulo || 'Oferta Amazon',
      preco: preco(p),
      precoAntigo: pAntigo ? preco(pAntigo) : undefined,
      link: linkAmazon(link),
      imagem: imagem || undefined,
      manual: true, // você escolheu: não passa pelo filtro de desconto
    };
  });

  // Para a Amazon a palavra-chave só dá prioridade; se nada combinar, vale qualquer uma.
  const p = palavra.toLowerCase();
  const combinam = ofertas.filter((o) => o.titulo.toLowerCase().includes(p));
  return combinam.length ? combinam : ofertas;
}
