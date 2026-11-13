// Traducción al inglés y al francés de las colecciones (/coleccion/:slug).
// El español está en seoContent.js (COLLECTION_INTROS y COLLECTION_BODIES).
import { collectionContent } from './seoContent.js';

const COLLECTIONS_I18N = {
  en: {
    'desierto': {
      title: 'Trips to the Merzouga desert',
      intro: 'Private trips to the Sahara with a night in a tent in the Erg Chebbi dunes, a camel ride at sunset and sunrise over the dunes. Departures from Marrakech, Fez, Tangier or Casablanca, with a driver and vehicle just for your group.',
      body: [
        'The Merzouga desert is the star of our trips: the Erg Chebbi dunes rise up to 150 metres and change colour with the daylight. Our base is in Hassi Labied, right at the foot of the dunes, so we know every corner of the area.',
        'A desert trip usually includes a camel ride to the camp, a Berber dinner, a night in a tent under the stars and sunrise from the top of the dunes. From Marrakech you cross the High Atlas, Ouarzazate and the Dades and Todra valleys; from Fez you pass through Ifrane, the cedar forest and the Ziz valley.'
      ]
    },
    'norte-de-marruecos': {
      title: 'Trips to northern Morocco',
      intro: 'Trips through Tangier, Tetouan, Chefchaouen and the Rif mountains: routes through northern Morocco, ideal if you arrive by ferry from Spain, which can continue to Fez and the Merzouga desert.',
      body: [
        'Northern Morocco is the natural gateway if you travel from Spain by ferry: Tangier is one hour from Tarifa. From there the route continues through Tetouan and its white medina to Chefchaouen, the blue town in the Rif mountains.',
        'These routes can be combined with Fez, Meknes and Volubilis, and continue to the Merzouga desert to finish in Marrakech. We pick you up at the port or airport and you travel in a private vehicle with a driver.'
      ]
    },
    'ciudades-imperiales': {
      title: 'Imperial cities routes',
      intro: 'Marrakech, Fez, Meknes and Rabat: Morocco’s four historic capitals in a single route, with time for their medinas, souks, palaces and madrasas.',
      body: [
        'The imperial cities are Morocco’s four former capitals. Fez has the largest medieval medina in the world, Meknes its walls and monumental gates, Rabat the Hassan Tower and the Kasbah of the Udayas, and Marrakech the Jemaa el-Fna square.',
        'An imperial cities route suits trips of one or two weeks and can include a desert getaway to Merzouga between Fez and Marrakech.'
      ]
    },
    'aventura': {
      title: 'Adventure trips in Morocco',
      intro: 'Adventure trips in Morocco: quads and buggies in the dunes, sandboarding, camel treks and Atlas tracks for those looking for more than city visits.',
      body: [
        'For the most active travellers we offer routes with quads and buggies among the Erg Chebbi dunes, sandboarding at sunset and camel treks to the camp.',
        'You can also add hikes through the Todra gorges or the valleys of the High Atlas. All activities are booked with local guides and adapted to each group’s level.'
      ]
    },
    'cultura': {
      title: 'Cultural trips in Morocco',
      intro: 'Cultural trips through World Heritage medinas, adobe kasbahs such as Aït Ben Haddou, Amazigh (Berber) villages and everyday life in Morocco told by local people.',
      body: [
        'Morocco is a country of mixed cultures: Arab, Amazigh (Berber), Andalusian and Saharan. On our cultural routes we visit World Heritage medinas such as Fez and Marrakech, the kasbah of Aït Ben Haddou and villages in the Draa valley.',
        'Near Merzouga you will meet nomadic families and hear the Gnawa music of Khamlia, always with local guides and drivers who explain their history and customs.'
      ]
    },
    'montana': {
      title: 'Atlas and mountain routes',
      intro: 'Routes over the High Atlas mountain passes, through valleys such as the Dades and gorges such as the Todra: mountain scenery on the way to the desert.',
      body: [
        'The High Atlas separates Marrakech from the desert. The Tizi n’Tichka pass, at over 2,200 metres, offers some of the most spectacular views in the country, and on the other side lie Ouarzazate, the Valley of Roses and the Dades valley.',
        'The Todra gorges, with rock walls up to 300 metres high, are a classic stop on the way to Merzouga. In the north, the Rif and the Middle Atlas, with the cedar forests of Azrou and Ifrane, complete mountain Morocco.'
      ]
    },
    'costa': {
      title: 'Trips to the Moroccan coast',
      intro: 'Trips to Essaouira, the Atlantic coast and the Mediterranean north to combine beaches, fresh fish and quiet medinas with the rest of your route.',
      body: [
        'The Moroccan coast combines the Atlantic and the Mediterranean. Essaouira, with its fishing port and walled medina, is the favourite getaway from Marrakech; Asilah and Tangier stand out in the north.',
        'Adding a few days on the coast to your route is a great way to relax after the desert or the imperial cities.'
      ]
    },
    'luna-de-miel': {
      title: 'Honeymoon in Morocco',
      intro: 'A honeymoon in Morocco with charming riads, dinner under the stars in the desert and a private route at your own pace, tailor-made for you.',
      body: [
        'We design private honeymoons in Morocco: charming riads in Marrakech and Fez, a special night in a desert camp in Merzouga and the pace the couple prefers.',
        'We can add touches such as a private dinner in the dunes, a sunrise balloon ride or a hammam day. Tell us what you would like and we will tailor the route.'
      ]
    },
    'viajes-en-familia': {
      title: 'Family trips in Morocco',
      intro: 'Family trips with comfortable stages, frequent stops and activities for children such as a camel ride or a night in a tent in the desert.',
      body: [
        'Travelling with children in Morocco is easy with a private vehicle: we stop whenever needed and split the kilometres into comfortable stages.',
        'Little ones love the camel ride, sandboarding on the dunes and sleeping in a tent in the Merzouga desert. We adapt accommodation and activities to each family’s ages.'
      ]
    },
    'viajes-de-lujo': {
      title: 'Luxury trips in Morocco',
      intro: 'Luxury trips with camps in the dunes, selected riads and private transfers: Morocco with maximum comfort.',
      body: [
        'For those seeking maximum comfort, we combine selected riads and hotels with luxury camps in the Erg Chebbi dunes.',
        'The trip is made in a private vehicle with a driver and can include exclusive experiences such as private dinners, balloon rides or personalised guided visits.'
      ]
    },
    'viajes-exclusivos': {
      title: 'Exclusive trips in Morocco',
      intro: 'Exclusive trips: private routes just for your group, with itinerary, accommodation and pace adapted to what you are looking for.',
      body: [
        'Each exclusive trip is designed from scratch for your group: you choose the dates, the pace, the accommodation and the stops.',
        'A trusted driver accompanies you throughout the route and we help you combine cities, mountains and the Merzouga desert in a single itinerary.'
      ]
    },
    'viajes-en-grupo': {
      title: 'Group trips in Morocco',
      intro: 'Group trips for friends, associations or companies, with a private vehicle and a price per person that drops the more of you there are.',
      body: [
        'We organise trips in Morocco for groups of friends, associations, schools and companies, with vehicles adapted to the number of travellers.',
        'The more people travel, the lower the price per person. We prepare the itinerary, accommodation and activities so the group only has to enjoy it.'
      ]
    },
    'paquetes': {
      title: 'Morocco travel packages',
      intro: 'Complete travel packages with transport, accommodation and activities included, ready to book or adapt to your dates.',
      body: [
        'Our packages include private transport, accommodation and the main activities of the itinerary, such as the night in the Merzouga desert.',
        'You can book them as they are or ask us to change the dates, accommodation or length to suit your trip.'
      ]
    },
    'actividades': {
      title: 'Experiences and activities for your trip',
      intro: 'Experiences and activities in Morocco to complete your trip: balloon rides, quads, camels, sandboarding and more.',
      body: [
        'Besides tours, we offer stand-alone experiences to complete your trip: quads and buggies in the Erg Chebbi dunes, sandboarding, camel rides and nights in a camp.',
        'In Marrakech you can add a sunrise balloon ride. All experiences can be booked separately or added to any route.'
      ]
    },
    'entrega-de-anillo': {
      title: 'Marriage proposal in the desert',
      intro: 'We organise a marriage proposal in the Merzouga dunes: sunset, decoration and a private dinner for an unforgettable moment.',
      body: [
        'Few things are more special than proposing on top of a dune at sunset. We prepare the spot with decoration, music and a private dinner in the Merzouga desert.',
        'We take care of the logistics and keep it all a surprise: you just have to bring the ring.'
      ]
    }
  },
  fr: {
    'desierto': {
      title: 'Voyages dans le désert de Merzouga',
      intro: 'Voyages privés dans le Sahara avec une nuit sous la tente dans les dunes de l’Erg Chebbi, une balade à dromadaire au coucher du soleil et le lever du soleil sur les dunes. Départs de Marrakech, Fès, Tanger ou Casablanca, avec chauffeur et véhicule rien que pour votre groupe.',
      body: [
        'Le désert de Merzouga est la vedette de nos voyages : les dunes de l’Erg Chebbi atteignent 150 mètres de haut et changent de couleur avec la lumière du jour. Notre base est à Hassi Labied, au pied des dunes, nous connaissons donc chaque recoin de la région.',
        'Un voyage dans le désert comprend généralement la balade à dromadaire jusqu’au campement, un dîner berbère, une nuit sous la tente à la belle étoile et le lever du soleil au sommet des dunes. Depuis Marrakech, on traverse le Haut Atlas, Ouarzazate et les vallées du Dadès et du Todra ; depuis Fès, on passe par Ifrane, la forêt de cèdres et la vallée du Ziz.'
      ]
    },
    'norte-de-marruecos': {
      title: 'Voyages dans le nord du Maroc',
      intro: 'Voyages à Tanger, Tétouan, Chefchaouen et dans les montagnes du Rif : des itinéraires dans le nord du Maroc, idéaux si vous arrivez en ferry depuis l’Espagne, qui peuvent se poursuivre vers Fès et le désert de Merzouga.',
      body: [
        'Le nord du Maroc est la porte d’entrée naturelle si vous voyagez en ferry depuis l’Espagne : Tanger est à une heure de Tarifa. De là, l’itinéraire continue par Tétouan et sa médina blanche jusqu’à Chefchaouen, la ville bleue des montagnes du Rif.',
        'Ces itinéraires peuvent se combiner avec Fès, Meknès et Volubilis, et se poursuivre vers le désert de Merzouga pour finir à Marrakech. Nous venons vous chercher au port ou à l’aéroport et vous voyagez en véhicule privé avec chauffeur.'
      ]
    },
    'ciudades-imperiales': {
      title: 'Itinéraires des villes impériales',
      intro: 'Marrakech, Fès, Meknès et Rabat : les quatre capitales historiques du Maroc en un seul itinéraire, avec du temps pour leurs médinas, souks, palais et médersas.',
      body: [
        'Les villes impériales sont les quatre anciennes capitales du Maroc. Fès conserve la plus grande médina médiévale du monde, Meknès ses remparts et ses portes monumentales, Rabat la tour Hassan et la kasbah des Oudayas, et Marrakech la place Jemaa el-Fna.',
        'Un itinéraire des villes impériales convient aux voyages d’une ou deux semaines et peut inclure une escapade dans le désert de Merzouga entre Fès et Marrakech.'
      ]
    },
    'aventura': {
      title: 'Voyages d’aventure au Maroc',
      intro: 'Voyages d’aventure au Maroc : quads et buggys dans les dunes, sandboard, randonnées à dromadaire et pistes de l’Atlas pour ceux qui cherchent plus que la visite des villes.',
      body: [
        'Pour les voyageurs les plus actifs, nous proposons des itinéraires en quad et buggy dans les dunes de l’Erg Chebbi, du sandboard au coucher du soleil et des randonnées à dromadaire jusqu’au campement.',
        'Vous pouvez aussi ajouter des randonnées dans les gorges du Todra ou les vallées du Haut Atlas. Toutes les activités sont réservées avec des guides locaux et adaptées au niveau de chaque groupe.'
      ]
    },
    'cultura': {
      title: 'Voyages culturels au Maroc',
      intro: 'Voyages culturels dans des médinas classées au patrimoine mondial, des kasbahs en pisé comme Aït Ben Haddou, des villages amazighs (berbères) et la vie quotidienne du Maroc racontée par des habitants.',
      body: [
        'Le Maroc est un pays de cultures mêlées : arabe, amazighe (berbère), andalouse et saharienne. Sur nos itinéraires culturels, nous visitons des médinas classées comme Fès et Marrakech, la kasbah d’Aït Ben Haddou et les villages de la vallée du Drâa.',
        'Près de Merzouga, vous rencontrerez des familles nomades et la musique gnaoua de Khamlia, toujours avec des guides et chauffeurs de la région qui vous expliquent leur histoire et leurs coutumes.'
      ]
    },
    'montana': {
      title: 'Itinéraires dans l’Atlas et la montagne',
      intro: 'Itinéraires par les cols du Haut Atlas, des vallées comme celle du Dadès et des gorges comme celles du Todra : des paysages de montagne sur la route du désert.',
      body: [
        'Le Haut Atlas sépare Marrakech du désert. Le col du Tizi n’Tichka, à plus de 2 200 mètres, offre certaines des vues les plus spectaculaires du pays, et de l’autre côté vous attendent Ouarzazate, la vallée des Roses et la vallée du Dadès.',
        'Les gorges du Todra, aux parois rocheuses de 300 mètres, sont une étape classique sur la route de Merzouga. Au nord, le Rif et le Moyen Atlas, avec les forêts de cèdres d’Azrou et d’Ifrane, complètent le Maroc des montagnes.'
      ]
    },
    'costa': {
      title: 'Voyages sur la côte marocaine',
      intro: 'Voyages à Essaouira, sur la côte atlantique et dans le nord méditerranéen pour combiner plage, poisson frais et médinas tranquilles avec le reste de votre itinéraire.',
      body: [
        'La côte marocaine associe l’Atlantique et la Méditerranée. Essaouira, avec son port de pêche et sa médina fortifiée, est l’escapade préférée depuis Marrakech ; Asilah et Tanger se distinguent au nord.',
        'Ajouter quelques jours de côte à votre itinéraire est une bonne façon de vous reposer après le désert ou les villes impériales.'
      ]
    },
    'luna-de-miel': {
      title: 'Lune de miel au Maroc',
      intro: 'Une lune de miel au Maroc avec des riads de charme, un dîner sous les étoiles dans le désert et un itinéraire privé à votre rythme, sur mesure.',
      body: [
        'Nous concevons des lunes de miel privées au Maroc : riads de charme à Marrakech et Fès, une nuit spéciale dans un campement du désert de Merzouga et le rythme que le couple préfère.',
        'Nous pouvons ajouter des attentions comme un dîner privé dans les dunes, un vol en montgolfière au lever du soleil ou une journée hammam. Dites-nous ce qui vous ferait plaisir et nous préparons l’itinéraire sur mesure.'
      ]
    },
    'viajes-en-familia': {
      title: 'Voyages en famille au Maroc',
      intro: 'Voyages en famille avec des étapes confortables, des arrêts fréquents et des activités pour les enfants comme la balade à dromadaire ou la nuit sous la tente dans le désert.',
      body: [
        'Voyager avec des enfants au Maroc est simple avec un véhicule privé : nous nous arrêtons quand il le faut et répartissons les kilomètres en étapes confortables.',
        'Les plus petits adorent la balade à dromadaire, le sandboard sur les dunes et dormir sous la tente dans le désert de Merzouga. Nous adaptons les hébergements et les activités à l’âge de chaque famille.'
      ]
    },
    'viajes-de-lujo': {
      title: 'Voyages de luxe au Maroc',
      intro: 'Voyages de luxe avec campements dans les dunes, riads sélectionnés et transferts privés : le Maroc avec un maximum de confort.',
      body: [
        'Pour ceux qui recherchent le plus grand confort, nous associons riads et hôtels sélectionnés à des campements de luxe dans les dunes de l’Erg Chebbi.',
        'Le voyage se fait en véhicule privé avec chauffeur et peut inclure des expériences exclusives comme des dîners privés, des vols en montgolfière ou des visites guidées personnalisées.'
      ]
    },
    'viajes-exclusivos': {
      title: 'Voyages exclusifs au Maroc',
      intro: 'Voyages exclusifs : itinéraires privés rien que pour votre groupe, avec itinéraire, hébergements et rythme adaptés à vos envies.',
      body: [
        'Chaque voyage exclusif est conçu de A à Z pour votre groupe : vous choisissez les dates, le rythme, les hébergements et les étapes.',
        'Un chauffeur de confiance vous accompagne tout au long de l’itinéraire et nous vous aidons à combiner villes, montagne et désert de Merzouga en un seul voyage.'
      ]
    },
    'viajes-en-grupo': {
      title: 'Voyages en groupe au Maroc',
      intro: 'Voyages en groupe pour amis, associations ou entreprises, avec véhicule privé et un prix par personne qui baisse plus vous êtes nombreux.',
      body: [
        'Nous organisons des voyages au Maroc pour des groupes d’amis, des associations, des écoles et des entreprises, avec des véhicules adaptés au nombre de voyageurs.',
        'Plus vous êtes nombreux, plus le prix par personne baisse. Nous préparons l’itinéraire, les hébergements et les activités pour que le groupe n’ait plus qu’à profiter.'
      ]
    },
    'paquetes': {
      title: 'Forfaits de voyage au Maroc',
      intro: 'Forfaits de voyage complets avec transport, hébergement et activités inclus, prêts à réserver ou à adapter à vos dates.',
      body: [
        'Nos forfaits comprennent le transport privé, l’hébergement et les principales activités de l’itinéraire, comme la nuit dans le désert de Merzouga.',
        'Vous pouvez les réserver tels quels ou nous demander de modifier les dates, les hébergements ou la durée pour les adapter à votre voyage.'
      ]
    },
    'actividades': {
      title: 'Expériences et activités pour votre voyage',
      intro: 'Expériences et activités au Maroc pour compléter votre voyage : montgolfière, quads, dromadaires, sandboard et bien plus.',
      body: [
        'En plus des circuits, nous proposons des expériences à la carte pour compléter votre voyage : quads et buggys dans les dunes de l’Erg Chebbi, sandboard, balades à dromadaire et nuits en campement.',
        'À Marrakech, vous pouvez ajouter un vol en montgolfière au lever du soleil. Toutes les expériences peuvent être réservées séparément ou ajoutées à n’importe quel itinéraire.'
      ]
    },
    'entrega-de-anillo': {
      title: 'Demande en mariage dans le désert',
      intro: 'Nous organisons une demande en mariage dans les dunes de Merzouga : coucher de soleil, décoration et dîner privé pour un moment inoubliable.',
      body: [
        'Peu de choses sont plus spéciales que de faire sa demande au sommet d’une dune au coucher du soleil. Nous préparons le lieu avec décoration, musique et dîner privé dans le désert de Merzouga.',
        'Nous nous occupons de la logistique et de garder la surprise : vous n’avez plus qu’à apporter la bague.'
      ]
    }
  }
};

/** Igual que collectionContent, pero en el idioma pedido. */
export function collectionContentI18n(slug, fallbackName, lang) {
  const base = collectionContent(slug, fallbackName);
  const tr = COLLECTIONS_I18N[lang]?.[slug];
  return tr ? { ...base, ...tr } : base;
}
