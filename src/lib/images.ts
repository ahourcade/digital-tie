import type { ImageMetadata } from 'astro';

/**
 * Todas las imágenes de portfolio viven en src/assets/work/<slug>/.
 * Se referencian en los datos como "<slug>/<archivo>" y Astro genera
 * derivados optimizados (AVIF/WebP) en el build.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/work/**/*.{png,jpg,jpeg,webp,gif,svg}',
  { eager: true },
);

export function img(path: string): ImageMetadata {
  const key = `/src/assets/work/${path}`;
  const mod = files[key];
  if (!mod) throw new Error(`[images] No existe el asset: ${key}`);
  return mod.default;
}

export function hasImg(path?: string | null): boolean {
  return !!path && !!files[`/src/assets/work/${path}`];
}

/** Anchos responsivos sin superar nunca la resolución real del archivo. */
export function widthsFor(meta: ImageMetadata, candidates = [360, 540, 720, 960, 1280, 1600, 2000]): number[] {
  const w = candidates.filter((c) => c < meta.width);
  w.push(meta.width);
  return [...new Set(w)];
}
