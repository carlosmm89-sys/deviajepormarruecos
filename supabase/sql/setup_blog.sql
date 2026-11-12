-- ==============================================================================
-- SCHEMA: Blog Posts
-- DESCRIPTION: SEO-optimized articles for organic traffic generation
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    author TEXT DEFAULT 'Marruecos Experiencia',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    is_published BOOLEAN DEFAULT true,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS Policies
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users on published posts" 
ON public.blog_posts FOR SELECT USING (is_published = true);

CREATE POLICY "Enable all access for authenticated admins" 
ON public.blog_posts FOR ALL USING (auth.role() = 'authenticated');

-- Views RPC
CREATE OR REPLACE FUNCTION increment_blog_views(row_id UUID) RETURNS void AS $$
BEGIN UPDATE blog_posts SET views = views + 1 WHERE id = row_id; END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- INSERT 6 SEO-OPTIMIZED ARTICLES
-- TARGET KEYWORDS: "Es seguro viajar a Marruecos", "Qué llevar al desierto", "Mejor época Marruecos", "Ait Ben Haddou", "Gastronomía", "Zocos Marrakech"
-- ==============================================================================

INSERT INTO public.blog_posts (slug, title, excerpt, content, cover_image) VALUES
(
    'es-seguro-viajar-marruecos-2026', 
    '¿Es Seguro Viajar a Marruecos en 2026? Guía Completa', 
    'Desmitificamos la seguridad en Marruecos. Descubre consejos, normas no escritas y la realidad sobre viajar por el país magrebí tanto en grupo como en pareja o solas.', 
    '<p>Marruecos es uno de los destinos más exóticos y fascinantes a tan solo unas horas de Europa, pero la pregunta más frecuente entre los nuevos viajeros siempre es la misma: <strong>¿Es seguro viajar a Marruecos?</strong></p><h2>La Realidad de la Seguridad en Marruecos</h2><p>La respuesta corta es <strong>absolutamente SÍ</strong>. Marruecos es uno de los países más políticamente estables del norte de África. El gobierno depende fuertemente del turismo, por lo que invierten enormes recursos en la "Police Touristique" (Policía Turística), diseñada exclusivamente para proteger e informar a los visitantes en las principales ciudades.</p><h3>Viajar en Solitario o como Mujer</h3><p>Marruecos es muy acogedor. Las mujeres que viajan solas, en pareja o en grupos de amigas pueden moverse con total normalidad, aunque es recomendable vestir de forma conservadora (cubriendo hombros y rodillas) por respeto cultural y para evitar miradas innecesarias. El acoso callejero severo no es habitual, aunque en zonas densas como los zocos puedes recibir comentarios insistentes para entrar a las tiendas.</p><h3>Nuestros 4 Mejores Consejos</h3><ul><li><strong>Contrata guías oficiales:</strong> En las medinas laberínticas como Fez o Marrakech, un guía licenciado evitará que te pierdas.</li><li><strong>Agua embotellada siempre:</strong> Para evitar problemas estomacales por bacterias a las que no estás acostumbrado.</li><li><strong>Regatea con una sonrisa:</strong> El regateo es parte de la cultura, no te lo tomes como un ataque.</li><li><strong>Cuidado al fotografiar personas:</strong> Especialmente a mujeres y ancianos, pregunta siempre primero.</li></ul><p><em>En <strong>Marruecos Experiencia</strong> nos aseguramos de que cada kilómetro sea 100% seguro. Nuestros circuitos guiados incluyen conductores locales certificados que conocen cada rincón, garantizando una paz mental absoluta durante tu viaje.</em></p>',
    'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2676&auto=format&fit=crop'
),
(
    'mejor-epoca-para-viajar-marruecos', 
    '¿Cuál es la Mejor Época para Viajar a Marruecos?', 
    'El clima en Marruecos varía drásticamente desde las altas montañas del Atlas hasta el Sáhara. Te contamos cuál es el mes perfecto para tu aventura.', 
    '<p>El clima marroquí es un mosaico de contrastes. Planificar <strong>la mejor época para viajar a Marruecos</strong> determinará en gran medida las prendas de tu maleta y el tipo de excursión que podrás realizar con comodidad. Aquí desglosamos el año temporada por temporada.</p><h2>Primavera (Marzo - Mayo): La Época Dorada 🌸</h2><p>Para la mayoría, es el momento óptimo. Las temperaturas durante el día oscilan entre los deliciosos 20°C y 25°C. La nieve se derrite en el Alto Atlas, creando cascadas espectaculares en el Valle de Ourika, y el desierto de Merzouga aún no ha alcanzado su calor asfixiante del pleno verano. Es perfecto si buscas acampar en jaimas bajo las estrellas sin congelarte ni derretirte.</p><h2>Otoño (Septiembre - Noviembre): Nuestro Favorito 🍂</h2><p>El calor del alto verano disminuye. Es el momento perfecto para visitar la costa (Essaouira, Agadir) o perderse en las callejuelas rojas de Marrakech sin aglomeraciones excesivas. Los cielos suelen estar increíblemente limpios, ofreciendo los mejores atardeceres para la fotografía.</p><h2>Invierno (Diciembre - Febrero): Magia en el Atlas ❄️</h2><p>Aunque no lo creas, ¡en Marruecos nieva! Mientras ciudades como Marrakech mantienen unos agradables 18°C diurnos, las noches pueden descender drásticamente (incluso a 0°C en el desierto). Si viajas en invierno, nuestra recomendación es aprovechar para visitar el sur, pero ve siempre abrigado con chaquetas térmicas para la noche.</p><h2>Verano (Junio - Agosto): Calor Extremo ☀️</h2><p>El verano es duro. En el interior (Fez, Marrakech) y el desierto, las temperaturas superan fácilmente los 40°C. Si solo puedes viajar en agosto, centra tu itinerario en la brisa de la costa atlántica o en las altas poblaciones del Atlas como Imlil.</p>',
    'https://images.unsplash.com/photo-1579005086259-8390b14cd42c?q=80&w=2574&auto=format&fit=crop'
),
(
    'que-llevar-maleta-al-desierto-sahara', 
    'Equipaje Perfecto: Qué Llevar en tu Maleta para el Desierto del Sáhara', 
    'Hacer la maleta para el desierto puede ser confuso. ¿Frío u calor extremo? Descubre la checklist definitiva para que no te falte (ni sobre) equipaje en Merzouga.', 
    '<p>Pasar una noche en el majestuoso <strong>Desierto del Sáhara</strong> es, sin duda, una de las experiencias más increíbles que puedes vivir con Marruecos Experiencia. Sin embargo, la preparación varía enormemente respecto a unas vacaciones de playa convencionales.</p><h3>La Magia de la Capas (El Método Cebolla)</h3><p>El desierto tiene un clima extremo. Puede arder a 35°C a las dos de la tarde y descender a unos helados 5°C de madrugada (o menos si viajas en invierno). El truco está en llevar capas fáciles de poner y quitar.</p><h3>Checklist de Equipaje Esencial</h3><ul><li><strong>1. Calzado cerrado y cómodo:</strong> Las dunas de fina arena naranja se colarán en todas partes, unas botas ligeras o deportivas de tela transpirable son imprescindibles.</li><li><strong>2. Pañuelo o Turbante largo:</strong> No es postureo. Los guías te enseñarán a enrollarlo para proteger tu nariz, boca y orejas de posibles tormentas de arena (muy ligeras) y del sol directo.</li><li><strong>3. Gafas y Llantas Solares de protección:</strong> El sol se refleja en la arena amplificando su intensidad.</li><li><strong>4. Batería Portátil (Powerbank):</strong> Nuestras haimas en Campamentos VIP tienen tomas de corriente, pero durante la ruta en camello gastarás muchísima batería en fotos y videos.</li><li><strong>5. Botiquín Básico:</strong> Ibuprofeno, tiritas para rozaduras, protector labial (el aire reseca muchísimo) y crema hidratante espesa.</li></ul><p>No sobre-empaques. En Marruecos Experiencia disponemos de un gran espacio en nuestros 4x4, pero viajar ligero siempre te dará más comodidad y flexibilidad cuando hagas paradas por la Ruta de las Mil Kasbahs camino al Sáhara.</p>',
    'https://images.unsplash.com/photo-1540304603310-023a105c30fb?q=80&w=2674&auto=format&fit=crop'
),
(
    'guia-gastronomica-marruecos-platos-tipicos', 
    'Sabor a Especias: Los 7 Platos Típicos Que Debes Comer en Marruecos', 
    'Más allá del cuscús. Una ruta gastronómica por los sabores más exquisitos, exóticos y callejeros de la cocina tradicional marroquí que enamorarán tu paladar.', 
    '<p>La comida marroquí es un paraíso para el sentido del gusto. Una mezcla de influencias árabes, andaluzas, francesas y bereberes crean sabores profundos donde las especias dulces y saladas conviven en armonía (es famoso el uso del <em>Ras el Hanout</em>). Si viajas a Marruecos, de verdad, <strong>olvídate de la dieta</strong> y prueba todo esto.</p><h2>1. El Tagine (o Tayín)</h2><p>Más que una receta, es el recipiente de barro cocido con tapa cónica donde se prepara a fuego lentísimo. Los clásicos son el Tagine de Cordero con ciruelas y almendras tostadas (una explosión agridulce) y el de Pollo al limón confitado y aceitunas. La carne queda tan suave que se deshace y se come utilizando el pan a modo de cuchara.</p><h2>2. Couscous de los Viernes</h2><p>El plato nacional absoluto. Tradicionalmente se come en familia todos los viernes después de la oración de mediodía. Su base es de finísima sémola de trigo cocida milimétricamente al vapor, coronada con verduras estofadas grandiosas (nabo, calabaza, zanahoria) y, normalmente, pollo o ternera.</p><h2>3. Pastilla (La joya de Fez)</h2><p>El plato más sorprendente y gourmet. Un hojaldre crujiente hiper-fino (pasta <em>warka</em>) relleno de carne de paloma o pollo, cocinado con almendras picadas, canela, azafrán y recubierto con enorme cantidad de azúcar glasé. Contraste puro.</p><h2>4. Harira (La Sopa que revive)</h2><p>Suele romper el ayuno diario durante el Ramadán. Esta sopa gruesa está hecha de lentejas, garbanzos, trocitos de carne roja picada, tomate muy condimentado y fideos. Viene acompañada siempre de dátiles y <em>Chebakia</em> (dulces fritos de sésamo y miel).</p><h2>5. El Whiskey Bereber (Té a la menta)</h2><p>El símbolo absoluto de hospitalidad. Es una infusión a base de té verde tipo gunpowder, cargado astronómicamente de azúcar y un ramo inmenso de hierbabuena fresca. Ver a alguien escanciarlo alzando la tetera a veces a casi 1 metro de distancia es un espectáculo hipnótico.</p>',
    'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=2564&auto=format&fit=crop'
),
(
    'ait-ben-haddou-escenario-hollywood', 
    'Ait Ben Haddou: El Pueblo de Arcilla que Enamoró a Hollywood', 
    'Gladiator, Juego de Tronos, La Momia... ¿Qué tiene esta Kasbah milenaria del sur de Marruecos para ser el escenario favorito de los cineastas mundiales?', 
    '<p>En medio de las áridas faldas del Atlas marroquí, alzándose espectacular en tonos terracota rojizos, se erige el <em>Ksar</em> de <strong>Ait Ben Haddou</strong>. Es uno de los poblados fortificados de arcilla mejor conservados del planeta, protegido y declarado <strong>Patrimonio de la Humanidad por la UNESCO</strong> en 1987.</p><h2>Una joya de la Ruta de las Mil Kasbahs</h2><p>Históricamente, este pueblo fue el epicentro de comercio mercantil más importante de las antiguas rutas de las caravanas que transportaban oro, sal y esclavos desde el Sáhara profundo atravesando Marrakech. Sus estrechos callejones en cuesta, flanqueados por muros de adobe y techados de caña con diseños geométricos en la arcilla, parecen detenidos en un espejismo temporal.</p><h2>El "Ouallywood" de África</h2><p>Desde la lejanía sobre el río Ounila, su imagen impone tanto que Hollywood fijó en él un centro de rodaje gigantesco. <strong>Ridley Scott</strong> construyó aquí la arena principal de esclavos donde Máximo se da a conocer en <em>Gladiator</em>; pero también se han filmado joyas como <em>Lawrence de Arabia</em>, <em>El Reino de los Cielos</em>, <em>La Momia</em>, y apareció majestuosamente representado como la ciudad esclavista de Yunkai en <strong>Juego de Tronos</strong>. Al pasear por él, literalmente pisarás los pasos de Russell Crowe o Emilia Clarke.</p><h2>Consejos para visitarlo con nosotros</h2><p>Todos nuestros Tours hacia el Desierto desde Marrakech incluyen siempre la visita (imprescindible) a Ait Ben Haddou. La mejor recomendación es trepar hasta el enorme torreón (el granero viejo) que corona el cerro de la zona alta. Las vistas aéreos de los huertos que limitan la fortaleza contrastando con lo pedregoso del terreno conforman una de las fotos panorámicas más demandadas por todos los viajeros.</p>',
    'https://images.unsplash.com/photo-1549487190-766b539951f2?q=80&w=2670&auto=format&fit=crop'
),
(
    'secretos-del-zoco-marrakech-regateo', 
    'Supervivencia en el Zoco de Marrakech: 5 Claves para Regatear como un Local', 
    'Entrar en los zocos de las medinas marroquíes es un viaje en el tiempo. Sumérgete en olores infinitos y descubre cómo comprar a precios justos dominando el arte del regateo.', 
    '<p>Marrakech no se entiende sin su medina y sus laberínticos zocos (souks). Son mercados medievales repletos de vida, ruido, especias de olores magnéticos, mulas de carga sorteando gente, lámparas de cristal de colores iluminando los pasillos de tela, marroquineros creando bolsos a la vieja usanza... Es el caos más maravilloso en el que te podrás sumergir.</p><h2>Entiende la regla de oro: El regateo no es pelear, es charlar</h2><p>En occidente vemos el regateo como algo tenso, una guerra por ahorrarnos unos euros. En Marruecos es un acto social de puro respeto; es jugar a dialogar. Los comerciantes valoran que interactúes con ellos, y ofenderles pagando el primer precio es casi saltarse un trámite amistoso.</p><h3>La Guía del Regateo Justo (Paso a Paso)</h3><ul><li><strong>1. No preguntes precios si no quieres comprar:</strong> Parecen amables, y lo son, pero dedican mucho esfuerzo y tiempo en su trabajo. Si muestras interés desmesurado en un tajín de cerámica y pides precio, el juego arranca obligatoriamente.</li><li><strong>2. Regla del Tercio y la División:</strong> Cuando un mercader te diga el primer precio de un objeto, de antemano suele estar inflado entre un x3 y un x4 (porque descuentan que eres turista). Responde soltando entre el 25% y el 35% de esa primera cifra. El tenderá a rebajar un poco, tú debes subir un poco. Se suelen encontrar en el término cercano al 50%.</li><li><strong>3. Si se frustra, aléjate con amabilidad:</strong> La técnica infalible y final. Si estáis clavados en el precio máximo y tú no quieres pagar más de "100 Dirhams", dale las gracias con elegancia y comienza a andar lento fuera de la tienda. Si el precio era de verdad muy bajo y él perdía dinero, te dejará marchar. Si no era así, un rápido <em>"My friend, come here... Ok, for you 100!"</em> resonará a tu espalda.</li></ul><p><em>En los tours que realizáis por las ciudades imperiales, nuestros conductores te advertirán en qué zonas es más seguro o inteligente detenerse a comprar para llevar a casa la mejor artesanía real, no hechas de molde importadas a última hora.</em></p>',
    'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2673&auto=format&fit=crop'
)
ON CONFLICT (slug) DO UPDATE 
SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content = EXCLUDED.content, cover_image = EXCLUDED.cover_image;
