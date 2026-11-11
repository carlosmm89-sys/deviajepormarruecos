import React from 'react';
import SEO from '../components/SEO';

export default function LegalNotice() {
  return (
    <>
      <SEO title="Aviso Legal | Marruecos Experiencia" description="Aviso Legal y de cumplimiento normativo de la plataforma web." />
      <div className="max-w-4xl mx-auto px-4 py-20 bg-white/50 my-12 rounded-2xl">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Aviso Legal</h1>
        
        <div className="prose prose-brand max-w-none text-gray-700">
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Datos Identificativos</h2>
          <p className="mb-4">
            En cumplimiento con el deber de información recogido en las normativas vigentes sobre Servicios de la Sociedad de la Información y de Comercio Electrónico aplicables, reflejamos a continuación los siguientes datos corporativos:
          </p>
          <ul className="list-none pl-0 space-y-2 mb-6">
            <li><strong>Titular:</strong> [Tu Nombre o Razón Social]</li>
            <li><strong>NIF/CIF:</strong> [Tu Número de Identidad Fiscal]</li>
            <li><strong>Domicilio:</strong> [Dirección física de tu Agencia/Empresa]</li>
            <li><strong>Contacto:</strong> [Correo electrónico u otros medios de contacto]</li>
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

          <div className="bg-brand-primary/5 p-6 rounded-xl mt-12 border border-brand-primary/10">
            <h3 className="font-bold text-gray-900 mb-2">Nota Importante</h3>
            <p className="text-sm">
              Este es un texto orientativo inicial. Te recomendamos rellenarlo con los datos fiscales de tu sociedad registral y consultarlos con un experto legal de tu país/jurisdicción principal.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
