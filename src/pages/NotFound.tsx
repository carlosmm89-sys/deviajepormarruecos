import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useTranslation } from '../hooks/useTranslation';
export default function NotFound() {
  const { tr, currentLanguage } = useTranslation();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-24">
      <Helmet>
        <title>{tr({ es: 'Página no encontrada | Vivir Marruecos', en: 'Page not found | Vivir Marruecos', fr: 'Page introuvable | Vivir Marruecos' })}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">{tr({ es: 'Página no encontrada', en: 'Page not found', fr: 'Page introuvable' })}</h1>
      <p className="text-gray-600 mb-8">{tr({ es: 'La página que buscas no existe o ha cambiado de dirección.', en: 'The page you are looking for does not exist or has moved.', fr: 'La page que vous cherchez n’existe pas ou a changé d’adresse.' })}</p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/" className="px-6 py-3 rounded-full bg-brand-primary text-white font-semibold">{tr({ es: 'Ir al inicio', en: 'Go to home', fr: 'Aller à l’accueil' })}</Link>
        <Link to="/tours" className="px-6 py-3 rounded-full border border-gray-300 font-semibold">{tr({ es: 'Ver tours', en: 'See tours', fr: 'Voir les circuits' })}</Link>
      </div>
    </div>
  );
}
