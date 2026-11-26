// Robô de ofertas de afiliado para grupo do WhatsApp.
//   npm start        -> liga o robô (posta sozinho nos horários do .env)
//   npm run grupos   -> mostra os grupos e seus IDs
//   npm run teste    -> busca uma oferta e mostra aqui, SEM mandar no WhatsApp
//   npm run agora    -> manda UMA oferta agora no grupo e sai
import cron from 'node-cron';
import { config } from './config.js';
import { montarMensagem } from './format.js';
import { jaPostado, marcarPostado } from './store.js';
import { buscarShopee } from './sources/shopee.js';
import { buscarMercadoLivre } from './sources/mercadolivre.js';
import { buscarAmazon } from './sources/amazon.js';

const FONTES = {
  shopee: buscarShopee,
  mercadolivre: buscarMercadoLivre,
  amazon: buscarAmazon,
};

const modo = process.argv[2];
let vezDaLoja = 0;

const sortear = (arr) => arr[Math.floor(Math.random() * arr.length)];

function ofertaBoa(o) {
  if (!o.link || !o.preco || jaPostado(o.id)) return false;
  if (o.manual) return true;
  const desconto = o.desconto ?? (o.precoAntigo > o.preco ? (1 - o.preco / o.precoAntigo) * 100 : 0);
  return desconto >= config.descontoMinimo;
}

/** Passa pelas lojas em rodízio até achar uma oferta nova com bom desconto. */
async function proximaOferta() {
  const lojas = config.lojas.filter((l) => FONTES[l]);
  for (let tentativa = 0; tentativa < lojas.length * 2; tentativa++) {
    const loja = lojas[vezDaLoja++ % lojas.length];
    const palavra = sortear(config.palavrasChave);
    try {
      const ofertas = (await FONTES[loja](palavra)).filter(ofertaBoa);
      if (ofertas.length) {
        console.log(`🔎 ${loja} / "${palavra}": ${ofertas.length} oferta(s) boa(s)`);
        // pega uma das 5 melhores, para variar
        const melhores = ofertas.sort((a, b) => (b.desconto ?? 0) - (a.desconto ?? 0)).slice(0, 5);
        return sortear(melhores);
      }
      console.log(`🔎 ${loja} / "${palavra}": nada novo com ${config.descontoMinimo}%+ de desconto`);
    } catch (e) {
      console.log(`⚠️  ${loja}: ${e.message}`);
    }
  }
  return null;
}

function dentroDoHorario() {
  const h = new Date().getHours();
  return h >= config.horaInicio && h < config.horaFim;
}

async function postar(enviarOferta) {
  const oferta = await proximaOferta();
  if (!oferta) return console.log('😕 Nenhuma oferta nova encontrada desta vez.');
  const texto = montarMensagem(oferta);
  for (const grupo of config.grupos) {
    await enviarOferta(grupo, texto, oferta.imagem);
    // pausa curta entre grupos, para não parecer robô
    await new Promise((r) => setTimeout(r, 3000 + Math.random() * 4000));
  }
  marcarPostado(oferta.id);
  console.log(`📤 Postado: ${oferta.titulo.slice(0, 60)}`);
}

async function main() {
  if (modo === '--teste') {
    const oferta = await proximaOferta();
    if (!oferta) return console.log('Nenhuma oferta encontrada. Veja os avisos acima.');
    console.log('\n----- assim vai ficar no grupo -----\n');
    console.log(montarMensagem(oferta));
    if (oferta.imagem) console.log(`\n[foto: ${oferta.imagem}]`);
    return;
  }

  const { conectar, listarGrupos, enviarOferta } = await import('./whatsapp.js');
  await conectar();

  if (modo === '--grupos') {
    const grupos = await listarGrupos();
    if (!grupos.length) console.log('Você não está em nenhum grupo ainda.');
    console.log('\nCopie o ID do seu grupo para GRUPOS= no arquivo .env:\n');
    for (const g of grupos) console.log(`  ${g.nome}  (${g.membros} membros)\n  ID: ${g.id}\n`);
    process.exit(0);
  }

  if (!config.grupos.length) {
    console.log('❌ Falta o ID do grupo. Rode "npm run grupos" e coloque em GRUPOS= no .env');
    process.exit(1);
  }

  if (modo === '--agora') {
    await postar(enviarOferta);
    setTimeout(() => process.exit(0), 3000);
    return;
  }

  const n = Math.max(1, Math.min(59, config.intervaloMinutos));
  console.log(
    `⏰ Vou postar a cada ${n} min, das ${config.horaInicio}h às ${config.horaFim}h. Deixe esta janela aberta.`
  );
  let ocupado = false;
  cron.schedule(`*/${n} * * * *`, async () => {
    if (ocupado || !dentroDoHorario()) return;
    ocupado = true;
    try {
      await postar(enviarOferta);
    } catch (e) {
      console.log(`⚠️  Erro ao postar: ${e.message}`);
    } finally {
      ocupado = false;
    }
  });
}

main();
