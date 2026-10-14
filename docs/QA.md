# QA — verificaciones realizadas (14/10/2026)

Entorno: build de producción (`npm run build`) servido con `astro preview`, Chromium headless (Playwright) y Lighthouse 12. Son mediciones de laboratorio en servidor local: **no reemplazan datos de campo (CrUX) una vez publicado**.

## Build
- `astro build`: 36 páginas generadas, 0 errores.
- Enlaces internos: 2.027 referencias (href/src) revisadas en `dist/`, 0 rotas.

## Lighthouse móvil (simulado)
| Página | Perf | A11y | Buenas prácticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 99 | 100 | 100 | 100 | 2,1 s | 0 | 0 ms |
| `/proyectos/` | 100 | 100 | 100 | 100 | 1,9 s | 0 | 0 ms |
| `/proyectos/vzh/` | 100 | 100 | 100 | 100 | 1,6 s | 0 | 0 ms |
| `/servicios/produccion-de-contenidos/` | 100 | 100 | 100 | 100 | 1,7 s | 0 | 0 ms |

## Accesibilidad (axe-core, reglas WCAG 2.0/2.1/2.2 A y AA)
12 páginas (home, portfolio, 4 casos, servicios, contenidos, nosotros, contacto, privacidad, 404): **0 violaciones** automáticas. Las pruebas automáticas cubren ~30–40 % de WCAG; falta revisión manual con lector de pantalla (NVDA/VoiceOver).

## Interacción (Playwright) — todo PASS
Filtros con conteo correcto y `aria-pressed` · búsqueda · estado vacío visible/oculto · reset · filtro por URL `?cat=` · lightbox (abre, ← →, Esc, devuelve el foco) · validación de formulario y foco en el primer error · filtro de galería de contenidos · menú móvil (abre, Esc) · sin scroll horizontal a 360/390/768/1024/1440 px en 7 páginas · ningún cliente excluido en el HTML.

## No verificado
- **Enlaces externos** (sitios de clientes e Instagram): el entorno de trabajo no tiene salida a esos dominios. Los de la presentación 2023 (bcg-ae.com.ar, bodegasetchart.com, bodegaseptima.com) podrían estar caídos: revisar antes de publicar.
- **Envío real del formulario**: no hay endpoint configurado; se probó solo el modo correo.
- Safari/iOS y Firefox reales (solo Chromium).
- Core Web Vitals de campo (requiere el sitio publicado).
