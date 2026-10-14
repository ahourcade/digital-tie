/* Digital Tie — JS mínimo compartido (≈2 KB). Todo funciona sin JS salvo filtros y lightbox. */
import { track } from './analytics';

// 1. Revelado discreto al hacer scroll
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-in'));
}

// 2. Header: estado al hacer scroll
const header = document.querySelector<HTMLElement>('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// 3. Menú móvil accesible
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const panel = document.getElementById('mobile-menu');
if (toggle && panel) {
  const focusables = () => Array.from(panel.querySelectorAll<HTMLElement>('a, button'));
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    panel.hidden = !open;
    document.documentElement.classList.toggle('menu-open', open);
    if (open) focusables()[0]?.focus();
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
    // trampa de foco simple mientras el menú está abierto
    if (e.key === 'Tab' && toggle.getAttribute('aria-expanded') === 'true') {
      const items = [toggle, ...focusables()];
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    }
  });
  window.matchMedia('(min-width: 960px)').addEventListener('change', (m) => m.matches && setOpen(false));
}

// 4. Medición de eventos (solo empuja a dataLayer; sin GTM activo no se envía nada)
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement | HTMLButtonElement>('a, button');
  if (!a) return;
  const explicit = a.dataset.track;
  const href = a instanceof HTMLAnchorElement ? a.href : '';
  if (explicit) return track(explicit, { label: a.dataset.trackLabel || a.textContent?.trim().slice(0, 80) });
  if (href.startsWith('mailto:')) return track('click_email');
  if (href.includes('wa.me')) return track('click_whatsapp');
  if (a instanceof HTMLAnchorElement && a.host && a.host !== location.host) return track('click_outbound', { url: href });
});
