-- Ejecutar en el SQL Editor de Supabase:
ALTER TABLE tours ADD COLUMN IF NOT EXISTS destination_ids jsonb DEFAULT '[]'::jsonb;

-- Copiar el destino principal actual al nuevo array para no perder datos
UPDATE tours 
SET destination_ids = jsonb_build_array(destination_id) 
WHERE destination_id IS NOT NULL AND jsonb_array_length(destination_ids) = 0;
