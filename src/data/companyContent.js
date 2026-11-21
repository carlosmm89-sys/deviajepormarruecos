/**
 * Textos de «Quiénes somos» (/sobre-nosotros) y «Contacto» (/contacto) en español, inglés y francés.
 * Los usan las páginas de React y el pre-renderizado (prerender-seo.mjs).
 * Solo datos reales de la empresa: si cambia algo (horario, teléfono...), se cambia aquí.
 */

export const ABOUT_PATH = '/sobre-nosotros';
export const CONTACT_PATH = '/contacto';

export const COMPANY = {
  legalName: 'Vivirmarruecos SARL',
  brand: 'Vivir Marruecos',
  ice: '003986098000055',
  rc: '20961',
  address: 'Ksar Hassi Labied, Taouz, Rissani (Marruecos)',
  email: 'info@vivirmarruecos.com',
  whatsapp: '+34 604 48 82 23',
  since: 2015,
  mapQuery: 'Hassi Labied, Merzouga, Morocco'
};

const ABOUT = {
  es: {
    metaTitle: 'Quiénes somos: empresa local en Merzouga desde 2015 | Vivir Marruecos',
    description: 'Vivir Marruecos es una empresa local de Hassi Labied, a los pies de las dunas de Merzouga. Organizamos tours privados por Marruecos desde 2015.',
    h1: 'Quiénes somos',
    founder: {
      h2: 'Hola, soy Ali',
      caption: 'Ali, fundador de Vivir Marruecos',
      paragraphs: [
        'Nací en el desierto, entre las dunas de Merzouga, y el turismo forma parte de mi vida desde que era un niño: crecí acompañando a viajeros, enseñándoles el desierto y aprendiendo de cada uno de ellos.',
        'Después de muchos años trabajando en el turismo, decidí crear mi propia empresa familiar, Vivir Marruecos, para mejorar mi vida y la de mi familia y, sobre todo, para enseñar a quien nos visita lo bonito que es mi país y mi tierra.',
        'Cada viaje que organizamos lo preparo como si fuera para un amigo: con cariño, con calma y con las ganas de que te lleves Marruecos en el corazón.'
      ]
    },
    intro: 'Vivir Marruecos es una empresa local que organiza viajes a medida por todo Marruecos, con base en Hassi Labied, a los pies de las dunas de Erg Chebbi, en Merzouga. Desde 2015 organizamos viajes por Marruecos para viajeros de todo el mundo.',
    sections: [
      {
        h2: 'Una empresa local, en el desierto',
        paragraphs: [
          'Vivimos y trabajamos en Hassi Labied, el pueblo que está justo al lado de las dunas. Por eso conocemos el desierto de Merzouga, sus campamentos y sus caminos de primera mano, y organizamos el viaje nosotros mismos, sin intermediarios.',
          'Desde aquí preparamos rutas que salen de Marrakech, Fez, Tánger, Casablanca o Errachidia y que cruzan el Atlas, los valles y las gargantas hasta llegar al Sáhara.'
        ]
      },
      {
        h2: 'Cómo trabajamos',
        list: [
          'Tours privados: el vehículo y el conductor son solo para tu grupo, y adaptamos la ruta, el ritmo y el alojamiento a lo que buscas.',
          'La excursión de 3 días y el viaje de 5 días al desierto también se pueden hacer en grupo, compartiendo con otros viajeros.',
          'Nuestros conductores hablan español, inglés y francés.',
          'Todos nuestros vehículos tienen seguro.',
          'Te damos un presupuesto cerrado según las fechas y el número de viajeros, sin compromiso.'
        ]
      },
      {
        h2: 'Lo que dicen nuestros viajeros',
        paragraphs: [
          'Tenemos una valoración de 5,0 sobre 5 en Tripadvisor, con 105 opiniones, y el distintivo Travellers’ Choice 2026. Si ya has viajado con nosotros, nos ayuda mucho que dejes tu opinión en Google.'
        ]
      }
    ],
    companyH2: 'Datos de la empresa',
    labels: { legalName: 'Razón social', ice: 'ICE', rc: 'Registro de Comercio (RC)', address: 'Domicilio', email: 'Email', since: 'En activo desde' },
    sinceValue: 'mayo de 2015',
    ctaTitle: '¿Organizamos tu viaje?',
    ctaText: 'Cuéntanos fechas y número de viajeros y te preparamos un presupuesto a medida.',
    ctaTours: 'Ver tours',
    ctaContact: 'Contactar'
  },
  en: {
    metaTitle: 'About us: local company in Merzouga since 2015 | Vivir Marruecos',
    description: 'Vivir Marruecos is a local company from Hassi Labied, at the foot of the Merzouga dunes. We have organised private tours of Morocco since 2015.',
    h1: 'About us',
    founder: {
      h2: 'Hello, I’m Ali',
      caption: 'Ali, founder of Vivir Marruecos',
      paragraphs: [
        'I was born in the desert, among the dunes of Merzouga, and tourism has been part of my life since I was a child: I grew up accompanying travellers, showing them the desert and learning from each of them.',
        'After many years working in tourism, I decided to create my own family business, Vivir Marruecos, to build a better life for my family and, above all, to show everyone who visits us how beautiful my country and my homeland are.',
        'I plan every trip we organise as if it were for a friend: with care, without rushing, and hoping you take Morocco home in your heart.'
      ]
    },
    intro: 'Vivir Marruecos is a local company that organises tailor-made trips all over Morocco, based in Hassi Labied, at the foot of the Erg Chebbi dunes in Merzouga. Since 2015 we have organised trips around Morocco for travellers from all over the world.',
    sections: [
      {
        h2: 'A local company, in the desert',
        paragraphs: [
          'We live and work in Hassi Labied, the village right next to the dunes. That is why we know the Merzouga desert, its camps and its tracks first-hand, and we organise your trip ourselves, with no middlemen.',
          'From here we plan routes starting in Marrakech, Fez, Tangier, Casablanca or Errachidia, crossing the Atlas, the valleys and the gorges all the way to the Sahara.'
        ]
      },
      {
        h2: 'How we work',
        list: [
          'Private tours: the vehicle and driver are just for your group, and we adapt the route, pace and accommodation to what you are looking for.',
          'The 3-day trip and the 5-day desert trip can also be done as a group tour, shared with other travellers.',
          'Our drivers speak English, Spanish and French.',
          'All our vehicles are insured.',
          'We send you a fixed, no-obligation quote based on your dates and number of travellers.'
        ]
      },
      {
        h2: 'What our travellers say',
        paragraphs: [
          'We are rated 5.0 out of 5 on Tripadvisor, with 105 reviews, and hold the Travellers’ Choice 2026 award. If you have already travelled with us, leaving a review on Google helps us a lot.'
        ]
      }
    ],
    companyH2: 'Company details',
    labels: { legalName: 'Company name', ice: 'ICE', rc: 'Trade Register (RC)', address: 'Registered office', email: 'Email', since: 'Operating since' },
    sinceValue: 'May 2015',
    ctaTitle: 'Shall we plan your trip?',
    ctaText: 'Tell us your dates and number of travellers and we will prepare a tailor-made quote.',
    ctaTours: 'See tours',
    ctaContact: 'Contact us'
  },
  fr: {
    metaTitle: 'Qui sommes-nous : entreprise locale à Merzouga depuis 2015 | Vivir Marruecos',
    description: 'Vivir Marruecos est une entreprise locale de Hassi Labied, au pied des dunes de Merzouga. Nous organisons des circuits privés au Maroc depuis 2015.',
    h1: 'Qui sommes-nous',
    founder: {
      h2: 'Bonjour, je suis Ali',
      caption: 'Ali, fondateur de Vivir Marruecos',
      paragraphs: [
        'Je suis né dans le désert, au milieu des dunes de Merzouga, et le tourisme fait partie de ma vie depuis que je suis enfant : j’ai grandi en accompagnant des voyageurs, en leur faisant découvrir le désert et en apprenant de chacun d’eux.',
        'Après de nombreuses années dans le tourisme, j’ai décidé de créer ma propre entreprise familiale, Vivir Marruecos, pour améliorer ma vie et celle de ma famille et, surtout, pour montrer à ceux qui nous rendent visite à quel point mon pays et ma région sont beaux.',
        'Je prépare chaque voyage comme s’il était pour un ami : avec attention, sans précipitation et avec l’envie que vous rentriez avec le Maroc dans le cœur.'
      ]
    },
    intro: 'Vivir Marruecos est une entreprise locale qui organise des voyages sur mesure dans tout le Maroc, basée à Hassi Labied, au pied des dunes de l’Erg Chebbi, à Merzouga. Depuis 2015, nous organisons des voyages au Maroc pour des voyageurs du monde entier.',
    sections: [
      {
        h2: 'Une entreprise locale, dans le désert',
        paragraphs: [
          'Nous vivons et travaillons à Hassi Labied, le village juste à côté des dunes. C’est pourquoi nous connaissons de près le désert de Merzouga, ses campements et ses pistes, et nous organisons votre voyage nous-mêmes, sans intermédiaires.',
          'D’ici, nous préparons des itinéraires au départ de Marrakech, Fès, Tanger, Casablanca ou Errachidia, qui traversent l’Atlas, les vallées et les gorges jusqu’au Sahara.'
        ]
      },
      {
        h2: 'Notre façon de travailler',
        list: [
          'Circuits privés : le véhicule et le chauffeur sont réservés à votre groupe, et nous adaptons l’itinéraire, le rythme et l’hébergement à vos envies.',
          'L’excursion de 3 jours et le voyage de 5 jours dans le désert peuvent aussi se faire en groupe, avec d’autres voyageurs.',
          'Nos chauffeurs parlent français, anglais et espagnol.',
          'Tous nos véhicules sont assurés.',
          'Nous vous envoyons un devis ferme et sans engagement selon vos dates et le nombre de voyageurs.'
        ]
      },
      {
        h2: 'Ce que disent nos voyageurs',
        paragraphs: [
          'Nous avons une note de 5,0 sur 5 sur Tripadvisor, avec 105 avis, et le label Travellers’ Choice 2026. Si vous avez déjà voyagé avec nous, laisser un avis sur Google nous aide beaucoup.'
        ]
      }
    ],
    companyH2: 'Informations sur l’entreprise',
    labels: { legalName: 'Raison sociale', ice: 'ICE', rc: 'Registre du commerce (RC)', address: 'Siège', email: 'E-mail', since: 'En activité depuis' },
    sinceValue: 'mai 2015',
    ctaTitle: 'On organise votre voyage ?',
    ctaText: 'Indiquez-nous vos dates et le nombre de voyageurs et nous vous préparerons un devis sur mesure.',
    ctaTours: 'Voir les circuits',
    ctaContact: 'Nous contacter'
  }
};

const CONTACT = {
  es: {
    metaTitle: 'Contacto: WhatsApp, email y presupuesto | Vivir Marruecos',
    description: 'Contacta con Vivir Marruecos por WhatsApp o email para organizar tu viaje por Marruecos y el desierto de Merzouga. Presupuesto sin compromiso.',
    h1: 'Contacto',
    intro: 'Escríbenos para preguntar lo que necesites o pedir un presupuesto para tu viaje. Te respondemos lo antes posible.',
    whatsapp: 'WhatsApp',
    whatsappText: 'La forma más rápida de hablar con nosotros.',
    whatsappCta: 'Escribir por WhatsApp',
    whatsappMessage: '¡Hola! Me gustaría recibir información para planificar un viaje a Marruecos.',
    email: 'Email',
    emailText: 'Para consultas detalladas o enviarnos documentación.',
    quote: 'Presupuesto',
    quoteText: 'Responde unas preguntas rápidas y te preparamos una propuesta a medida.',
    quoteCta: 'Pedir presupuesto',
    hours: 'Horario de atención',
    hoursValue: 'Lunes a viernes, de 9:00 a 21:00 (hora de España). Sábados y domingos, cerrado.',
    address: 'Dónde estamos',
    addressValue: 'Ksar Hassi Labied, Merzouga (Taouz, Rissani), Marruecos',
    languages: 'Idiomas',
    languagesValue: 'Español, inglés y francés',
    mapTitle: 'Mapa de Hassi Labied, Merzouga',
    reviewsH2: '¿Ya has viajado con nosotros?',
    reviewsText: 'Tu opinión ayuda a otros viajeros a decidirse. Te lo agradecemos mucho.',
    reviewGoogle: 'Opinar en Google',
    reviewTripadvisor: 'Opinar en Tripadvisor'
  },
  en: {
    metaTitle: 'Contact: WhatsApp, email and quotes | Vivir Marruecos',
    description: 'Contact Vivir Marruecos on WhatsApp or by email to plan your trip to Morocco and the Merzouga desert. Free, no-obligation quote.',
    h1: 'Contact',
    intro: 'Write to us with any question or to ask for a quote for your trip. We will reply as soon as possible.',
    whatsapp: 'WhatsApp',
    whatsappText: 'The quickest way to talk to us.',
    whatsappCta: 'Write on WhatsApp',
    whatsappMessage: 'Hello! I would like information to plan a trip to Morocco.',
    email: 'Email',
    emailText: 'For detailed questions or to send us documents.',
    quote: 'Quote',
    quoteText: 'Answer a few quick questions and we will prepare a tailor-made proposal.',
    quoteCta: 'Request a quote',
    hours: 'Opening hours',
    hoursValue: 'Monday to Friday, 9:00 to 21:00 (Spanish time). Closed on Saturdays and Sundays.',
    address: 'Where we are',
    addressValue: 'Ksar Hassi Labied, Merzouga (Taouz, Rissani), Morocco',
    languages: 'Languages',
    languagesValue: 'English, Spanish and French',
    mapTitle: 'Map of Hassi Labied, Merzouga',
    reviewsH2: 'Have you travelled with us?',
    reviewsText: 'Your review helps other travellers decide. We really appreciate it.',
    reviewGoogle: 'Review us on Google',
    reviewTripadvisor: 'Review us on Tripadvisor'
  },
  fr: {
    metaTitle: 'Contact : WhatsApp, e-mail et devis | Vivir Marruecos',
    description: 'Contactez Vivir Marruecos par WhatsApp ou par e-mail pour organiser votre voyage au Maroc et dans le désert de Merzouga. Devis gratuit.',
    h1: 'Contact',
    intro: 'Écrivez-nous pour toute question ou pour demander un devis pour votre voyage. Nous vous répondons dès que possible.',
    whatsapp: 'WhatsApp',
    whatsappText: 'Le moyen le plus rapide de nous parler.',
    whatsappCta: 'Écrire sur WhatsApp',
    whatsappMessage: 'Bonjour ! J’aimerais recevoir des informations pour organiser un voyage au Maroc.',
    email: 'E-mail',
    emailText: 'Pour les demandes détaillées ou pour nous envoyer des documents.',
    quote: 'Devis',
    quoteText: 'Répondez à quelques questions rapides et nous vous préparerons une proposition sur mesure.',
    quoteCta: 'Demander un devis',
    hours: 'Horaires',
    hoursValue: 'Du lundi au vendredi, de 9h00 à 21h00 (heure d’Espagne). Fermé le samedi et le dimanche.',
    address: 'Où nous trouver',
    addressValue: 'Ksar Hassi Labied, Merzouga (Taouz, Rissani), Maroc',
    languages: 'Langues',
    languagesValue: 'Français, anglais et espagnol',
    mapTitle: 'Carte de Hassi Labied, Merzouga',
    reviewsH2: 'Vous avez voyagé avec nous ?',
    reviewsText: 'Votre avis aide d’autres voyageurs à se décider. Merci beaucoup.',
    reviewGoogle: 'Donner un avis sur Google',
    reviewTripadvisor: 'Donner un avis sur Tripadvisor'
  }
};

export function getAbout(lang) { return ABOUT[lang] || ABOUT.es; }
export function getContact(lang) { return CONTACT[lang] || CONTACT.es; }

/** Horario en formato schema.org (lunes a viernes, 9:00–21:00). */
export const OPENING_HOURS = [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '21:00' }];
