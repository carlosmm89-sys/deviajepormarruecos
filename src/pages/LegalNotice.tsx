import React from 'react';
import SEO from '../components/SEO';
import { useTranslation } from '../hooks/useTranslation';

const h2 = 'text-2xl font-bold mt-8 mb-4';
const p = 'mb-4';

const Contact = () => <a href="mailto:info@vivirmarruecos.com">info@vivirmarruecos.com</a>;

export default function LegalNotice() {
  const { tr } = useTranslation();

  const seo = tr({
    es: { title: 'Aviso Legal | Vivir Marruecos', desc: 'Aviso legal de Vivir Marruecos: datos de Vivirmarruecos SARL (ICE y Registro de Comercio), domicilio en Hassi Labied, propiedad intelectual y responsabilidad.' },
    en: { title: 'Legal Notice | Vivir Marruecos', desc: 'Legal notice and regulatory information for this website.' },
    fr: { title: 'Mentions légales | Vivir Marruecos', desc: 'Mentions légales et informations réglementaires de ce site web.' },
  });

  const content = tr({
    es: (
      <>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Aviso Legal</h1>
        <div className="prose prose-brand max-w-none text-gray-700">
          <h2 className={h2}>1. Datos Identificativos</h2>
          <p className={p}>
            En cumplimiento con el deber de información recogido en las normativas vigentes sobre Servicios de la Sociedad de la Información y de Comercio Electrónico aplicables, reflejamos a continuación los siguientes datos corporativos:
          </p>
          <ul className="list-none pl-0 space-y-2 mb-6">
            <li><strong>Titular:</strong> Vivirmarruecos SARL (marca comercial: Vivir Marruecos)</li>
            <li><strong>ICE:</strong> 003986098000055 · <strong>Registro de Comercio (RC):</strong> 20961</li>
            <li><strong>Domicilio social:</strong> Ksar Hassi Labied, Taouz, Rissani (Marruecos)</li>
            <li><strong>Contacto:</strong> <Contact /></li>
          </ul>

          <h2 className={h2}>2. Propiedad Intelectual e Industrial</h2>
          <p className={p}>
            Los derechos de propiedad intelectual de la página web, su código fuente, diseño, estructura de navegación, bases de datos y los distintos elementos en ella contenidos son titularidad exclusiva de la Empresa.
          </p>
          <p className={p}>
            Cualquier uso, reproducción, distribución, comunicación pública o transformación no autorizada queda terminantemente prohibida.
          </p>

          <h2 className={h2}>3. Exclusión de Responsabilidad</h2>
          <p className={p}>
            No nos hacemos responsables de los errores en los contenidos proporcionados ni de la falta de disponibilidad del portal, actuando estas páginas como un servicio informativo y comercial. Asimismo, no garantizamos la invulnerabilidad frente a agentes maliciosos externos, aunque empleamos las mejores medidas razonables para prevenirlos.
          </p>
        </div>
      </>
    ),
    en: (
      <>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Legal Notice</h1>
        <div className="prose prose-brand max-w-none text-gray-700">
          <h2 className={h2}>1. Company details</h2>
          <p className={p}>
            In compliance with the duty of information set out in the applicable regulations on Information Society Services and Electronic Commerce, we provide the following company details:
          </p>
          <ul className="list-none pl-0 space-y-2 mb-6">
            <li><strong>Owner:</strong> Vivirmarruecos SARL (trade name: Vivir Marruecos)</li>
            <li><strong>ICE (company ID):</strong> 003986098000055 · <strong>Trade Register (RC):</strong> 20961</li>
            <li><strong>Registered office:</strong> Ksar Hassi Labied, Taouz, Rissani (Morocco)</li>
            <li><strong>Contact:</strong> <Contact /></li>
          </ul>

          <h2 className={h2}>2. Intellectual and industrial property</h2>
          <p className={p}>
            The intellectual property rights to this website, its source code, design, navigation structure, databases and the various elements it contains belong exclusively to the Company.
          </p>
          <p className={p}>
            Any unauthorised use, reproduction, distribution, public communication or modification is strictly prohibited.
          </p>

          <h2 className={h2}>3. Disclaimer</h2>
          <p className={p}>
            We are not responsible for errors in the content provided or for the website being unavailable, as these pages are an informational and commercial service. Likewise, we cannot guarantee protection against malicious external agents, although we use the best reasonable measures to prevent them.
          </p>
        </div>
      </>
    ),
    fr: (
      <>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Mentions légales</h1>
        <div className="prose prose-brand max-w-none text-gray-700">
          <h2 className={h2}>1. Identification de l’entreprise</h2>
          <p className={p}>
            Conformément à l’obligation d’information prévue par la réglementation applicable aux services de la société de l’information et au commerce électronique, nous indiquons ci-dessous les informations relatives à l’entreprise :
          </p>
          <ul className="list-none pl-0 space-y-2 mb-6">
            <li><strong>Titulaire :</strong> Vivirmarruecos SARL (nom commercial : Vivir Marruecos)</li>
            <li><strong>ICE :</strong> 003986098000055 · <strong>Registre du commerce (RC) :</strong> 20961</li>
            <li><strong>Siège social :</strong> Ksar Hassi Labied, Taouz, Rissani (Maroc)</li>
            <li><strong>Contact :</strong> <Contact /></li>
          </ul>

          <h2 className={h2}>2. Propriété intellectuelle et industrielle</h2>
          <p className={p}>
            Les droits de propriété intellectuelle sur ce site web, son code source, sa conception, sa structure de navigation, ses bases de données et les différents éléments qu’il contient appartiennent exclusivement à l’Entreprise.
          </p>
          <p className={p}>
            Toute utilisation, reproduction, distribution, communication au public ou transformation non autorisée est strictement interdite.
          </p>

          <h2 className={h2}>3. Limitation de responsabilité</h2>
          <p className={p}>
            Nous ne sommes pas responsables des erreurs dans les contenus fournis ni de l’indisponibilité du site, ces pages constituant un service d’information et commercial. De même, nous ne pouvons garantir une protection totale contre les agents malveillants externes, bien que nous mettions en œuvre les meilleures mesures raisonnables pour les prévenir.
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
