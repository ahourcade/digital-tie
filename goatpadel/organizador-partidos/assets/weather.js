// Pronóstico con Open-Meteo (gratis, sin clave). Horario de Argentina.
const TZ = 'America/Argentina/Buenos_Aires';
const MAX_DAYS = 16; // horizonte del pronóstico
const cache = new Map();

export const KMH_TO_KNOTS = 1 / 1.852;

function todayAR() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
}
function addDays(iso, n) {
  const d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Devuelve { hours: Map('YYYY-MM-DDTHH' -> datos), coveredUntil } o null si no hay ubicación. */
export async function loadWeather(place, days) {
  if (!place || !days?.length) return null;
  const today = todayAR();
  const last = addDays(today, MAX_DAYS - 1);
  const inRange = days.filter((d) => d >= today && d <= last);
  if (!inRange.length) return { hours: new Map(), coveredUntil: last, today };
  const start = inRange[0];
  const end = inRange[inRange.length - 1];
  const key = `${place.lat},${place.lon},${start},${end}`;
  if (cache.has(key)) return cache.get(key);

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.search = new URLSearchParams({
    latitude: place.lat,
    longitude: place.lon,
    hourly: 'temperature_2m,precipitation_probability,precipitation,wind_speed_10m,wind_gusts_10m,weather_code',
    wind_speed_unit: 'kmh',
    timezone: TZ,
    start_date: start,
    end_date: end,
  });
  const p = fetch(url)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('clima'))))
    .then((data) => {
      const h = data.hourly;
      const hours = new Map();
      h.time.forEach((t, i) => {
        hours.set(t.slice(0, 13), {
          temp: h.temperature_2m[i],
          prob: h.precipitation_probability[i],
          mm: h.precipitation[i],
          wind: h.wind_speed_10m[i],
          gust: h.wind_gusts_10m[i],
          code: h.weather_code[i],
        });
      });
      return { hours, coveredUntil: last, today };
    })
    .catch(() => null);
  cache.set(key, p);
  return p;
}

/** Tipo de cielo a partir del código WMO de Open-Meteo. */
export function skyKind(code) {
  if (code >= 95) return 'storm';
  if (code >= 51) return 'rain';
  if (code === 3 || code === 45 || code === 48) return 'cloud';
  if (code === 1 || code === 2) return 'partly';
  return 'clear';
}
export const SKY_LABEL = { clear: 'Despejado', partly: 'Parcialmente nublado', cloud: 'Nublado', rain: 'Lluvia', storm: 'Tormenta' };
const SKY_RANK = { clear: 0, partly: 1, cloud: 2, rain: 3, storm: 4 };

/** Pronóstico hora por hora para un día entre dos horarios (minutos). */
export function hourly(wx, day, startMin, endMin) {
  if (!wx || day > wx.coveredUntil) return null;
  const out = [];
  for (let h = Math.floor(startMin / 60); h < Math.ceil(endMin / 60); h++) {
    const r = wx.hours.get(`${day}T${String(h % 24).padStart(2, '0')}`);
    if (r) out.push({ hour: h, sky: skyKind(r.code), prob: Math.round(r.prob ?? 0), wind: Math.round(r.wind ?? 0), temp: Math.round(r.temp) });
  }
  return out.length ? out : null;
}

/** Resumen para una ventana del partido (minutos desde las 00:00). */
export function summarize(wx, day, startMin, endMin) {
  if (!wx) return null;
  if (day > wx.coveredUntil) return { pending: true, availableFrom: addDays(day, -(MAX_DAYS - 1)) };
  const rows = [];
  for (let h = Math.floor(startMin / 60); h < Math.ceil(endMin / 60); h++) {
    const r = wx.hours.get(`${day}T${String(h % 24).padStart(2, '0')}`);
    if (r) rows.push(r);
  }
  if (!rows.length) return null;
  const max = (k) => Math.max(...rows.map((r) => r[k] ?? 0));
  const temps = rows.map((r) => r.temp);
  const prob = max('prob');
  const mm = rows.reduce((s, r) => s + (r.mm || 0), 0);
  const rainCodes = rows.some((r) => r.code >= 51);
  const sky = rows.map((r) => skyKind(r.code)).reduce((a, b) => (SKY_RANK[b] > SKY_RANK[a] ? b : a), 'clear');
  return {
    sky,
    rain: prob >= 40 || mm >= 0.3 || (rainCodes && prob >= 25),
    prob: Math.round(prob),
    mm: Math.round(mm * 10) / 10,
    wind: Math.round(max('wind')),
    gust: Math.round(max('gust')),
    tMin: Math.round(Math.min(...temps)),
    tMax: Math.round(Math.max(...temps)),
  };
}

/** Penalización para ordenar horarios cuando la cancha no es techada. */
export function rainPenalty(s) {
  if (!s || s.pending) return 0;
  return (s.rain ? 100 : 0) + s.prob;
}

/** Búsqueda de ciudades/barrios para ubicar el club. */
export async function geocode(q) {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.search = new URLSearchParams({ name: q, count: '6', language: 'es', format: 'json' });
  const r = await fetch(url);
  if (!r.ok) return [];
  const data = await r.json();
  return (data.results || []).map((x) => ({
    name: [x.name, x.admin2 && x.admin2 !== x.name ? x.admin2 : null, x.admin1, x.country_code === 'AR' ? null : x.country]
      .filter(Boolean)
      .join(', '),
    lat: x.latitude,
    lon: x.longitude,
  }));
}
