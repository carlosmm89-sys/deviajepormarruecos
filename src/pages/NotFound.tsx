import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-24">
      <Helmet>
        <title>Página no encontrada | Vivir Marruecos</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">Página no encontrada</h1>
      <p className="text-gray-600 mb-8">La página que buscas no existe o ha cambiado de dirección.</p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/" className="px-6 py-3 rounded-full bg-brand-primary text-white font-semibold">Ir al inicio</Link>
        <Link to="/tours" className="px-6 py-3 rounded-full border border-gray-300 font-semibold">Ver tours</Link>
      </div>
    </div>
  );
}
