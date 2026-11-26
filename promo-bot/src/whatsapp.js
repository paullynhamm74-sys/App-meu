// Conexão com o WhatsApp (pelo QR code, igual ao WhatsApp Web).
import path from 'node:path';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import makeWASocket, {
  Browsers,
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { pastaDados } from './store.js';

let sock = null;

/** Conecta e resolve quando o WhatsApp estiver pronto. Reconecta sozinho se cair. */
export function conectar() {
  return new Promise((resolve) => {
    let resolvido = false;

    const iniciar = async () => {
      const { state, saveCreds } = await useMultiFileAuthState(path.join(pastaDados, 'sessao-whatsapp'));
      const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: undefined }));

      sock = makeWASocket({
        auth: state,
        version,
        browser: Browsers.ubuntu('Promo Bot'),
        logger: pino({ level: 'silent' }),
        markOnlineOnConnect: false,
      });

      sock.ev.on('creds.update', saveCreds);
      sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
        if (qr) {
          console.log('\n📱 No celular: WhatsApp > Aparelhos conectados > Conectar aparelho e leia o QR:\n');
          qrcode.generate(qr, { small: true });
        }
        if (connection === 'open') {
          console.log('✅ WhatsApp conectado!');
          if (!resolvido) {
            resolvido = true;
            resolve(sock);
          }
        }
        if (connection === 'close') {
          const codigo = lastDisconnect?.error?.output?.statusCode;
          if (codigo === DisconnectReason.loggedOut) {
            console.log('❌ O WhatsApp foi desconectado pelo celular. Apague a pasta dados/sessao-whatsapp e rode de novo.');
            process.exit(1);
          }
          console.log('⚠️  Conexão caiu, reconectando em 5s...');
          setTimeout(iniciar, 5000);
        }
      });
    };

    iniciar();
  });
}

export async function listarGrupos() {
  const grupos = await sock.groupFetchAllParticipating();
  return Object.values(grupos).map((g) => ({ id: g.id, nome: g.subject, membros: g.participants?.length }));
}

/** Envia a oferta com foto. Se a foto falhar, manda só o texto. */
export async function enviarOferta(grupoId, texto, imagem) {
  if (imagem) {
    try {
      await sock.sendMessage(grupoId, { image: { url: imagem }, caption: texto });
      return;
    } catch (e) {
      console.log(`   (não consegui mandar a foto: ${e.message}. Mandando só o texto.)`);
    }
  }
  await sock.sendMessage(grupoId, { text: texto });
}
