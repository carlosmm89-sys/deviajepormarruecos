import React from 'react';
import SEO from '../components/SEO';

export default function TermsConditions() {
  return (
    <>
      <SEO title="Términos y Condiciones | Vivir Marruecos" description="Términos de servicio comerciales y condiciones de reserva aplicables." />
      <div className="max-w-4xl mx-auto px-4 py-20 bg-white/50 my-12 rounded-2xl">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Términos y Condiciones de Uso y Reserva</h1>
        
        <div className="prose prose-brand max-w-none text-gray-700">
          <p className="lead text-lg mb-6">
            Las presentes condiciones regulan y son aplicables a todos los procesos de reserva, consultas y participación en los viajes planificados y operados por nuestra agencia.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Objeto del Servicio</h2>
          <p className="mb-4">
            Nuestra web facilita la exhibición de rutas turísticas, la realización de presupuestos personalizados y la contratación final de expediciones turísticas en el territorio marroquí.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Pagos, Anticipos y Confirmación</h2>
          <p className="mb-4">
            Para que una reserva se considere validada en firme, normalmente se solicitará un porcentaje de anticipo o depósito estipulado en la comunicación comercial o presupuesto que se le remita de forma privada. De lo contrario, los precios web son un "Desde" orientativo sujeto a disponibilidades en temporada y grupo.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Políticas de Cancelación y Reembolso</h2>
          <p className="mb-4">
            Las cancelaciones solicitadas con anterioridad a plazos específicos tendrán una recuperación parcial o total del anticipo en función del aviso (Ej. aviso &gt;30 días, etc.), excluyendo en todo caso los costes de transferencias bancarias internacionales u operacionales que ya hayan sido incurridos.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Obligaciones y Comportamiento del Cliente</h2>
          <p className="mb-4">
            Los clientes se comprometen a respetar las normas cívicas, acatar las instrucciones de los guías y cumplir con las normativas migratorias propias de acceso a Marruecos (pasaportes en vigor con &gt;6 meses de caducidad).
          </p>

          <div className="bg-brand-primary/5 p-6 rounded-xl mt-12 border border-brand-primary/10">
            <h3 className="font-bold text-gray-900 mb-2">Nota Importante</h3>
            <p className="text-sm">
              Estos términos y condiciones son un modelo básico. Deben revisarlo y ajustarlos para que contengan sus plazos de reembolso exactos y coberturas de seguro en base a su modelo de operaciones o franquicia.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
