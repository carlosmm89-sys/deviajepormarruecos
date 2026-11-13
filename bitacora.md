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
