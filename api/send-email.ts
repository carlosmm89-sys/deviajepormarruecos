import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

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

  // La configuración SMTP se lee SOLO en el servidor (nunca se acepta desde el navegador).
  // Usa la clave service_role si está configurada en Vercel; si no, la anon (comportamiento anterior).
  let settings: any = null;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    try {
      const sb = createClient(supabaseUrl, supabaseKey);
      const { data: dbSettings } = await sb.from('business_settings').select('*').limit(1).single();
      if (dbSettings && dbSettings.smtp_host) {
        settings = dbSettings;
      }
    } catch (e) {
      console.error('No se pudo leer la configuración SMTP de Supabase', e);
    }
  }

  if (!settings || !settings.smtp_host) {
    return res.status(400).json({ message: 'Falta configuración SMTP.' });
  }

  const safeName = escapeHtml(lead.first_name);
  const safeEmail = escapeHtml(lead.email);
  const safePhone = escapeHtml(lead.phone || 'No especificado');
  const safeDate = escapeHtml(lead.approximate_date || 'No especificado');
  const safePax = escapeHtml(String(lead.passengers_count || 1));
  const safeMessage = escapeHtml(lead.message || 'Sin mensaje adicional');
  const safeTourTitle = escapeHtml(tour_title || 'General');
  const safeFormType = escapeHtml(lead.form_type || 'web');

  try {
    const port = parseInt(settings.smtp_port || '587', 10);
    const transporter = nodemailer.createTransport({
      host: settings.smtp_host,
      port,
      secure: port === 465,
      auth: {
        user: settings.smtp_user,
        pass: settings.smtp_password,
      },
    });

    const adminMailOptions = {
      from: `"Vivir Marruecos Web" <${settings.smtp_from_email || settings.smtp_user}>`,
      to: [settings.admin_email, 'info@vivirmarruecos.com'].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(', '),
      replyTo: String(lead.email),
      subject: `Nueva Consulta Web: ${safeFormType} - ${safeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #E87B37; border-bottom: 2px solid #E87B37; padding-bottom: 10px;">Nueva Consulta Capturada</h2>
          <p>Se ha recibido una nueva consulta de <strong>${safeName}</strong> para: <strong style="color: #E87B37;">${safeTourTitle}</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            <p><strong>Teléfono:</strong> <a href="tel:${safePhone}">${safePhone}</a></p>
            <p><strong>Detalles:</strong> ${safeDate} - ${safePax} personas</p>
          </div>
          <p><strong>Mensaje del cliente:</strong></p>
          <div style="background: #fff; padding: 15px; border-left: 4px solid #E87B37; white-space: pre-wrap;">${safeMessage}</div>
          <br/>
          <p style="text-align: center;"><a href="https://www.vivirmarruecos.com/admin" style="background: #111827; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Acceder al CRM</a></p>
        </div>
      `,
    };

    const clientMailOptions = {
      from: `"Vivir Marruecos" <${settings.smtp_from_email || settings.smtp_user}>`,
      to: String(lead.email),
      subject: `¡Hemos recibido tu mensaje, ${safeName}! 🐪`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #111827; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px; text-transform: uppercase;">Vivir Marruecos</h1>
            <p style="color: #E87B37; margin: 5px 0 0 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">Aventuras Inolvidables</p>
          </div>
          <div style="padding: 40px; color: #4a4a4a; line-height: 1.6;">
            <h2 style="color: #111827; font-size: 22px; margin-top: 0;">¡Hola ${safeName}!</h2>
            <p>Muchas gracias por contactarnos. Hemos recibido correctamente tu solicitud de presupuesto y nos hace mucha ilusión que pienses en nosotros para tu próxima aventura.</p>
            <p>Nuestro equipo de expertos locales ya está revisando los detalles de tu viaje (${safePax} personas) y estamos trabajando para preparar la mejor propuesta posible.</p>
            
            <div style="background-color: #f7ede8; border-left: 4px solid #E87B37; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; color: #111827; font-weight: bold;">¿Qué ocurre ahora?</p>
              <p style="margin: 10px 0 0 0; font-size: 14px;">Pronto uno de nuestros asesores se pondrá en contacto contigo (normalmente en menos de 24 horas laborables) para enviarte toda la información o resolver tus dudas. ¡Estamos deseando hacer tus sueños realidad!</p>
            </div>

            <p>Si tienes alguna pregunta urgente, también puedes <a href="https://wa.me/${escapeHtml(settings.whatsapp_number?.replace(/\D/g, '') || '')}" style="color: #25D366; font-weight: bold; text-decoration: none;">escribirnos por WhatsApp</a>.</p>
            
            <p style="margin-top: 40px; margin-bottom: 0;">Con cariño,</p>
            <p style="font-weight: bold; color: #111827; margin-top: 5px;">El equipo de Vivir Marruecos</p>
          </div>
          <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eaeaea; font-size: 12px; color: #999;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Vivir Marruecos. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    };

    const [adminInfo] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions).catch(e => console.error('Error enviando autoresponder al cliente:', e))
    ]);

    return res.status(200).json({ success: true, messageId: adminInfo.messageId });
  } catch (error: any) {
    console.error('Error enviando email vía SMTP:', error);
    return res.status(500).json({ message: 'Error interno enviando email' });
  }
}
