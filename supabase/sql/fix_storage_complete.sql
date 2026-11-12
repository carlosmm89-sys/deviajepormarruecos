-- 1. Crear el bucket "images" si no existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Asegurarse de que las políticas no existan ya antes de crearlas
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Insert Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete Access" ON storage.objects;

-- 3. Crear políticas para lectura pública
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- 4. Crear políticas para escritura (solo usuarios autenticados)
CREATE POLICY "Auth Insert Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' );

-- 5. Crear políticas para actualizar o borrar sus imágenes
CREATE POLICY "Auth Update Access"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'images' );

CREATE POLICY "Auth Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'images' );
