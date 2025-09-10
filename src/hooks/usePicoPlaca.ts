import type { DynamicPostMessageRequest } from "../Models/MicrosoftTeamsModel";
import { MicrosoftTeamsService } from "../Services/MicrosoftTeamsService";
import { Office365UsersService } from "../Services/Office365UsersService";

//Notificacion
const mensajeHTML = (nombre?: string) => `
  Hola${nombre ? ` ${nombre}` : ''},
  Te informamos que cambió el pico y placa en Medellín.
  Puedes ver el nuevo listado oficial aquí: https://www.medellin.gov.co/es/secretaria-movilidad/
  Gracias.
`;

type O365User = {
  id: string;
  displayName?: string;
  Mail?: string;
  userPrincipalName?: string;
};



export async function NotifyPicoPlaca() {
  try {
    const usuarios = await Office365UsersService.SearchUserV2();
    const data: O365User[] = usuarios?.data?.value ?? [];

    const emailToUser = new Map<string, O365User>();
    for (const u of data) {
      const email = (u.Mail || u.userPrincipalName || '').trim().toLowerCase();
      if (!email) continue;            
      if (!emailToUser.has(email)) {
        emailToUser.set(email, u);    
      }
    }

    const recipients = Array.from(emailToUser.entries()); 
    if (recipients.length === 0) {
      console.warn('No hay destinatarios con correo válido.');
      return;
    }

    // 2) Envía en lotes para evitar rate limits
    const BATCH_SIZE = 50;
    const SLEEP_MS = 1000;

    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

    let enviados = 0;
    let fallidos: { email: string; error: any }[] = [];

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const slice = recipients.slice(i, i + BATCH_SIZE);

      const results = await Promise.allSettled(
        slice.map(async ([email, user]) => {
            console.log(email)
          await sendEmail(email, mensajeHTML(user.displayName));
        })
      );

      // Conteo
      results.forEach((r, idx) => {
        const [email] = slice[idx];
        if (r.status === 'fulfilled') enviados++;
        else fallidos.push({ email, error: r.reason });
      });

      // Pequeña pausa entre lotes (opcional)
      if (i + BATCH_SIZE < recipients.length) await sleep(SLEEP_MS);
    }

    console.log(`✔️ Enviados: ${enviados} · ❌ Fallidos: ${fallidos.length}`);
    if (fallidos.length) {
      console.table(fallidos.map(f => ({ email: f.email, error: String(f.error) })));
    }
  } catch (err) {
    console.error('Error en NotifyPicoPlaca:', err);
  }
}

async function sendEmail(to: string, htmlBody: string) {
    console.log('Enviando a:', to);
    const body: DynamicPostMessageRequest = {
        recipient: to,
        messageBody: htmlBody
    }
    return MicrosoftTeamsService.PostMessageToConversation(body, 'Flow Bot', 'Chat with Flow bot');
}

