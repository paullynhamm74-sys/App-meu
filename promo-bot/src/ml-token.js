// Ajudante para pegar o ML_REFRESH_TOKEN do Mercado Livre (só precisa fazer uma vez).
//   1) npm run ml-token            -> mostra o link para autorizar
//   2) npm run ml-token CODIGO     -> troca o código pelo token
import { config } from './config.js';

const { clientId, clientSecret } = config.mercadolivre;
const redirect = process.env.ML_REDIRECT_URI || 'https://www.google.com';
const codigo = process.argv[2];

if (!clientId || !clientSecret) {
  console.log('Preencha ML_CLIENT_ID e ML_CLIENT_SECRET no .env primeiro.');
  process.exit(1);
}

if (!codigo) {
  console.log('\n1) Abra este link no navegador, entre na sua conta e autorize:\n');
  console.log(
    `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}`
  );
  console.log('\n2) Você vai cair numa página cujo endereço tem "?code=TG-...". Copie o código e rode:');
  console.log('\n   npm run ml-token TG-xxxxxxxx\n');
  process.exit(0);
}

const resp = await fetch('https://api.mercadolibre.com/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    code: codigo,
    redirect_uri: redirect,
  }),
});
const json = await resp.json();
if (!resp.ok || !json.refresh_token) {
  console.log('Não deu certo:', json);
  console.log('Dica: o código vale poucos minutos e só pode ser usado uma vez. Gere outro.');
  process.exit(1);
}
console.log('\n✅ Pronto! Coloque esta linha no .env:\n');
console.log(`ML_REFRESH_TOKEN=${json.refresh_token}\n`);
