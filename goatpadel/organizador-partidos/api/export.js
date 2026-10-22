// GET /api/export?key=XXXX[&solo=consentimiento] — descarga la base de jugadores en CSV.
// La clave se define en Vercel como variable de entorno EXPORT_KEY. Sin esa variable, la exportación queda apagada.
import { storageReady, STORAGE_MSG } from './_lib/store.js';
import { listPaths, getMany } from './_lib/store.js';
import { fail, sameHash, sha } from './_lib/util.js';

const LEVEL_LABEL = { 9: 'Novena', 8: 'Octava', 7: 'Séptima', 6: 'Sexta', 5: 'Quinta', 4: 'Cuarta', '3+': 'Tercera o más', nose: 'No sabe' };

export async function GET(request) {
  if (!storageReady()) return new Response(JSON.stringify({ error: STORAGE_MSG }), { status: 503, headers: { 'content-type': 'application/json; charset=utf-8' } });
  const secret = process.env.EXPORT_KEY;
  if (!secret) return fail('La exportación no está habilitada.', 404);
  const url = new URL(request.url);
  if (!sameHash(url.searchParams.get('key'), sha(secret))) return fail('Clave incorrecta.', 403);

  const onlyConsent = url.searchParams.get('solo') === 'consentimiento';
  let players = await getMany((await listPaths('players/')).filter((p) => p.endsWith('.json')));
  if (onlyConsent) players = players.filter((p) => p.consent);
  players.sort((a, b) => String(b.lastSeen).localeCompare(String(a.lastSeen)));

  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [
    ['Nombre', 'Email', 'WhatsApp', 'Categoría', 'Acepta marketing', 'Fecha consentimiento', 'Primera vez', 'Última vez', 'Partidos'],
    ...players.map((p) => [
      p.name, p.email, p.phone, LEVEL_LABEL[p.level] || '', p.consent ? 'Sí' : 'No',
      p.consentAt || '', p.firstSeen, p.lastSeen, (p.matches || []).length,
    ]),
  ];
  const csv = '﻿' + rows.map((r) => r.map(esc).join(',')).join('\n');
  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="jugadores-goat-padel-${new Date().toISOString().slice(0, 10)}.csv"`,
      'cache-control': 'no-store',
    },
  });
}
