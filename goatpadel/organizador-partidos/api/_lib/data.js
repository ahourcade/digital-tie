import { getJSON, listPaths, getMany } from './store.js';

export async function loadMatch(id) {
  const match = await getJSON(`matches/${id}/match.json`);
  if (!match) return null;
  const paths = (await listPaths(`matches/${id}/votes/`)).filter((p) => p.endsWith('.json'));
  const votes = await getMany(paths);
  votes.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  return { match, votes };
}

export function shapeParticipant(v, withContact) {
  const p = {
    pid: v.pid,
    name: v.name,
    level: v.level,
    avail: v.avail,
    comment: v.comment || '',
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
  };
  if (withContact) {
    p.email = v.email || '';
    p.phone = v.phone || '';
    p.consent = Boolean(v.consent);
  }
  return p;
}
