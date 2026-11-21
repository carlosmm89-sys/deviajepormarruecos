
const ALLOWED_ORIGINS = [
  'https://www.vivirmarruecos.com',
  'https://vivirmarruecos.com',
  'http://localhost:3000',
  'http://localhost:5173'
];

// Simple in-memory rate limiting per serverless instance (max 5 requests / 10 min per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function escapeHtml(str = ''): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req: any, res: any) {
  const origin = req.headers?.origin || '';
  if (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.vivirmarruecos.com');
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Rate limiting check
  const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').toString().split(',')[0].trim();
  const now = Date.now();
  const entry = rateLimitMap.get(clientIp);
  if (entry && now < entry.resetAt) {
    if (entry.count >= 5) {
      return res.status(429).json({ message: 'Demasiadas solicitudes. Por favor, inténtalo más tarde.' });
    }
    entry.count++;
  } else {
    rateLimitMap.set(clientIp, { count: 1, resetAt: now + 10 * 60 * 1000 });
  }

  const { lead, tour_title } = req.body || {};

  if (!lead || typeof lead !== 'object' || !lead.email || !lead.first_name) {
    return res.status(400).json({ message: 'Datos de formulario incompletos.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(lead.email)) || String(lead.first_name).length > 120 || String(lead.message || '').length > 5000) {
    return res.status(400).json({ message: 'Datos de contacto no válidos.' });
  }

  // El envío lo hace la función «send-email» de Supabase, que lee la contraseña SMTP con la clave de servicio
  // (la contraseña ya no es legible con la clave pública). Aquí solo se limita el abuso y se reenvía.
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ message: 'Falta configuración de Supabase.' });
  }
  try {
    const r = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: { apikey: supabaseKey, 'Content-Type': 'application/json', Origin: 'https://www.vivirmarruecos.com' },
      body: JSON.stringify({ lead, tour_title }),
    });
    const data = await r.json().catch(() => ({}));
    return res.status(r.status).json(data);
  } catch (error: any) {
    console.error('Error llamando a la función send-email:', error);
    return res.status(500).json({ message: 'Error interno enviando email' });
  }
}
