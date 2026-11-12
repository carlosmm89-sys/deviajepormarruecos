-- Supabase SQL script to insert 6 high-quality premium blog posts
-- Make sure to run this via the Supabase Admin SQL Editor

INSERT INTO blog_posts (slug, category, title, excerpt, content, cover_image, author, published_at, is_published, views)
VALUES 
(
  'que-ver-en-marrakech-en-3-dias',
  'Guías de Viaje',
  'Qué ver en Marrakech en 3 días: El itinerario definitivo',
  'Descubre el lado más vibrante de Marrakech con este itinerario imprescindible para un fin de semana largo lleno de encanto y exotismo en la Ciudad Roja.',
  '<p>Marrakech es una ciudad que despierta los sentidos desde el primer momento en que asomas por la Medina. Para aprovechar al máximo tus 3 días, te proponemos un itinerario pensado para enamorarte de la <em>Ciudad Roja</em>.</p>
  <h3>Día 1: El Corazón de la Medina</h3>
  <p>Comienza tu viaje en la vibrante Plaza Jemaa el-Fna. Déjate atrapar por los encantadores de serpientes, los puestos de jugo fresco y adéntrate en los zocos. Piérdete (literalmente) por sus estrechos callejones donde artesanos y tejedores exponen su trabajo. Por la tarde, visita la emblemática Mezquita Koutoubia y termina cenando en una de las terrazas con vistas a la plaza, un espectáculo para recordar.</p>
  <h3>Día 2: Palacios y Relajación</h3>
  <p>Aprovecha la mañana para descubrir la riqueza arquitectónica del Palacio de la Bahía y las Tumbas Saadíes. Maravíllate con la artesanía de los techos tallados en madera de cedro y los azulejos de zellij. Luego, desconecta del bullicio disfrutando de un auténtico hammam marroquí, un baño de vapor ritual que renovará cuerpo y mente.</p>
  <h3>Día 3: Oasis en la Ciudad</h3>
  <p>El último día reserva una visita a los bellísimos Jardines Majorelle, el colorido retiro de Yves Saint Laurent que te transportará a un ambiente de tranquilidad. Por la tarde, piérdete en la contemporaneidad de la Ville Nouvelle, donde podrás comprar recuerdos únicos antes del retorno.</p>',
  '/images/blog/marrakech.png',
  'Marruecos Experiencia',
  NOW(),
  true,
  0
),
(
  'desierto-merzouga-o-zagora',
  'Consejos Locales',
  'Desierto de Merzouga o Zagora: ¿Cuál elegir para tu viaje?',
  'Analizamos las diferencias clave entre las dunas doradas de Merzouga y las áridas extensiones de Zagora para guiarte hacia tu vivencia sahariana perfecta.',
  '<p>Una de las preguntas más frecuentes al planificar un viaje a Marruecos es en qué zona del desierto vivir la mágica experiencia del campamento beduino. Principalmente, existen dos opciones populares: <strong>Erg Chebbi (Merzouga)</strong> y <strong>Erg Chigaga (Zagora)</strong>.</p>
  <h3>Merzouga (Erg Chebbi): Las dunas inmensas</h3>
  <p>Si la imagen que tienes en mente son grandes dunas de arena rojiza ondulantes hasta el horizonte (a veces superando los 150 metros de altura), Merzouga es tu destino. Ideal para los que buscan la auténtica postal que evocan películas del Sahara. Sin embargo, dada su lejanía desde Marrakech (a un promedio de 9-10 horas), requerirás de al menos 3 días para un viaje de ida y vuelta con comodidad.</p>
  <h3>Zagora: El desierto árido y cercano</h3>
  <p>Situado más cerca de Marrakech, llegar a Zagora toma alrededor de 7 horas en total, por lo que una escapada express de 2 días y 1 noche sí es viable. Ahora bien, Zagora carece de las gigantes dunas características. Su desierto es más bien árido y pedregoso, aunque cuenta con hermosos oasis y ofrece igualmente el espectacular manto de estrellas nocturno.</p>
  <p><strong>El Veredicto:</strong> Si cuentas con tiempo y quieres sumergirte entre impresionantes colinas de arena, opta por Merzouga, es sin duda una experiencia inolvidable. Si corres contra el reloj, Zagora es una excelente y muy accesible bocanada de sahara.</p>',
  '/images/blog/desert.png',
  'Marruecos Experiencia',
  NOW(),
  true,
  0
),
(
  'gastronomia-marroqui-platos-tipicos',
  'Cultura y Tradición',
  'La gastronomía marroquí: 5 Platos tradicionales exquisitos',
  'Un viaje culinario por Marruecos a través del paladar. Conoce los tajines, el cuscús y los dulces que han enamorado al mundo entero.',
  '<p>Marruecos no solo es un festín visual de colores, texturas y arquitectura magnífica, su <strong>oferta culinaria es una de las más ricas del norte africano</strong>. Los intensos aromas de especias y la fusión dulce-salado hacen de su comida toda una experiencia para los viajeros.</p>
  <h3>1. El Tajine</h3>
  <p>Es, indiscutiblemente, el plato omnipresente. El Tajine (que toma su nombre de la distintiva cazuela cónica de barro en la que se cocina a fuego superlento) es un estofado especiado sensacional que puede ser pollo con limones encurtidos y olivas, o bien cordero glaseado con ciruelas y almendras tostadas. Exquisito.</p>
  <h3>2. El Cuscús Tradicional</h3>
  <p>Para los marroquíes, el cuscús es algo casi sagrado que se consume en su versión más elaborada los viernes (el día sagrado del mundo islámico) luego de los oficios y al reunirse las familias. Es semolina trabajada al vapor incansablemente junto a caldos aromáticos, vegetales asados, legumbres y tiernas piezas de carne.</p>
  <h3>3. Pastilla (La Bastila)</h3>
  <p>La máxima sorpresa para quienes lo descubren por primera y genial vez. Es una tarta envuelta en papel filo, crujiente, horneada; pero tradicionalmente está rellena con carne de paloma, pichón o pollo confitado, con una rica mezcla de perfiles muy dulces coronada con una generosa espolvoreada de azúcar glas y canela en la cubierta. Audaz y sublime.</p>
  <h3>4. Harira</h3>
  <p>Una reconfortante, aromática y vigorosa sopa con base elaborada a partir de tomates, ricas especias trituradas, con un intenso sabor umami producto de legumbres (lentejas o finos garbanzos) e hilados de tierna carne. Rompe el ayuno del Ramadán debido a lo reconfortante que resulta a todas luces.</p>
  <h3>5. Té de Menta y Pastas</h3>
  <p>Más allá de toda la oferta copiosa antes expuesta, beber té (y mucho) de verde menta es lo más cercano a la bebida oficial de Marruecos. No vayas a olvidar coronarlo con una rica variedad de panecillos y pastas basadas en almendra, destacando por demás el popular <em>Cuerno de Gacela</em>.</p>',
  '/images/blog/food.png',
  'Marruecos Experiencia',
  NOW(),
  true,
  0
),
(
  'guia-para-alojarte-en-riad',
  'Alojamiento',
  'Guía práctica para alojarte en un Riad tradicional',
  '¿Por qué hospedarse en un Riad cambia por completo tu experiencia en Marruecos? Tipos, etiqueta y cómo elegir el mejor para ti.',
  '<p>Mientras que en la mayoría de grandes destinos mundiales los viajeros se decantan por un amplio y estandarizado resort o por un hotel internacional al uso con las cadenas que tan bien conocemos, Marruecos brilla en todo su esplendor al brindarte la inmejorable oportunidad de experimentar toda la enorme riqueza y la hospitalidad oriental dentro de en un <strong>Riad</strong>.</p>
  <h3>¿Qué es un Riad realmente?</h3>
  <p>El término proviene originalmente del árabe <em>ryad</em> referido a ‘jardines’ o a bellos vergeles. Eran viviendas, muchas veces palacetes tradicionales urbanos, pertenecientes a miembros adinerados. Su concepto esencial es que están orientados arquitectónicamente hacia un espacio intermedio en el interior o a un majestuoso patio central bellísimamente adornado; es un oasis, escondido por completo tras puertas carentes de ventanas grandes dadas las altas murallas sin expresión que delimitan con toda franqueza las sinuosas callejuelas y zocos ruidosos.</p>
  <h3>La paz total dentro del caos</h3>
  <p>En el Riad rige la hospitalidad, y este tipo particular y asombroso de estancias, en la actualidad transformadas como boutique guesthouses, brindan todo un increíble abanico desde sencillos dormitorios modestos con decoraciones ricas en tejidos manuales, hasta espectaculares espacios majestuosos cargados con el afamado <em>zellige</em> (preciosa baldosa en mosaicos manuales minúsculos), fuentes interiores rumorosas e íntimas y frondosos techos altísimos forjados hermosamente.</p>
  <h3>El desayuno en su terraza... simplemente único</h3>
  <p>Para redondear tu experiencia al cien por ciento, prácticamente todos los Riads modernos conllevan acceso a idílicas terrazas o azoteas llanas superiores, llenas de almohadones tupidos muy coloridos, ideales para reposar luego de arduas caminatas a ras de suelo y, desde luego, en los que la mañana inicia majestuosamente con exquisitos ritos brindados de cafés potentes árabes, crujientes <em>msemen</em> o tortas finas saladas acompañando jugosos frutos al romper el hermoso amanecer bañado de luz doradísima.</p>',
  '/images/blog/riad.png',
  'Marruecos Experiencia',
  NOW(),
  true,
  0
),
(
  'chefchaouen-el-pueblo-azul',
  'Guías de Viaje',
  'Chefchaouen, el pueblo azul: Qué hacer y cómo llegar',
  'Navegamos a través del laberinto azul de uno de los pueblos más pintorescos, hermosos e instagrameables en la base de la cordillera del Rif.',
  '<p>Incrustada delicadamente sobre un telón de montañas verdísimas entre grandes cumbres picudas del extremo septentrional se sitúa <em>Chefchaouen</em> (o Chaouen simplemente para los que ya la conocen bien), afamada e inconfundible por un hermoso distintivo y es que prácticamente todas las estructuras habitables dentro del antiquísimo espacio delineado por las murallas correspondientes a la <em>Medina</em> irradian unas hipnóticas gamas que viran al unísono de vibrantes y apastelados índigos a cielos deslumbrantes.</p>
  <h3>¿De dónde proviene ese característico color?</h3>
  <p>Aunque diversas corrientes folclóricas abundan por parte de múltiples grupos sociales y locales, señalando al unísono que sirve estupendamente bien como disuasorio eficaz y térmico para frenar las grandes olas de mosquitos en un abrasivo sol estival (algo que a grandes luces realmente funciona), hoy sabemos gracias a cronistas históricos fehacientes que su introducción real a escala del gran espectro azulino en toda la población se impulsó y masificó enormemente en las pasadas décadas recién en 1930 aproximadamente propiciados de manera muy influyente gracias a grandes sectores de poblaciones y migrantes llegados como colonias de base hebrea (sefardí) quienes plasmaron esta gran connotación profundamente arraigada hacia motivos netamente sagrados.</p>
  <h3>No te puedes perder</h3>
  <ul>
    <li>Desempolva las piernas por absolutamente toda la <em>Medina peatonal</em> donde literalmente cualquier pequeño adarve luce tal cual un bellísimo rincón idóneo en portadas internacionales.</li>
    <li>Conecta con la pacífica pero viva plazoleta arbolada central <em>Uta el Hammam</em>.</li>
    <li>Relájate y tómate las cosas con calma para emprender una bonita visita con ascenso visual guiado hasta la muy venerada edificación blanquecina de la pequeña <em>Mezquita Cuna (Mezquita del Asfal)</em> a las afueras, para vislumbrar la incesante luz caer tras la ciudad en una completa postal.</li>
  </ul>',
  '/images/blog/chefchaouen.png',
  'Marruecos Experiencia',
  NOW(),
  true,
  0
),
(
  'consejos-viajar-a-marruecos',
  'Consejos Locales',
  'Consejos esenciales antes de viajar a Marruecos por primera vez',
  'Moneda, vestimenta, seguridad y regateos. Todo lo que necesitas saber antes de subir a tu vuelo con rumbo al corazón del Magreb.',
  '<p>El grandísimo y siempre apasionante salto geográfico, histórico y plenitud sensorial al descender tan escasos y próximos kilómetros del sur español no debiesen nunca tomarte con baja preparación si se trata de encarar tu grandiosa e inédita aventura en tierras magrebíes.</p>
  <h3>1. El clima no siempre es un inmenso horno</h3>
  <p>Un enorme mito y errada preconcepción sumamente arraigada por los perfiles netamente saharianos lleva a considerar que absolutamente cualquier viaje implica acarrear camisas excesivamente ligeras para calores sofocantes. Cuidado si tu expedición o grandes saltos de ciudad están fijados alrededor de pleno enero a febrero en locaciones próximas a faldas imponentes nevadas del <em>Alto Atlas</em>. Empaca estratégicamente por capas según latitudes.</p>
  <h3>2. La regla oro en todo zoco: El noble y audaz arte del regateo</h3>
  <p>Ir a Marruecos demanda dominar ciertas reglas no escritas entre risas, chácharas o interminables tratos comerciales. Cuando vayas directamente sobre cualquier exquisito artículo y des inicio a transacciones en sus medinas (desde mantas tupidas pasando por cueros pulidos, platas ricas repujadas hasta hermosas babuchas locales coloridísimas), nunca des inicio aprobando un abultado importe original emitido a bote pronto por un avispado lugareño. El margen idóneo propiciado por grandes rebajas y sana lúdica gira a que lleguen y converjan juntos a saldos medianos a satisfacción a tu contraoferta con gran respeto.</p>
  <h3>3. Las muestras fotográficas y las personas</h3>
  <p>A menos que hablemos estrictamente en focos amplios captando a panorámica ancha y generalizada amplios puntos e instantáneas callejeras abarrotadas desprovistas en particularidad e intimidad sobre todo ser en foco principal, fotografiar e ir empujando fuertemente el propio objetivo o lente acucioso encima de variopintos sujetos singulares (más aún, acarreando consigo la firme pero errónea creencia o desconocimiento que todos ansiaran un instantáneo retratado robado), es sin lugar a dudas altamente deshonroso en estos hermosos contornos. Sonríe cálidamente y pregunta mediante la cortesía gestual pidiendo total aprobación del ser en sí para tan preciada y genuina toma.</p>
  <h3>4. Consumo de alimentos, frutas crudas y preciada agua</h3>
  <p>En el gran tramo de toda extensa red turística general los controles son estrictos, aun así, a menos que adores los dolores puntuales abdominales que truncan las salidas planificadas o bien cuentes con invulnerabilidad plena gástrica local; mantente completamente firme requiriendo únicamente ricas bebidas provistas directamente de botella, evitando así hielos sueltos en jugos. Trata a su vez todo producto descascarillado exento proveniente de cáscaras duras crudas de ser retiradas fuera si tu opción inmediata optativa carece o dudosamente fue sumergida previamente ante limpieza acuciosa rigurosa del sitio de su distribución. Marruecos te fascinará a ciencia cierta y todo se enfoca finalmente nada más a tu gran disfrute e invaluable memoria. ¡Ahlan Wa Sahlan!</p>',
  '/images/blog/tips.png',
  'Marruecos Experiencia',
  NOW(),
  true,
  0
);
