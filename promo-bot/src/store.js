// Guarda o que já foi postado (para não repetir) e outros dados do robô.
import fs from 'node:fs';
import path from 'node:path';

const PASTA = path.resolve('dados');
const ARQ = path.join(PASTA, 'estado.json');
const DIAS_SEM_REPETIR = 3;

fs.mkdirSync(PASTA, { recursive: true });

let estado = { postados: {}, extras: {} };
try {
  estado = { ...estado, ...JSON.parse(fs.readFileSync(ARQ, 'utf8')) };
} catch {}

function salvar() {
  fs.writeFileSync(ARQ, JSON.stringify(estado, null, 2));
}

export function jaPostado(id) {
  const quando = estado.postados[id];
  return quando && Date.now() - quando < DIAS_SEM_REPETIR * 864e5;
}

export function marcarPostado(id) {
  estado.postados[id] = Date.now();
  // limpa registros antigos
  for (const [k, t] of Object.entries(estado.postados)) {
    if (Date.now() - t > DIAS_SEM_REPETIR * 864e5) delete estado.postados[k];
  }
  salvar();
}

export function lerExtra(chave) {
  return estado.extras[chave];
}

export function gravarExtra(chave, valor) {
  estado.extras[chave] = valor;
  salvar();
}

export const pastaDados = PASTA;
