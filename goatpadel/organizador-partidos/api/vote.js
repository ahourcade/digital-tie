// POST /api/vote — un jugador (invitado, sin login) carga o edita su disponibilidad.
// La primera vez recibe { pid, key }: el navegador las guarda para poder editar después.
import { getJSON, putJSON } from './_lib/store.js';
import {
  json, fail, readBody, clean, isId, newId, newKey, sha, sameHash,
  LEVELS, cleanEmail, cleanPhone,
} from './_lib/util.js';

export async function POST(request) {
  let b;
  try {
    b = await readBody(request);
  } catch (e) {
    return fail(e.message);
  }
  if (!isId(b.matchId)) return fail('Partido inexistente.', 404);

  const match = await getJSON(`matches/${b.matchId}/match.json`);
  if (!match) return fail('No encontramos este partido.', 404);

  const name = clean(b.name, 40);
  if (!name) return fail('Poné tu nombre.');

  const level = LEVELS.includes(String(b.level)) ? String(b.level) : 'nose';
  const email = cleanEmail(b.email);
  const phone = cleanPhone(b.phone);
  const consent = Boolean(b.consent);
  if (consent && !email && !phone) return fail('Para recibir novedades dejanos un mail o un WhatsApp.');

  // Disponibilidad: por día, una cadena con 0 (no), 1 (si no queda otra) o 2 (puedo) por bloque de 30 min.
  const slots = (match.to - match.from) / match.step;
  const avail = {};
  for (const day of match.days) {
    const raw = typeof b.avail?.[day] === 'string' ? b.avail[day] : '';
    avail[day] = raw.replace(/[^012]/g, '0').padEnd(slots, '0').slice(0, slots);
  }

  const now = new Date().toISOString();
  let pid = b.pid;
  let key = null;
  let previous = null;

  if (pid) {
    if (!isId(pid)) return fail('Respuesta inválida.');
    previous = await getJSON(`matches/${match.id}/votes/${pid}.json`);
    if (!previous) return fail('No encontramos tu respuesta anterior.', 404);
    const isOrganizer = sameHash(b.adminKey, match.adminHash);
    if (!sameHash(b.key, previous.keyHash) && !isOrganizer) {
      return fail('Esta respuesta la cargó otra persona.', 403);
    }
  } else {
    pid = newId(10);
    key = newKey();
  }

  const vote = {
    pid,
    name,
    level,
    email,
    phone,
    consent,
    consentAt: consent ? previous?.consentAt || now : null,
    avail,
    comment: clean(b.comment, 140),
    keyHash: previous?.keyHash || sha(key),
    createdAt: previous?.createdAt || now,
    updatedAt: now,
  };

  await putJSON(`matches/${match.id}/votes/${pid}.json`, vote);
  await upsertPlayer(vote, match.id).catch(() => {});

  return json({ pid, key, ok: true }, previous ? 200 : 201);
}

/** Base de jugadores de GOAT PADEL: una ficha por contacto (mail o WhatsApp). */
async function upsertPlayer(vote, matchId) {
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
    consent: vote.consent,
    consentAt: vote.consent ? prev.consentAt || now : null,
    source: 'organizador-partidos',
    firstSeen: prev.firstSeen || now,
    lastSeen: now,
    matches,
  });
}
