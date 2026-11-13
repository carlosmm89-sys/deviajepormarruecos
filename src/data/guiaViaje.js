/**
 * Guía "Viaje a Marruecos": página pilar para la búsqueda "viaje a Marruecos".
 * La usan la página React (src/pages/TravelGuide.tsx) y el pre-renderizado (prerender-seo.mjs),
 * así Google y el visitante ven exactamente el mismo contenido.
 * Datos prácticos revisados en noviembre de 2026.
 */

export const GUIDE_PATH = '/viaje-a-marruecos';

export const GUIDE = {
  title: 'Viaje a Marruecos: guía completa para organizar tu viaje',
  metaTitle: 'Viaje a Marruecos: rutas, precios y consejos (guía 2026)',
  description:
    'Organiza tu viaje a Marruecos: rutas de 3 a 13 días, precios, mejor época, documentación y el desierto de Merzouga, con una agencia local.',
  updated: '2026-11-13',
  intro: [
    'Marruecos está a una hora de avión de España y, sin embargo, parece otro mundo: medinas laberínticas, montañas del Atlas, kasbahs de adobe y las dunas del Sáhara. En esta guía te contamos, como agencia local con base en Merzouga, lo que preguntan de verdad nuestros viajeros antes de reservar.',
    'Aquí tienes las rutas más habituales según los días que tengas, cuánto cuesta el viaje, cuándo ir, qué documentación necesitas y cómo es la noche en el desierto.'
  ],
  sections: [
    {
      id: 'rutas',
      h2: 'Rutas por Marruecos según los días que tengas',
      html: `
<p>La pregunta más frecuente es cuántos días hacen falta. Depende de si quieres ver solo el desierto o también las ciudades imperiales. Estas son las combinaciones que mejor funcionan:</p>
<ul>
<li><strong>3 días:</strong> lo justo para ir de Marrakech al desierto de Merzouga y volver, cruzando el Atlas y el valle del Dades. Mira nuestra <a href="/tours/escapada-3-dias-merzouga">excursión de 3 días al desierto desde Marrakech</a>.</li>
<li><strong>4 días:</strong> el mismo recorrido con más calma y una parada extra en Aït Ben Haddou. Es el <a href="/tours/tour-4-dias-al-sahara">tour de 4 días al desierto de Merzouga</a>.</li>
<li><strong>5 días:</strong> Marrakech y desierto a buen ritmo, o terminar en Fez en lugar de volver a Marrakech: <a href="/tours/viaje-5-dias-desierto-merzouga">viaje de 5 días a Merzouga</a> o <a href="/tours/ruta-de-5-dias-de-marrakech-a-fez">ruta de 5 días de Marrakech a Fez</a>.</li>
<li><strong>7 a 8 días:</strong> la ruta clásica con Atlas, gargantas, desierto y ciudades. Tienes un <a href="/blog/viaje-marruecos-7-dias-itinerario">itinerario de 7 días</a> y nuestra <a href="/tours/ruta-8-dias-desierto-merzouga">ruta de 8 días</a> o la <a href="/tours/ruta-norte-a-sur-8-dias-de-tanger-a-marrakech">ruta de 8 días de Tánger a Marrakech</a>.</li>
<li><strong>9 a 13 días:</strong> el país completo de norte a sur: Chefchaouen, Fez, el desierto y Marrakech. Por ejemplo, el <a href="/tours/ruta-de-9-dias-desde-marrakech-hacia-tanger">viaje de 9 días de Marrakech a Tánger</a>, el de <a href="/tours/tour-11-dias-de-marrakech-a-tanger">11 días</a> o el <a href="/tours/gran-tour-de-marruecos-de-13-dias">gran tour de 13 días</a>.</li>
</ul>
<p>Si tu vuelo llega a otra ciudad, también organizamos <a href="/destinations/rutas-desde-fez">rutas desde Fez</a>, <a href="/destinations/rutas-desde-tanger">desde Tánger</a> y <a href="/destinations/rutas-desde-casablanca">desde Casablanca</a>.</p>`
    },
    {
      id: 'precio',
      h2: '¿Cuánto cuesta un viaje a Marruecos?',
      html: `
<p>Un tour privado sale más económico cuantos más viajeros sois, porque el vehículo y el conductor se comparten. Como referencia, nuestros precios por persona en grupo de 4 empiezan en:</p>
<ul>
<li>Excursión de 3 días al desierto: desde 180 €.</li>
<li>Tour de 4 días: desde 250 €.</li>
<li>Viaje de 5 días: desde 300 €.</li>
<li>Rutas de 8 a 13 días: desde 400–500 €.</li>
</ul>
<p>A eso hay que sumar los vuelos, las comidas que no estén incluidas y tus gastos personales. Lo desglosamos con más detalle en <a href="/blog/cuanto-cuesta-viaje-marruecos">cuánto cuesta un viaje a Marruecos</a>. Siempre te damos un presupuesto cerrado según fechas y número de personas.</p>`
    },
    {
      id: 'epoca',
      h2: 'Mejor época para viajar a Marruecos',
      html: `
<p>La primavera (marzo a mayo) y el otoño (septiembre a noviembre) son las mejores épocas: días agradables en las ciudades y en el desierto. En invierno los días son soleados, pero en el Atlas y en el desierto las noches son frías. En verano el calor en el sur es intenso, aunque el desierto sigue siendo viable madrugando y descansando en las horas centrales.</p>
<p>Más detalle en <a href="/blog/mejor-epoca-para-viajar-marruecos">la mejor época para viajar a Marruecos</a> y en <a href="/blog/clima-en-marruecos">el clima de Marruecos mes a mes</a>. Si viajas durante el mes sagrado, lee <a href="/blog/viajar-marruecos-ramadan">viajar a Marruecos en Ramadán</a>.</p>`
    },
    {
      id: 'documentacion',
      h2: 'Documentación: ¿qué necesitas para entrar en Marruecos?',
      html: `
<p>Con pasaporte español no necesitas visado para hacer turismo en Marruecos durante un máximo de 90 días. Lo importante:</p>
<ul>
<li><strong>Pasaporte en vigor.</strong> El DNI no sirve para entrar, tampoco si cruzas en ferry. Exteriores recomienda que tenga validez de al menos 6 meses.</li>
<li><strong>Sin vacunas obligatorias.</strong> Basta con tener al día las habituales.</li>
<li><strong>Seguro de viaje:</strong> no es obligatorio, pero sí muy recomendable.</li>
</ul>
<p>Si tienes otra nacionalidad, consulta los requisitos de tu país antes de reservar los vuelos.</p>`
    },
    {
      id: 'llegar',
      h2: 'Cómo llegar a Marruecos desde España',
      html: `
<p>Hay vuelos directos desde muchas ciudades españolas a Marrakech, Fez, Tánger y Casablanca, y también puedes cruzar en ferry desde Tarifa o Algeciras a Tánger. Lo más práctico suele ser llegar a una ciudad y salir por otra para no repetir camino.</p>
<p>Para el desierto, lee <a href="/blog/como-llegar-a-merzouga">cómo llegar a Merzouga</a>. Si vas en ferry, te interesan nuestros <a href="/blog/tours-desde-tanger-ferry">tours desde Tánger</a>.</p>`
    },
    {
      id: 'desierto',
      h2: 'El desierto: Merzouga y la noche en jaima',
      html: `
<p>La noche en el desierto es el momento que más recuerdan nuestros viajeros: llegada en dromedario al atardecer, cena bereber, música junto al fuego y un cielo lleno de estrellas. Nuestra base está en Hassi Labied, a los pies de las dunas de Erg Chebbi, en Merzouga.</p>
<p>¿Dudas entre desiertos? Compáralos en <a href="/blog/desierto-merzouga-o-zagora">Merzouga o Zagora</a>. Para prepararte, mira <a href="/blog/noche-en-el-campamento">cómo es la noche en el campamento</a>, <a href="/blog/que-hacer-en-merzouga">qué hacer en Merzouga</a> y <a href="/blog/que-llevar-maleta-al-desierto-sahara">qué llevar en la maleta</a>. Y si estás decidiendo el formato, <a href="/blog/tour-privado-o-en-grupo-desierto-merzouga">tour privado o en grupo</a>.</p>`
    },
    {
      id: 'ciudades',
      h2: 'Ciudades y lugares que no te puedes perder',
      html: `
<ul>
<li><strong>Marrakech:</strong> la plaza Jemaa el Fna, los zocos y los jardines. Guía: <a href="/blog/que-ver-en-marrakech-en-3-dias">qué ver en Marrakech en 3 días</a> y <a href="/blog/secretos-del-zoco-marrakech-regateo">cómo regatear en el zoco</a>.</li>
<li><strong>Fez:</strong> una de las medinas medievales mejor conservadas del mundo, con sus curtidurías.</li>
<li><strong>Chefchaouen:</strong> el pueblo azul del Rif. Más en <a href="/blog/chefchaouen-el-pueblo-azul">Chefchaouen</a>.</li>
<li><strong>Aït Ben Haddou:</strong> la kasbah de las películas. Más en <a href="/blog/ait-ben-haddou-escenario-hollywood">Aït Ben Haddou</a>.</li>
<li><strong>Valle del Dades y gargantas del Todra:</strong> paradas clásicas camino del desierto.</li>
</ul>
<p>Para dormir en las ciudades, lee nuestra <a href="/blog/guia-para-alojarte-en-riad">guía para alojarte en un riad</a>.</p>`
    },
    {
      id: 'consejos',
      h2: 'Consejos prácticos para tu viaje',
      html: `
<ul>
<li><strong>Dinero:</strong> la moneda es el dírham marroquí (en noviembre de 2026, 1 € equivale a unos 11 dírhams). Lleva efectivo para zocos y propinas; en las ciudades hay cajeros.</li>
<li><strong>Ropa:</strong> cómoda y que cubra hombros y rodillas en lugares religiosos y zonas rurales. Más en <a href="/blog/que-ropa-llevar-a-marruecos">qué ropa llevar a Marruecos</a>.</li>
<li><strong>Comida:</strong> no te vayas sin probar el tajín, el cuscús de los viernes y la harira. Más en <a href="/blog/gastronomia-marroqui-platos-tipicos">platos típicos de Marruecos</a>.</li>
<li><strong>Seguridad:</strong> Marruecos es un destino tranquilo para el turista con las precauciones normales. Lo explicamos en <a href="/blog/es-seguro-viajar-marruecos-2026">¿es seguro viajar a Marruecos?</a></li>
<li>Más ideas en <a href="/blog/consejos-viajar-a-marruecos">consejos para viajar a Marruecos</a>, <a href="/blog/viajar-marruecos-con-ninos">viajar con niños</a> y <a href="/blog/luna-de-miel-en-marruecos">luna de miel en Marruecos</a>.</li>
</ul>`
    },
    {
      id: 'agencia',
      h2: 'Viajar con una agencia local',
      html: `
<p>Vivir Marruecos es una agencia de Hassi Labied (Merzouga) que organiza el viaje de principio a fin: vehículo privado, conductor de habla española, alojamientos y campamento en el desierto. Puedes adaptar la ruta, el ritmo y el tipo de alojamiento a tu medida.</p>
<p>Echa un vistazo a <a href="/tours">todos nuestros tours por Marruecos</a> o escríbenos para pedir un presupuesto sin compromiso.</p>`
    }
  ],
  faqs: [
    {
      q: '¿Cuántos días hacen falta para un viaje a Marruecos?',
      a: 'Con 3 o 4 días puedes ir de Marrakech al desierto de Merzouga y volver. Con 7 u 8 días haces la ruta clásica de ciudades, Atlas y desierto, y con 9 a 13 días recorres el país de norte a sur.'
    },
    {
      q: '¿Cuánto cuesta un viaje a Marruecos?',
      a: 'Nuestros tours privados empiezan en 180 € por persona para 3 días (grupo de 4), 250 € para 4 días y 300 € para 5 días. A eso se suman los vuelos y los gastos personales.'
    },
    {
      q: '¿Se necesita visado para viajar a Marruecos desde España?',
      a: 'No. Con pasaporte español no necesitas visado para estancias turísticas de hasta 90 días. Necesitas pasaporte en vigor: el DNI no permite la entrada.'
    },
    {
      q: '¿Cuál es la mejor época para viajar a Marruecos?',
      a: 'La primavera (marzo a mayo) y el otoño (septiembre a noviembre). En invierno las noches del desierto son frías y en verano el calor en el sur es intenso.'
    },
    {
      q: '¿Es mejor un tour privado o en grupo?',
      a: 'El tour privado te permite elegir fechas, ritmo y paradas, y viajas solo con tu grupo. Para 3 o 4 personas el precio por persona es muy competitivo.'
    }
  ]
};
