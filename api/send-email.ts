import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  // Configuro CORS por si acaso
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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

  const { lead, settings, tour_title } = req.body;

  if (!lead || !settings || !settings.smtp_host) {
    return res.status(400).json({ message: 'Faltan datos de envio o configuración SMTP.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: settings.smtp_host,
      port: parseInt(settings.smtp_port || '587', 10),
      secure: parseInt(settings.smtp_port || '587', 10) === 465, // true for 465, false for other ports
      auth: {
        user: settings.smtp_user,
        pass: settings.smtp_password,
      },
    });

    // Email for the Admin
    const adminMailOptions = {
      from: `"Vivir Marruecos Web" <${settings.smtp_from_email || settings.smtp_user}>`,
      to: settings.admin_email || 'info@vivirmarruecos.com',
      subject: `Nueva Consulta Web: ${lead.form_type} - ${lead.first_name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #E87B37; border-bottom: 2px solid #E87B37; padding-bottom: 10px;">Nueva Consulta Capturada</h2>
          <p>Se ha recibido una nueva consulta de <strong>${lead.first_name}</strong> para: <strong style="color: #E87B37;">${tour_title || 'General'}</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
            <p><strong>Teléfono:</strong> <a href="tel:${lead.phone}">${lead.phone || 'No especificado'}</a></p>
            <p><strong>Detalles:</strong> ${lead.approximate_date || 'No especificado'} - ${lead.passengers_count} personas</p>
          </div>
          <p><strong>Mensaje del cliente:</strong></p>
          <div style="background: #fff; padding: 15px; border-left: 4px solid #E87B37; white-space: pre-wrap;">${lead.message || 'Sin mensaje adicional'}</div>
          <br/>
          <p style="text-align: center;"><a href="https://vivirmarruecos.com/admin" style="background: #111827; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Acceder al CRM</a></p>
        </div>
      `,
    };

    // Autoresponder Email for the Client
    const clientMailOptions = {
      from: `"Vivir Marruecos" <${settings.smtp_from_email || settings.smtp_user}>`,
      to: lead.email,
      subject: `¡Hemos recibido tu mensaje, ${lead.first_name}! 🐪`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #111827; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px; text-transform: uppercase;">Vivir Marruecos</h1>
            <p style="color: #E87B37; margin: 5px 0 0 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">Aventuras Inolvidables</p>
          </div>
          <div style="padding: 40px; color: #4a4a4a; line-height: 1.6;">
            <h2 style="color: #111827; font-size: 22px; margin-top: 0;">¡Hola ${lead.first_name}!</h2>
            <p>Muchas gracias por contactarnos. Hemos recibido correctamente tu solicitud de presupuesto y nos hace mucha ilusión que pienses en nosotros para tu próxima aventura.</p>
            <p>Nuestro equipo de expertos locales ya está revisando los detalles de tu viaje (${lead.passengers_count} personas) y estamos trabajando para preparar la mejor propuesta posible.</p>
            
            <div style="background-color: #f7ede8; border-left: 4px solid #E87B37; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; color: #111827; font-weight: bold;">¿Qué ocurre ahora?</p>
              <p style="margin: 10px 0 0 0; font-size: 14px;">Pronto uno de nuestros asesores se pondrá en contacto contigo (normalmente en menos de 24 horas laborables) para enviarte toda la información o resolver tus dudas. ¡Estamos deseando hacer tus sueños realidad!</p>
            </div>

            <p>Si tienes alguna pregunta urgente, también puedes <a href="https://wa.me/${settings.whatsapp_number?.replace(/\D/g, '') || ''}" style="color: #25D366; font-weight: bold; text-decoration: none;">escribirnos por WhatsApp</a>.</p>
            
            <p style="margin-top: 40px; margin-bottom: 0;">Con cariño,</p>
            <p style="font-weight: bold; color: #111827; margin-top: 5px;">El equipo de Vivir Marruecos</p>
          </div>
          <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eaeaea; font-size: 12px; color: #999;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Vivir Marruecos. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    };

    // Send both in parallel
    const [adminInfo, clientInfo] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions).catch(e => console.error('Error enviando autoresponder al cliente:', e))
    ]);

    return res.status(200).json({ success: true, messageId: adminInfo.messageId });
  } catch (error: any) {
    console.error('Error enviando email vía SMTP:', error);
    return res.status(500).json({ message: 'Error interno enviando email', error: error.message });
  }
}
