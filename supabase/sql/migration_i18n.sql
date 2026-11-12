-- Añadir columnas JSONB para traducciones n-dimensionales (inglés, francés) en las tablas principales

ALTER TABLE IF EXISTS public.tours ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;
ALTER TABLE IF EXISTS public.destinations ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;
ALTER TABLE IF EXISTS public.activities ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;
ALTER TABLE IF EXISTS public.blog_posts ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;
ALTER TABLE IF EXISTS public.collections ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- Ejemplo de estructura futura en translations:
-- {
--   "en": {
--     "title": "Desert Tour 3 Days", 
--     "description": "Awesome...", 
--     "itinerary_summary": "Marrakech - Merzouga" 
--   },
--   "fr": {
--     "title": "Circuit Désert...", 
--     "description": "Génial..."
--   }
-- }
