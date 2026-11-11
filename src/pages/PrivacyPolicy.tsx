import React from 'react';
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO title="Política de Privacidad | Marruecos Experiencia" description="Nuestra Política de Privacidad describe cómo recopilamos, usamos y protegemos sus datos personales." />
      <div className="max-w-4xl mx-auto px-4 py-20 bg-white/50 my-12 rounded-2xl">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Política de Privacidad</h1>
        
        <div className="prose prose-brand max-w-none text-gray-700">
          <p className="lead text-lg mb-6">
            La protección y seguridad de sus datos personales son importantes para nosotros. Esta política regula el tratamiento de sus datos de acuerdo con las normativas internacionales de protección de datos.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Responsable del Tratamiento</h2>
          <p className="mb-4">
            [Nombre de tu Empresa / Tu Nombre] es responsable del tratamiento de los datos personales recopilados a través del sitio web. Puede contactarnos en [Tu Email].
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Finalidad del Tratamiento de Datos</h2>
          <p className="mb-4">
            Los datos que nos facilite a través de los formularios de la web serán utilizados únicamente para:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Atender sus solicitudes de información y presupuestos.</li>
            <li>Gestionar la reserva de circuitos y actividades.</li>
            <li>Enviarle información comercial y ofertas si ha dado su consentimiento explícito.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Cesión a Terceros y Proveedores</h2>
          <p className="mb-4">
            No venderemos ni cederemos sus datos a terceros con fines comerciales ajenos. Sin embargo, para poder gestionar su solicitud y asegurar la operatividad web, dependemos de plataformas proveedoras tecnológicas (como servicios de hosting o bases de datos alojadas en la nube) que operan bajo los marcos legales de privacidad correspondientes al RGPD o acuerdos análogos de seguridad. Todas ellas actúan únicamente como "Encargados del Tratamiento".
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Conservación de los Datos</h2>
          <p className="mb-4">
            Los datos personales proporcionados se conservarán mientras se mantenga la relación comercial, o hasta que solicite su supresión.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Derechos de los Usuarios</h2>
          <p className="mb-4">
            Usted tiene derecho a obtener confirmación sobre si estamos tratando sus datos personales, por tanto tiene derecho a acceder a sus datos personales, rectificar los datos inexactos o solicitar su supresión cuando los datos ya no sean necesarios.
          </p>

          <div className="bg-brand-primary/5 p-6 rounded-xl mt-12 border border-brand-primary/10">
            <h3 className="font-bold text-gray-900 mb-2">Nota Importante</h3>
            <p className="text-sm">
              Este es un texto orientativo. Recuerda actualizarlo con los datos fiscales reales de tu empresa, el correo de contacto oficial y los plazos estipulados por tu asesoría legal.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
