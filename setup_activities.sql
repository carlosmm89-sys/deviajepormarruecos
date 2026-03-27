-- Ejecuta este script en el SQL Editor de Supabase para añadir automáticamente las 4 actividades

INSERT INTO blog_posts (slug, category, title, excerpt, content, cover_image, author, is_published)
VALUES 
(
  'sandboarding', 
  'Actividades', 
  'SANDBOARDING', 
  'Reserva un tour con visita en el corazón del desierto con nosotros y ten GRATIS esta increíble actividad.', 
  '<p>Reserva un tour con visita en el corazón del desierto con nosotros y ten GRATIS esta increíble actividad. Sandboarding es un deporte de mesa similar al snowboard.</p><p>Es una actividad recreativa y ocurre en las dunas de arena en lugar de montañas cubiertas de nieve. Este boardsport tiene adherentes en todo el mundo, más frecuente en zonas.</p>', 
  'https://images.unsplash.com/photo-1546955870-13f6df288f34?auto=format&fit=crop&q=80', 
  'Marruecos Experiencia', 
  true
),
(
  'cuatrimotos-o-buggies-en-el-desierto', 
  'Actividades', 
  'CUATRIMOTOS O BUGGIES EN EL DESIERTO', 
  '¿Te gustaría vivir la experiencia de subir a un quad o a un buggy en el Sahara?', 
  '<p>¿Te gustaría vivir la experiencia de subir a un quad o a un buggy en el Sahara?</p><p>Nuestro servicio de alquiler de quad y buggy en el Sahara ofrece rutas por las dunas del desierto de Merzouga.</p><p>Este tipo de ruta en quad por Marruecos, guiada por monitores profesionales, te llevará por paisajes de extraordinarios contrastes bajo el sol de justicia del desierto del Sahara.</p><p>Una divertidísima e inolvidable aventura en vehículos de alta gama, dotados de todas las medidas de seguridad para que se convierta en una experiencia sin sobresaltos, equipándote con cascos, cinturones y otras medidas de protección. Además, los guías profesionales que forman parte del servicio os harán disfrutar de la experiencia al 100%, respetando el entorno y el medio ambiente.</p>', 
  'https://images.unsplash.com/photo-1563855666710-91aee348f0b0?auto=format&fit=crop&q=80', 
  'Marruecos Experiencia', 
  true
),
(
  'noche-en-el-campamento', 
  'Actividades', 
  'NOCHE EN EL CAMPAMENTO', 
  'El campamento en el desierto del Sahara son mucho más que simples tiendas de tela. Son una parte muy importante en la vida de los nómadas.', 
  '<p>El campamento en el desierto del Sahara son mucho más que simples tiendas de tela. Son una parte muy importante en la vida de los nómadas, como comprenderás al ver la riqueza, belleza y funcionalidad de sus interiores. Los verás repletos de mantas, alfombras y cojines, que las convierten en un agradable espacio lleno de hospitalidad.</p><p>Además, para llegar a este campamento disfrutarás de un paseo en dromedario. Una forma de sentir y vivir el desierto en estado puro, donde también os prepararemos una cena típica bereber y un fantástico desayuno.</p><p>Durante la noche, tenemos una fiesta especial de tambores. Una experiencia cultural que junto con la magia del lugar, puede vivirse en cualquier momento del año.</p>', 
  'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80', 
  'Marruecos Experiencia', 
  true
),
(
  'paseo-en-globo', 
  'Actividades', 
  'PASEO EN GLOBO', 
  'Embárcate en una aventura mágica con un paseo en globo aerostático y descubre la impresionante belleza de Marrakech al amanecer.', 
  '<p>Embárcate en una aventura mágica con un paseo en globo aerostático y descubre la impresionante belleza de Marrakech al amanecer.</p>', 
  'https://images.unsplash.com/photo-1531012804729-7ab4446dde47?auto=format&fit=crop&q=80', 
  'Marruecos Experiencia', 
  true
);
