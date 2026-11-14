import React from 'react';
import SEO from '../components/SEO';
import { useTranslation } from '../hooks/useTranslation';

const h2 = 'text-2xl font-bold mt-8 mb-4';
const p = 'mb-4';

export default function TermsConditions() {
  const { tr } = useTranslation();

  const seo = tr({
    es: { title: 'Términos y Condiciones | Vivir Marruecos', desc: 'Términos de servicio comerciales y condiciones de reserva aplicables.' },
    en: { title: 'Terms and Conditions | Vivir Marruecos', desc: 'Commercial terms of service and applicable booking conditions.' },
    fr: { title: 'Conditions générales | Vivir Marruecos', desc: 'Conditions commerciales de service et conditions de réservation applicables.' },
  });

  const content = tr({
    es: (
      <>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Términos y Condiciones de Uso y Reserva</h1>
        <div className="prose prose-brand max-w-none text-gray-700">
          <p className="lead text-lg mb-6">
            Las presentes condiciones regulan y son aplicables a todos los procesos de reserva, consultas y participación en los viajes planificados y operados por nuestra agencia.
          </p>

          <h2 className={h2}>1. Objeto del Servicio</h2>
          <p className={p}>
            Nuestra web facilita la exhibición de rutas turísticas, la realización de presupuestos personalizados y la contratación final de expediciones turísticas en el territorio marroquí.
          </p>

          <h2 className={h2}>2. Pagos, Anticipos y Confirmación</h2>
          <p className={p}>
            Para que una reserva se considere validada en firme, normalmente se solicitará un porcentaje de anticipo o depósito estipulado en la comunicación comercial o presupuesto que se le remita de forma privada. De lo contrario, los precios web son un "Desde" orientativo sujeto a disponibilidades en temporada y grupo.
          </p>

          <h2 className={h2}>3. Políticas de Cancelación y Reembolso</h2>
          <p className={p}>
            Las cancelaciones solicitadas con anterioridad a plazos específicos tendrán una recuperación parcial o total del anticipo en función del aviso (Ej. aviso &gt;30 días, etc.), excluyendo en todo caso los costes de transferencias bancarias internacionales u operacionales que ya hayan sido incurridos.
          </p>

          <h2 className={h2}>4. Obligaciones y Comportamiento del Cliente</h2>
          <p className={p}>
            Los clientes se comprometen a respetar las normas cívicas, acatar las instrucciones de los guías y cumplir con las normativas migratorias propias de acceso a Marruecos (pasaportes en vigor con &gt;6 meses de caducidad).
          </p>

          <div className="bg-brand-primary/5 p-6 rounded-xl mt-12 border border-brand-primary/10">
            <h3 className="font-bold text-gray-900 mb-2">Nota Importante</h3>
            <p className="text-sm">
              Estos términos y condiciones son un modelo básico. Deben revisarlo y ajustarlos para que contengan sus plazos de reembolso exactos y coberturas de seguro en base a su modelo de operaciones o franquicia.
            </p>
          </div>
        </div>
      </>
    ),
    en: (
      <>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Terms and Conditions of Use and Booking</h1>
        <div className="prose prose-brand max-w-none text-gray-700">
          <p className="lead text-lg mb-6">
            These conditions govern and apply to all bookings, enquiries and participation in the trips planned and operated by our agency.
          </p>

          <h2 className={h2}>1. Purpose of the service</h2>
          <p className={p}>
            Our website presents tourist routes, provides personalised quotes and allows the final booking of tourist trips within Morocco.
          </p>

          <h2 className={h2}>2. Payments, deposits and confirmation</h2>
          <p className={p}>
            For a booking to be considered firmly confirmed, a deposit or advance payment will normally be requested, as set out in the commercial communication or quote sent to you privately. Otherwise, the prices on the website are an approximate "From" price, subject to availability depending on the season and group size.
          </p>

          <h2 className={h2}>3. Cancellation and refund policy</h2>
          <p className={p}>
            Cancellations requested before specific deadlines will receive a partial or full refund of the deposit depending on the notice given (e.g. more than 30 days' notice, etc.), excluding in all cases international bank transfer costs or operating costs already incurred.
          </p>

          <h2 className={h2}>4. Customer obligations and conduct</h2>
          <p className={p}>
            Customers undertake to respect civic rules, follow the instructions of the guides and comply with Morocco's entry requirements (a valid passport with more than 6 months' validity).
          </p>

          <div className="bg-brand-primary/5 p-6 rounded-xl mt-12 border border-brand-primary/10">
            <h3 className="font-bold text-gray-900 mb-2">Important note</h3>
            <p className="text-sm">
              These terms and conditions are a basic template. They should be reviewed and adjusted to include the exact refund deadlines and insurance cover according to the operating model or franchise.
            </p>
          </div>
        </div>
      </>
    ),
    fr: (
      <>
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Conditions générales d’utilisation et de réservation</h1>
        <div className="prose prose-brand max-w-none text-gray-700">
          <p className="lead text-lg mb-6">
            Les présentes conditions régissent et s’appliquent à toutes les réservations, demandes et participations aux voyages organisés et opérés par notre agence.
          </p>

          <h2 className={h2}>1. Objet du service</h2>
          <p className={p}>
            Notre site présente des itinéraires touristiques, permet d’obtenir des devis personnalisés et de réserver des voyages touristiques sur le territoire marocain.
          </p>

          <h2 className={h2}>2. Paiements, acomptes et confirmation</h2>
          <p className={p}>
            Pour qu’une réservation soit considérée comme ferme, un acompte ou un dépôt est normalement demandé, selon les modalités indiquées dans la communication commerciale ou le devis qui vous est envoyé personnellement. À défaut, les prix du site sont des prix indicatifs « À partir de », sous réserve de disponibilité selon la saison et la taille du groupe.
          </p>

          <h2 className={h2}>3. Conditions d’annulation et de remboursement</h2>
          <p className={p}>
            Les annulations demandées avant certains délais donnent droit à un remboursement partiel ou total de l’acompte selon le préavis (ex. préavis de plus de 30 jours, etc.), à l’exclusion dans tous les cas des frais de virement bancaire international ou des frais opérationnels déjà engagés.
          </p>

          <h2 className={h2}>4. Obligations et comportement du client</h2>
          <p className={p}>
            Les clients s’engagent à respecter les règles de civisme, à suivre les instructions des guides et à respecter les conditions d’entrée au Maroc (passeport en cours de validité, valable plus de 6 mois).
          </p>

          <div className="bg-brand-primary/5 p-6 rounded-xl mt-12 border border-brand-primary/10">
            <h3 className="font-bold text-gray-900 mb-2">Note importante</h3>
            <p className="text-sm">
              Ces conditions générales sont un modèle de base. Elles doivent être vérifiées et adaptées afin d’indiquer les délais de remboursement exacts et les garanties d’assurance selon le mode de fonctionnement ou la franchise.
            </p>
          </div>
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
