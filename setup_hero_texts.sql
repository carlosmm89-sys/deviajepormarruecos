-- Ejecutar en el SQL Editor de Supabase
ALTER TABLE business_settings ADD COLUMN IF NOT EXISTS hero_title text;
ALTER TABLE business_settings ADD COLUMN IF NOT EXISTS hero_subtitle text;
