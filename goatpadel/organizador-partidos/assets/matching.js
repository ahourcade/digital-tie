// Motor de horarios del Organizador GOAT PADEL.
// Entrada: el partido (días, rango, duración, cupo) y la disponibilidad de cada jugador
// en bloques de 30 min: "2" = puedo, "1" = si no queda otra, "0" = no puedo.
// Salida: los mejores horarios (con titulares y suplentes), los "casi" cuando no hay cupo,
// y el mapa de calor para la grilla.

export const YES = 2;
export const MAYBE = 1;

export const slotsCount = (m) => (m.to - m.from) / m.step;

export function hhmm(min) {
  const h = Math.floor(min / 60) % 24;
  const mm = min % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

const cell = (p, day, i) => Number((p.avail?.[day] || '')[i] || 0);

/** Estado de un jugador para una ventana [i, i+k): 2 puede toda, 1 puede con algún "si no queda otra", 0 no. */
function windowState(p, day, i, k) {
  let min = YES;
  let covered = 0;
  for (let j = i; j < i + k; j++) {
    const c = cell(p, day, j);
    if (c < min) min = c;
    if (c > 0) covered++;
  }
  return { state: min, covered };
}

function evaluate(match, players, day, i) {
  const k = match.duration / match.step;
  const yes = [];
  const maybe = [];
  const partial = [];
  const out = [];
  for (const p of players) {
    const { state, covered } = windowState(p, day, i, k);
    if (state === YES) yes.push(p);
    else if (state === MAYBE) maybe.push(p);
    else if (covered > 0) partial.push({ p, covered: covered * match.step });
    else out.push(p);
  }
  const lineup = [...yes, ...maybe].slice(0, match.need);
  const bench = [...yes, ...maybe].slice(match.need);
  const start = match.from + i * match.step;
  return {
    day,
    i,
    start,
    end: start + match.duration,
    yes,
    maybe,
    partial,
    out,
    total: yes.length + maybe.length,
    lineup,
    bench,
    maybeUsed: Math.max(0, match.need - yes.length),
  };
}

const sig = (c) => `${c.yes.map((p) => p.pid).join(',')}|${c.maybe.map((p) => p.pid).join(',')}`;

/** Une inicios consecutivos con exactamente la misma gente: "arrancan entre 19:00 y 20:00". */
function groupConsecutive(cands, step) {
  const groups = [];
  for (const c of cands) {
    const g = groups[groups.length - 1];
    if (g && g.day === c.day && g.lastStart + step === c.start && g.sig === sig(c)) {
      g.lastStart = c.start;
      g.items.push(c);
    } else {
      groups.push({ ...c, sig: sig(c), firstStart: c.start, lastStart: c.start, items: [c] });
    }
  }
  return groups;
}

/**
 * @param match
 * @param participants ordenados por orden de respuesta
 * @param opts.weatherPenalty (day, start, end) => número (0 = sin lluvia). Opcional.
 */
export function analyze(match, participants, opts = {}) {
  const n = slotsCount(match);
  const k = match.duration / match.step;
  const players = [...participants].sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  const all = [];
  for (const day of match.days) {
    for (let i = 0; i + k <= n; i++) all.push(evaluate(match, players, day, i));
  }

  const penalty = (g) => (opts.weatherPenalty ? opts.weatherPenalty(g.day, g.firstStart, g.firstStart + match.duration) || 0 : 0);
  const order = (a, b) =>
    a.maybeUsed - b.maybeUsed ||
    b.total - a.total ||
    penalty(a) - penalty(b) ||
    a.day.localeCompare(b.day) ||
    a.firstStart - b.firstStart;

  const feasible = all.filter((c) => c.total >= match.need);
  const best = groupConsecutive(feasible, match.step).sort(order).slice(0, 6);

  let near = [];
  if (!best.length && players.length) {
    const maxTotal = Math.max(0, ...all.map((c) => c.total));
    if (maxTotal > 0) {
      const top = all.filter((c) => c.total === maxTotal);
      near = groupConsecutive(top, match.step)
        .sort((a, b) => b.yes.length - a.yes.length || a.day.localeCompare(b.day) || a.firstStart - b.firstStart)
        .slice(0, 4)
        .map((g) => ({ ...g, missing: match.need - g.total, hints: hintsFor(match, g, n, k) }));
    }
  }

  const heat = {};
  for (const day of match.days) {
    heat[day] = Array.from({ length: n }, (_, i) => {
      const yes = [];
      const maybe = [];
      for (const p of players) {
        const c = cell(p, day, i);
        if (c === YES) yes.push(p.name);
        else if (c === MAYBE) maybe.push(p.name);
      }
      return { yes, maybe };
    });
  }

  return { best, near, heat, players: players.length };
}

/** Para los "casi": qué tendría que pasar para completar el cupo. */
function hintsFor(match, g, n, k) {
  const hints = [];
  for (const { p, covered } of g.partial) {
    hints.push({ name: p.name, text: `puede ${covered} de los ${match.duration} min` });
  }
  for (const p of g.out) {
    const ranges = rangesFor(match, p, g.day, n);
    if (ranges.length) hints.push({ name: p.name, text: `ese día puede ${ranges.join(' y ')}` });
    else if (Object.values(p.avail || {}).some((s) => /[12]/.test(s))) hints.push({ name: p.name, text: 'ese día no puede' });
  }
  return hints.slice(0, 4);
}

/** Rangos en los que un jugador marcó disponibilidad un día: ["de 17:00 a 20:00"]. */
export function rangesFor(match, p, day, n = slotsCount(match)) {
  const out = [];
  let startI = null;
  for (let i = 0; i <= n; i++) {
    const on = i < n && cell(p, day, i) > 0;
    if (on && startI === null) startI = i;
    if (!on && startI !== null) {
      out.push(`de ${hhmm(match.from + startI * match.step)} a ${hhmm(match.from + i * match.step)}`);
      startI = null;
    }
  }
  return out;
}
