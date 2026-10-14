export const SITE = {
  name: 'Digital Tie',
  wordmark: 'DIGITAL TIE',
  legalName: 'Digital Tie',
  tagline: 'La creatividad también tiene método.',
  secondary: 'Corporate mindset. Creative execution. Digital growth.',
  description:
    'Digital Tie es una agencia y consultora de marketing digital con más de diez años en el mercado. Estrategia, branding, sitios web, e-commerce y producción integral de contenidos.',
  locale: 'es_AR',
  lang: 'es-AR',
  // A confirmar antes de publicar: correo comercial, WhatsApp y redes verificadas.
  email: import.meta.env.PUBLIC_CONTACT_EMAIL || 'ahourcade@digitaltie.net',
  whatsapp: import.meta.env.PUBLIC_WHATSAPP || '5491131190914',
  whatsappMessage: 'Te contacto desde el sitio web',
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT || '',
  gtmId: import.meta.env.PUBLIC_GTM_ID || '',
  // Redes de Digital Tie: completar solo con perfiles verificados.
  social: [] as { label: string; url: string }[],
  areaServed: ['Argentina', 'Latinoamérica'],
};

export const NAV = [
  { label: 'Proyectos', href: '/proyectos/' },
  { label: 'Servicios', href: '/servicios/' },
  { label: 'Contenidos', href: '/servicios/produccion-de-contenidos/' },
  { label: 'Nosotros', href: '/nosotros/' },
];

export const METHOD = [
  { n: '01', title: 'Entender', text: 'Negocio, objetivos, audiencias y punto de partida. Primero preguntamos; después proponemos.' },
  { n: '02', title: 'Diseñar', text: 'Estrategia, concepto y sistema: qué decir, cómo se ve y cómo funciona.' },
  { n: '03', title: 'Producir e implementar', text: 'Desarrollo, filmación, edición, publicación. El mismo equipo que pensó, ejecuta.' },
  { n: '04', title: 'Medir y optimizar', text: 'Revisamos qué funcionó y qué no, y lo llevamos a la próxima iteración.' },
];
