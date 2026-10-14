/**
 * Capturas originales de publicaciones de Instagram producidas por Digital Tie.
 * Las métricas se transcriben EXACTAMENTE como se ven en cada captura.
 * Son cortes al momento de la captura (fecha no registrada en el archivo):
 * no equivalen a alcance, visualizaciones, conversiones ni resultados agregados.
 */
export type BrandKey = 'vzh' | 'homer' | 'proenergy' | 'prokids' | 'proone';

export interface Post {
  id: string;
  brand: BrandKey;
  src: string; // ruta relativa a src/assets/work/
  format: 'Reel' | 'Carrusel' | 'Publicación';
  hook: string; // texto visible en la pieza
  caption: string; // inicio del copy visible en la captura
  likes?: string;
  comments?: string;
  note?: string;
  project: string; // slug del caso
}

export const BRANDS: Record<BrandKey, { label: string; handle: string; url: string; project: string }> = {
  vzh: { label: 'VZH', handle: '@baterias.vzh', url: 'https://www.instagram.com/baterias.vzh/', project: 'vzh' },
  homer: { label: 'Homer & Co', handle: '@homerandco', url: 'https://www.instagram.com/homerandco/', project: 'homer-and-co' },
  proenergy: { label: 'PRO ENERGY Home', handle: '@proenergyhome.ar', url: 'https://www.instagram.com/proenergyhome.ar/', project: 'pro-atv' },
  prokids: { label: 'PRO KIDS', handle: '@prokids.ar', url: 'https://www.instagram.com/prokids.ar/', project: 'pro-atv' },
  proone: { label: 'PRO ONE', handle: '@proonemotos.ar', url: 'https://www.instagram.com/proonemotos.ar/', project: 'pro-atv' },
};

export const POSTS: Post[] = [
  { id: 'vzh-00', brand: 'vzh', src: 'vzh/ig-00.jpg', format: 'Reel', hook: '¿Listo para salir a la ruta?', caption: '¿Llegando a fin de año con la batería justa…', likes: '5.055', comments: '35', project: 'vzh' },
  { id: 'vzh-01', brand: 'vzh', src: 'vzh/ig-01.jpg', format: 'Reel', hook: 'Creamos confianza', caption: 'Conocé VZH. Somos más que baterías…', likes: '172', comments: '2', project: 'vzh' },
  { id: 'vzh-02', brand: 'vzh', src: 'vzh/ig-02.jpg', format: 'Reel', hook: 'Movemos el país', caption: 'La energía no se improvisa…', likes: '71', comments: '5', project: 'vzh' },
  { id: 'vzh-03', brand: 'vzh', src: 'vzh/ig-03.jpg', format: 'Carrusel', hook: 'Ellos son la nueva generación VZH.', caption: 'Detrás de cada solución hay un equipo…', likes: '109', comments: '5', project: 'vzh' },
  { id: 'vzh-04', brand: 'vzh', src: 'vzh/ig-04.jpg', format: 'Reel', hook: 'En VZH no pagamos la luz', caption: 'En VZH tomamos en serio la eficiencia…', likes: '130', comments: '10', project: 'vzh' },
  { id: 'vzh-08', brand: 'vzh', src: 'vzh/ig-08.jpg', format: 'Reel', hook: 'Equipo VZH', caption: 'En VZH nos enfocamos en ofrecer tecnología…', likes: '105', comments: '7', project: 'vzh' },

  { id: 'homer-05', brand: 'homer', src: 'homer-and-co/ig-05.jpg', format: 'Carrusel', hook: 'Una sala que no se parece a ninguna otra.', caption: 'Hay salas que se diseñan. Y hay salas que se sienten propias…', likes: '10', comments: '1', project: 'homer-and-co' },
  { id: 'homer-06', brand: 'homer', src: 'homer-and-co/ig-06.jpg', format: 'Reel', hook: 'Proyecto de sala residencial', caption: 'Cada proyecto es único. Este empezó como…', likes: '22', comments: '6', project: 'homer-and-co' },
  { id: 'homer-07', brand: 'homer', src: 'homer-and-co/ig-07.jpg', format: 'Carrusel', hook: 'Una sala de cine. En tu casa.', caption: 'Cada detalle fue elegido. Cada rincón diseñado para que no quieras irte…', likes: '19', comments: '3', project: 'homer-and-co' },
  { id: 'homer-09', brand: 'homer', src: 'homer-and-co/ig-09.jpg', format: 'Reel', hook: 'Hace 30 años…', caption: 'En Homer trabajamos de principio a fin, sin…', likes: '33', comments: '12', project: 'homer-and-co' },
  { id: 'homer-10', brand: 'homer', src: 'homer-and-co/ig-10.jpg', format: 'Reel', hook: '…en tecnología', caption: 'En Homer trabajamos de principio a fin, sin…', likes: '33', comments: '12', note: 'Otro fotograma del mismo reel (mismo copy y métricas).', project: 'homer-and-co' },
  { id: 'homer-11', brand: 'homer', src: 'homer-and-co/ig-11.jpg', format: 'Reel', hook: 'El único control', caption: 'Te damos la bienvenida al único control que…', likes: '37', comments: '8', project: 'homer-and-co' },

  { id: 'proenergy-12', brand: 'proenergy', src: 'pro-atv/ig-proenergy-12.jpg', format: 'Reel', hook: 'Renovar el piso', caption: 'Chau obra, hola piso nuevo!…', likes: '150', comments: '8', project: 'pro-atv' },
  { id: 'proenergy-13', brand: 'proenergy', src: 'pro-atv/ig-proenergy-13.jpg', format: 'Reel', hook: 'Energía en zona rural', caption: '¿Vivís en una zona donde la luz no llega o se…', likes: '172', project: 'pro-atv' },
  { id: 'proenergy-14', brand: 'proenergy', src: 'pro-atv/ig-proenergy-14.jpg', format: 'Reel', hook: 'Con esta estación', caption: 'Tus dispositivos, siempre con carga…', likes: '135', comments: '38', project: 'pro-atv' },

  { id: 'prokids-15', brand: 'prokids', src: 'pro-atv/ig-prokids-15.jpg', format: 'Carrusel', hook: 'Elegí la bici adecuada', caption: 'Elegir bien la bici eléctrica hace la diferencia.', likes: '116', comments: '51', project: 'pro-atv' },
  { id: 'prokids-16', brand: 'prokids', src: 'pro-atv/ig-prokids-16.jpg', format: 'Reel', hook: 'Para qué pagar el gym si mi hijo tiene una Toyota', caption: 'Entrenamiento de cardio nivel: Mamá de un…', likes: '71', comments: '2', project: 'pro-atv' },
  { id: 'prokids-17', brand: 'prokids', src: 'pro-atv/ig-prokids-17.jpg', format: 'Reel', hook: 'La bici eléctrica ideal', caption: '¿Sabés cuál es la bici eléctrica ideal para tu…', likes: '104', comments: '63', project: 'pro-atv' },
  { id: 'prokids-18', brand: 'prokids', src: 'pro-atv/ig-prokids-18.jpg', format: 'Reel', hook: 'Hilux', caption: 'Esta navidad va a ser épica con la Toyota…', likes: '360', comments: '71', project: 'pro-atv' },
  { id: 'prokids-19', brand: 'prokids', src: 'pro-atv/ig-prokids-19.jpg', format: 'Reel', hook: '«Hay que mantener la plata en movimiento»', caption: 'Me dijeron que ponga la plata en movimiento…', likes: '89', comments: '23', project: 'pro-atv' },
  { id: 'prokids-20', brand: 'prokids', src: 'pro-atv/ig-prokids-20.jpg', format: 'Reel', hook: 'Su primera moto', caption: 'Esta no es una bici común. Es su próxima…', likes: '372', comments: '56', project: 'pro-atv' },
  // Lote 2 (14/10/2026) — capturas enviadas por Digital Tie
  { id: 'proenergy-24', brand: 'proenergy', src: 'pro-atv/ig-proenergy-24.jpg', format: 'Reel', hook: 'Sorteo Día del Padre: ganá una silla gamer', caption: 'Ganate una silla gamer PRO ENERGY para el Día del Padre…', likes: '947', comments: '3.919', note: 'Sorteo: comentar es parte de la mecánica de participación.', project: 'pro-atv' },
  { id: 'proenergy-22', brand: 'proenergy', src: 'pro-atv/ig-proenergy-22.jpg', format: 'Reel', hook: 'Heladera de 268 l', caption: 'Frío asegurado, aún sin conexión eléctrica…', likes: '942', comments: '51', project: 'pro-atv' },
  { id: 'proenergy-25', brand: 'proenergy', src: 'pro-atv/ig-proenergy-25.jpg', format: 'Carrusel', hook: 'Kit solar: freezer + paneles', caption: '¿Sin red eléctrica? No te quedes sin refrigeración…', likes: '580', comments: '123', project: 'pro-atv' },
  { id: 'proenergy-23', brand: 'proenergy', src: 'pro-atv/ig-proenergy-23.jpg', format: 'Reel', hook: 'Freezers solares', caption: 'Cuando la energía no llega, la refrigeración tiene que estar igual…', likes: '233', comments: '16', project: 'pro-atv' },
  { id: 'proenergy-21', brand: 'proenergy', src: 'pro-atv/ig-proenergy-21.jpg', format: 'Publicación', hook: 'Kit solar: aire solar + paneles', caption: '¿Sufriendo el calor del verano?…', likes: '122', comments: '51', project: 'pro-atv' },

  { id: 'proone-32', brand: 'proone', src: 'pro-atv/ig-proone-32.jpg', format: 'Reel', hook: '¿Tenés entre 8 y 12 años?', caption: 'La Gazelle 110 está lista para tu primera…', likes: '6.341', project: 'pro-atv' },
  { id: 'proone-35', brand: 'proone', src: 'pro-atv/ig-proone-35.jpg', format: 'Publicación', hook: 'Sorteo Día del Niño: ganá una bici eléctrica', caption: 'Nos adelantamos al Día del Niño y sorteamos una Bici Eléctrica Rod 12…', likes: '4.147', note: 'Sorteo. La captura no muestra el número de comentarios.', project: 'pro-atv' },
  { id: 'proone-31', brand: 'proone', src: 'pro-atv/ig-proone-31.jpg', format: 'Reel', hook: 'Para los más… (con @hijuetigre)', caption: '@hijuetigre recomienda nuestras motos…', likes: '401', comments: '47', note: 'Colaboración con el creador @hijuetigre.', project: 'pro-atv' },
  { id: 'proone-37', brand: 'proone', src: 'pro-atv/ig-proone-37.jpg', format: 'Reel', hook: 'Gira tu teléfono: así se fabrica el Mini Commander', caption: 'Mirá el detalle de cómo fabricamos el Mini…', likes: '378', comments: '29', project: 'pro-atv' },
  { id: 'proone-33', brand: 'proone', src: 'pro-atv/ig-proone-33.jpg', format: 'Publicación', hook: 'Moto Gazelle 110: promo Día del Niño', caption: 'La moto con la que arranca todo: Gazelle 110cc 0KM…', likes: '90', comments: '13', project: 'pro-atv' },
  { id: 'proone-34', brand: 'proone', src: 'pro-atv/ig-proone-34.jpg', format: 'Publicación', hook: 'El regalo ideal para el Día del Niño', caption: 'El regalo ideal para el Día del Niño. RFZ 110cc 0KM…', likes: '88', comments: '8', project: 'pro-atv' },
  { id: 'proone-36', brand: 'proone', src: 'pro-atv/ig-proone-36.jpg', format: 'Carrusel', hook: '¡Buscamos piloto! Mini Commander sin dueño', caption: 'Cuatriciclo busca piloto: vacante disponible…', likes: '18', comments: '17', project: 'pro-atv' },
];

export const postsBy = (brand: BrandKey) => POSTS.filter((p) => p.brand === brand);
export const postById = (id: string) => POSTS.find((p) => p.id === id)!;
