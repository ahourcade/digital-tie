// POST /api/matches — crea un partido y devuelve el link para compartir y la clave del organizador.
import { storageReady, STORAGE_MSG } from './_lib/store.js';
import { putJSON } from './_lib/store.js';
import { json, fail, newId, newKey, sha, readBody, clean, isDay, toMin } from './_lib/util.js';

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

  const from = toMin(b.from);
  const to = toMin(b.to);
  const duration = [60, 90, 120].includes(Number(b.duration)) ? Number(b.duration) : 90;
  if (!(from >= 0 && to <= 24 * 60 && from % 30 === 0 && to % 30 === 0 && to > from)) {
    return fail('Revisá el rango horario (de media hora en media hora).');
  }
  if (to - from < duration) return fail('El rango horario es más corto que el partido.');

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

  await putJSON(`matches/${id}/match.json`, match);
  return json({ id, adminKey }, 201);
}
