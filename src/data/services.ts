export interface Service {
  slug: string;
  n: string;
  name: string;
  short: string;
  description: string;
  includes: string[];
  category?: string; // filtro de proyectos relacionado
  href?: string;
}

export const SERVICES: Service[] = [
  {
    slug: 'estrategia',
    n: '01',
    name: 'Estrategia digital y consultoría',
    short: 'Ordenar el punto de partida y decidir dónde invertir.',
    description:
      'Diagnóstico del ecosistema digital, definición de objetivos, audiencias y prioridades. Armamos un plan que se puede ejecutar y medir, no un documento para archivar.',
    includes: ['Diagnóstico y auditoría digital', 'Plan de marketing y canales', 'Arquitectura de contenidos y SEO', 'Acompañamiento y seguimiento'],
  },
  {
    slug: 'branding',
    n: '02',
    name: 'Branding y diseño',
    short: 'Identidades y sistemas visuales con criterio.',
    description:
      'Diseñamos identidades, sistemas gráficos y piezas que se sostienen en el tiempo y funcionan en cada canal: del logotipo al feed.',
    includes: ['Identidad visual y logotipo', 'Sistema gráfico y manual de marca', 'Dirección de arte', 'Piezas para digital e impresión'],
    category: 'branding',
  },
  {
    slug: 'web',
    n: '03',
    name: 'Sitios web y e-commerce',
    short: 'Webs institucionales, landings y tiendas online.',
    description:
      'Diseño UX/UI y desarrollo de sitios que ordenan una oferta, comunican con claridad y facilitan el contacto o la compra. Trabajamos sobre WordPress, WooCommerce y desarrollos a medida.',
    includes: ['Arquitectura de información y UX', 'Diseño de interfaz', 'Desarrollo WordPress / WooCommerce', 'Landings para campañas'],
    category: 'web',
  },
  {
    slug: 'produccion-de-contenidos',
    n: '04',
    name: 'Producción integral de contenidos',
    short: 'De la idea al publicado: guion, filmación, edición y publicación.',
    description:
      'Nos hacemos cargo de toda la producción: estrategia editorial, guiones, rodaje, edición, publicación y análisis. Un solo equipo coordina el flujo completo.',
    includes: ['Estrategia y calendario editorial', 'Guion y producción audiovisual', 'Edición y adaptación de formatos', 'Publicación y análisis'],
    category: 'contenidos',
    href: '/servicios/produccion-de-contenidos/',
  },
  {
    slug: 'performance',
    n: '05',
    name: 'Campañas y performance',
    short: 'Pauta en Meta y Google con piezas pensadas para cada objetivo.',
    description:
      'Planificación, piezas y gestión de campañas pagas en Meta Ads y Google Ads, con seguimiento de resultados y ajustes continuos. También automatización de mensajes y email marketing.',
    includes: ['Meta Ads y Google Ads', 'Piezas y anuncios por objetivo', 'Email marketing', 'Automatizaciones y chatbots'],
    category: 'campanas',
  },
];
