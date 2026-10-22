// POST /api/admin — acciones del organizador (requiere la clave del link de organizador).
import { storageReady, STORAGE_MSG } from './_lib/store.js';
import { getJSON, putJSON, deleteJSON } from './_lib/store.js';
import { json, fail, readBody, clean, isId, isDay, sameHash, publicMatch } from './_lib/util.js';

export async function POST(request) {
  if (!storageReady()) return new Response(JSON.stringify({ error: STORAGE_MSG }), { status: 503, headers: { 'content-type': 'application/json; charset=utf-8' } });
  let b;
  try {
    b = await readBody(request);
  } catch (e) {
    return fail(e.message);
  }
  if (!isId(b.id)) return fail('Partido inexistente.', 404);
  const path = `matches/${b.id}/match.json`;
  const match = await getJSON(path);
  if (!match) return fail('No encontramos este partido.', 404);
  if (!sameHash(b.k, match.adminHash)) return fail('Solo el organizador puede hacer esto.', 403);

  const now = new Date().toISOString();

  switch (b.action) {
    case 'confirm': {
      const start = Number(b.start);
      if (!isDay(b.day) || !match.days.includes(b.day)) return fail('Día inválido.');
      if (!(start >= match.from && start + match.duration <= match.to && start % 30 === 0)) {
        return fail('Horario inválido.');
      }
      const ids = (arr) => (Array.isArray(arr) ? arr.filter(isId).slice(0, 12) : []);
      match.status = 'confirmed';
      match.confirmed = {
        day: b.day,
        start,
        end: start + match.duration,
        players: ids(b.players).slice(0, match.need),
        bench: ids(b.bench),
        booker: isId(b.booker) ? b.booker : null,
        confirmedAt: now,
      };
      if (b.courtPrice !== undefined) match.courtPrice = Number(b.courtPrice) > 0 ? Math.round(Number(b.courtPrice)) : null;
      if (b.alias !== undefined) match.alias = clean(b.alias, 60);
      if (b.club !== undefined) match.club = clean(b.club, 60);
      break;
    }
    case 'reopen':
      match.status = 'open';
      match.confirmed = null;
      break;
    case 'update': {
      if (b.title !== undefined) match.title = clean(b.title, 60) || match.title;
      if (b.club !== undefined) match.club = clean(b.club, 60);
      if (b.notes !== undefined) match.notes = clean(b.notes, 280);
      if (b.alias !== undefined) match.alias = clean(b.alias, 60);
      if (b.covered !== undefined) match.covered = Boolean(b.covered);
      if (b.courtPrice !== undefined) match.courtPrice = Number(b.courtPrice) > 0 ? Math.round(Number(b.courtPrice)) : null;
      if (b.deadline !== undefined) {
        match.deadline = b.deadline && !Number.isNaN(Date.parse(b.deadline)) ? new Date(b.deadline).toISOString() : null;
      }
      break;
    }
    case 'remove': {
      if (!isId(b.pid)) return fail('Jugador inválido.');
      await deleteJSON(`matches/${match.id}/votes/${b.pid}.json`);
      if (match.confirmed) {
        match.confirmed.players = match.confirmed.players.filter((p) => p !== b.pid);
        match.confirmed.bench = match.confirmed.bench.filter((p) => p !== b.pid);
      }
      break;
    }
    default:
      return fail('Acción desconocida.');
  }

  match.updatedAt = now;
  await putJSON(path, match);
  return json({ ok: true, match: publicMatch(match) });
}
