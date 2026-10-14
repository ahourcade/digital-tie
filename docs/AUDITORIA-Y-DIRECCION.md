# Digital Tie — Web 2026 · Auditoría y dirección creativa

## 1. Materiales recibidos

| Lote | Contenido | Estado |
|---|---|---|
| Brief maestro | `PROMPT_MAESTRO_CLAUDE_DIGITAL_TIE_WEB_2026.md` | Aplicado completo |
| ZIP V2 | 76 imágenes (capturas de sitios, 21 capturas de IG, perfiles, logos, piezas de branding) + textos de 23 casos | Usado como banco de contenidos. No se reutilizó diseño ni código |
| Paquete complementario | `Portfolio Branding 2024.pptx`, `Presentación 2023.pptx`, `PROATV_manual.pdf`, logos VZH 2022, referencias de identidad Digital Tie | Auditado e incorporado |

Inventario detallado archivo por archivo (dimensiones, peso, calidad, uso, origen): `docs/assets-manifest.md` (se regenera con `python3 scripts/assets-manifest.py`).

### Hallazgos clave
- **VZH:** el `vzh-logo.png` del V2 tiene bordes serruchados (alias) → descartado. Se usan `LOGO NUEVO VZH 2022.GIF` (convertido a PNG sin escalar, 729×312, versión oscura) y `Logo blanco png.png` (200×74, versión blanca). La versión blanca no se agranda: si hace falta mayor tamaño, pedir vector.
- **Presentaciones:** se extrajeron los originales embebidos, de mayor resolución que los del V2 (CYT 1229×2048, Reforestal 2048 px, Virtuo/Minga 2048 px, Kilca 2048 px, BCG 1713×2048, Steel Plastic 1249×2048, TK Hockey 1080×1080). Reemplazan a los recortes del V2.
- **Presentación 2023** documenta autoría explícita («Diseño y desarrollo…») de: BCG, Steel Plastic, CYT, Chivas (promo + email), Fernet Branca (micrositio), Bodegas Etchart/Cafayate (sitio + Rutas de Cafayate), Bicoco (landing), Bodega Séptima, Sere Baby, Andreani (RSVP + app QR), Nutricia (app), Beefeater/HSBC/Jameson (display con pixel), TK Hockey (FB Ads), emails de Jameson, Absolut y Chivas. Se sumaron al **Archivo** del portfolio con el texto exacto de las diapositivas.
- **Excluidos y verificados:** la presentación 2023 incluye Vanlon, MDV Proyectos (Mady), Bambar, La Causa Nikkei, QBE y Glassup → **no aparecen** en el sitio. El build falla si alguno se agrega por error (guardia en `src/data/projects.ts`). También se descartaron `food-photo.webp` (fotografía gastronómica que podría corresponder a Bambar: se excluyó por precaución) y `exiline.webp` / `social-design.webp` (sin cliente ni alcance documentados con claridad).
- **PRO ATV:** el manual no indica autoría. El caso presenta el sistema de submarcas con páginas del manual como **material de referencia** y atribuye a Digital Tie solo la comunicación y los contenidos.
- **Homer & Co:** `ig-09` e `ig-10` tienen el mismo copy y las mismas métricas → se presentan como dos fotogramas del mismo reel.
- **Métricas:** se transcribieron a mano desde cada captura (Me gusta y comentarios). Donde no se leían con certeza (comentarios de `proenergy-13`) se omitieron. Las fechas de captura no están registradas.
- **Datos de la propia agencia en las presentaciones** (no usados, para decidir): «Más de 500 proyectos trabajados» y «Trabajamos para Latam, EMEA y EEUU» (2023); teléfono +54 11 3119-0914 y cargo de Andrés Hourcade (co-fundador, Business Development Manager). No se publicaron sin confirmación.

### Faltantes
- Logo maestro vectorial de Digital Tie → se creó **propuesta SVG** (pendiente de aprobación).
- Vector de VZH (solo hace falta para usos grandes en blanco).
- Recetario IVESS: la captura completa es de 480 px de ancho (se muestra a tamaño real; para lectura cómoda conviene una captura a 1440 px).
- Redes sociales verificadas de Digital Tie, WhatsApp comercial y endpoint de formularios.
- Fecha de cada captura de Instagram (recomendado para el pie de métricas).

## 2. Benchmark (principios, no composiciones)

| Referente | Qué tomamos | Qué evitamos |
|---|---|---|
| **Work & Co** | Propuesta de valor en una línea, jerarquía tipográfica clara, casos como prueba principal | Índices densos y navegación alternativa que exige aprender el sitio |
| **Instrument** | Filtros de trabajo por disciplina, servicios explicados en tres o cuatro bloques, CTA directos («Start a project») | Muros de logos y premios (no aplican y no queremos insinuar alianzas) |
| **AKQA** | Storytelling por caso, cards con cliente + proyecto + bajada | Hero en carrusel con video automático (pesado y con poco control del usuario) |
| **BASIC/DEPT** | Imágenes grandes del trabajo real, nombre del cliente en negrita y párrafo corto, cierre comercial claro | Reel en loop y elementos de arrastre decorativos |

## 3. Dirección elegida: «Documento de trabajo editorial»

**Idea:** la tensión *estructura + creatividad* llevada a la interfaz. El sitio se lee como el documento de una consultora (índices numerados, figuras con epígrafe, fichas técnicas, filetes finos) que contiene trabajo creativo real a gran tamaño.

- **Titular de home:** «La creatividad también tiene método.» Se evaluaron «Pensamos como consultora. Producimos como estudio.» (queda como bajada) y «Estrategia que ordena. Creatividad que conecta.» (correcta pero más genérica). Se eligió la original porque resume el diferencial en cinco palabras y es propia.
- **Firma gráfica:** el **nudo** de la corbata (trapecio azul) es el único ornamento. Funciona como punto final de titulares, marcador de navegación activa y viñeta. Nunca un ícono grande.
- **Hero:** grilla de 12 columnas visible en filetes que se dibujan al cargar (estructura) + «hoja de contactos» con trabajos reales numerados como figuras (creatividad). Sin video, sin carrusel automático.
- **Portfolio en «placas»:** cada trabajo sobre un fondo neutro, contenido sin recorte ni ampliación por encima de su resolución real. Las capturas largas se recorren dentro de un marco de navegador con scroll y se amplían en lightbox.
- **Contenidos:** página propia con hero oscuro, proceso en 8 etapas, formatos, galería filtrable de 24 piezas con métricas transcriptas y un único dato destacado (5.055 Me gusta, atribuido a su publicación).
- **Tipografía:** solo Manrope variable (400–800). Titulares 700–780 con tracking negativo; etiquetas 700 en mayúsculas espaciadas.
- **Color:** proporción 60 claro (#F8FAFC/#FFF) · 25 grafito (#0C1525) · 10 neutros · 5 azul (#0066FF). En fondos oscuros el azul de texto sube a #5C9DFF para cumplir AA.
