/**
 * Mapa de eventos (para configurar en GTM / GA4 / Meta Pixel cuando haya IDs reales):
 *  - cta_contact        → clic en CTA de consulta («Hablemos», «Hablemos de tu contenido»)
 *  - click_project      → clic en una card de proyecto (label = slug)
 *  - click_email        → clic en un mailto:
 *  - click_whatsapp     → clic en un enlace a wa.me
 *  - click_outbound     → clic en enlace externo (url)
 *  - form_submit_success→ envío confirmado por el endpoint del formulario (form = contacto|contenidos)
 *  - form_submit_error  → error del endpoint
 *  - form_mailto        → el usuario eligió enviar por correo (sin endpoint configurado)
 *  - filter_projects    → uso de filtros en /proyectos/ (label = categoría)
 *  - lightbox_open      → apertura de una imagen ampliada
 */
declare global {
  interface Window { dataLayer: Record<string, unknown>[] }
}
export function track(event: string, params: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
