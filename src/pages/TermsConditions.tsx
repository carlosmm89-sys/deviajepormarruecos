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
            Las condiciones de cancelación y reembolso varían según la temporada, por eso se indican por escrito en el presupuesto de cada viaje antes de confirmar la reserva. En todo caso, no se reembolsan los gastos de transferencias bancarias internacionales ni los costes operativos en los que ya se haya incurrido.
          </p>

          <h2 className={h2}>4. Obligaciones y Comportamiento del Cliente</h2>
          <p className={p}>
            Los clientes se comprometen a respetar las normas cívicas, acatar las instrucciones de los guías y cumplir con las normativas migratorias propias de acceso a Marruecos (pasaportes en vigor con &gt;6 meses de caducidad).
          </p>
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
            Cancellation and refund conditions vary depending on the season, so they are set out in writing in the quote for each trip before the booking is confirmed. In all cases, international bank transfer fees and operating costs already incurred are non-refundable.
          </p>

          <h2 className={h2}>4. Customer obligations and conduct</h2>
          <p className={p}>
            Customers undertake to respect civic rules, follow the instructions of the guides and comply with Morocco's entry requirements (a valid passport with more than 6 months' validity).
          </p>
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
            Les conditions d’annulation et de remboursement varient selon la saison : elles sont donc indiquées par écrit dans le devis de chaque voyage, avant la confirmation de la réservation. Dans tous les cas, les frais de virement bancaire international et les frais opérationnels déjà engagés ne sont pas remboursables.
          </p>

          <h2 className={h2}>4. Obligations et comportement du client</h2>
          <p className={p}>
            Les clients s’engagent à respecter les règles de civisme, à suivre les instructions des guides et à respecter les conditions d’entrée au Maroc (passeport en cours de validité, valable plus de 6 mois).
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
