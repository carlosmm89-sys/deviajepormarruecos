-- Ejecuta esto en Supabase SQL Editor para añadir la columna de múltiples destinos que falta.
-- También recargamos la caché del esquema por si se ha quedado atascado.

ALTER TABLE tours ADD COLUMN IF NOT EXISTS destination_ids jsonb DEFAULT '[]'::jsonb;

-- Recargar la caché (esto evita errores tontos donde supabase no detecta la columna nueva rápido)
NOTIFY pgrst, 'reload schema';
