-- Resetea las visitas de los Tours
UPDATE public.tours SET views = 0;

-- Resetea las visitas de los Destinos
UPDATE public.destinations SET views = 0;

-- Resetea las visitas de la Home (si aplica en la tabla de configuración)
UPDATE public.business_settings SET home_views = 0;
