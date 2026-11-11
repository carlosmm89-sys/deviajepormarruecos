-- Generación automática de traducciones (Inglés y Francés) para los Tours existentes

UPDATE public.tours SET translations = '{
  "en": {
    "title": "9-Day Tour: Marrakech to Tangier",
    "description": "Discover the magic of Morocco on this 9-day journey from Marrakech to Tangier.",
    "itinerary_summary": "9 Days / 8 Nights"
  },
  "fr": {
    "title": "Circuit de 9 Jours : Marrakech à Tanger",
    "description": "Découvrez la magie du Maroc lors de ce voyage de 9 jours de Marrakech à Tanger.",
    "itinerary_summary": "9 Jours / 8 Nuits"
  }
}'::jsonb WHERE id = '979c2415-6305-477f-b722-a453a99a75c5';

UPDATE public.tours SET translations = '{
  "en": {
    "title": "4-Day Sahara Desert Tour",
    "description": "Experience the stunning sand dunes and magical nights of the Sahara Desert.",
    "itinerary_summary": "4 Days / 3 Nights"
  },
  "fr": {
    "title": "Circuit 4 Jours au Sahara",
    "description": "Bivouac, dromadaires et nuits magiques au cœur du Sahara.",
    "itinerary_summary": "4 Jours / 3 Nuits"
  }
}'::jsonb WHERE id = '9f74d165-1ca5-4a83-961e-124ee4f766b9';

UPDATE public.tours SET translations = '{
  "en": {
    "title": "5-Day Route from Marrakech to Fes",
    "description": "Travel through the Atlas Mountains and the desert before reaching the cultural capital of Fes.",
    "itinerary_summary": "5 Days / 4 Nights"
  },
  "fr": {
    "title": "Circuit de 5 Jours de Marrakech à Fès",
    "description": "Traversez les montagnes de l''Atlas et le désert avant de rejoindre la capitale culturelle, Fès.",
    "itinerary_summary": "5 Jours / 4 Nuits"
  }
}'::jsonb WHERE id = 'e94ea028-5cf4-4aa6-82b5-a7648c7b726b';

UPDATE public.tours SET translations = '{
  "en": {
    "title": "North to South Route: 8 Days from Tangier to Marrakech",
    "description": "A comprehensive journey across Morocco, crossing the blue city, the desert, and the red city.",
    "itinerary_summary": "8 Days / 7 Nights"
  },
  "fr": {
    "title": "Route du Nord au Sud : 8 Jours de Tanger à Marrakech",
    "description": "Un voyage complet à travers le Maroc, de la ville bleue au désert et à la ville rouge.",
    "itinerary_summary": "8 Jours / 7 Nuits"
  }
}'::jsonb WHERE id = '2ce49d91-8740-40ad-8ead-82b147afcb6b';

UPDATE public.tours SET translations = '{
  "en": {
    "title": "9-Day Tour from Marrakech to Tangier",
    "description": "A magnificent tour weaving through the soul of Morocco.",
    "itinerary_summary": "9 Days / 8 Nights"
  },
  "fr": {
    "title": "Circuit de 9 Jours de Marrakech vers Tanger",
    "description": "Un circuit magnifique à travers l''âme du Maroc.",
    "itinerary_summary": "9 Jours / 8 Nuits"
  }
}'::jsonb WHERE id = 'b283028f-9123-4ab2-a000-b8b9946feddb';

UPDATE public.tours SET translations = '{
  "en": {
    "title": "11-Day Tour from Marrakech to Tangier",
    "description": "The ultimate adventure exploring the imperial cities, the coast, and the desert.",
    "itinerary_summary": "11 Days / 10 Nights"
  },
  "fr": {
    "title": "Circuit de 11 Jours de Marrakech à Tanger",
    "description": "L''aventure ultime pour explorer les villes impériales, la côte et le désert.",
    "itinerary_summary": "11 Jours / 10 Nuits"
  }
}'::jsonb WHERE id = 'cfff0f83-90fc-4960-b741-a3922b524937';

UPDATE public.tours SET translations = '{
  "en": {
    "title": "Grand Morocco Tour: 13 Days",
    "description": "Immerse yourself completely in the culture, gastronomy, and landscapes of Morocco.",
    "itinerary_summary": "13 Days / 12 Nights"
  },
  "fr": {
    "title": "Grand Circuit du Maroc : 13 Jours",
    "description": "Plongez entièrement dans la culture, la gastronomie et les paysages de tout le Maroc.",
    "itinerary_summary": "13 Jours / 12 Nuits"
  }
}'::jsonb WHERE id = 'f34861fb-a177-4fe9-ab91-a57a5389df95';

UPDATE public.tours SET translations = '{
  "en": {
    "title": "3-Day Getaway to Merzouga",
    "description": "A quick and intense escape to the majestic dunes of the Merzouga desert.",
    "itinerary_summary": "3 Days / 2 Nights"
  },
  "fr": {
    "title": "Escapade de 3 Jours à Merzouga",
    "description": "Une escapade rapide et intense vers les majestueuses dunes du désert de Merzouga.",
    "itinerary_summary": "3 Jours / 2 Nuits"
  }
}'::jsonb WHERE id = 'e7de179f-052a-4c87-89a0-cac6f2027385';

UPDATE public.tours SET translations = '{
  "en": {
    "title": "8-Day Route to the Merzouga Desert",
    "description": "A deeper exploration of the south, Berber villages, and starlit nights.",
    "itinerary_summary": "8 Days / 7 Nights"
  },
  "fr": {
    "title": "Circuit de 8 Jours dans le Désert de Merzouga",
    "description": "Une exploration approfondie du sud, de ses villages berbères et de ses nuits étoilées.",
    "itinerary_summary": "8 Jours / 7 Nuits"
  }
}'::jsonb WHERE id = '9c24a61e-864c-4403-b842-3f613d7fe1c8';

UPDATE public.tours SET translations = '{
  "en": {
    "title": "5-Day Trip to the Merzouga Desert",
    "description": "The perfect balance between exploring the Atlas valleys and resting in the Sahara dunes.",
    "itinerary_summary": "5 Days / 4 Nights"
  },
  "fr": {
    "title": "Voyage de 5 Jours dans le Désert de Merzouga",
    "description": "L''équilibre parfait entre l''exploration de l''Atlas et le repos dans le Sahara.",
    "itinerary_summary": "5 Jours / 4 Nuits"
  }
}'::jsonb WHERE id = '122084c1-a063-4f14-80aa-54a52141df12';
