# Organizador de partidos · GOAT PADEL

App para armar partidos de pádel sin el ida y vuelta de mensajes. El organizador elige días, marca en un calendario cuándo puede y comparte un link; cada amigo marca sus horarios dentro de esos y el sistema encuentra el horario donde coinciden los 4 (o 2), con suplentes, parejas sugeridas y pronóstico del clima.

Versión de prueba funcionando: https://organizador-goat-padel.vercel.app

---

## Qué hay en esta carpeta

| Ruta | Qué es |
|---|---|
| `index.html`, `privacidad.html` | Las dos páginas. HTML/CSS/JS puro, **sin build** ni framework. |
| `assets/app.js` | Toda la interfaz (crear partido, anotarse, resultados, panel del organizador). |
| `assets/matching.js` | Motor de horarios (busca ventanas donde coinciden los jugadores, suplentes, "casi"). |
| `assets/weather.js`, `assets/icons.js` | Pronóstico (Open-Meteo) e íconos del clima. |
| `assets/styles.css` + SVG | Identidad GOAT PADEL (Montserrat + Inter, Navy/Bone/Burgundy, logos). |
| `api/*.js` | Funciones serverless de Vercel (formato Web `Request`/`Response`, Node 20+). |
| `api/_lib/` | Almacenamiento, validaciones y base de jugadores (no son endpoints). |
| `vercel.json` | Encabezados de seguridad y caché. |
| `dev-server.mjs` | Servidor local para probar sin Vercel. |
| `tests/` | Pruebas del motor de horarios. |

### Endpoints

| Método y ruta | Uso |
|---|---|
| `POST /api/matches` | Crea un partido. El organizador queda anotado como primer jugador. |
| `GET /api/match?id=…[&k=…]` | Partido + respuestas. Con `k` (clave de organizador) incluye contactos. |
| `POST /api/vote` | Un jugador carga o edita su disponibilidad. |
| `POST /api/admin` | Acciones del organizador: confirmar, reabrir, editar, quitar jugador, **eliminar partido**. |
| `GET /api/export?key=…[&solo=consentimiento]` | Base de jugadores en CSV (solo si existe `EXPORT_KEY`). |

### Datos

Todo se guarda en **Vercel Blob privado**, bajo el prefijo `organizador-goat-padel/`:

```
matches/<id>/match.json          el partido
matches/<id>/votes/<pid>.json    una respuesta por jugador (no se pisan entre sí)
players/<hash>.json              base de jugadores de GOAT PADEL (solo si aceptan novedades
                                 dejan mail/WhatsApp; se conserva aunque se borre el partido)
```

No hay cuentas: cada jugador recibe una clave que queda en su navegador para poder editar. El organizador tiene un link propio (`?m=<id>&k=<clave>`); en el servidor solo se guarda el hash de las claves.

---

## Probar en local

Requiere Node 20 o superior.

```bash
npm install
npm test          # pruebas del motor de horarios
npm run dev       # http://localhost:4400/organizador-goat-padel/
```

En local los datos van a la carpeta `.localdata/` (no se sube).

---

## Subir a producción (recomendado: proyecto propio en Vercel)

La app es independiente del sitio de la tienda: **no hace falta tocar el código de goatpadel.com.ar**. Lo más limpio es publicarla como un proyecto aparte de Vercel y después colgarla del dominio.

1. **Copiar esta carpeta al repo**, por ejemplo en `organizador-partidos/` (sin `node_modules`).
2. **Vercel → Add New → Project** → elegir el repo → *Root Directory*: `organizador-partidos` → *Framework Preset*: **Other** → sin build command → Deploy.
3. **Storage → Create → Blob** → acceso **Private** → región **São Paulo (gru1)** → conectarlo a este proyecto (todos los entornos). Vercel agrega solo las variables del Blob.
4. **Settings → Functions → Region**: São Paulo (`gru1`), para que quede cerca del Blob y de los usuarios.
5. **Redeploy** (las variables del Blob se cargan en el despliegue siguiente).
6. Opcional: **Settings → Environment Variables** → `EXPORT_KEY` = una clave larga → Redeploy. Habilita la descarga de la base de jugadores en `/api/export?key=…`.

### Colgarla del dominio

Elegir **una** de las dos:

**A. Subdominio (lo más simple):** en el proyecto nuevo, *Settings → Domains* → `partidos.goatpadel.com.ar`, y crear el CNAME que indica Vercel.

**B. Ruta dentro de la tienda** (`goatpadel.com.ar/partidos/`): en el proyecto de la tienda, agregar una rewrite hacia el proyecto nuevo. Con `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/partidos", "destination": "https://<proyecto-organizador>.vercel.app/" },
    { "source": "/partidos/:path*", "destination": "https://<proyecto-organizador>.vercel.app/:path*" }
  ]
}
```

(Si la tienda es Next.js, lo mismo va en `next.config.js` → `async rewrites()`.)
La app usa rutas relativas, así que funciona igual en la raíz, en un subdominio o bajo `/partidos/`.

### Antes de lanzar

- **Link del test de nivel:** `CFG.testUrl` en `assets/app.js` (hoy apunta a `https://goatpadel.com.ar/test-de-nivel/`).
- **Versión de los archivos:** cuando se cambien `app.js` o `styles.css`, subir el `?v=` en `index.html` para que los navegadores tomen la versión nueva.
- **Privacidad:** el texto de `privacidad.html` es una base; revisarlo antes de juntar contactos para marketing.

---

## Servicios externos (sin clave ni costo)

- **Open-Meteo**: pronóstico por hora y búsqueda de zonas (limitada a Argentina).
- **BigDataCloud** (reverse geocoding desde el navegador): nombre del lugar al usar "mi ubicación".
- **Google Fonts**: Montserrat e Inter.

## Pendiente / ideas

- Login con Google o Facebook (hoy: invitados con nombre, con la ficha de jugador lista para unirse a cuentas).
- Link personal para que un jugador edite su respuesta desde otro dispositivo.
- Aviso al organizador si alguien confirmado cambia sus horarios.
- Que el organizador pueda editar días y horarios después de crear el partido.
