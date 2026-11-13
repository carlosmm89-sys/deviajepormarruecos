// Verificación de Google Search Console (método «Archivo HTML») para https://www.vivirmarruecos.com/
// Se sirve como función (y no como archivo en /public) porque "cleanUrls" redirigiría
// /google8246ce4ddafaea89.html a /google8246ce4ddafaea89 y Google no aceptaría la verificación.
// NO BORRAR: Google comprueba este archivo periódicamente para mantener la verificación.
export default function handler(_req: any, res: any) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send('google-site-verification: google8246ce4ddafaea89.html');
}
