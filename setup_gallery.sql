-- TABLA PARA LA GALERÍA DE IMÁGENES MASONRY
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar RLS (Row Level Security)
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Cualquier persona puede ver las imágenes
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.gallery_images FOR SELECT 
USING ( true );

-- Solo los usuarios autenticados (Admin) pueden insertar, actualizar y eliminar
CREATE POLICY "Admins can insert images" 
ON public.gallery_images FOR INSERT 
WITH CHECK ( auth.role() = 'authenticated' );

CREATE POLICY "Admins can update images" 
ON public.gallery_images FOR UPDATE 
USING ( auth.role() = 'authenticated' );

CREATE POLICY "Admins can delete images" 
ON public.gallery_images FOR DELETE 
USING ( auth.role() = 'authenticated' );

-- NOTA IMPORTANTE PARA EL STORAGE:
-- Recuerda ir al panel de Supabase -> Storage -> New Bucket
-- Y crea un bucket llamado "gallery" con la opción "Public bucket" activada.
