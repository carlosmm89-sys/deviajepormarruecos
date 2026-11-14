import React from 'react';
import SEO from '../components/SEO';
import { useTranslation } from '../hooks/useTranslation';

const h2 = 'text-2xl font-bold mt-8 mb-4';
const p = 'mb-4';
const ul = 'list-disc pl-6 mb-4 space-y-2';

const Contact = () => <a href="mailto:info@vivirmarruecos.com">info@vivirmarruecos.com</a>;

export default function PrivacyPolicy() {
  const { tr } = useTranslation();

  const seo = tr({
    es: { title: 'Política de Privacidad | Vivir Marruecos', desc: 'Cómo trata Vivirmarruecos SARL (Vivir Marruecos) tus datos personales: responsable, finalidad, proveedores, conservación y tus derechos.' },
    en: { title: 'Privacy Policy | Vivir Marruecos', desc: 'Our Privacy Policy describes how we collect, use and protect your personal data.' },
    fr: { title: 'Politique de confidentialité | Vivir Marruecos', desc: 'Notre politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles.' },
  });

  const content = tr({
    es: (
      <>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Política de Privacidad</h1>
        <div className="prose prose-brand max-w-none text-gray-700">
          <p className="lead text-lg mb-6">
            La protección y seguridad de sus datos personales son importantes para nosotros. Esta política regula el tratamiento de sus datos de acuerdo con las normativas internacionales de protección de datos.
          </p>

          <h2 className={h2}>1. Responsable del Tratamiento</h2>
          <p className={p}>
            Vivirmarruecos SARL (Vivir Marruecos), con domicilio en Ksar Hassi Labied, Taouz, Rissani (Marruecos), es responsable del tratamiento de los datos personales recopilados a través del sitio web. Puede contactarnos en <Contact />.
          </p>

          <h2 className={h2}>2. Finalidad del Tratamiento de Datos</h2>
          <p className={p}>
            Los datos que nos facilite a través de los formularios de la web serán utilizados únicamente para:
          </p>
          <ul className={ul}>
            <li>Atender sus solicitudes de información y presupuestos.</li>
            <li>Gestionar la reserva de circuitos y actividades.</li>
            <li>Enviarle información comercial y ofertas si ha dado su consentimiento explícito.</li>
          </ul>

          <h2 className={h2}>3. Cesión a Terceros y Proveedores</h2>
          <p className={p}>
            No venderemos ni cederemos sus datos a terceros con fines comerciales ajenos. Sin embargo, para poder gestionar su solicitud y asegurar la operatividad web, dependemos de plataformas proveedoras tecnológicas (como servicios de hosting o bases de datos alojadas en la nube) que operan bajo los marcos legales de privacidad correspondientes al RGPD o acuerdos análogos de seguridad. Todas ellas actúan únicamente como "Encargados del Tratamiento".
          </p>

          <h2 className={h2}>4. Conservación de los Datos</h2>
          <p className={p}>
            Los datos personales proporcionados se conservarán mientras se mantenga la relación comercial, o hasta que solicite su supresión.
          </p>

          <h2 className={h2}>5. Derechos de los Usuarios</h2>
          <p className={p}>
            Usted tiene derecho a obtener confirmación sobre si estamos tratando sus datos personales, por tanto tiene derecho a acceder a sus datos personales, rectificar los datos inexactos o solicitar su supresión cuando los datos ya no sean necesarios.
          </p>
        </div>
      </>
    ),
    en: (
      <>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-brand max-w-none text-gray-700">
          <p className="lead text-lg mb-6">
            The protection and security of your personal data are important to us. This policy governs how we process your data in accordance with international data protection regulations.
          </p>

          <h2 className={h2}>1. Data controller</h2>
          <p className={p}>
            Vivirmarruecos SARL (Vivir Marruecos), with its registered office at Ksar Hassi Labied, Taouz, Rissani (Morocco), is the controller of the personal data collected through this website. You can contact us at <Contact />.
          </p>

          <h2 className={h2}>2. Purpose of data processing</h2>
          <p className={p}>
            The data you provide through the forms on this website will only be used to:
          </p>
          <ul className={ul}>
            <li>Respond to your requests for information and quotes.</li>
            <li>Manage bookings of tours and activities.</li>
            <li>Send you commercial information and offers if you have given your explicit consent.</li>
          </ul>

          <h2 className={h2}>3. Disclosure to third parties and providers</h2>
          <p className={p}>
            We will not sell or pass on your data to third parties for their own commercial purposes. However, to manage your request and keep the website running, we rely on technology providers (such as hosting services or cloud databases) that operate under the legal privacy frameworks of the GDPR or equivalent security agreements. All of them act solely as "data processors".
          </p>

          <h2 className={h2}>4. Data retention</h2>
          <p className={p}>
            The personal data provided will be kept for as long as the commercial relationship lasts, or until you request its deletion.
          </p>

          <h2 className={h2}>5. Your rights</h2>
          <p className={p}>
            You have the right to obtain confirmation of whether we are processing your personal data and, accordingly, the right to access your personal data, correct inaccurate data or request its deletion when it is no longer needed.
          </p>
        </div>
      </>
    ),
    fr: (
      <>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Politique de confidentialité</h1>
        <div className="prose prose-brand max-w-none text-gray-700">
          <p className="lead text-lg mb-6">
            La protection et la sécurité de vos données personnelles sont importantes pour nous. Cette politique encadre le traitement de vos données conformément aux réglementations internationales sur la protection des données.
          </p>

          <h2 className={h2}>1. Responsable du traitement</h2>
          <p className={p}>
            Vivirmarruecos SARL (Vivir Marruecos), dont le siège social se trouve à Ksar Hassi Labied, Taouz, Rissani (Maroc), est responsable du traitement des données personnelles collectées sur ce site web. Vous pouvez nous contacter à <Contact />.
          </p>

          <h2 className={h2}>2. Finalité du traitement des données</h2>
          <p className={p}>
            Les données que vous nous communiquez via les formulaires du site seront utilisées uniquement pour :
          </p>
          <ul className={ul}>
            <li>Répondre à vos demandes d’information et de devis.</li>
            <li>Gérer la réservation de circuits et d’activités.</li>
            <li>Vous envoyer des informations commerciales et des offres si vous y avez expressément consenti.</li>
          </ul>

          <h2 className={h2}>3. Communication à des tiers et prestataires</h2>
          <p className={p}>
            Nous ne vendrons ni ne céderons vos données à des tiers à des fins commerciales qui leur sont propres. Toutefois, pour traiter votre demande et assurer le fonctionnement du site, nous faisons appel à des prestataires technologiques (comme des services d’hébergement ou des bases de données dans le cloud) qui opèrent dans le cadre juridique du RGPD ou d’accords de sécurité équivalents. Tous agissent uniquement en tant que « sous-traitants ».
          </p>

          <h2 className={h2}>4. Conservation des données</h2>
          <p className={p}>
            Les données personnelles fournies seront conservées tant que dure la relation commerciale, ou jusqu’à ce que vous demandiez leur suppression.
          </p>

          <h2 className={h2}>5. Droits des utilisateurs</h2>
          <p className={p}>
            Vous avez le droit d’obtenir la confirmation que nous traitons ou non vos données personnelles et, par conséquent, le droit d’y accéder, de rectifier les données inexactes ou de demander leur suppression lorsqu’elles ne sont plus nécessaires.
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
