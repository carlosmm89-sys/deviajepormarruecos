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
<li>Rutas de 8 días: desde 400 €.</li>
<li>Rutas de 9 a 13 días: desde 400 €.</li>
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

/* ---------------------------------------------------------------------------
 * Versiones en inglés y francés (mismos enlaces, mismas secciones e ids).
 * Adaptadas a viajeros de cualquier país: documentación y cómo llegar no
 * asumen pasaporte español.
 * ------------------------------------------------------------------------- */

const GUIDE_EN = {
  title: 'Travelling to Morocco: the complete guide to planning your trip',
  metaTitle: 'Morocco travel guide: routes, prices and tips (2026)',
  description:
    'Plan your trip to Morocco: 3 to 13-day routes, prices, best time to go, entry requirements and the Merzouga desert, with a local agency.',
  updated: GUIDE.updated,
  intro: [
    'Morocco is a short flight from most of Europe, yet it feels like another world: maze-like medinas, the Atlas Mountains, mud-brick kasbahs and the dunes of the Sahara. In this guide we share, as a local agency based in Merzouga, what our travellers really ask before they book.',
    'Here you will find the most popular routes depending on how many days you have, what the trip costs, when to go, what documents you need and what a night in the desert is like.'
  ],
  sections: [
    {
      id: 'rutas',
      h2: 'Routes through Morocco depending on how many days you have',
      html: `
<p>The most common question is how many days you need. It depends on whether you only want to see the desert or the imperial cities too. These are the combinations that work best:</p>
<ul>
<li><strong>3 days:</strong> just enough to go from Marrakech to the Merzouga desert and back, crossing the Atlas and the Dades Valley. See our <a href="/tours/escapada-3-dias-merzouga">3-day desert trip from Marrakech</a>.</li>
<li><strong>4 days:</strong> the same route at a calmer pace, with an extra stop at Aït Ben Haddou. That is our <a href="/tours/tour-4-dias-al-sahara">4-day Merzouga desert tour</a>.</li>
<li><strong>5 days:</strong> Marrakech and the desert at a good pace, or finish in Fez instead of returning to Marrakech: <a href="/tours/viaje-5-dias-desierto-merzouga">5-day Merzouga trip</a> or <a href="/tours/ruta-de-5-dias-de-marrakech-a-fez">5-day route from Marrakech to Fez</a>.</li>
<li><strong>7 to 8 days:</strong> the classic route with the Atlas, gorges, desert and cities. There is a <a href="/blog/viaje-marruecos-7-dias-itinerario">7-day itinerary</a>, our <a href="/tours/ruta-8-dias-desierto-merzouga">8-day route</a> and the <a href="/tours/ruta-norte-a-sur-8-dias-de-tanger-a-marrakech">8-day route from Tangier to Marrakech</a>.</li>
<li><strong>9 to 13 days:</strong> the whole country from north to south: Chefchaouen, Fez, the desert and Marrakech. For example, the <a href="/tours/ruta-de-9-dias-desde-marrakech-hacia-tanger">9-day trip from Marrakech to Tangier</a>, the <a href="/tours/tour-11-dias-de-marrakech-a-tanger">11-day trip</a> or the <a href="/tours/gran-tour-de-marruecos-de-13-dias">13-day grand tour</a>.</li>
</ul>
<p>If your flight lands in another city, we also organise <a href="/destinations/rutas-desde-fez">routes from Fez</a>, <a href="/destinations/rutas-desde-tanger">from Tangier</a> and <a href="/destinations/rutas-desde-casablanca">from Casablanca</a>.</p>`
    },
    {
      id: 'precio',
      h2: 'How much does a trip to Morocco cost?',
      html: `
<p>A private tour gets cheaper per person the more travellers there are, because the vehicle and driver are shared. As a guide, our prices per person for a group of 4 start at:</p>
<ul>
<li>3-day desert trip: from €180.</li>
<li>4-day tour: from €250.</li>
<li>5-day trip: from €300.</li>
<li>8-day routes: from €400.</li>
<li>9 to 13-day routes: from €400.</li>
</ul>
<p>On top of that come flights, meals that are not included and your personal expenses. We break it down in more detail in <a href="/blog/cuanto-cuesta-viaje-marruecos">how much a trip to Morocco costs</a>. We always give you a fixed quote based on your dates and number of travellers.</p>`
    },
    {
      id: 'epoca',
      h2: 'Best time to travel to Morocco',
      html: `
<p>Spring (March to May) and autumn (September to November) are the best seasons: pleasant days in the cities and in the desert. In winter the days are sunny, but nights in the Atlas and the desert are cold. In summer the heat in the south is intense, although the desert is still doable if you start early and rest in the middle of the day.</p>
<p>More detail in <a href="/blog/mejor-epoca-para-viajar-marruecos">the best time to travel to Morocco</a> and <a href="/blog/clima-en-marruecos">Morocco's weather month by month</a>. If you are travelling during the holy month, read <a href="/blog/viajar-marruecos-ramadan">travelling to Morocco during Ramadan</a>.</p>`
    },
    {
      id: 'documentacion',
      h2: 'Entry requirements: what do you need to enter Morocco?',
      html: `
<p>Citizens of the European Union, the United Kingdom, the United States, Canada, Australia and many other countries do not need a visa for tourist stays of up to 90 days. The key points:</p>
<ul>
<li><strong>A valid passport.</strong> National ID cards are not accepted, even if you arrive by ferry. It is advisable for it to be valid for at least 6 months.</li>
<li><strong>No compulsory vaccinations.</strong> Just keep your routine ones up to date.</li>
<li><strong>Travel insurance:</strong> not compulsory, but highly recommended.</li>
</ul>
<p>Requirements depend on your nationality, so check your government's travel advice before booking flights.</p>`
    },
    {
      id: 'llegar',
      h2: 'How to get to Morocco',
      html: `
<p>There are direct flights from many European cities to Marrakech, Fez, Tangier and Casablanca, and from further afield you can connect through Casablanca or a European hub. You can also take the ferry from Tarifa or Algeciras (Spain) to Tangier. It is usually most practical to arrive in one city and leave from another so you do not retrace your steps.</p>
<p>For the desert, read <a href="/blog/como-llegar-a-merzouga">how to get to Merzouga</a>. If you are coming by ferry, have a look at our <a href="/blog/tours-desde-tanger-ferry">tours from Tangier</a>.</p>`
    },
    {
      id: 'desierto',
      h2: 'The desert: Merzouga and a night in a Berber tent',
      html: `
<p>The night in the desert is what our travellers remember most: arriving by dromedary at sunset, a Berber dinner, music around the fire and a sky full of stars. Our base is in Hassi Labied, at the foot of the Erg Chebbi dunes in Merzouga.</p>
<p>Not sure which desert to choose? Compare them in <a href="/blog/desierto-merzouga-o-zagora">Merzouga or Zagora</a>. To get ready, see <a href="/blog/noche-en-el-campamento">what a night at the camp is like</a>, <a href="/blog/que-hacer-en-merzouga">things to do in Merzouga</a> and <a href="/blog/que-llevar-maleta-al-desierto-sahara">what to pack</a>. And if you are deciding on the format, read <a href="/blog/tour-privado-o-en-grupo-desierto-merzouga">private or group tour</a>.</p>`
    },
    {
      id: 'ciudades',
      h2: 'Cities and places you should not miss',
      html: `
<ul>
<li><strong>Marrakech:</strong> Jemaa el-Fna square, the souks and the gardens. Guides: <a href="/blog/que-ver-en-marrakech-en-3-dias">what to see in Marrakech in 3 days</a> and <a href="/blog/secretos-del-zoco-marrakech-regateo">how to haggle in the souk</a>.</li>
<li><strong>Fez:</strong> one of the best-preserved medieval medinas in the world, with its tanneries.</li>
<li><strong>Chefchaouen:</strong> the blue town of the Rif. More in <a href="/blog/chefchaouen-el-pueblo-azul">Chefchaouen</a>.</li>
<li><strong>Aït Ben Haddou:</strong> the kasbah from the films. More in <a href="/blog/ait-ben-haddou-escenario-hollywood">Aït Ben Haddou</a>.</li>
<li><strong>Dades Valley and Todra Gorge:</strong> classic stops on the way to the desert.</li>
</ul>
<p>For where to sleep in the cities, read our <a href="/blog/guia-para-alojarte-en-riad">guide to staying in a riad</a>.</p>`
    },
    {
      id: 'consejos',
      h2: 'Practical tips for your trip',
      html: `
<ul>
<li><strong>Money:</strong> the currency is the Moroccan dirham (in November 2026, €1 is about 11 dirhams). Carry cash for the souks and tips; there are ATMs in the cities.</li>
<li><strong>Clothing:</strong> comfortable, covering shoulders and knees in religious sites and rural areas. More in <a href="/blog/que-ropa-llevar-a-marruecos">what to wear in Morocco</a>.</li>
<li><strong>Food:</strong> don't leave without trying tagine, Friday couscous and harira. More in <a href="/blog/gastronomia-marroqui-platos-tipicos">typical Moroccan dishes</a>.</li>
<li><strong>Safety:</strong> Morocco is a relaxed destination for visitors who take normal precautions. We explain it in <a href="/blog/es-seguro-viajar-marruecos-2026">is it safe to travel to Morocco?</a></li>
<li>More ideas in <a href="/blog/consejos-viajar-a-marruecos">tips for travelling to Morocco</a>, <a href="/blog/viajar-marruecos-con-ninos">travelling with children</a> and <a href="/blog/luna-de-miel-en-marruecos">honeymoon in Morocco</a>.</li>
</ul>`
    },
    {
      id: 'agencia',
      h2: 'Travelling with a local agency',
      html: `
<p>Vivir Marruecos is an agency based in Hassi Labied (Merzouga) that organises your trip from start to finish: private vehicle, a driver who speaks English, Spanish and French, accommodation and a desert camp. You can adapt the route, pace and type of accommodation to suit you.</p>
<p>Take a look at <a href="/tours">all our tours in Morocco</a> or write to us for a free, no-obligation quote.</p>`
    }
  ],
  faqs: [
    {
      q: 'How many days do you need for a trip to Morocco?',
      a: 'With 3 or 4 days you can go from Marrakech to the Merzouga desert and back. With 7 or 8 days you can do the classic route of cities, Atlas and desert, and with 9 to 13 days you can travel the country from north to south.'
    },
    {
      q: 'How much does a trip to Morocco cost?',
      a: 'Our private tours start at €180 per person for 3 days (group of 4), €250 for 4 days and €300 for 5 days. Flights and personal expenses are extra.'
    },
    {
      q: 'Do I need a visa to travel to Morocco?',
      a: 'Citizens of the EU, the UK, the US, Canada, Australia and many other countries do not need a visa for tourist stays of up to 90 days. You need a valid passport; ID cards are not accepted. Check the requirements for your nationality.'
    },
    {
      q: 'What is the best time to travel to Morocco?',
      a: 'Spring (March to May) and autumn (September to November). In winter, desert nights are cold, and in summer the heat in the south is intense.'
    },
    {
      q: 'Is a private or a group tour better?',
      a: 'A private tour lets you choose your dates, pace and stops, and you travel only with your own group. For 3 or 4 people the price per person is very competitive.'
    }
  ]
};

const GUIDE_FR = {
  title: 'Voyager au Maroc : le guide complet pour organiser votre voyage',
  metaTitle: 'Voyage au Maroc : itinéraires, prix et conseils (guide 2026)',
  description:
    'Organisez votre voyage au Maroc : itinéraires de 3 à 13 jours, prix, meilleure période, formalités et le désert de Merzouga, avec une agence locale.',
  updated: GUIDE.updated,
  intro: [
    'Le Maroc n’est qu’à quelques heures d’avion de l’Europe et pourtant, c’est un autre monde : médinas labyrinthiques, montagnes de l’Atlas, kasbahs en pisé et dunes du Sahara. Dans ce guide, en tant qu’agence locale basée à Merzouga, nous répondons aux questions que nos voyageurs se posent vraiment avant de réserver.',
    'Vous y trouverez les itinéraires les plus courants selon le nombre de jours dont vous disposez, le coût du voyage, la meilleure période, les documents nécessaires et à quoi ressemble une nuit dans le désert.'
  ],
  sections: [
    {
      id: 'rutas',
      h2: 'Itinéraires au Maroc selon le nombre de jours',
      html: `
<p>La question la plus fréquente, c’est le nombre de jours nécessaires. Tout dépend si vous voulez voir uniquement le désert ou aussi les villes impériales. Voici les combinaisons qui fonctionnent le mieux :</p>
<ul>
<li><strong>3 jours :</strong> juste ce qu’il faut pour aller de Marrakech au désert de Merzouga et revenir, en traversant l’Atlas et la vallée du Dadès. Découvrez notre <a href="/tours/escapada-3-dias-merzouga">excursion de 3 jours dans le désert depuis Marrakech</a>.</li>
<li><strong>4 jours :</strong> le même parcours plus tranquillement, avec un arrêt supplémentaire à Aït Ben Haddou. C’est notre <a href="/tours/tour-4-dias-al-sahara">circuit de 4 jours dans le désert de Merzouga</a>.</li>
<li><strong>5 jours :</strong> Marrakech et le désert à bon rythme, ou finir à Fès au lieu de revenir à Marrakech : <a href="/tours/viaje-5-dias-desierto-merzouga">voyage de 5 jours à Merzouga</a> ou <a href="/tours/ruta-de-5-dias-de-marrakech-a-fez">circuit de 5 jours de Marrakech à Fès</a>.</li>
<li><strong>7 à 8 jours :</strong> le circuit classique avec l’Atlas, les gorges, le désert et les villes. Il y a un <a href="/blog/viaje-marruecos-7-dias-itinerario">itinéraire de 7 jours</a>, notre <a href="/tours/ruta-8-dias-desierto-merzouga">circuit de 8 jours</a> et le <a href="/tours/ruta-norte-a-sur-8-dias-de-tanger-a-marrakech">circuit de 8 jours de Tanger à Marrakech</a>.</li>
<li><strong>9 à 13 jours :</strong> tout le pays du nord au sud : Chefchaouen, Fès, le désert et Marrakech. Par exemple, le <a href="/tours/ruta-de-9-dias-desde-marrakech-hacia-tanger">voyage de 9 jours de Marrakech à Tanger</a>, celui de <a href="/tours/tour-11-dias-de-marrakech-a-tanger">11 jours</a> ou le <a href="/tours/gran-tour-de-marruecos-de-13-dias">grand tour de 13 jours</a>.</li>
</ul>
<p>Si votre vol arrive dans une autre ville, nous organisons aussi des <a href="/destinations/rutas-desde-fez">circuits au départ de Fès</a>, <a href="/destinations/rutas-desde-tanger">de Tanger</a> et <a href="/destinations/rutas-desde-casablanca">de Casablanca</a>.</p>`
    },
    {
      id: 'precio',
      h2: 'Combien coûte un voyage au Maroc ?',
      html: `
<p>Un circuit privé revient moins cher par personne quand vous êtes plus nombreux, car le véhicule et le chauffeur sont partagés. À titre indicatif, nos prix par personne pour un groupe de 4 commencent à :</p>
<ul>
<li>Excursion de 3 jours dans le désert : à partir de 180 €.</li>
<li>Circuit de 4 jours : à partir de 250 €.</li>
<li>Voyage de 5 jours : à partir de 300 €.</li>
<li>Circuits de 8 jours : à partir de 400 €.</li>
<li>Circuits de 9 à 13 jours : à partir de 400 €.</li>
</ul>
<p>Il faut y ajouter les vols, les repas non inclus et vos dépenses personnelles. Nous détaillons tout cela dans <a href="/blog/cuanto-cuesta-viaje-marruecos">combien coûte un voyage au Maroc</a>. Nous vous envoyons toujours un devis ferme selon vos dates et le nombre de voyageurs.</p>`
    },
    {
      id: 'epoca',
      h2: 'Meilleure période pour voyager au Maroc',
      html: `
<p>Le printemps (mars à mai) et l’automne (septembre à novembre) sont les meilleures saisons : journées agréables en ville comme dans le désert. En hiver, les journées sont ensoleillées, mais les nuits sont froides dans l’Atlas et dans le désert. En été, la chaleur est intense dans le sud, même si le désert reste faisable en partant tôt et en se reposant aux heures les plus chaudes.</p>
<p>Plus de détails dans <a href="/blog/mejor-epoca-para-viajar-marruecos">la meilleure période pour voyager au Maroc</a> et <a href="/blog/clima-en-marruecos">le climat du Maroc mois par mois</a>. Si vous voyagez pendant le mois sacré, lisez <a href="/blog/viajar-marruecos-ramadan">voyager au Maroc pendant le Ramadan</a>.</p>`
    },
    {
      id: 'documentacion',
      h2: 'Formalités : que faut-il pour entrer au Maroc ?',
      html: `
<p>Les ressortissants de l’Union européenne, de la Suisse, du Canada et de nombreux autres pays n’ont pas besoin de visa pour un séjour touristique de 90 jours maximum. L’essentiel :</p>
<ul>
<li><strong>Un passeport valide.</strong> La carte d’identité ne permet pas d’entrer, même en ferry. Il est conseillé qu’il soit valable au moins 6 mois.</li>
<li><strong>Aucun vaccin obligatoire.</strong> Il suffit d’être à jour des vaccins habituels.</li>
<li><strong>Assurance voyage :</strong> non obligatoire, mais vivement recommandée.</li>
</ul>
<p>Les conditions dépendent de votre nationalité : consultez les conseils aux voyageurs de votre pays avant de réserver vos vols.</p>`
    },
    {
      id: 'llegar',
      h2: 'Comment se rendre au Maroc',
      html: `
<p>Il existe des vols directs depuis de nombreuses villes de France, de Belgique et de Suisse vers Marrakech, Fès, Tanger et Casablanca. Vous pouvez aussi prendre le ferry depuis Sète (France) ou depuis Tarifa et Algésiras (Espagne) jusqu’à Tanger. Le plus pratique est souvent d’arriver dans une ville et de repartir d’une autre pour ne pas refaire le même chemin.</p>
<p>Pour le désert, lisez <a href="/blog/como-llegar-a-merzouga">comment se rendre à Merzouga</a>. Si vous venez en ferry, découvrez nos <a href="/blog/tours-desde-tanger-ferry">circuits au départ de Tanger</a>.</p>`
    },
    {
      id: 'desierto',
      h2: 'Le désert : Merzouga et la nuit sous la tente',
      html: `
<p>La nuit dans le désert, c’est le moment dont nos voyageurs se souviennent le plus : arrivée à dos de dromadaire au coucher du soleil, dîner berbère, musique autour du feu et ciel rempli d’étoiles. Notre base se trouve à Hassi Labied, au pied des dunes de l’Erg Chebbi, à Merzouga.</p>
<p>Vous hésitez entre deux déserts ? Comparez-les dans <a href="/blog/desierto-merzouga-o-zagora">Merzouga ou Zagora</a>. Pour vous préparer, découvrez <a href="/blog/noche-en-el-campamento">à quoi ressemble la nuit au campement</a>, <a href="/blog/que-hacer-en-merzouga">que faire à Merzouga</a> et <a href="/blog/que-llevar-maleta-al-desierto-sahara">quoi mettre dans votre valise</a>. Et si vous hésitez sur la formule, lisez <a href="/blog/tour-privado-o-en-grupo-desierto-merzouga">circuit privé ou en groupe</a>.</p>`
    },
    {
      id: 'ciudades',
      h2: 'Villes et lieux à ne pas manquer',
      html: `
<ul>
<li><strong>Marrakech :</strong> la place Jemaa el-Fna, les souks et les jardins. Guides : <a href="/blog/que-ver-en-marrakech-en-3-dias">que voir à Marrakech en 3 jours</a> et <a href="/blog/secretos-del-zoco-marrakech-regateo">comment marchander dans le souk</a>.</li>
<li><strong>Fès :</strong> l’une des médinas médiévales les mieux conservées au monde, avec ses tanneries.</li>
<li><strong>Chefchaouen :</strong> la ville bleue du Rif. Plus d’infos dans <a href="/blog/chefchaouen-el-pueblo-azul">Chefchaouen</a>.</li>
<li><strong>Aït Ben Haddou :</strong> la kasbah des films. Plus d’infos dans <a href="/blog/ait-ben-haddou-escenario-hollywood">Aït Ben Haddou</a>.</li>
<li><strong>Vallée du Dadès et gorges du Todra :</strong> étapes classiques sur la route du désert.</li>
</ul>
<p>Pour dormir en ville, lisez notre <a href="/blog/guia-para-alojarte-en-riad">guide pour séjourner dans un riad</a>.</p>`
    },
    {
      id: 'consejos',
      h2: 'Conseils pratiques pour votre voyage',
      html: `
<ul>
<li><strong>Argent :</strong> la monnaie est le dirham marocain (en novembre 2026, 1 € vaut environ 11 dirhams). Prévoyez des espèces pour les souks et les pourboires ; il y a des distributeurs dans les villes.</li>
<li><strong>Vêtements :</strong> confortables et couvrant épaules et genoux dans les lieux religieux et les zones rurales. Plus d’infos dans <a href="/blog/que-ropa-llevar-a-marruecos">quels vêtements emporter au Maroc</a>.</li>
<li><strong>Cuisine :</strong> ne repartez pas sans goûter le tajine, le couscous du vendredi et la harira. Plus d’infos dans <a href="/blog/gastronomia-marroqui-platos-tipicos">les plats typiques du Maroc</a>.</li>
<li><strong>Sécurité :</strong> le Maroc est une destination tranquille pour le voyageur qui prend les précautions habituelles. Nous l’expliquons dans <a href="/blog/es-seguro-viajar-marruecos-2026">le Maroc est-il sûr ?</a></li>
<li>Plus d’idées dans <a href="/blog/consejos-viajar-a-marruecos">conseils pour voyager au Maroc</a>, <a href="/blog/viajar-marruecos-con-ninos">voyager avec des enfants</a> et <a href="/blog/luna-de-miel-en-marruecos">lune de miel au Maroc</a>.</li>
</ul>`
    },
    {
      id: 'agencia',
      h2: 'Voyager avec une agence locale',
      html: `
<p>Vivir Marruecos est une agence de Hassi Labied (Merzouga) qui organise votre voyage de A à Z : véhicule privé, chauffeur parlant français, anglais et espagnol, hébergements et campement dans le désert. Vous pouvez adapter l’itinéraire, le rythme et le type d’hébergement à vos envies.</p>
<p>Découvrez <a href="/tours">tous nos circuits au Maroc</a> ou écrivez-nous pour un devis gratuit et sans engagement.</p>`
    }
  ],
  faqs: [
    {
      q: 'Combien de jours faut-il pour un voyage au Maroc ?',
      a: 'En 3 ou 4 jours, vous pouvez aller de Marrakech au désert de Merzouga et revenir. En 7 ou 8 jours, vous faites le circuit classique villes, Atlas et désert, et en 9 à 13 jours, vous parcourez le pays du nord au sud.'
    },
    {
      q: 'Combien coûte un voyage au Maroc ?',
      a: 'Nos circuits privés commencent à 180 € par personne pour 3 jours (groupe de 4), 250 € pour 4 jours et 300 € pour 5 jours. Les vols et les dépenses personnelles sont en plus.'
    },
    {
      q: 'Faut-il un visa pour voyager au Maroc ?',
      a: 'Les ressortissants de l’UE, de la Suisse, du Canada et de nombreux autres pays n’ont pas besoin de visa pour un séjour touristique de 90 jours maximum. Il faut un passeport valide : la carte d’identité ne suffit pas. Vérifiez les conditions selon votre nationalité.'
    },
    {
      q: 'Quelle est la meilleure période pour voyager au Maroc ?',
      a: 'Le printemps (mars à mai) et l’automne (septembre à novembre). En hiver, les nuits dans le désert sont froides et en été, la chaleur est intense dans le sud.'
    },
    {
      q: 'Vaut-il mieux un circuit privé ou en groupe ?',
      a: 'Le circuit privé vous permet de choisir vos dates, votre rythme et vos arrêts, et vous voyagez uniquement avec votre groupe. Pour 3 ou 4 personnes, le prix par personne est très compétitif.'
    }
  ]
};

/** Guía en el idioma pedido ('es' | 'en' | 'fr'); si no existe, en español. */
export function getGuide(lang) {
  if (lang === 'en') return GUIDE_EN;
  if (lang === 'fr') return GUIDE_FR;
  return GUIDE;
}
