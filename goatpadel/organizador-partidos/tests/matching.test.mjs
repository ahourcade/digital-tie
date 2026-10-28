// Pruebas del motor de horarios: `npm test`
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyze, hhmm } from '../assets/matching.js';

const day = '2026-11-05';
const match = { days: [day], windows: { [day]: { from: 1020, to: 1380 } }, from: 1020, to: 1380, step: 30, duration: 90, need: 4 };
// 12 bloques de 30 min: 17:00 … 22:30. "2" = puedo, "1" = si no queda otra, "0" = no.
const p = (name, s, t) => ({ pid: name, name, createdAt: t, avail: { [day]: s } });

test('encuentra el horario en que juegan los 4', () => {
  const r = analyze(match, [
    p('Juan', '000022222222', '1'),
    p('Pedro', '222222220000', '2'),
    p('Nico', '002222221100', '3'),
    p('Martín', '000022211000', '4'),
  ]);
  assert.ok(r.best.length > 0);
  const top = r.best[0];
  assert.equal(hhmm(top.firstStart), '19:00');
  assert.deepEqual(top.lineup.map((x) => x.name), ['Juan', 'Pedro', 'Nico', 'Martín']);
  assert.equal(top.maybeUsed, 0);
});

test('prefiere horarios sin "si no queda otra"', () => {
  const r = analyze(match, [
    p('A', '222222222222', '1'),
    p('B', '222222222222', '2'),
    p('C', '222222222222', '3'),
    p('D', '111222000000', '4'),
  ]);
  assert.equal(r.best[0].maybeUsed, 0);
  assert.equal(hhmm(r.best[0].firstStart), '18:30');
});

test('sin cupo completo devuelve los horarios más cerca y cuántos faltan', () => {
  const r = analyze(match, [p('Juan', '000022222222', '1')]);
  assert.equal(r.best.length, 0);
  assert.equal(r.near[0].missing, 3);
});

test('el quinto que se anota queda de suplente', () => {
  const all = ['A', 'B', 'C', 'D', 'E'].map((n, i) => p(n, '222222000000', String(i)));
  const top = analyze(match, all).best[0];
  assert.deepEqual(top.lineup.map((x) => x.name), ['A', 'B', 'C', 'D']);
  assert.deepEqual(top.bench.map((x) => x.name), ['E']);
});
