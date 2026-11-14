import React from 'react';
import SEO from '../components/SEO';
import { useTranslation } from '../hooks/useTranslation';

const h2 = 'text-2xl font-bold mt-8 mb-4';
const p = 'mb-4';
const ul = 'list-disc pl-6 mb-4 space-y-2';

export default function CookiesPolicy() {
  const { tr } = useTranslation();

  const seo = tr({
    es: { title: 'Política de Cookies | Vivir Marruecos', desc: 'Información detallada sobre el uso de cookies en nuestra plataforma online.' },
    en: { title: 'Cookie Policy | Vivir Marruecos', desc: 'Detailed information about the use of cookies on our website.' },
    fr: { title: 'Politique de cookies | Vivir Marruecos', desc: 'Informations détaillées sur l’utilisation des cookies sur notre site web.' },
  });

  const content = tr({
    es: (
      <>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Política de Cookies</h1>
        <div className="prose prose-brand max-w-none text-gray-700">
          <p className="lead text-lg mb-6">
            Esta web utiliza cookies propias y de terceros para conseguir que tengas una mejor experiencia de navegación, compartir contenido en redes sociales y para obtener estadísticas y métricas de nuestros usuarios.
          </p>

          <h2 className={h2}>1. ¿Qué es una cookie?</h2>
          <p className={p}>
            Una cookie es un fichero que se descarga en su dispositivo al acceder a determinadas páginas web. Permiten, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación y configuraciones, para poder brindar un servicio en línea más fluido y personalizado.
          </p>

          <h2 className={h2}>2. Cookies utilizadas en este sitio web</h2>
          <p className={p}>
            Siguiendo las directrices operativas detallamos el uso de cookies que hace esta web, agrupándolas en 4 categorías configurables en nuestro Banner Inferior:
          </p>
          <ul className={ul}>
            <li><strong>Obligatorias/Técnicas (Security Storage):</strong> Aquellas indispensables para el funcionamiento y seguridad de la página.</li>
            <li><strong>Estadísticas (Analytics Storage):</strong> Las que recogen datos del comportamiento de los usuarios (duración, clics) para medir y mejorar la web, normalmente provistas por Google Analytics.</li>
            <li><strong>Personalización (Personalization Storage):</strong> Recuerdan las opciones elegidas por el usuario, como el idioma o la divisa, ofreciendo un servicio más interactivo.</li>
            <li><strong>Marketing y Publicidad (Ad Storage/User Data):</strong> Gestionadas por plataformas publicitarias y redes sociales para mostrar anuncios relevantes según tu perfil, mediante Google Consent Mode.</li>
          </ul>

          <h2 className={h2}>3. Gestión dinámica por el Usuario</h2>
          <p className={p}>
            Siempre que quieras puedes revisar o cambiar tu configuración haciendo clic en el apartado <strong>"Configurar"</strong> desde el Banner Inferior si has borrado el historial de tu navegador. Si deseas suprimirlas totalmente a nivel de dispositivo, podrás hacerlo configurando los ajustes y bloqueos directamente desde tu navegador (Chrome, Safari, Firefox u otros).
          </p>
        </div>
      </>
    ),
    en: (
      <>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Cookie Policy</h1>
        <div className="prose prose-brand max-w-none text-gray-700">
          <p className="lead text-lg mb-6">
            This website uses its own and third-party cookies to give you a better browsing experience, to share content on social networks and to obtain statistics and metrics about our users.
          </p>

          <h2 className={h2}>1. What is a cookie?</h2>
          <p className={p}>
            A cookie is a file that is downloaded to your device when you visit certain web pages. Among other things, cookies make it possible to store and retrieve information about browsing habits and settings, in order to provide a smoother and more personalised online service.
          </p>

          <h2 className={h2}>2. Cookies used on this website</h2>
          <p className={p}>
            Below we describe the cookies this website uses, grouped into 4 categories that you can configure in the banner at the bottom of the page:
          </p>
          <ul className={ul}>
            <li><strong>Necessary / technical (Security Storage):</strong> those essential for the website to work and be secure.</li>
            <li><strong>Statistics (Analytics Storage):</strong> those that collect data on user behaviour (time spent, clicks) to measure and improve the website, usually provided by Google Analytics.</li>
            <li><strong>Personalisation (Personalization Storage):</strong> they remember the options chosen by the user, such as language or currency, to offer a more interactive service.</li>
            <li><strong>Marketing and advertising (Ad Storage / User Data):</strong> managed by advertising platforms and social networks to show relevant ads based on your profile, through Google Consent Mode.</li>
          </ul>

          <h2 className={h2}>3. Managing your cookies</h2>
          <p className={p}>
            You can review or change your settings at any time by clicking <strong>"Configure"</strong> in the banner at the bottom of the page if you have cleared your browser history. If you want to remove cookies completely from your device, you can do so by changing the settings and blocking options directly in your browser (Chrome, Safari, Firefox or others).
          </p>
        </div>
      </>
    ),
    fr: (
      <>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Politique de cookies</h1>
        <div className="prose prose-brand max-w-none text-gray-700">
          <p className="lead text-lg mb-6">
            Ce site utilise des cookies propres et tiers pour vous offrir une meilleure expérience de navigation, partager du contenu sur les réseaux sociaux et obtenir des statistiques et mesures sur nos utilisateurs.
          </p>

          <h2 className={h2}>1. Qu’est-ce qu’un cookie ?</h2>
          <p className={p}>
            Un cookie est un fichier téléchargé sur votre appareil lorsque vous consultez certaines pages web. Il permet notamment d’enregistrer et de retrouver des informations sur les habitudes de navigation et les préférences, afin d’offrir un service en ligne plus fluide et personnalisé.
          </p>

          <h2 className={h2}>2. Cookies utilisés sur ce site</h2>
          <p className={p}>
            Nous détaillons ci-dessous les cookies utilisés par ce site, regroupés en 4 catégories que vous pouvez configurer dans le bandeau en bas de page :
          </p>
          <ul className={ul}>
            <li><strong>Nécessaires / techniques (Security Storage) :</strong> ceux qui sont indispensables au fonctionnement et à la sécurité du site.</li>
            <li><strong>Statistiques (Analytics Storage) :</strong> ceux qui collectent des données sur le comportement des utilisateurs (durée, clics) pour mesurer et améliorer le site, généralement fournis par Google Analytics.</li>
            <li><strong>Personnalisation (Personalization Storage) :</strong> ils mémorisent les choix de l’utilisateur, comme la langue ou la devise, pour offrir un service plus interactif.</li>
            <li><strong>Marketing et publicité (Ad Storage / User Data) :</strong> gérés par des plateformes publicitaires et des réseaux sociaux pour afficher des annonces pertinentes selon votre profil, via Google Consent Mode.</li>
          </ul>

          <h2 className={h2}>3. Gestion de vos cookies</h2>
          <p className={p}>
            Vous pouvez à tout moment vérifier ou modifier vos réglages en cliquant sur <strong>« Configurer »</strong> dans le bandeau en bas de page si vous avez effacé l’historique de votre navigateur. Si vous souhaitez les supprimer complètement de votre appareil, vous pouvez le faire en modifiant les paramètres et les blocages directement dans votre navigateur (Chrome, Safari, Firefox ou autres).
          </p>
        </div>
      </>
    ),
  });

  return (
    <>
      <SEO title={seo.title} description={seo.desc} />
      <div className="max-w-4xl mx-auto px-4 py-20 bg-white/50 my-12 rounded-2xl">
        {content}
      </div>
    </>
  );
}
