-- Añade permisos para LEER imagenes (Público)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Añade permisos para SUBIR imagenes (Solo Admin/Autenticados)
CREATE POLICY "Auth Insert Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' );

-- Añade permisos para BORRAR/REEMPLAZAR (Solo Admin/Autenticados)
CREATE POLICY "Auth Update Access"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'images' );

CREATE POLICY "Auth Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'images' );
