// GET /api/match?id=xxx[&k=claveOrganizador] — partido + respuestas.
// Los datos de contacto solo se devuelven al organizador.
import { storageReady, STORAGE_MSG } from './_lib/store.js';
import { loadMatch, shapeParticipant } from './_lib/data.js';
import { json, fail, isId, sameHash, publicMatch } from './_lib/util.js';

export async function GET(request) {
  if (!storageReady()) return new Response(JSON.stringify({ error: STORAGE_MSG }), { status: 503, headers: { 'content-type': 'application/json; charset=utf-8' } });
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!isId(id)) return fail('Partido inexistente.', 404);

  const data = await loadMatch(id);
  if (!data) return fail('No encontramos este partido. Revisá el link.', 404);

  const isAdmin = sameHash(url.searchParams.get('k'), data.match.adminHash);
  return json({
    match: publicMatch(data.match),
    participants: data.votes.map((v) => shapeParticipant(v, isAdmin)),
    admin: isAdmin,
  });
}
