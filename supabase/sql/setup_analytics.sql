-- 1. Añadir campos numéricos (Vistas)
ALTER TABLE tours ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE business_settings ADD COLUMN IF NOT EXISTS home_views INTEGER DEFAULT 0;

-- 2. Crear funciones atómicas de incremento para evitar condiciones de carrera (Race Conditions)
CREATE OR REPLACE FUNCTION increment_tour_views(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE tours SET views = views + 1 WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_dest_views(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE destinations SET views = views + 1 WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_home_views()
RETURNS void AS $$
BEGIN
  -- Incrementa todos (normalmente solo hay 1 fila en settings)
  UPDATE business_settings SET home_views = COALESCE(home_views, 0) + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
