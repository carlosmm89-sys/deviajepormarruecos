import React from 'react';
import SEO from '../components/SEO';

export default function LegalNotice() {
  return (
    <>
      <SEO title="Aviso Legal | Vivir Marruecos" description="Aviso Legal y de cumplimiento normativo de la plataforma web." />
      <div className="max-w-4xl mx-auto px-4 py-20 bg-white/50 my-12 rounded-2xl">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Aviso Legal</h1>
        
        <div className="prose prose-brand max-w-none text-gray-700">
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Datos Identificativos</h2>
          <p className="mb-4">
            En cumplimiento con el deber de información recogido en las normativas vigentes sobre Servicios de la Sociedad de la Información y de Comercio Electrónico aplicables, reflejamos a continuación los siguientes datos corporativos:
          </p>
          <ul className="list-none pl-0 space-y-2 mb-6">
            <li><strong>Titular:</strong> Vivirmarruecos SARL (marca comercial: Vivir Marruecos)</li>
            <li><strong>ICE:</strong> 003986098000055 · <strong>Registro de Comercio (RC):</strong> 20961</li>
            <li><strong>Domicilio social:</strong> Ksar Hassi Labied, Taouz, Rissani (Marruecos)</li>
            <li><strong>Contacto:</strong> <a href="mailto:info@vivirmarruecos.com">info@vivirmarruecos.com</a></li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Propiedad Intelectual e Industrial</h2>
          <p className="mb-4">
            Los derechos de propiedad intelectual de la página web, su código fuente, diseño, estructura de navegación, bases de datos y los distintos elementos en ella contenidos son titularidad exclusiva de la Empresa.
          </p>
          <p className="mb-4">
            Cualquier uso, reproducción, distribución, comunicación pública o transformación no autorizada queda terminantemente prohibida.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Exclusión de Responsabilidad</h2>
          <p className="mb-4">
            No nos hacemos responsables de los errores en los contenidos proporcionados ni de la falta de disponibilidad del portal, actuando estas páginas como un servicio informativo y comercial. Asimismo, no garantizamos la invulnerabilidad frente a agentes maliciosos externos, aunque empleamos las mejores medidas razonables para prevenirlos.
          </p>
        </div>
      </div>
    </>
  );
}
