-- Cambio de marca en la base de datos: "Marruecos Experiencia" -> "Vivir Marruecos"
-- Ejecutar una vez en Supabase (SQL Editor). Es seguro repetirlo.

-- 1. Ajustes generales del negocio
UPDATE public.business_settings
SET site_name      = REPLACE(site_name, 'Marruecos Experiencia', 'Vivir Marruecos'),
    smtp_from_name = REPLACE(smtp_from_name, 'Marruecos Experiencia', 'Vivir Marruecos');

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = 'public' AND table_name = 'business_settings' AND column_name = 'business_name') THEN
    EXECUTE $q$UPDATE public.business_settings
               SET business_name = REPLACE(business_name, 'Marruecos Experiencia', 'Vivir Marruecos')$q$;
  END IF;
END $$;

-- 2. Artículos del blog (texto en español y traducciones)
UPDATE public.blog_posts
SET title        = REPLACE(title,   'Marruecos Experiencia', 'Vivir Marruecos'),
    excerpt      = REPLACE(excerpt, 'Marruecos Experiencia', 'Vivir Marruecos'),
    content      = REPLACE(content, 'Marruecos Experiencia', 'Vivir Marruecos'),
    author       = REPLACE(author,  'Marruecos Experiencia', 'Vivir Marruecos'),
    translations = REPLACE(COALESCE(translations, '{}'::jsonb)::text, 'Marruecos Experiencia', 'Vivir Marruecos')::jsonb
WHERE title ILIKE '%Marruecos Experiencia%'
   OR excerpt ILIKE '%Marruecos Experiencia%'
   OR content ILIKE '%Marruecos Experiencia%'
   OR author ILIKE '%Marruecos Experiencia%'
   OR translations::text ILIKE '%Marruecos Experiencia%';

-- 3. Comprobación: filas que aún contienen el nombre antiguo en tours y destinos
SELECT 'tours' AS tabla, id FROM public.tours t WHERE t::text ILIKE '%Marruecos Experiencia%'
UNION ALL
SELECT 'destinations', id FROM public.destinations d WHERE d::text ILIKE '%Marruecos Experiencia%';
