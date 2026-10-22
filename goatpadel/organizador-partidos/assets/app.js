// Organizador de partidos GOAT PADEL — interfaz.
import { analyze, hhmm, slotsCount } from './matching.js';
import { loadWeather, summarize, rainPenalty, geocode, KMH_TO_KNOTS } from './weather.js';

const CFG = {
  // Link al test de nivel de GOAT PADEL (a confirmar cuando esté publicado).
  testUrl: 'https://goatpadel.com.ar/test-de-nivel/',
  tz: 'America/Argentina/Buenos_Aires',
  pollMs: 20000,
};

const API = new URL('../api/', import.meta.url);
const app = document.getElementById('app');

// ---------- utilidades ----------
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const initials = (name) =>
  String(name || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('') || '?';

const LS = {
  get(k, d = null) {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; }
  },
  set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* modo privado */ }
  },
};

const LEVELS = [
  ['9', 'Novena (9ª)'], ['8', 'Octava (8ª)'], ['7', 'Séptima (7ª)'], ['6', 'Sexta (6ª)'],
  ['5', 'Quinta (5ª)'], ['4', 'Cuarta (4ª)'], ['3+', 'Tercera o más'], ['nose', 'No sé mi categoría'],
];
const levelShort = { 9: '9ª', 8: '8ª', 7: '7ª', 6: '6ª', 5: '5ª', 4: '4ª', '3+': '3ª+', nose: '' };

function todayAR() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: CFG.tz }).format(new Date());
}
function addDays(iso, n) {
  const d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
const dayDate = (iso) => new Date(iso + 'T12:00:00Z');
function dayLabel(iso, style = 'long') {
  const d = dayDate(iso);
  const t = todayAR();
  const rel = iso === t ? 'Hoy' : iso === addDays(t, 1) ? 'Mañana' : null;
  const wd = new Intl.DateTimeFormat('es-AR', { weekday: style === 'long' ? 'long' : 'short', timeZone: 'UTC' }).format(d).replace('.', '');
  const dm = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: style === 'long' ? 'long' : 'numeric', timeZone: 'UTC' }).format(d);
  if (style === 'long') { const t2 = rel ? `${rel}, ${wd} ${dm}` : `${wd} ${dm}`; return t2.charAt(0).toUpperCase() + t2.slice(1); }
  return { wd: rel || wd, dm };
}
const money = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

function timeAgo(iso) {
  const s = Math.max(1, Math.round((Date.now() - Date.parse(iso)) / 1000));
  if (s < 60) return 'recién';
  const m = Math.round(s / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.round(h / 24)} d`;
}
function deadlineText(iso) {
  const ms = Date.parse(iso) - Date.now();
  const when = new Intl.DateTimeFormat('es-AR', { weekday: 'short', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: CFG.tz }).format(new Date(iso));
  if (ms <= 0) return { text: `Cerró la respuesta (${when})`, late: true };
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const left = h >= 24 ? `${Math.round(h / 24)} d` : h > 0 ? `${h} h ${m} min` : `${m} min`;
  return { text: `Responder antes del ${when} · faltan ${left}`, late: false };
}

let toastTimer;
function toast(msg, err = false) {
  let el = $('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.append(el);
  }
  el.textContent = msg;
  el.classList.toggle('err', err);
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 3200);
}

async function api(path, opts = {}) {
  const res = await fetch(new URL(path, API), {
    ...opts,
    headers: { 'content-type': 'application/json', ...(opts.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Algo falló. Probá de nuevo.');
  return data;
}

async function copy(text, msg = 'Link copiado') {
  try {
    await navigator.clipboard.writeText(text);
    toast(msg);
  } catch {
    window.prompt('Copiá el link:', text);
  }
}

const baseUrl = () => location.origin + location.pathname;
const shareUrl = (id) => `${baseUrl()}?m=${id}`;
const adminUrl = (id, k) => `${baseUrl()}?m=${id}&k=${encodeURIComponent(k)}`;
const waLink = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`;

// =====================================================================
// CREAR PARTIDO
// =====================================================================
function renderCreatePage() {
  document.title = 'Organizador de partidos · GOAT PADEL';
  const today = todayAR();
  const nextDays = Array.from({ length: 14 }, (_, i) => addDays(today, i));
  const times = [];
  for (let m = 6 * 60; m <= 24 * 60; m += 30) times.push(m);
  const opt = (m, sel) => `<option value="${hhmm(m) === '00:00' && m === 1440 ? '24:00' : hhmm(m)}" ${m === sel ? 'selected' : ''}>${m === 1440 ? '24:00' : hhmm(m)}</option>`;
  const profile = LS.get('goat-org-profile', {});
  const lastPlace = LS.get('goat-org-place', null);
  const mine = LS.get('goat-org-matches', []);

  app.innerHTML = `
    <div class="hero">
      <p class="eyebrow">Organizador de partidos</p>
      <h1>Armá el partido.<br>Sin el ida y vuelta.</h1>
      <p class="lead">Proponé días y horarios, mandá el link al grupo y cada uno marca cuándo puede. El sistema encuentra el horario en que juegan los 4.</p>
    </div>

    <div class="grid-2">
      <form class="card" id="createForm" novalidate>
        <div class="card-head"><h2>Nuevo partido</h2></div>

        <div class="row">
          <div class="field">
            <label for="fOrg">Tu nombre</label>
            <input id="fOrg" type="text" maxlength="40" autocomplete="given-name" required value="${esc(profile.name || '')}" placeholder="Ej.: Buki" />
          </div>
          <div class="field">
            <label for="fTitle">Nombre del partido <span class="muted">(opcional)</span></label>
            <input id="fTitle" type="text" maxlength="60" placeholder="Pádel del jueves" />
          </div>
        </div>

        <div class="field">
          <span class="label">¿Qué días proponés?</span>
          <div class="chips" id="fDays">
            ${nextDays.map((d, i) => {
              const l = dayLabel(d, 'short');
              return `<button type="button" class="chip day" data-day="${d}" aria-pressed="${i === 0}"><b>${esc(l.wd)}</b>${esc(l.dm)}</button>`;
            }).join('')}
          </div>
          <span class="hint">Podés elegir varios (hasta 7).</span>
        </div>

        <div class="field">
          <span class="label">Rango horario</span>
          <div class="chips" id="fPresets">
            <button type="button" class="chip" data-from="480" data-to="780">Mañana</button>
            <button type="button" class="chip" data-from="780" data-to="1080">Tarde</button>
            <button type="button" class="chip" data-from="1080" data-to="1440">Noche</button>
            <button type="button" class="chip" data-from="480" data-to="1440">Todo el día</button>
          </div>
          <div class="row" style="margin-top:8px">
            <div class="field" style="margin:0"><label for="fFrom" class="hint">Desde</label><select id="fFrom">${times.slice(0, -1).map((m) => opt(m, 17 * 60)).join('')}</select></div>
            <div class="field" style="margin:0"><label for="fTo" class="hint">Hasta</label><select id="fTo">${times.slice(1).map((m) => opt(m, 23 * 60 + 30)).join('')}</select></div>
          </div>
        </div>

        <div class="row">
          <div class="field">
            <span class="label">Duración</span>
            <div class="seg" id="fDur" role="group" aria-label="Duración del partido">
              <button type="button" data-v="60" aria-pressed="false">60'</button>
              <button type="button" data-v="90" aria-pressed="true">90'</button>
              <button type="button" data-v="120" aria-pressed="false">120'</button>
            </div>
          </div>
          <div class="field">
            <span class="label">Jugadores</span>
            <div class="seg" id="fNeed" role="group" aria-label="Cantidad de jugadores">
              <button type="button" data-v="4" aria-pressed="true">4 · dobles</button>
              <button type="button" data-v="2" aria-pressed="false">2</button>
            </div>
          </div>
        </div>

        <hr class="divider" />

        <div class="field">
          <label for="fClub">Club o cancha <span class="muted">(opcional)</span></label>
          <input id="fClub" type="text" maxlength="60" placeholder="Ej.: Club del barrio, cancha 3" />
        </div>

        <div class="field">
          <label for="fPlace">Zona del club, para el pronóstico</label>
          <div class="share-box">
            <input id="fPlace" type="text" maxlength="60" placeholder="Ej.: Pilar" value="${esc(lastPlace?.name || '')}" autocomplete="off" />
            <button type="button" class="btn btn-sm" id="fPlaceBtn">Buscar</button>
          </div>
          <div class="geo-results" id="fPlaceRes"></div>
          <button type="button" class="link-btn" id="fGeoMe" style="justify-self:start">Usar mi ubicación actual</button>
          <span class="hint" id="fPlaceSel">${lastPlace ? `Clima para: <b>${esc(lastPlace.name)}</b>` : 'Sin zona no mostramos el clima.'}</span>
        </div>

        <label class="check" style="margin-bottom:14px"><input type="checkbox" id="fCovered" /> <span>Cancha techada <span class="muted">(la lluvia no cuenta para elegir horario)</span></span></label>

        <details>
          <summary>Más opciones: precio, alias y fecha límite</summary>
          <div style="margin-top:12px">
            <div class="row">
              <div class="field">
                <label for="fPrice">Precio de la cancha</label>
                <input id="fPrice" type="number" inputmode="numeric" min="0" step="500" placeholder="Ej.: 40000" />
                <span class="hint">Lo dividimos entre los jugadores.</span>
              </div>
              <div class="field">
                <label for="fAlias">Alias para transferir</label>
                <input id="fAlias" type="text" maxlength="60" placeholder="Ej.: buki.padel" />
              </div>
            </div>
            <div class="field">
              <label for="fDeadline">Responder antes de</label>
              <input id="fDeadline" type="datetime-local" />
            </div>
            <div class="field">
              <label for="fNotes">Notas para el grupo</label>
              <textarea id="fNotes" maxlength="280" placeholder="Ej.: Llevo pelotas nuevas."></textarea>
            </div>
          </div>
        </details>

        <div style="margin-top:18px"><button class="btn btn-primary btn-block" type="submit" id="fSubmit">Crear partido y obtener link</button></div>
      </form>

      <aside>
        <div class="card">
          <h3 style="margin-bottom:14px">Cómo funciona</h3>
          <ol class="steps">
            <li><div><b>Proponés</b> días y un rango horario.</div></li>
            <li><div><b>Compartís el link</b> por WhatsApp. No hace falta cuenta: cada uno pone su nombre y marca cuándo puede.</div></li>
            <li><div><b>El sistema elige</b> los horarios donde coinciden los 4, con suplentes y el clima del momento. Confirmás con un toque.</div></li>
          </ol>
        </div>
        ${mine.length ? `
        <div class="card">
          <h3 style="margin-bottom:6px">Tus partidos</h3>
          <ul class="mylist">${mine.slice(0, 8).map((x) => `
            <li><span>${esc(x.title)}<br><span class="small muted">${esc(timeAgo(x.createdAt))}</span></span>
            <a class="btn btn-sm" href="?m=${esc(x.id)}&k=${encodeURIComponent(x.k)}">Abrir</a></li>`).join('')}
          </ul>
        </div>` : ''}
      </aside>
    </div>`;

  // --- comportamiento del formulario ---
  const form = $('#createForm');
  let place = lastPlace;

  $('#fDays').addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    const on = b.getAttribute('aria-pressed') !== 'true';
    if (on && $$('#fDays [aria-pressed=true]').length >= 7) return toast('Hasta 7 días por partido', true);
    b.setAttribute('aria-pressed', String(on));
  });
  for (const id of ['#fDur', '#fNeed']) {
    $(id).addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      $$(`${id} button`).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    });
  }
  $('#fPresets').addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    const v = (m) => (Number(m) === 1440 ? '24:00' : hhmm(Number(m)));
    $('#fFrom').value = v(b.dataset.from);
    $('#fTo').value = v(b.dataset.to);
  });

  const setPlace = (p) => {
    place = p;
    LS.set('goat-org-place', p);
    $('#fPlaceRes').innerHTML = '';
    $('#fPlace').value = p.name;
    $('#fPlaceSel').innerHTML = `Clima para: <b>${esc(p.name)}</b>`;
  };
  const doGeo = async () => {
    const q = $('#fPlace').value.trim();
    if (q.length < 2) return;
    $('#fPlaceRes').innerHTML = '<span class="hint">Buscando…</span>';
    try {
      const res = await geocode(q);
      $('#fPlaceRes').innerHTML = res.length
        ? res.map((r, i) => `<button type="button" data-i="${i}">${esc(r.name)}</button>`).join('')
        : '<span class="hint">No encontramos esa zona. Probá con la ciudad o el partido.</span>';
      $('#fPlaceRes').onclick = (e) => {
        const b = e.target.closest('button[data-i]');
        if (b) setPlace(res[Number(b.dataset.i)]);
      };
    } catch {
      $('#fPlaceRes').innerHTML = '<span class="hint">No pudimos buscar ahora.</span>';
    }
  };
  $('#fPlaceBtn').addEventListener('click', doGeo);
  $('#fPlace').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); doGeo(); }
  });
  $('#fPlace').addEventListener('input', () => {
    if (place && $('#fPlace').value.trim() !== place.name) {
      place = null;
      $('#fPlaceSel').textContent = 'Tocá "Buscar" y elegí la zona.';
    }
  });
  $('#fGeoMe').addEventListener('click', () => {
    if (!navigator.geolocation) return toast('Tu navegador no comparte ubicación', true);
    navigator.geolocation.getCurrentPosition(
      (pos) => setPlace({ name: 'Mi ubicación', lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => toast('No pudimos obtener tu ubicación', true),
      { timeout: 8000 },
    );
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const organizerName = $('#fOrg').value.trim();
    if (!organizerName) { $('#fOrg').focus(); return toast('Poné tu nombre', true); }
    const days = $$('#fDays [aria-pressed=true]').map((b) => b.dataset.day);
    if (!days.length) return toast('Elegí al menos un día', true);
    const dl = $('#fDeadline').value;
    const body = {
      organizerName,
      title: $('#fTitle').value.trim(),
      days,
      from: $('#fFrom').value,
      to: $('#fTo').value,
      duration: Number($('#fDur [aria-pressed=true]').dataset.v),
      need: Number($('#fNeed [aria-pressed=true]').dataset.v),
      club: $('#fClub').value.trim(),
      place,
      covered: $('#fCovered').checked,
      courtPrice: Number($('#fPrice').value) || null,
      alias: $('#fAlias').value.trim(),
      deadline: dl ? new Date(dl).toISOString() : null,
      notes: $('#fNotes').value.trim(),
    };
    const btn = $('#fSubmit');
    btn.disabled = true;
    btn.textContent = 'Creando…';
    try {
      const { id, adminKey } = await api('matches', { method: 'POST', body: JSON.stringify(body) });
      const title = body.title || 'Partido de pádel';
      const mine = LS.get('goat-org-matches', []);
      mine.unshift({ id, k: adminKey, title, createdAt: new Date().toISOString() });
      LS.set('goat-org-matches', mine.slice(0, 30));
      const prof = LS.get('goat-org-profile', {});
      LS.set('goat-org-profile', { ...prof, name: prof.name || organizerName });
      renderCreated(id, adminKey, title);
    } catch (err) {
      toast(err.message, true);
      btn.disabled = false;
      btn.textContent = 'Crear partido y obtener link';
    }
  });
}

function renderCreated(id, k, title) {
  const link = shareUrl(id);
  const msg = `🎾 ${title}\nMarcá cuándo podés jugar y el sistema encuentra el horario para todos:\n${link}`;
  app.innerHTML = `
    <div class="hero">
      <p class="eyebrow">Listo</p>
      <h1>Partido creado</h1>
      <p class="lead">Mandá este link al grupo. Cada uno marca cuándo puede, sin crear cuenta.</p>
    </div>
    <div class="grid-2">
      <div class="card">
        <h2 style="margin-bottom:12px">Link para el grupo</h2>
        <div class="share-box"><input type="text" readonly value="${esc(link)}" aria-label="Link para el grupo" /><button class="btn btn-sm" id="cp1">Copiar</button></div>
        <div class="actions" style="margin-top:14px">
          <a class="btn btn-wa" href="${esc(waLink(msg))}" target="_blank" rel="noopener">Enviar por WhatsApp</a>
          <a class="btn btn-primary" href="?m=${esc(id)}&k=${encodeURIComponent(k)}">Cargar mi disponibilidad</a>
        </div>
      </div>
      <div class="card">
        <h3>Tu link de organizador</h3>
        <p class="small muted" style="margin:6px 0 12px">Con este link confirmás el horario y ves los contactos. Ya quedó guardado en este dispositivo; si vas a usar otro, guardalo. <b>No lo compartas.</b></p>
        <div class="share-box"><input type="text" readonly value="${esc(adminUrl(id, k))}" aria-label="Link de organizador" /><button class="btn btn-sm" id="cp2">Copiar</button></div>
      </div>
    </div>`;
  $('#cp1').onclick = () => copy(link);
  $('#cp2').onclick = () => copy(adminUrl(id, k), 'Link de organizador copiado');
}

// =====================================================================
// PÁGINA DEL PARTIDO
// =====================================================================
const S = {
  id: null,
  k: null,
  data: null,
  me: null,
  draft: {},
  mode: 2,
  wx: null,
  stamp: '',
};

async function renderMatchPage(id) {
  S.id = id;
  S.k = params.get('k') || LS.get('goat-org-matches', []).find((x) => x.id === id)?.k || null;
  S.me = LS.get(`goat-org-vote-${id}`, null);
  try {
    S.data = await api(`match?id=${encodeURIComponent(id)}${S.k ? `&k=${encodeURIComponent(S.k)}` : ''}`);
  } catch (err) {
    app.innerHTML = `<div class="hero"><h1>Ups</h1><p class="lead">${esc(err.message)}</p><p><a class="btn btn-primary" href="./">Crear un partido</a></p></div>`;
    return;
  }
  const m = S.data.match;
  document.title = `${m.title} · GOAT PADEL`;
  if (S.data.admin) {
    const mine = LS.get('goat-org-matches', []);
    const it = mine.find((x) => x.id === id);
    if (it && it.title !== m.title) { it.title = m.title; LS.set('goat-org-matches', mine); }
  }

  // Mi borrador: lo que ya guardé o vacío.
  const mine = S.me && S.data.participants.find((p) => p.pid === S.me.pid);
  const n = slotsCount(m);
  for (const d of m.days) S.draft[d] = (mine?.avail?.[d] || '').padEnd(n, '0').slice(0, n);
  S.stamp = stampOf(S.data);

  app.innerHTML = `
    <div class="match-head" id="head"></div>
    <div id="confirmedBox"></div>
    <div class="grid-2 ${mine || S.data.admin ? 'results-first' : ''}" id="layout">
      <div>
        <section class="card" id="mine"></section>
        <section class="card" id="groupGrid"></section>
      </div>
      <div>
        <section class="card" id="results"></section>
        <section class="card" id="people"></section>
        <section class="card" id="adminBox" hidden></section>
      </div>
    </div>`;

  renderHead();
  renderMine();
  renderAll();

  S.wx = await loadWeather(m.place, m.days);
  if (S.wx) renderAll();

  setInterval(refresh, CFG.pollMs);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
}

const stampOf = (d) => `${d.match.updatedAt}|${d.participants.map((p) => p.pid + p.updatedAt).join(',')}`;

async function refresh() {
  if (document.hidden || !S.id) return;
  try {
    const data = await api(`match?id=${encodeURIComponent(S.id)}${S.k ? `&k=${encodeURIComponent(S.k)}` : ''}`);
    const st = stampOf(data);
    if (st !== S.stamp) {
      S.data = data;
      S.stamp = st;
      renderHead();
      renderAll();
    }
  } catch { /* sin conexión: se reintenta en el próximo ciclo */ }
}

function renderAll() {
  renderConfirmed();
  renderResults();
  renderGroup();
  renderPeople();
  renderAdmin();
}

function renderHead() {
  const m = S.data.match;
  const range = `${hhmm(m.from)} a ${m.to === 1440 ? '24:00' : hhmm(m.to)}`;
  const dl = m.deadline && m.status !== 'confirmed' ? deadlineText(m.deadline) : null;
  const count = S.data.participants.length;
  $('#head').innerHTML = `
    <p class="eyebrow">Organiza ${esc(m.organizerName)}</p>
    <h1>${esc(m.title)}</h1>
    <div class="meta">
      ${m.status === 'confirmed' ? '<span class="tag ok">Confirmado</span>' : `<span class="tag bordo">${count} ${count === 1 ? 'respuesta' : 'respuestas'} · faltan horarios para ${m.need}</span>`}
      <span class="tag">${m.days.map((d) => esc(dayLabel(d, 'short').wd + ' ' + dayLabel(d, 'short').dm)).join(' · ')}</span>
      <span class="tag">${range} · ${m.duration}'</span>
      ${m.club ? `<span class="tag">${esc(m.club)}</span>` : ''}
      ${m.covered ? '<span class="tag">Techada</span>' : ''}
      ${dl ? `<span class="tag ${dl.late ? 'bordo' : ''}">${esc(dl.text)}</span>` : ''}
    </div>
    ${m.notes ? `<p class="muted" style="margin:12px 0 0">${esc(m.notes)}</p>` : ''}
    ${S.data.admin ? `
      <div class="notice" style="margin-top:14px">Estás en el <b>panel de organizador</b>. Para invitar, compartí el link del grupo:
        <div class="actions" style="margin-top:10px">
          <button class="btn btn-sm btn-navy" id="hCopy">Copiar link del grupo</button>
          <a class="btn btn-sm btn-wa" target="_blank" rel="noopener" href="${esc(waLink(`🎾 ${m.title}\nMarcá cuándo podés jugar y el sistema encuentra el horario para todos:\n${shareUrl(m.id)}`))}">WhatsApp</a>
        </div>
      </div>` : `
      <div class="actions" style="margin-top:14px"><button class="btn btn-sm" id="hCopy">Copiar link</button></div>`}`;
  $('#hCopy').onclick = () => copy(shareUrl(m.id));
  const counter = $('.tag.bordo');
  if (counter && m.status !== 'confirmed') {
    const best = analyze(m, S.data.participants).best;
    counter.textContent = `${count} ${count === 1 ? 'respuesta' : 'respuestas'}${best.length ? ' · hay horario' : ` · necesitan ${m.need}`}`;
    if (best.length) counter.className = 'tag ok';
  }
}

// ---------- resultados ----------
function wxBlock(day, start, end, covered) {
  if (!S.data.match.place) return '';
  const s = summarize(S.wx, day, start, end);
  if (!s) return S.wx ? '' : '<p class="wx-note">Cargando pronóstico…</p>';
  if (s.pending) return `<p class="wx-note">El pronóstico para ese día aparece desde el ${esc(dayLabel(s.availableFrom, 'long'))}.</p>`;
  const kn = (v) => Math.round(v * KMH_TO_KNOTS);
  return `
    <dl class="wx">
      <div class="${s.rain ? 'rain-yes' : ''}"><dt>Lluvia</dt><dd>${s.rain ? 'Sí' : 'No'} <small>${s.mm ? `${s.mm} mm` : ''}</small></dd></div>
      <div><dt>Prob. lluvia</dt><dd>${s.prob}%</dd></div>
      <div><dt>Viento</dt><dd>${s.wind} km/h <small>${kn(s.wind)} kn</small></dd><dd><small>Ráfagas ${s.gust} km/h · ${kn(s.gust)} kn</small></dd></div>
      <div><dt>Temperatura</dt><dd>${s.tMin === s.tMax ? `${s.tMax}°` : `${s.tMin}° a ${s.tMax}°`}</dd></div>
    </dl>
    ${covered && s.rain ? '<p class="wx-note">Cancha techada: la lluvia no debería afectar.</p>' : ''}`;
}

const personChip = (p, kind, note = '') =>
  `<span class="person ${kind}"><span class="av">${esc(initials(p.name))}</span>${esc(p.name)}${note ? ` <small>${esc(note)}</small>` : ''}</span>`;

function lineupHtml(g) {
  const maybeIds = new Set(g.maybe.map((p) => p.pid));
  return `
    <div class="people">${g.lineup.map((p) => personChip(p, maybeIds.has(p.pid) ? 'maybe' : '', maybeIds.has(p.pid) ? 'si no queda otra' : '')).join('')}</div>
    ${g.bench.length ? `<div class="people">${g.bench.map((p) => personChip(p, 'bench', 'suplente')).join('')}</div>` : ''}`;
}

function timeText(g, duration) {
  if (g.firstStart === g.lastStart) return `${hhmm(g.firstStart)} a ${hhmm(g.firstStart + duration)}`;
  return `Arrancan entre ${hhmm(g.firstStart)} y ${hhmm(g.lastStart)}`;
}

function currentAnalysis() {
  const m = S.data.match;
  const opts = {};
  if (!m.covered && S.wx) opts.weatherPenalty = (day, s, e) => rainPenalty(summarize(S.wx, day, s, e));
  return analyze(m, S.data.participants, opts);
}

function renderResults() {
  const m = S.data.match;
  const box = $('#results');
  const A = currentAnalysis();
  if (m.status === 'confirmed') {
    box.innerHTML = `<h2>Otros horarios posibles</h2><p class="small muted" style="margin:6px 0 14px">Por si hay que mover el partido.</p>${
      A.best.length ? A.best.slice(0, 3).map((g, i) => slotCard(g, i + 1, false)).join('') : '<p class="empty">No hay otro horario con cupo completo.</p>'}`;
    bindSlotActions(A);
    return;
  }
  if (!S.data.participants.length) {
    box.innerHTML = `<h2>Mejores horarios</h2><p class="empty">Todavía nadie respondió. Compartí el link y apenas carguen su disponibilidad aparecen acá los horarios donde coinciden.</p>`;
    return;
  }
  if (A.best.length) {
    box.innerHTML = `
      <div class="card-head"><h2>Mejores horarios</h2><span class="small muted">Se actualiza solo</span></div>
      ${A.best.slice(0, 3).map((g, i) => slotCard(g, i, S.data.admin)).join('')}
      ${A.best.length > 3 ? `<details style="margin-top:12px"><summary>Ver ${A.best.length - 3} opciones más</summary><div style="margin-top:12px">${A.best.slice(3).map((g, i) => slotCard(g, i + 3, S.data.admin)).join('')}</div></details>` : ''}`;
    bindSlotActions(A);
    return;
  }
  // Sin cupo completo: mostramos los "casi".
  box.innerHTML = `
    <h2>Todavía no hay horario para ${m.need}</h2>
    <p class="small muted" style="margin:6px 0 14px">${S.data.participants.length} de ${m.need} respondieron${S.data.participants.length >= m.need ? ', pero no coinciden' : ''}. Estos son los horarios más cerca:</p>
    ${A.near.length ? A.near.map((g) => `
      <div class="slot">
        <div class="slot-day">${esc(dayLabel(g.day, 'long'))}</div>
        <div class="slot-time">${esc(timeText(g, m.duration))}</div>
        <p class="small" style="margin:4px 0 0"><b>Falta${g.missing === 1 ? '' : 'n'} ${g.missing}</b> para completar.</p>
        ${lineupHtml(g)}
        ${g.hints.length ? `<ul class="small" style="margin:10px 0 0;padding-left:18px">${g.hints.map((h) => `<li><b>${esc(h.name)}</b> ${esc(h.text)}</li>`).join('')}</ul>` : ''}
      </div>`).join('') : '<p class="empty">Nadie marcó horarios todavía.</p>'}`;
}

function slotCard(g, i, admin) {
  const m = S.data.match;
  return `
    <article class="slot ${i === 0 ? 'top' : ''}">
      ${i === 0 ? '<span class="slot-rank">Mejor opción</span>' : ''}
      <div class="slot-day">${esc(dayLabel(g.day, 'long'))}</div>
      <div class="slot-time">${esc(timeText(g, m.duration))}</div>
      ${g.maybeUsed ? `<p class="small muted" style="margin:2px 0 0">${g.maybeUsed === 1 ? 'Uno juega' : `${g.maybeUsed} juegan`} "si no queda otra".</p>` : ''}
      ${lineupHtml(g)}
      ${wxBlock(g.day, g.firstStart, g.firstStart + m.duration, m.covered)}
      ${admin ? `<div class="actions" style="margin-top:14px"><button class="btn btn-sm btn-primary" data-confirm="${i}">Confirmar este horario</button></div><div data-confirm-form="${i}"></div>` : ''}
    </article>`;
}

function bindSlotActions(A) {
  $$('[data-confirm]').forEach((b) => {
    b.onclick = () => openConfirm(A.best[Number(b.dataset.confirm)], Number(b.dataset.confirm));
  });
}

function openConfirm(g, i) {
  const m = S.data.match;
  const holder = $(`[data-confirm-form="${i}"]`);
  const starts = g.items.map((c) => c.start);
  holder.innerHTML = `
    <div class="notice" style="margin-top:12px">
      ${starts.length > 1 ? `<div class="field"><label for="cStart${i}">Hora de inicio</label><select id="cStart${i}">${starts.map((s) => `<option value="${s}">${hhmm(s)} a ${hhmm(s + m.duration)}</option>`).join('')}</select></div>` : ''}
      <div class="field"><label for="cBook${i}">¿Quién reserva la cancha?</label>
        <select id="cBook${i}"><option value="">Yo (${esc(m.organizerName)})</option>${g.lineup.map((p) => `<option value="${esc(p.pid)}">${esc(p.name)}</option>`).join('')}</select></div>
      <div class="row">
        <div class="field"><label for="cPrice${i}">Precio cancha</label><input id="cPrice${i}" type="number" inputmode="numeric" min="0" step="500" value="${m.courtPrice || ''}" /></div>
        <div class="field"><label for="cAlias${i}">Alias</label><input id="cAlias${i}" type="text" maxlength="60" value="${esc(m.alias || '')}" /></div>
      </div>
      <button class="btn btn-primary btn-block" id="cGo${i}">Confirmar partido</button>
    </div>`;
  $(`#cGo${i}`).onclick = async () => {
    const start = starts.length > 1 ? Number($(`#cStart${i}`).value) : starts[0];
    const cand = g.items.find((c) => c.start === start) || g;
    try {
      const r = await api('admin', {
        method: 'POST',
        body: JSON.stringify({
          id: m.id, k: S.k, action: 'confirm', day: g.day, start,
          players: cand.lineup.map((p) => p.pid), bench: cand.bench.map((p) => p.pid),
          booker: $(`#cBook${i}`).value || null,
          courtPrice: Number($(`#cPrice${i}`).value) || null, alias: $(`#cAlias${i}`).value,
        }),
      });
      S.data.match = r.match;
      S.stamp = '';
      renderHead();
      renderAll();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast('Partido confirmado');
    } catch (err) { toast(err.message, true); }
  };
}

// ---------- confirmado ----------
function renderConfirmed() {
  const m = S.data.match;
  const box = $('#confirmedBox');
  if (m.status !== 'confirmed' || !m.confirmed) { box.innerHTML = ''; return; }
  const c = m.confirmed;
  const byId = new Map(S.data.participants.map((p) => [p.pid, p]));
  const players = c.players.map((id) => byId.get(id)).filter(Boolean);
  const bench = c.bench.map((id) => byId.get(id)).filter(Boolean);
  const booker = c.booker ? byId.get(c.booker)?.name : m.organizerName;
  const per = m.courtPrice ? Math.ceil(m.courtPrice / m.need / 10) * 10 : null;
  const when = `${dayLabel(c.day, 'long')}, ${hhmm(c.start)} a ${hhmm(c.end)}`;
  const text = [
    `✅ Partido confirmado: ${when}${m.club ? ` en ${m.club}` : ''}.`,
    `Juegan: ${players.map((p) => p.name).join(', ')}.`,
    bench.length ? `Suplentes: ${bench.map((p) => p.name).join(', ')}.` : '',
    `Reserva la cancha: ${booker}.`,
    per ? `${money(per)} cada uno${m.alias ? ` · Alias: ${m.alias}` : ''}.` : '',
    shareUrl(m.id),
  ].filter(Boolean).join('\n');

  box.innerHTML = `
    <section class="confirmed" style="margin-bottom:22px">
      <p class="eyebrow">Partido confirmado</p>
      <div class="slot-time">${esc(when)}</div>
      ${m.club ? `<p style="margin:4px 0 0">${esc(m.club)}</p>` : ''}
      <div class="people">${players.map((p) => personChip(p, '')).join('')}</div>
      ${bench.length ? `<p class="small" style="margin:12px 0 0">Suplentes: ${bench.map((p) => esc(p.name)).join(', ')}</p>` : ''}
      <p class="small" style="margin:12px 0 0">Reserva la cancha: <b>${esc(booker || '')}</b>${per ? ` · ${esc(money(per))} cada uno` : ''}${m.alias ? ` · Alias: <b>${esc(m.alias)}</b> <button class="link-btn" style="color:#f3c6cb" id="cpAlias">copiar</button>` : ''}</p>
      ${wxBlock(c.day, c.start, c.end, m.covered)}
      <div class="actions" style="margin-top:16px">
        <a class="btn btn-primary" target="_blank" rel="noopener" href="${esc(gcalLink(m, c))}">Agregar a Google Calendar</a>
        <button class="btn" id="icsBtn">Descargar .ics</button>
        <a class="btn" target="_blank" rel="noopener" href="${esc(waLink(text))}">Avisar por WhatsApp</a>
        ${S.data.admin ? '<button class="btn" id="reopenBtn">Reabrir</button>' : ''}
      </div>
    </section>`;
  $('#icsBtn').onclick = () => downloadIcs(m, c);
  if ($('#cpAlias')) $('#cpAlias').onclick = () => copy(m.alias, 'Alias copiado');
  if ($('#reopenBtn')) $('#reopenBtn').onclick = async () => {
    if (!confirm('¿Reabrir el partido para elegir otro horario?')) return;
    try {
      const r = await api('admin', { method: 'POST', body: JSON.stringify({ id: m.id, k: S.k, action: 'reopen' }) });
      S.data.match = r.match;
      renderHead();
      renderAll();
    } catch (err) { toast(err.message, true); }
  };
}

// Argentina no tiene horario de verano: UTC-3 todo el año.
function utcStamp(day, min) {
  const d = new Date(`${day}T00:00:00-03:00`);
  d.setUTCMinutes(d.getUTCMinutes() + min);
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}
function gcalLink(m, c) {
  const u = new URL('https://calendar.google.com/calendar/render');
  u.search = new URLSearchParams({
    action: 'TEMPLATE',
    text: `🎾 ${m.title}`,
    dates: `${utcStamp(c.day, c.start)}/${utcStamp(c.day, c.end)}`,
    details: `Organiza ${m.organizerName}. ${shareUrl(m.id)}`,
    location: m.club || '',
  });
  return u.toString();
}
function downloadIcs(m, c) {
  const escI = (s) => String(s).replace(/[\\;,]/g, (x) => '\\' + x).replace(/\n/g, '\\n');
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//GOAT PADEL//Organizador//ES', 'BEGIN:VEVENT',
    `UID:${m.id}-${c.day}-${c.start}@goatpadel`, `DTSTAMP:${utcStamp(todayAR(), 0)}`,
    `DTSTART:${utcStamp(c.day, c.start)}`, `DTEND:${utcStamp(c.day, c.end)}`,
    `SUMMARY:${escI('🎾 ' + m.title)}`, `LOCATION:${escI(m.club || '')}`, `DESCRIPTION:${escI(shareUrl(m.id))}`,
    'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:Partido de pádel', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = 'partido-padel.ics';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// ---------- mi disponibilidad ----------
function renderMine() {
  const m = S.data.match;
  const profile = LS.get('goat-org-profile', {});
  const saved = S.me && S.data.participants.find((p) => p.pid === S.me.pid);
  const box = $('#mine');
  box.innerHTML = `
    <div class="card-head"><h2>${saved ? 'Tu disponibilidad' : '¿Cuándo podés?'}</h2>${saved ? `<span class="tag ok">Guardado</span>` : ''}</div>

    <div class="row">
      <div class="field"><label for="vName">Tu nombre</label><input id="vName" type="text" maxlength="40" autocomplete="given-name" value="${esc(saved?.name || profile.name || '')}" placeholder="Nombre o apodo" /></div>
      <div class="field"><label for="vLevel">Tu categoría</label>
        <select id="vLevel">${LEVELS.map(([v, l]) => `<option value="${v}" ${(saved?.level || profile.level || 'nose') === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
      </div>
    </div>
    <p class="hint" style="margin:-6px 0 14px">¿No sabés tu categoría? <a href="${esc(CFG.testUrl)}" target="_blank" rel="noopener">Hacé el test de nivel de GOAT PADEL</a>.</p>

    <div class="toolbar">
      <div class="seg" id="vMode" role="group" aria-label="Qué marcás">
        <button type="button" data-v="2" aria-pressed="true">Puedo</button>
        <button type="button" data-v="1" aria-pressed="false">Si no queda otra</button>
        <button type="button" data-v="0" aria-pressed="false">Borrar</button>
      </div>
      <div class="legend"><span><i class="sw yes"></i>Puedo</span><span><i class="sw maybe"></i>Si no queda otra</span></div>
    </div>

    <div class="gridwrap"><div class="avgrid" id="myGrid"></div></div>
    <p class="grid-hint">Tocá un horario para marcarlo. Para marcar varios seguidos, mantené apretado y deslizá. Tocá el día para marcarlo entero.</p>
    <div class="actions" style="margin-top:10px">
      <button type="button" class="btn btn-sm" id="vHabLoad">Usar mi semana habitual</button>
      <button type="button" class="btn btn-sm" id="vHabSave">Guardar como habitual</button>
      <button type="button" class="link-btn" id="vClear">Limpiar todo</button>
    </div>

    <hr class="divider" />
    <details ${saved?.comment ? 'open' : ''}>
      <summary>Agregar un comentario</summary>
      <div class="field" style="margin-top:10px"><textarea id="vComment" maxlength="140" placeholder="Ej.: puedo llegar 15 min tarde">${esc(saved?.comment || '')}</textarea></div>
    </details>

    <div class="field" style="margin-top:14px">
      <label class="check"><input type="checkbox" id="vConsent" ${(saved ? saved.consent : profile.consent) ? 'checked' : ''} />
        <span>Quiero recibir novedades, promos y tips de GOAT PADEL por mail o WhatsApp. <span class="muted">Podés darte de baja cuando quieras.</span></span></label>
    </div>
    <div class="row" id="vContact" ${(saved ? saved.consent : profile.consent) ? '' : 'hidden'}>
      <div class="field"><label for="vEmail">Mail</label><input id="vEmail" type="email" autocomplete="email" maxlength="120" value="${esc(profile.email || '')}" /></div>
      <div class="field"><label for="vPhone">WhatsApp</label><input id="vPhone" type="tel" autocomplete="tel" maxlength="20" value="${esc(profile.phone || '')}" placeholder="11 1234 5678" /></div>
    </div>
    <p class="hint">Usamos tus datos para organizar este partido. <a href="privacidad.html" target="_blank">Privacidad</a>.</p>

    <div class="sticky-save"><button class="btn btn-primary btn-block" id="vSave">${saved ? 'Actualizar mi disponibilidad' : 'Guardar mi disponibilidad'}</button></div>`;

  buildGrid($('#myGrid'), m, { editable: true });

  $('#vMode').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    S.mode = Number(b.dataset.v);
    $$('#vMode button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  });
  $('#vConsent').addEventListener('change', (e) => { $('#vContact').hidden = !e.target.checked; });
  $('#vClear').onclick = () => {
    for (const d of m.days) S.draft[d] = '0'.repeat(slotsCount(m));
    paintAll();
  };
  $('#vHabSave').onclick = () => {
    const hab = LS.get('goat-org-habitual', {});
    for (const d of m.days) {
      const wd = dayDate(d).getUTCDay();
      hab[wd] = hab[wd] || {};
      [...S.draft[d]].forEach((v, i) => { hab[wd][m.from + i * m.step] = Number(v); });
    }
    LS.set('goat-org-habitual', hab);
    toast('Guardamos tu semana habitual en este dispositivo');
  };
  $('#vHabLoad').onclick = () => {
    const hab = LS.get('goat-org-habitual', null);
    if (!hab) return toast('Todavía no guardaste una semana habitual', true);
    let any = false;
    for (const d of m.days) {
      const wd = dayDate(d).getUTCDay();
      if (!hab[wd]) continue;
      S.draft[d] = [...S.draft[d]].map((v, i) => {
        const h = hab[wd][m.from + i * m.step];
        if (h === undefined) return v;
        any = true;
        return String(h);
      }).join('');
    }
    paintAll();
    toast(any ? 'Cargamos tu semana habitual' : 'No hay datos habituales para estos días', !any);
  };
  $('#vSave').onclick = saveMine;
}

async function saveMine() {
  const m = S.data.match;
  const name = $('#vName').value.trim();
  if (!name) { $('#vName').focus(); return toast('Poné tu nombre', true); }
  const consent = $('#vConsent').checked;
  const email = consent ? $('#vEmail').value.trim() : '';
  const phone = consent ? $('#vPhone').value.trim() : '';
  if (consent && !email && !phone) return toast('Dejanos un mail o WhatsApp para las novedades', true);
  const marked = m.days.some((d) => /[12]/.test(S.draft[d]));
  if (!marked && !confirm('No marcaste ningún horario. ¿Guardamos que no podés?')) return;

  const btn = $('#vSave');
  btn.disabled = true;
  try {
    const body = {
      matchId: m.id, name, level: $('#vLevel').value, email, phone, consent,
      comment: $('#vComment').value.trim(), avail: S.draft,
      pid: S.me?.pid, key: S.me?.key,
    };
    const r = await api('vote', { method: 'POST', body: JSON.stringify(body) });
    if (r.key) {
      S.me = { pid: r.pid, key: r.key };
      LS.set(`goat-org-vote-${m.id}`, S.me);
    }
    LS.set('goat-org-profile', { name, level: body.level, email, phone, consent });
    toast('¡Listo! Guardamos tu disponibilidad');
    await refresh();
    S.stamp = '';
    await refresh();
    renderMine();
  } catch (err) {
    toast(err.message, true);
  } finally {
    btn.disabled = false;
  }
}

// ---------- grillas ----------
function buildGrid(el, m, { editable }) {
  const n = slotsCount(m);
  el.style.gridTemplateColumns = `52px repeat(${m.days.length}, minmax(${m.days.length > 4 ? 52 : 70}px, 1fr))`;
  let html = '<div class="corner"></div>';
  for (const d of m.days) {
    const l = dayLabel(d, 'short');
    html += `<div class="dh" data-day="${d}" ${editable ? 'role="button" tabindex="0" title="Marcar todo el día"' : ''}>${esc(l.wd)}<small>${esc(l.dm)}</small></div>`;
  }
  for (let i = 0; i < n; i++) {
    const t = m.from + i * m.step;
    const isHour = t % 60 === 0;
    html += `<div class="th ${isHour ? 'hour' : ''} ${i === 0 ? 'first' : ''}">${i === 0 || isHour ? hhmm(t) : ''}</div>`;
    for (const d of m.days) {
      html += `<div class="c ${(t + m.step) % 60 === 0 ? 'hour' : ''} ${editable ? '' : 'h'}" data-day="${d}" data-i="${i}" ${editable ? '' : 'tabindex="0"'}></div>`;
    }
  }
  el.innerHTML = html;
  if (editable) {
    paintAll();
    bindPainting(el, m);
  }
}

function paintAll() {
  for (const c of $$('#myGrid .c')) {
    const v = S.draft[c.dataset.day][Number(c.dataset.i)];
    c.className = c.className.replace(/\s?v[012]/g, '') + ` v${v}`;
  }
}

function setCell(c, v) {
  const d = c.dataset.day;
  const i = Number(c.dataset.i);
  const s = S.draft[d];
  if (s[i] === String(v)) return;
  S.draft[d] = s.slice(0, i) + v + s.slice(i + 1);
  c.className = c.className.replace(/\s?v[012]/g, '') + ` v${v}`;
}

function bindPainting(el, m) {
  let paintVal = null;
  const valueFor = (c) => {
    const cur = Number(S.draft[c.dataset.day][Number(c.dataset.i)]);
    return S.mode === 0 ? 0 : cur === S.mode ? 0 : S.mode;
  };

  // Mouse: clic y arrastre.
  el.addEventListener('mousedown', (e) => {
    const c = e.target.closest('.c');
    if (!c) return;
    e.preventDefault();
    paintVal = valueFor(c);
    setCell(c, paintVal);
  });
  el.addEventListener('mouseover', (e) => {
    if (paintVal === null) return;
    const c = e.target.closest('.c');
    if (c) setCell(c, paintVal);
  });
  window.addEventListener('mouseup', () => { paintVal = null; });

  // Táctil: tocar marca; mantener apretado y deslizar pinta varios sin mover la página.
  let timer = null;
  let painting = false;
  let startXY = null;
  let startCell = null;
  el.addEventListener('touchstart', (e) => {
    const c = e.target.closest('.c');
    if (!c || e.touches.length > 1) return;
    startCell = c;
    startXY = [e.touches[0].clientX, e.touches[0].clientY];
    painting = false;
    clearTimeout(timer);
    timer = setTimeout(() => {
      painting = true;
      el.classList.add('painting');
      paintVal = valueFor(c);
      setCell(c, paintVal);
      navigator.vibrate?.(12);
    }, 280);
  }, { passive: true });
  el.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    if (painting) {
      e.preventDefault();
      const c = document.elementFromPoint(t.clientX, t.clientY)?.closest?.('#myGrid .c');
      if (c) setCell(c, paintVal);
    } else if (startXY && Math.hypot(t.clientX - startXY[0], t.clientY - startXY[1]) > 8) {
      clearTimeout(timer);
      startCell = null;
    }
  }, { passive: false });
  el.addEventListener('touchend', (e) => {
    clearTimeout(timer);
    if (!painting && startCell) {
      e.preventDefault();
      setCell(startCell, valueFor(startCell));
    }
    painting = false;
    paintVal = null;
    startCell = null;
    el.classList.remove('painting');
  });
  el.addEventListener('touchcancel', () => {
    clearTimeout(timer);
    painting = false;
    paintVal = null;
    el.classList.remove('painting');
  });

  // Tocar el encabezado del día marca o limpia el día entero.
  const fillDay = (d) => {
    const n = slotsCount(m);
    const target = S.mode === 0 || S.draft[d] === String(S.mode).repeat(n) ? '0' : String(S.mode);
    S.draft[d] = target.repeat(n);
    paintAll();
  };
  $$('.dh', el).forEach((h) => {
    h.addEventListener('click', () => fillDay(h.dataset.day));
    h.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fillDay(h.dataset.day); } });
  });
}

function renderGroup() {
  const m = S.data.match;
  const box = $('#groupGrid');
  const count = S.data.participants.length;
  if (!count) { box.innerHTML = '<h2>Disponibilidad del grupo</h2><p class="empty">Acá vas a ver cuántos pueden en cada horario.</p>'; return; }
  box.innerHTML = `
    <div class="card-head"><h2>Disponibilidad del grupo</h2>
      <span class="heat-legend">0 <i style="background:#fff;border:1px solid var(--line)"></i><i style="background:rgba(20,33,61,.25)"></i><i style="background:rgba(20,33,61,.55)"></i><i style="background:rgba(20,33,61,.9)"></i> ${count}</span>
    </div>
    <div class="gridwrap"><div class="avgrid" id="heatGrid"></div></div>
    <p class="grid-hint">Tocá un horario para ver quién puede. Con borde bordó: alcanzan para jugar.</p>`;
  const el = $('#heatGrid');
  buildGrid(el, m, { editable: false });
  const A = analyze(m, S.data.participants);
  const scale = Math.max(m.need, count);
  for (const c of $$('.c', el)) {
    const h = A.heat[c.dataset.day][Number(c.dataset.i)];
    const score = h.yes.length + h.maybe.length * 0.5;
    if (score > 0) c.style.background = `rgba(20,33,61,${(0.12 + 0.78 * Math.min(1, score / scale)).toFixed(2)})`;
    if (h.yes.length + h.maybe.length >= m.need) c.classList.add('full');
  }
  const tip = (c, x, y) => {
    const h = A.heat[c.dataset.day][Number(c.dataset.i)];
    const t = m.from + Number(c.dataset.i) * m.step;
    let el2 = $('.tooltip');
    if (!el2) { el2 = document.createElement('div'); el2.className = 'tooltip'; document.body.append(el2); }
    el2.innerHTML = `<b>${esc(dayLabel(c.dataset.day, 'short').wd)} ${hhmm(t)}–${hhmm(t + m.step)}</b>${
      h.yes.length ? `Pueden: ${h.yes.map(esc).join(', ')}<br>` : ''}${h.maybe.length ? `Si no queda otra: ${h.maybe.map(esc).join(', ')}` : ''}${!h.yes.length && !h.maybe.length ? 'Nadie' : ''}`;
    el2.hidden = false;
    const r = el2.getBoundingClientRect();
    el2.style.left = `${Math.min(window.innerWidth - r.width - 8, Math.max(8, x - r.width / 2))}px`;
    el2.style.top = `${Math.max(8, y - r.height - 14)}px`;
  };
  const hide = () => { const t = $('.tooltip'); if (t) t.hidden = true; };
  el.addEventListener('mousemove', (e) => { const c = e.target.closest('.c'); c ? tip(c, e.clientX, e.clientY) : hide(); });
  el.addEventListener('mouseleave', hide);
  el.addEventListener('click', (e) => {
    const c = e.target.closest('.c');
    if (!c) return;
    const r = c.getBoundingClientRect();
    tip(c, r.left + r.width / 2, r.top);
    clearTimeout(S.tipT);
    S.tipT = setTimeout(hide, 2600);
  });
}

// ---------- jugadores ----------
function renderPeople() {
  const m = S.data.match;
  const ps = S.data.participants;
  const box = $('#people');
  box.innerHTML = `
    <div class="card-head"><h2>Respondieron (${ps.length})</h2></div>
    ${ps.length ? `<ul class="plist">${ps.map((p) => `
      <li>
        <span class="av">${esc(initials(p.name))}</span>
        <div class="grow">
          <div class="name">${esc(p.name)}${levelShort[p.level] ? `<span class="lvl">${esc(levelShort[p.level])}</span>` : ''}${S.me?.pid === p.pid ? ' <span class="small muted">(vos)</span>' : ''}</div>
          <div class="small muted">${esc(timeAgo(p.updatedAt))}${p.comment ? ` · “${esc(p.comment)}”` : ''}</div>
          ${S.data.admin && (p.email || p.phone) ? `<div class="small">${p.phone ? `<a href="https://wa.me/${esc(p.phone.startsWith('54') ? p.phone : '549' + p.phone)}" target="_blank" rel="noopener">WhatsApp</a>` : ''}${p.phone && p.email ? ' · ' : ''}${p.email ? `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>` : ''}${p.consent ? ' · <span class="muted">acepta novedades</span>' : ''}</div>` : ''}
        </div>
        ${S.data.admin ? `<button class="link-btn small" data-remove="${esc(p.pid)}">Quitar</button>` : ''}
      </li>`).join('')}</ul>` : `<p class="empty">Nadie todavía. ¡Compartí el link!</p>`}
    ${ps.length && ps.length < m.need ? `<p class="small muted">Faltan ${m.need - ps.length} para llegar a ${m.need}.</p>` : ''}`;
  $$('[data-remove]', box).forEach((b) => {
    b.onclick = async () => {
      const p = ps.find((x) => x.pid === b.dataset.remove);
      if (!confirm(`¿Quitar a ${p?.name} del partido?`)) return;
      try {
        await api('admin', { method: 'POST', body: JSON.stringify({ id: m.id, k: S.k, action: 'remove', pid: b.dataset.remove }) });
        S.stamp = '';
        await refresh();
      } catch (err) { toast(err.message, true); }
    };
  });
}

// ---------- organizador ----------
function renderAdmin() {
  const box = $('#adminBox');
  if (!S.data.admin) { box.hidden = true; return; }
  if (box.dataset.ready) return; // no pisar lo que el organizador está editando
  box.dataset.ready = '1';
  const m = S.data.match;
  const dlLocal = m.deadline ? new Date(Date.parse(m.deadline) - 3 * 3600000).toISOString().slice(0, 16) : '';
  box.hidden = false;
  box.innerHTML = `
    <details>
      <summary>Ajustes del organizador</summary>
      <div style="margin-top:12px">
        <div class="field"><label for="aClub">Club o cancha</label><input id="aClub" type="text" maxlength="60" value="${esc(m.club || '')}" /></div>
        <div class="row">
          <div class="field"><label for="aPrice">Precio cancha</label><input id="aPrice" type="number" inputmode="numeric" min="0" step="500" value="${m.courtPrice || ''}" /></div>
          <div class="field"><label for="aAlias">Alias</label><input id="aAlias" type="text" maxlength="60" value="${esc(m.alias || '')}" /></div>
        </div>
        <div class="field"><label for="aDeadline">Responder antes de</label><input id="aDeadline" type="datetime-local" value="${dlLocal}" /></div>
        <div class="field"><label for="aNotes">Notas</label><textarea id="aNotes" maxlength="280">${esc(m.notes || '')}</textarea></div>
        <label class="check" style="margin-bottom:14px"><input type="checkbox" id="aCovered" ${m.covered ? 'checked' : ''} /> <span>Cancha techada</span></label>
        <button class="btn btn-navy btn-block" id="aSave">Guardar cambios</button>
      </div>
    </details>`;
  $('#aSave').onclick = async () => {
    const dl = $('#aDeadline').value;
    try {
      const r = await api('admin', {
        method: 'POST',
        body: JSON.stringify({
          id: m.id, k: S.k, action: 'update',
          club: $('#aClub').value, courtPrice: Number($('#aPrice').value) || null, alias: $('#aAlias').value,
          deadline: dl ? new Date(dl + ':00-03:00').toISOString() : null, notes: $('#aNotes').value, covered: $('#aCovered').checked,
        }),
      });
      S.data.match = r.match;
      renderHead();
      renderConfirmed();
      renderResults();
      toast('Cambios guardados');
    } catch (err) { toast(err.message, true); }
  };
}

// ---------- enrutado ----------
const params = new URLSearchParams(location.search);
const matchId = params.get('m');
if (matchId) {
  const k = params.get('k');
  if (k) {
    const mine = LS.get('goat-org-matches', []);
    if (!mine.some((x) => x.id === matchId)) {
      mine.unshift({ id: matchId, k, title: 'Partido', createdAt: new Date().toISOString() });
      LS.set('goat-org-matches', mine.slice(0, 30));
    }
  }
  renderMatchPage(matchId);
} else {
  renderCreatePage();
}
