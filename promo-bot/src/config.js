import 'dotenv/config';

const lista = (v) => (v || '').split(',').map((s) => s.trim()).filter(Boolean);
const num = (v, padrao) => (v === undefined || v === '' ? padrao : Number(v));

export const config = {
  grupos: lista(process.env.GRUPOS),
  intervaloMinutos: num(process.env.INTERVALO_MINUTOS, 30),
  horaInicio: num(process.env.HORA_INICIO, 8),
  horaFim: num(process.env.HORA_FIM, 22),
  descontoMinimo: num(process.env.DESCONTO_MINIMO, 20),
  palavrasChave: lista(process.env.PALAVRAS_CHAVE || 'fone bluetooth,air fryer,smartwatch'),
  lojas: lista(process.env.LOJAS || 'shopee,mercadolivre,amazon'),

  shopee: {
    appId: process.env.SHOPEE_APP_ID || '',
    secret: process.env.SHOPEE_SECRET || '',
  },
  mercadolivre: {
    clientId: process.env.ML_CLIENT_ID || '',
    clientSecret: process.env.ML_CLIENT_SECRET || '',
    refreshToken: process.env.ML_REFRESH_TOKEN || '',
    afiliadoParams: (process.env.ML_AFILIADO_PARAMS || '').replace(/^\?/, ''),
  },
  amazon: {
    tag: process.env.AMAZON_TAG || '',
  },
};
