-- Traducción automática de Destinos / Categorías

UPDATE public.destinations SET translations = '{
  "en": { "name": "Excursions" },
  "fr": { "name": "Excursions" }
}'::jsonb WHERE id = '9d71f554-e4c7-4a87-9833-0ee8dcdc6b88';

UPDATE public.destinations SET translations = '{
  "en": { "name": "Routes from Fes" },
  "fr": { "name": "Circuits depuis Fès" }
}'::jsonb WHERE id = '9904823f-3b8c-4106-8e31-992ab38b374e';

UPDATE public.destinations SET translations = '{
  "en": { "name": "Marrakech" },
  "fr": { "name": "Marrakech" }
}'::jsonb WHERE id = '8385ba05-8a1e-4fa6-82c1-ad38f02101c9';

UPDATE public.destinations SET translations = '{
  "en": { "name": "Casablanca" },
  "fr": { "name": "Casablanca" }
}'::jsonb WHERE id = 'f939237a-0157-4aed-b4cd-5703f89b35f3';

UPDATE public.destinations SET translations = '{
  "en": { "name": "Tangier" },
  "fr": { "name": "Tanger" }
}'::jsonb WHERE id = 'eb32e5f0-f00c-4be6-b90a-fd1092feb4bd';
