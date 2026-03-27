-- Ejecuta esto en Supabase SQL Editor para arreglar las imágenes rotas con fotos reales del desierto funcionando 100%

UPDATE blog_posts 
SET cover_image = 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1200&auto=format&fit=crop' 
WHERE slug = 'sandboarding';

UPDATE blog_posts 
SET cover_image = 'https://images.unsplash.com/photo-1629807466487-25e225fb8ea3?q=80&w=1200&auto=format&fit=crop' 
WHERE slug = 'cuatrimotos-o-buggies-en-el-desierto';

UPDATE blog_posts 
SET cover_image = 'https://images.unsplash.com/photo-1504620888257-226e6c8ce755?q=80&w=1200&auto=format&fit=crop' 
WHERE slug = 'noche-en-el-campamento';

UPDATE blog_posts 
SET cover_image = 'https://images.unsplash.com/photo-1600742512613-2dc7a71dc1c1?q=80&w=1200&auto=format&fit=crop' 
WHERE slug = 'paseo-en-globo';
