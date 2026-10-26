// Íconos de clima lineales (navy, trazo 1.75 px) según la guía de GOAT PADEL.
const SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>';
const MOON = '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>';
const CLOUD = '<path d="M7 18h10a4 4 0 0 0 .6-7.96A5.5 5.5 0 0 0 7.1 9.5 4.25 4.25 0 0 0 7 18z"/>';
const PARTLY = '<path d="M8 3.5v1.5M3.5 8H5M4.8 4.8l1 1M11.2 4.8l-1 1"/><path d="M5.6 10.3A3 3 0 1 1 10.7 7"/><path d="M9 20h8.5a3.5 3.5 0 0 0 .5-6.97A4.8 4.8 0 0 0 8.9 12 3.75 3.75 0 0 0 9 20z"/>';
const RAIN = '<path d="M7 15h10a4 4 0 0 0 .6-7.96A5.5 5.5 0 0 0 7.1 6.5 4.25 4.25 0 0 0 7 15z"/><path d="M8.5 18l-1 2.5M12.5 18l-1 2.5M16.5 18l-1 2.5"/>';
const STORM = '<path d="M7 14h10a4 4 0 0 0 .6-7.96A5.5 5.5 0 0 0 7.1 5.5 4.25 4.25 0 0 0 7 14z"/><path d="M12.5 15.5l-2 3.5h3l-2 3.5"/>';

export function skyIcon(kind, hour = 12, size = 22) {
  const night = hour >= 20 || hour < 7;
  const body = { clear: night ? MOON : SUN, partly: night ? CLOUD : PARTLY, cloud: CLOUD, rain: RAIN, storm: STORM }[kind] || SUN;
  return `<svg class="sky sky-${kind}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}
