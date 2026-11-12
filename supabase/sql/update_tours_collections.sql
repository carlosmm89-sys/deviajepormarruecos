-- SCRIPT FASE 1: ASIGNACIÓN DE CATEGORÍAS Y VERIFICACIÓN DE TOURS
-- Usa estos comandos para asignar rápidamente tus tours a las categorías (Colecciones) deseadas.
-- Asegúrate de cambiar 'Nombre exacto de tu tour' por el nombre real que pusiste en el Admin.

-- 1. ASIGNAR TOURS AL "NORTE DE MARRUECOS"
UPDATE tours 
SET category = 'Norte de Marruecos'
WHERE title ILIKE '%Chefchaouen%' OR title ILIKE '%Tanger%' OR title ILIKE '%Norte%';
-- (Opcional, manual) UPDATE tours SET category = 'Norte de Marruecos' WHERE title = 'Mi Tour Exacto';

-- 2. ASIGNAR TOURS AL "DESIERTO"
UPDATE tours 
SET category = 'Desierto'
WHERE title ILIKE '%Desierto%' OR title ILIKE '%Sahara%' OR title ILIKE '%Merzouga%';

-- 3. ASIGNAR TOURS A "CIUDADES IMPERIALES"
UPDATE tours 
SET category = 'Ciudades Imperiales'
WHERE title ILIKE '%Imperial%' OR title ILIKE '%Imperial Cities%';

-- 4. ASIGNAR TOURS A "LUNA DE MIEL" O "LUJO"
UPDATE tours 
SET category = 'Luna de Miel'
WHERE title ILIKE '%Luna de Miel%' OR title ILIKE '%Novios%';

UPDATE tours 
SET category = 'Viajes de Lujo'
WHERE title ILIKE '%Lujo%' OR title ILIKE '%Luxury%';

-- CON ESTO, TUS TOURS EMPEZARÁN A APARECER EN LAS PÁGINAS DE /coleccion/viajes-norte-de-marruecos, etc.
