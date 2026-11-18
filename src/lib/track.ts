import { currentLang } from '../i18n/urlLang';

/**
 * Eventos de Google Analytics (GA4). Si Analytics no está cargado no hace nada.
 * - generate_lead: se ha enviado un formulario de presupuesto o consulta.
 * - contact_click: clic en WhatsApp, email o teléfono.
 * En GA4 se pueden marcar como «eventos clave» para ver qué páginas y anuncios traen clientes.
 */
export function track(event: string, params: Record<string, unknown> = {}) {
  try {
    const gtag = (window as any).gtag;
    if (typeof gtag !== 'function') return;
    gtag('event', event, { language: currentLang(), page_path: window.location.pathname, ...params });
  } catch {
    /* Analytics no disponible */
  }
}

export function trackLead(form: 'tour' | 'presupuesto' | 'coleccion', detail?: string) {
  track('generate_lead', { form_name: form, item_name: detail || undefined, currency: 'EUR' });
}
