# Bitácora Técnica — Vivir Marruecos (`vivirmarruecos.com`)

## Información General de la Arquitectura
- **Dominio en producción:** `https://www.vivirmarruecos.com`
- **Repositorio GitHub:** `https://github.com/carlosmm89-sys/deviajepormarruecos.git`
- **Hosting y CI/CD:** Vercel (`deviajepormarruecos` / `prj_FG9poBRToJImqeQKhnA42yARhjOt`)
- **Base de Datos y Storage:** Supabase (`kitavxpezfqxebadhazf` — `https://kitavxpezfqxebadhazf.supabase.co`)
- **Stack:** React 19 + TypeScript + Vite 6 + Tailwind CSS v4 + Supabase + Vercel Functions (`api/`)

---

## Registro de Actuaciones — 11/12 de Noviembre de 2026

### 1. Reparación Crítica de Captación de Leads (Formularios Web y SMTP)
- **Diagnóstico:** Ningún formulario de la web (`QuoteWizard`, `TourDetail`, `CollectionPage`) guardaba leads ni enviaba correos.
- **Causa raíz:** `dbService.createLead` ejecutaba `supabase.from('leads').insert([lead]).select().single()`. Debido a las políticas RLS de Supabase, el rol público `anon` tiene permiso `INSERT` pero no `SELECT` sobre la tabla `leads`. Al encadenar `.select()`, PostgreSQL rechazaba toda la operación con el error `42501 (row-level security policy violation)`, abortando la inserción y evitando que se ejecutara la llamada posterior a `/api/send-email`.
- **Solución aplicada:**
  - Eliminado `.select().single()` en `dbService.createLead` (`src/services/dbService.ts`).
  - Añadido fallback de carga de `business_settings` en `src/components/QuoteWizard.tsx`, `src/pages/TourDetail.tsx` y `src/pages/CollectionPage.tsx` para garantizar que el lead siempre se guarde y envíe por email.
  - Verificada la conexión SMTP (`mail.vivirmarruecos.com:465`) con resultado `OK`.

---

### 2. SEO Técnico, Pre-renderizado HTML Estático y Sitemap
- **Diagnóstico:**
  1. Al ser una SPA pura, todas las URLs devolvían el mismo HTML inicial de 3.403 bytes con `<div id="root"></div>` vacío y `<title>Marruecos Experiencia</title>`.
  2. El archivo `public/sitemap.xml` incluía rutas inexistentes en React Router (`/destinos` y `/destino/...` frente a `/destinations/...`), provocando páginas en blanco (*Soft 404*).
  3. Las URLs de colecciones en `sitemap.xml` se generaban sin separar por comas el campo `category` (`/coleccion/aventura,-cultura,-desierto...`).
  4. En `src/pages/CollectionPage.tsx`, el filtrado comparaba `t.category === target`, mostrando 0 tours en la mayoría de colecciones.
  5. En `src/pages/DestinationDetail.tsx`, al acceder a un destino mediante `slug`, se pasaba el `slug` en vez de `dest.id` a `getToursByDestination`, devolviendo 0 tours asociados.
- **Solución aplicada:**
  - Creado script post-build `prerender-seo.mjs` e integrado en `npm run build` (`vite build && node prerender-seo.mjs`). Genera automáticamente **102 páginas HTML estáticas** en `dist/` con `<title>`, `<meta name="description">`, `<link rel="canonical">`, OpenGraph, datos estructurados `JSON-LD` (`TravelAgency`, `TouristTrip`, `TouristDestination`, `BlogPosting`) y contenido semántico HTML (`<main>`, `<h1>`, `<h2>`, `<article>`, enlaces internos) dentro de `#root`.
  - Añadida configuración `"cleanUrls": true` y `"trailingSlash": false` en `vercel.json`.
  - Corregidos `generate-sitemap.mjs` y `api/sitemap.xml.ts` separando categorías individuales por comas y generando 73 rutas limpias.
  - Añadidas rutas `/destinos` y `/destino/:id` en `src/App.tsx` y corregido `DestinationDetail.tsx` para usar `dest.id`.
  - Corregido el filtrado de categorías múltiples y añadido componente `<SEO />` en `src/pages/CollectionPage.tsx`.
  - Eliminada etiqueta duplicada `PENDIENTE_ID_SEARCH_CONSOLE` en `index.html`.

---

### 3. Analítica y Filtros del Catálogo de Tours
- **Google Analytics (`src/components/GoogleAnalytics.tsx`):**
  - **Diagnóstico:** La línea `if ((window as any).gtag) return;` abortaba siempre la carga de Google Analytics porque `index.html` define previamente `window.gtag` para Google Consent Mode v2.
  - **Solución:** Cambiada la comprobación a `document.getElementById('ga-script')`, añadida validación de formato de ID (`G-XXXX`) y seguimiento automático de cambios de ruta (`location.pathname`).
- **Filtros en `/tours` (`src/pages/Tours.tsx`):**
  - **Diagnóstico:** El filtro de categorías no separaba las categorías múltiples por comas y el filtro de duración concatenaba todos los dígitos del texto (ej. `"8 días / 7 noches"` pasaba a `87` días).
  - **Solución:** Separación dinámica de categorías por comas y extracción exacta del número de días mediante expresión regular (`match(/(\d+)\s*d[ií]as?/i)`).

---

### 4. Optimización de Rendimiento y Seguridad (Auditoría `launch-check`)
- **Code Splitting (`vite.config.ts`):**
  - Configurado `manualChunks` para separar `vendor-react`, `vendor-supabase`, `vendor-motion`, `vendor-leaflet`, `vendor-quill` y `vendor-icons`.
  - El bundle principal `index.js` se redujo de **658 kB (197 kB gzip)** a **92,6 kB (27,4 kB gzip)** (-86%) y `TourDetail.js` de **198 kB** a **42,2 kB**.
- **Caché y deduplicación en `src/services/dbService.ts`:**
  - Añadida deduplicación de promesas en vuelo y caché en memoria (TTL 60s) para `getBusinessSettings()`, `getDestinations()` y `getTours()`, evitando las 4 llamadas simultáneas repetidas en cada carga de página.
- **Seguridad en `api/send-email.ts` y `vercel.json`:**
  - Añadido rate limiting por IP (máx. 5 envíos / 10 min), restricción de CORS a `vivirmarruecos.com`, lectura de credenciales SMTP desde Supabase en el servidor y sanitización HTML (`escapeHtml`) en todos los campos del correo.
  - Añadidas cabeceras HTTP de seguridad en `vercel.json` (`Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`) y caché inmutable (`max-age=31536000, immutable`) para `/assets/*`.
  - Eliminados 20 scripts temporales de pruebas en la raíz (incluyendo credenciales hardcodeadas en `update_images_auth.mjs`) y aplicado `npm audit fix`.

---

### 5. Accesos y Colaboradores (GitHub y Vercel)
- **GitHub — Invitación enviada (12/11/2026):** Se ha invitado como colaborador del repositorio `carlosmm89-sys/deviajepormarruecos` al correo `Aliourokch1233@gmail.com` (usuario de GitHub `@aliourokch1233-cloud`).
  - **Enlace directo para aceptar la invitación:** `https://github.com/carlosmm89-sys/deviajepormarruecos/invitations`
- **Vercel — Invitación de Miembro y Vistas Previas (12/11/2026):**
  - Se ha enviado invitación oficial de miembro (`role: MEMBER`) en el equipo de Vercel (`team_0Jwv6DQq0BIQeEwiPbNctk9p`) al correo `Aliourokch1233@gmail.com`.
  - Se ha desactivado `ssoProtection` en el proyecto `deviajepormarruecos` (`prj_FG9poBRToJImqeQKhnA42yARhjOt`) para que cualquier URL de vista previa (Preview Deployment) sea accesible públicamente sin pedir login en la cuenta de Carlos.

---

### 6. Integración de PR #2 (Cambio de Marca) y PR #3 (Mejoras SEO) + Ejecución SQL en Supabase
- **Propuesta #2 (`claude/marca-vivir-marruecos`) y Propuesta #3 (`claude/seo-mejoras`):**
  - Integradas en la rama principal `main`.
  - Unificación de marca de `"Marruecos Experiencia"` a `"Vivir Marruecos"` en todos los componentes, metadatos y `prerender-seo.mjs`.
  - URLs de tours actualizadas a formato amigable con `slug` (`/tours/<slug>`) con redirección automática desde UUIDs antiguos en `src/pages/TourDetail.tsx`.
  - Añadido `src/data/seoContent.js` con títulos, descripciones de ciudades, colecciones y datos fiscales/dirección en Hassi Labied (Merzouga).
- **Ejecución en Supabase (`rebrand_vivir_marruecos.sql` y `seo_contenidos.sql`):**
  - Actualizado `business_settings` (`site_name`, `hero_title`, `hero_subtitle`).
  - Corregido el slug sin tilde (`ruta-de-9-dias-desde-marrakech-hacia-tanger`) y nombre del destino `'Excursiones de un día'`.
  - Actualizadas las descripciones SEO en HTML en la tabla `destinations` para `merzouga`, `desierto-erg-chebbi`, `fez`, `chefchaouen`, `rutas-desde-casablanca` y `rutas-desde-tanger`.
- **Ajuste responsive del Hero en móvil (`src/pages/Home.tsx`):**
  - Ajustado el tamaño tipográfico del nuevo `H1` en móvil (`text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem]`) y altura flexible (`min-h-[85vh] py-16 md:py-24`) para que el título largo se adapte perfectamente en pantallas pequeñas.




---

### Velocidad móvil: LCP de la portada (12/11/2026)
- Quitada la animación de entrada (opacidad 0) del título, subtítulo y buscador de la portada: se pintan al instante.
- La descarga de la portada (`Home`) arranca en paralelo al iniciar la app en `/` (`src/App.tsx`), sin esperar al primer render.
- Imagen de portada con `loading="eager"` (sin `decoding="async"`).
- `prerender-seo.mjs`: `preconnect` a Supabase en todas las páginas pre-renderizadas.
- (2ª tanda) Fuentes de Google cargadas sin bloquear el renderizado (`display=optional`, sin saltos de diseño); `srcset`/`sizes` en las fotos de destinos, tours y galería de la portada para no descargar fotos más grandes de lo que se ven; caché de 30 días en Vercel para `/images/*`, iconos PWA y favicon.
- (3ª tanda) `Layout.tsx`: `AnimatePresence initial={false}` — la primera página ya no aparece desde opacidad 0 (retrasaba el LCP); la transición entre páginas se mantiene. `prerender-seo.mjs`: `modulepreload` del código de la portada (`Home-*.js`) en `/`.
- (4ª tanda) Supabase (~190 KB de JS) se carga en diferido (`src/lib/supabaseLazy.ts`, usado por `dbService` y `AuthContext`): ya no está en la ruta crítica de la primera pintura. `AdminLogin` sigue importándolo directamente (página de admin, carga diferida).

---

### Galería de tours: fotos grises (13/11/2026)
- `src/pages/TourDetail.tsx`: la galería de 5 fotos usaba `loremflickr.com` como relleno cuando el tour tenía menos de 5 fotos; ese servicio ya no sirve fotos y salían cuadros grises («Gallery 1…4»).
- Ahora la galería = foto principal + fotos propias del tour (sin repetir; antes `gallery[0]` nunca se mostraba si había foto principal) y, si faltan, se rellena con fotos reales de otros tours activos.
- Si la versión optimizada de una foto falla, se carga la original; si también falla, se oculta en lugar de mostrar el icono roto.

### Google Search Console: verificación con archivo HTML (13/11/2026)
- Propiedad `https://www.vivirmarruecos.com/` verificada con la cuenta de Google del propietario (método «Archivo HTML»).
- `/google8246ce4ddafaea89.html` se sirve desde `api/google-verification.ts` (rewrite en `vercel.json`) para evitar la redirección de `cleanUrls`. **No borrar.**

### Search Console: redirecciones 301 de URLs antiguas (13/11/2026)
- `vercel.json` → `redirects`: las URLs antiguas que Google tenía como «Rastreada: actualmente sin indexar» (destinos y tour con UUID, `/destino/:slug`, `/destinos`, la colección con comas y el post `consejos-compras-marruecos-regateo`) redirigen con 301 a su URL actual.

### Portada: cómo funciona, tipos de viaje, preguntas frecuentes y contacto (13/11/2026)
- Nuevo `src/data/homeContent.js` con los textos de «Tu viaje en 4 pasos», «Viajes para cada ocasión» (enlazan a `/coleccion/<slug>`), las preguntas frecuentes y la nota de precios.
- `src/pages/Home.tsx`: nota bajo los tours destacados (precios para grupo de 4), sección «Cómo funciona», tipos de viaje, preguntas frecuentes (desplegables) y botones de presupuesto, WhatsApp y email en el bloque final.
- `src/components/Layout.tsx`: el formulario de presupuesto (`QuoteWizard`) se abre también con el evento `open-quote-wizard` (lo usan los botones de la portada).
- `prerender-seo.mjs`: el HTML estático de `/` incluye los 4 pasos y las preguntas frecuentes, y datos estructurados `FAQPage` para Google (solo en el HTML estático, para no duplicarlos).

### Portada: opiniones de Google (13/11/2026)
- Sección «Lo que dicen nuestros viajeros» en `src/pages/Home.tsx` con las reseñas reales de la ficha de Google «Vivir Marruecos» (lista `REVIEWS` en `src/data/homeContent.js`), enlace a la ficha y enlace para escribir una opinión. También en el HTML estático de `/` (`prerender-seo.mjs`).
- Para añadir reseñas nuevas, sumarlas a `REVIEWS` (nombre, mes y texto tal cual aparecen en la ficha).
- (2ª tanda) Añadidas 6 opiniones de Tripadvisor (ficha de 105 opiniones, 5,0, Travellers' Choice 2026) junto a las 2 de Google; totales en `REVIEW_TOTALS` (actualizar a mano). Textos largos recortados con «…» sin cambiar palabras.

### Página /tours: foto de fondo en la cabecera (13/11/2026)
- `src/pages/Tours.tsx`: la cabecera «Tours y circuitos por Marruecos» lleva de fondo una foto de Unsplash (caravana de camellos en las dunas, de Carlos Leret), con degradado oscuro y texto en blanco.

### Traducción completa al inglés y francés (13/11/2026)
- `useTranslation()` tiene ahora `tr({ es, en, fr })` para textos sueltos; usado en Layout (menú y pie), portada, buscador, /tours, ficha de tour, formulario de presupuesto, burbuja de WhatsApp, aviso de cookies, destinos, colecciones, actividades, galería, blog, favoritos, guía y 404.
- `src/data/homeContent.js` → `getHomeContent(lang)` y `localizeReviewMeta()`; `src/data/collectionsI18n.js` con las colecciones en EN/FR; `src/i18n/labels.ts` con categorías y duraciones.
- Al cambiar de idioma se recarga la página (`LanguageContext`) para que tours y destinos lleguen ya traducidos; `dbService` aplica también la traducción del destino incluido en cada tour e ignora campos de traducción vacíos.
- `ReviewsModal`: quitadas las 4 opiniones inventadas y las notas por categoría; ahora muestra las opiniones reales de `homeContent.js` y el total de Tripadvisor. La ficha de tour enseña el total real (105) en vez de «14 evaluaciones».
- Siguen en español: artículos del blog, guía «Viaje a Marruecos» (pensada para búsquedas en España) y páginas legales.
- Panel → editar tour: arreglado el cambio de pestaña ES/EN/FR. Los campos y editores se reutilizaban entre idiomas y el texto de una pestaña podía copiarse en otra; ahora cada idioma tiene sus propios campos (`key` por idioma en inputs y ReactQuill).
- Panel → destinos: mismo arreglo de pestañas ES/EN/FR (`key` por idioma).
- Contenido de los 10 tours publicados traducido al inglés y francés desde el panel (título, duración, salida/regreso, incluye, no incluye, itinerario y recomendaciones). El tour oculto «Tour de 9 días: Marrakech a Tánger» no se tocó.
- `routeStops.js`: el mapa reconoce «Day N:» y «Jour N :» y nombres de lugares en inglés/francés (High Atlas, Valley of Roses, cedar…).
- Destinos (9) traducidos al inglés y francés desde el panel (nombre y descripción).
- En inglés/francés: aviso en /blog y /actividades de que los artículos están en español, la ficha de tour no muestra artículos relacionados, y la portada indica que las opiniones van en su idioma original.
- Panel → editar artículo del blog: mismo arreglo de pestañas EN/FR (`key` por idioma en título, extracto y editor).
- Panel → editar artículo: el contenido en español no se cargaba en el editor (faltaba `setValue('content', …)`), así que el editor salía vacío y no se podía guardar ningún cambio. Arreglado.
- Blog: traducidos al inglés y francés (desde el panel) los 5 artículos publicados más leídos: mejor época, regatear en los zocos, imazighen, qué llevar al desierto y Ait Ben Haddou. El aviso de /blog dice ahora que «algunos» artículos solo están en español.
- Blog → pestaña «Actividades y colecciones»: traducidos al inglés y francés los 13 artículos publicados (luna de miel, niños, rutas desde Tánger, consejos primer viaje, Chefchaouen, riad, Merzouga o Zagora, Marrakech en 3 días, gastronomía y las 4 actividades). Quitado el aviso de /actividades (ya están traducidas).
- Borradores sin publicar a propósito: están casi vacíos y repiten artículos ya publicados (regateo, gastronomía ×2, Chefchaouen, Zagora vs Merzouga, Marrakech 3 días).
- (14/11/2026) Blog: traducidos al inglés y francés los 16 artículos publicados que faltaban (tour privado o en grupo, cómo llegar a Merzouga, clima, Fez–Chefchaouen, Ramadán, qué ropa llevar, tours desde Tánger/Marrakech/Casablanca, cuánto cuesta, 7 días, excursiones desde Marrakech, Fez–Merzouga, qué hacer en Merzouga y es seguro viajar). Ya están traducidos los 33 artículos publicados. Quitado el aviso de /blog y la ficha de tour vuelve a mostrar artículos relacionados en todos los idiomas.
- (14/11/2026) Páginas legales (aviso legal, privacidad, cookies y condiciones) traducidas al inglés y francés con `tr()`. Solo queda en español la guía «Viaje a Marruecos».
- (14/11/2026) Revisión general: «&nbsp;» del editor cambiados por espacios al mostrar los textos (dbService y prerender) — en el móvil el texto de 18 artículos salía cortado; etiquetas de categoría del blog traducidas en fichas de tour y artículos.
- (14/11/2026) Tours: descripción propia de la ruta de 8 días (antes copiada del tour de 4 días); tour de Errachidia con duración, descripción corta en ES/EN/FR y título más corto. Quitados 5 enlaces a Bing en la excursión de 3 días y enlaces del blog a tours con UUID cambiados por el slug.
- (14/11/2026) Ruta de 8 días: precio corregido a 500 € (antes 200 €).
- (14/11/2026) Privado o en grupo: solo la excursión de 3 días y el viaje de 5 días al desierto se pueden hacer en grupo; el resto, siempre en privado. Actualizado el campo de cada tour y los artículos «tours desde Marrakech» y «tour privado o en grupo» (ES/EN/FR).
- (14/11/2026) Nuevo tour «Ruta de 3 días de Fez a Marrakech por el desierto de Merzouga» (ES/EN/FR, desde 200 €, solo privado), en «Tours desde Fez», Fez, Merzouga y Erg Chebbi. Foto del valle del Ziz de Pexels (uso libre); `optImg` admite ahora fotos de Pexels.
- (14/11/2026) Tres excursiones de un día desde Marrakech (Ouzoud, Ourika, Essaouira), desde 30 €, solo incluyen transporte privado con chófer; en «Excursiones de un día». Fotos de Pexels.
- (14/11/2026) Colección «Viajes en grupo»: ahora con la excursión de 3 días y el viaje de 5 días al desierto (quitados la ruta de 9 días y la de 5 días Marrakech–Fez, solo privadas). Artículo «Excursiones de un día desde Marrakech» enlaza a las excursiones de Ourika, Ouzoud y Essaouira (ES/EN/FR).
- (14/11/2026) Tour de Errachidia: foto principal cambiada (antes el quad, repetido en otras páginas) por una caravana de dromedarios con su guía al atardecer en las dunas de Merzouga (Pexels).
- (18/11/2026) Guía «Viaje a Marruecos» (`/viaje-a-marruecos`) traducida al inglés y francés: `getGuide(lang)` en `src/data/guiaViaje.js`. Adaptadas para viajeros de cualquier país la documentación (visado según nacionalidad), cómo llegar (vuelos desde Europa; en FR, ferry desde Sète) y el idioma del conductor (inglés, español y francés). Quitado el aviso «solo en español». El HTML pre-renderizado sigue en español. Ya está toda la web en los tres idiomas.
- (18/11/2026) Guía: precio de las rutas de 8 días corregido a «desde 400 €» (ES/EN/FR), el más bajo publicado en /tours.
- (18/11/2026) SEO: los buscadores ya no reciben la web en inglés por la detección automática del idioma del navegador (Googlebot renderiza en inglés); siempre ven la versión en español. Descripciones del pre-renderizado sin espacios antes de comas o dos puntos (`stripHtml`).

### Inglés y francés con direcciones propias para Google (18/11/2026)
- El idioma lo marca la URL: sin prefijo español, `/en/...` inglés, `/fr/...` francés (mismos slugs). `src/i18n/urlLang.js` con las funciones comunes (web y pre-renderizado).
- `LanguageContext`: idioma según la URL (ya no por `localStorage` ni por el idioma del navegador); el selector lleva a la misma página en el otro idioma. `dbService` traduce según la URL.
- `App.tsx`: `basename` del router = prefijo del idioma, así todos los `<Link>` lo llevan. `LocalizedLinks.tsx` cambia al idioma de la página los enlaces internos escritos en HTML (blog, guía, tours) y los abre sin recargar.
- `main.tsx`: quien eligió inglés o francés en otra visita y entra desde fuera a una página en español va a la versión de su idioma (los buscadores no, porque no guardan preferencia).
- `SEO.tsx`: canonical de cada idioma, `hreflang` (es, en, fr, x-default), `og:locale` y `<html lang>`. Las páginas legales ya no tienen la portada como canonical.
- `prerender-seo.mjs`: genera las 3 versiones de cada página con título, descripción, contenido y datos estructurados en su idioma (traducciones de la base de datos, `getHomeContent`, `getGuide`, `collectionContentI18n`), `hreflang` y enlaces internos en el mismo idioma.
- `seoContent.js`: `tourMetaDescription(tour, lang)`, `destinationHeadings(dest, siteName, lang)`, `ACTIVITIES_EXTRA_I18N`, `HOME_I18N_SEO`; textos de la colección «Excursiones de un día» (ES/EN/FR).
- `api/sitemap.xml.ts`: todas las URLs en los 3 idiomas con `xhtml:link` hreflang. `api/page-fallback.ts`: comprueba también `/en/...` y `/fr/...` y conserva el idioma en las redirecciones. `vercel.json`: redirecciones antiguas también con `/en` y `/fr`; `noindex` en `/en|fr/favoritos`.
- Analytics registra la ruta con el prefijo de idioma.

### Revisión general (18/11/2026)
- Comprobadas las 243 URLs del sitemap y sus enlaces internos: todas 200, sin títulos ni descripciones duplicados, páginas EN/FR sin texto en español.
- Móvil: el buscador de la portada (fechas), la barra de pestañas de la ficha de tour (`-mx-4` la sacaba del ancho) y los botones de la ficha (Comparte / Guarda / PDF, en francés) se salían de la pantalla; la paginación del blog también. Corregido (`min-w-0`, `flex-wrap`, botones más pequeños en móvil).
- `/favoritos` con su propio título (antes salía el de la portada).
- Pendiente: el contador de visitas de la portada da error 400 (`increment_home_views`), se arregla con `fix_home_views.sql` cuando haya acceso a Supabase.
- (18/11/2026) Móvil: el botón de WhatsApp se oculta mientras hay un formulario de contacto en pantalla (reserva del tour, presupuesto, colecciones) y vuelve al seguir bajando (`WhatsAppBubble.tsx`, IntersectionObserver). El buscador de la portada no cuenta.

### Quiénes somos, Contacto y medición (18/11/2026)
- Nuevas páginas `/sobre-nosotros` (`AboutUs.tsx`) y `/contacto` (`Contact.tsx`) en ES/EN/FR, con textos en `src/data/companyContent.js` (solo datos reales: desde 2015, Hassi Labied, conductores en 3 idiomas, vehículos con seguro, datos de la SARL, horario L–V 9:00–21:00). Contacto: WhatsApp, email, presupuesto (abre el formulario), horario, dirección, mapa de Google y enlaces para opinar en Google y Tripadvisor. En menú, pie, sitemap y pre-renderizado (AboutPage / ContactPage con TravelAgency, horario y contactPoint).
- Menú móvil: el botón inferior abre el formulario de presupuesto (antes «Contacto» apuntaba a `#contacto`).
- Pie: el WhatsApp de reserva, si no cargan los Ajustes, era un número inventado (+212 600 000 000); ahora +34 604 48 82 23.
- Analytics (GA4): `generate_lead` al enviar el formulario de un tour, de una colección o el de presupuesto; `contact_click` (method whatsapp/email/phone) en cualquier enlace de WhatsApp, email o teléfono (`src/lib/track.ts`, `GoogleAnalytics.tsx`). Marcarlos como eventos clave en GA4.
- Títulos EN/FR de portada y /tours orientados a búsquedas (`HOME_I18N_SEO`, `TOURS_TITLE`). Datos estructurados de la portada con fecha de fundación y horario.
- (18/11/2026) Contador de visitas de la portada arreglado: Carlos ejecutó `fix_home_views.sql` en Supabase; `increment_home_views` responde 204 (antes 400).
- (18/11/2026) Quiénes somos: foto del equipo (enviada por el propietario) en `public/images/equipo/` (480 y 800 px, WebP y JPG). Solo se muestra en esa página (no como imagen al compartir).
- (18/11/2026) Quiénes somos: apartado «Hola, soy Ali» (ES/EN/FR) con la historia del fundador junto a su foto; pie «Ali, fundador de Vivir Marruecos»; `founder` en los datos estructurados. Texto en `companyContent.js` (`founder`).
- (18/11/2026) Quiénes somos: quitado el recuadro «Datos de la empresa» (razón social, ICE, RC, domicilio). Por decisión del propietario, esos datos solo se muestran en el Aviso legal (y la razón social y el domicilio, en la Política de privacidad como responsable del tratamiento).
- (19/11/2026) Revisión general: las 249 URLs del sitemap responden 200, sin títulos ni descripciones duplicados, canonical correcto en todas, un solo H1 por página, sin enlaces internos rotos ni imágenes rotas; las páginas inexistentes dan 404. Arreglado:
  - Pre-renderizado EN/FR de las fichas de tour: la duración salía en español («Duration: 3 Días»); ahora «3 days» / «3 jours» (`localizeDuration`).
  - Pre-renderizado: los extractos de /tours, /destinations y /blog y la meta descripción se cortaban a mitad de palabra; ahora se cortan en un espacio y terminan en «…» (`excerpt`).
  - Imagen de relleno cuando un tour, destino o artículo no tiene foto: era loremflickr.com (ya no sirve fotos, salía un cuadro gris); ahora `/images/blog/desert.png` de la propia web.
  - `public/llms.txt`: tenía el nombre antiguo «De Viaje por Marruecos» y ningún dato del negocio; ahora describe Vivir Marruecos, páginas principales y contacto (se mantienen los créditos de Tonwy).
  - Título y descripción por defecto (`index.html`, `SEO.tsx`): «Tours privados por Marruecos…» en vez de «Tu agencia de viajes en Marruecos».
- (19/11/2026) Quiénes somos: Vivir Marruecos se presenta como «agencia de viajes a medida por todo Marruecos» (ES/EN/FR), por decisión del propietario.
- (20/11/2026) SEO: `/coleccion/costa` estaba en «Rastreada: actualmente sin indexar» por poco contenido. Añadidos tres párrafos (Essaouira, sur y norte, cómo añadir costa a una ruta) en ES/EN/FR (`COLLECTION_BODIES`, `collectionsI18n.js`).
- (20/11/2026) SEO: artículo `/blog/gastronomia-marroqui-platos-tipicos` («Rastreada: actualmente sin indexar», unas 280 palabras) ampliado desde el panel a 9 platos (con la medfouna de Rissani/Merzouga y la tanjia), dónde comer y consejos (~870 palabras ES, también EN/FR). Título nuevo: «Gastronomía marroquí: 9 platos típicos que debes probar». Este commit sirve también para volver a generar el pre-renderizado con el texto nuevo.
- (20/11/2026) SEO (datos de Search Console, 28 días: 49 impresiones, casi todo búsquedas de marca):
  - Ampliados desde el panel, en ES/EN/FR: `/blog/excursion-fez-chefchaouen` (~675 palabras; título «Cómo ir de Fez a Chefchaouen: transporte, qué ver y consejos»; la búsqueda «de fez a chefchaouen» estaba en el puesto 22) y `/blog/noche-en-el-campamento` (~640 palabras; título «Noche en el desierto de Merzouga: cómo es dormir en una jaima»; búsqueda «noche en el desierto marruecos»).
  - Search Console: solicitada la retirada temporal de `/admin` (prefijo) y `/favoritos`, que salían en Google (ya tienen `noindex`). Nueva validación de «Rastreada: actualmente sin indexar».
  - Pendiente: más páginas con poco texto (colecciones paquetes, entrega-de-anillo, viajes-en-grupo, viajes-de-lujo, viajes-exclusivos; destinos excursiones-cortas, chefchaouen, rutas-desde-casablanca y rutas-desde-tanger; artículos cuatrimotos, sandboarding, paseo en globo, Merzouga o Zagora).
- (20/11/2026) Medición: la web no enviaba datos a Google Analytics (campo «ID de Google Analytics» vacío en Ajustes; el contenedor GTM-PDJ52ZN4 no tiene GA4). Creada la propiedad GA4 «vivirmarruecos.com» (cuenta «de Viaje por Marruecos», propiedad 565275164, flujo web 16384343527, ID G-JGQ18K5EXK, zona horaria España, euro) y puesta en Ajustes. Comprobado: `page_view`, `generate_lead` y `contact_click` llegan a Analytics. Pendiente: marcar `generate_lead` y `contact_click` como eventos clave cuando aparezcan (~24 h) y vincular con Google Ads. Plan de campaña en el documento «Revisión de vivirmarruecos.com y plan de campaña en Google Ads».
- (20/11/2026) Medición, cambio de cuenta: por decisión del propietario, nada de vivirmarruecos.com en la cuenta de Google deviajepormarruecos2024. Nueva cuenta de Analytics «Vivir Marruecos» con vivirmarruecosinfo@gmail.com (cuenta 417047611, propiedad 565354563, ID **G-7TVWYG1WMQ**), puesta en Ajustes en lugar de G-JGQ18K5EXK y comprobada. La propiedad anterior (G-JGQ18K5EXK, en la cuenta «de Viaje por Marruecos») ya no se usa. Google Ads: cuenta nueva 653-763-0799 con vivirmarruecosinfo@gmail.com (sin método de pago todavía).

- (21/11/2026) Supabase (seguridad): registro de cuentas nuevas desactivado; `handle_new_user` crea perfiles con rol `user` (antes `admin`: cualquiera que se registrara era administrador); blog, galería y Storage solo editables por `is_admin()` (antes cualquier usuario con sesión); un usuario no puede darse rol admin; `search_path` fijo en las funciones; índices en `leads.tour_id` y `tours.destination_id`. Copia previa de las tablas en el esquema `copia_20261121`.
- (21/11/2026) Fotos: la transformación de imágenes de Supabase no está en el plan (403 FeatureNotEnabled); `optImg` sirve la original.
- (21/11/2026) SMTP: los emails los envía la Edge Function de Supabase `send-email` (código en `supabase/functions/send-email/index.ts`, desplegada por la API de gestión), que lee `smtp_password` con la clave de servicio. `/api/send-email` (Vercel) solo valida, limita y reenvía. `smtp_password` ya no es legible por `anon`/`authenticated` (permisos por columna). La contraseña se cambia en Supabase → Table Editor → business_settings. Ali no puede tocar variables de entorno de Vercel (es lector en el equipo de Carlos).
- (21/11/2026) Fotos: 28 fotos de Supabase de más de 250 KB convertidas a WebP (máx. 1600 px; logo 600 px) en `images/opt/` y referencias cambiadas en tours, destinos, blog y ajustes (de ~1 MB a 50–150 KB). Los originales siguen en Storage.
- (21/11/2026) Contenido (desde el panel/API, ES/EN/FR): descripciones de 9 tours reescritas según su itinerario (EN/FR tenían una frase; una decía «De viaje por Marruecos»); destinos Erg Chebbi y Fez ampliados; 16 artículos del blog de 200–250 palabras ampliados a ~300–400; quitado «grupo(s) de 4» de los precios en «cuánto cuesta» y «tour privado o en grupo». Portada: quitada la reseña repetida de Rosario Isabel L. Contacto: horario «hora de España».
- (21/11/2026) La web ya no se presenta como «agencia (de viajes)»: «empresa local» / «local company» / «entreprise locale» en Quiénes somos, guía, metadescripciones, portada EN/FR, condiciones, destino Merzouga y subtítulo de la portada (Supabase); schema.org TravelAgency → LocalBusiness. Motivo: Vivirmarruecos SARL no tiene licencia de agencia de viajes.
- (21/11/2026) Blog «Mejor época para viajar a Marruecos»: la foto de portada era un montaje (foto de camellos pegada encima de otra de una kasbah, que asomaba por abajo). Recortada a solo los camellos (1140×768) y subida desde el panel; portada nueva `images/1795283672125_ew424c.webp`. La anterior sigue en Storage. Este commit también regenera el pre-renderizado.
- (21/11/2026) SEO: 12 colecciones con poco texto (73–191 palabras en el pre-renderizado) ampliadas con 3 párrafos cada una en ES/EN/FR (`src/data/collectionsExtra.js`, se suman en `collectionContentI18n`): paquetes, entrega-de-anillo, viajes-en-grupo, viajes-de-lujo, viajes-exclusivos, actividades, luna-de-miel, norte-de-marruecos, viajes-en-familia, aventura, cultura, montana. Solo datos reales (privados salvo 3 y 5 días al desierto, conductores ES/EN/FR, base en Hassi Labied, desde 2015). Los destinos Chefchaouen, rutas desde Casablanca y desde Tánger ya tenían 370–500 palabras.
- (21/11/2026) Analytics: `generate_lead` y `contact_click` marcados como eventos clave en la propiedad G-7TVWYG1WMQ.
- (21/11/2026) Manifiesto de la app (PWA): descripción «Tours privados por Marruecos y el desierto de Merzouga» en vez de «Tu agencia de viajes en Marruecos».
- (21/11/2026) Confirmado por el propietario: las jaimas del campamento de lujo tienen baño privado y la empresa dispone de sillas para niños; añadido en viajes de lujo y viajes en familia (ES/EN/FR).
- (21/11/2026) Velocidad (PageSpeed móvil 84, LCP 4,4 s): la foto de portada se copiaba en 480/768/1024/1600 px pero, como Supabase no redimensiona, las cuatro eran la original (167 KB en móvil). Ahora hay versiones redimensionadas en `public/images/hero/hero-fe8baba4-*.webp` (28/58/89/126 KB) y `localizeHeroImage` las usa si existen. Si se cambia la foto de portada en el panel, cambia el hash y vuelve a descargarse la original: habrá que generar sus versiones igual.
- (21/11/2026) Velocidad: el script de Google Analytics (gtag, ~190 KB) se carga al interactuar o 2,5 s después del load, como GTM (`GoogleAnalytics.tsx`); antes se cargaba enseguida y competía con la foto de portada. Los eventos esperan en dataLayer. Nota: PageSpeed muestra gtag cargado dos veces (una vía GTM-PDJ52ZN4); el contenedor GTM no es de Vivir Marruecos, no se toca.
- (21/11/2026) Velocidad: la portada (ES/EN/FR) lleva en el HTML del servidor la foto principal visible (`heroPlaceholderHtml` en prerender-seo.mjs), en posición absoluta bajo la cabecera; React la sustituye al montar. Así el LCP no espera al JavaScript.
- (21/11/2026) CSP (`vercel.json`): permitidos los dominios de Google Ads/señales (stats.g.doubleclick.net, *.doubleclick.net, www.google.com, googleadservices) en connect-src, script-src y frame-src, y `worker-src 'self' blob:` (compresión de fotos del panel). Antes Analytics no podía enviar los datos de señales/Ads y el worker de compresión se bloqueaba.
- (22/11/2026) Portada: nuevo apartado «¿Por qué reservar directamente con nosotros?» (ES/EN/FR) antes de «Cómo funciona», con 6 motivos solo con datos reales (trato directo con Ali y su familia, empresa local en Hassi Labied desde 2015, conductores ES/EN/FR, viaje privado y flexible, presupuesto claro sin cargos ocultos, 5,0 en Tripadvisor y Travellers' Choice 2026). Textos en `WHY_DIRECT` / `whyDirect` (`homeContent.js`); también en el pre-renderizado. Este commit regenera además el pre-renderizado con lo cambiado hoy desde el panel: foto de portada del desierto (caravana en Erg Chebbi), galerías de los tours con fotos de cada etapa, distancia y horas de coche aproximadas en cada día de los itinerarios (ES/EN/FR), enlaces internos del blog sin pestaña nueva y 5 títulos de artículos en francés más cortos.
- (22/11/2026) SEO según las búsquedas objetivo (viajes a Marruecos, circuitos por Marruecos, Marrakech al desierto de Merzouga, excursión desierto de Merzouga, viaje privado por Marruecos, ruta Marruecos 5 días):
  - Portada: título «Viajes a Marruecos: tours privados y desierto de Merzouga» y meta descripción propia (`HOME_META_DESCRIPTION`, ya no el subtítulo de Ajustes). /tours: descripción con «circuitos». Tour de 5 días (panel): título «Ruta de 5 días por Marruecos: Marrakech y desierto de Merzouga». Las demás búsquedas ya tenían su página (tour de 4 días y destino «Tours desde Marrakech al desierto de Merzouga», excursión de 3 días, /tours «Tours y circuitos por Marruecos»).
  - Meta descripción de los destinos: se cortaba a mitad de palabra (160 caracteres); ahora corta en un espacio y termina en «…» (pre-renderizado y web).
  - Colecciones: H2 «Tours y circuitos: …» antes de la lista de tours en el pre-renderizado.
  - Texto alternativo: fotos de la ficha de tour («Principal», «Gallery 1»… → título del tour y nº de foto), visor de fotos, galería y foto de portada.
- (22/11/2026) Velocidad y móvil. PageSpeed móvil: portada 96 (LCP 2,7 s; accesibilidad, prácticas y SEO 100), sin desbordes horizontales a 360 px en las páginas principales; fotos ya en WebP. La ficha de tour daba 71 (LCP 8,0 s, 3,7 MB): en móvil se descargaban también las fotos 2–5 de la cabecera aunque están ocultas (`hidden md:block`) y las de tours/artículos relacionados. Ahora: `loading="lazy"` en esas fotos, `fetchPriority="high"` en la principal y `preload` de la foto principal en el HTML pre-renderizado de cada tour. Casilla de privacidad del formulario del tour con su `<label>` (accesibilidad).
- (22/11/2026) Velocidad ficha de tour (2): en móvil la foto principal va ya en el HTML del servidor (`tourPlaceholderHtml`, mismo sitio que la pinta React: 121 px desde arriba, 8 px de margen, 40vh, radio 24 px); en ordenador no. Fotos principales de 4 tours recomprimidas a WebP de 1024 px desde el panel (`*-1024.webp` en Storage; los originales siguen allí): tour 4 días 176→68 KB, 5 días 143→85 KB, 8 días 98→58 KB, 11 días 97→61 KB.
- (22/11/2026) Ficha de tour: mientras carga los datos ya no sale solo el spinner: si la página trae la foto principal en el HTML (`.tph`), `main.tsx` la guarda en `window.__TPH__` y TourDetail la sigue mostrando en su sitio (la foto no desaparece y vuelve a aparecer; mejora el LCP).
- (23/11/2026) Velocidad portada (PageSpeed móvil 87, LCP 3,9 s): React borraba al arrancar la foto de portada que trae el HTML del servidor y pintaba el spinner de `Suspense` hasta cargar el código de Home, así que la foto se pintaba dos veces y el LCP contaba la segunda. Ahora, en la portada (ES/EN/FR), el `fallback` de `Suspense` (`PageLoader` en `App.tsx`) es la misma foto de portada (`__BIZ__.hero_local_src`); en las demás páginas sigue el spinner. Quitada además la conexión previa a Supabase sin `crossorigin` (PageSpeed la marcaba como no usada). Pendiente: la foto de portada actual (hash 53faaeb3) no tiene versiones redimensionadas en `public/images/hero/` (las cuatro son la original de 1192×953, 51 KB).
- (23/11/2026) Portada: vídeo corto del desierto (19 s, 960×540, sin sonido, 2,1 MB) entre «Tours destacados» y «¿Por qué reservar directamente?» (`src/components/DesertVideo.tsx`, `public/videos/desierto.mp4` y `desierto-poster.webp`). No descarga nada hasta que el visitante se acerca a la sección (no afecta a la velocidad de carga). Lleva el aviso «Imágenes ilustrativas»: son clips gratuitos de Pexels, no del campamento de Vivir Marruecos (caravana: pexels.com/video/34535419, quads: /30958082, hoguera: /41077435). Sustituirlo por un vídeo propio cuando lo haya. No se puso de tambores: en Pexels no hay ninguno del desierto de Marruecos.
- (23/11/2026) Vídeo de la portada: a petición del propietario, el clip de quads se sustituye por uno de dunas con gente subiendo a la cima (pexels.com/video/28782169). Título «Camellos, dunas y noche junto al fuego» (ES/EN/FR). 19 s, 1,3 MB.
- (23/11/2026) Vídeo de la portada: sustituidos los clips de Pexels por vídeos propios del Escritorio del propietario (carpeta MARRUECOS: dunas de Erg Chebbi, subida a los camellos, caravana, hoguera y tambores en el campamento). 30 s, 960×540 (los verticales con fondo difuminado a los lados), con sonido (empieza silenciado; botón «Activar sonido»), 2,1 MB. Quitado el aviso «Imágenes ilustrativas». Título «Dunas, camellos y noche con tambores» (ES/EN/FR).
- (23/11/2026) Vídeo de la portada: quitada a petición del propietario la última parte (chicos tocando los tambores). Queda en 22 s, 1,6 MB; título «Dunas, camellos y noche junto al fuego».
- (23/11/2026) Título de la sección del vídeo: «Vive la magia del desierto» (EN «Experience the magic of the desert», FR «Vivez la magie du désert»), con el antetítulo «Desierto de Merzouga».
- (23/11/2026) Páginas que daban «no existe o ha cambiado de dirección»: revisadas las 249 del sitemap, sus enlaces internos y las 72 URL con visitas desde Google (Search Console). Las URL antiguas con código (/tours/<id>, /destinations/<id>, /destino/…) ya redirigen bien. Única rota: /blog/guia-gastronomica-marruecos-platos-tipicos → redirección 301 a /blog/gastronomia-marroqui-platos-tipicos (también /en y /fr). Además, el service worker de la PWA servía la app (y su «Página no encontrada») al abrir /sitemap.xml o /robots.txt en un navegador que ya había visitado la web: añadido navigateFallbackDenylist para archivos con extensión y /api.
- (23/11/2026) SEO idiomas: en el HTML pre-renderizado, los enlaces «English / Français / Español» del menú llevan ahora a la misma página en el otro idioma (antes todos iban a la portada /en o /fr). Así Google encuentra y relaciona las versiones EN/FR de cada página. La portada /en estaba como «Duplicada: Google ha elegido otra canónica» (su HTML es correcto: lang="en", canonical propio, textos en inglés); queda pedir su indexación en Search Console cuando se renueve la cuota diaria de inspección (se agotó el 23/11).
- (23/11/2026) Velocidad portada: versiones redimensionadas de la foto de portada actual (hash 53faaeb3) en `public/images/hero/` (480/768/1024 px: 10/19/27 KB; 1600 = original de 1192 px, 51 KB). Antes las cuatro eran la original. No se incrusta el CSS en el HTML: pesa 125 KB sin comprimir (19 KB comprimido) y se repetiría en cada página.
- (26/11/2026) Fichas de tour: la foto principal que va en el HTML del servidor (`.tph`) y la que se ve mientras carga llevaban `alt=""`; ahora llevan el título del tour en su idioma (ES/EN/FR). La foto de la cabecera ya cargada ya lo tenía.
- (26/11/2026) /tours: «Salidas regulares» sustituido por «Tour privado» (EN «Private tour», FR «Circuit privé») en todos los tours, salvo la excursión de 3 días (`escapada-3-dias-merzouga`) y el viaje de 5 días al desierto (`viaje-5-dias-desierto-merzouga`): «Privado o en grupo» (`GROUP_OR_PRIVATE_SLUGS` en `Tours.tsx`). Icono de personas en vez de calendario. Ya no se usa `date_text`.
- (26/11/2026) Opiniones de Tripadvisor en /en y /fr: cada opinión lleva la nota «Review in Spanish» / «Avis en espagnol» y `lang="es"` (portada, ventana de opiniones y pre-renderizado). Quitada la frase general «Reviews are shown in their original language».
