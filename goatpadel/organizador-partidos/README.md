# Organizador de partidos · GOAT PADEL

App independiente (no forma parte del sitio de DigitalTie). Cada jugador marca cuándo puede en una grilla y el sistema encuentra el horario donde coinciden los 4, con suplentes y pronóstico del clima.

- `index.html` + `assets/` — interfaz (HTML/CSS/JS sin build).
- `assets/matching.js` — motor de horarios.
- `assets/weather.js` — clima con Open-Meteo (lluvia sí/no, probabilidad, viento en km/h y nudos, temperatura).
- `api/` — funciones de Vercel. Datos en Vercel Blob **privado** (un archivo por partido y uno por respuesta).

## Local
```bash
npm install
npm run dev   # http://localhost:4400/organizador-goat-padel/  (datos en .localdata/)
```

## Variables de entorno (Vercel)
| Variable | Uso |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | La agrega Vercel al conectar el Blob store. |
| `EXPORT_KEY` | Opcional. Habilita `api/export?key=...` para bajar la base de jugadores en CSV (`&solo=consentimiento` para filtrar). |

## Pendiente
- Login con Google/Facebook (hoy: invitados con nombre).
- Link definitivo del test de nivel (`CFG.testUrl` en `assets/app.js`).
- Logo oficial de GOAT PADEL (hoy: marca provisoria en `index.html` y `assets/favicon.svg`).
