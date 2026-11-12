import React from 'react';
import SEO from '../components/SEO';

export default function CookiesPolicy() {
  return (
    <>
      <SEO title="Política de Cookies | Vivir Marruecos" description="Información detallada sobre el uso de cookies en nuestra plataforma online." />
      <div className="max-w-4xl mx-auto px-4 py-20 bg-white/50 my-12 rounded-2xl">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Política de Cookies</h1>
        
        <div className="prose prose-brand max-w-none text-gray-700">
          <p className="lead text-lg mb-6">
            Esta web utiliza cookies propias y de terceros para conseguir que tengas una mejor experiencia de navegación, compartir contenido en redes sociales y para obtener estadísticas y métricas de nuestros usuarios.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. ¿Qué es una cookie?</h2>
          <p className="mb-4">
            Una cookie es un fichero que se descarga en su dispositivo al acceder a determinadas páginas web. Permiten, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación y configuraciones, para poder brindar un servicio en línea más fluido y personalizado.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Cookies utilizadas en este sitio web</h2>
          <p className="mb-4">
            Siguiendo las directrices operativas detallamos el uso de cookies que hace esta web, agrupándolas en 4 categorías configurables en nuestro Banner Inferior:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Obligatorias/Técnicas (Security Storage):</strong> Aquellas indispensables para el funcionamiento y seguridad de la página.</li>
            <li><strong>Estadísticas (Analytics Storage):</strong> Las que recogen datos del comportamiento de los usuarios (duración, clics) para medir y mejorar la web, normalmente provistas por Google Analytics.</li>
            <li><strong>Personalización (Personalization Storage):</strong> Recuerdan las opciones elegidas por el usuario, como el idioma o la divisa, ofreciendo un servicio más interactivo.</li>
            <li><strong>Marketing y Publicidad (Ad Storage/User Data):</strong> Gestionadas por plataformas publicitarias y redes sociales para mostrar anuncios relevantes según tu perfil, mediante Google Consent Mode.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Gestión dinámica por el Usuario</h2>
          <p className="mb-4">
            Siempre que quieras puedes revisar o cambiar tu configuración haciendo clic en el apartado <strong>"Configurar"</strong> desde el Banner Inferior si has borrado el historial de tu navegador. Si deseas suprimirlas totalmente a nivel de dispositivo, podrás hacerlo configurando los ajustes y bloqueos directamente desde tu navegador (Chrome, Safari, Firefox u otros).
          </p>
        </div>
      </div>
    </>
  );
}
