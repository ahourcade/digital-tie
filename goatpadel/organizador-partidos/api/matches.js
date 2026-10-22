// POST /api/matches — crea un partido. Cada día propuesto tiene su propio rango horario.
// El organizador queda anotado como primer jugador, con su disponibilidad, categoría y lado de juego.
// Devuelve el link para compartir, la clave del organizador y la clave de su respuesta.
import { storageReady, STORAGE_MSG, putJSON } from './_lib/store.js';
import { upsertPlayer } from './_lib/players.js';
import {
  json, fail, newId, newKey, sha, readBody, clean, isDay, toMin,
  LEVELS, cleanSide, cleanEmail, cleanPhone, sanitizeAvail,
} from './_lib/util.js';

export async function POST(request) {
  if (!storageReady()) return new Response(JSON.stringify({ error: STORAGE_MSG }), { status: 503, headers: { 'content-type': 'application/json; charset=utf-8' } });
  let b;
  try {
    b = await readBody(request);
  } catch (e) {
    return fail(e.message);
  }

  const organizerName = clean(b.organizerName, 40);
  if (!organizerName) return fail('Poné tu nombre como organizador.');

  const days = [...new Set(Array.isArray(b.days) ? b.days : [])].filter(isDay).sort();
  if (days.length < 1) return fail('Elegí al menos un día.');
  if (days.length > 7) return fail('Podés proponer hasta 7 días.');

  const duration = [60, 90, 120].includes(Number(b.duration)) ? Number(b.duration) : 90;

  // Rango por día (si no viene, se usa el rango general para todos).
  const windows = {};
  for (const day of days) {
    const w = b.windows?.[day] || { from: b.from, to: b.to };
    const from = toMin(w.from);
    const to = toMin(w.to);
    const label = day.split('-').reverse().slice(0, 2).join('/');
    if (!(from >= 0 && to <= 24 * 60 && from % 30 === 0 && to % 30 === 0 && to > from)) {
      return fail(`Revisá el horario del ${label} (de media hora en media hora).`);
    }
    if (to - from < duration) return fail(`El horario del ${label} es más corto que el partido.`);
    windows[day] = { from, to };
  }
  const from = Math.min(...days.map((d) => windows[d].from));
  const to = Math.max(...days.map((d) => windows[d].to));

  const need = [2, 4].includes(Number(b.need)) ? Number(b.need) : 4;

  let place = null;
  if (b.place && Number.isFinite(Number(b.place.lat)) && Number.isFinite(Number(b.place.lon))) {
    place = {
      name: clean(b.place.name, 80),
      lat: Math.round(Number(b.place.lat) * 1e4) / 1e4,
      lon: Math.round(Number(b.place.lon) * 1e4) / 1e4,
    };
  }

  const deadline = b.deadline && !Number.isNaN(Date.parse(b.deadline)) ? new Date(b.deadline).toISOString() : null;

  const id = newId(8);
  const adminKey = newKey();
  const now = new Date().toISOString();

  const match = {
    id,
    title: clean(b.title, 60) || 'Partido de pádel',
    organizerName,
    days,
    windows,
    from,
    to,
    step: 30,
    duration,
    need,
    club: clean(b.club, 60),
    place,
    covered: Boolean(b.covered),
    deadline,
    notes: clean(b.notes, 280),
    courtPrice: Number(b.courtPrice) > 0 ? Math.round(Number(b.courtPrice)) : null,
    alias: clean(b.alias, 60),
    status: 'open',
    confirmed: null,
    adminHash: sha(adminKey),
    createdAt: now,
    updatedAt: now,
  };

  // El organizador es el primer anotado. Si no marcó nada, se toma todo el rango propuesto como "puedo".
  const o = b.organizer || {};
  let avail = sanitizeAvail(match, o.avail);
  if (!Object.values(avail).some((s) => /[12]/.test(s))) {
    avail = sanitizeAvail(match, Object.fromEntries(days.map((d) => [d, '2'.repeat((to - from) / 30)])));
  }
  const email = cleanEmail(o.email);
  const phone = cleanPhone(o.phone);
  const consent = Boolean(o.consent) && Boolean(email || phone);
  const pid = newId(10);
  const voteKey = newKey();
  const vote = {
    pid,
    name: organizerName,
    level: LEVELS.includes(String(o.level)) ? String(o.level) : 'nose',
    side: cleanSide(o.side),
    organizer: true,
    email,
    phone,
    consent,
    consentAt: consent ? now : null,
    avail,
    comment: '',
    keyHash: sha(voteKey),
    createdAt: now,
    updatedAt: now,
  };

  await putJSON(`matches/${id}/match.json`, match);
  await putJSON(`matches/${id}/votes/${pid}.json`, vote);
  await upsertPlayer(vote, id).catch(() => {});

  return json({ id, adminKey, pid, key: voteKey }, 201);
}
