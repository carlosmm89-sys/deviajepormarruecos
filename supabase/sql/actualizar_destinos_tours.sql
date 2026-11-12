DO $$ 
DECLARE
    v_chefchaouen uuid;
    v_erg_chebbi uuid;
    v_fez uuid;
    v_merzouga uuid;
    v_casablanca uuid := 'f939237a-0157-4aed-b4cd-5703f89b35f3';
    v_marrakech uuid := '8385ba05-8a1e-4fa6-82c1-ad38f02101c9';
    v_tanger uuid := 'eb32e5f0-f00c-4be6-b90a-fd1092feb4bd';
BEGIN
    -- 1. Insertar Destinos Faltantes
    INSERT INTO destinations (name, slug, description, image_url, featured)
    VALUES ('Chefchaouen', 'chefchaouen', 'La perla azul de Marruecos', 'https://images.unsplash.com/photo-1579004033324-4f0144f849cc?auto=format&fit=crop&q=80', true)
    ON CONFLICT (slug) DO NOTHING;
    SELECT id INTO v_chefchaouen FROM destinations WHERE slug = 'chefchaouen' LIMIT 1;

    INSERT INTO destinations (name, slug, description, image_url, featured)
    VALUES ('Desierto Erg Chebbi', 'desierto-erg-chebbi', 'Las majestuosas dunas del Sahara marroquí', 'https://images.unsplash.com/photo-1489493173507-6fece69f1db1?auto=format&fit=crop&q=80', true)
    ON CONFLICT (slug) DO NOTHING;
    SELECT id INTO v_erg_chebbi FROM destinations WHERE slug = 'desierto-erg-chebbi' LIMIT 1;

    INSERT INTO destinations (name, slug, description, image_url, featured)
    VALUES ('Fez', 'fez', 'La increíble medina de Fez, la capital cultural y espiritual', 'https://images.unsplash.com/photo-1587823528751-ac19e59d9551?auto=format&fit=crop&q=80', true)
    ON CONFLICT (slug) DO NOTHING;
    SELECT id INTO v_fez FROM destinations WHERE slug = 'fez' LIMIT 1;

    INSERT INTO destinations (name, slug, description, image_url, featured)
    VALUES ('Merzouga', 'merzouga', 'Puerta al desierto y hogar de la cultura bereber de las dunas', 'https://images.unsplash.com/photo-1510006767964-b0a7fbce2618?auto=format&fit=crop&q=80', true)
    ON CONFLICT (slug) DO NOTHING;
    SELECT id INTO v_merzouga FROM destinations WHERE slug = 'merzouga' LIMIT 1;

    -- 2. Vincular Destinos a los Tours
    -- Tour: Gran Tour de Marruecos de 13 Días (Todos los destinos)
    UPDATE tours SET destination_ids = jsonb_build_array(v_casablanca, v_chefchaouen, v_fez, v_merzouga, v_erg_chebbi, v_marrakech, v_tanger) 
    WHERE title ILIKE '%Gran Tour%';

    -- Tour: Ruta Norte a Sur: 8 Días de Tánger a Marrakech
    UPDATE tours SET destination_ids = jsonb_build_array(v_tanger, v_chefchaouen, v_fez, v_marrakech, v_casablanca) 
    WHERE title ILIKE '%Norte a Sur%';

    -- Tour de 9 días: Marrakech a Tánger
    UPDATE tours SET destination_ids = jsonb_build_array(v_marrakech, v_fez, v_chefchaouen, v_tanger) 
    WHERE title ILIKE '%Tour de 9 días: Marrakech a Tánger%';

    -- Tour 9 Días desde Marrakech hacia Tánger
    UPDATE tours SET destination_ids = jsonb_build_array(v_marrakech, v_merzouga, v_fez, v_chefchaouen, v_tanger) 
    WHERE title ILIKE '%9 Días desde Marrakech%';

    -- Tour 11 Días de Marrakech a Tánger
    UPDATE tours SET destination_ids = jsonb_build_array(v_marrakech, v_merzouga, v_fez, v_chefchaouen, v_tanger) 
    WHERE title ILIKE '%11 Días%';

    -- Tour 4 Días al Sahara
    UPDATE tours SET destination_ids = jsonb_build_array(v_marrakech, v_merzouga, v_erg_chebbi) 
    WHERE title ILIKE '%Sahara%';

    -- Viajes al desierto desde Marrakech (5 días, 8 días y 3 días)
    UPDATE tours SET destination_ids = jsonb_build_array(v_marrakech, v_merzouga, v_erg_chebbi) 
    WHERE title ILIKE '%al Desierto de Merzouga%';

    UPDATE tours SET destination_ids = jsonb_build_array(v_marrakech, v_merzouga, v_erg_chebbi) 
    WHERE title ILIKE '%Escapada de 3 Días a Merzouga%';

    -- Ruta de 5 Días de Marrakech a Fez
    UPDATE tours SET destination_ids = jsonb_build_array(v_marrakech, v_merzouga, v_erg_chebbi, v_fez) 
    WHERE title ILIKE '%Marrakech a Fez%';

END $$;
