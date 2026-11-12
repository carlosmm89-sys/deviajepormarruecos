# Vivir Marruecos — www.vivirmarruecos.com

Web de **Vivir Marruecos** (Vivirmarruecos SARL), agencia de viajes y transporte turístico con sede en Hassi Labied (Merzouga, Marruecos).

## Tecnología

- **Frontend:** React 19 + Vite + Tailwind CSS (SPA con pre-renderizado SEO estático en el build)
- **Base de datos y panel admin:** Supabase (tours, destinos, blog, galería, leads, ajustes)
- **Hosting:** Vercel (funciones serverless en `api/`)
- **Correo:** `api/send-email.ts` envía los formularios por SMTP

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # genera sitemap + build + páginas SEO estáticas
npm run lint     # comprobación de tipos
```

## Variables de entorno

Ver `.env.example`. En Vercel deben estar configuradas:

| Variable | Uso |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase (web y funciones) |
| `VITE_SUPABASE_ANON_KEY` | Clave pública de Supabase (web) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Solo servidor.** Permite a `api/send-email.ts` leer la configuración SMTP sin exponerla al público |

## Estructura

- `src/` — páginas, componentes y servicios de la web
- `api/` — funciones serverless de Vercel (email, sitemap, imagen OG)
- `public/` — archivos estáticos (robots.txt, iconos, llms.txt)
- `supabase/sql/` — scripts SQL históricos usados para crear y actualizar la base de datos
- `bitacora.md` — registro de cambios y actuaciones
