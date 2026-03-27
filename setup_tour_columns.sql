-- Ejecuta esto en Supabase SQL Editor para añadir los dos nuevos campos de regreso que hemos puesto en el formulario.
-- Esto solucionará el error 400 al intentar guardar un Tour, ya que la base de datos ahora aceptará estos datos.

ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS return_city text,
ADD COLUMN IF NOT EXISTS return_time text;
