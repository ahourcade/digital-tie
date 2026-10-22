import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export const fail = (message, status = 400) => json({ error: message }, status);

/** Id corto y legible para URLs (sin caracteres ambiguos). */
export function newId(len = 8) {
  const abc = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = randomBytes(len);
  let s = '';
  for (let i = 0; i < len; i++) s += abc[bytes[i] % abc.length];
  return s;
}

export const newKey = () => randomBytes(18).toString('base64url');
export const sha = (s) => createHash('sha256').update(String(s)).digest('hex');

export function sameHash(plain, hash) {
  if (!plain || !hash) return false;
  const a = Buffer.from(sha(plain));
  const b = Buffer.from(String(hash));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function readBody(request, maxBytes = 60_000) {
  const text = await request.text();
  if (text.length > maxBytes) throw new Error('El pedido es demasiado grande.');
  try {
    return JSON.parse(text || '{}');
  } catch {
    throw new Error('Formato inválido.');
  }
}

export const clean = (v, max = 80) =>
  String(v ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

export const isId = (v) => typeof v === 'string' && /^[a-z0-9]{6,16}$/.test(v);
export const isDay = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

export function toMin(hhmm) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || ''));
  if (!m) return NaN;
  return Number(m[1]) * 60 + Number(m[2]);
}

export const LEVELS = ['9', '8', '7', '6', '5', '4', '3+', 'nose'];
export const SIDES = ['drive', 'reves', 'ambos'];
export const cleanSide = (v) => (SIDES.includes(String(v)) ? String(v) : '');

/** Rango horario de un día del partido (cada día puede tener el suyo). */
export function dayWindow(match, day) {
  const w = match.windows?.[day];
  return w ? { from: w.from, to: w.to } : { from: match.from, to: match.to };
}

/**
 * Disponibilidad: por día, una cadena con 0 (no), 1 (si no queda otra) o 2 (puedo) por bloque de 30 min,
 * sobre el rango general del partido. Lo que cae fuera del horario propuesto para ese día queda en 0.
 */
export function sanitizeAvail(match, raw) {
  const slots = (match.to - match.from) / match.step;
  const avail = {};
  for (const day of match.days) {
    const src = typeof raw?.[day] === 'string' ? raw[day] : '';
    const { from, to } = dayWindow(match, day);
    let s = '';
    for (let i = 0; i < slots; i++) {
      const t = match.from + i * match.step;
      const c = /[012]/.test(src[i] || '') ? src[i] : '0';
      s += t >= from && t + match.step <= to ? c : '0';
    }
    avail[day] = s;
  }
  return avail;
}

export function cleanEmail(v) {
  const e = clean(v, 120).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) ? e : '';
}

export function cleanPhone(v) {
  const digits = String(v ?? '').replace(/\D/g, '').slice(0, 15);
  return digits.length >= 8 ? digits : '';
}

/** Lo que se publica del partido (sin claves). */
export function publicMatch(m) {
  const { adminHash, ...rest } = m;
  return rest;
}
