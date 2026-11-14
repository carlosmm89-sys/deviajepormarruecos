-- Arregla el contador de visitas de la portada (panel → Inicio).
-- La versión anterior fallaba con «UPDATE requires a WHERE clause» y el contador nunca subía.
-- Ejecutar una vez en Supabase → SQL Editor.
CREATE OR REPLACE FUNCTION increment_home_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE business_settings SET home_views = COALESCE(home_views, 0) + 1 WHERE true;
END;
$$;
