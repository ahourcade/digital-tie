# Digital Tie — Sitio web 2026

Sitio multipágina de la agencia Digital Tie. Astro 5 + TypeScript, CSS con tokens propios (sin framework de UI), JavaScript mínimo (solo menú móvil, filtros, lightbox y formularios). Todo el portfolio se genera desde un modelo de datos.

## Requisitos
- Node.js 18.20+ (probado con Node 22)
- npm

## Instalación y uso
```bash
npm install
cp .env.example .env      # completar antes de publicar (ver abajo)
npm run dev               # desarrollo en http://localhost:4321
npm run build             # genera /dist (estático, listo para subir)
npm run preview           # sirve /dist localmente
```
La primera compilación procesa ~90 imágenes y puede tardar 1–3 minutos; las siguientes usan caché.

## Estructura
```
src/
  assets/work/<cliente>/   imágenes originales de cada caso (Astro genera WebP responsivos)
  components/              Header, Footer, Logo, ProjectCard, Plate, BrowserFrame, PhoneFrame,
                           Figure, Lightbox, ContactForm, SectionHead, CtaBand, Consent
  data/
    projects.ts            ← PORTFOLIO: un objeto por caso (textos, categorías, imágenes, galería)
    posts.ts               ← capturas de Instagram + métricas transcriptas
    services.ts            ← servicios
    site.ts                ← datos de contacto, navegación, método
    logo-paths.json        ← contornos del wordmark (generado desde Manrope 800)
  layouts/Base.astro       head, SEO, Open Graph, JSON-LD, header/footer
  pages/                   rutas (ver abajo)
  scripts/                 core.ts (menú, reveal, tracking) · analytics.ts (mapa de eventos)
  styles/global.css        design system: tokens, tipografía, botones, utilidades
public/                    favicons, logo SVG, OG por defecto, robots.txt
docs/                      auditoría, inventario de assets, propuesta de logo
scripts/assets-manifest.py regenera docs/assets-manifest.md
```

## Rutas
| Ruta | Contenido |
|---|---|
| `/` | Inicio: hero, posicionamiento, 8 proyectos destacados, servicios, contenidos, método, contacto |
| `/proyectos/` | Portfolio: filtros por disciplina, búsqueda, conteos, estado vacío, archivo (`?cat=` y `?q=` en la URL) |
| `/proyectos/<slug>/` | Ficha de caso (28 casos) |
| `/servicios/` | Cinco servicios con ejemplos |
| `/servicios/produccion-de-contenidos/` | Landing del servicio de contenidos con galería filtrable y formulario propio |
| `/nosotros/` | Historia, método y principios |
| `/contacto/` | Formulario general |
| `/privacidad/` | Privacidad y cookies (texto base a revisar legalmente) |

## Agregar un proyecto
1. Copiar las imágenes a `src/assets/work/<slug>/`.
2. Sumar un objeto a `PROJECTS` en `src/data/projects.ts` (copiar uno existente). Campos clave: `categories`, `cover`, `plate` (fondo), `coverFit` (`contain` para no recortar), `gallery` (`web` = captura larga con scroll; `image`; `social` con `postId`).
3. `featured: n` lo muestra en la home en la posición `n`; `archive: true` lo manda al archivo.
4. Las rutas, filtros, conteos, búsqueda, sitemap y JSON-LD se generan solos.

El build **falla** si se agrega un cliente excluido (Mady, Vanlon, Bambar, La Causa Nikkei, Glassup, QBE).

## Variables de entorno (`.env`)
| Variable | Uso |
|---|---|
| `SITE_URL` | Dominio final (canonical, sitemap, OG). Por defecto `https://digitaltie.net` |
| `PUBLIC_FORM_ENDPOINT` | URL que recibe el formulario por POST JSON (Formspree, Web3Forms, endpoint propio). **Sin esto el formulario no envía:** abre el correo del usuario con la consulta armada y lo dice. |
| `PUBLIC_CONTACT_EMAIL` | Correo comercial (hoy `ahourcade@digitaltie.net`, a confirmar) |
| `PUBLIC_WHATSAPP` | Número para wa.me (vacío = no se muestra) |
| `PUBLIC_GTM_ID` | Google Tag Manager. Vacío = no se carga ningún script de medición ni banner. Con ID, aparece el aviso de cookies y GTM se carga solo si el usuario acepta |

Si cambiás `SITE_URL`, actualizá también la línea `Sitemap:` de `public/robots.txt`.

## Analítica — mapa de eventos
Se envían a `dataLayer` (configurar en GTM → GA4 / Meta Pixel): `cta_contact`, `click_project`, `click_email`, `click_whatsapp`, `click_outbound`, `form_submit_success`, `form_submit_error`, `form_mailto`, `filter_projects`, `lightbox_open`. Detalle en `src/scripts/analytics.ts`. No hay IDs instalados.

## Despliegue
`/dist` es estático: sirve en Netlify, Vercel, Cloudflare Pages o cualquier hosting (subir el contenido de `dist/`). Build command `npm run build`, output `dist`. En hosting Apache/Nginx, configurar `404.html` como página de error.

## SEO técnico incluido
`lang="es-AR"`, title/description únicos, canonical, Open Graph + Twitter (imagen por caso), sitemap automático, robots.txt, JSON-LD (`ProfessionalService`, `WebSite`, `Service`, `CollectionPage`, `CreativeWork`, `BreadcrumbList`, `AboutPage`, `ContactPage`), H1 único por página, URLs limpias. Preparado para sumar `/en/` más adelante (textos centralizados en `src/data`).

## Migración futura a WordPress
El modelo de `projects.ts` mapea directo a un Custom Post Type «Proyecto» con campos ACF (cliente, industria, rol, categorías → taxonomía, galería, enlaces). Las métricas de `posts.ts` serían un repetidor.

## Logo
`public/brand/logo-digital-tie*.svg` y `src/components/Logo.astro` son la **propuesta v1 pendiente de aprobación** (Manrope 800 a contornos, corbata #0066FF en la I de TIE). Para regenerarla con otros parámetros: `docs/logo-propuesta.html` muestra la lámina de validación.
