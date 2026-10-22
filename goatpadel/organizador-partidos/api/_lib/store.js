// Almacenamiento: Vercel Blob privado en producción; carpeta local (.localdata) en desarrollo.
// Cada jugador escribe su propio archivo, así dos personas que responden a la vez nunca se pisan.
import { put, get, list, del } from '@vercel/blob';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = 'organizador-goat-padel/';
const USE_BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
const LOCAL_DIR = path.join(process.cwd(), '.localdata');

/** En Vercel sin Blob conectado no hay dónde guardar: avisamos claro en vez de fallar. */
export const storageReady = () => USE_BLOB || !process.env.VERCEL;
export const STORAGE_MSG = 'Falta conectar el almacenamiento del organizador (Vercel Blob). Avisale al administrador.';

export async function putJSON(pathname, data) {
  const body = JSON.stringify(data);
  if (USE_BLOB) {
    await put(ROOT + pathname, body, {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }
  const file = path.join(LOCAL_DIR, pathname);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, body);
}

export async function getJSON(pathname) {
  if (USE_BLOB) {
    const res = await get(ROOT + pathname, { access: 'private', useCache: false });
    if (!res || res.statusCode !== 200) return null;
    return JSON.parse(await new Response(res.stream).text());
  }
  try {
    return JSON.parse(await fs.readFile(path.join(LOCAL_DIR, pathname), 'utf8'));
  } catch {
    return null;
  }
}

/** Devuelve los pathnames (sin el prefijo raíz) que empiezan con `prefix`. */
export async function listPaths(prefix) {
  if (USE_BLOB) {
    const out = [];
    let cursor;
    do {
      const page = await list({ prefix: ROOT + prefix, cursor, limit: 1000 });
      for (const b of page.blobs) out.push(b.pathname.slice(ROOT.length));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return out;
  }
  const base = path.join(LOCAL_DIR, prefix);
  const out = [];
  async function walk(dir) {
    let entries = [];
    try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await walk(full);
      else out.push(path.relative(LOCAL_DIR, full).split(path.sep).join('/'));
    }
  }
  await walk(base);
  return out;
}

export async function getMany(pathnames) {
  const results = await Promise.all(pathnames.map((p) => getJSON(p).catch(() => null)));
  return results.filter(Boolean);
}

export async function deleteJSON(pathname) {
  if (USE_BLOB) {
    await del(ROOT + pathname).catch(() => {});
    return;
  }
  await fs.rm(path.join(LOCAL_DIR, pathname), { force: true });
}
