-- Contenidos SEO para vivirmarruecos.com
-- Ejecutar una vez en Supabase (SQL Editor). Es seguro repetirlo.
-- Todo esto también se puede editar después desde el panel de administración.

-- 1. Portada: título principal (H1) y subtítulo (también se usa como descripción en Google)
UPDATE public.business_settings
SET hero_title    = 'Tours privados por Marruecos y el desierto de Merzouga',
    hero_subtitle = 'Rutas a medida desde Marrakech, Fez, Tánger y Casablanca, con noche en jaima en las dunas de Erg Chebbi. Agencia local con base en Merzouga.';

-- 2. Slug sin tilde (las URLs con tildes dan problemas al compartirlas)
UPDATE public.tours
SET slug = 'ruta-de-9-dias-desde-marrakech-hacia-tanger'
WHERE slug = 'ruta-de-9-días-desde-marrakech-hacia-tanger';

-- 3. Nombre del destino de excursiones (tenía un espacio al final)
UPDATE public.destinations SET name = 'Excursiones de un día' WHERE slug = 'excursiones-cortas';

-- 4. Textos de destinos

UPDATE public.destinations SET description = $html$
<p><strong>Merzouga es la puerta del Sáhara en Marruecos</strong>: un pequeño pueblo al pie de las dunas de <strong>Erg Chebbi</strong>, el mar de arena más famoso del país, con dunas que superan los 150 metros de altura. Aquí estamos nosotros: Vivir Marruecos es una agencia local con base en <strong>Hassi Labied</strong>, a pocos kilómetros de Merzouga, al pie de las dunas.</p>

<h2>Qué hacer en Merzouga</h2>
<ul>
  <li><strong>Paseo en dromedario al atardecer</strong> hasta el campamento entre las dunas.</li>
  <li><strong>Noche en jaima</strong> en el desierto: cena, música alrededor del fuego y un cielo lleno de estrellas.</li>
  <li><strong>Amanecer desde lo alto de las dunas</strong>, uno de los momentos más especiales del viaje.</li>
  <li><strong>Quads, buggies y sandboarding</strong> en las dunas de Erg Chebbi.</li>
  <li><strong>Khamlia</strong>, el pueblo de la música gnawa, y el <strong>mercado de Rissani</strong>.</li>
  <li><strong>Ruta en 4x4 alrededor de las dunas</strong>: antiguas minas, oasis y familias nómadas.</li>
</ul>

<h2>Cómo llegar a Merzouga</h2>
<p>Merzouga está a unos 560 km de Marrakech y a unos 470 km de Fez. Lo habitual es hacer el viaje por etapas, con paradas en lugares como Aït Ben Haddou, el valle del Dades o las gargantas del Todra desde Marrakech, o el Atlas Medio y el valle del Ziz desde Fez. Por eso nuestros tours al desierto duran de 3 días en adelante, siempre con <strong>vehículo privado y conductor de habla española</strong>.</p>

<h2>Mejor época para viajar</h2>
<p>De octubre a abril las temperaturas son agradables de día, aunque las noches de invierno son frías. En verano el calor es intenso a mediodía: las actividades se hacen a primera hora y al atardecer.</p>

<p>¿Quieres conocer el desierto? Mira nuestros tours desde <a href="/destinations/rutas-desde-marrakech">Marrakech</a>, <a href="/destinations/rutas-desde-fez">Fez</a>, <a href="/destinations/rutas-desde-tanger">Tánger</a> o <a href="/destinations/rutas-desde-casablanca">Casablanca</a>, o pídenos un presupuesto a medida.</p>
$html$ WHERE slug = 'merzouga';

UPDATE public.destinations SET description = $html$
<p><strong>Erg Chebbi</strong> es el gran desierto de dunas de Marruecos: más de 20 km de dunas de arena anaranjada junto a Merzouga, algunas de más de 150 metros de altura. Es el lugar donde se duerme en jaima y se ve el amanecer del Sáhara.</p>

<h2>Experiencias en las dunas de Erg Chebbi</h2>
<ul>
  <li><strong>Campamentos en el desierto</strong>, desde jaimas sencillas hasta campamentos de lujo con baño privado.</li>
  <li><strong>Travesía en dromedario</strong> al atardecer y al amanecer.</li>
  <li><strong>Sandboarding</strong>, quads y buggies.</li>
  <li><strong>Cena y música tradicional</strong> bajo las estrellas.</li>
</ul>

<p>Somos de aquí: nuestra base está en Hassi Labied, al pie de las dunas de Erg Chebbi. Descubre más sobre <a href="/destinations/merzouga">Merzouga</a> o mira nuestros <a href="/coleccion/desierto">viajes al desierto</a>.</p>
$html$ WHERE slug = 'desierto-erg-chebbi';

UPDATE public.destinations SET description = $html$
<p><strong>Fez</strong> es la ciudad imperial más antigua de Marruecos y su capital cultural. Su medina, <strong>Fez el-Bali</strong>, es Patrimonio de la Humanidad y uno de los mayores laberintos de calles peatonales del mundo.</p>

<h2>Qué ver en Fez</h2>
<ul>
  <li><strong>La curtiduría de Chouara</strong>, con sus cubas de colores.</li>
  <li><strong>La universidad de Al Qarawiyyin</strong>, fundada en el siglo IX.</li>
  <li><strong>La madrasa Bou Inania</strong> y la puerta azul de <strong>Bab Bou Jeloud</strong>.</li>
  <li><strong>Los zocos de artesanos</strong>: cobre, cerámica, cuero y telares.</li>
</ul>

<h2>De Fez al desierto</h2>
<p>Fez es un punto de salida muy cómodo hacia el desierto de Merzouga: la ruta cruza el Atlas Medio, los bosques de cedros de Azrou y el valle del Ziz. También se combina fácilmente con <a href="/destinations/chefchaouen">Chefchaouen</a>. Mira nuestras <a href="/destinations/rutas-desde-fez">rutas desde Fez</a>.</p>
$html$ WHERE slug = 'fez';

UPDATE public.destinations SET description = $html$
<p><strong>Chefchaouen</strong>, el pueblo azul del Rif, es uno de los lugares más fotogénicos de Marruecos: calles y escaleras pintadas de azul, montañas alrededor y un ambiente tranquilo.</p>

<h2>Qué ver en Chefchaouen</h2>
<ul>
  <li><strong>La plaza Uta el-Hammam</strong> y la alcazaba.</li>
  <li><strong>Ras el Maa</strong>, el manantial a la entrada de la medina.</li>
  <li><strong>El mirador de la mezquita española</strong>, ideal al atardecer.</li>
</ul>

<p>Chefchaouen está bien comunicado con Tánger y Fez, por eso es una parada habitual en nuestras rutas por el <a href="/coleccion/norte-de-marruecos">norte de Marruecos</a> y en los tours desde <a href="/destinations/rutas-desde-tanger">Tánger</a> y <a href="/destinations/rutas-desde-fez">Fez</a>.</p>
$html$ WHERE slug = 'chefchaouen';

UPDATE public.destinations SET description = $html$
<p><strong>Tours privados desde Casablanca</strong>: ciudades imperiales, el Atlas y el desierto de Merzouga, con vehículo privado y conductor de habla española. Te recogemos en tu hotel o en el aeropuerto Mohammed V.</p>

<h2>Por qué empezar el viaje en Casablanca</h2>
<p>Casablanca es la principal puerta de entrada aérea a Marruecos. Desde aquí se llega en pocas horas a Rabat, Fez o Marrakech, así que es un buen punto de partida para una ruta circular por el país.</p>

<h2>Qué ver en Casablanca</h2>
<ul>
  <li><strong>La mezquita Hassan II</strong>, junto al océano, una de las más grandes del mundo.</li>
  <li><strong>La Corniche</strong> y el barrio de los <strong>Habous</strong>.</li>
</ul>

<h2>Rutas desde Casablanca</h2>
<p>La ruta más completa recorre Rabat, Meknes y Fez, cruza el Atlas hasta el desierto de <a href="/destinations/merzouga">Merzouga</a> y termina en Marrakech. Dinos tus fechas y te preparamos el itinerario a medida.</p>
$html$ WHERE slug = 'rutas-desde-casablanca';

UPDATE public.destinations SET description = $html$
<p><strong>Tours privados desde Tánger</strong>: el norte de Marruecos, Chefchaouen, Fez y el desierto de Merzouga, con vehículo privado y conductor de habla española. La opción ideal si llegas en ferry desde España.</p>

<h2>Cómo llegar a Tánger desde España</h2>
<p>Hay ferris desde Tarifa al puerto de Tánger Ciudad y desde Algeciras a Tánger Med. Te esperamos en el puerto o en tu hotel para empezar la ruta.</p>

<h2>Qué ver en Tánger y alrededores</h2>
<ul>
  <li><strong>La kasbah y la medina</strong>, con vistas al Estrecho.</li>
  <li><strong>Cabo Espartel</strong> y las <strong>Cuevas de Hércules</strong>.</li>
  <li><strong>Tetuán</strong> y el pueblo azul de <a href="/destinations/chefchaouen">Chefchaouen</a>.</li>
</ul>

<h2>Rutas desde Tánger</h2>
<p>Las rutas más populares bajan por Chefchaouen y <a href="/destinations/fez">Fez</a> hasta el desierto de <a href="/destinations/merzouga">Merzouga</a> y terminan en Marrakech. Mira nuestros tours o pídenos un presupuesto a medida.</p>
$html$ WHERE slug = 'rutas-desde-tanger';
