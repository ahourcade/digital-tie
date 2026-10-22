import { getJSON, putJSON } from './store.js';
import { sha } from './util.js';

/** Base de jugadores de GOAT PADEL: una ficha por contacto (mail o WhatsApp). */
export async function upsertPlayer(vote, matchId) {
  const contact = vote.email || vote.phone;
  const playerKey = contact ? sha(contact).slice(0, 24) : `g-${vote.pid}`;
  const path = `players/${playerKey}.json`;
  const prev = (await getJSON(path)) || {};
  const now = new Date().toISOString();
  const matches = [...new Set([...(prev.matches || []), matchId])].slice(-200);
  await putJSON(path, {
    name: vote.name,
    email: vote.email || prev.email || '',
    phone: vote.phone || prev.phone || '',
    level: vote.level,
    side: vote.side,
    consent: vote.consent,
    consentAt: vote.consent ? prev.consentAt || now : null,
    source: 'organizador-partidos',
    firstSeen: prev.firstSeen || now,
    lastSeen: now,
    matches,
  });
}
