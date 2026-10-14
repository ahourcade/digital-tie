/**
 * PORTFOLIO — modelo de datos.
 * Para agregar un caso: copiar las imágenes a src/assets/work/<slug>/ y sumar
 * un objeto a PROJECTS. Las páginas, filtros, buscador y sitemap se generan solos.
 *
 * Reglas editoriales (no negociables):
 *  - Solo trabajos reales, con material original.
 *  - Sin métricas, objetivos, testimonios ni resultados que no estén documentados.
 *  - Excluidos: Mady Proyectos, Vanlon, Bambar, La Causa Nikkei, Glassup y QBE.
 */

export type Category = 'branding' | 'web' | 'ecommerce' | 'contenidos' | 'campanas';

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'branding', label: 'Branding' },
  { key: 'web', label: 'Web' },
  { key: 'ecommerce', label: 'E-commerce' },
  { key: 'contenidos', label: 'Producción de contenidos' },
  { key: 'campanas', label: 'Campañas / Ads' },
];
export const categoryLabel = (k: Category) => CATEGORIES.find((c) => c.key === k)?.label ?? k;

export interface GalleryItem {
  kind: 'web' | 'image' | 'social' | 'profile';
  src: string;
  alt: string;
  caption?: string;
  postId?: string; // si es una publicación de POSTS (muestra métricas transcriptas)
}

export interface SubBrand {
  name: string;
  focus: string;
  text: string;
  color: string; // color propio de la submarca (de sus piezas originales)
  brandImage: string;
  profile?: string;
  instagram?: string;
  posts?: string[]; // ids de POSTS
  pieces?: { src: string; alt: string }[];
}

export interface Project {
  slug: string;
  client: string;
  headline: string; // 1 línea: qué hicimos
  summary: string; // 1–2 oraciones
  industry: string;
  role: string; // rol real de Digital Tie
  categories: Category[];
  cover: string;
  coverAlt: string;
  plate: 'mist' | 'ink' | 'white' | 'sand';
  coverFit?: 'cover' | 'contain';
  logo?: { src: string; onDark?: boolean; alt: string; white?: string };
  logoPending?: boolean;
  link?: { label: string; url: string };
  social?: { label: string; url: string }[];
  context: string[];
  deliverables: string[];
  gallery: GalleryItem[];
  subbrands?: SubBrand[];
  featured?: number; // orden en home
  archive?: boolean; // trabajo histórico con documentación mínima
  seoDescription?: string;
}

export const PROJECTS: Project[] = [
  /* ───────────────────────── VZH ───────────────────────── */
  {
    slug: 'vzh',
    client: 'VZH',
    headline: 'Sitio web y producción de contenidos para Instagram',
    summary:
      'Diseñamos y desarrollamos la web de VZH para organizar sus soluciones de baterías y energía. También producimos contenidos que muestran sus productos y su equipo.',
    industry: 'Energía e industria',
    role: 'Diseño y desarrollo web · Estrategia y producción de contenidos',
    categories: ['web', 'contenidos'],
    cover: 'vzh/cover.webp',
    coverAlt: 'Home del sitio de VZH: soluciones en baterías industriales y energía renovable para empresas',
    plate: 'ink',
    coverFit: 'cover',
    logo: { src: 'vzh/logo-dark.png', alt: 'Logo de VZH', white: 'vzh/logo-white.png' },
    link: { label: 'vzh.com.ar', url: 'https://vzh.com.ar/' },
    social: [{ label: 'Instagram @baterias.vzh', url: 'https://www.instagram.com/baterias.vzh/' }],
    context: [
      'VZH comercializa baterías industriales, baterías de litio, baterías de arranque y soluciones energéticas para empresas. La oferta es amplia y técnica: el sitio tenía que ordenarla para que cada cliente encuentre rápido su tipo de batería.',
      'En redes, el desafío era otro: mostrar a la empresa desde adentro. Producimos piezas protagonizadas por su equipo y sus productos, con un tono directo y cercano.',
    ],
    deliverables: [
      'Diseño y desarrollo del sitio institucional',
      'Navegación por línea de producto y buscador',
      'Estrategia de contenidos para Instagram',
      'Guion, filmación y edición de reels',
      'Carruseles y publicaciones del equipo',
    ],
    gallery: [
      { kind: 'web', src: 'vzh/home-full.png', alt: 'Captura completa de la home de vzh.com.ar', caption: 'Home completa de vzh.com.ar' },
      { kind: 'social', src: 'vzh/ig-00.jpg', alt: 'Reel de VZH: ¿Listo para salir a la ruta?', postId: 'vzh-00' },
      { kind: 'social', src: 'vzh/ig-03.jpg', alt: 'Carrusel de VZH: Ellos son la nueva generación VZH', postId: 'vzh-03' },
      { kind: 'social', src: 'vzh/ig-01.jpg', alt: 'Reel de VZH: creamos confianza', postId: 'vzh-01' },
      { kind: 'social', src: 'vzh/ig-04.jpg', alt: 'Reel de VZH: En VZH no pagamos la luz', postId: 'vzh-04' },
      { kind: 'social', src: 'vzh/ig-02.jpg', alt: 'Reel de VZH: movemos el país', postId: 'vzh-02' },
      { kind: 'social', src: 'vzh/ig-08.jpg', alt: 'Reel de VZH con integrantes del equipo', postId: 'vzh-08' },
    ],
    featured: 1,
    seoDescription: 'Caso VZH: diseño y desarrollo del sitio web y producción de contenidos para Instagram de una empresa de baterías industriales y soluciones energéticas.',
  },

  /* ───────────────────────── PRO ATV ───────────────────────── */
  {
    slug: 'pro-atv',
    client: 'PRO ATV Motorsports',
    headline: 'Contenidos y comunicación para un ecosistema de tres marcas',
    summary:
      'Producimos la comunicación en redes de PRO ONE, PRO ENERGY Home y PRO KIDS: tres públicos distintos, cada uno con su propio lenguaje, dentro del sistema de marcas de PRO ATV.',
    industry: 'Movilidad, energía y hogar',
    role: 'Estrategia y producción de contenidos · Piezas de comunicación',
    categories: ['contenidos'],
    cover: 'pro-atv/manual-16.webp',
    coverAlt: 'Sistema de marcas PRO ATV Motorsports con PRO ENERGY Home, PRO ONE y PRO KIDS',
    plate: 'white',
    coverFit: 'contain',
    context: [
      'PRO ATV Motorsports reúne submarcas con públicos muy diferentes: vehículos para chicos, motos y cuatriciclos, y equipamiento de energía para el hogar. Cada una tiene logotipo y color propios dentro de un mismo sistema, definido en el manual de identidad de la marca.',
      'Trabajamos la comunicación de cada submarca por separado, respetando su identidad, con piezas de producto, contenidos explicativos y situaciones cotidianas filmadas en exteriores.',
    ],
    deliverables: [
      'Estrategia de contenidos por submarca',
      'Guion, filmación y edición de reels',
      'Carruseles y piezas de producto',
      'Adaptaciones para campañas y lanzamientos',
    ],
    gallery: [
      { kind: 'image', src: 'pro-atv/manual-01.webp', alt: 'Portada del manual de identidad PRO ATV Motorsports', caption: 'Manual de identidad PRO ATV — portada' },
      { kind: 'image', src: 'pro-atv/manual-16.webp', alt: 'Página de submarcas del manual: PRO ENERGY Home, PRO ONE y PRO KIDS', caption: 'Manual — sistema de submarcas' },
      { kind: 'image', src: 'pro-atv/manual-17.webp', alt: 'Colores de cada submarca: verde, rojo y amarillo junto al azul de PRO ATV', caption: 'Manual — color por submarca' },
      { kind: 'image', src: 'pro-atv/manual-38.webp', alt: 'Paletas cromáticas de las submarcas', caption: 'Manual — paletas cromáticas' },
      { kind: 'image', src: 'pro-atv/manual-43.webp', alt: 'Marca aplicada en Instagram', caption: 'Manual — marca aplicada en redes' },
      { kind: 'image', src: 'pro-atv/manual-44.webp', alt: 'Publicaciones de ejemplo con la marca aplicada', caption: 'Manual — publicaciones de ejemplo' },
    ],
    subbrands: [
      {
        name: 'PRO ONE',
        focus: 'Motos y cuatriciclos',
        text: 'Piezas de producto y contenidos que presentan los modelos, cómo se fabrican y cómo se usan.',
        color: '#e3262f',
        brandImage: 'pro-atv/manual-24.webp',
        profile: 'pro-atv/proone-profile.png',
        instagram: 'https://www.instagram.com/proonemotos.ar/',
        posts: ['proone-32', 'proone-35', 'proone-31', 'proone-37', 'proone-33', 'proone-34', 'proone-36'],
      },
      {
        name: 'PRO ENERGY Home',
        focus: 'Energía y equipamiento para el hogar',
        text: 'Contenidos que explican aplicaciones concretas: energía donde no llega la red, estaciones de carga y productos para la casa.',
        color: '#2bb34a',
        brandImage: 'pro-atv/manual-19.webp',
        profile: 'pro-atv/proenergy-profile.png',
        instagram: 'https://www.instagram.com/proenergyhome.ar/',
        posts: ['proenergy-24', 'proenergy-22', 'proenergy-25', 'proenergy-23', 'proenergy-21', 'proenergy-12', 'proenergy-13', 'proenergy-14'],
        pieces: [
          { src: 'pro-atv/proenergy-post-1.png', alt: 'Publicación de PRO ENERGY Home: La solución si vivís en una zona sin conexión' },
          { src: 'pro-atv/proenergy-post-2.png', alt: 'Publicación de PRO ENERGY Home: Novedad silla gerencial' },
          { src: 'pro-atv/proenergy-post-3.png', alt: 'Publicación de PRO ENERGY Home: La silla gamer que buscás' },
        ],
      },
      {
        name: 'PRO KIDS',
        focus: 'Vehículos a batería para chicos',
        text: 'Comunicación en tono cercano: recomendaciones de compra, guías por edad y escenas familiares filmadas en exteriores.',
        color: '#f5c400',
        brandImage: 'pro-atv/manual-29.webp',
        profile: 'pro-atv/prokids-profile.png',
        instagram: 'https://www.instagram.com/prokids.ar/',
        posts: ['prokids-20', 'prokids-18', 'prokids-15', 'prokids-17', 'prokids-19', 'prokids-16'],
      },
    ],
    featured: 2,
    seoDescription: 'Caso PRO ATV Motorsports: estrategia y producción de contenidos para PRO ONE, PRO ENERGY Home y PRO KIDS.',
  },

  /* ───────────────────────── HOMER & CO ───────────────────────── */
  {
    slug: 'homer-and-co',
    client: 'Homer & Co',
    headline: 'Landing de domótica y contenidos para Instagram',
    summary:
      'Para Homer & Co desarrollamos una landing de domótica y contenidos que presentan soluciones y proyectos reales: automatización, ambientes y salas de cine en casa.',
    industry: 'Hogar inteligente',
    role: 'Diseño y desarrollo de landing · Producción de contenidos',
    categories: ['web', 'contenidos'],
    cover: 'homer-and-co/cover.webp',
    coverAlt: 'Landing de domótica de Homer & Co: Tu hogar, más inteligente',
    plate: 'mist',
    coverFit: 'contain',
    logo: { src: 'homer-and-co/logo.png', alt: 'Logo de Homer & Co' },
    social: [{ label: 'Instagram @homerandco', url: 'https://www.instagram.com/homerandco/' }],
    context: [
      'Homer & Co diseña e instala soluciones de automatización residencial y salas de cine en casa. El alcance de nuestro trabajo web fue una landing específica de domótica, no el sitio comercial completo.',
      'La landing presenta las soluciones por necesidad (iluminación, climatización, seguridad, cine en casa) y lleva al contacto. En redes producimos piezas que muestran proyectos terminados, ambientes y salas de cine residenciales.',
    ],
    deliverables: [
      'Diseño y desarrollo de la landing de domótica',
      'Organización de soluciones y beneficios',
      'Guion, filmación y edición de reels',
      'Carruseles de proyectos y ambientes',
    ],
    gallery: [
      { kind: 'web', src: 'homer-and-co/landing-full.png', alt: 'Captura completa de la landing de domótica de Homer & Co', caption: 'Landing de domótica, captura completa' },
      { kind: 'social', src: 'homer-and-co/ig-07.jpg', alt: 'Carrusel de Homer & Co: Una sala de cine. En tu casa.', postId: 'homer-07' },
      { kind: 'social', src: 'homer-and-co/ig-05.jpg', alt: 'Carrusel de Homer & Co: Una sala que no se parece a ninguna otra', postId: 'homer-05' },
      { kind: 'social', src: 'homer-and-co/ig-09.jpg', alt: 'Reel de Homer & Co: Hace 30 años', postId: 'homer-09' },
      { kind: 'social', src: 'homer-and-co/ig-11.jpg', alt: 'Reel de Homer & Co filmado en una sala de cine residencial', postId: 'homer-11' },
      { kind: 'social', src: 'homer-and-co/ig-06.jpg', alt: 'Reel de Homer & Co mostrando un proyecto de sala', postId: 'homer-06' },
    ],
    featured: 3,
    seoDescription: 'Caso Homer & Co: diseño y desarrollo de landing de domótica y producción de contenidos para Instagram.',
  },

  /* ───────────────────────── RECETARIO IVESS ───────────────────────── */
  {
    slug: 'recetario-ivess',
    client: 'Recetario IVESS',
    headline: 'Recetario web de tragos con buscador y grilla fotográfica',
    summary:
      'Diseñamos y desarrollamos el recetario de IVESS: una interfaz visual para descubrir tragos clásicos y de autor, con fichas por receta y buscador.',
    industry: 'Alimentos y bebidas',
    role: 'Diseño y desarrollo web',
    categories: ['web'],
    cover: 'recetario-ivess/cover.webp',
    coverAlt: 'Home del Recetario IVESS con buscador y grilla de tragos',
    plate: 'mist',
    coverFit: 'contain',
    logo: { src: 'recetario-ivess/logo.png', alt: 'Logo de IVESS 60 años' },
    link: { label: 'recetarioivess.com.ar', url: 'https://recetarioivess.com.ar/' },
    context: [
      'El recetario reúne preparaciones con soda y agua IVESS en una grilla fotográfica: cada foto lleva a una ficha con la receta. La fotografía es protagonista y el buscador permite ir directo a un trago.',
      'El diseño prioriza la exploración visual y una lectura simple en el celular, donde se consulta la receta mientras se prepara.',
    ],
    deliverables: ['Diseño de interfaz del recetario', 'Fichas de receta', 'Buscador y organización del catálogo', 'Desarrollo web responsive'],
    gallery: [{ kind: 'web', src: 'recetario-ivess/home-full.png', alt: 'Captura completa del Recetario IVESS', caption: 'Home completa del recetario' }],
    featured: 4,
    seoDescription: 'Caso Recetario IVESS: diseño y desarrollo de un recetario web de tragos con buscador y fichas de receta.',
  },

  /* ───────────────────────── POLISTORE ───────────────────────── */
  {
    slug: 'polistore',
    client: 'PoliStore',
    headline: 'E-commerce de materiales para la construcción',
    summary:
      'Diseñamos y desarrollamos la tienda online de PoliStore: catálogo por categorías, productos destacados, ofertas y accesos para mayoristas.',
    industry: 'Construcción y materiales',
    role: 'Diseño y desarrollo e-commerce',
    categories: ['ecommerce', 'web'],
    cover: 'polistore/cover.webp',
    coverAlt: 'Home de la tienda online PoliStore con banner de medios de pago',
    plate: 'mist',
    coverFit: 'contain',
    logo: { src: 'polistore/logo.png', alt: 'Logo de PoliStore' },
    link: { label: 'polistore.com.ar', url: 'https://polistore.com.ar/' },
    context: [
      'PoliStore vende policarbonatos, chapas, perfiles, revestimientos y otros materiales. El catálogo es extenso y técnico, con compradores minoristas y mayoristas.',
      'La tienda organiza las familias de producto desde la home, destaca medios de pago y ofertas, y abre un canal específico para mayoristas y distribuidores.',
    ],
    deliverables: ['Arquitectura de categorías y catálogo', 'Diseño de la tienda online', 'Desarrollo e-commerce', 'Secciones de destacados, ofertas y mayoristas'],
    gallery: [{ kind: 'web', src: 'polistore/home-full.png', alt: 'Captura completa de la home de PoliStore', caption: 'Home completa de polistore.com.ar' }],
    featured: 5,
    seoDescription: 'Caso PoliStore: diseño y desarrollo de e-commerce de materiales para la construcción.',
  },

  /* ───────────────────────── STARNET ───────────────────────── */
  {
    slug: 'starnet',
    client: 'Starnet',
    headline: 'Sitio de conectividad e instalación de Starlink',
    summary:
      'Diseñamos y desarrollamos el sitio de Starnet, que presenta su servicio de instalación de Starlink y sus soluciones de conectividad, redes y cámaras.',
    industry: 'Tecnología y conectividad',
    role: 'Diseño y desarrollo web',
    categories: ['web'],
    cover: 'starnet/cover.webp',
    coverAlt: 'Home del sitio de Starnet Argentina sobre fondo oscuro',
    plate: 'ink',
    coverFit: 'cover',
    logo: { src: 'starnet/logo.png', onDark: true, alt: 'Logo de Starnet' },
    link: { label: 'starnet.com.ar', url: 'https://starnet.com.ar/' },
    context: [
      'Starnet instala Starlink y ofrece soluciones complementarias: wifi para eventos, cámaras de seguridad, amplificación de señal celular y conectividad para empresas.',
      'El sitio usa una estética oscura y técnica, ordena los servicios en una grilla clara y suma comentarios de clientes y empresas que trabajan con ellos, todo orientado al contacto.',
    ],
    deliverables: ['Diseño visual del sitio', 'Organización de servicios', 'Desarrollo web responsive', 'Secciones de confianza y contacto'],
    gallery: [{ kind: 'web', src: 'starnet/home-full.png', alt: 'Captura completa de la home de Starnet', caption: 'Home completa de starnet.com.ar' }],
    featured: 6,
    seoDescription: 'Caso Starnet: diseño y desarrollo del sitio de una empresa de conectividad e instalación de Starlink.',
  },

  /* ───────────────────────── CYT ───────────────────────── */
  {
    slug: 'cyt-comunicaciones',
    client: 'CYT Comunicaciones',
    headline: 'Rediseño de marca y sitio web B2B',
    summary: 'Identidad visual y rediseño del sitio web para una empresa de soluciones de contact center omnicanal.',
    industry: 'Telecomunicaciones B2B',
    role: 'Rebranding · Diseño web',
    categories: ['branding', 'web'],
    cover: 'cyt-comunicaciones/web.png',
    coverAlt: 'Home del sitio de CYT Comunicaciones: soluciones de contact center omnicanal',
    plate: 'mist',
    coverFit: 'contain',
    context: [
      'CYT Comunicaciones ofrece soluciones de contact center omnicanal y grabación de llamadas para empresas. El trabajo incluyó el rediseño de su identidad y del sitio institucional.',
      'La nueva marca trabaja un isotipo de nodos conectados, una paleta violeta-celeste y un personaje robot que se trasladan a la web.',
    ],
    deliverables: ['Rediseño de identidad visual', 'Versiones y aplicaciones del logotipo', 'Personaje de marca', 'Diseño y desarrollo del sitio web'],
    gallery: [
      { kind: 'image', src: 'cyt-comunicaciones/web.png', alt: 'Home del sitio de CYT Comunicaciones', caption: 'Sitio web: home' },
      { kind: 'image', src: 'cyt-comunicaciones/identity.png', alt: 'Versiones del logotipo de CYT Comunicaciones sobre distintos fondos', caption: 'Identidad: versiones del logotipo' },
      { kind: 'image', src: 'cyt-comunicaciones/mascot.jpg', alt: 'Personaje robot de CYT Comunicaciones saludando', caption: 'Personaje de marca' },
    ],
    featured: 7,
  },

  /* ───────────────────────── STEEL PLASTIC ───────────────────────── */
  {
    slug: 'steel-plastic',
    client: 'Steel Plastic',
    headline: 'Sitio institucional para fabricante de perfiles de PVC',
    summary: 'Diseño y desarrollo del sitio institucional de Steel Plastic, empresa de perfiles y soluciones de PVC.',
    industry: 'Industria y construcción',
    role: 'Diseño y desarrollo web',
    categories: ['web'],
    cover: 'steel-plastic/web-full.png',
    coverAlt: 'Captura del sitio web de Steel Plastic',
    plate: 'mist',
    coverFit: 'contain',
    link: { label: 'steelplastic.com.ar', url: 'https://steelplastic.com.ar/' },
    context: ['Sitio institucional para una empresa fabricante de perfiles, cielorrasos, cortinas y otras soluciones en PVC. Presenta la empresa, sus líneas de producto y las marcas con las que trabaja, con accesos directos a contacto.'],
    deliverables: ['Diseño del sitio institucional', 'Desarrollo web'],
    gallery: [{ kind: 'web', src: 'steel-plastic/web-full.png', alt: 'Captura del sitio de Steel Plastic', caption: 'Captura del sitio (presentación 2023)' }],
  },

  /* ───────────────────────── BRANDING ───────────────────────── */
  {
    slug: 'reforestal',
    client: 'Reforestal',
    headline: 'Identidad para una organización de reforestación nativa',
    summary: 'Diseño de identidad visual para una organización dedicada a la reforestación con especies nativas.',
    industry: 'Ambiente',
    role: 'Identidad visual',
    categories: ['branding'],
    cover: 'reforestal/main.png',
    coverAlt: 'Logotipo de Reforestal en blanco sobre verde',
    plate: 'white',
    coverFit: 'contain',
    context: ['Un logotipo de trazo continuo que dibuja un brote y una hoja dentro de un círculo, acompañado de una tipografía redondeada y un verde oliva como color principal.'],
    deliverables: ['Logotipo e isotipo', 'Versiones de color'],
    gallery: [
      { kind: 'image', src: 'reforestal/main.png', alt: 'Logotipo de Reforestal en blanco sobre verde oliva', caption: 'Logotipo' },
      { kind: 'image', src: 'reforestal/isotipo.png', alt: 'Isotipo de Reforestal en blanco sobre negro', caption: 'Isotipo' },
      { kind: 'image', src: 'reforestal/negativo.png', alt: 'Logotipo de Reforestal en verde sobre negro', caption: 'Versión sobre fondo oscuro' },
    ],
    featured: 8,
  },
  {
    slug: 'not-only-kite',
    client: 'Not Only Kite',
    headline: 'Branding para experiencias de kitesurf en Brasil',
    summary: 'Identidad para una empresa de viajes y experiencias de kitesurf en Brasil.',
    industry: 'Viajes y experiencias',
    role: 'Identidad visual',
    categories: ['branding'],
    cover: 'not-only-kite/main.webp',
    coverAlt: 'Isotipo NOK de Not Only Kite: letras dentro de un círculo con una línea de ola',
    plate: 'white',
    coverFit: 'contain',
    context: ['El isotipo NOK integra la línea del horizonte y el movimiento del agua dentro de un círculo de trazo único.'],
    deliverables: ['Isotipo', 'Identidad visual'],
    gallery: [{ kind: 'image', src: 'not-only-kite/main.webp', alt: 'Isotipo de Not Only Kite', caption: 'Isotipo' }],
  },
  {
    slug: 'susana-flores',
    client: 'Susana Flores',
    headline: 'Identidad para estudio de abogacía',
    summary: 'Sistema de identidad para el estudio de la abogada Susana Flores.',
    industry: 'Servicios profesionales',
    role: 'Identidad visual',
    categories: ['branding'],
    cover: 'susana-flores/main.png',
    coverAlt: 'Logotipo de Susana Flores Abogada con monograma SF',
    plate: 'white',
    coverFit: 'contain',
    context: ['Monograma SF de alto contraste y una tipografía sobria: una marca seria y reconocible para un estudio profesional.'],
    deliverables: ['Monograma y logotipo', 'Identidad visual'],
    gallery: [{ kind: 'image', src: 'susana-flores/main.png', alt: 'Logotipo de Susana Flores Abogada', caption: 'Logotipo' }],
  },
  {
    slug: 'aguila-courier',
    client: 'Águila Courier',
    headline: 'Sistema gráfico para servicios logísticos',
    summary: 'Sistema gráfico de marca para una empresa de servicios logísticos.',
    industry: 'Logística',
    role: 'Identidad visual · Brandbook',
    categories: ['branding'],
    cover: 'aguila-courier/main.png',
    coverAlt: 'Páginas del brandbook de Águila Courier',
    plate: 'mist',
    coverFit: 'contain',
    context: ['El brandbook documenta logotipo, versiones, tipografías, paleta y aplicaciones de la marca.'],
    deliverables: ['Logotipo', 'Brandbook'],
    gallery: [{ kind: 'image', src: 'aguila-courier/main.png', alt: 'Brandbook de Águila Courier', caption: 'Páginas del brandbook' }],
  },
  {
    slug: 'virtuo',
    client: 'Virtuo',
    headline: 'Branding para empresa de reforestación',
    summary: 'Desarrollo de identidad para una empresa de reforestación.',
    industry: 'Ambiente',
    role: 'Identidad visual',
    categories: ['branding'],
    cover: 'virtuo/main.jpg',
    coverAlt: 'Emblema circular de Virtuo con un árbol y el lema Honestum Circuli',
    plate: 'white',
    coverFit: 'contain',
    context: ['Emblema circular con un árbol y el lema «Honestum Circuli», en una paleta de verdes y ocres.'],
    deliverables: ['Emblema', 'Identidad visual'],
    gallery: [{ kind: 'image', src: 'virtuo/main.jpg', alt: 'Emblema de Virtuo', caption: 'Emblema' }],
  },
  {
    slug: 'minga-street-food',
    client: 'Minga Street Food',
    headline: 'Identidad para marca gastronómica',
    summary: 'Identidad visual para una marca de street food.',
    industry: 'Gastronomía',
    role: 'Identidad visual',
    categories: ['branding'],
    cover: 'minga-street-food/main.jpg',
    coverAlt: 'Logotipo de Minga Street Food en blanco sobre verde oscuro',
    plate: 'white',
    coverFit: 'contain',
    context: ['Logotipo con tipografía serif y sello circular «Street Food — Made in Argentina» sobre un verde profundo.'],
    deliverables: ['Logotipo y sello', 'Paleta de color'],
    gallery: [{ kind: 'image', src: 'minga-street-food/main.jpg', alt: 'Logotipo de Minga Street Food', caption: 'Logotipo' }],
  },
  {
    slug: 'kilca',
    client: 'Kilca',
    headline: 'Branding para fabricante de palos de hockey',
    summary: 'Identidad para un fabricante de palos de hockey de Pakistán.',
    industry: 'Deporte',
    role: 'Identidad visual',
    categories: ['branding'],
    cover: 'kilca/main.png',
    coverAlt: 'Logotipo de Kilca con isotipo de palos cruzados y versión en urdu',
    plate: 'white',
    coverFit: 'contain',
    context: ['Logotipo bilingüe —alfabeto latino y urdu— con un isotipo de palos cruzados dentro de un círculo.'],
    deliverables: ['Logotipo bilingüe', 'Isotipo'],
    gallery: [
      { kind: 'image', src: 'kilca/main.png', alt: 'Logotipo de Kilca sobre blanco', caption: 'Logotipo' },
      { kind: 'image', src: 'kilca/negativo.png', alt: 'Logotipo de Kilca en negativo', caption: 'Versión negativa' },
    ],
  },

  /* ───────────────────────── ARCHIVO (presentación 2023) ───────────────────────── */
  {
    slug: 'bcg-architects',
    client: 'BCG Architects',
    headline: 'Sitio institucional para estudio de arquitectura',
    summary: 'Diseño y desarrollo del sitio institucional de un estudio internacional de arquitectura e ingeniería.',
    industry: 'Arquitectura',
    role: 'Diseño y desarrollo web',
    categories: ['web'],
    cover: 'bcg-architects/web-full.png',
    coverAlt: 'Captura del sitio de BCG Architects',
    plate: 'mist',
    coverFit: 'contain',
    link: { label: 'bcg-ae.com.ar', url: 'https://bcg-ae.com.ar/' },
    context: ['Sitio institucional con presentación del estudio y proyectos destacados.'],
    deliverables: ['Diseño web', 'Desarrollo'],
    gallery: [{ kind: 'web', src: 'bcg-architects/web-full.png', alt: 'Captura del sitio de BCG Architects', caption: 'Captura del sitio (presentación 2023)' }],
    archive: true,
  },
  {
    slug: 'tk-hockey',
    client: 'TK Hockey',
    headline: 'Piezas para campañas en Meta Ads',
    summary: 'Desarrollo de piezas para campañas publicitarias digitales.',
    industry: 'Deporte',
    role: 'Publicidad digital',
    categories: ['campanas'],
    cover: 'tk-hockey/ad-1.jpg',
    coverAlt: 'Piezas publicitarias de TK Hockey: Llevá tu juego a otro nivel',
    plate: 'mist',
    coverFit: 'contain',
    context: ['Anuncios para Facebook Ads con fotografía de juego y los mensajes «Llevá tu juego a otro nivel» y «Sé parte de la revolución».'],
    deliverables: ['Piezas para Facebook / Meta Ads'],
    gallery: [
      { kind: 'image', src: 'tk-hockey/ad-1.jpg', alt: 'Anuncio de TK Hockey: Llevá tu juego a otro nivel', caption: 'Anuncio para Facebook Ads' },
      { kind: 'image', src: 'tk-hockey/ad-2.jpg', alt: 'Anuncio de TK Hockey: Sé parte de la revolución', caption: 'Anuncio para Facebook Ads' },
    ],
    archive: true,
  },
  {
    slug: 'chivas',
    client: 'Chivas',
    headline: 'Sitio promocional y email marketing',
    summary: 'Sitio promocional y piezas de email marketing documentadas en la presentación histórica de la agencia.',
    industry: 'Bebidas',
    role: 'Sitio promocional · Email marketing',
    categories: ['web', 'campanas'],
    cover: 'chivas/main.webp',
    coverAlt: 'Sitio promocional de Chivas Regal en una laptop',
    plate: 'mist',
    coverFit: 'contain',
    context: ['Diseño y desarrollo del sitio promocional «Chivas Tasting»: la inscripción a una cata se habilitaba con un código entregado en la compra de whiskies seleccionados. También diseñamos mailings para distintas campañas de la marca.'],
    deliverables: ['Sitio promocional', 'Email marketing'],
    gallery: [{ kind: 'image', src: 'chivas/slide.webp', alt: 'Sitio promocional Chivas Tasting en una laptop', caption: 'Sitio promocional (presentación 2023)' }],
    archive: true,
  },
  {
    slug: 'fernet-branca',
    client: 'Fernet Branca',
    headline: 'Micrositio del Día del Bartender',
    summary: 'Desarrollo de un micrositio promocional asociado al Día del Bartender.',
    industry: 'Bebidas',
    role: 'Diseño y desarrollo de micrositio',
    categories: ['web'],
    cover: 'fernet-branca/main.webp',
    coverAlt: 'Micrositio del Día del Bartender de Fernet Branca',
    plate: 'mist',
    coverFit: 'contain',
    context: ['Micrositio del Día del Bartender para la marca: desde la maquetación hasta el desarrollo responsive, en cada detalle.'],
    deliverables: ['Micrositio promocional'],
    gallery: [{ kind: 'image', src: 'fernet-branca/slide.webp', alt: 'Micrositio Cocktail Homenaje del Día del Bartender', caption: 'Micrositio (presentación 2023)' }],
    archive: true,
  },
  {
    slug: 'jameson',
    client: 'Jameson',
    headline: 'Display y email marketing',
    summary: 'Piezas publicitarias y comunicaciones de email marketing.',
    industry: 'Bebidas',
    role: 'Display · Email marketing',
    categories: ['campanas'],
    cover: 'jameson/main.webp',
    coverAlt: 'Banners y mailing de Jameson',
    plate: 'mist',
    coverFit: 'contain',
    context: ['Anuncios display «Jameson & Beer» con pixel de seguimiento, y campaña de email para el evento de St. Patrick’s: teaser, email de registro con la información del evento y emails posteriores.'],
    deliverables: ['Display', 'Email marketing'],
    gallery: [
      { kind: 'image', src: 'jameson/main.webp', alt: 'Banners display de Jameson en distintos formatos', caption: 'Display' },
      { kind: 'image', src: 'jameson/banner.jpg', alt: 'Banner de Jameson: Jameson & Beer. Why? Taste, that’s why.', caption: 'Banner display' },
    ],
    archive: true,
  },
  {
    slug: 'absolut',
    client: 'Absolut',
    headline: 'Piezas de email marketing',
    summary: 'Diseño de piezas para campañas de email marketing.',
    industry: 'Bebidas',
    role: 'Email marketing',
    categories: ['campanas'],
    cover: 'absolut/main.webp',
    coverAlt: 'Mailing de Absolut en un celular',
    plate: 'mist',
    coverFit: 'contain',
    context: ['Campaña de emailing con objetivos de lanzamiento, compra online e información al cliente.'],
    deliverables: ['Email marketing'],
    gallery: [{ kind: 'image', src: 'absolut/main.webp', alt: 'Mailing de Absolut', caption: 'Pieza original' }],
    archive: true,
  },
  {
    slug: 'nutricia-app',
    client: 'Nutricia Profesional',
    headline: 'App de seguimiento nutricional',
    summary: 'Diseño y desarrollo de una aplicación para Nutricia Profesional, dedicada a profesionales de la salud.',
    industry: 'Salud',
    role: 'Diseño y desarrollo de app',
    categories: ['web'],
    cover: 'nutricia-app/main.webp',
    coverAlt: 'Pantallas de una app de seguimiento nutricional en dos celulares',
    plate: 'mist',
    coverFit: 'contain',
    context: ['Aplicación con herramientas interactivas para el usuario: curvas de crecimiento, guías, vademécum y contenidos multimedia, con resultados clínicos reales.'],
    deliverables: ['Diseño de interfaz', 'Desarrollo de app'],
    gallery: [
      { kind: 'image', src: 'nutricia-app/slide.webp', alt: 'App de Nutricia Profesional en dos celulares', caption: 'App (presentación 2023)' },
    ],
    archive: true,
  },
  {
    slug: 'bodegas-etchart',
    client: 'Bodegas Etchart · Cafayate',
    headline: 'Sitio de la marca y lanzamiento de Rutas de Cafayate',
    summary: 'Diseño y desarrollo del sitio de la marca de vinos Cafayate y de la página de lanzamiento de su línea Rutas de Cafayate.',
    industry: 'Vinos',
    role: 'Diseño y desarrollo web · UX',
    categories: ['web'],
    cover: 'bodegas-etchart/main.webp',
    coverAlt: 'Sitio de Cafayate en una laptop',
    plate: 'mist',
    coverFit: 'cover',
    link: { label: 'bodegasetchart.com', url: 'https://bodegasetchart.com/' },
    context: [
      'Sitio responsive pensado para mostrar los productos y la fauna de Cafayate, tierra de viñedos.',
      'Para la línea Rutas de Cafayate —tres vinos que nacen de tres puntos distintos de la región— diseñamos una página de lanzamiento con un mapa ilustrado e interacción en computadoras y celulares.',
    ],
    deliverables: ['Diseño y desarrollo del sitio', 'Página de lanzamiento de producto', 'Experiencia responsive'],
    gallery: [
      { kind: 'image', src: 'bodegas-etchart/main.webp', alt: 'Sitio de Cafayate en una laptop', caption: 'Sitio de la marca (presentación 2023)' },
      { kind: 'image', src: 'bodegas-etchart/rutas-de-cafayate.webp', alt: 'Página de Rutas de Cafayate con mapa ilustrado', caption: 'Lanzamiento Rutas de Cafayate (presentación 2023)' },
    ],
    archive: true,
  },
  {
    slug: 'bodega-septima',
    client: 'Bodega Séptima',
    headline: 'Sitio para una bodega de Mendoza',
    summary: 'Diseño y desarrollo del sitio de una bodega de Mendoza, con su propuesta de turismo y restaurante.',
    industry: 'Vinos y turismo',
    role: 'Diseño y desarrollo web · UX',
    categories: ['web'],
    cover: 'bodega-septima/main.webp',
    coverAlt: 'Sitio de Bodega Séptima en una laptop: Latiendo en el corazón de Mendoza',
    plate: 'mist',
    coverFit: 'cover',
    link: { label: 'bodegaseptima.com', url: 'http://www.bodegaseptima.com/' },
    context: ['El sitio permite conocer la bodega, su restorán y las opciones de turismo que ofrece, con imágenes y videos de alto impacto.'],
    deliverables: ['Diseño y desarrollo del sitio', 'Contenidos de turismo y gastronomía'],
    gallery: [{ kind: 'image', src: 'bodega-septima/main.webp', alt: 'Sitio de Bodega Séptima', caption: 'Sitio (presentación 2023)' }],
    archive: true,
  },
  {
    slug: 'andreani',
    client: 'Andreani',
    headline: 'Landing RSVP y app de acreditación para un evento',
    summary: 'Solución integral para la inauguración de una planta: registro online, acreditación con QR y gestión de invitados.',
    industry: 'Logística',
    role: 'Desarrollo web y mobile',
    categories: ['web'],
    cover: 'andreani/main.webp',
    coverAlt: 'Landing de registro para la inauguración de la nueva central de Andreani en una tablet',
    plate: 'mist',
    coverFit: 'cover',
    context: ['Para la inauguración de una nueva planta desarrollamos la landing de registro al evento, una app mobile para que las promotoras acreditaran a los invitados con tablets y código QR, y la gestión de la base de inscriptos y ausentes.'],
    deliverables: ['Landing RSVP', 'App mobile de acreditación con QR', 'Gestión de base de inscriptos'],
    gallery: [{ kind: 'image', src: 'andreani/main.webp', alt: 'Landing de registro de Andreani en una tablet', caption: 'Landing RSVP (presentación 2023)' }],
    archive: true,
  },
  {
    slug: 'bicoco',
    client: 'Bicoco',
    headline: 'Landing para una app de realidad aumentada',
    summary: 'Landing page responsive para captar leads de campañas segmentadas en Latinoamérica y Norteamérica.',
    industry: 'Tecnología',
    role: 'Diseño y desarrollo UX',
    categories: ['web', 'campanas'],
    cover: 'bicoco/main.webp',
    coverAlt: 'Landing de Bicoco en una laptop y la app en un celular',
    plate: 'mist',
    coverFit: 'cover',
    context: ['Bicoco desarrolla una app de realidad aumentada. La landing tenía un objetivo concreto: capturar leads de campañas de anuncios segmentadas para Latinoamérica y Norteamérica.'],
    deliverables: ['Diseño y desarrollo de landing', 'Integración con campañas'],
    gallery: [{ kind: 'image', src: 'bicoco/main.webp', alt: 'Landing de Bicoco', caption: 'Landing (presentación 2023)' }],
    archive: true,
  },
  {
    slug: 'sere-baby',
    client: 'Sere Baby',
    headline: 'Sitio de juegos interactivos para chicos',
    summary: 'Desarrollo de un sitio con diez juegos interactivos para chicos, pensado para celulares y tablets.',
    industry: 'Consumo masivo',
    role: 'Diseño y desarrollo UX',
    categories: ['web'],
    cover: 'sere-baby/main.webp',
    coverAlt: 'Sitio de juegos de Sere Baby en una laptop',
    plate: 'mist',
    coverFit: 'cover',
    context: ['Un sitio de entretenimiento con diez juegos interactivos, pensado para usarse en celulares y tablets.'],
    deliverables: ['Diseño UX', 'Desarrollo de 10 juegos interactivos'],
    gallery: [{ kind: 'image', src: 'sere-baby/main.webp', alt: 'Sitio de juegos de Sere Baby', caption: 'Sitio (presentación 2023)' }],
    archive: true,
  },
  {
    slug: 'beefeater',
    client: 'Beefeater',
    headline: 'Campaña display con pixel de seguimiento',
    summary: 'Banners animados para la campaña display «Pimp your Beefeater», con pixel de seguimiento.',
    industry: 'Bebidas',
    role: 'Diseño de piezas display',
    categories: ['campanas'],
    cover: 'beefeater/banner-4.png',
    coverAlt: 'Banner de Beefeater: This is real London dry gin',
    plate: 'mist',
    coverFit: 'contain',
    context: ['Set de banners animados en formatos estándar de display, con seguimiento por pixel.'],
    deliverables: ['Banners animados en 5 formatos', 'Implementación de pixel de seguimiento'],
    gallery: [
      { kind: 'image', src: 'beefeater/banner-5.png', alt: 'Banner 300×600 de Beefeater', caption: '300×600 (primer cuadro de la animación)' },
      { kind: 'image', src: 'beefeater/banner-4.png', alt: 'Banner 300×250 de Beefeater', caption: '300×250' },
      { kind: 'image', src: 'beefeater/banner-1.png', alt: 'Banner 728×90 de Beefeater', caption: '728×90' },
    ],
    archive: true,
  },
];

export const featuredProjects = () =>
  PROJECTS.filter((p) => p.featured).sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99));
export const mainProjects = () => PROJECTS.filter((p) => !p.archive);
export const archiveProjects = () => PROJECTS.filter((p) => p.archive);
export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);

export function relatedProjects(p: Project, n = 3): Project[] {
  return PROJECTS.filter((o) => o.slug !== p.slug && !o.archive)
    .map((o) => ({ o, score: o.categories.filter((c) => p.categories.includes(c)).length + (o.featured ? 0.5 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.o);
}

// Guardia editorial: falla el build si aparece un cliente excluido.
const EXCLUDED = ['mady', 'vanlon', 'bambar', 'la causa nikkei', 'nikkei', 'glassup', 'qbe'];
for (const p of PROJECTS) {
  const hay = `${p.slug} ${p.client}`.toLowerCase();
  if (EXCLUDED.some((x) => hay.includes(x))) throw new Error(`Cliente excluido en portfolio: ${p.client}`);
}
