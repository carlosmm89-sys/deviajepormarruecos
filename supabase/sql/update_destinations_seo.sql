-- SCRIPT FASE 2: CONTENIDO SEO ENRIQUECIDO PARA DESTINOS
-- Este script actualiza la descripción de los destinos principales para usar HTML enriquecido (H2, H3, P, UL).
-- El componente DestinationDetail.tsx creará automáticamente un Índice (TOC) a partir de los H2 y H3.

-- 1. MARRAKECH
UPDATE destinations 
SET description = '
<h2>La Ciudad Roja: Explorando Marrakech</h2>
<p>Marrakech, conocida como la "Ciudad Roja" debido al color de sus edificios emblemáticos y sus antiguas murallas, es un crisol de cultura, historia y vida vibrante. Situada a los pies de las majestuosas montañas del Atlas, esta antigua ciudad imperial cautiva los sentidos de quienes la visitan desde el primer momento.</p>

<h3>La Medina y sus Zocos Mágicos</h3>
<p>El corazón de Marrakech palpita en su Medina, declarada Patrimonio de la Humanidad por la UNESCO. Este intrincado laberinto de callejuelas es el hogar de los famosos zocos, donde artesanos locales ofrecen de todo, desde alfombras tejidas a mano y lámparas de intrincado diseño hasta ricas especias y cautivadoras cerámicas.</p>
<ul>
  <li>Zoco de las especias: Un paraíso olfativo lleno de azafrán, comino y mezclas ras el hanout.</li>
  <li>Zoco de los tintoreros: Un festín visual con lanas teñidas secándose al sol.</li>
  <li>Zoco de los curtidores: Donde las antiguas tradiciones de tratamiento del cuero siguen vivas.</li>
</ul>

<h3>La Plaza Jemaa el-Fna: Un Teatro al Aire Libre</h3>
<p>Nada prepara al visitante para la energía desbordante de la <strong>Plaza Jemaa el-Fna</strong>. A medida que cae la noche, este enorme espacio público se transforma en un bullicioso mercado nocturno y un inmenso escenario al aire libre poblado por músicos tradicionales, cuentacuentos, encantadores de serpientes y acróbatas.</p>

<h3>Arquitectura y Palacios Serenamente Majestuosos</h3>
<p>Para escapar de la intensidad de la Medina, los viajeros pueden refugiarse en los tranquilos confines de los espectaculares palacios y jardines de la ciudad.</p>
<p>El <strong>Palacio de la Bahía</strong> ("El Brillante") es una obra maestra de la arquitectura marroquí del siglo XIX, con sus impresionantes techos de cedro pintado, elaborados azulejos de zellige y patios andaluces repletos de vegetación exótica.</p>
<p>A las afueras de la medina antigua, los serenos <strong>Jardines Majorelle</strong> ofrecen un espectacular contraste azul intenso con su cuidada flora de origen global, una creación preservada posteriormente por Yves Saint Laurent.</p>

<h3>La Puerta al Sur y las Montañas del Atlas</h3>
<p>Marrakech no solo es un destino fascinante en sí misma, sino también el punto de partida ideal para excursiones inolvidables. Desde aquí, los picos nevados del Alto Atlas llaman a los excursionistas, mientras que las antiguas kasbahs de barro se erigen en la ruta hacia el desierto del Sahara.</p>
'
WHERE name ILIKE '%Marrakech%';


-- 2. DESIERTO (SAHARA/MERZOUGA)
UPDATE destinations 
SET description = '
<h2>El Sahara: La Inmensidad del Desierto de las Dunas</h2>
<p>Adentrarse en el Desierto del Sahara, específicamente en las doradas dunas de <strong>Erg Chebbi cerca de Merzouga</strong>, es embarcarse en un viaje de profundo silencio, inmensidad y belleza cruda. Este mar de arena promete la clásica e icónica experiencia marroquí de los relatos legendarios.</p>

<h3>La Experiencia Erg Chebbi</h3>
<p>Las dunas de Erg Chebbi son las más espectaculares de Marruecos, con algunas montañas de arena alcanzando impresionantes alturas de hasta 150 metros. El color de la arena cambia espectacularmente a lo largo del día, pasando de un rosa pálido y oro en la mañana a un rojo fuego profundo al atardecer.</p>
<ul>
  <li><b>Paseos en dromedario:</b> La forma más tradicional y silenciosa de cruzar el mar de dunas, siguiendo los pasos de las milenarias caravanas de sal.</li>
  <li><b>Sandboarding y aventura:</b> Para los amantes de la adrenalina, deslizarse por las escarpadas laderas o recorrerlas en quad ofrece una perspectiva diferente del desierto.</li>
</ul>

<h3>Noches Bajo las Estrellas</h3>
<p>Pocas experiencias se comparan con dormir en un campamento de lujo o tradicional bereber bajo la vasta bóveda estelar del Sahara.</p>
<p>Lejos de cualquier contaminación lumínica urbana, el cielo del desierto despliega la Vía Láctea con una claridad asombrosa. Las noches se enriquecen con la música tradicional de los tambores alrededor del fuego, el canto cautivador de los nómadas y la hospitalidad del pueblo bereber, compartiendo historias y té de menta caliente mientras la brisa del desierto susurra en las dunas circundantes.</p>

<h3>Las Kasbahs y los Oasis Aledaños</h3>
<p>En el borde de este océano de arena se encuentran paisajes igualmente evocadores. El Valle del Ziz deslumbra con su inmenso palmeral verde contrastando bruscamente con las áridas rocas geológicas. Las antiguas fortificaciones, o Kasbahs, hechas de adobe y paja, se alzan como guardianes del tiempo en la Ruta de las Mil Kasbahs, recordando a los viajeros las grandes rutas comerciales transaharianas de antaño.</p>
'
WHERE name ILIKE '%Desierto%' OR name ILIKE '%Merzouga%' OR name ILIKE '%Sahara%';


-- 3. FEZ
UPDATE destinations 
SET description = '
<h2>Fez: El Corazón Espiritual y Cultural de Marruecos</h2>
<p>Fez, la más antigua de las ciudades imperiales de Marruecos, es una metrópolis suspendida en el tiempo. Fundada en el siglo IX, es a la vez la capital espiritual del reino y su centro intelectual inconfundible. Fez, que alberga la universidad en funcionamiento más antigua del mundo, es un deslumbrante laberinto que desafía el sentido de la orientación pero recompensa inmensamente la curiosidad.</p>

<h3>La Inmensidad de Fes el-Bali</h3>
<p>La antigua medina, <strong>Fes el-Bali</strong>, es considerada la zona peatonal urbana contigua más grande del mundo. Recorrer sus más de 9,000 calles sin asfalto es retroceder en la historia. Los carros tirados por burros se abren paso entre la multitud gritando "Balak!" (¡Cuidado!), mientras los olores a pan recién horneado, maderas de cedro cortadas, menta fresca y especias picantes llenan el aire denso.</p>

<h3>El Arte del Cuero: Las Curtidurías de Chouara</h3>
<p>Una visita a Fez no está completa sin contemplar (y oler) la curtiduría de Chouara, uno de los lugares de procesamiento de cuero más antiguos del mundo. Operando de manera casi idéntica a como lo hacían en la época medieval, las vasijas redondas rebosan de vibrantes tintes naturales de azafrán, amapola y menta, donde hombres valientes sumergen y pisan pieles en un espectáculo de colores primarios al aire libre.</p>
<ul>
  <li>Madrasa Bou Inania: Un pináculo de la arquitectura meriní con intrincados mosaicos de zellige.</li>
  <li>Universidad y Mezquita de Al Quaraouiyine: Fundada el año 859 por Fatima al-Fihri, es el latido islámico y de aprendizaje intelectual del país.</li>
</ul>

<h3>Gastronomía Fassi: Los Sabores de las Dinastías</h3>
<p>La cocina fassi es reverenciada en todo el norte de África. Su plato insignia, la <i>Pastela (o Bastilla)</i> de pichón, encapsula perfectamente el complejo paladar de Fez: un intrincado equilibrio entre ingredientes sabrosos, la dulzura de la canela y el azúcar glassé, capas de frutos secos molidos envueltos en escamosa masa fina horneada al horno.</p>
'
WHERE name ILIKE '%Fez%' OR name ILIKE '%Fes%';


-- 4. CHEFCHAOUEN
UPDATE destinations 
SET description = '
<h2>Chefchaouen: La Joya Azul en las Montañas del Rif</h2>
<p>Anidada en lo alto de los picos escarpados de las montañas del Rif en el noroeste de Marruecos, <strong>Chefchaouen</strong> (o sencillamente Chaouen) es uno de los pueblos más pintorescos y visualmente deslumbrantes del mundo. Famosa a nivel global por sus edificios lavados en variados y deslumbrantes espectros de color azul, la ciudad irradia una atmósfera serena y mágica.</p>

<h3>El Misterio del Color Azul</h3>
<p>Caminar por las empinadas y sinuosas callejuelas empedradas de la medina de Chefchaouen es como moverse a través del agua pintada o perderse bajo un cielo constante. Las puertas, paredes, ventanas, escaleras y arcos estallan en una radiante paleta de tonos cerúleo, índigo, cian y azul empolvado. Las teorías sobre el origen de este color abundan: desde la idea de que ahuyenta a los mosquitos hasta las historias que relatan que la antigua comunidad judía de la ciudad introdujo la tonalidad como símbolo divino del cielo.</p>

<h3>Refugio Natural y Retiro Espiritual</h3>
<p>Pero el encanto de Chaouen va mucho más allá de su estética "instagrameable". Gracias a su altitud y el microclima que las montañas del Rif ofrecen, la ciudad respira calma, proporcionando un respiro de bienvenida al calor implacable de los llanos del sur de Marruecos.</p>
<ul>
  <li><b>Plaza Uta el-Hammam:</b> El centro social empedrado donde los lugareños beben té bajo la sombra de la gran Casba del siglo XV de ladrillos de arcilla roja.</li>
  <li><b>Ras El Maa:</b> Las cascadas de manantial en el extremo oriental donde las mujeres lavan las alfombras en el agua cristalina que brota directamente de la ladera de la montaña.</li>
</ul>

<h3>Aventuras en el Rif</h3>
<p>El terreno salvaje y escarpado que rodea la perla azul está maduro para el descubrimiento. Chefchaouen sirve como el principal punto de base estratégico para el excelente senderismo en el vecino Parque Nacional de Talassemtane. Los aventureros pueden caminar a lo largo de desfiladeros cubiertos de abetos y pinos, para llegar a maravillas naturales espectaculares, como la famosa formación de puente de roca conocida como el Puenta de Dios (God''s Bridge) cerca de la remota aldea de Akchour.</p>
'
WHERE name ILIKE '%Chefchaouen%' OR name ILIKE '%Chaouen%';
