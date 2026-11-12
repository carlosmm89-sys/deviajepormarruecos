-- Ejecutar en el SQL Editor de Supabase
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category text DEFAULT 'Blog';
UPDATE blog_posts SET category = 'Blog' WHERE category IS NULL;
