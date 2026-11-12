-- Migration: Add JSONB translation columns for i18n support

-- 1. Add translations column to tours
ALTER TABLE public.tours 
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- 2. Add translations column to destinations
ALTER TABLE public.destinations 
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- 3. Add translations column to blog_posts
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- 4. Ensure existing rows have the empty JSON object instead of NULL
UPDATE public.tours SET translations = '{}'::jsonb WHERE translations IS NULL;
UPDATE public.destinations SET translations = '{}'::jsonb WHERE translations IS NULL;
UPDATE public.blog_posts SET translations = '{}'::jsonb WHERE translations IS NULL;

-- 5. Add comments for clarity
COMMENT ON COLUMN public.tours.translations IS 'Stores translated fields for multi-language support (e.g., {"en": {"title": "Tour English"}, "fr": {}})';
COMMENT ON COLUMN public.destinations.translations IS 'Stores translated fields for multi-language support';
COMMENT ON COLUMN public.blog_posts.translations IS 'Stores translated fields for multi-language support';
