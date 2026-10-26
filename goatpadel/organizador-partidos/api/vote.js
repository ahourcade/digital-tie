// POST /api/vote — un jugador (invitado, sin login) carga o edita su disponibilidad.
// La primera vez recibe { pid, key }: el navegador las guarda para poder editar después.
import { storageReady, STORAGE_MSG } from './_lib/store.js';
import { getJSON, putJSON } from './_lib/store.js';
import { upsertPlayer } from './_lib/players.js';
import {
  json, fail, readBody, clean, isId, newId, newKey, sha, sameHash,
  LEVELS, cleanEmail, cleanPhone, cleanSide, sanitizeAvail,
} from './_lib/util.js';

export async function POST(request) {
  if (!storageReady()) return new Response(JSON.stringify({ error: STORAGE_MSG }), { status: 503, headers: { 'content-type': 'application/json; charset=utf-8' } });
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

  let avail = sanitizeAvail(match, b.avail);

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

  // Los invitados solo pueden marcar dentro de los horarios del organizador.
  if (match.orgAvail && !previous?.organizer) {
    for (const day of match.days) {
      const org = match.orgAvail[day] || '';
      avail[day] = [...avail[day]].map((c, i) => ((org[i] || '0') === '0' ? '0' : c)).join('');
    }
  }

  const vote = {
    pid,
    name,
    level,
    side: cleanSide(b.side),
    organizer: Boolean(previous?.organizer),
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
  if (vote.organizer) {
    match.orgAvail = avail;
    match.updatedAt = now;
    await putJSON(`matches/${match.id}/match.json`, match);
  }
  await upsertPlayer(vote, match.id).catch(() => {});

  return json({ pid, key, ok: true }, previous ? 200 : 201);
}
